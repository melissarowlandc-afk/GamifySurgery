/** Explicit-import, unapproved authoring data. No private feedback identifiers or player data. */
export const QUESTION_FLAGS5_DATA = {
  "revisions": [
    {
      "id": "QF5-01",
      "oldQuestionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.r1",
      "caseId": "case.gs028.varicose-veins.paired-aching-standing",
      "nodeId": "node.gs028.varicose-veins.paired-aching-standing.2",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.r1",
        "conceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
        "patientPresentationVariantId": "presentation.gs028.varicose-veins.paired-aching-standing.flags5r1",
        "patientPresentation": "{patientName}, a 43-year-old woman, attends the clinic for calf aching and prominent veins after standing at work.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028.varicose-veins.paired-aching-standing.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman, attends the clinic for calf aching and prominent veins after standing at work."
          },
          {
            "id": "profile.gs028.varicose-veins.paired-aching-standing.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man, attends the clinic for calf aching and prominent veins after standing at work."
          },
          {
            "id": "profile.gs028.varicose-veins.paired-aching-standing.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman, attends the clinic for calf aching and prominent veins after standing at work."
          },
          {
            "id": "profile.gs028.varicose-veins.paired-aching-standing.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man, attends the clinic for calf aching and prominent veins after standing at work."
          }
        ],
        "reachedCurrentUpdate": "Reflux duplex documents great-saphenous axial reflux. The venous clinic records suitability for intervention. {patientName} has tried leg elevation, remains limited at work, and wishes to discuss a procedure after reviewing the alternatives.",
        "stem": "Which plan should be offered for {patientName}'s symptomatic varicose veins?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "Refer to the vascular surgery clinic",
            "isCorrect": true,
            "rationale": "The duplex demonstrates truncal reflux; persistent symptoms and an informed treatment preference support venous-service referral. The specialist selects the technique.",
            "distractorRationale": null
          },
          {
            "id": "d1_1",
            "label": "Prescribe graduated compression stockings before referral",
            "isCorrect": false,
            "rationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
            "distractorRationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate."
          },
          {
            "id": "d2_1",
            "label": "Arrange ultrasound-guided tributary sclerotherapy",
            "isCorrect": false,
            "rationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
            "distractorRationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment."
          }
        ],
        "explanation": "Refer to the venous service for truncal-intervention planning. Symptomatic axial reflux and an informed treatment preference support referral without a compulsory prolonged compression course. Compression remains an option; the exact technique follows specialist anatomy review.",
        "supportingEvidenceClaimIds": [
          "claim.varicose.intervention-referral",
          "claim.varicose.conservative-boundary",
          "claim.flags5.20261116.application.01"
        ]
      },
      "flagOrdinals": [
        3
      ],
      "title": "Symptomatic axial reflux: intervention versus a compulsory compression course",
      "inference": "Interpret the duplex as axial reflux, then distinguish a reasonable conservative option from a mandatory prerequisite to intervention.",
      "decidingObservation": "Persistent work-limiting symptoms with documented axial reflux and an informed choice to consider intervention.",
      "counterfactual": "If symptoms were acceptable and the patient preferred to avoid intervention, compression-based care would be reasonable.",
      "limitation": "The source supports referral, not a universal ablation modality or an exact compression duration. Procedural anatomy remains specialist review.",
      "basisClaimIds": [
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.01",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-02",
      "oldQuestionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r1",
      "caseId": "case.gs028.varicose-veins.b-prefers-conservative",
      "nodeId": "node.gs028.varicose-veins.b-prefers-conservative.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r1",
        "conceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
        "patientPresentationVariantId": "presentation.gs028.varicose-veins.b-prefers-conservative.flags5r1",
        "patientPresentation": "{patientName}, a 43-year-old woman, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
          },
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
          },
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
          },
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
          }
        ],
        "stem": "Which plan should be offered for {patientName}'s varicose-vein symptoms?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "Prescribe graduated compression stockings",
            "isCorrect": true,
            "rationale": "A concrete conservative treatment fits the informed decision to avoid a procedure. No universal garment strength or treatment duration is specified.",
            "distractorRationale": null
          },
          {
            "id": "d1_3",
            "label": "Refer for endovenous truncal-ablation planning",
            "isCorrect": false,
            "rationale": "Ablation is an intervention pathway; documented reflux does not override a capable patient's informed refusal.",
            "distractorRationale": "Ablation is an intervention pathway; documented reflux does not override a capable patient's informed refusal."
          },
          {
            "id": "d2_3",
            "label": "Arrange ultrasound-guided tributary sclerotherapy",
            "isCorrect": false,
            "rationale": "Sclerotherapy remains a procedure and does not implement the stated preference for nonprocedural symptom care.",
            "distractorRationale": "Sclerotherapy remains a procedure and does not implement the stated preference for nonprocedural symptom care."
          }
        ],
        "explanation": "Offer graduated compression as a specific conservative option. Axial reflux does not make intervention compulsory when symptoms and informed preference support conservative care. Both ablation planning and sclerotherapy pursue a procedural pathway.",
        "supportingEvidenceClaimIds": [
          "claim.varicose.conservative-boundary",
          "claim.flags5.20261116.application.02"
        ]
      },
      "flagOrdinals": [
        3
      ],
      "title": "A specific conservative plan for symptomatic axial reflux",
      "inference": "Combine the anatomical reflux result with the informed treatment choice to select an actual symptom-management prescription.",
      "decidingObservation": "The patient declines a procedure after an informed discussion, rather than lacking access or permission.",
      "counterfactual": "If she instead sought intervention for persistent bothersome symptoms and were an intervention candidate, venous-service referral would be appropriate.",
      "limitation": "Preference is decision-critical because this node tests the conservative-treatment boundary. This is likely easier than the intervention-sequencing variant; difficulty is not claimed to be validated.",
      "basisClaimIds": [
        "claim.varicose.conservative-boundary"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.02",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-03",
      "oldQuestionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4.r1",
      "caseId": "case.gs028se.p2e.capacity-refusal.v4.varicose",
      "nodeId": "node.gs028se.p2e.capacity-refusal.v4.varicose.2",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4.r1",
        "conceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
        "patientPresentationVariantId": "presentation.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4",
        "patientPresentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.68",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
          },
          {
            "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.68",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
          },
          {
            "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.58",
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
            "presentation": "{patientName}, a 58-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
          },
          {
            "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.58",
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
            "presentation": "{patientName}, a 58-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
          }
        ],
        "reachedCurrentUpdate": "Duplex confirms axial superficial reflux. The calf symptoms continue to limit standing. The venous clinic records suitability for intervention, and {patientName} chooses to discuss a procedure after reviewing compression and procedural options.",
        "stem": "Which plan should be offered for {patientName}'s symptomatic varicose veins?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "Refer to the vascular surgery clinic",
            "isCorrect": true,
            "rationale": "The duplex demonstrates truncal reflux; persistent symptoms and an informed treatment preference support venous-service referral. The specialist selects the technique.",
            "distractorRationale": null
          },
          {
            "id": "d1_1",
            "label": "Prescribe graduated compression stockings before referral",
            "isCorrect": false,
            "rationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
            "distractorRationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate."
          },
          {
            "id": "d2_1",
            "label": "Arrange ultrasound-guided tributary sclerotherapy",
            "isCorrect": false,
            "rationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
            "distractorRationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment."
          }
        ],
        "explanation": "Refer for truncal-intervention planning. Documented axial reflux and persistent bothersome symptoms support that referral when the patient makes an informed choice for intervention. A prolonged compression course is not a compulsory prerequisite. The exact technique remains a venous-specialist decision.",
        "teachingPoint": "Refer for intervention assessment while leaving the exact procedure to specialist evaluation.",
        "supportingEvidenceClaimIds": [
          "claim.varicose.intervention-referral",
          "claim.varicose.conservative-boundary",
          "claim.gs028se.capacity-refusal.4",
          "claim.gs028se.capacity-refusal.3",
          "claim.flags5.20261116.application.03"
        ]
      },
      "flagOrdinals": [
        3
      ],
      "title": "An actual venous treatment plan after a capacity decision",
      "inference": "Apply the venous referral indication after the preserved capacity decision; capacity feedback does not establish the clinical indication.",
      "decidingObservation": "Duplex-confirmed axial reflux and persistent functional symptoms, rather than the cognitive diagnosis.",
      "counterfactual": "If symptoms were acceptable and the supported choice were conservative care, compression could be offered instead.",
      "limitation": "The earlier capacity question, shared presentation and feedback remain visible and are reproduced for review. This follow-up repeats a narrow venous referral rule and may remain relatively easy.",
      "basisClaimIds": [
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary",
        "claim.gs028se.capacity-refusal.4",
        "claim.gs028se.capacity-refusal.3"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.03",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-04",
      "oldQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1.r1",
      "caseId": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
      "nodeId": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1.r1",
        "conceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.paired-single-albumin.flags5r1",
        "patientPresentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          }
        ],
        "stem": "Which assessment and plan best fit {patientName}'s proposed hernia operation?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "Changed liver state; optimize before elective repair",
            "isCorrect": true,
            "rationale": "The new fluid requires assessment of decompensation despite the albumin result; the reducing hernia permits a nonurgent optimization plan.",
            "distractorRationale": null
          },
          {
            "id": "d1_1",
            "label": "Changed liver state; proceed with elective repair",
            "isCorrect": false,
            "rationale": "Recognizing the changed state should change the elective plan rather than leave clearance unchanged.",
            "distractorRationale": "Recognizing the changed state should change the elective plan rather than leave clearance unchanged."
          },
          {
            "id": "d2_1",
            "label": "Stable liver state; optimize before elective repair",
            "isCorrect": false,
            "rationale": "Optimization is the appropriate direction, but the record does not show an unchanged liver-related state.",
            "distractorRationale": "Optimization is the appropriate direction, but the record does not show an unchanged liver-related state."
          },
          {
            "id": "d3_1",
            "label": "Stable liver state; proceed with elective repair",
            "isCorrect": false,
            "rationale": "A reassuring albumin does not account for the new fluid or justify unchanged elective clearance.",
            "distractorRationale": "A reassuring albumin does not account for the new fluid or justify unchanged elective clearance."
          }
        ],
        "explanation": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery.",
        "supportingEvidenceClaimIds": [
          "claim.cirrhosis.multifactor-risk",
          "claim.cirrhosis.optimize-decompensation",
          "claim.flags5.20261116.application.04"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Interval examination",
              "value": "Abdominal girth has increased; shifting dullness is present."
            },
            {
              "label": "Abdominal ultrasound",
              "value": "New free intraperitoneal fluid."
            },
            {
              "label": "Hernia examination",
              "value": "Soft, nontender bulge that reduces when supine."
            }
          ]
        }
      },
      "flagOrdinals": [
        7
      ],
      "title": "Cirrhosis: a reassuring laboratory value and a changed clinical state",
      "inference": "Interpret the interval fluid as a changed liver-related state, then combine that change with the nonurgent operation.",
      "decidingObservation": "New free fluid, with a reducing hernia and preserved bowel function.",
      "counterfactual": "A painful irreducible hernia with obstruction would require urgent surgical assessment despite the liver risk; unchanged clinical status would remove the interval-decompensation premise.",
      "limitation": "Single recorded AGA expert review; no mortality estimate, paracentesis prescription or laboratory cutoff is added.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.04",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-05",
      "oldQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2.r1",
      "caseId": "case.gs028b.cirrhosis-perioperative.a-compensated",
      "nodeId": "node.gs028b.cirrhosis-perioperative.a-compensated.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2.r1",
        "conceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-compensated.flags5r1",
        "patientPresentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
          }
        ],
        "stem": "How should {patientName}'s previous operative-risk assessment be used?",
        "answerChoices": [
          {
            "id": "correct_2",
            "label": "Retain the liver-state description; reassess the proposed procedure",
            "isCorrect": true,
            "rationale": "The liver information remains useful, but the changed operation requires a new procedure-specific, multidisciplinary risk assessment.",
            "distractorRationale": null
          },
          {
            "id": "d1_2",
            "label": "Retain the liver-state description; retain the previous clearance",
            "isCorrect": false,
            "rationale": "Stable liver-related findings do not make clearance transferable between substantially different operations.",
            "distractorRationale": "Stable liver-related findings do not make clearance transferable between substantially different operations."
          },
          {
            "id": "d2_2",
            "label": "Record interval liver deterioration; reassess the proposed procedure",
            "isCorrect": false,
            "rationale": "The operation needs reassessment, but the supplied record does not establish interval liver deterioration.",
            "distractorRationale": "The operation needs reassessment, but the supplied record does not establish interval liver deterioration."
          },
          {
            "id": "d3_2",
            "label": "Record interval liver deterioration; retain the previous clearance",
            "isCorrect": false,
            "rationale": "Neither the proposed deterioration nor transfer of the earlier clearance is supported by the record.",
            "distractorRationale": "Neither the proposed deterioration nor transfer of the earlier clearance is supported by the record."
          }
        ],
        "explanation": "The supplied findings do not establish interval liver deterioration. They also do not make a local skin-procedure assessment transferable to an open abdominal operation. Reassess the procedure, comorbidity and center factors alongside the retained liver data.",
        "supportingEvidenceClaimIds": [
          "claim.cirrhosis.multifactor-risk",
          "claim.flags5.20261116.application.05"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Liver-related course",
              "value": "Albumin, bilirubin and INR are unchanged. No interval fluid accumulation, confusion or gastrointestinal bleeding is reported."
            },
            {
              "label": "Proposed procedure",
              "value": "Open abdominal resection under general anesthesia rather than the previous local skin excision."
            }
          ]
        }
      },
      "flagOrdinals": [
        7
      ],
      "title": "Cirrhosis: why a prior clearance is not transferable to another operation",
      "inference": "Separate unchanged patient/liver data from a changed procedural exposure before deciding whether clearance can be reused.",
      "decidingObservation": "The old assessment concerned a local skin excision, while the new plan is an open abdominal operation under general anesthesia.",
      "counterfactual": "An unchanged planned operation and unchanged clinical course would not create this particular mismatch, although current review would still be required.",
      "limitation": "No risk multiplier or hierarchy of exact operations is taught. The claim supports multidimensional reassessment, not a numerical risk calculation.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.05",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-06",
      "oldQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r7",
      "caseId": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
      "nodeId": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r7",
        "conceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension.flags5r1",
        "patientPresentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
          }
        ],
        "stem": "Which risk domain is demonstrated by {patientName}'s record but not represented by that laboratory summary?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "Portal hypertension and decompensation history",
            "isCorrect": true,
            "rationale": "Prior bleeding varices, persistent thrombocytopenia and splenic enlargement preserve the importance of portal-hypertension history.",
            "distractorRationale": null
          },
          {
            "id": "d1_3",
            "label": "Current hepatic synthetic function",
            "isCorrect": false,
            "rationale": "Albumin and INR already address this domain in the referral summary; they do not replace the clinical history.",
            "distractorRationale": "Albumin and INR already address this domain in the referral summary; they do not replace the clinical history."
          },
          {
            "id": "d2_3",
            "label": "Current cardiopulmonary functional reserve",
            "isCorrect": false,
            "rationale": "This is another relevant preoperative domain, but it is not the domain demonstrated by the supplied endoscopic and splenic record.",
            "distractorRationale": "This is another relevant preoperative domain, but it is not the domain demonstrated by the supplied endoscopic and splenic record."
          }
        ],
        "explanation": "Bleeding esophageal varices document a prior portal-hypertension complication. That history remains relevant when current laboratory values look reassuring. Risk review must still integrate the planned operation, comorbidities and center experience; these findings do not supply an exact operative-risk estimate.",
        "supportingEvidenceClaimIds": [
          "claim.cirrhosis.multifactor-risk",
          "claim.flags5.20261116.application.06"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Prior admission",
              "value": "Hematemesis; endoscopy identified bleeding esophageal varices treated with band ligation."
            },
            {
              "label": "Current record",
              "value": "No new gastrointestinal bleeding; platelet count remains low and the spleen is enlarged."
            }
          ]
        }
      },
      "flagOrdinals": [
        7
      ],
      "title": "Cirrhosis: clinical history omitted by a reassuring laboratory summary",
      "inference": "Interpret the prior endoscopic intervention and current splenic/count findings, then identify the risk domain missing from the referral summary.",
      "decidingObservation": "The prior bleed was from esophageal varices, rather than an unspecified upper-GI lesion.",
      "counterfactual": "A prior nonvariceal bleed would not establish this portal-hypertension history.",
      "limitation": "The question tests integration of clinical history rather than a treatment or urgency rule. It may remain easier than a full surgical disposition decision; no difficulty PASS is inferred from lint.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.06",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-07",
      "oldQuestionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4.r1",
      "caseId": "case.gs028b.cirrhosis-perioperative.a-center-expertise",
      "nodeId": "node.gs028b.cirrhosis-perioperative.a-center-expertise.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4.r1",
        "conceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-center-expertise.flags5r1",
        "patientPresentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
          }
        ],
        "stem": "Which timing and care-setting plan best fits {patientName}'s operation?",
        "answerChoices": [
          {
            "id": "correct_4",
            "label": "Optimize first; arrange surgery at a cirrhosis-experienced center",
            "isCorrect": true,
            "rationale": "The changed liver-related state calls for optimization; the reconstruction also warrants an experienced multidisciplinary setting.",
            "distractorRationale": null
          },
          {
            "id": "d1_4",
            "label": "Operate now; arrange surgery at a cirrhosis-experienced center",
            "isCorrect": false,
            "rationale": "A suitable setting does not remove the need to assess and optimize the new fluid before a nonurgent operation.",
            "distractorRationale": "A suitable setting does not remove the need to assess and optimize the new fluid before a nonurgent operation."
          },
          {
            "id": "d2_4",
            "label": "Optimize first; arrange surgery at the referring general hospital",
            "isCorrect": false,
            "rationale": "Optimization is appropriate, but the planned reconstruction and cirrhosis still require review of center experience and rescue resources.",
            "distractorRationale": "Optimization is appropriate, but the planned reconstruction and cirrhosis still require review of center experience and rescue resources."
          },
          {
            "id": "d3_4",
            "label": "Operate now; arrange surgery at the referring general hospital",
            "isCorrect": false,
            "rationale": "Neither the interval liver-related change nor the planned setting has been adequately incorporated.",
            "distractorRationale": "Neither the interval liver-related change nor the planned setting has been adequately incorporated."
          }
        ],
        "explanation": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance.",
        "supportingEvidenceClaimIds": [
          "claim.cirrhosis.multifactor-risk",
          "claim.cirrhosis.optimize-decompensation",
          "claim.flags5.20261116.application.07"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Interval findings",
              "value": "New abdominal free fluid on ultrasound and increasing abdominal girth."
            },
            {
              "label": "Operation",
              "value": "Nonurgent; no obstruction or active bleeding is described."
            },
            {
              "label": "Referring hospital",
              "value": "An inpatient surgical ward and intensive care are present. The team performs few operations in patients with cirrhosis; postoperative liver-related complications are transferred to the regional hepatology center."
            }
          ]
        }
      },
      "flagOrdinals": [
        7
      ],
      "title": "Cirrhosis: separate optimization from the eventual operating setting",
      "inference": "Interpret the changed liver-related findings, then combine timing with the resources required for a complex operation.",
      "decidingObservation": "New abdominal fluid plus an elective reconstruction at a hospital that transfers postoperative liver complications.",
      "counterfactual": "A minor procedure in a stable patient would not establish this same care-setting recommendation; an emergency would change the timing decision.",
      "limitation": "Facility resources are decision-critical because the task explicitly tests the operating setting. They are not an availability sentence added to cue an unrelated test. Single recorded expert-review source.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.07",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-08",
      "oldQuestionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1",
      "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r3",
      "caseId": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
      "nodeId": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.2",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r3",
        "conceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.paired-single-albumin.flags5r1",
        "patientPresentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          }
        ],
        "reachedCurrentUpdate": "Before the planned liver-team visit, {patientName} develops vomiting and increasing pain at the umbilical bulge. The bulge no longer reduces. CT shows bowel within the hernia, dilated upstream bowel and collapsed downstream bowel.",
        "stem": "Which next step should be arranged for {patientName}'s changed abdominal findings?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "Urgent hospital surgical assessment",
            "isCorrect": true,
            "rationale": "New pain, irreducibility, vomiting and the bowel transition change the problem from nonurgent optimization to an acute surgical assessment.",
            "distractorRationale": null
          },
          {
            "id": "d1_1",
            "label": "Expedited outpatient therapeutic paracentesis",
            "isCorrect": false,
            "rationale": "Addressing ascites does not resolve the new incarcerated bowel-containing hernia and obstructive pattern.",
            "distractorRationale": "Addressing ascites does not resolve the new incarcerated bowel-containing hernia and obstructive pattern."
          },
          {
            "id": "d2_1",
            "label": "Scheduled hepatology–anesthesia optimization",
            "isCorrect": false,
            "rationale": "That was appropriate for the earlier reducing, nonurgent hernia, but the new clinical and CT findings require a different sequence.",
            "distractorRationale": "That was appropriate for the earlier reducing, nonurgent hernia, but the new clinical and CT findings require a different sequence."
          }
        ],
        "explanation": "The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation.",
        "supportingEvidenceClaimIds": [
          "claim.cirrhosis.optimize-decompensation",
          "claim.qf3.cirrhosis-urgent-hernia-boundary",
          "claim.flags5.20261116.application.08"
        ]
      },
      "flagOrdinals": [
        7
      ],
      "title": "Cirrhosis: an acute change overrides the earlier elective optimization plan",
      "inference": "Recognize a new obstructive hernia pattern and override a previously reasonable elective optimization sequence.",
      "decidingObservation": "The bulge has become painful and irreducible, with vomiting and an upstream/downstream bowel transition.",
      "counterfactual": "A soft reducing hernia without obstructive symptoms would retain the earlier elective optimization plan.",
      "limitation": "The scored objective changes from recognizing the elective decompensation boundary to recognizing its acute surgical exception. A new concept version preserves the old FSRS identity for frozen encounters. No operative technique, ischemia criterion or timing threshold is added.",
      "basisClaimIds": [
        "claim.cirrhosis.optimize-decompensation",
        "claim.qf3.cirrhosis-urgent-hernia-boundary"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.08",
      "conceptMeaning": "changed — new exception decision",
      "previousConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-09",
      "oldQuestionVariantId": "question.preoperative-osa.validated-risk-screening.v1",
      "questionVariantId": "question.preoperative-osa.validated-risk-screening.v1.r1",
      "caseId": "case.gs028d.anesthesia.a-snoring-surgery",
      "nodeId": "node.gs028d.anesthesia.a-snoring-surgery.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.preoperative-osa.validated-risk-screening.v1.r1",
        "conceptId": "concept.preoperative-osa.validated-risk-screening",
        "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-snoring-surgery.flags5r1",
        "patientPresentation": "{patientName}, a 44-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.44.flags5r1",
            "prototypeDemographics": {
              "ageYears": 44,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 44-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.44.flags5r1",
            "prototypeDemographics": {
              "ageYears": 44,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 44-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.63.flags5r1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 63-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.63.flags5r1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 63-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          }
        ],
        "stem": "Which interpretation should be recorded for {patientName}'s perioperative planning?",
        "answerChoices": [
          {
            "id": "correct_1",
            "label": "Increased OSA probability; diagnosis unconfirmed",
            "isCorrect": true,
            "rationale": "STOP-Bang assesses OSA probability. A reassuring sleepiness report does not override it, and neither screen establishes a diagnosis.",
            "distractorRationale": null
          },
          {
            "id": "d1_1",
            "label": "Increased OSA probability; diagnosis confirmed",
            "isCorrect": false,
            "rationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
            "distractorRationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result."
          },
          {
            "id": "d2_1",
            "label": "Low OSA probability; diagnosis unconfirmed",
            "isCorrect": false,
            "rationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
            "distractorRationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen."
          },
          {
            "id": "d3_1",
            "label": "Low OSA probability; diagnosis confirmed",
            "isCorrect": false,
            "rationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
            "distractorRationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record."
          }
        ],
        "explanation": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result.",
        "supportingEvidenceClaimIds": [
          "claim.gs028d.osa.validated-screen",
          "claim.qf2.sleep-questionnaire-domain-interpretation",
          "claim.flags5.20261116.application.09"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "STOP-Bang report",
              "value": "Flagged by the validated screening tool."
            },
            {
              "label": "Epworth Sleepiness Scale report",
              "value": "Not flagged for increased daytime sleepiness."
            },
            {
              "label": "Diagnostic testing",
              "value": "No diagnostic sleep-study result is recorded."
            }
          ]
        }
      },
      "flagOrdinals": [
        13
      ],
      "title": "OSA probability and daytime sleepiness are different screening targets",
      "inference": "Identify which instrument addresses OSA probability, then separate that probability from diagnostic confirmation.",
      "decidingObservation": "A flagged STOP-Bang report with a nonflagged daytime-sleepiness report.",
      "counterfactual": "A confirmed diagnostic study would change diagnostic certainty; a reassuring Epworth report alone would not establish low OSA probability.",
      "limitation": "Reported qualitative outputs are constructed. No instrument items, score, cutoff, cancellation rule or sleep-test threshold is reproduced. This remains a focused screening-interpretation item, not an advanced anesthesia-management scenario.",
      "basisClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.09",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.preoperative-osa.validated-risk-screening",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-10",
      "oldQuestionVariantId": "question.preoperative-osa.validated-risk-screening.v4",
      "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r6",
      "caseId": "case.gs028d.anesthesia.a-validated-not-impression",
      "nodeId": "node.gs028d.anesthesia.a-validated-not-impression.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.preoperative-osa.validated-risk-screening.v4.r6",
        "conceptId": "concept.preoperative-osa.validated-risk-screening",
        "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-validated-not-impression.flags5r1",
        "patientPresentation": "{patientName}, a 46-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46.flags5r1",
            "prototypeDemographics": {
              "ageYears": 46,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 46-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46.flags5r1",
            "prototypeDemographics": {
              "ageYears": 46,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 46-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          }
        ],
        "stem": "Which interpretation should be recorded for {patientName}'s perioperative planning?",
        "answerChoices": [
          {
            "id": "correct_4",
            "label": "Increased OSA probability; diagnosis unconfirmed",
            "isCorrect": true,
            "rationale": "STOP-Bang assesses OSA probability. A reassuring sleepiness report does not override it, and neither screen establishes a diagnosis.",
            "distractorRationale": null
          },
          {
            "id": "d1_4",
            "label": "Increased OSA probability; diagnosis confirmed",
            "isCorrect": false,
            "rationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
            "distractorRationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result."
          },
          {
            "id": "d2_4",
            "label": "Low OSA probability; diagnosis unconfirmed",
            "isCorrect": false,
            "rationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
            "distractorRationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen."
          },
          {
            "id": "d3_4",
            "label": "Low OSA probability; diagnosis confirmed",
            "isCorrect": false,
            "rationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
            "distractorRationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record."
          }
        ],
        "explanation": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result.",
        "supportingEvidenceClaimIds": [
          "claim.gs028d.osa.validated-screen",
          "claim.qf2.sleep-questionnaire-domain-interpretation",
          "claim.flags5.20261116.application.10"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "STOP-Bang report",
              "value": "Flagged by the validated screening tool."
            },
            {
              "label": "Epworth Sleepiness Scale report",
              "value": "Not flagged for increased daytime sleepiness."
            },
            {
              "label": "Diagnostic testing",
              "value": "No diagnostic sleep-study result is recorded."
            }
          ]
        }
      },
      "flagOrdinals": [
        13
      ],
      "title": "OSA probability and daytime sleepiness are different screening targets",
      "inference": "Identify which instrument addresses OSA probability, then separate that probability from diagnostic confirmation.",
      "decidingObservation": "A flagged STOP-Bang report with a nonflagged daytime-sleepiness report.",
      "counterfactual": "A confirmed diagnostic study would change diagnostic certainty; a reassuring Epworth report alone would not establish low OSA probability.",
      "limitation": "Reported qualitative outputs are constructed. No instrument items, score, cutoff, cancellation rule or sleep-test threshold is reproduced. This remains a focused screening-interpretation item, not an advanced anesthesia-management scenario.",
      "basisClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.10",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.preoperative-osa.validated-risk-screening",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-11",
      "oldQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r1",
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "nodeId": "node.gs028c.palpable-breast.paired-scar-edge.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.negative-mammogram-targeted-us.v2.r1",
        "conceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge.flags5r1",
        "patientPresentation": "{patientName}, a 49-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49.flags5r1",
            "prototypeDemographics": {
              "ageYears": 49,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 49-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar."
          },
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63.flags5r1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 63-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar."
          }
        ],
        "stem": "Which imaging study should be requested next for {patientName}'s palpable breast finding?",
        "answerChoices": [
          {
            "id": "correct_2",
            "label": "Targeted breast ultrasound",
            "isCorrect": true,
            "rationale": "A reproducible palpable target requires site-directed ultrasound when the diagnostic mammogram provides no correlate.",
            "distractorRationale": null
          },
          {
            "id": "d1_2",
            "label": "Diagnostic mammographic spot-compression views",
            "isCorrect": false,
            "rationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
            "distractorRationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views."
          },
          {
            "id": "d2_2",
            "label": "Contrast-enhanced breast MRI",
            "isCorrect": false,
            "rationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
            "distractorRationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study."
          }
        ],
        "explanation": "The stable mammographic scar does not explain a new discrete clinical target. Request ultrasound directed to the palpable site. MRI or further mammographic views do not replace that site-specific next step.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.targeted-us",
          "claim.flags5.20261116.application.11"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Diagnostic mammogram",
              "value": "The skin marker overlies the palpable site. Scar distortion is unchanged from prior images; no new mass or suspicious calcifications at the marker."
            },
            {
              "label": "Examination",
              "value": "The same focal lump is reproducible at the scar edge."
            }
          ]
        }
      },
      "flagOrdinals": [
        20
      ],
      "title": "Scar-edge lump with a site-marked mammogram",
      "inference": "Distinguish a stable pre-existing scar finding from the new clinical target, then select the complementary imaging test.",
      "decidingObservation": "A reproducible new scar-edge lump despite no new mammographic correlate at the marked site.",
      "counterfactual": "A completed site-concordant ultrasound would change the next decision, particularly if examination remained suspicious.",
      "limitation": "Constructed report observations replace the summary label. No BI-RADS threshold or blanket MRI prohibition is introduced.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.11",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-12",
      "oldQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r1",
      "caseId": "case.gs028c.palpable-breast.a-recent-negative",
      "nodeId": "node.gs028c.palpable-breast.a-recent-negative.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.negative-mammogram-targeted-us.v3.r1",
        "conceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-recent-negative.flags5r1",
        "patientPresentation": "{patientName}, a 42-year-old woman, attends clinic for a discrete mobile breast lump that the surgeon can reproduce.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.a-recent-negative.female.42.flags5r1",
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
            "presentation": "{patientName}, a 42-year-old woman, attends clinic for a discrete mobile breast lump that the surgeon can reproduce."
          },
          {
            "id": "profile.gs028c.palpable-breast.a-recent-negative.female.55.flags5r1",
            "prototypeDemographics": {
              "ageYears": 55,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 55-year-old woman, attends clinic for a discrete mobile breast lump that the surgeon can reproduce."
          }
        ],
        "stem": "Which imaging study should be requested next for {patientName}'s palpable breast finding?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "Targeted breast ultrasound",
            "isCorrect": true,
            "rationale": "A reproducible palpable target requires site-directed ultrasound when the diagnostic mammogram provides no correlate.",
            "distractorRationale": null
          },
          {
            "id": "d1_3",
            "label": "Diagnostic mammographic spot-compression views",
            "isCorrect": false,
            "rationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
            "distractorRationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views."
          },
          {
            "id": "d2_3",
            "label": "Contrast-enhanced breast MRI",
            "isCorrect": false,
            "rationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
            "distractorRationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study."
          }
        ],
        "explanation": "Request ultrasound targeted to the persistent clinical site. The mammogram documents no correlate at that location; it does not remove the palpable target. MRI and repeating mammographic views are not the preferred next study in this sequence.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.targeted-us",
          "claim.flags5.20261116.application.12"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Diagnostic mammogram",
              "value": "The marked palpable site is included. No corresponding mass, architectural distortion or suspicious calcifications."
            },
            {
              "label": "Clinical localization",
              "value": "The examination and mammographic skin marker identify the same focal site."
            }
          ]
        }
      },
      "flagOrdinals": [
        20
      ],
      "title": "New palpable target and a site-marked mammogram",
      "inference": "Recognize that a correctly localized mammogram has not explained the clinical finding, then choose complementary site-directed imaging.",
      "decidingObservation": "The palpable focus persists even though its marked site has no mammographic correlate.",
      "counterfactual": "If the site-specific evaluation were already complete and examination remained suspicious, tissue diagnosis rather than another initial imaging study could be needed.",
      "limitation": "No sentence announces an omitted ultrasound. Selection still tests a common imaging-sequence rule and may be easier for experienced residents.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.12",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-13",
      "oldQuestionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r3",
      "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
      "nodeId": "node.gs028c.palpable-breast.a-discordant-exam.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.negative-mammogram-targeted-us.v4.r3",
        "conceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-discordant-exam.flags5r1",
        "patientPresentation": "{patientName}, a 47-year-old woman, attends clinic for focal breast thickening reproduced on two examinations.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47.flags5r1",
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
            "presentation": "{patientName}, a 47-year-old woman, attends clinic for focal breast thickening reproduced on two examinations."
          },
          {
            "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61.flags5r1",
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
            "presentation": "{patientName}, a 61-year-old woman, attends clinic for focal breast thickening reproduced on two examinations."
          }
        ],
        "stem": "Which imaging study should be requested next for {patientName}'s palpable breast finding?",
        "answerChoices": [
          {
            "id": "correct_4",
            "label": "Targeted breast ultrasound",
            "isCorrect": true,
            "rationale": "A reproducible palpable target requires site-directed ultrasound when the diagnostic mammogram provides no correlate.",
            "distractorRationale": null
          },
          {
            "id": "d1_4",
            "label": "Diagnostic mammographic spot-compression views",
            "isCorrect": false,
            "rationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
            "distractorRationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views."
          },
          {
            "id": "d2_4",
            "label": "Contrast-enhanced breast MRI",
            "isCorrect": false,
            "rationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
            "distractorRationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study."
          }
        ],
        "explanation": "The examination supplies a persistent target despite the absent mammographic correlate. Request ultrasound of that exact area. Neither routine screening nor a problem-solving MRI substitutes for the targeted next study.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.targeted-us",
          "claim.flags5.20261116.application.13"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Diagnostic mammogram",
              "value": "Views include the skin-marked area. No focal density, architectural distortion or suspicious calcifications at that site."
            },
            {
              "label": "Examination",
              "value": "The same discrete area of thickening remains palpable."
            }
          ]
        }
      },
      "flagOrdinals": [
        20
      ],
      "title": "Reproducible focal thickening with concrete mammographic observations",
      "inference": "Interpret the report as absence of a mammographic correlate rather than absence of a clinical lesion, then select the next modality.",
      "decidingObservation": "Reproducible focal thickening at the imaged and marked site.",
      "counterfactual": "A concerning persistent target after completed site-directed mammography and ultrasound would move the decision toward tissue evaluation.",
      "limitation": "The case supplies actual report observations without stating that ultrasound was not done. No precise performance probability is claimed.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.13",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-14",
      "oldQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r1",
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "nodeId": "node.gs028c.palpable-breast.paired-scar-edge.2",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r1",
        "conceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge.flags5r1",
        "patientPresentation": "{patientName}, a 49-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49.flags5r1",
            "prototypeDemographics": {
              "ageYears": 49,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 49-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar."
          },
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63.flags5r1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 63-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar."
          }
        ],
        "reachedCurrentUpdate": "Ultrasound at the marked palpable site shows no solid or cystic correlate. Mammographic scar distortion is unchanged. The surgeon still finds the same distinctly hard, irregular scar-edge mass.",
        "stem": "Which diagnostic procedure should be arranged next for {patientName}'s persistent breast mass?",
        "answerChoices": [
          {
            "id": "correct_2",
            "label": "Palpation-directed core or surgical biopsy",
            "isCorrect": true,
            "rationale": "The persistent concerning clinical target requires tissue diagnosis even without an imaging correlate; the breast team selects the feasible technique.",
            "distractorRationale": null
          },
          {
            "id": "d1_2",
            "label": "Contrast-enhanced breast MRI",
            "isCorrect": false,
            "rationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
            "distractorRationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here."
          },
          {
            "id": "d2_2",
            "label": "Repeat site-directed breast ultrasound",
            "isCorrect": false,
            "rationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
            "distractorRationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination."
          }
        ],
        "explanation": "A hard, irregular palpable target remains clinically concerning despite site-concordant imaging without a correlate. Arrange palpation-directed core or surgical biopsy through the breast team. Repeating ultrasound or substituting MRI does not provide the required tissue diagnosis.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.biopsy",
          "claim.flags5.20261116.application.14"
        ]
      },
      "flagOrdinals": [
        32
      ],
      "title": "Hard scar-edge mass after site-concordant imaging",
      "inference": "Confirm that imaging examined the actual clinical site, then resolve the persistent examination–imaging discordance with tissue diagnosis.",
      "decidingObservation": "The mass is hard and irregular at the same site that had no ultrasound correlate.",
      "counterfactual": "A different-site ultrasound would first require correct-site evaluation; an examination without concerning persistent features would not establish this biopsy premise.",
      "limitation": "The preceding imaging node and feedback are included in review. The exact biopsy technique remains anatomy- and specialist-dependent.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.14",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-15",
      "oldQuestionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r1",
      "caseId": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
      "nodeId": "node.gs028c.palpable-breast.b-enlarging-negative-imaging.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r1",
        "conceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.b-enlarging-negative-imaging.flags5r1",
        "patientPresentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
          },
          {
            "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.57.flags5r1",
            "prototypeDemographics": {
              "ageYears": 57,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 57-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
          }
        ],
        "stem": "Which diagnostic procedure should be arranged next for {patientName}'s persistent breast mass?",
        "answerChoices": [
          {
            "id": "correct_3",
            "label": "Palpation-directed core or surgical biopsy",
            "isCorrect": true,
            "rationale": "The persistent concerning clinical target requires tissue diagnosis even without an imaging correlate; the breast team selects the feasible technique.",
            "distractorRationale": null
          },
          {
            "id": "d1_3",
            "label": "Contrast-enhanced breast MRI",
            "isCorrect": false,
            "rationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
            "distractorRationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here."
          },
          {
            "id": "d2_3",
            "label": "Repeat site-directed breast ultrasound",
            "isCorrect": false,
            "rationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
            "distractorRationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination."
          }
        ],
        "explanation": "The enlarging clinical target requires tissue diagnosis despite completed site-concordant imaging without a correlate. Request palpation-directed core or surgical biopsy through the breast team. A repeat ultrasound or MRI cannot be used to dismiss that clinical target.",
        "supportingEvidenceClaimIds": [
          "claim.gs028c.palpable.biopsy",
          "claim.flags5.20261116.application.15"
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Diagnostic mammogram",
              "value": "The palpable skin marker is included; no corresponding mass, distortion or suspicious calcifications."
            },
            {
              "label": "Targeted ultrasound",
              "value": "The surgeon's marked site was scanned; no corresponding solid or cystic lesion."
            },
            {
              "label": "Repeat examination",
              "value": "The same discrete mass remains palpable and is larger than on the previous examination."
            }
          ]
        }
      },
      "flagOrdinals": [
        32
      ],
      "title": "Enlarging palpable mass with no corresponding imaging lesion",
      "inference": "Establish site concordance of both studies, then recognize that progressive clinical findings still require tissue diagnosis.",
      "decidingObservation": "The same mass is enlarging despite actual no-correlate reports from both correctly targeted studies.",
      "counterfactual": "If the ultrasound had examined a different site, the apparent discordance would first need reconciliation.",
      "limitation": "No imaging sensitivity, probability, follow-up interval or preferred biopsy instrument is invented.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.15",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-16",
      "oldQuestionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r4",
      "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r5",
      "caseId": "case.gs028b.ptld.b-pathology-returned",
      "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.ptld.tissue-diagnosis-coordination.v4.r5",
        "conceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
        "stem": "Which biopsy and specimen-handling plan should {patientName}'s team request next for suspected post-transplant lymphoproliferative disorder?",
        "answerChoices": [
          {
            "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-split",
            "label": "Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
            "isCorrect": true,
            "rationale": "Excision supplies nodal architecture after inadequate core sampling. The laboratory allocates the specimen under its own protocol, retaining fresh tissue for flow cytometry and fixed tissue for histology.",
            "distractorRationale": null
          },
          {
            "id": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
            "label": "Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
            "isCorrect": false,
            "rationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.",
            "distractorRationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node."
          },
          {
            "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
            "label": "Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies",
            "isCorrect": false,
            "rationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.",
            "distractorRationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis."
          },
          {
            "id": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
            "label": "Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies",
            "isCorrect": false,
            "rationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.",
            "distractorRationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved."
          }
        ],
        "explanation": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.",
        "supportingEvidenceClaimIds": [
          "claim.owner-decisions.20261112.ptld-architecture",
          "claim.owner-decisions.20261112.ptld-fresh-flow",
          "claim.owner-decisions.20261112.ptld-fixed-histology",
          "claim.flags5.20261116.application.16"
        ],
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.ptld-biopsy.v2.flags5r1",
        "patientPresentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.ptld-biopsy.v2.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Enlarging neck node",
            "presentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk."
          }
        ]
      },
      "flagOrdinals": [
        24
      ],
      "title": "PTLD: accessible node, inadequate architecture and specimen allocation",
      "inference": "Use accessibility and inadequate architecture to select excision, then preserve fresh and fixed portions for their separate diagnostic roles.",
      "decidingObservation": "The core lacks adequate architecture, while an accessible mobile node and acceptable operative risk permit excision.",
      "counterfactual": "A deep high-risk node or adequate existing architecture could alter the sampling decision; fixed tissue cannot be assumed to supply viable cells for flow cytometry.",
      "limitation": "Pure deletion of the permission/feasibility sentence. Existing clinician-directed clinical facts, options and explanation are retained; transport/viability remains hematopathology review.",
      "basisClaimIds": [
        "claim.owner-decisions.20261112.ptld-architecture",
        "claim.owner-decisions.20261112.ptld-fresh-flow",
        "claim.owner-decisions.20261112.ptld-fixed-histology"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.16",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-17",
      "oldQuestionVariantId": "question.achalasia.high-resolution-manometry.v4.r5",
      "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r6",
      "caseId": "case.achalasia.clinic-referral",
      "nodeId": "node.achalasia.clinic-referral.1",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.achalasia.high-resolution-manometry.v4.r6",
        "conceptId": "concept.achalasia.high-resolution-manometry.v2",
        "stem": "How should {patientName}'s next physiologic assessment be arranged?",
        "answerChoices": [
          {
            "id": "manometry_4",
            "label": "Manometry with endoscopic catheter placement",
            "isCorrect": true,
            "distractorRationale": null,
            "rationale": "A displaced catheter without a gastric reference cannot provide a dependable junction relaxation assessment; technically adequate repeat testing is feasible."
          },
          {
            "id": "choice.qq20261102c.b04-context.d1",
            "label": "Obtain junction distensibility measurements with endoscopic FLIP",
            "isCorrect": false,
            "distractorRationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here."
          },
          {
            "id": "choice.qq20261102c.b04-context.d2",
            "label": "Obtain a timed barium esophagram with a tablet",
            "isCorrect": false,
            "distractorRationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements."
          }
        ],
        "explanation": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
        "supportingEvidenceClaimIds": [
          "claim.achalasia.high-resolution-manometry",
          "claim.qq20261102a.esophageal-physiology-sequence",
          "claim.qq20261102c.hrm-incomplete-placement",
          "claim.flags5.20261116.application.17"
        ],
        "teachingPoint": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
        "patientPresentationVariantId": "presentation.achalasia.clinic-referral.flags5r1",
        "patientPresentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.achalasia.clinic-referral.female.66.flags5r1",
            "prototypeDemographics": {
              "ageYears": 66,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.male.66.flags5r1",
            "prototypeDemographics": {
              "ageYears": 66,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 66-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.female.72.flags5r1",
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
            "presentation": "{patientName}, a 72-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.male.72.flags5r1",
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
            "presentation": "{patientName}, a 72-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          }
        ],
        "exhibit": {
          "kind": "keyValue",
          "caption": "Constructed clinical record",
          "items": [
            {
              "label": "Upper endoscopy",
              "value": "No mucosal mass or fixed luminal narrowing."
            },
            {
              "label": "Contrast swallow",
              "value": "Slow passage through the distal junction."
            }
          ]
        }
      },
      "flagOrdinals": [
        26
      ],
      "title": "Dysphagia: a readable initial test-result record",
      "inference": "Check whether the existing pressure acquisition is technically interpretable before choosing the next physiologic assessment.",
      "decidingObservation": "The retained pressure report lacks a reliable gastric reference after catheter displacement.",
      "counterfactual": "An adequate completed pressure acquisition would remove the reason to repeat it with assisted placement.",
      "limitation": "Previously reviewed task, update, choices, rationale and explanation are unchanged. Only the shared-header test observations move into a concise result exhibit; the later endoscopy addendum remains a later finding.",
      "basisClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.17",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.achalasia.high-resolution-manometry.v2",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    },
    {
      "id": "QF5-18",
      "oldQuestionVariantId": "question.achalasia.manometric-recognition.v4.r4",
      "questionVariantId": "question.achalasia.manometric-recognition.v4.r5",
      "caseId": "case.achalasia.clinic-referral",
      "nodeId": "node.achalasia.clinic-referral.2",
      "question": {
        "contentVersion": "question-authoring.2026-11-16.flags5-r1",
        "reviewStatus": "needs_clinician_review",
        "aiAssistedDrafting": true,
        "lastClinicianReview": null,
        "id": "question.achalasia.manometric-recognition.v4.r5",
        "conceptId": "concept.achalasia.manometric-recognition",
        "stem": "Which interpretation and next plan should guide {patientName}'s care?",
        "answerChoices": [
          {
            "id": "achalasia_4",
            "label": "Achalasia pattern; junction-focused CT or endoscopic ultrasound",
            "isCorrect": true,
            "rationale": "Impaired relaxation and failed contractions support the motor pattern, but the weight loss and scope resistance require secondary-cause assessment before treatment.",
            "distractorRationale": null
          },
          {
            "id": "choice.qq20261102b.b04.d1",
            "label": "Achalasia pattern; pneumatic dilation or endoscopic myotomy",
            "isCorrect": false,
            "rationale": "The motor-pattern interpretation is appropriate, but treatment before secondary-cause assessment closes the investigation prematurely.",
            "distractorRationale": "The motor-pattern interpretation is appropriate, but treatment before secondary-cause assessment closes the investigation prematurely."
          },
          {
            "id": "choice.qq20261102b.b04.d2",
            "label": "Ineffective motility; junction-focused CT or endoscopic ultrasound",
            "isCorrect": false,
            "rationale": "The secondary-cause investigation is appropriate, but the very low contractions with impaired junction relaxation are not preserved effective peristalsis.",
            "distractorRationale": "The secondary-cause investigation is appropriate, but the very low contractions with impaired junction relaxation are not preserved effective peristalsis."
          },
          {
            "id": "choice.qq20261102b.b04.d3",
            "label": "Ineffective motility; pneumatic dilation or endoscopic myotomy",
            "isCorrect": false,
            "rationale": "This combines the wrong pressure-pattern interpretation with an unsupported move to junction treatment.",
            "distractorRationale": "This combines the wrong pressure-pattern interpretation with an unsupported move to junction treatment."
          }
        ],
        "explanation": "Impaired junction relaxation with very low contractile measurements supports an achalasia motor pattern. Weight loss and marked endoscopic resistance still require targeted CT or endoscopic ultrasound for a secondary junction lesion before dilation or myotomy. A normal mucosal view does not exclude a mural or extrinsic lesion.",
        "supportingEvidenceClaimIds": [
          "claim.achalasia.manometric-recognition",
          "claim.achalasia.high-resolution-manometry",
          "claim.qq20261102.motility-egjoo",
          "claim.qq20261102.motility-absent-contractility",
          "claim.qq20261102a.failed-contraction-threshold",
          "claim.qq20261102b.secondary-achalasia-assessment",
          "claim.flags5.20261116.application.18"
        ],
        "teachingPoint": "The very low contractile measurements represent failed contractions, not preserved effective peristalsis. Impaired junction relaxation yields an achalasia pattern, but substantial recent weight loss and marked scope resistance in this older patient warrant targeted secondary-cause assessment before treatment planning. A normal-looking mucosa does not exclude a mural or extrinsic lesion.",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Investigation record; pressure values are constructed teaching observations",
          "items": [
            {
              "label": "Endoscopy addendum",
              "value": "Marked resistance while crossing the gastroesophageal junction."
            },
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
        "patientPresentationVariantId": "presentation.achalasia.clinic-referral.flags5r1",
        "patientPresentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.achalasia.clinic-referral.female.66.flags5r1",
            "prototypeDemographics": {
              "ageYears": 66,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.male.66.flags5r1",
            "prototypeDemographics": {
              "ageYears": 66,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 66-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.female.72.flags5r1",
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
            "presentation": "{patientName}, a 72-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.male.72.flags5r1",
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
            "presentation": "{patientName}, a 72-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          }
        ],
        "reachedCurrentUpdate": "At review, {patientName} reports continued difficulty swallowing. Recorded weights have fallen substantially during the recent progression of symptoms."
      },
      "flagOrdinals": [
        26
      ],
      "title": "Dysphagia: separate test observations from interpretation",
      "inference": "Interpret impaired relaxation and failed distal contractions, then recognize that the weight loss and junction resistance still require a secondary-cause assessment.",
      "decidingObservation": "Substantial weight loss and marked junction resistance despite a mucosal examination without a mass.",
      "counterfactual": "Without the secondary-cause warning features, the same motor pattern would not itself establish this need to investigate a secondary junction lesion before treatment planning.",
      "limitation": "The recorded pressure values, laboratory-relative threshold and key meaning are unchanged. Concrete investigation/treatment names replace generic planning labels. CT and EUS are offered together because the recorded guideline does not establish a universal preference between them.",
      "basisClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.qq20261102a.failed-contraction-threshold",
        "claim.qq20261102b.secondary-achalasia-assessment"
      ],
      "applicationClaimId": "claim.flags5.20261116.application.18",
      "conceptMeaning": "unchanged",
      "previousConceptId": "concept.achalasia.manometric-recognition",
      "reviewStatus": "needs_clinician_review",
      "lastClinicianReview": null
    }
  ],
  "cases": [
    {
      "id": "case.achalasia.clinic-referral",
      "displayName": "Esophageal motility evaluation",
      "patientPresentationVariantId": "presentation.achalasia.clinic-referral.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 66,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Difficulty swallowing",
      "presentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.achalasia.clinic-referral.female.66.flags5r1",
          "prototypeDemographics": {
            "ageYears": 66,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
        },
        {
          "id": "profile.achalasia.clinic-referral.male.66.flags5r1",
          "prototypeDemographics": {
            "ageYears": 66,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 66-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
        },
        {
          "id": "profile.achalasia.clinic-referral.female.72.flags5r1",
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
          "presentation": "{patientName}, a 72-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
        },
        {
          "id": "profile.achalasia.clinic-referral.male.72.flags5r1",
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
          "presentation": "{patientName}, a 72-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"
      ],
      "decisionNodes": [
        {
          "id": "node.achalasia.clinic-referral.1",
          "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r6",
          "primaryConceptId": "concept.achalasia.high-resolution-manometry.v2",
          "currentUpdate": "The exported outside manometry plots have no gastric baseline channel. During the test the entire catheter moves upward with retching; the report nevertheless gives a junction relaxation value and recommends dilation.",
          "stem": "How should {patientName}'s next physiologic assessment be arranged?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "manometry_4",
              "label": "Manometry with endoscopic catheter placement",
              "isCorrect": true,
              "rationale": "A displaced catheter without a gastric reference cannot provide a dependable junction relaxation assessment; technically adequate repeat testing is feasible.",
              "serviceRequest": {
                "serviceId": "service.esophageal_manometry"
              }
            },
            {
              "id": "choice.qq20261102c.b04-context.d1",
              "label": "Obtain junction distensibility measurements with endoscopic FLIP",
              "isCorrect": false,
              "rationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102c.b04-context.d2",
              "label": "Obtain a timed barium esophagram with a tablet",
              "isCorrect": false,
              "rationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
          "teachingPoint": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
          "sourceLabels": [
            "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v7)"
          ],
          "resultGateAfter": {
            "id": "gate.achalasia.manometry.4",
            "resultTypeId": "service.esophageal_manometry",
            "pendingLabel": "Esophageal manometry pending",
            "resultNarrative": "The esophageal pressure-study report is available for review.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.esophageal_manometry.outsourced"
            ]
          },
          "terminalDispositions": [],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Upper endoscopy",
                "value": "No mucosal mass or fixed luminal narrowing."
              },
              {
                "label": "Contrast swallow",
                "value": "Slow passage through the distal junction."
              }
            ]
          }
        },
        {
          "id": "node.achalasia.clinic-referral.2",
          "questionVariantId": "question.achalasia.manometric-recognition.v4.r5",
          "primaryConceptId": "concept.achalasia.manometric-recognition",
          "currentUpdate": "At review, {patientName} reports continued difficulty swallowing. Recorded weights have fallen substantially during the recent progression of symptoms.",
          "stem": "Which interpretation and next plan should guide {patientName}'s care?",
          "showServicePreviews": false,
          "answerChoices": [
            {
              "id": "achalasia_4",
              "label": "Achalasia pattern; junction-focused CT or endoscopic ultrasound",
              "isCorrect": true,
              "rationale": "Impaired relaxation and failed contractions support the motor pattern, but the weight loss and scope resistance require secondary-cause assessment before treatment.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b04.d1",
              "label": "Achalasia pattern; pneumatic dilation or endoscopic myotomy",
              "isCorrect": false,
              "rationale": "The motor-pattern interpretation is appropriate, but treatment before secondary-cause assessment closes the investigation prematurely.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b04.d2",
              "label": "Ineffective motility; junction-focused CT or endoscopic ultrasound",
              "isCorrect": false,
              "rationale": "The secondary-cause investigation is appropriate, but the very low contractions with impaired junction relaxation are not preserved effective peristalsis.",
              "serviceRequest": null
            },
            {
              "id": "choice.qq20261102b.b04.d3",
              "label": "Ineffective motility; pneumatic dilation or endoscopic myotomy",
              "isCorrect": false,
              "rationale": "This combines the wrong pressure-pattern interpretation with an unsupported move to junction treatment.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Impaired junction relaxation with very low contractile measurements supports an achalasia motor pattern. Weight loss and marked endoscopic resistance still require targeted CT or endoscopic ultrasound for a secondary junction lesion before dilation or myotomy. A normal mucosal view does not exclude a mural or extrinsic lesion.",
          "teachingPoint": "Impaired junction relaxation with very low contractile measurements supports an achalasia motor pattern. Weight loss and marked endoscopic resistance still require targeted CT or endoscopic ultrasound for a secondary junction lesion before dilation or myotomy. A normal mucosal view does not exclude a mural or extrinsic lesion.",
          "exhibit": {
            "kind": "keyValue",
            "caption": "Investigation record; pressure values are constructed teaching observations",
            "items": [
              {
                "label": "Endoscopy addendum",
                "value": "Marked resistance while crossing the gastroesophageal junction."
              },
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
          "sourceLabels": [
            "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
            "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.qq20261102b.b04.d1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "The motor-pattern interpretation is appropriate, but treatment before secondary-cause assessment closes the investigation prematurely.",
              "sourceLabels": [
                "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
                "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
                "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
                "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b04.d2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "The secondary-cause investigation is appropriate, but the very low contractions with impaired junction relaxation are not preserved effective peristalsis.",
              "sourceLabels": [
                "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
                "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
                "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
                "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
              ]
            },
            {
              "answerChoiceId": "choice.qq20261102b.b04.d3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "This combines the wrong pressure-pattern interpretation with an unsupported move to junction treatment.",
              "sourceLabels": [
                "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
                "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
                "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
                "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question. Impaired junction relaxation with very low contractile measurements supports an achalasia motor pattern. Weight loss and marked endoscopic resistance still require targeted CT or endoscopic ultrasound for a secondary junction lesion before dilation or myotomy. A normal mucosal view does not exclude a mural or extrinsic lesion."
    },
    {
      "id": "case.gs028.varicose-veins.paired-aching-standing",
      "displayName": "Symptomatic varicose veins",
      "patientPresentationVariantId": "presentation.gs028.varicose-veins.paired-aching-standing.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Aching leg veins",
      "presentation": "{patientName}, a 43-year-old woman, attends the clinic for calf aching and prominent veins after standing at work.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.female.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old woman, attends the clinic for calf aching and prominent veins after standing at work."
        },
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.male.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old man, attends the clinic for calf aching and prominent veins after standing at work."
        },
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.female.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old woman, attends the clinic for calf aching and prominent veins after standing at work."
        },
        {
          "id": "profile.gs028.varicose-veins.paired-aching-standing.male.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old man, attends the clinic for calf aching and prominent veins after standing at work."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "SVS/AVF/AVLS varicose veins guideline Part I",
        "SVS/AVF/AVLS varicose veins guideline Part II"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028.varicose-veins.paired-aching-standing.1",
          "questionVariantId": "question.varicose-veins.reflux-duplex-evaluation.v1",
          "primaryConceptId": "concept.varicose-veins.reflux-duplex-evaluation",
          "stem": "Which study should map the venous problem before treatment planning?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Venous reflux duplex",
              "isCorrect": true,
              "serviceRequest": {
                "serviceId": "service.venous_duplex"
              }
            },
            {
              "id": "d1_1",
              "label": "Resting ankle-brachial index",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Lower-extremity CT",
              "isCorrect": false,
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "D-dimer assay",
              "isCorrect": false,
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Select a venous reflux duplex for symptomatic varicose veins being considered for treatment.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": {
            "id": "gate.gs028.aching-standing",
            "resultTypeId": "service.venous_duplex",
            "pendingLabel": "Venous reflux duplex pending",
            "resultNarrative": "Duplex documents superficial axial reflux and no acute deep venous thrombosis.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.venous_duplex.in_house",
              "route.venous_duplex.outsourced"
            ]
          },
          "terminalDispositions": []
        },
        {
          "id": "node.gs028.varicose-veins.paired-aching-standing.2",
          "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.r1",
          "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
          "currentUpdate": "Reflux duplex documents great-saphenous axial reflux. The venous clinic records suitability for intervention. {patientName} has tried leg elevation, remains limited at work, and wishes to discuss a procedure after reviewing the alternatives.",
          "stem": "Which plan should be offered for {patientName}'s symptomatic varicose veins?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Refer to the vascular surgery clinic",
              "isCorrect": true,
              "rationale": "The duplex demonstrates truncal reflux; persistent symptoms and an informed treatment preference support venous-service referral. The specialist selects the technique.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Prescribe graduated compression stockings before referral",
              "isCorrect": false,
              "rationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Arrange ultrasound-guided tributary sclerotherapy",
              "isCorrect": false,
              "rationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Refer to the venous service for truncal-intervention planning. Symptomatic axial reflux and an informed treatment preference support referral without a compulsory prolonged compression course. Compression remains an option; the exact technique follows specialist anatomy review.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            }
          ],
          "teachingPoint": "Refer to the venous service for truncal-intervention planning. Symptomatic axial reflux and an informed treatment preference support referral without a compulsory prolonged compression course. Compression remains an option; the exact technique follows specialist anatomy review."
        }
      ],
      "learningSummary": "Select a venous reflux duplex for symptomatic varicose veins being considered for treatment. Refer to the venous service for truncal-intervention planning. Symptomatic axial reflux and an informed treatment preference support referral without a compulsory prolonged compression course. Compression remains an option; the exact technique follows specialist anatomy review."
    },
    {
      "id": "case.gs028.varicose-veins.b-prefers-conservative",
      "displayName": "Symptomatic varicose veins",
      "patientPresentationVariantId": "presentation.gs028.varicose-veins.b-prefers-conservative.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Prefer nonsurgical care",
      "presentation": "{patientName}, a 43-year-old woman, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old woman, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
        },
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old man, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
        },
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old woman, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
        },
        {
          "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old man, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "SVS/AVF/AVLS varicose veins guideline Part I",
        "SVS/AVF/AVLS varicose veins guideline Part II"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028.varicose-veins.b-prefers-conservative.1",
          "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r1",
          "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
          "stem": "Which plan should be offered for {patientName}'s varicose-vein symptoms?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Prescribe graduated compression stockings",
              "isCorrect": true,
              "rationale": "A concrete conservative treatment fits the informed decision to avoid a procedure. No universal garment strength or treatment duration is specified.",
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "Refer for endovenous truncal-ablation planning",
              "isCorrect": false,
              "rationale": "Ablation is an intervention pathway; documented reflux does not override a capable patient's informed refusal.",
              "serviceRequest": null
            },
            {
              "id": "d2_3",
              "label": "Arrange ultrasound-guided tributary sclerotherapy",
              "isCorrect": false,
              "rationale": "Sclerotherapy remains a procedure and does not implement the stated preference for nonprocedural symptom care.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Offer graduated compression as a specific conservative option. Axial reflux does not make intervention compulsory when symptoms and informed preference support conservative care. Both ablation planning and sclerotherapy pursue a procedural pathway.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part I",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Ablation is an intervention pathway; documented reflux does not override a capable patient's informed refusal.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Sclerotherapy remains a procedure and does not implement the stated preference for nonprocedural symptom care.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part I",
                "SVS/AVF/AVLS varicose veins guideline Part II"
              ]
            }
          ],
          "teachingPoint": "Offer graduated compression as a specific conservative option. Axial reflux does not make intervention compulsory when symptoms and informed preference support conservative care. Both ablation planning and sclerotherapy pursue a procedural pathway."
        }
      ],
      "learningSummary": "Offer graduated compression as a specific conservative option. Axial reflux does not make intervention compulsory when symptoms and informed preference support conservative care. Both ablation planning and sclerotherapy pursue a procedural pathway."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.paired-single-albumin.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Surgery risk review",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1.r1",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which assessment and plan best fit {patientName}'s proposed hernia operation?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Changed liver state; optimize before elective repair",
              "isCorrect": true,
              "rationale": "The new fluid requires assessment of decompensation despite the albumin result; the reducing hernia permits a nonurgent optimization plan.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Changed liver state; proceed with elective repair",
              "isCorrect": false,
              "rationale": "Recognizing the changed state should change the elective plan rather than leave clearance unchanged.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Stable liver state; optimize before elective repair",
              "isCorrect": false,
              "rationale": "Optimization is the appropriate direction, but the record does not show an unchanged liver-related state.",
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "Stable liver state; proceed with elective repair",
              "isCorrect": false,
              "rationale": "A reassuring albumin does not account for the new fluid or justify unchanged elective clearance.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Interval examination",
                "value": "Abdominal girth has increased; shifting dullness is present."
              },
              {
                "label": "Abdominal ultrasound",
                "value": "New free intraperitoneal fluid."
              },
              {
                "label": "Hernia examination",
                "value": "Soft, nontender bulge that reduces when supine."
              }
            ]
          },
          "teachingPoint": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery."
        },
        {
          "id": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.2",
          "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r3",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
          "currentUpdate": "Before the planned liver-team visit, {patientName} develops vomiting and increasing pain at the umbilical bulge. The bulge no longer reduces. CT shows bowel within the hernia, dilated upstream bowel and collapsed downstream bowel.",
          "stem": "Which next step should be arranged for {patientName}'s changed abdominal findings?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Urgent hospital surgical assessment",
              "isCorrect": true,
              "rationale": "New pain, irreducibility, vomiting and the bowel transition change the problem from nonurgent optimization to an acute surgical assessment.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Expedited outpatient therapeutic paracentesis",
              "isCorrect": false,
              "rationale": "Addressing ascites does not resolve the new incarcerated bowel-containing hernia and obstructive pattern.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Scheduled hepatology–anesthesia optimization",
              "isCorrect": false,
              "rationale": "That was appropriate for the earlier reducing, nonurgent hernia, but the new clinical and CT findings require a different sequence.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Addressing ascites does not resolve the new incarcerated bowel-containing hernia and obstructive pattern.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "That was appropriate for the earlier reducing, nonurgent hernia, but the new clinical and CT findings require a different sequence.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ],
          "teachingPoint": "The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation."
        }
      ],
      "learningSummary": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery. The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.a-compensated",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-compensated.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Elective surgery planning",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.a-compensated.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2.r1",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "How should {patientName}'s previous operative-risk assessment be used?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Retain the liver-state description; reassess the proposed procedure",
              "isCorrect": true,
              "rationale": "The liver information remains useful, but the changed operation requires a new procedure-specific, multidisciplinary risk assessment.",
              "serviceRequest": null
            },
            {
              "id": "d1_2",
              "label": "Retain the liver-state description; retain the previous clearance",
              "isCorrect": false,
              "rationale": "Stable liver-related findings do not make clearance transferable between substantially different operations.",
              "serviceRequest": null
            },
            {
              "id": "d2_2",
              "label": "Record interval liver deterioration; reassess the proposed procedure",
              "isCorrect": false,
              "rationale": "The operation needs reassessment, but the supplied record does not establish interval liver deterioration.",
              "serviceRequest": null
            },
            {
              "id": "d3_2",
              "label": "Record interval liver deterioration; retain the previous clearance",
              "isCorrect": false,
              "rationale": "Neither the proposed deterioration nor transfer of the earlier clearance is supported by the record.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The supplied findings do not establish interval liver deterioration. They also do not make a local skin-procedure assessment transferable to an open abdominal operation. Reassess the procedure, comorbidity and center factors alongside the retained liver data.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Stable liver-related findings do not make clearance transferable between substantially different operations.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "The operation needs reassessment, but the supplied record does not establish interval liver deterioration.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d3_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Neither the proposed deterioration nor transfer of the earlier clearance is supported by the record.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Liver-related course",
                "value": "Albumin, bilirubin and INR are unchanged. No interval fluid accumulation, confusion or gastrointestinal bleeding is reported."
              },
              {
                "label": "Proposed procedure",
                "value": "Open abdominal resection under general anesthesia rather than the previous local skin excision."
              }
            ]
          },
          "teachingPoint": "The supplied findings do not establish interval liver deterioration. They also do not make a local skin-procedure assessment transferable to an open abdominal operation. Reassess the procedure, comorbidity and center factors alongside the retained liver data."
        }
      ],
      "learningSummary": "The supplied findings do not establish interval liver deterioration. They also do not make a local skin-procedure assessment transferable to an open abdominal operation. Reassess the procedure, comorbidity and center factors alongside the retained liver data."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Preoperative cirrhosis consult",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r7",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which risk domain is demonstrated by {patientName}'s record but not represented by that laboratory summary?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Portal hypertension and decompensation history",
              "isCorrect": true,
              "rationale": "Prior bleeding varices, persistent thrombocytopenia and splenic enlargement preserve the importance of portal-hypertension history.",
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "Current hepatic synthetic function",
              "isCorrect": false,
              "rationale": "Albumin and INR already address this domain in the referral summary; they do not replace the clinical history.",
              "serviceRequest": null
            },
            {
              "id": "d2_3",
              "label": "Current cardiopulmonary functional reserve",
              "isCorrect": false,
              "rationale": "This is another relevant preoperative domain, but it is not the domain demonstrated by the supplied endoscopic and splenic record.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Bleeding esophageal varices document a prior portal-hypertension complication. That history remains relevant when current laboratory values look reassuring. Risk review must still integrate the planned operation, comorbidities and center experience; these findings do not supply an exact operative-risk estimate.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Albumin and INR already address this domain in the referral summary; they do not replace the clinical history.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "This is another relevant preoperative domain, but it is not the domain demonstrated by the supplied endoscopic and splenic record.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Prior admission",
                "value": "Hematemesis; endoscopy identified bleeding esophageal varices treated with band ligation."
              },
              {
                "label": "Current record",
                "value": "No new gastrointestinal bleeding; platelet count remains low and the spleen is enlarged."
              }
            ]
          },
          "teachingPoint": "Bleeding esophageal varices document a prior portal-hypertension complication. That history remains relevant when current laboratory values look reassuring. Risk review must still integrate the planned operation, comorbidities and center experience; these findings do not supply an exact operative-risk estimate."
        }
      ],
      "learningSummary": "Bleeding esophageal varices document a prior portal-hypertension complication. That history remains relevant when current laboratory values look reassuring. Risk review must still integrate the planned operation, comorbidities and center experience; these findings do not supply an exact operative-risk estimate."
    },
    {
      "id": "case.gs028b.cirrhosis-perioperative.a-center-expertise",
      "displayName": "Perioperative cirrhosis",
      "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-center-expertise.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Where to have surgery",
      "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
        },
        {
          "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "AGA perioperative cirrhosis clinical practice update"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.cirrhosis-perioperative.a-center-expertise.1",
          "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4.r1",
          "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
          "stem": "Which timing and care-setting plan best fits {patientName}'s operation?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Optimize first; arrange surgery at a cirrhosis-experienced center",
              "isCorrect": true,
              "rationale": "The changed liver-related state calls for optimization; the reconstruction also warrants an experienced multidisciplinary setting.",
              "serviceRequest": null
            },
            {
              "id": "d1_4",
              "label": "Operate now; arrange surgery at a cirrhosis-experienced center",
              "isCorrect": false,
              "rationale": "A suitable setting does not remove the need to assess and optimize the new fluid before a nonurgent operation.",
              "serviceRequest": null
            },
            {
              "id": "d2_4",
              "label": "Optimize first; arrange surgery at the referring general hospital",
              "isCorrect": false,
              "rationale": "Optimization is appropriate, but the planned reconstruction and cirrhosis still require review of center experience and rescue resources.",
              "serviceRequest": null
            },
            {
              "id": "d3_4",
              "label": "Operate now; arrange surgery at the referring general hospital",
              "isCorrect": false,
              "rationale": "Neither the interval liver-related change nor the planned setting has been adequately incorporated.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance.",
          "sourceLabels": [
            "AGA perioperative cirrhosis clinical practice update"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "A suitable setting does not remove the need to assess and optimize the new fluid before a nonurgent operation.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Optimization is appropriate, but the planned reconstruction and cirrhosis still require review of center experience and rescue resources.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            },
            {
              "answerChoiceId": "d3_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Neither the interval liver-related change nor the planned setting has been adequately incorporated.",
              "sourceLabels": [
                "AGA perioperative cirrhosis clinical practice update"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Interval findings",
                "value": "New abdominal free fluid on ultrasound and increasing abdominal girth."
              },
              {
                "label": "Operation",
                "value": "Nonurgent; no obstruction or active bleeding is described."
              },
              {
                "label": "Referring hospital",
                "value": "An inpatient surgical ward and intensive care are present. The team performs few operations in patients with cirrhosis; postoperative liver-related complications are transferred to the regional hepatology center."
              }
            ]
          },
          "teachingPoint": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance."
        }
      ],
      "learningSummary": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance."
    },
    {
      "id": "case.gs028b.ptld.b-pathology-returned",
      "displayName": "Owner review for Nora Reed",
      "patientPresentationVariantId": "presentation.owner-decisions.20261112.ptld-biopsy.v2.flags5r1",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Enlarging neck node",
      "presentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.owner-decisions.20261112.ptld-biopsy.v2.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "chiefComplaint": "Enlarging neck node",
          "presentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Comprehensive review of PTLD after solid organ transplantation",
        "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028b.ptld.b-pathology-returned.1",
          "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r5",
          "primaryConceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
          "stem": "Which biopsy and specimen-handling plan should {patientName}'s team request next for suspected post-transplant lymphoproliferative disorder?",
          "answerChoices": [
            {
              "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-split",
              "label": "Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
              "isCorrect": true,
              "rationale": "Excision supplies nodal architecture after inadequate core sampling. The laboratory allocates the specimen under its own protocol, retaining fresh tissue for flow cytometry and fixed tissue for histology.",
              "serviceRequest": null
            },
            {
              "id": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
              "label": "Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
              "isCorrect": false,
              "rationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.",
              "serviceRequest": null
            },
            {
              "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
              "label": "Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies",
              "isCorrect": false,
              "rationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.",
              "serviceRequest": null
            },
            {
              "id": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
              "label": "Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies",
              "isCorrect": false,
              "rationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.",
          "teachingPoint": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.",
          "sourceLabels": [
            "Comprehensive review of PTLD after solid organ transplantation",
            "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the decision and its clinical explanation.",
              "clinicalRationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.",
              "sourceLabels": [
                "Comprehensive review of PTLD after solid organ transplantation",
                "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
              ]
            },
            {
              "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the decision and its clinical explanation.",
              "clinicalRationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.",
              "sourceLabels": [
                "Comprehensive review of PTLD after solid organ transplantation",
                "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
              ]
            },
            {
              "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the decision and its clinical explanation.",
              "clinicalRationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.",
              "sourceLabels": [
                "Comprehensive review of PTLD after solid organ transplantation",
                "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy."
    },
    {
      "id": "case.gs028se.p2e.capacity-refusal.v4.varicose",
      "displayName": "Ethics and communication",
      "patientPresentationVariantId": "presentation.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 68,
        "sexLabel": "Male"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Supported treatment decision",
      "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.68",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        },
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.68",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        },
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.58",
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
          "presentation": "{patientName}, a 58-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        },
        {
          "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.58",
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
          "presentation": "{patientName}, a 58-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 1,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "Informed Consent",
        "Decisions for Adult Patients Who Lack Capacity",
        "SVS/AVF/AVLS varicose veins guideline Part II"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028se.p2e.capacity-refusal.v4.varicose.1",
          "questionVariantId": "question.statistics-ethics.capacity-refusal.v4",
          "primaryConceptId": "concept.statistics-ethics.capacity-refusal",
          "stem": "How should the team approach {patientName}'s decision about a varicose-vein intervention when mild cognitive impairment is recorded but supported understanding is demonstrated?",
          "answerChoices": [
            {
              "id": "key-4",
              "label": "Support and assess the patient's own decision",
              "isCorrect": true,
              "rationale": "Support understanding and assess the patient's own abilities for vein intervention. The described informed, consistent choice should not be displaced solely by the cognitive diagnosis.",
              "serviceRequest": null
            },
            {
              "id": "wrong-4-1",
              "label": "Obtain a surrogate's decision because of the diagnosis",
              "isCorrect": false,
              "rationale": "Cognitive impairment does not eliminate capacity for every decision. Seeking a surrogate solely from that label skips the abilities demonstrated after support.",
              "serviceRequest": null
            },
            {
              "id": "wrong-4-2",
              "label": "Require a family countersignature for this consent",
              "isCorrect": false,
              "rationale": "A family countersignature does not replace assessing the patient's supported understanding and choice. The diagnosis alone does not establish that another person must validate consent.",
              "serviceRequest": null
            },
            {
              "id": "wrong-4-3",
              "label": "Require formal testing before discussing the choice",
              "isCorrect": false,
              "rationale": "The supplied discussion already demonstrates relevant abilities with support. A blanket testing requirement based on the diagnosis does not address those actual abilities.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded.",
          "teachingPoint": "Cognitive impairment does not remove capacity for every decision. Support understanding and assess the patient's actual abilities for this choice before seeking a substitute decision-maker. Plain language enables an informed, consistent choice. Remember that the diagnosis and the decision are separate questions; a label alone does not transfer authority to family or a surrogate.",
          "sourceLabels": [
            "Informed Consent",
            "Decisions for Adult Patients Who Lack Capacity",
            "SVS/AVF/AVLS varicose veins guideline Part II"
          ],
          "resultGateAfter": null,
          "terminalDispositions": []
        },
        {
          "id": "node.gs028se.p2e.capacity-refusal.v4.varicose.2",
          "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4.r1",
          "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
          "currentUpdate": "Duplex confirms axial superficial reflux. The calf symptoms continue to limit standing. The venous clinic records suitability for intervention, and {patientName} chooses to discuss a procedure after reviewing compression and procedural options.",
          "stem": "Which plan should be offered for {patientName}'s symptomatic varicose veins?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Refer to the vascular surgery clinic",
              "isCorrect": true,
              "rationale": "The duplex demonstrates truncal reflux; persistent symptoms and an informed treatment preference support venous-service referral. The specialist selects the technique.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Prescribe graduated compression stockings before referral",
              "isCorrect": false,
              "rationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Arrange ultrasound-guided tributary sclerotherapy",
              "isCorrect": false,
              "rationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Refer for truncal-intervention planning. Documented axial reflux and persistent bothersome symptoms support that referral when the patient makes an informed choice for intervention. A prolonged compression course is not a compulsory prerequisite. The exact technique remains a venous-specialist decision.",
          "teachingPoint": "Refer for truncal-intervention planning. Documented axial reflux and persistent bothersome symptoms support that referral when the patient makes an informed choice for intervention. A prolonged compression course is not a compulsory prerequisite. The exact technique remains a venous-specialist decision.",
          "sourceLabels": [
            "SVS/AVF/AVLS varicose veins guideline Part II",
            "Informed Consent",
            "Decisions for Adult Patients Who Lack Capacity"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part II",
                "Informed Consent",
                "Decisions for Adult Patients Who Lack Capacity"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
              "sourceLabels": [
                "SVS/AVF/AVLS varicose veins guideline Part II",
                "Informed Consent",
                "Decisions for Adult Patients Who Lack Capacity"
              ]
            }
          ]
        }
      ],
      "learningSummary": "Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded. Refer for truncal-intervention planning. Documented axial reflux and persistent bothersome symptoms support that referral when the patient makes an informed choice for intervention. A prolonged compression course is not a compulsory prerequisite. The exact technique remains a venous-specialist decision."
    },
    {
      "id": "case.gs028c.palpable-breast.paired-scar-edge",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 49,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Lump near an old scar",
      "presentation": "{patientName}, a 49-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49.flags5r1",
          "prototypeDemographics": {
            "ageYears": 49,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 49-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar."
        },
        {
          "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63.flags5r1",
          "prototypeDemographics": {
            "ageYears": 63,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 63-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.paired-scar-edge.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r1",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "Which imaging study should be requested next for {patientName}'s palpable breast finding?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Targeted breast ultrasound",
              "isCorrect": true,
              "rationale": "A reproducible palpable target requires site-directed ultrasound when the diagnostic mammogram provides no correlate.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_2",
              "label": "Diagnostic mammographic spot-compression views",
              "isCorrect": false,
              "rationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            },
            {
              "id": "d2_2",
              "label": "Contrast-enhanced breast MRI",
              "isCorrect": false,
              "rationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The stable mammographic scar does not explain a new discrete clinical target. Request ultrasound directed to the palpable site. MRI or further mammographic views do not replace that site-specific next step.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": {
            "id": "gate.gs028c.scar-edge",
            "resultTypeId": "service.ultrasound",
            "pendingLabel": "Focused scar-edge ultrasound pending",
            "resultNarrative": "Ultrasound at the marked palpable site shows no solid or cystic correlate. The same hard, irregular scar-edge mass remains palpable.",
            "readiness": "all",
            "allowedServiceRouteIds": [
              "route.ultrasound.in_house",
              "route.ultrasound.outsourced"
            ]
          },
          "terminalDispositions": [],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Diagnostic mammogram",
                "value": "The skin marker overlies the palpable site. Scar distortion is unchanged from prior images; no new mass or suspicious calcifications at the marker."
              },
              {
                "label": "Examination",
                "value": "The same focal lump is reproducible at the scar edge."
              }
            ]
          },
          "teachingPoint": "The stable mammographic scar does not explain a new discrete clinical target. Request ultrasound directed to the palpable site. MRI or further mammographic views do not replace that site-specific next step."
        },
        {
          "id": "node.gs028c.palpable-breast.paired-scar-edge.2",
          "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r1",
          "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
          "currentUpdate": "Ultrasound at the marked palpable site shows no solid or cystic correlate. Mammographic scar distortion is unchanged. The surgeon still finds the same distinctly hard, irregular scar-edge mass.",
          "stem": "Which diagnostic procedure should be arranged next for {patientName}'s persistent breast mass?",
          "answerChoices": [
            {
              "id": "correct_2",
              "label": "Palpation-directed core or surgical biopsy",
              "isCorrect": true,
              "rationale": "The persistent concerning clinical target requires tissue diagnosis even without an imaging correlate; the breast team selects the feasible technique.",
              "serviceRequest": null
            },
            {
              "id": "d1_2",
              "label": "Contrast-enhanced breast MRI",
              "isCorrect": false,
              "rationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d2_2",
              "label": "Repeat site-directed breast ultrasound",
              "isCorrect": false,
              "rationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "A hard, irregular palpable target remains clinically concerning despite site-concordant imaging without a correlate. Arrange palpation-directed core or surgical biopsy through the breast team. Repeating ultrasound or substituting MRI does not provide the required tissue diagnosis.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_2",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ],
          "teachingPoint": "A hard, irregular palpable target remains clinically concerning despite site-concordant imaging without a correlate. Arrange palpation-directed core or surgical biopsy through the breast team. Repeating ultrasound or substituting MRI does not provide the required tissue diagnosis."
        }
      ],
      "learningSummary": "The stable mammographic scar does not explain a new discrete clinical target. Request ultrasound directed to the palpable site. MRI or further mammographic views do not replace that site-specific next step. A hard, irregular palpable target remains clinically concerning despite site-concordant imaging without a correlate. Arrange palpation-directed core or surgical biopsy through the breast team. Repeating ultrasound or substituting MRI does not provide the required tissue diagnosis."
    },
    {
      "id": "case.gs028c.palpable-breast.a-recent-negative",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-recent-negative.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
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
      "chiefComplaint": "Lump after normal imaging",
      "presentation": "{patientName}, a 42-year-old woman, attends clinic for a discrete mobile breast lump that the surgeon can reproduce.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.a-recent-negative.female.42.flags5r1",
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
          "presentation": "{patientName}, a 42-year-old woman, attends clinic for a discrete mobile breast lump that the surgeon can reproduce."
        },
        {
          "id": "profile.gs028c.palpable-breast.a-recent-negative.female.55.flags5r1",
          "prototypeDemographics": {
            "ageYears": 55,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 55-year-old woman, attends clinic for a discrete mobile breast lump that the surgeon can reproduce."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.a-recent-negative.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r1",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "Which imaging study should be requested next for {patientName}'s palpable breast finding?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Targeted breast ultrasound",
              "isCorrect": true,
              "rationale": "A reproducible palpable target requires site-directed ultrasound when the diagnostic mammogram provides no correlate.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_3",
              "label": "Diagnostic mammographic spot-compression views",
              "isCorrect": false,
              "rationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            },
            {
              "id": "d2_3",
              "label": "Contrast-enhanced breast MRI",
              "isCorrect": false,
              "rationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "Request ultrasound targeted to the persistent clinical site. The mammogram documents no correlate at that location; it does not remove the palpable target. MRI and repeating mammographic views are not the preferred next study in this sequence.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Diagnostic mammogram",
                "value": "The marked palpable site is included. No corresponding mass, architectural distortion or suspicious calcifications."
              },
              {
                "label": "Clinical localization",
                "value": "The examination and mammographic skin marker identify the same focal site."
              }
            ]
          },
          "teachingPoint": "Request ultrasound targeted to the persistent clinical site. The mammogram documents no correlate at that location; it does not remove the palpable target. MRI and repeating mammographic views are not the preferred next study in this sequence."
        }
      ],
      "learningSummary": "Request ultrasound targeted to the persistent clinical site. The mammogram documents no correlate at that location; it does not remove the palpable target. MRI and repeating mammographic views are not the preferred next study in this sequence."
    },
    {
      "id": "case.gs028c.palpable-breast.a-discordant-exam",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-discordant-exam.flags5r1",
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
      "chiefComplaint": "Imaging does not explain lump",
      "presentation": "{patientName}, a 47-year-old woman, attends clinic for focal breast thickening reproduced on two examinations.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47.flags5r1",
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
          "presentation": "{patientName}, a 47-year-old woman, attends clinic for focal breast thickening reproduced on two examinations."
        },
        {
          "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61.flags5r1",
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
          "presentation": "{patientName}, a 61-year-old woman, attends clinic for focal breast thickening reproduced on two examinations."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.a-discordant-exam.1",
          "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r3",
          "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
          "stem": "Which imaging study should be requested next for {patientName}'s palpable breast finding?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Targeted breast ultrasound",
              "isCorrect": true,
              "rationale": "A reproducible palpable target requires site-directed ultrasound when the diagnostic mammogram provides no correlate.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            },
            {
              "id": "d1_4",
              "label": "Diagnostic mammographic spot-compression views",
              "isCorrect": false,
              "rationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
              "serviceRequest": {
                "serviceId": "service.diagnostic_breast_imaging"
              }
            },
            {
              "id": "d2_4",
              "label": "Contrast-enhanced breast MRI",
              "isCorrect": false,
              "rationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The examination supplies a persistent target despite the absent mammographic correlate. Request ultrasound of that exact area. Neither routine screening nor a problem-solving MRI substitutes for the targeted next study.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Diagnostic mammogram",
                "value": "Views include the skin-marked area. No focal density, architectural distortion or suspicious calcifications at that site."
              },
              {
                "label": "Examination",
                "value": "The same discrete area of thickening remains palpable."
              }
            ]
          },
          "teachingPoint": "The examination supplies a persistent target despite the absent mammographic correlate. Request ultrasound of that exact area. Neither routine screening nor a problem-solving MRI substitutes for the targeted next study."
        }
      ],
      "learningSummary": "The examination supplies a persistent target despite the absent mammographic correlate. Request ultrasound of that exact area. Neither routine screening nor a problem-solving MRI substitutes for the targeted next study."
    },
    {
      "id": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
      "displayName": "Persistent palpable breast finding",
      "patientPresentationVariantId": "presentation.gs028c.palpable-breast.b-enlarging-negative-imaging.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 43,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Enlarging breast mass",
      "presentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.43.flags5r1",
          "prototypeDemographics": {
            "ageYears": 43,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
        },
        {
          "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.57.flags5r1",
          "prototypeDemographics": {
            "ageYears": 57,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 57-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "ACR Appropriateness Criteria: Palpable Breast Masses"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028c.palpable-breast.b-enlarging-negative-imaging.1",
          "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r1",
          "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
          "stem": "Which diagnostic procedure should be arranged next for {patientName}'s persistent breast mass?",
          "answerChoices": [
            {
              "id": "correct_3",
              "label": "Palpation-directed core or surgical biopsy",
              "isCorrect": true,
              "rationale": "The persistent concerning clinical target requires tissue diagnosis even without an imaging correlate; the breast team selects the feasible technique.",
              "serviceRequest": null
            },
            {
              "id": "d1_3",
              "label": "Contrast-enhanced breast MRI",
              "isCorrect": false,
              "rationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
              "serviceRequest": {
                "serviceId": "service.breast_mri"
              }
            },
            {
              "id": "d2_3",
              "label": "Repeat site-directed breast ultrasound",
              "isCorrect": false,
              "rationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
              "serviceRequest": {
                "serviceId": "service.ultrasound"
              }
            }
          ],
          "shuffleAnswers": true,
          "explanation": "The enlarging clinical target requires tissue diagnosis despite completed site-concordant imaging without a correlate. Request palpation-directed core or surgical biopsy through the breast team. A repeat ultrasound or MRI cannot be used to dismiss that clinical target.",
          "sourceLabels": [
            "ACR Appropriateness Criteria: Palpable Breast Masses"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            },
            {
              "answerChoiceId": "d2_3",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
              "sourceLabels": [
                "ACR Appropriateness Criteria: Palpable Breast Masses"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "Diagnostic mammogram",
                "value": "The palpable skin marker is included; no corresponding mass, distortion or suspicious calcifications."
              },
              {
                "label": "Targeted ultrasound",
                "value": "The surgeon's marked site was scanned; no corresponding solid or cystic lesion."
              },
              {
                "label": "Repeat examination",
                "value": "The same discrete mass remains palpable and is larger than on the previous examination."
              }
            ]
          },
          "teachingPoint": "The enlarging clinical target requires tissue diagnosis despite completed site-concordant imaging without a correlate. Request palpation-directed core or surgical biopsy through the breast team. A repeat ultrasound or MRI cannot be used to dismiss that clinical target."
        }
      ],
      "learningSummary": "The enlarging clinical target requires tissue diagnosis despite completed site-concordant imaging without a correlate. Request palpation-directed core or surgical biopsy through the breast team. A repeat ultrasound or MRI cannot be used to dismiss that clinical target."
    },
    {
      "id": "case.gs028d.anesthesia.a-snoring-surgery",
      "displayName": "Preanesthetic planning",
      "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-snoring-surgery.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 44,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Surgery sleep screening",
      "presentation": "{patientName}, a 44-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.44.flags5r1",
          "prototypeDemographics": {
            "ageYears": 44,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 44-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
        },
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.44.flags5r1",
          "prototypeDemographics": {
            "ageYears": 44,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 44-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
        },
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.63.flags5r1",
          "prototypeDemographics": {
            "ageYears": 63,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 63-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
        },
        {
          "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.63.flags5r1",
          "prototypeDemographics": {
            "ageYears": 63,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 63-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
        "JSA guideline for management of malignant hyperthermia in 2025",
        "Perioperative Management of MH Suspected or Susceptible Patients"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028d.anesthesia.a-snoring-surgery.1",
          "questionVariantId": "question.preoperative-osa.validated-risk-screening.v1.r1",
          "primaryConceptId": "concept.preoperative-osa.validated-risk-screening",
          "stem": "Which interpretation should be recorded for {patientName}'s perioperative planning?",
          "answerChoices": [
            {
              "id": "correct_1",
              "label": "Increased OSA probability; diagnosis unconfirmed",
              "isCorrect": true,
              "rationale": "STOP-Bang assesses OSA probability. A reassuring sleepiness report does not override it, and neither screen establishes a diagnosis.",
              "serviceRequest": null
            },
            {
              "id": "d1_1",
              "label": "Increased OSA probability; diagnosis confirmed",
              "isCorrect": false,
              "rationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
              "serviceRequest": null
            },
            {
              "id": "d2_1",
              "label": "Low OSA probability; diagnosis unconfirmed",
              "isCorrect": false,
              "rationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
              "serviceRequest": null
            },
            {
              "id": "d3_1",
              "label": "Low OSA probability; diagnosis confirmed",
              "isCorrect": false,
              "rationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result.",
          "sourceLabels": [
            "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
            "JSA guideline for management of malignant hyperthermia in 2025",
            "Perioperative Management of MH Suspected or Susceptible Patients"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d2_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d3_1",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "STOP-Bang report",
                "value": "Flagged by the validated screening tool."
              },
              {
                "label": "Epworth Sleepiness Scale report",
                "value": "Not flagged for increased daytime sleepiness."
              },
              {
                "label": "Diagnostic testing",
                "value": "No diagnostic sleep-study result is recorded."
              }
            ]
          },
          "teachingPoint": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result."
        }
      ],
      "learningSummary": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result."
    },
    {
      "id": "case.gs028d.anesthesia.a-validated-not-impression",
      "displayName": "Preanesthetic planning",
      "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-validated-not-impression.flags5r1",
      "releasePointId": "release.l0.clinic_evaluation",
      "patientDisplayName": "{patientName}",
      "prototypeDemographics": {
        "ageYears": 46,
        "sexLabel": "Female"
      },
      "prototypeVitalSigns": {
        "heartRateBpm": 76,
        "systolicBloodPressureMmHg": 118,
        "diastolicBloodPressureMmHg": 74,
        "temperatureF": 98.4,
        "oxygenSaturationPercent": 99
      },
      "chiefComplaint": "Preop sleep concern",
      "presentation": "{patientName}, a 46-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported.",
      "approvedInstantiationProfiles": [
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46.flags5r1",
          "prototypeDemographics": {
            "ageYears": 46,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 46-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
        },
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46.flags5r1",
          "prototypeDemographics": {
            "ageYears": 46,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 46-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
        },
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Female"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
        },
        {
          "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68.flags5r1",
          "prototypeDemographics": {
            "ageYears": 68,
            "sexLabel": "Male"
          },
          "prototypeVitalSigns": {
            "heartRateBpm": 76,
            "systolicBloodPressureMmHg": 118,
            "diastolicBloodPressureMmHg": 74,
            "temperatureF": 98.4,
            "oxygenSaturationPercent": 99
          },
          "presentation": "{patientName}, a 68-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
        }
      ],
      "tutorialEligible": false,
      "routineEligible": true,
      "earliestFacilityStage": 0,
      "requiredClinicalSetting": "clinic",
      "requiredCapabilityIds": [],
      "rewardTierId": "reward.clinic_basic",
      "sourceLabels": [
        "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
        "JSA guideline for management of malignant hyperthermia in 2025",
        "Perioperative Management of MH Suspected or Susceptible Patients"
      ],
      "decisionNodes": [
        {
          "id": "node.gs028d.anesthesia.a-validated-not-impression.1",
          "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r6",
          "primaryConceptId": "concept.preoperative-osa.validated-risk-screening",
          "stem": "Which interpretation should be recorded for {patientName}'s perioperative planning?",
          "answerChoices": [
            {
              "id": "correct_4",
              "label": "Increased OSA probability; diagnosis unconfirmed",
              "isCorrect": true,
              "rationale": "STOP-Bang assesses OSA probability. A reassuring sleepiness report does not override it, and neither screen establishes a diagnosis.",
              "serviceRequest": null
            },
            {
              "id": "d1_4",
              "label": "Increased OSA probability; diagnosis confirmed",
              "isCorrect": false,
              "rationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
              "serviceRequest": null
            },
            {
              "id": "d2_4",
              "label": "Low OSA probability; diagnosis unconfirmed",
              "isCorrect": false,
              "rationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
              "serviceRequest": null
            },
            {
              "id": "d3_4",
              "label": "Low OSA probability; diagnosis confirmed",
              "isCorrect": false,
              "rationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
              "serviceRequest": null
            }
          ],
          "shuffleAnswers": true,
          "explanation": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result.",
          "sourceLabels": [
            "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
            "JSA guideline for management of malignant hyperthermia in 2025",
            "Perioperative Management of MH Suspected or Susceptible Patients"
          ],
          "resultGateAfter": null,
          "terminalDispositions": [
            {
              "answerChoiceId": "d1_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d2_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            },
            {
              "answerChoiceId": "d3_4",
              "kind": "no_terminal_outcome",
              "consequenceNarrative": "Review the clinical interpretation before continuing.",
              "clinicalRationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
              "sourceLabels": [
                "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                "JSA guideline for management of malignant hyperthermia in 2025",
                "Perioperative Management of MH Suspected or Susceptible Patients"
              ]
            }
          ],
          "exhibit": {
            "kind": "keyValue",
            "caption": "Constructed clinical record",
            "items": [
              {
                "label": "STOP-Bang report",
                "value": "Flagged by the validated screening tool."
              },
              {
                "label": "Epworth Sleepiness Scale report",
                "value": "Not flagged for increased daytime sleepiness."
              },
              {
                "label": "Diagnostic testing",
                "value": "No diagnostic sleep-study result is recorded."
              }
            ]
          },
          "teachingPoint": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result."
        }
      ],
      "learningSummary": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result."
    }
  ],
  "concepts": [
    {
      "id": "concept.achalasia.manometric-recognition",
      "displayName": "Manometric recognition of achalasia",
      "learningObjective": "Recognize achalasia from absent peristalsis and impaired esophagogastric-junction relaxation without relying on an unsupported numeric threshold.",
      "earliestFacilityStage": 1,
      "conceptType": "diagnosis"
    },
    {
      "id": "concept.varicose-veins.reflux-duplex-evaluation",
      "displayName": "Venous reflux duplex evaluation",
      "learningObjective": "Select disease-specific reflux duplex for symptomatic varicose veins.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.varicose-veins.intervention-referral-after-axial-reflux",
      "displayName": "Referral after documented axial reflux",
      "learningObjective": "Use findings, candidacy, and preference to choose intervention referral or conservative care.",
      "earliestFacilityStage": 1,
      "conceptType": "management"
    },
    {
      "id": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
      "displayName": "Assess perioperative cirrhosis risk",
      "learningObjective": "Use multidimensional liver, patient, procedure, and facility factors in perioperative cirrhosis assessment.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.statistics-ethics.capacity-refusal",
      "displayName": "Respect capable refusal",
      "learningObjective": "Distinguish an unwelcome choice from impaired decision-making capacity.",
      "earliestFacilityStage": 0,
      "conceptType": "applied_science"
    },
    {
      "id": "concept.palpable-breast.negative-mammogram-targeted-us",
      "displayName": "Targeted ultrasound after negative mammography",
      "learningObjective": "Order targeted ultrasound for an adult at least 40 with a persistent palpable finding after negative diagnostic mammography.",
      "earliestFacilityStage": 0,
      "conceptType": "workup"
    },
    {
      "id": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
      "displayName": "Biopsy suspicious palpable mass despite negative imaging",
      "learningObjective": "Obtain tissue diagnosis for a persistently suspicious palpable mass despite negative mammography and targeted ultrasound.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    },
    {
      "id": "concept.preoperative-osa.validated-risk-screening",
      "displayName": "Screen preoperatively for OSA risk",
      "learningObjective": "Use a validated risk screen and communicate increased OSA probability without treating the screen as a diagnosis.",
      "earliestFacilityStage": 0,
      "conceptType": "diagnosis"
    },
    {
      "id": "concept.achalasia.high-resolution-manometry.v2",
      "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
      "learningObjective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.ptld.node-specimen-and-ancillary-handling.v1",
      "displayName": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
      "learningObjective": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
      "earliestFacilityStage": 1,
      "conceptType": "workup"
    },
    {
      "id": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
      "displayName": "Recognize an acute hernia exception to elective cirrhosis optimization",
      "learningObjective": "Interpret new obstructive hernia findings and choose urgent surgical assessment despite an earlier elective cirrhosis-optimization plan.",
      "earliestFacilityStage": 0,
      "conceptType": "management"
    }
  ],
  "newConcepts": [
    {
      "id": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
      "previousConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary",
      "displayName": "Recognize an acute hernia exception to elective cirrhosis optimization",
      "learningObjective": "Interpret new obstructive hernia findings and choose urgent surgical assessment despite an earlier elective cirrhosis-optimization plan.",
      "conceptType": "management",
      "earliestFacilityStage": 0,
      "educationalTier": 1,
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "evidenceClaimIds": [
        "claim.cirrhosis.optimize-decompensation",
        "claim.qf3.cirrhosis-urgent-hernia-boundary",
        "claim.flags5.20261116.application.08"
      ]
    }
  ],
  "applicationClaims": [
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.01",
      "statement": "Interpret the duplex as axial reflux, then distinguish a reasonable conservative option from a mandatory prerequisite to intervention.",
      "basisClaimIds": [
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary"
      ],
      "sourceIds": [
        "source.varicose.svs-avf-avls-2023"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "The source supports referral, not a universal ablation modality or an exact compression duration. Procedural anatomy remains specialist review.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.02",
      "statement": "Combine the anatomical reflux result with the informed treatment choice to select an actual symptom-management prescription.",
      "basisClaimIds": [
        "claim.varicose.conservative-boundary"
      ],
      "sourceIds": [
        "source.varicose.svs-avf-avls-2023"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "Preference is decision-critical because this node tests the conservative-treatment boundary. This is likely easier than the intervention-sequencing variant; difficulty is not claimed to be validated.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.03",
      "statement": "Apply the venous referral indication after the preserved capacity decision; capacity feedback does not establish the clinical indication.",
      "basisClaimIds": [
        "claim.varicose.intervention-referral",
        "claim.varicose.conservative-boundary",
        "claim.gs028se.capacity-refusal.4",
        "claim.gs028se.capacity-refusal.3"
      ],
      "sourceIds": [
        "source.varicose.svs-avf-avls-2023",
        "source.gs028se.ama-consent-2-1-1",
        "source.gs028se.ama-capacity-2-1-2"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "The earlier capacity question, shared presentation and feedback remain visible and are reproduced for review. This follow-up repeats a narrow venous referral rule and may remain relatively easy.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.04",
      "statement": "Interpret the interval fluid as a changed liver-related state, then combine that change with the nonurgent operation.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation"
      ],
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "Single recorded AGA expert review; no mortality estimate, paracentesis prescription or laboratory cutoff is added.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.05",
      "statement": "Separate unchanged patient/liver data from a changed procedural exposure before deciding whether clearance can be reused.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk"
      ],
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "No risk multiplier or hierarchy of exact operations is taught. The claim supports multidimensional reassessment, not a numerical risk calculation.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.06",
      "statement": "Interpret the prior endoscopic intervention and current splenic/count findings, then identify the risk domain missing from the referral summary.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk"
      ],
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "The question tests integration of clinical history rather than a treatment or urgency rule. It may remain easier than a full surgical disposition decision; no difficulty PASS is inferred from lint.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.07",
      "statement": "Interpret the changed liver-related findings, then combine timing with the resources required for a complex operation.",
      "basisClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation"
      ],
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "Facility resources are decision-critical because the task explicitly tests the operating setting. They are not an availability sentence added to cue an unrelated test. Single recorded expert-review source.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.08",
      "statement": "Recognize a new obstructive hernia pattern and override a previously reasonable elective optimization sequence.",
      "basisClaimIds": [
        "claim.cirrhosis.optimize-decompensation",
        "claim.qf3.cirrhosis-urgent-hernia-boundary"
      ],
      "sourceIds": [
        "source.cirrhosis.aga-2019"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "The scored objective changes from recognizing the elective decompensation boundary to recognizing its acute surgical exception. A new concept version preserves the old FSRS identity for frozen encounters. No operative technique, ischemia criterion or timing threshold is added.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.09",
      "statement": "Identify which instrument addresses OSA probability, then separate that probability from diagnostic confirmation.",
      "basisClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation"
      ],
      "sourceIds": [
        "source.sasm.osa-screening.2016"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "Reported qualitative outputs are constructed. No instrument items, score, cutoff, cancellation rule or sleep-test threshold is reproduced. This remains a focused screening-interpretation item, not an advanced anesthesia-management scenario.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.10",
      "statement": "Identify which instrument addresses OSA probability, then separate that probability from diagnostic confirmation.",
      "basisClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.qf2.sleep-questionnaire-domain-interpretation"
      ],
      "sourceIds": [
        "source.sasm.osa-screening.2016"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "Reported qualitative outputs are constructed. No instrument items, score, cutoff, cancellation rule or sleep-test threshold is reproduced. This remains a focused screening-interpretation item, not an advanced anesthesia-management scenario.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.11",
      "statement": "Distinguish a stable pre-existing scar finding from the new clinical target, then select the complementary imaging test.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "Constructed report observations replace the summary label. No BI-RADS threshold or blanket MRI prohibition is introduced.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.12",
      "statement": "Recognize that a correctly localized mammogram has not explained the clinical finding, then choose complementary site-directed imaging.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "No sentence announces an omitted ultrasound. Selection still tests a common imaging-sequence rule and may be easier for experienced residents.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.13",
      "statement": "Interpret the report as absence of a mammographic correlate rather than absence of a clinical lesion, then select the next modality.",
      "basisClaimIds": [
        "claim.gs028c.palpable.targeted-us"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "The case supplies actual report observations without stating that ultrasound was not done. No precise performance probability is claimed.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.14",
      "statement": "Confirm that imaging examined the actual clinical site, then resolve the persistent examination–imaging discordance with tissue diagnosis.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "The preceding imaging node and feedback are included in review. The exact biopsy technique remains anatomy- and specialist-dependent.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.15",
      "statement": "Establish site concordance of both studies, then recognize that progressive clinical findings still require tissue diagnosis.",
      "basisClaimIds": [
        "claim.gs028c.palpable.biopsy"
      ],
      "sourceIds": [
        "source.acr.palpable-breast-masses.2022"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "No imaging sensitivity, probability, follow-up interval or preferred biopsy instrument is invented.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.16",
      "statement": "Use accessibility and inadequate architecture to select excision, then preserve fresh and fixed portions for their separate diagnostic roles.",
      "basisClaimIds": [
        "claim.owner-decisions.20261112.ptld-architecture",
        "claim.owner-decisions.20261112.ptld-fresh-flow",
        "claim.owner-decisions.20261112.ptld-fixed-histology"
      ],
      "sourceIds": [
        "source.ptld.frontiers-review-2026",
        "source.owner-decisions.20261112.rcpath-lymphoma-2015"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "Pure deletion of the permission/feasibility sentence. Existing clinician-directed clinical facts, options and explanation are retained; transport/viability remains hematopathology review.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.17",
      "statement": "Check whether the existing pressure acquisition is technically interpretable before choosing the next physiologic assessment.",
      "basisClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.qq20261102c.hrm-incomplete-placement"
      ],
      "sourceIds": [
        "source.sc.seoul-achalasia-2020",
        "source.qq20261102a.chicago",
        "source.qq20261102a.seoul",
        "source.qq20261102c.acg-physiology2020",
        "source.qq20261102c.chicago"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "Previously reviewed task, update, choices, rationale and explanation are unchanged. Only the shared-header test observations move into a concise result exhibit; the later endoscopy addendum remains a later finding.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    },
    {
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.flags5.20261116.application.18",
      "statement": "Interpret impaired relaxation and failed distal contractions, then recognize that the weight loss and junction resistance still require a secondary-cause assessment.",
      "basisClaimIds": [
        "claim.achalasia.manometric-recognition",
        "claim.achalasia.high-resolution-manometry",
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.qq20261102a.failed-contraction-threshold",
        "claim.qq20261102b.secondary-achalasia-assessment"
      ],
      "sourceIds": [
        "source.sc.seoul-achalasia-2020",
        "source.qq20261102.chicago-v4",
        "source.qq20261102a.chicago",
        "source.qq20261102b.acg-achalasia"
      ],
      "evidenceCategory": "evaluation",
      "certainty": "moderate",
      "applicablePopulation": "Only the specified constructed adult flags5 case; fictional reports are case observations, not new guideline thresholds.",
      "limitation": "The recorded pressure values, laboratory-relative threshold and key meaning are unchanged. Concrete investigation/treatment names replace generic planning labels. CT and EUS are offered together because the recorded guideline does not establish a universal preference between them.",
      "lastCheckedOn": "2026-11-16",
      "verificationScope": "Offline application and field-to-claim mapping to existing ledger records. No external source was accessed, no source-access date advanced and no clinical approval inferred."
    }
  ],
  "sources": [
    {
      "contentVersion": "clinical.question-new-n3.2026-11-05.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.varicose.svs-avf-avls-2023",
      "title": "SVS/AVF/AVLS varicose veins guideline Part II",
      "completeCitation": "Gloviczki P, Lawrence PF, Wasan SM, et al. 2023 SVS/AVF/AVLS clinical practice guidelines for management of varicose veins, Part II. J Vasc Surg Venous Lymphat Disord. 2024;12(1):101670. doi:10.1016/j.jvsv.2023.08.011.",
      "organizationOrJournal": "SVS/AVF/AVLS",
      "authors": [
        "Gloviczki P",
        "Lawrence PF",
        "Wasan SM",
        "et al."
      ],
      "publicationYear": 2024,
      "doi": "10.1016/j.jvsv.2023.08.011",
      "pmid": null,
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11523430/",
      "accessedOn": "2026-09-28",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted guidance; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
      "authorityAssessment": "Multisociety guidance for preference-sensitive intervention and conservative care.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.n3.7923492ee07e",
        "claim.n3.c17b4399da8a",
        "claim.flags5.20261116.application.01",
        "claim.flags5.20261116.application.02",
        "claim.flags5.20261116.application.03"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "development-batch.2026-09-29.pre-endoscopy.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.cirrhosis.aga-2019",
      "title": "AGA perioperative cirrhosis clinical practice update",
      "completeCitation": "Northup PG, Friedman LS, Kamath PS. AGA Clinical Practice Update on Surgical Risk Assessment and Perioperative Management in Cirrhosis: Expert Review. Clin Gastroenterol Hepatol. 2019;17(4):595-606. doi:10.1016/j.cgh.2018.09.043.",
      "organizationOrJournal": "American Gastroenterological Association",
      "authors": [
        "Northup PG",
        "Friedman LS",
        "Kamath PS"
      ],
      "publicationYear": 2019,
      "doi": "10.1016/j.cgh.2018.09.043",
      "pmid": "30273751",
      "officialUrl": "https://gastro.org/clinical-guidance/surgical-risk-assessment-and-perioperative-management-in-cirrhosis/",
      "accessedOn": "2026-09-29",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted guidance; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
      "authorityAssessment": "Society expert review; no one score or fixed cutoff is taught.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.cirrhosis.multifactor-risk",
        "claim.cirrhosis.optimize-decompensation",
        "claim.flags5.20261116.application.04",
        "claim.flags5.20261116.application.05",
        "claim.flags5.20261116.application.06",
        "claim.flags5.20261116.application.07",
        "claim.flags5.20261116.application.08"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.ptld.frontiers-review-2026",
      "title": "Comprehensive review of PTLD after solid organ transplantation",
      "completeCitation": "Vargas-Nieto LP, Santoyo-Sarmiento ND, Ballesteros-Garcia M, Calderon-Vasquez AT, Pinto-Rodriguez AD, Robayo-Romero MG, Cormane-Alfaro V, Daza-Buitrago J. Post-transplant lymphoproliferative disorder after solid organ transplantation: a comprehensive review. Front Transplant. 2026;5:1869288. doi:10.3389/frtra.2026.1869288.",
      "organizationOrJournal": "Frontiers in Transplantation",
      "authors": [
        "Lina Patricia Vargas-Nieto",
        "Nicolas David Santoyo-Sarmiento",
        "Maria Ballesteros-Garcia",
        "Angie Tatiana Calderon-Vasquez",
        "Alvaro Daniel Pinto-Rodriguez",
        "Maria Gabriela Robayo-Romero",
        "Valeria Cormane-Alfaro",
        "Jorge Daza-Buitrago"
      ],
      "publicationYear": 2026,
      "doi": "10.3389/frtra.2026.1869288",
      "pmid": null,
      "officialUrl": "https://www.frontiersin.org/journals/transplantation/articles/10.3389/frtra.2026.1869288/full",
      "accessedOn": "2026-11-12",
      "sourceClass": "narrative_review",
      "licenseLabel": "Creative Commons Attribution 4.0",
      "reuseStatus": "cc_by_4_0",
      "reuseNotes": "Authors and original publication credited in the complete citation. https://creativecommons.org/licenses/by/4.0/. Independent factual synthesis. No protected prose, figures, tables or algorithms adapted or retained.",
      "authorityAssessment": "Licensed current narrative synthesis supporting PTLD tissue architecture and the excision preference for an accessible node. Its comparative biopsy statements are expert synthesis, with core accepted when excision is unsuitable.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.owner-decisions.20261112.ptld-architecture",
        "claim.owner-decisions.20261112.ptld-fixed-histology",
        "claim.flags5.20261116.application.16"
      ],
      "verification": {
        "mode": "targeted_factual_verification",
        "checkedOn": "2026-11-12",
        "inheritedMetadataReviewed": true,
        "claimLocations": "Diagnostic approach, tissue biopsy and histopathology section."
      },
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "clinical.owner-row-030.2026-08-06.2",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.acr.palpable-breast-masses.2022",
      "title": "ACR Appropriateness Criteria: Palpable Breast Masses",
      "completeCitation": "American College of Radiology. ACR Appropriateness Criteria: Palpable Breast Masses. Revised 2022.",
      "organizationOrJournal": "American College of Radiology",
      "authors": [
        "American College of Radiology Appropriateness Criteria Expert Panel"
      ],
      "publicationYear": 2022,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://acsearch.acr.org/docs/69495/Narrative",
      "accessedOn": "2026-08-06",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted professional-society guidance",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Use for targeted factual verification and citation only; do not reproduce appropriateness tables or protected explanatory wording.",
      "authorityAssessment": "Authoritative radiology-society guidance for initial imaging of a palpable breast mass within its stated variants.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.breast-mass.under-30.initial-ultrasound",
        "claim.flags5.20261116.application.11",
        "claim.flags5.20261116.application.12",
        "claim.flags5.20261116.application.13",
        "claim.flags5.20261116.application.14",
        "claim.flags5.20261116.application.15"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "development-batch.2026-10-03.coverage-gaps.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.sasm.osa-screening.2016",
      "title": "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
      "completeCitation": "Chung F, Memtsoudis SG, Ramachandran SK, Nagappa M, Opperer M, Cozowicz C, Patrawala S, Lam D, Kumar A, Joshi GP, Fleetham J, Ayas N, Collop N, Doufas AG, Eikermann M, Englesakis M, Gali B, Gay P, Hernandez AV, Kaw R, Kezirian EJ, Malhotra A, Mokhlesi B, Parthasarathy S, Stierer T, Wappler F, Hillman DR, Auckley D. Society of Anesthesia and Sleep Medicine Guidelines on Preoperative Screening and Assessment of Adult Patients With Obstructive Sleep Apnea. Anesth Analg. 2016;123:452-473. doi:10.1213/ANE.0000000000001416.",
      "organizationOrJournal": "Anesthesia & Analgesia / Society of Anesthesia and Sleep Medicine",
      "authors": [
        "F Chung",
        "SG Memtsoudis",
        "SK Ramachandran",
        "M Nagappa",
        "M Opperer",
        "C Cozowicz",
        "S Patrawala",
        "D Lam",
        "A Kumar",
        "GP Joshi",
        "J Fleetham",
        "N Ayas",
        "N Collop",
        "AG Doufas",
        "M Eikermann",
        "M Englesakis",
        "B Gali",
        "P Gay",
        "AV Hernandez",
        "R Kaw",
        "EJ Kezirian",
        "A Malhotra",
        "B Mokhlesi",
        "S Parthasarathy",
        "T Stierer",
        "F Wappler",
        "DR Hillman",
        "D Auckley"
      ],
      "publicationYear": 2016,
      "doi": "10.1213/ANE.0000000000001416",
      "pmid": null,
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4956681/",
      "accessedOn": "2026-10-03",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives 4.0 International; https://creativecommons.org/licenses/by-nc-nd/4.0/; attributed noncommercial sharing only, with no adapted source content",
      "reuseStatus": "cc_by_nc_4_0_restricted",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced.",
      "authorityAssessment": "Specialist guideline; validated screening identifies risk but does not diagnose OSA. No questionnaire or scoring rubric reproduced.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.gs028d.osa.validated-screen",
        "claim.flags5.20261116.application.09",
        "claim.flags5.20261116.application.10"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "clinical.question-new-n2.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.gs028se.ama-consent-2-1-1",
      "title": "Informed Consent",
      "completeCitation": "American Medical Association. Code of Medical Ethics Opinion 2.1.1: Informed Consent. Accessed 2026-09-29.",
      "organizationOrJournal": "American Medical Association",
      "authors": [
        "American Medical Association"
      ],
      "publicationYear": null,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://code-medical-ethics.ama-assn.org/ethics-opinions/informed-consent",
      "accessedOn": "2026-09-29",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed.",
      "authorityAssessment": "Current professional ethics guidance for clinical consent.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.gs028se.qualified-interpreter.1",
        "claim.gs028se.qualified-interpreter.2",
        "claim.gs028se.qualified-interpreter.3",
        "claim.gs028se.qualified-interpreter.4",
        "claim.gs028se.informed-consent.1",
        "claim.gs028se.informed-consent.2",
        "claim.gs028se.informed-consent.3",
        "claim.gs028se.informed-consent.4",
        "claim.gs028se.capacity-refusal.1",
        "claim.gs028se.capacity-refusal.2",
        "claim.gs028se.capacity-refusal.3",
        "claim.gs028se.capacity-refusal.4",
        "claim.gs028se.research-consent.1",
        "claim.gs028se.research-consent.2",
        "claim.gs028se.research-consent.3",
        "claim.gs028se.research-consent.4",
        "claim.n2.578cf199fb28",
        "claim.flags5.20261116.application.03"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "clinical.question-new-n2.2026-11-04.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.gs028se.ama-capacity-2-1-2",
      "title": "Decisions for Adult Patients Who Lack Capacity",
      "completeCitation": "American Medical Association. Code of Medical Ethics Opinion 2.1.2: Decisions for Adult Patients Who Lack Capacity. Accessed 2026-09-29.",
      "organizationOrJournal": "American Medical Association",
      "authors": [
        "American Medical Association"
      ],
      "publicationYear": null,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://code-medical-ethics.ama-assn.org/ethics-opinions/decisions-adult-patients-who-lack-capacity",
      "accessedOn": "2026-09-29",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyrighted; targeted factual verification only",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Original factual synthesis only; no source prose, tables, figures, charts, or algorithms reproduced. N2 uses recorded atomic synthesis and bibliographic metadata, with explicitly identified mathematical derivations. No source text, table, figure or excerpt was retrieved or copied. The original access date is retained, not refreshed.",
      "authorityAssessment": "Current ethics guidance for capacity and surrogates.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.gs028se.capacity-refusal.1",
        "claim.gs028se.capacity-refusal.2",
        "claim.gs028se.capacity-refusal.3",
        "claim.gs028se.capacity-refusal.4",
        "claim.gs028se.surrogate-decisions.1",
        "claim.gs028se.surrogate-decisions.2",
        "claim.gs028se.surrogate-decisions.3",
        "claim.gs028se.surrogate-decisions.4",
        "claim.n2.578cf199fb28",
        "claim.flags5.20261116.application.03"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102a.chicago",
      "title": "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
      "completeCitation": "Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.",
      "organizationOrJournal": "Neurogastroenterology and Motility / International High-Resolution Manometry Working Group",
      "authors": [
        "Rena Yadlapati",
        "Peter J Kahrilas",
        "Mark R Fox",
        "Albert J Bredenoord",
        "C Prakash Gyawali",
        "Sabine Roman",
        "et al."
      ],
      "publicationYear": 2021,
      "doi": "10.1111/nmo.14058",
      "pmid": "33373111",
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/",
      "accessedOn": "2026-11-02",
      "sourceClass": "peer_reviewed_guideline",
      "licenseLabel": "Copyrighted expert consensus; public author manuscript, reusable license not established",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.",
      "authorityAssessment": "Primary classification consensus checked in the accessible complete manuscript: primary-position achalasia criterion, absent normal peristalsis, pressurization/spasm distinction and failed DCI below 100 mmHg.s.cm. Same publication as source.qq20261102.chicago-v4; this recheck is not an independent second source.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102a.pressure-not-peristalsis",
        "claim.qq20261102a.primary-position-achalasia",
        "claim.qq20261102a.spastic-achalasia",
        "claim.qq20261102a.failed-contraction-threshold",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.flags5.20261116.application.17",
        "claim.flags5.20261116.application.18"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v6",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102b.acg-achalasia",
      "title": "ACG clinical guideline: achalasia",
      "completeCitation": "Vaezi MF, Pandolfino JE, Yadlapati RH, Greer KB, Kavitt RT. ACG Clinical Guidelines: Diagnosis and Management of Achalasia. Am J Gastroenterol. 2020;115(9):1393-1411. doi:10.14309/ajg.0000000000000731.",
      "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
      "authors": [
        "Vaezi MF",
        "Pandolfino JE",
        "Yadlapati RH",
        "Greer KB",
        "Kavitt RT"
      ],
      "publicationYear": 2020,
      "doi": "10.14309/ajg.0000000000000731",
      "pmid": "32773454",
      "officialUrl": "https://gi.org/guideline/diagnosis-and-management-of-achalasia/",
      "accessedOn": "2026-11-02",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyright ACG; no reusable license assumed",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Targeted factual verification of complete guideline through the Portuguese gastroenterology society-hosted PDF: https://www.spg.pt/wp-content/uploads/2023/03/ACG-Clinical-Guidelines-Diagnosis-and-Management-of-Achalasia.pdf . Direct publisher route was inaccessible; no paywalled snippet used, no PDF or prose stored.",
      "authorityAssessment": "Primary professional-society guideline supports targeted cross-sectional/EUS assessment when older patients with achalasia-pattern physiology have substantial short-term weight loss. No invented risk score, cutoff or probability.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102b.secondary-achalasia-assessment",
        "claim.flags5.20261116.application.18"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102c.acg-physiology2020",
      "title": "ACG esophageal physiologic testing guideline",
      "completeCitation": "Gyawali CP, Carlson DA, Chen JW, Patel A, Wong RJ, Yadlapati RH. ACG Clinical Guidelines: Clinical Use of Esophageal Physiologic Testing. Am J Gastroenterol. 2020;115(9):1412-1428. doi:10.14309/ajg.0000000000000734.",
      "organizationOrJournal": "American College of Gastroenterology / American Journal of Gastroenterology",
      "authors": [
        "Gyawali CP",
        "Carlson DA",
        "Chen JW",
        "Patel A",
        "Wong RJ",
        "Yadlapati RH"
      ],
      "publicationYear": 2020,
      "doi": "10.14309/ajg.0000000000000734",
      "pmid": "32769426",
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9468980/",
      "accessedOn": "2026-11-02",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Public author manuscript; reusable license not established",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "No algorithms, protocol tables, source text or exact maneuver quantities copied. Factual verification of society guidance only.",
      "authorityAssessment": "Full primary guideline rechecked for assisted catheter placement, limitations of incomplete studies, provocative maneuvers and complementary FLIP use. Older technical guidance, combined with retained Chicago v4 rather than claimed new diagnostic cutoffs.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102c.hrm-incomplete-placement",
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.flags5.20261116.application.17"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "development-batch.2026-09-10.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.sc.seoul-achalasia-2020",
      "title": "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
      "completeCitation": "Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. Journal of Neurogastroenterology and Motility. 2020;26(2):180-203. Published 2020-04-30. doi:10.5056/jnm20014. PMID:32235027.",
      "organizationOrJournal": "Journal of Neurogastroenterology and Motility / Korean Society of Neurogastroenterology and Motility",
      "authors": [
        "Jung HK",
        "Hong SJ",
        "Lee OY",
        "Pandolfino J",
        "Park H",
        "Miwa H",
        "Ghoshal UC",
        "Mahadeva S",
        "et al."
      ],
      "publicationYear": 2020,
      "doi": "10.5056/jnm20014",
      "pmid": "32235027",
      "officialUrl": "https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014",
      "accessedOn": "2026-09-10",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
      "reuseStatus": "cc_by_nc_4_0_restricted",
      "reuseNotes": "Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.",
      "authorityAssessment": "Society evidence-based guideline directly checked for HRM after structural assessment and the absent-peristalsis/impaired-relaxation pattern. Diagnostic evidence is low with strong consensus; the inaccessible corrigendum is not represented as reviewed.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.achalasia.high-resolution-manometry",
        "claim.achalasia.manometric-recognition",
        "claim.flags5.20261116.application.17",
        "claim.flags5.20261116.application.18"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v5",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102a.seoul",
      "title": "2019 Seoul Consensus on Esophageal Achalasia Guidelines",
      "completeCitation": "Jung HK, Hong SJ, Lee OY, Pandolfino J, Park H, Miwa H, Ghoshal UC, Mahadeva S, et al. 2019 Seoul Consensus on Esophageal Achalasia Guidelines. Journal of Neurogastroenterology and Motility. 2020;26(2):180-203. Published 2020-04-30. doi:10.5056/jnm20014. PMID:32235027.",
      "organizationOrJournal": "Journal of Neurogastroenterology and Motility / Korean Society of Neurogastroenterology and Motility",
      "authors": [
        "Jung HK",
        "Hong SJ",
        "Lee OY",
        "Pandolfino J",
        "Park H",
        "Miwa H",
        "Ghoshal UC",
        "Mahadeva S",
        "et al."
      ],
      "publicationYear": 2020,
      "doi": "10.5056/jnm20014",
      "pmid": "32235027",
      "officialUrl": "https://www.jnmjournal.org/journal/view.html?doi=10.5056/jnm20014",
      "accessedOn": "2026-11-02",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
      "reuseStatus": "cc_by_nc_4_0_restricted",
      "reuseNotes": "Original factual synthesis for local noncommercial development with attribution under https://creativecommons.org/licenses/by-nc/4.0/. No source prose, figures, or algorithms reproduced. Commercial reuse requires separate review.",
      "authorityAssessment": "Independent guideline corroborates pressure-study classification following structural assessment; FLIP and reflux testing are not represented as complete substitutes for ordinary HRM classification. Same publication as source.sc.seoul-achalasia-2020; this recheck is not an independent second source.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102a.pressure-not-peristalsis",
        "claim.qq20261102a.spastic-achalasia",
        "claim.qq20261102a.esophageal-physiology-sequence",
        "claim.flags5.20261116.application.17"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "evidence.question-quality.2026-11-02.v7",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102c.chicago",
      "title": "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
      "completeCitation": "Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.",
      "organizationOrJournal": "Neurogastroenterology and Motility / International High-Resolution Manometry Working Group",
      "authors": [
        "Rena Yadlapati",
        "Peter J Kahrilas",
        "Mark R Fox",
        "Albert J Bredenoord",
        "C Prakash Gyawali",
        "Sabine Roman",
        "et al."
      ],
      "publicationYear": 2021,
      "doi": "10.1111/nmo.14058",
      "pmid": "33373111",
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/",
      "accessedOn": "2026-11-02",
      "sourceClass": "peer_reviewed_guideline",
      "licenseLabel": "Copyrighted expert consensus; public author manuscript, reusable license not established",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.",
      "authorityAssessment": "Previously verified primary classification consensus retained for technically adequate primary/secondary-position protocols and deglutitive inhibition. The new failed-acquisition cases are clinical applications, not new normal ranges. Same publication as source.qq20261102b.chicago; a new record ID does not create independent evidence.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102c.hrm-incomplete-placement",
        "claim.qq20261102c.hrm-protocol-and-provocation",
        "claim.flags5.20261116.application.17"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "clinical.owner-decisions.2026-11-12.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.owner-decisions.20261112.rcpath-lymphoma-2015",
      "title": "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas",
      "completeCitation": "Dojcinov S, Wilkins B, Calaminici M. Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas. Royal College of Pathologists. G142, version 2. October 2015.",
      "organizationOrJournal": "Royal College of Pathologists",
      "authors": [
        "Stefan Dojcinov",
        "Bridget Wilkins",
        "Maria Calaminici"
      ],
      "publicationYear": 2015,
      "doi": null,
      "pmid": null,
      "officialUrl": "https://www.rcpath.org/asset/DE0B5B4A-7F77-4FE2-AB56FD618EE69098/",
      "sourceClass": "professional_society_guideline",
      "licenseLabel": "Copyright Royal College of Pathologists 2015. Personal noncommercial reproduction conditions.",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Targeted factual verification only. Independently synthesized facts and bibliographic metadata. No source prose, tables, proformas or full text retained.",
      "authorityAssessment": "Specialist technical guidance on lymphoid histology and fresh-tissue ancillary testing. The 2015 document is listed as under review, so local hematopathology procedures need confirmation.",
      "usageRole": "evidence",
      "accessedOn": "2026-11-12",
      "evidenceClaimIds": [
        "claim.owner-decisions.20261112.ptld-architecture",
        "claim.owner-decisions.20261112.ptld-fresh-flow",
        "claim.owner-decisions.20261112.ptld-fixed-histology",
        "claim.flags5.20261116.application.16"
      ],
      "verification": {
        "mode": "targeted_factual_verification",
        "checkedOn": "2026-11-12",
        "inheritedMetadataReviewed": true,
        "claimLocations": "Preparation before dissection, printed page 10, and immunophenotyping discussion, printed page 13."
      },
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    },
    {
      "contentVersion": "question-authoring.2026-11-02.v4",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.qq20261102.chicago-v4",
      "title": "Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0",
      "completeCitation": "Yadlapati R, Kahrilas PJ, Fox MR, Bredenoord AJ, Gyawali CP, Roman S, et al. Esophageal motility disorders on high-resolution manometry: Chicago classification version 4.0. Neurogastroenterol Motil. 2021;33(1):e14058. doi:10.1111/nmo.14058. PMID:33373111; PMCID:PMC8034247.",
      "organizationOrJournal": "Neurogastroenterology and Motility / International High-Resolution Manometry Working Group",
      "authors": [
        "Rena Yadlapati",
        "Peter J Kahrilas",
        "Mark R Fox",
        "Albert J Bredenoord",
        "C Prakash Gyawali",
        "Sabine Roman",
        "et al."
      ],
      "publicationYear": 2021,
      "doi": "10.1111/nmo.14058",
      "pmid": "33373111",
      "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8034247/",
      "accessedOn": "2026-11-02",
      "sourceClass": "peer_reviewed_guideline",
      "licenseLabel": "Copyrighted expert consensus; public author manuscript, reusable license not established",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "PMC availability is not a reuse license. Targeted consensus-fact verification only; no table, threshold list, algorithm, protocol, trace, figure or source phrasing reproduced. Publisher direct fetch was blocked; the accessible author manuscript and bibliographic record were checked.",
      "authorityAssessment": "Primary international classification consensus. Only the preserved-peristalsis and normal-relaxation distinctions are used alongside the existing Seoul achalasia claim; technical protocol adequacy remains clinician review.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.qq20261102.motility-egjoo",
        "claim.qq20261102.motility-absent-contractility",
        "claim.flags5.20261116.application.18"
      ],
      "sourceStatus": "recorded_source_reused_offline_not_reaccessed",
      "intendedUse": "Offline reuse of already recorded factual claims for this authoring review; no fresh current-guidance check, source text or clinical approval. Undated ethics web records retain an explicitly unknown publication year."
    }
  ],
  "timings": [
    {
      "caseId": "case.achalasia.clinic-referral",
      "nodeId": "node.achalasia.clinic-referral.1",
      "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r6",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "manometry_4",
            "choiceLabel": "Manometry with endoscopic catheter placement",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.esophageal_manometry"
            }
          },
          {
            "choiceId": "choice.qq20261102c.b04-context.d1",
            "choiceLabel": "Obtain junction distensibility measurements with endoscopic FLIP",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.upper_endoscopy"
            }
          },
          {
            "choiceId": "choice.qq20261102c.b04-context.d2",
            "choiceLabel": "Obtain a timed barium esophagram with a tablet",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.radiography"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.achalasia.clinic-referral",
      "nodeId": "node.achalasia.clinic-referral.2",
      "questionVariantId": "question.achalasia.manometric-recognition.v4.r5",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028.varicose-veins.paired-aching-standing",
      "nodeId": "node.gs028.varicose-veins.paired-aching-standing.1",
      "questionVariantId": "question.varicose-veins.reflux-duplex-evaluation.v1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_1",
            "choiceLabel": "Venous reflux duplex",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.venous_duplex"
            }
          },
          {
            "choiceId": "d1_1",
            "choiceLabel": "Resting ankle-brachial index",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.vascular_physiology"
            }
          },
          {
            "choiceId": "d2_1",
            "choiceLabel": "Lower-extremity CT",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ct"
            }
          },
          {
            "choiceId": "d3_1",
            "choiceLabel": "D-dimer assay",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.basic_labs"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028.varicose-veins.paired-aching-standing",
      "nodeId": "node.gs028.varicose-veins.paired-aching-standing.2",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.r1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028.varicose-veins.b-prefers-conservative",
      "nodeId": "node.gs028.varicose-veins.b-prefers-conservative.1",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
      "nodeId": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.1",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1.r1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
      "nodeId": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.2",
      "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r3",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028b.cirrhosis-perioperative.a-compensated",
      "nodeId": "node.gs028b.cirrhosis-perioperative.a-compensated.1",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2.r1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
      "nodeId": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r7",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028b.cirrhosis-perioperative.a-center-expertise",
      "nodeId": "node.gs028b.cirrhosis-perioperative.a-center-expertise.1",
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4.r1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028b.ptld.b-pathology-returned",
      "nodeId": "node.gs028b.ptld.b-pathology-returned.1",
      "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r5",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-split",
            "choiceLabel": "Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.biopsy"
            }
          },
          {
            "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
            "choiceLabel": "Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.biopsy"
            }
          },
          {
            "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
            "choiceLabel": "Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.biopsy"
            }
          },
          {
            "choiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
            "choiceLabel": "Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.biopsy"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028se.p2e.capacity-refusal.v4.varicose",
      "nodeId": "node.gs028se.p2e.capacity-refusal.v4.varicose.1",
      "questionVariantId": "question.statistics-ethics.capacity-refusal.v4",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028se.p2e.capacity-refusal.v4.varicose",
      "nodeId": "node.gs028se.p2e.capacity-refusal.v4.varicose.2",
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4.r1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "nodeId": "node.gs028c.palpable-breast.paired-scar-edge.1",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_2",
            "choiceLabel": "Targeted breast ultrasound",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ultrasound"
            }
          },
          {
            "choiceId": "d1_2",
            "choiceLabel": "Diagnostic mammographic spot-compression views",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.mammography"
            }
          },
          {
            "choiceId": "d2_2",
            "choiceLabel": "Contrast-enhanced breast MRI",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "nodeId": "node.gs028c.palpable-breast.paired-scar-edge.2",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_2",
            "choiceLabel": "Palpation-directed core or surgical biopsy",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.biopsy"
            }
          },
          {
            "choiceId": "d1_2",
            "choiceLabel": "Contrast-enhanced breast MRI",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          },
          {
            "choiceId": "d2_2",
            "choiceLabel": "Repeat site-directed breast ultrasound",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ultrasound"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.a-recent-negative",
      "nodeId": "node.gs028c.palpable-breast.a-recent-negative.1",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_3",
            "choiceLabel": "Targeted breast ultrasound",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ultrasound"
            }
          },
          {
            "choiceId": "d1_3",
            "choiceLabel": "Diagnostic mammographic spot-compression views",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.mammography"
            }
          },
          {
            "choiceId": "d2_3",
            "choiceLabel": "Contrast-enhanced breast MRI",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
      "nodeId": "node.gs028c.palpable-breast.a-discordant-exam.1",
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r3",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_4",
            "choiceLabel": "Targeted breast ultrasound",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ultrasound"
            }
          },
          {
            "choiceId": "d1_4",
            "choiceLabel": "Diagnostic mammographic spot-compression views",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.mammography"
            }
          },
          {
            "choiceId": "d2_4",
            "choiceLabel": "Contrast-enhanced breast MRI",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
      "nodeId": "node.gs028c.palpable-breast.b-enlarging-negative-imaging.1",
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r1",
      "classification": {
        "kind": "test_choices",
        "choices": [
          {
            "choiceId": "correct_3",
            "choiceLabel": "Palpation-directed core or surgical biopsy",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.biopsy"
            }
          },
          {
            "choiceId": "d1_3",
            "choiceLabel": "Contrast-enhanced breast MRI",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.breast_mri"
            }
          },
          {
            "choiceId": "d2_3",
            "choiceLabel": "Repeat site-directed breast ultrasound",
            "timing": {
              "kind": "test",
              "timingProfileId": "timing.test.ultrasound"
            }
          }
        ]
      }
    },
    {
      "caseId": "case.gs028d.anesthesia.a-snoring-surgery",
      "nodeId": "node.gs028d.anesthesia.a-snoring-surgery.1",
      "questionVariantId": "question.preoperative-osa.validated-risk-screening.v1.r1",
      "classification": {
        "kind": "no_test"
      }
    },
    {
      "caseId": "case.gs028d.anesthesia.a-validated-not-impression",
      "nodeId": "node.gs028d.anesthesia.a-validated-not-impression.1",
      "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r6",
      "classification": {
        "kind": "no_test"
      }
    }
  ],
  "release": {
    "id": "clinical.flags5-source.20261116.v1",
    "schemaVersion": 1,
    "publicationStatus": "synthetic_unapproved_prototype",
    "disclaimer": "Mixed clinician-reviewed and AI-assisted synthetic development-preview content; the release as a whole is not clinically approved and is not medical guidance.",
    "concepts": [
      {
        "id": "concept.achalasia.manometric-recognition",
        "displayName": "Manometric recognition of achalasia",
        "learningObjective": "Recognize achalasia from absent peristalsis and impaired esophagogastric-junction relaxation without relying on an unsupported numeric threshold.",
        "earliestFacilityStage": 1,
        "conceptType": "diagnosis"
      },
      {
        "id": "concept.varicose-veins.reflux-duplex-evaluation",
        "displayName": "Venous reflux duplex evaluation",
        "learningObjective": "Select disease-specific reflux duplex for symptomatic varicose veins.",
        "earliestFacilityStage": 1,
        "conceptType": "workup"
      },
      {
        "id": "concept.varicose-veins.intervention-referral-after-axial-reflux",
        "displayName": "Referral after documented axial reflux",
        "learningObjective": "Use findings, candidacy, and preference to choose intervention referral or conservative care.",
        "earliestFacilityStage": 1,
        "conceptType": "management"
      },
      {
        "id": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
        "displayName": "Assess perioperative cirrhosis risk",
        "learningObjective": "Use multidimensional liver, patient, procedure, and facility factors in perioperative cirrhosis assessment.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.statistics-ethics.capacity-refusal",
        "displayName": "Respect capable refusal",
        "learningObjective": "Distinguish an unwelcome choice from impaired decision-making capacity.",
        "earliestFacilityStage": 0,
        "conceptType": "applied_science"
      },
      {
        "id": "concept.palpable-breast.negative-mammogram-targeted-us",
        "displayName": "Targeted ultrasound after negative mammography",
        "learningObjective": "Order targeted ultrasound for an adult at least 40 with a persistent palpable finding after negative diagnostic mammography.",
        "earliestFacilityStage": 0,
        "conceptType": "workup"
      },
      {
        "id": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
        "displayName": "Biopsy suspicious palpable mass despite negative imaging",
        "learningObjective": "Obtain tissue diagnosis for a persistently suspicious palpable mass despite negative mammography and targeted ultrasound.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      },
      {
        "id": "concept.preoperative-osa.validated-risk-screening",
        "displayName": "Screen preoperatively for OSA risk",
        "learningObjective": "Use a validated risk screen and communicate increased OSA probability without treating the screen as a diagnosis.",
        "earliestFacilityStage": 0,
        "conceptType": "diagnosis"
      },
      {
        "id": "concept.achalasia.high-resolution-manometry.v2",
        "displayName": "Resolve technical and symptom-protocol limitations in motility testing",
        "learningObjective": "Assess whether an existing esophageal pressure study answers the clinical question and select completion, assisted placement or provocative testing before disease-specific treatment.",
        "earliestFacilityStage": 1,
        "conceptType": "workup"
      },
      {
        "id": "concept.ptld.node-specimen-and-ancillary-handling.v1",
        "displayName": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
        "learningObjective": "Plan PTLD tissue acquisition with fresh and fixed specimen allocation.",
        "earliestFacilityStage": 1,
        "conceptType": "workup"
      },
      {
        "id": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
        "displayName": "Recognize an acute hernia exception to elective cirrhosis optimization",
        "learningObjective": "Interpret new obstructive hernia findings and choose urgent surgical assessment despite an earlier elective cirrhosis-optimization plan.",
        "earliestFacilityStage": 0,
        "conceptType": "management"
      }
    ],
    "cases": [
      {
        "id": "case.achalasia.clinic-referral",
        "displayName": "Esophageal motility evaluation",
        "patientPresentationVariantId": "presentation.achalasia.clinic-referral.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 66,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Difficulty swallowing",
        "presentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.achalasia.clinic-referral.female.66.flags5r1",
            "prototypeDemographics": {
              "ageYears": 66,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 66-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.male.66.flags5r1",
            "prototypeDemographics": {
              "ageYears": 66,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 66-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.female.72.flags5r1",
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
            "presentation": "{patientName}, a 72-year-old woman, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          },
          {
            "id": "profile.achalasia.clinic-referral.male.72.flags5r1",
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
            "presentation": "{patientName}, a 72-year-old man, attends the surgery clinic because food and drinks pause behind the sternum and return without retching."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0"
        ],
        "decisionNodes": [
          {
            "id": "node.achalasia.clinic-referral.1",
            "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r6",
            "primaryConceptId": "concept.achalasia.high-resolution-manometry.v2",
            "currentUpdate": "The exported outside manometry plots have no gastric baseline channel. During the test the entire catheter moves upward with retching; the report nevertheless gives a junction relaxation value and recommends dilation.",
            "stem": "How should {patientName}'s next physiologic assessment be arranged?",
            "showServicePreviews": false,
            "answerChoices": [
              {
                "id": "manometry_4",
                "label": "Manometry with endoscopic catheter placement",
                "isCorrect": true,
                "rationale": "A displaced catheter without a gastric reference cannot provide a dependable junction relaxation assessment; technically adequate repeat testing is feasible.",
                "serviceRequest": {
                  "serviceId": "service.esophageal_manometry"
                }
              },
              {
                "id": "choice.qq20261102c.b04-context.d1",
                "label": "Obtain junction distensibility measurements with endoscopic FLIP",
                "isCorrect": false,
                "rationale": "FLIP can complement an obstructive-symptom assessment, especially when manometry cannot be completed despite assisted placement, but does not replace the still-feasible pressure classification required here.",
                "serviceRequest": null
              },
              {
                "id": "choice.qq20261102c.b04-context.d2",
                "label": "Obtain a timed barium esophagram with a tablet",
                "isCorrect": false,
                "rationale": "Timed barium emptying helps assess obstruction but does not supply the missing junction-relaxation and peristaltic classification measurements.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
            "teachingPoint": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question.",
            "sourceLabels": [
              "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
              "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
              "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
              "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)",
              "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v7)"
            ],
            "resultGateAfter": {
              "id": "gate.achalasia.manometry.4",
              "resultTypeId": "service.esophageal_manometry",
              "pendingLabel": "Esophageal manometry pending",
              "resultNarrative": "The esophageal pressure-study report is available for review.",
              "readiness": "all",
              "allowedServiceRouteIds": [
                "route.esophageal_manometry.outsourced"
              ]
            },
            "terminalDispositions": [],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "Upper endoscopy",
                  "value": "No mucosal mass or fixed luminal narrowing."
                },
                {
                  "label": "Contrast swallow",
                  "value": "Slow passage through the distal junction."
                }
              ]
            }
          },
          {
            "id": "node.achalasia.clinic-referral.2",
            "questionVariantId": "question.achalasia.manometric-recognition.v4.r5",
            "primaryConceptId": "concept.achalasia.manometric-recognition",
            "currentUpdate": "At review, {patientName} reports continued difficulty swallowing. Recorded weights have fallen substantially during the recent progression of symptoms.",
            "stem": "Which interpretation and next plan should guide {patientName}'s care?",
            "showServicePreviews": false,
            "answerChoices": [
              {
                "id": "achalasia_4",
                "label": "Achalasia pattern; junction-focused CT or endoscopic ultrasound",
                "isCorrect": true,
                "rationale": "Impaired relaxation and failed contractions support the motor pattern, but the weight loss and scope resistance require secondary-cause assessment before treatment.",
                "serviceRequest": null
              },
              {
                "id": "choice.qq20261102b.b04.d1",
                "label": "Achalasia pattern; pneumatic dilation or endoscopic myotomy",
                "isCorrect": false,
                "rationale": "The motor-pattern interpretation is appropriate, but treatment before secondary-cause assessment closes the investigation prematurely.",
                "serviceRequest": null
              },
              {
                "id": "choice.qq20261102b.b04.d2",
                "label": "Ineffective motility; junction-focused CT or endoscopic ultrasound",
                "isCorrect": false,
                "rationale": "The secondary-cause investigation is appropriate, but the very low contractions with impaired junction relaxation are not preserved effective peristalsis.",
                "serviceRequest": null
              },
              {
                "id": "choice.qq20261102b.b04.d3",
                "label": "Ineffective motility; pneumatic dilation or endoscopic myotomy",
                "isCorrect": false,
                "rationale": "This combines the wrong pressure-pattern interpretation with an unsupported move to junction treatment.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Impaired junction relaxation with very low contractile measurements supports an achalasia motor pattern. Weight loss and marked endoscopic resistance still require targeted CT or endoscopic ultrasound for a secondary junction lesion before dilation or myotomy. A normal mucosal view does not exclude a mural or extrinsic lesion.",
            "teachingPoint": "Impaired junction relaxation with very low contractile measurements supports an achalasia motor pattern. Weight loss and marked endoscopic resistance still require targeted CT or endoscopic ultrasound for a secondary junction lesion before dilation or myotomy. A normal mucosal view does not exclude a mural or extrinsic lesion.",
            "exhibit": {
              "kind": "keyValue",
              "caption": "Investigation record; pressure values are constructed teaching observations",
              "items": [
                {
                  "label": "Endoscopy addendum",
                  "value": "Marked resistance while crossing the gastroesophageal junction."
                },
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
            "sourceLabels": [
              "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
              "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
              "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
              "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.qq20261102b.b04.d1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "The motor-pattern interpretation is appropriate, but treatment before secondary-cause assessment closes the investigation prematurely.",
                "sourceLabels": [
                  "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
                  "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
                  "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
                  "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
                ]
              },
              {
                "answerChoiceId": "choice.qq20261102b.b04.d2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "The secondary-cause investigation is appropriate, but the very low contractions with impaired junction relaxation are not preserved effective peristalsis.",
                "sourceLabels": [
                  "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
                  "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
                  "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
                  "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
                ]
              },
              {
                "answerChoiceId": "choice.qq20261102b.b04.d3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "This combines the wrong pressure-pattern interpretation with an unsupported move to junction treatment.",
                "sourceLabels": [
                  "Seoul achalasia consensus guideline (2020), CC BY-NC 4.0",
                  "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v4)",
                  "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v5)",
                  "AI-assisted revision: needs_clinician_review (question-authoring.2026-11-02.v6)"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Check how the reported number was obtained rather than accepting the report label. Repeat an interpretable assessment before an irreversible intervention. Manometry classification requires a technically adequate acquisition. Complementary tests do not make a missing pressure measurement valid; protocols should answer the particular unresolved question. Impaired junction relaxation with very low contractile measurements supports an achalasia motor pattern. Weight loss and marked endoscopic resistance still require targeted CT or endoscopic ultrasound for a secondary junction lesion before dilation or myotomy. A normal mucosal view does not exclude a mural or extrinsic lesion."
      },
      {
        "id": "case.gs028.varicose-veins.paired-aching-standing",
        "displayName": "Symptomatic varicose veins",
        "patientPresentationVariantId": "presentation.gs028.varicose-veins.paired-aching-standing.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Aching leg veins",
        "presentation": "{patientName}, a 43-year-old woman, attends the clinic for calf aching and prominent veins after standing at work.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028.varicose-veins.paired-aching-standing.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman, attends the clinic for calf aching and prominent veins after standing at work."
          },
          {
            "id": "profile.gs028.varicose-veins.paired-aching-standing.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man, attends the clinic for calf aching and prominent veins after standing at work."
          },
          {
            "id": "profile.gs028.varicose-veins.paired-aching-standing.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman, attends the clinic for calf aching and prominent veins after standing at work."
          },
          {
            "id": "profile.gs028.varicose-veins.paired-aching-standing.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man, attends the clinic for calf aching and prominent veins after standing at work."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "SVS/AVF/AVLS varicose veins guideline Part I",
          "SVS/AVF/AVLS varicose veins guideline Part II"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028.varicose-veins.paired-aching-standing.1",
            "questionVariantId": "question.varicose-veins.reflux-duplex-evaluation.v1",
            "primaryConceptId": "concept.varicose-veins.reflux-duplex-evaluation",
            "stem": "Which study should map the venous problem before treatment planning?",
            "answerChoices": [
              {
                "id": "correct_1",
                "label": "Venous reflux duplex",
                "isCorrect": true,
                "serviceRequest": {
                  "serviceId": "service.venous_duplex"
                }
              },
              {
                "id": "d1_1",
                "label": "Resting ankle-brachial index",
                "isCorrect": false,
                "serviceRequest": null
              },
              {
                "id": "d2_1",
                "label": "Lower-extremity CT",
                "isCorrect": false,
                "serviceRequest": null
              },
              {
                "id": "d3_1",
                "label": "D-dimer assay",
                "isCorrect": false,
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Select a venous reflux duplex for symptomatic varicose veins being considered for treatment.",
            "sourceLabels": [
              "SVS/AVF/AVLS varicose veins guideline Part I",
              "SVS/AVF/AVLS varicose veins guideline Part II"
            ],
            "resultGateAfter": {
              "id": "gate.gs028.aching-standing",
              "resultTypeId": "service.venous_duplex",
              "pendingLabel": "Venous reflux duplex pending",
              "resultNarrative": "Duplex documents superficial axial reflux and no acute deep venous thrombosis.",
              "readiness": "all",
              "allowedServiceRouteIds": [
                "route.venous_duplex.in_house",
                "route.venous_duplex.outsourced"
              ]
            },
            "terminalDispositions": []
          },
          {
            "id": "node.gs028.varicose-veins.paired-aching-standing.2",
            "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.r1",
            "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
            "currentUpdate": "Reflux duplex documents great-saphenous axial reflux. The venous clinic records suitability for intervention. {patientName} has tried leg elevation, remains limited at work, and wishes to discuss a procedure after reviewing the alternatives.",
            "stem": "Which plan should be offered for {patientName}'s symptomatic varicose veins?",
            "answerChoices": [
              {
                "id": "correct_1",
                "label": "Refer to the vascular surgery clinic",
                "isCorrect": true,
                "rationale": "The duplex demonstrates truncal reflux; persistent symptoms and an informed treatment preference support venous-service referral. The specialist selects the technique.",
                "serviceRequest": null
              },
              {
                "id": "d1_1",
                "label": "Prescribe graduated compression stockings before referral",
                "isCorrect": false,
                "rationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
                "serviceRequest": null
              },
              {
                "id": "d2_1",
                "label": "Arrange ultrasound-guided tributary sclerotherapy",
                "isCorrect": false,
                "rationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Refer to the venous service for truncal-intervention planning. Symptomatic axial reflux and an informed treatment preference support referral without a compulsory prolonged compression course. Compression remains an option; the exact technique follows specialist anatomy review.",
            "sourceLabels": [
              "SVS/AVF/AVLS varicose veins guideline Part I",
              "SVS/AVF/AVLS varicose veins guideline Part II"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
                "sourceLabels": [
                  "SVS/AVF/AVLS varicose veins guideline Part I",
                  "SVS/AVF/AVLS varicose veins guideline Part II"
                ]
              },
              {
                "answerChoiceId": "d2_1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
                "sourceLabels": [
                  "SVS/AVF/AVLS varicose veins guideline Part I",
                  "SVS/AVF/AVLS varicose veins guideline Part II"
                ]
              }
            ],
            "teachingPoint": "Refer to the venous service for truncal-intervention planning. Symptomatic axial reflux and an informed treatment preference support referral without a compulsory prolonged compression course. Compression remains an option; the exact technique follows specialist anatomy review."
          }
        ],
        "learningSummary": "Select a venous reflux duplex for symptomatic varicose veins being considered for treatment. Refer to the venous service for truncal-intervention planning. Symptomatic axial reflux and an informed treatment preference support referral without a compulsory prolonged compression course. Compression remains an option; the exact technique follows specialist anatomy review."
      },
      {
        "id": "case.gs028.varicose-veins.b-prefers-conservative",
        "displayName": "Symptomatic varicose veins",
        "patientPresentationVariantId": "presentation.gs028.varicose-veins.b-prefers-conservative.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Prefer nonsurgical care",
        "presentation": "{patientName}, a 43-year-old woman, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
          },
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
          },
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
          },
          {
            "id": "profile.gs028.varicose-veins.b-prefers-conservative.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man, attends the clinic with calf aching after prolonged standing. Duplex shows axial superficial venous reflux. After discussion of procedural and nonprocedural options, {patientName} declines an intervention and asks for symptom relief."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "SVS/AVF/AVLS varicose veins guideline Part I",
          "SVS/AVF/AVLS varicose veins guideline Part II"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028.varicose-veins.b-prefers-conservative.1",
            "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r1",
            "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
            "stem": "Which plan should be offered for {patientName}'s varicose-vein symptoms?",
            "answerChoices": [
              {
                "id": "correct_3",
                "label": "Prescribe graduated compression stockings",
                "isCorrect": true,
                "rationale": "A concrete conservative treatment fits the informed decision to avoid a procedure. No universal garment strength or treatment duration is specified.",
                "serviceRequest": null
              },
              {
                "id": "d1_3",
                "label": "Refer for endovenous truncal-ablation planning",
                "isCorrect": false,
                "rationale": "Ablation is an intervention pathway; documented reflux does not override a capable patient's informed refusal.",
                "serviceRequest": null
              },
              {
                "id": "d2_3",
                "label": "Arrange ultrasound-guided tributary sclerotherapy",
                "isCorrect": false,
                "rationale": "Sclerotherapy remains a procedure and does not implement the stated preference for nonprocedural symptom care.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Offer graduated compression as a specific conservative option. Axial reflux does not make intervention compulsory when symptoms and informed preference support conservative care. Both ablation planning and sclerotherapy pursue a procedural pathway.",
            "sourceLabels": [
              "SVS/AVF/AVLS varicose veins guideline Part I",
              "SVS/AVF/AVLS varicose veins guideline Part II"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Ablation is an intervention pathway; documented reflux does not override a capable patient's informed refusal.",
                "sourceLabels": [
                  "SVS/AVF/AVLS varicose veins guideline Part I",
                  "SVS/AVF/AVLS varicose veins guideline Part II"
                ]
              },
              {
                "answerChoiceId": "d2_3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Sclerotherapy remains a procedure and does not implement the stated preference for nonprocedural symptom care.",
                "sourceLabels": [
                  "SVS/AVF/AVLS varicose veins guideline Part I",
                  "SVS/AVF/AVLS varicose veins guideline Part II"
                ]
              }
            ],
            "teachingPoint": "Offer graduated compression as a specific conservative option. Axial reflux does not make intervention compulsory when symptoms and informed preference support conservative care. Both ablation planning and sclerotherapy pursue a procedural pathway."
          }
        ],
        "learningSummary": "Offer graduated compression as a specific conservative option. Axial reflux does not make intervention compulsory when symptoms and informed preference support conservative care. Both ablation planning and sclerotherapy pursue a procedural pathway."
      },
      {
        "id": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
        "displayName": "Perioperative cirrhosis",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.paired-single-albumin.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Surgery risk review",
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.paired-single-albumin.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before repair of a reducible umbilical hernia. {patientName} is eating and passing stool. Albumin remains within the laboratory interval."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "AGA perioperative cirrhosis clinical practice update"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.1",
            "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1.r1",
            "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
            "stem": "Which assessment and plan best fit {patientName}'s proposed hernia operation?",
            "answerChoices": [
              {
                "id": "correct_1",
                "label": "Changed liver state; optimize before elective repair",
                "isCorrect": true,
                "rationale": "The new fluid requires assessment of decompensation despite the albumin result; the reducing hernia permits a nonurgent optimization plan.",
                "serviceRequest": null
              },
              {
                "id": "d1_1",
                "label": "Changed liver state; proceed with elective repair",
                "isCorrect": false,
                "rationale": "Recognizing the changed state should change the elective plan rather than leave clearance unchanged.",
                "serviceRequest": null
              },
              {
                "id": "d2_1",
                "label": "Stable liver state; optimize before elective repair",
                "isCorrect": false,
                "rationale": "Optimization is the appropriate direction, but the record does not show an unchanged liver-related state.",
                "serviceRequest": null
              },
              {
                "id": "d3_1",
                "label": "Stable liver state; proceed with elective repair",
                "isCorrect": false,
                "rationale": "A reassuring albumin does not account for the new fluid or justify unchanged elective clearance.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery.",
            "sourceLabels": [
              "AGA perioperative cirrhosis clinical practice update"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "Interval examination",
                  "value": "Abdominal girth has increased; shifting dullness is present."
                },
                {
                  "label": "Abdominal ultrasound",
                  "value": "New free intraperitoneal fluid."
                },
                {
                  "label": "Hernia examination",
                  "value": "Soft, nontender bulge that reduces when supine."
                }
              ]
            },
            "teachingPoint": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery."
          },
          {
            "id": "node.gs028b.cirrhosis-perioperative.paired-single-albumin.2",
            "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r3",
            "primaryConceptId": "concept.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v2",
            "currentUpdate": "Before the planned liver-team visit, {patientName} develops vomiting and increasing pain at the umbilical bulge. The bulge no longer reduces. CT shows bowel within the hernia, dilated upstream bowel and collapsed downstream bowel.",
            "stem": "Which next step should be arranged for {patientName}'s changed abdominal findings?",
            "answerChoices": [
              {
                "id": "correct_1",
                "label": "Urgent hospital surgical assessment",
                "isCorrect": true,
                "rationale": "New pain, irreducibility, vomiting and the bowel transition change the problem from nonurgent optimization to an acute surgical assessment.",
                "serviceRequest": null
              },
              {
                "id": "d1_1",
                "label": "Expedited outpatient therapeutic paracentesis",
                "isCorrect": false,
                "rationale": "Addressing ascites does not resolve the new incarcerated bowel-containing hernia and obstructive pattern.",
                "serviceRequest": null
              },
              {
                "id": "d2_1",
                "label": "Scheduled hepatology–anesthesia optimization",
                "isCorrect": false,
                "rationale": "That was appropriate for the earlier reducing, nonurgent hernia, but the new clinical and CT findings require a different sequence.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation.",
            "sourceLabels": [
              "AGA perioperative cirrhosis clinical practice update"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Addressing ascites does not resolve the new incarcerated bowel-containing hernia and obstructive pattern.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              },
              {
                "answerChoiceId": "d2_1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "That was appropriate for the earlier reducing, nonurgent hernia, but the new clinical and CT findings require a different sequence.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              }
            ],
            "teachingPoint": "The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation."
          }
        ],
        "learningSummary": "New intraperitoneal fluid changes the clinical risk assessment despite the albumin result. The reducing, nontender hernia supports elective planning, allowing hepatology–anesthesia optimization before repair. This is not a numerical clearance threshold or a permanent prohibition on surgery. The earlier elective plan no longer fits. Interpret the painful irreducible bulge, vomiting and bowel transition together: arrange urgent hospital surgical assessment despite the cirrhosis risk. The record does not prove bowel necrosis or prescribe a particular operation."
      },
      {
        "id": "case.gs028b.cirrhosis-perioperative.a-compensated",
        "displayName": "Perioperative cirrhosis",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-compensated.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Elective surgery planning",
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-compensated.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before an open abdominal operation. The referral carries forward a risk assessment written for excision of a small skin lesion under local anesthesia."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "AGA perioperative cirrhosis clinical practice update"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028b.cirrhosis-perioperative.a-compensated.1",
            "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2.r1",
            "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
            "stem": "How should {patientName}'s previous operative-risk assessment be used?",
            "answerChoices": [
              {
                "id": "correct_2",
                "label": "Retain the liver-state description; reassess the proposed procedure",
                "isCorrect": true,
                "rationale": "The liver information remains useful, but the changed operation requires a new procedure-specific, multidisciplinary risk assessment.",
                "serviceRequest": null
              },
              {
                "id": "d1_2",
                "label": "Retain the liver-state description; retain the previous clearance",
                "isCorrect": false,
                "rationale": "Stable liver-related findings do not make clearance transferable between substantially different operations.",
                "serviceRequest": null
              },
              {
                "id": "d2_2",
                "label": "Record interval liver deterioration; reassess the proposed procedure",
                "isCorrect": false,
                "rationale": "The operation needs reassessment, but the supplied record does not establish interval liver deterioration.",
                "serviceRequest": null
              },
              {
                "id": "d3_2",
                "label": "Record interval liver deterioration; retain the previous clearance",
                "isCorrect": false,
                "rationale": "Neither the proposed deterioration nor transfer of the earlier clearance is supported by the record.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The supplied findings do not establish interval liver deterioration. They also do not make a local skin-procedure assessment transferable to an open abdominal operation. Reassess the procedure, comorbidity and center factors alongside the retained liver data.",
            "sourceLabels": [
              "AGA perioperative cirrhosis clinical practice update"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Stable liver-related findings do not make clearance transferable between substantially different operations.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              },
              {
                "answerChoiceId": "d2_2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "The operation needs reassessment, but the supplied record does not establish interval liver deterioration.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              },
              {
                "answerChoiceId": "d3_2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Neither the proposed deterioration nor transfer of the earlier clearance is supported by the record.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              }
            ],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "Liver-related course",
                  "value": "Albumin, bilirubin and INR are unchanged. No interval fluid accumulation, confusion or gastrointestinal bleeding is reported."
                },
                {
                  "label": "Proposed procedure",
                  "value": "Open abdominal resection under general anesthesia rather than the previous local skin excision."
                }
              ]
            },
            "teachingPoint": "The supplied findings do not establish interval liver deterioration. They also do not make a local skin-procedure assessment transferable to an open abdominal operation. Reassess the procedure, comorbidity and center factors alongside the retained liver data."
          }
        ],
        "learningSummary": "The supplied findings do not establish interval liver deterioration. They also do not make a local skin-procedure assessment transferable to an open abdominal operation. Reassess the procedure, comorbidity and center factors alongside the retained liver data."
      },
      {
        "id": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
        "displayName": "Perioperative cirrhosis",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-portal-hypertension.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Preoperative cirrhosis consult",
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-portal-hypertension.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before elective abdominal surgery. The referral summarizes albumin, bilirubin and INR as reassuring."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "AGA perioperative cirrhosis clinical practice update"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028b.cirrhosis-perioperative.a-portal-hypertension.1",
            "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r7",
            "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
            "stem": "Which risk domain is demonstrated by {patientName}'s record but not represented by that laboratory summary?",
            "answerChoices": [
              {
                "id": "correct_3",
                "label": "Portal hypertension and decompensation history",
                "isCorrect": true,
                "rationale": "Prior bleeding varices, persistent thrombocytopenia and splenic enlargement preserve the importance of portal-hypertension history.",
                "serviceRequest": null
              },
              {
                "id": "d1_3",
                "label": "Current hepatic synthetic function",
                "isCorrect": false,
                "rationale": "Albumin and INR already address this domain in the referral summary; they do not replace the clinical history.",
                "serviceRequest": null
              },
              {
                "id": "d2_3",
                "label": "Current cardiopulmonary functional reserve",
                "isCorrect": false,
                "rationale": "This is another relevant preoperative domain, but it is not the domain demonstrated by the supplied endoscopic and splenic record.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Bleeding esophageal varices document a prior portal-hypertension complication. That history remains relevant when current laboratory values look reassuring. Risk review must still integrate the planned operation, comorbidities and center experience; these findings do not supply an exact operative-risk estimate.",
            "sourceLabels": [
              "AGA perioperative cirrhosis clinical practice update"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Albumin and INR already address this domain in the referral summary; they do not replace the clinical history.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              },
              {
                "answerChoiceId": "d2_3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "This is another relevant preoperative domain, but it is not the domain demonstrated by the supplied endoscopic and splenic record.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              }
            ],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "Prior admission",
                  "value": "Hematemesis; endoscopy identified bleeding esophageal varices treated with band ligation."
                },
                {
                  "label": "Current record",
                  "value": "No new gastrointestinal bleeding; platelet count remains low and the spleen is enlarged."
                }
              ]
            },
            "teachingPoint": "Bleeding esophageal varices document a prior portal-hypertension complication. That history remains relevant when current laboratory values look reassuring. Risk review must still integrate the planned operation, comorbidities and center experience; these findings do not supply an exact operative-risk estimate."
          }
        ],
        "learningSummary": "Bleeding esophageal varices document a prior portal-hypertension complication. That history remains relevant when current laboratory values look reassuring. Risk review must still integrate the planned operation, comorbidities and center experience; these findings do not supply an exact operative-risk estimate."
      },
      {
        "id": "case.gs028b.cirrhosis-perioperative.a-center-expertise",
        "displayName": "Perioperative cirrhosis",
        "patientPresentationVariantId": "presentation.gs028b.cirrhosis-perioperative.a-center-expertise.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Where to have surgery",
        "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old man with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
          },
          {
            "id": "profile.gs028b.cirrhosis-perioperative.a-center-expertise.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man with cirrhosis, attends clinic before elective abdominal wall reconstruction at the referring general hospital."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "AGA perioperative cirrhosis clinical practice update"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028b.cirrhosis-perioperative.a-center-expertise.1",
            "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4.r1",
            "primaryConceptId": "concept.cirrhosis-perioperative-risk.multifactor-assessment",
            "stem": "Which timing and care-setting plan best fits {patientName}'s operation?",
            "answerChoices": [
              {
                "id": "correct_4",
                "label": "Optimize first; arrange surgery at a cirrhosis-experienced center",
                "isCorrect": true,
                "rationale": "The changed liver-related state calls for optimization; the reconstruction also warrants an experienced multidisciplinary setting.",
                "serviceRequest": null
              },
              {
                "id": "d1_4",
                "label": "Operate now; arrange surgery at a cirrhosis-experienced center",
                "isCorrect": false,
                "rationale": "A suitable setting does not remove the need to assess and optimize the new fluid before a nonurgent operation.",
                "serviceRequest": null
              },
              {
                "id": "d2_4",
                "label": "Optimize first; arrange surgery at the referring general hospital",
                "isCorrect": false,
                "rationale": "Optimization is appropriate, but the planned reconstruction and cirrhosis still require review of center experience and rescue resources.",
                "serviceRequest": null
              },
              {
                "id": "d3_4",
                "label": "Operate now; arrange surgery at the referring general hospital",
                "isCorrect": false,
                "rationale": "Neither the interval liver-related change nor the planned setting has been adequately incorporated.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance.",
            "sourceLabels": [
              "AGA perioperative cirrhosis clinical practice update"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "A suitable setting does not remove the need to assess and optimize the new fluid before a nonurgent operation.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              },
              {
                "answerChoiceId": "d2_4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Optimization is appropriate, but the planned reconstruction and cirrhosis still require review of center experience and rescue resources.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              },
              {
                "answerChoiceId": "d3_4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Neither the interval liver-related change nor the planned setting has been adequately incorporated.",
                "sourceLabels": [
                  "AGA perioperative cirrhosis clinical practice update"
                ]
              }
            ],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "Interval findings",
                  "value": "New abdominal free fluid on ultrasound and increasing abdominal girth."
                },
                {
                  "label": "Operation",
                  "value": "Nonurgent; no obstruction or active bleeding is described."
                },
                {
                  "label": "Referring hospital",
                  "value": "An inpatient surgical ward and intensive care are present. The team performs few operations in patients with cirrhosis; postoperative liver-related complications are transferred to the regional hepatology center."
                }
              ]
            },
            "teachingPoint": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance."
          }
        ],
        "learningSummary": "Address the new fluid before this nonurgent reconstruction and plan with a cirrhosis-experienced multidisciplinary hospital team. The local hospital has inpatient care, but the supplied experience and transfer record favor the regional team. Optimization and operating-setting review are distinct; neither an ICU bed nor a liver laboratory result supplies automatic clearance."
      },
      {
        "id": "case.gs028b.ptld.b-pathology-returned",
        "displayName": "Owner review for Nora Reed",
        "patientPresentationVariantId": "presentation.owner-decisions.20261112.ptld-biopsy.v2.flags5r1",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Enlarging neck node",
        "presentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.owner-decisions.20261112.ptld-biopsy.v2.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "chiefComplaint": "Enlarging neck node",
            "presentation": "{patientName}, a 43-year-old woman with a liver transplant, attends clinic for an enlarging left supraclavicular lymph node. An outside core biopsy showed atypical lymphoid cells but insufficient architecture for classification. The node remains superficial and mobile. Surgical review finds acceptable operative risk."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Comprehensive review of PTLD after solid organ transplantation",
          "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028b.ptld.b-pathology-returned.1",
            "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r5",
            "primaryConceptId": "concept.ptld.node-specimen-and-ancillary-handling.v1",
            "stem": "Which biopsy and specimen-handling plan should {patientName}'s team request next for suspected post-transplant lymphoproliferative disorder?",
            "answerChoices": [
              {
                "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-split",
                "label": "Excisional lymph-node biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
                "isCorrect": true,
                "rationale": "Excision supplies nodal architecture after inadequate core sampling. The laboratory allocates the specimen under its own protocol, retaining fresh tissue for flow cytometry and fixed tissue for histology.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
                "label": "Image-guided core biopsy with fresh flow-cytometry tissue plus fixed histology tissue",
                "isCorrect": false,
                "rationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
                "label": "Excisional lymph-node biopsy with whole-specimen formalin fixation for paraffin-based studies",
                "isCorrect": false,
                "rationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.",
                "serviceRequest": null
              },
              {
                "id": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
                "label": "Image-guided core biopsy with whole-specimen formalin fixation for paraffin-based studies",
                "isCorrect": false,
                "rationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.",
            "teachingPoint": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy.",
            "sourceLabels": [
              "Comprehensive review of PTLD after solid organ transplantation",
              "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-split",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Planned core sampling can be useful when excision is unsuitable. Acceptable operative risk and unresolved architecture favor excision of this accessible node.",
                "sourceLabels": [
                  "Comprehensive review of PTLD after solid organ transplantation",
                  "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.excision-fixed",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "Architecture may be available, but fixing the whole node forfeits the fresh portion needed for the requested flow analysis.",
                "sourceLabels": [
                  "Comprehensive review of PTLD after solid organ transplantation",
                  "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
                ]
              },
              {
                "answerChoiceId": "choice.owner-decisions.20261112.ptld-biopsy.core-fixed",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the decision and its clinical explanation.",
                "clinicalRationale": "This repeats limited sampling and omits the planned fresh ancillary portion. It leaves both represented adequacy concerns unresolved.",
                "sourceLabels": [
                  "Comprehensive review of PTLD after solid organ transplantation",
                  "Standards for specialist laboratory integration and Dataset for the histopathological reporting of lymphomas"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Coordinate the excisional biopsy and specimen allocation with the receiving hematopathology service. Send the specimen unfixed under its agreed transport protocol. The laboratory preserves a fresh portion for flow cytometry and fixes an adequate portion for histology. The accessible node and acceptable operative risk favor excision after inadequate core sampling. The laboratory must still assess viability and diagnostic adequacy."
      },
      {
        "id": "case.gs028se.p2e.capacity-refusal.v4.varicose",
        "displayName": "Ethics and communication",
        "patientPresentationVariantId": "presentation.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 68,
          "sexLabel": "Male"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Supported treatment decision",
        "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.68",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
          },
          {
            "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.68",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
          },
          {
            "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.male.58",
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
            "presentation": "{patientName}, a 58-year-old man, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
          },
          {
            "id": "profile.gs028se.capacity-refusal-surrogate-decisions.a-capacity-refusal-4.female.58",
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
            "presentation": "{patientName}, a 58-year-old woman, has symptomatic varicose veins with documented axial reflux and is discussing an intervention. Mild cognitive impairment is recorded. With plain-language support, the patient describes the purpose, relevant risks and alternatives, applies them personally and consistently chooses treatment. A colleague asks whether the diagnosis requires a surrogate's signature before planning proceeds."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 1,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "Informed Consent",
          "Decisions for Adult Patients Who Lack Capacity",
          "SVS/AVF/AVLS varicose veins guideline Part II"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028se.p2e.capacity-refusal.v4.varicose.1",
            "questionVariantId": "question.statistics-ethics.capacity-refusal.v4",
            "primaryConceptId": "concept.statistics-ethics.capacity-refusal",
            "stem": "How should the team approach {patientName}'s decision about a varicose-vein intervention when mild cognitive impairment is recorded but supported understanding is demonstrated?",
            "answerChoices": [
              {
                "id": "key-4",
                "label": "Support and assess the patient's own decision",
                "isCorrect": true,
                "rationale": "Support understanding and assess the patient's own abilities for vein intervention. The described informed, consistent choice should not be displaced solely by the cognitive diagnosis.",
                "serviceRequest": null
              },
              {
                "id": "wrong-4-1",
                "label": "Obtain a surrogate's decision because of the diagnosis",
                "isCorrect": false,
                "rationale": "Cognitive impairment does not eliminate capacity for every decision. Seeking a surrogate solely from that label skips the abilities demonstrated after support.",
                "serviceRequest": null
              },
              {
                "id": "wrong-4-2",
                "label": "Require a family countersignature for this consent",
                "isCorrect": false,
                "rationale": "A family countersignature does not replace assessing the patient's supported understanding and choice. The diagnosis alone does not establish that another person must validate consent.",
                "serviceRequest": null
              },
              {
                "id": "wrong-4-3",
                "label": "Require formal testing before discussing the choice",
                "isCorrect": false,
                "rationale": "The supplied discussion already demonstrates relevant abilities with support. A blanket testing requirement based on the diagnosis does not address those actual abilities.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded.",
            "teachingPoint": "Cognitive impairment does not remove capacity for every decision. Support understanding and assess the patient's actual abilities for this choice before seeking a substitute decision-maker. Plain language enables an informed, consistent choice. Remember that the diagnosis and the decision are separate questions; a label alone does not transfer authority to family or a surrogate.",
            "sourceLabels": [
              "Informed Consent",
              "Decisions for Adult Patients Who Lack Capacity",
              "SVS/AVF/AVLS varicose veins guideline Part II"
            ],
            "resultGateAfter": null,
            "terminalDispositions": []
          },
          {
            "id": "node.gs028se.p2e.capacity-refusal.v4.varicose.2",
            "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4.r1",
            "primaryConceptId": "concept.varicose-veins.intervention-referral-after-axial-reflux",
            "currentUpdate": "Duplex confirms axial superficial reflux. The calf symptoms continue to limit standing. The venous clinic records suitability for intervention, and {patientName} chooses to discuss a procedure after reviewing compression and procedural options.",
            "stem": "Which plan should be offered for {patientName}'s symptomatic varicose veins?",
            "answerChoices": [
              {
                "id": "correct_1",
                "label": "Refer to the vascular surgery clinic",
                "isCorrect": true,
                "rationale": "The duplex demonstrates truncal reflux; persistent symptoms and an informed treatment preference support venous-service referral. The specialist selects the technique.",
                "serviceRequest": null
              },
              {
                "id": "d1_1",
                "label": "Prescribe graduated compression stockings before referral",
                "isCorrect": false,
                "rationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
                "serviceRequest": null
              },
              {
                "id": "d2_1",
                "label": "Arrange ultrasound-guided tributary sclerotherapy",
                "isCorrect": false,
                "rationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Refer for truncal-intervention planning. Documented axial reflux and persistent bothersome symptoms support that referral when the patient makes an informed choice for intervention. A prolonged compression course is not a compulsory prerequisite. The exact technique remains a venous-specialist decision.",
            "teachingPoint": "Refer for truncal-intervention planning. Documented axial reflux and persistent bothersome symptoms support that referral when the patient makes an informed choice for intervention. A prolonged compression course is not a compulsory prerequisite. The exact technique remains a venous-specialist decision.",
            "sourceLabels": [
              "SVS/AVF/AVLS varicose veins guideline Part II",
              "Informed Consent",
              "Decisions for Adult Patients Who Lack Capacity"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Compression is reasonable conservative treatment, but it is not a mandatory preliminary course for every intervention candidate.",
                "sourceLabels": [
                  "SVS/AVF/AVLS varicose veins guideline Part II",
                  "Informed Consent",
                  "Decisions for Adult Patients Who Lack Capacity"
                ]
              },
              {
                "answerChoiceId": "d2_1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "A tributary procedure does not substitute for a specialist plan addressing the documented axial reflux. The case does not establish that particular technique as the preferred treatment.",
                "sourceLabels": [
                  "SVS/AVF/AVLS varicose veins guideline Part II",
                  "Informed Consent",
                  "Decisions for Adult Patients Who Lack Capacity"
                ]
              }
            ]
          }
        ],
        "learningSummary": "Support and assess the patient's own decision about treatment. Demonstrated understanding after plain-language explanation cannot be dismissed solely because cognitive impairment is recorded. Refer for truncal-intervention planning. Documented axial reflux and persistent bothersome symptoms support that referral when the patient makes an informed choice for intervention. A prolonged compression course is not a compulsory prerequisite. The exact technique remains a venous-specialist decision."
      },
      {
        "id": "case.gs028c.palpable-breast.paired-scar-edge",
        "displayName": "Persistent palpable breast finding",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.paired-scar-edge.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 49,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Lump near an old scar",
        "presentation": "{patientName}, a 49-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.49.flags5r1",
            "prototypeDemographics": {
              "ageYears": 49,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 49-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar."
          },
          {
            "id": "profile.gs028c.palpable-breast.paired-scar-edge.female.63.flags5r1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 63-year-old woman, attends clinic for a new discrete lump at the edge of a remote benign breast-surgery scar."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ACR Appropriateness Criteria: Palpable Breast Masses"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028c.palpable-breast.paired-scar-edge.1",
            "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r1",
            "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
            "stem": "Which imaging study should be requested next for {patientName}'s palpable breast finding?",
            "answerChoices": [
              {
                "id": "correct_2",
                "label": "Targeted breast ultrasound",
                "isCorrect": true,
                "rationale": "A reproducible palpable target requires site-directed ultrasound when the diagnostic mammogram provides no correlate.",
                "serviceRequest": {
                  "serviceId": "service.ultrasound"
                }
              },
              {
                "id": "d1_2",
                "label": "Diagnostic mammographic spot-compression views",
                "isCorrect": false,
                "rationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
                "serviceRequest": {
                  "serviceId": "service.diagnostic_breast_imaging"
                }
              },
              {
                "id": "d2_2",
                "label": "Contrast-enhanced breast MRI",
                "isCorrect": false,
                "rationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
                "serviceRequest": {
                  "serviceId": "service.breast_mri"
                }
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The stable mammographic scar does not explain a new discrete clinical target. Request ultrasound directed to the palpable site. MRI or further mammographic views do not replace that site-specific next step.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Palpable Breast Masses"
            ],
            "resultGateAfter": {
              "id": "gate.gs028c.scar-edge",
              "resultTypeId": "service.ultrasound",
              "pendingLabel": "Focused scar-edge ultrasound pending",
              "resultNarrative": "Ultrasound at the marked palpable site shows no solid or cystic correlate. The same hard, irregular scar-edge mass remains palpable.",
              "readiness": "all",
              "allowedServiceRouteIds": [
                "route.ultrasound.in_house",
                "route.ultrasound.outsourced"
              ]
            },
            "terminalDispositions": [],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "Diagnostic mammogram",
                  "value": "The skin marker overlies the palpable site. Scar distortion is unchanged from prior images; no new mass or suspicious calcifications at the marker."
                },
                {
                  "label": "Examination",
                  "value": "The same focal lump is reproducible at the scar edge."
                }
              ]
            },
            "teachingPoint": "The stable mammographic scar does not explain a new discrete clinical target. Request ultrasound directed to the palpable site. MRI or further mammographic views do not replace that site-specific next step."
          },
          {
            "id": "node.gs028c.palpable-breast.paired-scar-edge.2",
            "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r1",
            "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
            "currentUpdate": "Ultrasound at the marked palpable site shows no solid or cystic correlate. Mammographic scar distortion is unchanged. The surgeon still finds the same distinctly hard, irregular scar-edge mass.",
            "stem": "Which diagnostic procedure should be arranged next for {patientName}'s persistent breast mass?",
            "answerChoices": [
              {
                "id": "correct_2",
                "label": "Palpation-directed core or surgical biopsy",
                "isCorrect": true,
                "rationale": "The persistent concerning clinical target requires tissue diagnosis even without an imaging correlate; the breast team selects the feasible technique.",
                "serviceRequest": null
              },
              {
                "id": "d1_2",
                "label": "Contrast-enhanced breast MRI",
                "isCorrect": false,
                "rationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
                "serviceRequest": {
                  "serviceId": "service.breast_mri"
                }
              },
              {
                "id": "d2_2",
                "label": "Repeat site-directed breast ultrasound",
                "isCorrect": false,
                "rationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
                "serviceRequest": {
                  "serviceId": "service.ultrasound"
                }
              }
            ],
            "shuffleAnswers": true,
            "explanation": "A hard, irregular palpable target remains clinically concerning despite site-concordant imaging without a correlate. Arrange palpation-directed core or surgical biopsy through the breast team. Repeating ultrasound or substituting MRI does not provide the required tissue diagnosis.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Palpable Breast Masses"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
                "sourceLabels": [
                  "ACR Appropriateness Criteria: Palpable Breast Masses"
                ]
              },
              {
                "answerChoiceId": "d2_2",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
                "sourceLabels": [
                  "ACR Appropriateness Criteria: Palpable Breast Masses"
                ]
              }
            ],
            "teachingPoint": "A hard, irregular palpable target remains clinically concerning despite site-concordant imaging without a correlate. Arrange palpation-directed core or surgical biopsy through the breast team. Repeating ultrasound or substituting MRI does not provide the required tissue diagnosis."
          }
        ],
        "learningSummary": "The stable mammographic scar does not explain a new discrete clinical target. Request ultrasound directed to the palpable site. MRI or further mammographic views do not replace that site-specific next step. A hard, irregular palpable target remains clinically concerning despite site-concordant imaging without a correlate. Arrange palpation-directed core or surgical biopsy through the breast team. Repeating ultrasound or substituting MRI does not provide the required tissue diagnosis."
      },
      {
        "id": "case.gs028c.palpable-breast.a-recent-negative",
        "displayName": "Persistent palpable breast finding",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-recent-negative.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
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
        "chiefComplaint": "Lump after normal imaging",
        "presentation": "{patientName}, a 42-year-old woman, attends clinic for a discrete mobile breast lump that the surgeon can reproduce.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.a-recent-negative.female.42.flags5r1",
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
            "presentation": "{patientName}, a 42-year-old woman, attends clinic for a discrete mobile breast lump that the surgeon can reproduce."
          },
          {
            "id": "profile.gs028c.palpable-breast.a-recent-negative.female.55.flags5r1",
            "prototypeDemographics": {
              "ageYears": 55,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 55-year-old woman, attends clinic for a discrete mobile breast lump that the surgeon can reproduce."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ACR Appropriateness Criteria: Palpable Breast Masses"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028c.palpable-breast.a-recent-negative.1",
            "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r1",
            "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
            "stem": "Which imaging study should be requested next for {patientName}'s palpable breast finding?",
            "answerChoices": [
              {
                "id": "correct_3",
                "label": "Targeted breast ultrasound",
                "isCorrect": true,
                "rationale": "A reproducible palpable target requires site-directed ultrasound when the diagnostic mammogram provides no correlate.",
                "serviceRequest": {
                  "serviceId": "service.ultrasound"
                }
              },
              {
                "id": "d1_3",
                "label": "Diagnostic mammographic spot-compression views",
                "isCorrect": false,
                "rationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
                "serviceRequest": {
                  "serviceId": "service.diagnostic_breast_imaging"
                }
              },
              {
                "id": "d2_3",
                "label": "Contrast-enhanced breast MRI",
                "isCorrect": false,
                "rationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
                "serviceRequest": {
                  "serviceId": "service.breast_mri"
                }
              }
            ],
            "shuffleAnswers": true,
            "explanation": "Request ultrasound targeted to the persistent clinical site. The mammogram documents no correlate at that location; it does not remove the palpable target. MRI and repeating mammographic views are not the preferred next study in this sequence.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Palpable Breast Masses"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
                "sourceLabels": [
                  "ACR Appropriateness Criteria: Palpable Breast Masses"
                ]
              },
              {
                "answerChoiceId": "d2_3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
                "sourceLabels": [
                  "ACR Appropriateness Criteria: Palpable Breast Masses"
                ]
              }
            ],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "Diagnostic mammogram",
                  "value": "The marked palpable site is included. No corresponding mass, architectural distortion or suspicious calcifications."
                },
                {
                  "label": "Clinical localization",
                  "value": "The examination and mammographic skin marker identify the same focal site."
                }
              ]
            },
            "teachingPoint": "Request ultrasound targeted to the persistent clinical site. The mammogram documents no correlate at that location; it does not remove the palpable target. MRI and repeating mammographic views are not the preferred next study in this sequence."
          }
        ],
        "learningSummary": "Request ultrasound targeted to the persistent clinical site. The mammogram documents no correlate at that location; it does not remove the palpable target. MRI and repeating mammographic views are not the preferred next study in this sequence."
      },
      {
        "id": "case.gs028c.palpable-breast.a-discordant-exam",
        "displayName": "Persistent palpable breast finding",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.a-discordant-exam.flags5r1",
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
        "chiefComplaint": "Imaging does not explain lump",
        "presentation": "{patientName}, a 47-year-old woman, attends clinic for focal breast thickening reproduced on two examinations.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.47.flags5r1",
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
            "presentation": "{patientName}, a 47-year-old woman, attends clinic for focal breast thickening reproduced on two examinations."
          },
          {
            "id": "profile.gs028c.palpable-breast.a-discordant-exam.female.61.flags5r1",
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
            "presentation": "{patientName}, a 61-year-old woman, attends clinic for focal breast thickening reproduced on two examinations."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ACR Appropriateness Criteria: Palpable Breast Masses"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028c.palpable-breast.a-discordant-exam.1",
            "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r3",
            "primaryConceptId": "concept.palpable-breast.negative-mammogram-targeted-us",
            "stem": "Which imaging study should be requested next for {patientName}'s palpable breast finding?",
            "answerChoices": [
              {
                "id": "correct_4",
                "label": "Targeted breast ultrasound",
                "isCorrect": true,
                "rationale": "A reproducible palpable target requires site-directed ultrasound when the diagnostic mammogram provides no correlate.",
                "serviceRequest": {
                  "serviceId": "service.ultrasound"
                }
              },
              {
                "id": "d1_4",
                "label": "Diagnostic mammographic spot-compression views",
                "isCorrect": false,
                "rationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
                "serviceRequest": {
                  "serviceId": "service.diagnostic_breast_imaging"
                }
              },
              {
                "id": "d2_4",
                "label": "Contrast-enhanced breast MRI",
                "isCorrect": false,
                "rationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
                "serviceRequest": {
                  "serviceId": "service.breast_mri"
                }
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The examination supplies a persistent target despite the absent mammographic correlate. Request ultrasound of that exact area. Neither routine screening nor a problem-solving MRI substitutes for the targeted next study.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Palpable Breast Masses"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Repeating mammographic evaluation is less useful than examining the persistent clinical target with the complementary ultrasound study after completed site-marked diagnostic views.",
                "sourceLabels": [
                  "ACR Appropriateness Criteria: Palpable Breast Masses"
                ]
              },
              {
                "answerChoiceId": "d2_4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "MRI is not the next routine evaluation of this palpable target after the supplied diagnostic mammogram; targeted ultrasound is the appropriate next study.",
                "sourceLabels": [
                  "ACR Appropriateness Criteria: Palpable Breast Masses"
                ]
              }
            ],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "Diagnostic mammogram",
                  "value": "Views include the skin-marked area. No focal density, architectural distortion or suspicious calcifications at that site."
                },
                {
                  "label": "Examination",
                  "value": "The same discrete area of thickening remains palpable."
                }
              ]
            },
            "teachingPoint": "The examination supplies a persistent target despite the absent mammographic correlate. Request ultrasound of that exact area. Neither routine screening nor a problem-solving MRI substitutes for the targeted next study."
          }
        ],
        "learningSummary": "The examination supplies a persistent target despite the absent mammographic correlate. Request ultrasound of that exact area. Neither routine screening nor a problem-solving MRI substitutes for the targeted next study."
      },
      {
        "id": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
        "displayName": "Persistent palpable breast finding",
        "patientPresentationVariantId": "presentation.gs028c.palpable-breast.b-enlarging-negative-imaging.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 43,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Enlarging breast mass",
        "presentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.43.flags5r1",
            "prototypeDemographics": {
              "ageYears": 43,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 43-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
          },
          {
            "id": "profile.gs028c.palpable-breast.b-enlarging-negative-imaging.female.57.flags5r1",
            "prototypeDemographics": {
              "ageYears": 57,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 57-year-old woman, attends clinic for a discrete breast mass that has enlarged across two examinations."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "ACR Appropriateness Criteria: Palpable Breast Masses"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028c.palpable-breast.b-enlarging-negative-imaging.1",
            "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r1",
            "primaryConceptId": "concept.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging",
            "stem": "Which diagnostic procedure should be arranged next for {patientName}'s persistent breast mass?",
            "answerChoices": [
              {
                "id": "correct_3",
                "label": "Palpation-directed core or surgical biopsy",
                "isCorrect": true,
                "rationale": "The persistent concerning clinical target requires tissue diagnosis even without an imaging correlate; the breast team selects the feasible technique.",
                "serviceRequest": null
              },
              {
                "id": "d1_3",
                "label": "Contrast-enhanced breast MRI",
                "isCorrect": false,
                "rationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
                "serviceRequest": {
                  "serviceId": "service.breast_mri"
                }
              },
              {
                "id": "d2_3",
                "label": "Repeat site-directed breast ultrasound",
                "isCorrect": false,
                "rationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
                "serviceRequest": {
                  "serviceId": "service.ultrasound"
                }
              }
            ],
            "shuffleAnswers": true,
            "explanation": "The enlarging clinical target requires tissue diagnosis despite completed site-concordant imaging without a correlate. Request palpation-directed core or surgical biopsy through the breast team. A repeat ultrasound or MRI cannot be used to dismiss that clinical target.",
            "sourceLabels": [
              "ACR Appropriateness Criteria: Palpable Breast Masses"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "Further imaging does not settle the tissue diagnosis of the concerning palpable target. MRI may have other indications but does not replace biopsy here.",
                "sourceLabels": [
                  "ACR Appropriateness Criteria: Palpable Breast Masses"
                ]
              },
              {
                "answerChoiceId": "d2_3",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "The supplied study already examined the correct clinical site. Repeating it does not resolve the persistent concerning examination.",
                "sourceLabels": [
                  "ACR Appropriateness Criteria: Palpable Breast Masses"
                ]
              }
            ],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "Diagnostic mammogram",
                  "value": "The palpable skin marker is included; no corresponding mass, distortion or suspicious calcifications."
                },
                {
                  "label": "Targeted ultrasound",
                  "value": "The surgeon's marked site was scanned; no corresponding solid or cystic lesion."
                },
                {
                  "label": "Repeat examination",
                  "value": "The same discrete mass remains palpable and is larger than on the previous examination."
                }
              ]
            },
            "teachingPoint": "The enlarging clinical target requires tissue diagnosis despite completed site-concordant imaging without a correlate. Request palpation-directed core or surgical biopsy through the breast team. A repeat ultrasound or MRI cannot be used to dismiss that clinical target."
          }
        ],
        "learningSummary": "The enlarging clinical target requires tissue diagnosis despite completed site-concordant imaging without a correlate. Request palpation-directed core or surgical biopsy through the breast team. A repeat ultrasound or MRI cannot be used to dismiss that clinical target."
      },
      {
        "id": "case.gs028d.anesthesia.a-snoring-surgery",
        "displayName": "Preanesthetic planning",
        "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-snoring-surgery.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 44,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Surgery sleep screening",
        "presentation": "{patientName}, a 44-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.44.flags5r1",
            "prototypeDemographics": {
              "ageYears": 44,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 44-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.44.flags5r1",
            "prototypeDemographics": {
              "ageYears": 44,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 44-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-snoring-surgery.female.63.flags5r1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 63-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-snoring-surgery.male.63.flags5r1",
            "prototypeDemographics": {
              "ageYears": 63,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 63-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
          "JSA guideline for management of malignant hyperthermia in 2025",
          "Perioperative Management of MH Suspected or Susceptible Patients"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028d.anesthesia.a-snoring-surgery.1",
            "questionVariantId": "question.preoperative-osa.validated-risk-screening.v1.r1",
            "primaryConceptId": "concept.preoperative-osa.validated-risk-screening",
            "stem": "Which interpretation should be recorded for {patientName}'s perioperative planning?",
            "answerChoices": [
              {
                "id": "correct_1",
                "label": "Increased OSA probability; diagnosis unconfirmed",
                "isCorrect": true,
                "rationale": "STOP-Bang assesses OSA probability. A reassuring sleepiness report does not override it, and neither screen establishes a diagnosis.",
                "serviceRequest": null
              },
              {
                "id": "d1_1",
                "label": "Increased OSA probability; diagnosis confirmed",
                "isCorrect": false,
                "rationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
                "serviceRequest": null
              },
              {
                "id": "d2_1",
                "label": "Low OSA probability; diagnosis unconfirmed",
                "isCorrect": false,
                "rationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
                "serviceRequest": null
              },
              {
                "id": "d3_1",
                "label": "Low OSA probability; diagnosis confirmed",
                "isCorrect": false,
                "rationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
                "sourceLabels": [
                  "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Perioperative Management of MH Suspected or Susceptible Patients"
                ]
              },
              {
                "answerChoiceId": "d2_1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
                "sourceLabels": [
                  "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Perioperative Management of MH Suspected or Susceptible Patients"
                ]
              },
              {
                "answerChoiceId": "d3_1",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
                "sourceLabels": [
                  "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Perioperative Management of MH Suspected or Susceptible Patients"
                ]
              }
            ],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "STOP-Bang report",
                  "value": "Flagged by the validated screening tool."
                },
                {
                  "label": "Epworth Sleepiness Scale report",
                  "value": "Not flagged for increased daytime sleepiness."
                },
                {
                  "label": "Diagnostic testing",
                  "value": "No diagnostic sleep-study result is recorded."
                }
              ]
            },
            "teachingPoint": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result."
          }
        ],
        "learningSummary": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result."
      },
      {
        "id": "case.gs028d.anesthesia.a-validated-not-impression",
        "displayName": "Preanesthetic planning",
        "patientPresentationVariantId": "presentation.gs028d.anesthesia.a-validated-not-impression.flags5r1",
        "releasePointId": "release.l0.clinic_evaluation",
        "patientDisplayName": "{patientName}",
        "prototypeDemographics": {
          "ageYears": 46,
          "sexLabel": "Female"
        },
        "prototypeVitalSigns": {
          "heartRateBpm": 76,
          "systolicBloodPressureMmHg": 118,
          "diastolicBloodPressureMmHg": 74,
          "temperatureF": 98.4,
          "oxygenSaturationPercent": 99
        },
        "chiefComplaint": "Preop sleep concern",
        "presentation": "{patientName}, a 46-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported.",
        "approvedInstantiationProfiles": [
          {
            "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.46.flags5r1",
            "prototypeDemographics": {
              "ageYears": 46,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 46-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.46.flags5r1",
            "prototypeDemographics": {
              "ageYears": 46,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 46-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-validated-not-impression.female.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Female"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old woman, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          },
          {
            "id": "profile.gs028d.anesthesia.a-validated-not-impression.male.68.flags5r1",
            "prototypeDemographics": {
              "ageYears": 68,
              "sexLabel": "Male"
            },
            "prototypeVitalSigns": {
              "heartRateBpm": 76,
              "systolicBloodPressureMmHg": 118,
              "diastolicBloodPressureMmHg": 74,
              "temperatureF": 98.4,
              "oxygenSaturationPercent": 99
            },
            "presentation": "{patientName}, a 68-year-old man, attends preoperative clinic before abdominal surgery. {patientName}'s partner reports loud snoring and breathing pauses. Daytime sleepiness is not reported."
          }
        ],
        "tutorialEligible": false,
        "routineEligible": true,
        "earliestFacilityStage": 0,
        "requiredClinicalSetting": "clinic",
        "requiredCapabilityIds": [],
        "rewardTierId": "reward.clinic_basic",
        "sourceLabels": [
          "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
          "JSA guideline for management of malignant hyperthermia in 2025",
          "Perioperative Management of MH Suspected or Susceptible Patients"
        ],
        "decisionNodes": [
          {
            "id": "node.gs028d.anesthesia.a-validated-not-impression.1",
            "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r6",
            "primaryConceptId": "concept.preoperative-osa.validated-risk-screening",
            "stem": "Which interpretation should be recorded for {patientName}'s perioperative planning?",
            "answerChoices": [
              {
                "id": "correct_4",
                "label": "Increased OSA probability; diagnosis unconfirmed",
                "isCorrect": true,
                "rationale": "STOP-Bang assesses OSA probability. A reassuring sleepiness report does not override it, and neither screen establishes a diagnosis.",
                "serviceRequest": null
              },
              {
                "id": "d1_4",
                "label": "Increased OSA probability; diagnosis confirmed",
                "isCorrect": false,
                "rationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
                "serviceRequest": null
              },
              {
                "id": "d2_4",
                "label": "Low OSA probability; diagnosis unconfirmed",
                "isCorrect": false,
                "rationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
                "serviceRequest": null
              },
              {
                "id": "d3_4",
                "label": "Low OSA probability; diagnosis confirmed",
                "isCorrect": false,
                "rationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
                "serviceRequest": null
              }
            ],
            "shuffleAnswers": true,
            "explanation": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result.",
            "sourceLabels": [
              "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
              "JSA guideline for management of malignant hyperthermia in 2025",
              "Perioperative Management of MH Suspected or Susceptible Patients"
            ],
            "resultGateAfter": null,
            "terminalDispositions": [
              {
                "answerChoiceId": "d1_4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "The probability report is pertinent, but a screening result is not a diagnostic sleep-study result.",
                "sourceLabels": [
                  "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Perioperative Management of MH Suspected or Susceptible Patients"
                ]
              },
              {
                "answerChoiceId": "d2_4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "A daytime-sleepiness instrument does not negate the separate OSA-probability screen.",
                "sourceLabels": [
                  "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Perioperative Management of MH Suspected or Susceptible Patients"
                ]
              },
              {
                "answerChoiceId": "d3_4",
                "kind": "no_terminal_outcome",
                "consequenceNarrative": "Review the clinical interpretation before continuing.",
                "clinicalRationale": "This reverses the relevant probability report and assigns diagnostic certainty not established by the record.",
                "sourceLabels": [
                  "SASM Guidelines on Preoperative Screening and Assessment of Adult Patients With OSA",
                  "JSA guideline for management of malignant hyperthermia in 2025",
                  "Perioperative Management of MH Suspected or Susceptible Patients"
                ]
              }
            ],
            "exhibit": {
              "kind": "keyValue",
              "caption": "Constructed clinical record",
              "items": [
                {
                  "label": "STOP-Bang report",
                  "value": "Flagged by the validated screening tool."
                },
                {
                  "label": "Epworth Sleepiness Scale report",
                  "value": "Not flagged for increased daytime sleepiness."
                },
                {
                  "label": "Diagnostic testing",
                  "value": "No diagnostic sleep-study result is recorded."
                }
              ]
            },
            "teachingPoint": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result."
          }
        ],
        "learningSummary": "STOP-Bang and Epworth address different targets: OSA probability versus daytime sleepiness. Record increased OSA probability and communicate it for perioperative planning, without calling the screen a confirmed diagnosis. The reassuring sleepiness result does not cancel the OSA-probability result."
      }
    ]
  },
  "fieldMappings": [
    {
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.r1",
      "caseId": "case.gs028.varicose-veins.paired-aching-standing",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.varicose.intervention-referral",
            "claim.varicose.conservative-boundary"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.01",
            "claim.varicose.intervention-referral",
            "claim.varicose.conservative-boundary"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v3.r1",
      "caseId": "case.gs028.varicose-veins.b-prefers-conservative",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.varicose.conservative-boundary"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.02",
            "claim.varicose.conservative-boundary"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.varicose-veins.intervention-referral-after-axial-reflux.v1.p2e.capacity-refusal.v4.r1",
      "caseId": "case.gs028se.p2e.capacity-refusal.v4.varicose",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.varicose.intervention-referral",
            "claim.varicose.conservative-boundary",
            "claim.gs028se.capacity-refusal.4",
            "claim.gs028se.capacity-refusal.3"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.03",
            "claim.varicose.intervention-referral",
            "claim.varicose.conservative-boundary",
            "claim.gs028se.capacity-refusal.4",
            "claim.gs028se.capacity-refusal.3"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v1.r1",
      "caseId": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.cirrhosis.multifactor-risk",
            "claim.cirrhosis.optimize-decompensation"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.04",
            "claim.cirrhosis.multifactor-risk",
            "claim.cirrhosis.optimize-decompensation"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v2.r1",
      "caseId": "case.gs028b.cirrhosis-perioperative.a-compensated",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.cirrhosis.multifactor-risk"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.05",
            "claim.cirrhosis.multifactor-risk"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v3.r7",
      "caseId": "case.gs028b.cirrhosis-perioperative.a-portal-hypertension",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.cirrhosis.multifactor-risk"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.06",
            "claim.cirrhosis.multifactor-risk"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.cirrhosis-perioperative-risk.multifactor-assessment.v4.r1",
      "caseId": "case.gs028b.cirrhosis-perioperative.a-center-expertise",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.cirrhosis.multifactor-risk",
            "claim.cirrhosis.optimize-decompensation"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.07",
            "claim.cirrhosis.multifactor-risk",
            "claim.cirrhosis.optimize-decompensation"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.cirrhosis-perioperative-risk.decompensation-optimization-boundary.v1.r3",
      "caseId": "case.gs028b.cirrhosis-perioperative.paired-single-albumin",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.cirrhosis.optimize-decompensation",
            "claim.qf3.cirrhosis-urgent-hernia-boundary"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.08",
            "claim.cirrhosis.optimize-decompensation",
            "claim.qf3.cirrhosis-urgent-hernia-boundary"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.preoperative-osa.validated-risk-screening.v1.r1",
      "caseId": "case.gs028d.anesthesia.a-snoring-surgery",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.gs028d.osa.validated-screen",
            "claim.qf2.sleep-questionnaire-domain-interpretation"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.09",
            "claim.gs028d.osa.validated-screen",
            "claim.qf2.sleep-questionnaire-domain-interpretation"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.preoperative-osa.validated-risk-screening.v4.r6",
      "caseId": "case.gs028d.anesthesia.a-validated-not-impression",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.gs028d.osa.validated-screen",
            "claim.qf2.sleep-questionnaire-domain-interpretation"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.10",
            "claim.gs028d.osa.validated-screen",
            "claim.qf2.sleep-questionnaire-domain-interpretation"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v2.r1",
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.gs028c.palpable.targeted-us"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.11",
            "claim.gs028c.palpable.targeted-us"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v3.r1",
      "caseId": "case.gs028c.palpable-breast.a-recent-negative",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.gs028c.palpable.targeted-us"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.12",
            "claim.gs028c.palpable.targeted-us"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.palpable-breast.negative-mammogram-targeted-us.v4.r3",
      "caseId": "case.gs028c.palpable-breast.a-discordant-exam",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.gs028c.palpable.targeted-us"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.13",
            "claim.gs028c.palpable.targeted-us"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v2.r1",
      "caseId": "case.gs028c.palpable-breast.paired-scar-edge",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.gs028c.palpable.biopsy"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.14",
            "claim.gs028c.palpable.biopsy"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.palpable-breast.suspicious-mass-biopsy-despite-negative-imaging.v3.r1",
      "caseId": "case.gs028c.palpable-breast.b-enlarging-negative-imaging",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.gs028c.palpable.biopsy"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.15",
            "claim.gs028c.palpable.biopsy"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.ptld.tissue-diagnosis-coordination.v4.r5",
      "caseId": "case.gs028b.ptld.b-pathology-returned",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.owner-decisions.20261112.ptld-architecture",
            "claim.owner-decisions.20261112.ptld-fresh-flow",
            "claim.owner-decisions.20261112.ptld-fixed-histology"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.16",
            "claim.owner-decisions.20261112.ptld-architecture",
            "claim.owner-decisions.20261112.ptld-fresh-flow",
            "claim.owner-decisions.20261112.ptld-fixed-histology"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.achalasia.high-resolution-manometry.v4.r6",
      "caseId": "case.achalasia.clinic-referral",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.achalasia.high-resolution-manometry",
            "claim.qq20261102a.esophageal-physiology-sequence",
            "claim.qq20261102c.hrm-incomplete-placement"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.17",
            "claim.achalasia.high-resolution-manometry",
            "claim.qq20261102a.esophageal-physiology-sequence",
            "claim.qq20261102c.hrm-incomplete-placement"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    },
    {
      "questionVariantId": "question.achalasia.manometric-recognition.v4.r5",
      "caseId": "case.achalasia.clinic-referral",
      "fields": [
        {
          "field": "presentation / currentUpdate / exhibit",
          "type": "Constructed qualitative adult observations; retained ages and previously supported pressure values only.",
          "claimIds": [
            "claim.achalasia.manometric-recognition",
            "claim.achalasia.high-resolution-manometry",
            "claim.qq20261102.motility-egjoo",
            "claim.qq20261102.motility-absent-contractility",
            "claim.qq20261102a.failed-contraction-threshold",
            "claim.qq20261102b.secondary-achalasia-assessment"
          ]
        },
        {
          "field": "task / options / rationales / explanation",
          "type": "Original application of mapped facts; options are competing hypotheses or plans, not additional asserted diagnoses.",
          "claimIds": [
            "claim.flags5.20261116.application.18",
            "claim.achalasia.manometric-recognition",
            "claim.achalasia.high-resolution-manometry",
            "claim.qq20261102.motility-egjoo",
            "claim.qq20261102.motility-absent-contractility",
            "claim.qq20261102a.failed-contraction-threshold",
            "claim.qq20261102b.secondary-achalasia-assessment"
          ]
        }
      ],
      "contentVersion": "question-authoring.2026-11-16.flags5-r1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null
    }
  ]
} as const;
