import type {QuestionVariant,ClinicalSource,EvidenceClaim} from "./pilot-schema";
import type {SyntheticClinicalRelease} from "./schema";
export const QUESTION_HARDEN1_ROUND2_QUESTION:QuestionVariant={
  "contentVersion": "question-authoring.2026-11-10.harden1-r2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "question.groin-hernia.ultrasound-type-and-intervention.v3",
  "conceptId": "concept.groin-hernia.femoral-defect-repair-priority.v3",
  "stem": "Which hernia accounts for {patientName}'s marked lump, and is watchful waiting appropriate for that hernia?",
  "exhibit": {
    "kind": "keyValue",
    "caption": "Targeted groin ultrasound: constructed findings",
    "items": [
      {
        "label": "At the skin marker",
        "value": "A bowel-containing sac has its neck below the inguinal ligament, medial to the common femoral vein. It empties when supine."
      },
      {
        "label": "Separate cranial finding",
        "value": "Fat protrudes through a defect above the inguinal ligament, medial to the inferior epigastric vessels."
      }
    ]
  },
  "answerChoices": [
    {
      "id": "choice.harden1r2.20261110.groin.key",
      "label": "Femoral hernia; watchful waiting is unsuitable",
      "isCorrect": true,
      "rationale": "The marked sac neck follows the femoral canal. Painless spontaneous reduction does not extend the selected male inguinal observation strategy to a femoral hernia; offer elective repair planning.",
      "distractorRationale": null
    },
    {
      "id": "choice.harden1r2.20261110.groin.d1",
      "label": "Femoral hernia; watchful waiting is reasonable",
      "isCorrect": false,
      "rationale": "This identifies the marked compartment but overgeneralizes the watchful-waiting evidence for selected men with inguinal hernias to femoral anatomy.",
      "distractorRationale": "This identifies the marked compartment but overgeneralizes the watchful-waiting evidence for selected men with inguinal hernias to femoral anatomy."
    },
    {
      "id": "choice.harden1r2.20261110.groin.d2",
      "label": "Direct inguinal hernia; watchful waiting is unsuitable",
      "isCorrect": false,
      "rationale": "This assigns the separate cranial defect to the marked swelling and also denies the observation option that can be reasonable for a minimally symptomatic man with a reducible inguinal hernia.",
      "distractorRationale": "This assigns the separate cranial defect to the marked swelling and also denies the observation option that can be reasonable for a minimally symptomatic man with a reducible inguinal hernia."
    },
    {
      "id": "choice.harden1r2.20261110.groin.d3",
      "label": "Direct inguinal hernia; watchful waiting is reasonable",
      "isCorrect": false,
      "rationale": "This is a reasonable classification and observation option for the separate cranial finding. It misattributes that finding to the marked lump, whose neck is in the other compartment.",
      "distractorRationale": "This is a reasonable classification and observation option for the separate cranial finding. It misattributes that finding to the marked lump, whose neck is in the other compartment."
    }
  ],
  "explanation": "The sac at the marker passes below the ligament, medial to the vein: femoral anatomy. The separate cranial defect is direct inguinal.\nA painless reducing course can support watchful waiting for selected men with an inguinal hernia; femoral anatomy instead supports elective repair planning.\nThe nearest error identifies the femoral hernia correctly but extends the inguinal observation rule to it. This is not an emergency exploration or reduction question.",
  "supportingEvidenceClaimIds": [
    "claim.harden1r2.20261110.femoral-route",
    "claim.harden1r2.20261110.direct-route",
    "claim.harden1r2.20261110.inguinal-observation",
    "claim.harden1r2.20261110.femoral-repair",
    "claim.harden1r2.20261110.stable-boundary"
  ]
};
export const QUESTION_HARDEN1_ROUND2_CONCEPT:SyntheticClinicalRelease["concepts"][number]&Record<string,unknown>={
  "contentVersion": "question-authoring.2026-11-10.harden1-r2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "concept.groin-hernia.femoral-defect-repair-priority.v3",
  "displayName": "Groin compartment and observation eligibility",
  "learningObjective": "Attribute a marked groin swelling to the correct ultrasound neck among competing findings, then apply the anatomy-dependent boundary of watchful waiting.",
  "earliestFacilityStage": 1,
  "conceptType": "management",
  "educationalTier": 1,
  "evidenceClaimIds": [
    "claim.harden1r2.20261110.femoral-route",
    "claim.harden1r2.20261110.direct-route",
    "claim.harden1r2.20261110.inguinal-observation",
    "claim.harden1r2.20261110.femoral-repair",
    "claim.harden1r2.20261110.stable-boundary"
  ],
  "previousConceptId": "concept.groin-hernia.femoral-defect-repair-priority.v2",
  "relatedPreviousConceptIds": [
    "concept.groin-hernia.femoral-defect-repair-priority.v1",
    "concept.groin-ultrasound.proximal-neck-localization.v2"
  ],
  "conceptMeaning": "new_version",
  "conceptVersionReason": "The unaccepted acute bowel-viability/exploration objective is replaced by stable symptom-site attribution and observation eligibility with a competing direct defect. Neither the old live separate-node meaning nor the unaccepted acute v2 is silently rescored.",
  "historyMigration": "None. Old concepts, questions, source views, frozen encounters and FSRS histories stay exact. This separate candidate is not default-admitted."
};
export const QUESTION_HARDEN1_ROUND2_DEFINITION={
  "id": "H1-HERNIA-r2",
  "caseId": "case.harden1.groin-observation-eligibility.20261110.r2",
  "nodeId": "node.harden1.groin-observation-eligibility.20261110.r2",
  "educationalTier": 1,
  "acuity": "routine",
  "header": {
    "patientName": "Elliot Reed",
    "age": 59,
    "sex": "Male",
    "complaint": "Groin lump",
    "presentation": "{patientName}, a 59-year-old man, has an intermittent right groin lump. It is painless during usual activities."
  },
  "question": {
    "contentVersion": "question-authoring.2026-11-10.harden1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.groin-hernia.ultrasound-type-and-intervention.v3",
    "conceptId": "concept.groin-hernia.femoral-defect-repair-priority.v3",
    "stem": "Which hernia accounts for {patientName}'s marked lump, and is watchful waiting appropriate for that hernia?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Targeted groin ultrasound: constructed findings",
      "items": [
        {
          "label": "At the skin marker",
          "value": "A bowel-containing sac has its neck below the inguinal ligament, medial to the common femoral vein. It empties when supine."
        },
        {
          "label": "Separate cranial finding",
          "value": "Fat protrudes through a defect above the inguinal ligament, medial to the inferior epigastric vessels."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.harden1r2.20261110.groin.key",
        "label": "Femoral hernia; watchful waiting is unsuitable",
        "isCorrect": true,
        "rationale": "The marked sac neck follows the femoral canal. Painless spontaneous reduction does not extend the selected male inguinal observation strategy to a femoral hernia; offer elective repair planning.",
        "distractorRationale": null
      },
      {
        "id": "choice.harden1r2.20261110.groin.d1",
        "label": "Femoral hernia; watchful waiting is reasonable",
        "isCorrect": false,
        "rationale": "This identifies the marked compartment but overgeneralizes the watchful-waiting evidence for selected men with inguinal hernias to femoral anatomy.",
        "distractorRationale": "This identifies the marked compartment but overgeneralizes the watchful-waiting evidence for selected men with inguinal hernias to femoral anatomy."
      },
      {
        "id": "choice.harden1r2.20261110.groin.d2",
        "label": "Direct inguinal hernia; watchful waiting is unsuitable",
        "isCorrect": false,
        "rationale": "This assigns the separate cranial defect to the marked swelling and also denies the observation option that can be reasonable for a minimally symptomatic man with a reducible inguinal hernia.",
        "distractorRationale": "This assigns the separate cranial defect to the marked swelling and also denies the observation option that can be reasonable for a minimally symptomatic man with a reducible inguinal hernia."
      },
      {
        "id": "choice.harden1r2.20261110.groin.d3",
        "label": "Direct inguinal hernia; watchful waiting is reasonable",
        "isCorrect": false,
        "rationale": "This is a reasonable classification and observation option for the separate cranial finding. It misattributes that finding to the marked lump, whose neck is in the other compartment.",
        "distractorRationale": "This is a reasonable classification and observation option for the separate cranial finding. It misattributes that finding to the marked lump, whose neck is in the other compartment."
      }
    ],
    "explanation": "The sac at the marker passes below the ligament, medial to the vein: femoral anatomy. The separate cranial defect is direct inguinal.\nA painless reducing course can support watchful waiting for selected men with an inguinal hernia; femoral anatomy instead supports elective repair planning.\nThe nearest error identifies the femoral hernia correctly but extends the inguinal observation rule to it. This is not an emergency exploration or reduction question.",
    "supportingEvidenceClaimIds": [
      "claim.harden1r2.20261110.femoral-route",
      "claim.harden1r2.20261110.direct-route",
      "claim.harden1r2.20261110.inguinal-observation",
      "claim.harden1r2.20261110.femoral-repair",
      "claim.harden1r2.20261110.stable-boundary"
    ]
  },
  "concept": {
    "contentVersion": "question-authoring.2026-11-10.harden1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.groin-hernia.femoral-defect-repair-priority.v3",
    "displayName": "Groin compartment and observation eligibility",
    "learningObjective": "Attribute a marked groin swelling to the correct ultrasound neck among competing findings, then apply the anatomy-dependent boundary of watchful waiting.",
    "earliestFacilityStage": 1,
    "conceptType": "management",
    "educationalTier": 1,
    "evidenceClaimIds": [
      "claim.harden1r2.20261110.femoral-route",
      "claim.harden1r2.20261110.direct-route",
      "claim.harden1r2.20261110.inguinal-observation",
      "claim.harden1r2.20261110.femoral-repair",
      "claim.harden1r2.20261110.stable-boundary"
    ],
    "previousConceptId": "concept.groin-hernia.femoral-defect-repair-priority.v2",
    "relatedPreviousConceptIds": [
      "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "concept.groin-ultrasound.proximal-neck-localization.v2"
    ],
    "conceptMeaning": "new_version",
    "conceptVersionReason": "The unaccepted acute bowel-viability/exploration objective is replaced by stable symptom-site attribution and observation eligibility with a competing direct defect. Neither the old live separate-node meaning nor the unaccepted acute v2 is silently rescored.",
    "historyMigration": "None. Old concepts, questions, source views, frozen encounters and FSRS histories stay exact. This separate candidate is not default-admitted."
  },
  "statementMappings": [
    {
      "fields": [
        "exhibit at skin marker",
        "femoral option component",
        "explanation first line"
      ],
      "claimIds": [
        "claim.harden1r2.20261110.femoral-route"
      ]
    },
    {
      "fields": [
        "exhibit separate cranial finding",
        "direct option component",
        "explanation first line"
      ],
      "claimIds": [
        "claim.harden1r2.20261110.direct-route"
      ]
    },
    {
      "fields": [
        "painless daily activity",
        "spontaneous reduction",
        "inguinal comparator and counterfactual"
      ],
      "claimIds": [
        "claim.harden1r2.20261110.inguinal-observation"
      ]
    },
    {
      "fields": [
        "key observation boundary",
        "elective repair explanation"
      ],
      "claimIds": [
        "claim.harden1r2.20261110.femoral-repair"
      ]
    },
    {
      "fields": [
        "presentation acute-boundary observations",
        "no emergency assertion"
      ],
      "claimIds": [
        "claim.harden1r2.20261110.stable-boundary"
      ]
    }
  ]
} as const;
export const QUESTION_HARDEN1_ROUND2_CLAIMS:(EvidenceClaim&{basisClaimIds:string[];verificationScope:string})[]=[
  {
    "contentVersion": "question-authoring.2026-11-10.harden1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.harden1r2.20261110.femoral-route",
    "statement": "A sac neck below the inguinal ligament and medial to the common femoral vein identifies a femoral hernia.",
    "sourceIds": [
      "source.bread-butter.picasso-groin-ultrasound-2021",
      "source.bread-butter.herniasurge-2018"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Anatomical classification only; the constructed ultrasound is not a copied image or source table and establishes no urgency or operative technique by itself.",
    "applicablePopulation": "This constructed stable adult groin case; not an acute reduction, bowel-viability or operative-technique decision.",
    "lastCheckedOn": "2026-11-10",
    "basisClaimIds": [
      "claim.flags3.20261107.groin-compartment"
    ],
    "verificationScope": "Offline application of existing recorded claims. Original retrieval dates retained; no new source access, new threshold or new clinical-currentness verification."
  },
  {
    "contentVersion": "question-authoring.2026-11-10.harden1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.harden1r2.20261110.direct-route",
    "statement": "A groin defect above the inguinal ligament and medial to the inferior epigastric vessels is a direct inguinal defect.",
    "sourceIds": [
      "source.review.inguinal-releasing-incisions.2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Recorded technical-anatomy fact; one narrative-review source. Clinical approval of an old claim does not approve this new distractor application.",
    "applicablePopulation": "This constructed stable adult groin case; not an acute reduction, bowel-viability or operative-technique decision.",
    "lastCheckedOn": "2026-11-10",
    "basisClaimIds": [
      "claim.flags3.20261107.direct-comparator"
    ],
    "verificationScope": "Offline application of existing recorded claims. Original retrieval dates retained; no new source access, new threshold or new clinical-currentness verification."
  },
  {
    "contentVersion": "question-authoring.2026-11-10.harden1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.harden1r2.20261110.inguinal-observation",
    "statement": "An informed man with a reducible inguinal hernia that causes absent or minimal symptoms may reasonably choose watchful waiting.",
    "sourceIds": [
      "source.bread-butter.herniasurge-2018",
      "source.bread-butter.herniasurge-update-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This does not apply to women, femoral hernias, activity-limiting symptoms, irreducibility, obstruction, or strangulation.",
    "applicablePopulation": "This constructed stable adult groin case; not an acute reduction, bowel-viability or operative-technique decision.",
    "lastCheckedOn": "2026-11-10",
    "basisClaimIds": [
      "claim.bread-butter.inguinal-hernia.watchful-waiting"
    ],
    "verificationScope": "Offline application of existing recorded claims. Original retrieval dates retained; no new source access, new threshold or new clinical-currentness verification."
  },
  {
    "contentVersion": "question-authoring.2026-11-10.harden1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.harden1r2.20261110.femoral-repair",
    "statement": "A stable reducible femoral hernia calls for elective repair planning rather than extending the selected male inguinal watchful-waiting strategy.",
    "sourceIds": [
      "source.bread-butter.herniasurge-2018",
      "source.bread-butter.herniasurge-update-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Femoral repair direction has one adequate recorded guideline; the 2023 update cross-checks the inguinal observation boundary. No fixed deadline, risk percentage or technique is taught.",
    "applicablePopulation": "This constructed stable adult groin case; not an acute reduction, bowel-viability or operative-technique decision.",
    "lastCheckedOn": "2026-11-10",
    "basisClaimIds": [
      "claim.flags3.20261107.reducible-femoral-plan"
    ],
    "verificationScope": "Offline application of existing recorded claims. Original retrieval dates retained; no new source access, new threshold or new clinical-currentness verification."
  },
  {
    "contentVersion": "question-authoring.2026-11-10.harden1-r2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.harden1r2.20261110.stable-boundary",
    "statement": "A spontaneously reducing, painless groin swelling without obstructive symptoms does not establish the emergency described by persistent pain, irreducibility or suspected ischemia.",
    "sourceIds": [
      "source.bread-butter.herniasurge-2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Case-bound acuity distinction from the recorded claim limitation, not a rule that absence of a single symptom excludes incarceration or ischemia.",
    "applicablePopulation": "This constructed stable adult groin case; not an acute reduction, bowel-viability or operative-technique decision.",
    "lastCheckedOn": "2026-11-10",
    "basisClaimIds": [
      "claim.flags3.20261107.acute-boundary"
    ],
    "verificationScope": "Offline application of existing recorded claims. Original retrieval dates retained; no new source access, new threshold or new clinical-currentness verification."
  }
];
export const QUESTION_HARDEN1_ROUND2_BASIS_CLAIMS:(EvidenceClaim&Record<string,unknown>)[]=[
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.groin-compartment",
    "statement": "A groin sac neck below the inguinal ligament and medial to the common femoral vein identifies the femoral-canal route.",
    "basisClaimIds": [
      "claim.qbp2ar2.femoral-anatomy-application"
    ],
    "sourceIds": [
      "source.bread-butter.picasso-groin-ultrasound-2021",
      "source.bread-butter.herniasurge-2018"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Anatomical classification only; the constructed ultrasound is not a copied image or source table and establishes no urgency or operative technique by itself.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.direct-comparator",
    "statement": "A direct inguinal hernia passes through Hesselbach's triangle medial to the inferior epigastric vessels.",
    "basisClaimIds": [
      "claim.inguinal-hernia.direct-anatomic-location"
    ],
    "sourceIds": [
      "source.review.inguinal-releasing-incisions.2023"
    ],
    "evidenceCategory": "anatomy",
    "certainty": "moderate",
    "limitation": "Recorded technical-anatomy fact; one narrative-review source. Clinical approval of an old claim does not approve this new distractor application.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "development-batch.2026-09-17.bread-and-butter.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.bread-butter.inguinal-hernia.watchful-waiting",
    "statement": "Watchful waiting is a safe option for informed men with asymptomatic or minimally symptomatic reducible inguinal hernias, although later repair is common when symptoms develop.",
    "sourceIds": [
      "source.bread-butter.herniasurge-2018",
      "source.bread-butter.herniasurge-update-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "high",
    "limitation": "This does not apply to women, femoral hernias, activity-limiting symptoms, irreducibility, obstruction, or strangulation.",
    "applicablePopulation": "Men with a confirmed reducible inguinal hernia and absent or minimal symptoms.",
    "lastCheckedOn": "2026-09-17"
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.reducible-femoral-plan",
    "statement": "A stable reducible femoral hernia supports timely elective repair planning despite mild symptoms; the selected minimally symptomatic male inguinal watchful-waiting rule does not extend to femoral anatomy.",
    "basisClaimIds": [
      "claim.bread-butter.femoral-hernia.timely-repair",
      "claim.bread-butter.inguinal-hernia.watchful-waiting"
    ],
    "sourceIds": [
      "source.bread-butter.herniasurge-2018",
      "source.bread-butter.herniasurge-update-2023"
    ],
    "evidenceCategory": "management",
    "certainty": "moderate",
    "limitation": "Femoral repair direction has one adequate recorded guideline; the 2023 update cross-checks the inguinal observation boundary. No fixed deadline, risk percentage or technique is taught.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  },
  {
    "contentVersion": "question-authoring.2026-11-07.flags3-r1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "claim.flags3.20261107.acute-boundary",
    "statement": "Persistent pain, irreducibility, obstruction or ischemic concern would change the stable femoral-herniation scenario to urgent assessment; the described reducing, nontender finding without obstructive symptoms does not establish that emergency.",
    "basisClaimIds": [
      "claim.bread-butter.femoral-hernia.timely-repair"
    ],
    "sourceIds": [
      "source.bread-butter.herniasurge-2018"
    ],
    "evidenceCategory": "safety_boundary",
    "certainty": "moderate",
    "limitation": "Case-bound acuity distinction from the recorded claim limitation, not a rule that absence of a single symptom excludes incarceration or ischemia.",
    "applicablePopulation": "Only the identified constructed flags3 clinic/audit scenarios; no general test-performance, risk, timing or treatment cutoff is introduced.",
    "lastCheckedOn": "2026-11-07",
    "verificationScope": "Independently written application/mathematical check of previously recorded facts; not a new source retrieval or source-currentness check."
  }
];
export const QUESTION_HARDEN1_ROUND2_SOURCES:(ClinicalSource&Record<string,unknown>)[]=[
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.picasso-groin-ultrasound-2021",
    "title": "High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways",
    "completeCitation": "Picasso R, Pistoia F, Zaottini F, Airaldi S, Miguel Perez M, Pansecchi M, Tovt L, Sanguinetti S, Moller I, Bruns A, Martinoli C. High-resolution ultrasound of spigelian and groin hernias: a closer look at fascial architecture and aponeurotic passageways. J Ultrason. 2021;21(84):e53-e62. doi:10.15557/JoU.2021.0008. PMID:33791116. PMCID:PMC8008201.",
    "organizationOrJournal": "Journal of Ultrasonography / Polish Ultrasound Society",
    "authors": [
      "Picasso R",
      "Pistoia F",
      "Zaottini F",
      "Airaldi S",
      "Miguel Perez M",
      "Pansecchi M",
      "Tovt L",
      "Sanguinetti S",
      "Moller I",
      "Bruns A",
      "Martinoli C"
    ],
    "publicationYear": 2021,
    "doi": "10.15557/JoU.2021.0008",
    "pmid": "33791116",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8008201/",
    "accessedOn": "2026-09-17",
    "sourceClass": "narrative_review",
    "licenseLabel": "Creative Commons Attribution-NonCommercial-NoDerivatives",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Only an independently written anatomy fact is stored; no source prose, images, diagrams, videos, or tables reproduced. N1 round two reuses bibliographic metadata and independent atomic synthesis only. No source text, figure, algorithm or table retrieved/copied. Original access dates retained. Named-example extensions and exact option ranking require targeted clinician/source verification. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Open peer-reviewed imaging-anatomy review directly supporting the deep-ring and vessel relationship.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.harden1r2.20261110.femoral-route"
    ],
    "intendedUse": "Offline factual synthesis for harden1 round2; original access date and license retained. No source prose, image, table or algorithm copied.",
    "originalAccessedOn": "2026-09-17",
    "sourceStatus": "recorded_metadata_no_new_retrieval"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.herniasurge-2018",
    "title": "International guidelines for groin hernia management",
    "completeCitation": "The HerniaSurge Group. International guidelines for groin hernia management. Hernia. 2018;22(1):1-165. doi:10.1007/s10029-017-1668-x. PMID:29330835. PMCID:PMC5809582.",
    "organizationOrJournal": "Hernia / HerniaSurge Group",
    "authors": [
      "The HerniaSurge Group"
    ],
    "publicationYear": 2018,
    "doi": "10.1007/s10029-017-1668-x",
    "pmid": "29330835",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5809582/",
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution-NonCommercial 4.0 International",
    "reuseStatus": "cc_by_nc_4_0_restricted",
    "reuseNotes": "Attributed original factual synthesis for noncommercial development; no source prose, tables, figures, or algorithms reproduced. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Multisociety international guideline defining the selected watchful-waiting phenotype and timely femoral-hernia repair direction.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.harden1r2.20261110.femoral-route",
      "claim.harden1r2.20261110.inguinal-observation",
      "claim.harden1r2.20261110.femoral-repair",
      "claim.harden1r2.20261110.stable-boundary"
    ],
    "intendedUse": "Offline factual synthesis for harden1 round2; original access date and license retained. No source prose, image, table or algorithm copied.",
    "originalAccessedOn": "2026-09-17",
    "sourceStatus": "recorded_metadata_no_new_retrieval"
  },
  {
    "contentVersion": "clinical.owner-rows-008-025.2026-08-06.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.review.inguinal-releasing-incisions.2023",
    "title": "The Role of Releasing Incisions in Emergency Inguinal Hernia Repair",
    "completeCitation": "Weitzner ZN, Chen DC. The Role of Releasing Incisions in Emergency Inguinal Hernia Repair. J Abdom Wall Surg. 2023;2:11378. doi:10.3389/jaws.2023.11378.",
    "organizationOrJournal": "Journal of Abdominal Wall Surgery",
    "authors": [
      "ZN Weitzner",
      "DC Chen"
    ],
    "publicationYear": 2023,
    "doi": "10.3389/jaws.2023.11378",
    "pmid": null,
    "officialUrl": "https://www.frontierspartnerships.org/journals/journal-of-abdominal-wall-surgery/articles/10.3389/jaws.2023.11378/full",
    "accessedOn": "2026-07-30",
    "sourceClass": "narrative_review",
    "licenseLabel": "CC BY 4.0",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Credit the authors and publication, link the license, and exclude figures, supplementary video, separately credited material, and third-party assets.",
    "authorityAssessment": "A current technical narrative review suitable for the bounded spatial anatomy of direct inguinal hernia; it is not comparative or diagnostic-performance evidence.",
    "usageRole": "evidence",
    "evidenceClaimIds": [
      "claim.harden1r2.20261110.direct-route"
    ],
    "intendedUse": "Offline factual synthesis for harden1 round2; original access date and license retained. No source prose, image, table or algorithm copied.",
    "originalAccessedOn": "2026-07-30",
    "sourceStatus": "recorded_metadata_no_new_retrieval"
  },
  {
    "contentVersion": "clinical.question-new-n1.2026-11-04.v3",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.bread-butter.herniasurge-update-2023",
    "title": "Update of the international HerniaSurge guidelines for groin hernia management",
    "completeCitation": "Stabilini C, van Veenendaal N, Aasvang E, et al. Update of the international HerniaSurge guidelines for groin hernia management. BJS Open. 2023;7(5):zrad080. doi:10.1093/bjsopen/zrad080. PMID:37862616.",
    "organizationOrJournal": "BJS Open / HerniaSurge Collaboration",
    "authors": [
      "Cesare Stabilini",
      "Nadine van Veenendaal",
      "Eske Aasvang",
      "Ferdinando Agresta",
      "Theo Aufenacker",
      "Frederik Berrevoet",
      "Ine Burgmans",
      "David Chen",
      "Andrew de Beaux",
      "Barbora East",
      "José Garcia-Alamino",
      "Nadia Henriksen",
      "Ferdinand Köckerling",
      "Jan Kukleta",
      "Maarten Loos",
      "Manuel Lopez-Cano",
      "Ralph Lorenz",
      "Marc Miserez",
      "Agneta Montgomery",
      "Salvador Morales-Conde",
      "Chris Oppong",
      "Maciej Pawlak",
      "Mauro Podda",
      "Wolfgang Reinpold",
      "David Sanders",
      "Alberto Sartori",
      "Hanh Minh Tran",
      "Mireia Verdaguer",
      "Reiko Wiessner",
      "Michael Yeboah",
      "Willem Zwaans",
      "Maarten Simons"
    ],
    "publicationYear": 2023,
    "doi": "10.1093/bjsopen/zrad080",
    "pmid": "37862616",
    "officialUrl": "https://academic.oup.com/bjsopen/article/7/5/zrad080/7325871",
    "accessedOn": "2026-09-17",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Creative Commons Attribution 4.0 International",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Original factual synthesis with citation; no source prose, tables, figures, or algorithms reproduced. N1 round three retains actual access metadata. No source text/figure/table retrieved or copied. New applications have explicit provenance and targeted holds; citation is not proof that an extension was verified.",
    "authorityAssessment": "Current international guideline update corroborating safety and later crossover for watchful waiting in selected men.",
    "usageRole": "cross_check",
    "evidenceClaimIds": [
      "claim.harden1r2.20261110.inguinal-observation",
      "claim.harden1r2.20261110.femoral-repair"
    ],
    "intendedUse": "Offline factual synthesis for harden1 round2; original access date and license retained. No source prose, image, table or algorithm copied.",
    "originalAccessedOn": "2026-09-17",
    "sourceStatus": "recorded_metadata_no_new_retrieval"
  }
];
