# Pediatric GI and abdominal wall topic packet: independent-review follow-up

## Assignment (complete program extraction)

Manager dispatch 2026-11-11, wave 8. Slug pediatric-gi-abdominal-wall. The complete original assignment below retains all primary-topic inventory, concept, case, node and variant rows, relevant identity notes, holds, withheld/unkeyed records and frozen/approval references. It is a historical assignment snapshot; the current review dispositions follow it.

```json
{
  "slug": "pediatric-gi-abdominal-wall",
  "title": "Pediatrics — GI and abdominal wall",
  "wave": 8,
  "scopeIn": "Neonatal/childhood GI obstruction, malrotation, atresia, NEC, Hirschsprung, intussusception, pediatric abdominal masses and age-specific hernia care.",
  "scopeOut": "Pediatric neck, chest wall and GU belong to pediatric-neck-thoracic-gu. An age-neutral reused adult concept retains its organ-topic owner. Trauma belongs to trauma topics.",
  "priority": "medium",
  "priorityReason": "Current pediatric clinic cases leave much of surgical pediatric GI untested.",
  "startingCounts": {
    "liveConcepts": 1,
    "liveNodes": 2,
    "liveCases": 2,
    "liveVariants": 2,
    "liveAcceptedNodes": 0,
    "liveOriginalNodes": 2,
    "registeredConcepts": 1,
    "registeredWithoutLiveNodes": 0,
    "drafts": 1,
    "draftVariants": 1,
    "draftConcepts": 1,
    "explicitOwnerHeldVersions": 0,
    "unassembledDraftVariants": 0,
    "unkeyedParkedSlots": 1,
    "withheldTeachingPoints": 2,
    "liveClinicalConcepts": 1
  },
  "taxonomy": {
    "slug": "pediatric-gi-abdominal-wall",
    "title": "Pediatrics — GI and abdominal wall",
    "priority": "medium",
    "scopeIn": "Neonatal/childhood GI obstruction, malrotation, atresia, NEC, Hirschsprung, intussusception, pediatric abdominal masses and age-specific hernia care.",
    "scopeOut": "Pediatric neck, chest wall and GU belong to pediatric-neck-thoracic-gu. An age-neutral reused adult concept retains its organ-topic owner. Trauma belongs to trauma topics.",
    "priorityReason": "Current pediatric clinic cases leave much of surgical pediatric GI untested.",
    "researchAgenda": [
      "Neonatal obstruction and urgent operative sequence",
      "Intussusception and age-specific reduction boundaries",
      "Congenital abdominal-wall defects and childhood groin care"
    ],
    "counts": {
      "liveConcepts": 1,
      "liveNodes": 2,
      "liveCases": 2,
      "liveVariants": 2,
      "liveAcceptedNodes": 0,
      "liveOriginalNodes": 2,
      "registeredConcepts": 1,
      "registeredWithoutLiveNodes": 0,
      "drafts": 1,
      "draftVariants": 1,
      "draftConcepts": 1,
      "explicitOwnerHeldVersions": 0,
      "unassembledDraftVariants": 0,
      "unkeyedParkedSlots": 1,
      "withheldTeachingPoints": 2,
      "liveClinicalConcepts": 1
    },
    "coverageSignal": "thin",
    "coverageReason": "At most four distinct live clinical concept identities cover this scope. Variants repeat those identities.",
    "testingWeightBasis": "Owner-directed editorial estimate of general-surgery testing relevance. No exam percentages or official blueprint weights are asserted.",
    "workerLane": [
      "packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.ts",
      "packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts",
      "docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.json",
      "docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.md",
      "docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json"
    ],
    "wave": 8
  },
  "concepts": [
    {
      "conceptId": "concept.n4r2.pediatric-groin-contents-and-reducibility",
      "displayName": "Intermittent groin swelling",
      "learningObjective": "Distinguish intermittent bowel-containing groin swelling from fluid-only findings and use reducibility to select the care plan.",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.0c5779b81101107a"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
          "line": 36,
          "export": "QUESTION_NEW_N4_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-n4-accepted-20261110.ts",
          "line": 171,
          "export": "QUESTION_N4_ACCEPTED_SOURCE_VIEWS",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
      "displayName": "Refer a childhood inguinal hernia",
      "learningObjective": "Refer a clinically suspected childhood inguinal hernia for pediatric surgical assessment rather than applying adult observation criteria.",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [
        "hernia-groin"
      ],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 2,
      "liveNodeOccurrences": 2,
      "inventoryRecordIds": [
        "inventory.ba2242ed0fad69df",
        "inventory.8d54669d25a2afc2"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
          "line": 14,
          "export": "HERNIA_FAMILY",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts",
          "line": 18,
          "export": "PEDIATRIC_CLINIC_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    }
  ],
  "caseAssignments": [
    {
      "caseId": "case.n4.intermittent-groin-contents-versus-fluid-scan.v1",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.0c5779b81101107a"
      ],
      "nodeIds": [
        "node.n4.intermittent-groin-contents-versus-fluid-scan.v1"
      ],
      "variantIds": [
        "question.n4.intermittent-groin-contents-versus-fluid-scan.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.pediatric-clinic.groin-bulge-after-play",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "pediatric-gi-abdominal-wall"
      ],
      "inventoryRecordIds": [
        "inventory.ba2242ed0fad69df"
      ],
      "nodeIds": [
        "node.pediatric-clinic.groin-bulge-after-play.1"
      ],
      "variantIds": [
        "question.pediatric-clinic.groin-bulge-after-play.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.pediatric-clinic.intermittent-groin-swelling",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "pediatric-gi-abdominal-wall"
      ],
      "inventoryRecordIds": [
        "inventory.8d54669d25a2afc2"
      ],
      "nodeIds": [
        "node.pediatric-clinic.intermittent-groin-swelling.1"
      ],
      "variantIds": [
        "question.pediatric-clinic.intermittent-groin-swelling.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    }
  ],
  "nodeAssignments": [
    {
      "nodeId": "node.n4.intermittent-groin-contents-versus-fluid-scan.v1",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n4r2.pediatric-groin-contents-and-reducibility"
      ],
      "inventoryRecordIds": [
        "inventory.0c5779b81101107a"
      ]
    },
    {
      "nodeId": "node.pediatric-clinic.groin-bulge-after-play.1",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.pediatric-clinic.inguinal-hernia-referral"
      ],
      "inventoryRecordIds": [
        "inventory.ba2242ed0fad69df"
      ]
    },
    {
      "nodeId": "node.pediatric-clinic.intermittent-groin-swelling.1",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.pediatric-clinic.inguinal-hernia-referral"
      ],
      "inventoryRecordIds": [
        "inventory.8d54669d25a2afc2"
      ]
    }
  ],
  "variantAssignments": [
    {
      "variantId": "question.n4.intermittent-groin-contents-versus-fluid-scan.v1",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n4r2.pediatric-groin-contents-and-reducibility"
      ],
      "inventoryRecordIds": [
        "inventory.0c5779b81101107a"
      ]
    },
    {
      "variantId": "question.pediatric-clinic.groin-bulge-after-play.v1",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.pediatric-clinic.inguinal-hernia-referral"
      ],
      "inventoryRecordIds": [
        "inventory.ba2242ed0fad69df"
      ]
    },
    {
      "variantId": "question.pediatric-clinic.intermittent-groin-swelling.v2",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.pediatric-clinic.inguinal-hernia-referral"
      ],
      "inventoryRecordIds": [
        "inventory.8d54669d25a2afc2"
      ]
    }
  ],
  "inventory": [
    {
      "recordId": "inventory.ba2242ed0fad69df",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [
        "hernia-groin"
      ],
      "secondaryTags": [
        "pediatric case context"
      ],
      "conceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
      "caseId": "case.pediatric-clinic.groin-bulge-after-play",
      "nodeIds": [
        "node.pediatric-clinic.groin-bulge-after-play.1"
      ],
      "variantIds": [
        "question.pediatric-clinic.groin-bulge-after-play.v1"
      ],
      "chiefComplaint": "Groin bulge",
      "taskTextShort": "Which outpatient plan is most appropriate for Noah Bennett's clinically suspected inguinal hernia?",
      "taskText": "Which outpatient plan is most appropriate for Noah Bennett's clinically suspected inguinal hernia?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
        "line": 82,
        "export": "HERNIA_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
          "line": 82,
          "export": "HERNIA_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts",
          "line": 20,
          "export": "PEDIATRIC_CLINIC_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
          "line": 82,
          "export": "HERNIA_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts",
          "line": 21,
          "export": "PEDIATRIC_CLINIC_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.pediatric-clinic.dynamic-groin-bulge",
        "claim.pediatric-clinic.clinical-groin-hernia-referral"
      ],
      "casePrimaryTopicSlug": "pediatric-gi-abdominal-wall",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.pediatric-clinic.groin-bulge-after-play.1",
          "primaryTopicSlug": "pediatric-gi-abdominal-wall"
        }
      ]
    },
    {
      "recordId": "inventory.8d54669d25a2afc2",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [
        "hernia-groin"
      ],
      "secondaryTags": [
        "pediatric case context"
      ],
      "conceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
      "caseId": "case.pediatric-clinic.intermittent-groin-swelling",
      "nodeIds": [
        "node.pediatric-clinic.intermittent-groin-swelling.1"
      ],
      "variantIds": [
        "question.pediatric-clinic.intermittent-groin-swelling.v2"
      ],
      "chiefComplaint": "Intermittent groin swelling",
      "taskTextShort": "What is the best outpatient disposition for Sofia Reed's clinically apparent inguinal hernia?",
      "taskText": "What is the best outpatient disposition for Sofia Reed's clinically apparent inguinal hernia?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
        "line": 82,
        "export": "HERNIA_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
          "line": 82,
          "export": "HERNIA_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts",
          "line": 20,
          "export": "PEDIATRIC_CLINIC_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
          "line": 82,
          "export": "HERNIA_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts",
          "line": 21,
          "export": "PEDIATRIC_CLINIC_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.pediatric-clinic.dynamic-groin-bulge",
        "claim.pediatric-clinic.clinical-groin-hernia-referral"
      ],
      "casePrimaryTopicSlug": "pediatric-gi-abdominal-wall",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.pediatric-clinic.intermittent-groin-swelling.1",
          "primaryTopicSlug": "pediatric-gi-abdominal-wall"
        }
      ]
    },
    {
      "recordId": "inventory.0c5779b81101107a",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n4r2.pediatric-groin-contents-and-reducibility",
      "caseId": "case.n4.intermittent-groin-contents-versus-fluid-scan.v1",
      "nodeIds": [
        "node.n4.intermittent-groin-contents-versus-fluid-scan.v1"
      ],
      "variantIds": [
        "question.n4.intermittent-groin-contents-versus-fluid-scan.v1"
      ],
      "chiefComplaint": "Intermittent groin swelling",
      "taskTextShort": "Which plan should be selected for {patientName}’s groin swelling?",
      "taskText": "Which plan should be selected for {patientName}’s groin swelling?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
        "line": 33,
        "export": "QUESTION_NEW_N4_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
          "line": 33,
          "export": "QUESTION_NEW_N4_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-n4-accepted-20261110.ts",
          "line": 173,
          "export": "QUESTION_NEW_N4_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
          "line": 32,
          "export": "QUESTION_NEW_N4_ROUND2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-n4-accepted-20261110.ts",
          "line": 171,
          "export": "QUESTION_N4_ACCEPTED_SOURCE_VIEWS",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n4r2.child-groin-dynamic-contents",
        "claim.n4r2.child-hernia-repair",
        "claim.n4r2.child-hernia-urgent-boundary"
      ],
      "casePrimaryTopicSlug": "pediatric-gi-abdominal-wall",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n4.intermittent-groin-contents-versus-fluid-scan.v1",
          "primaryTopicSlug": "pediatric-gi-abdominal-wall"
        }
      ]
    }
  ],
  "identityReuseNotes": [],
  "recordedHolds": [],
  "unkeyedDraftSlots": [
    {
      "recordId": "n4-slot-P06",
      "sourceSlotId": "P06",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "conceptId": null,
      "caseId": null,
      "nodeIds": [],
      "variantIds": [],
      "chiefComplaint": null,
      "taskTextShort": "The newer 2025 WSES edition was published in 2026. Its exact pediatric appendicolith/NOM boundary was not verified in accessible permitted full guidance. Do not silently substitute the 2020 rule or use paywalled snippets.",
      "status": "draft parked",
      "inventoryKind": "unkeyed planned slot",
      "reason": "The newer 2025 WSES edition was published in 2026. Its exact pediatric appendicolith/NOM boundary was not verified in accessible permitted full guidance. Do not silently substitute the 2020 rule or use paywalled snippets.",
      "ownerQuestion": null,
      "fileLocation": {
        "file": "docs/research/question-new-n4-round2-20261110.json"
      },
      "priorPlanningLocation": {
        "file": "docs/research/question-new-n4-20261110.json"
      }
    }
  ],
  "withheldTeachingPoints": [
    {
      "recordId": "conflict.pediatric-clinic.umbilical-repair-age",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "conceptId": null,
      "caseId": null,
      "nodeIds": [],
      "variantIds": [],
      "chiefComplaint": null,
      "taskTextShort": "A fixed childhood umbilical-hernia repair age or mandatory age-based referral rule",
      "status": "draft parked",
      "inventoryKind": "withheld teaching point",
      "reason": "No question authored. Preserve the different source positions for named clinician review; do not average ages or imply the oldest source controls.",
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/evidence-claims.ts",
        "export": "WITHHELD_DISAGREEMENTS"
      },
      "claimId": "claim.pediatric-clinic.umbilical-repair-age-disagreement",
      "sourceIds": [],
      "clinicalReviewStatus": "needs_clinician_review"
    },
    {
      "recordId": "withheld.pediatric-clinic.umbilical-timing",
      "primaryTopicSlug": "pediatric-gi-abdominal-wall",
      "secondaryTopicSlugs": [],
      "conceptId": null,
      "caseId": null,
      "nodeIds": [],
      "variantIds": [],
      "chiefComplaint": null,
      "taskTextShort": "Umbilical repair age",
      "status": "draft parked",
      "inventoryKind": "withheld teaching point",
      "reason": "Eligible source disagreement is preserved in conflict.pediatric-clinic.umbilical-repair-age; the planned timing/referral concept was dropped.",
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/evidence-claims.ts",
        "export": "WITHHELD_TOPICS"
      },
      "claimId": null,
      "sourceIds": [],
      "clinicalReviewStatus": "needs_clinician_review"
    }
  ],
  "frozenReferences": [],
  "frozenReferenceDisposition": "No assigned independent PASS or clinical approval. Exact N4 review2 says REVISE. Four frozen N4 PASS slugs are different items; all remain untouched.",
  "managerHandoff": "docs/handoffs/CURRENT_THREAD_HANDOFF.md",
  "managerProgram": "docs/research/question-topic-program-20261111.md",
  "baseline": {
    "programId": "question-topic-program.2026-11-11.v1",
    "snapshotCapturedAt": "2026-11-11T15:28:05.732Z",
    "generatedAt": "2026-11-11T15:41:40.423Z",
    "programSha256": "a1c585199633d243bc8d7e2f166916e74253b6c4a1b1eeceb09efba871baf9e4",
    "release": {
      "id": "clinical.synthetic.prototype.v1",
      "manifestId": "question-ship.2026-11-10.v9",
      "manifestFile": "packages/clinical-content/src/question-ship-manifest.ts",
      "assemblyFile": "packages/clinical-content/src/synthetic-content.ts",
      "assemblyExport": "SYNTHETIC_CLINICAL_RELEASE",
      "catalogRegistryMeaning": "610 registered concept identities include 156 with no live node. Active coverage uses the 454 primaryConceptId identities actually scored in default-release nodes."
    },
    "ownerDispatchCensus": {
      "manifestRows": 145,
      "cases": 1151,
      "nodes": 1462,
      "registeredConcepts": 610
    },
    "relevantFiles": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/batch-helpers.ts",
        "sha256": "2d42183c4de8342ba989bf06cff5fa1222163f2ffb101d52c29f0d5af7835569",
        "currentSha256": "2d42183c4de8342ba989bf06cff5fa1222163f2ffb101d52c29f0d5af7835569"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/evidence-claims.ts",
        "sha256": "e48f6a379f06faf2f7d1af63eb735646aa0d927cbfc9cca53ab2024c0fa7f5d4",
        "currentSha256": "e48f6a379f06faf2f7d1af63eb735646aa0d927cbfc9cca53ab2024c0fa7f5d4"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
        "sha256": "eeb969e78880a28535c81e918220fa1b97d9aea8941f76d73882ff59dd256eda",
        "currentSha256": "eeb969e78880a28535c81e918220fa1b97d9aea8941f76d73882ff59dd256eda"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts",
        "sha256": "df8cf958b36ec6f6608b114c3369b27df92e5d8f24e320a49f49d2f4ec795410",
        "currentSha256": "df8cf958b36ec6f6608b114c3369b27df92e5d8f24e320a49f49d2f4ec795410"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/source-catalog.ts",
        "sha256": "4310c183eeb67b802356ea786f9243b4133c7c2ef7b63f955de0517ab68058ca",
        "currentSha256": "4310c183eeb67b802356ea786f9243b4133c7c2ef7b63f955de0517ab68058ca"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
        "sha256": "e05be2a3198450eddbce2645647f22f61cf63bf86155af2e9d540403c60ba47e",
        "currentSha256": "e05be2a3198450eddbce2645647f22f61cf63bf86155af2e9d540403c60ba47e"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-additional.ts",
        "sha256": "7862226fe3da4b64e42f7e04a6344db55c964dfdd22538e9adbff31d47c7be4a",
        "currentSha256": "7862226fe3da4b64e42f7e04a6344db55c964dfdd22538e9adbff31d47c7be4a"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-dispositions.ts",
        "sha256": "9ee3bb1895812bca7aa24e7574fbe154c05680679c9ab9cb8e416b6f632d9dbd",
        "currentSha256": "9ee3bb1895812bca7aa24e7574fbe154c05680679c9ab9cb8e416b6f632d9dbd"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-evidence.ts",
        "sha256": "d19c66a6faa471f5bc08d9dfb5e3ebc25d344bb24c025a42314448fac5f3a3ca",
        "currentSha256": "d19c66a6faa471f5bc08d9dfb5e3ebc25d344bb24c025a42314448fac5f3a3ca"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-materialize.ts",
        "sha256": "69eb962066927ceb0d51dca85f836576712c4481f216cf50302c6f9afa33df64",
        "currentSha256": "69eb962066927ceb0d51dca85f836576712c4481f216cf50302c6f9afa33df64"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-reference-bindings.ts",
        "sha256": "800b329cb9d1c1c155009dfece9261cb96de71471bb389320dc628ac9e3c6811",
        "currentSha256": "800b329cb9d1c1c155009dfece9261cb96de71471bb389320dc628ac9e3c6811"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-revisions.ts",
        "sha256": "809f8d2033d2f79a4b5e9fd43250d091f5fbdde8d7feb4f03cd5850e14e77454",
        "currentSha256": "809f8d2033d2f79a4b5e9fd43250d091f5fbdde8d7feb4f03cd5850e14e77454"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-types.ts",
        "sha256": "6a0276a21f2bad7479f2e2e3ececc1b62ae726373ff5c3fd8634c1e2085fa495",
        "currentSha256": "6a0276a21f2bad7479f2e2e3ececc1b62ae726373ff5c3fd8634c1e2085fa495"
      },
      {
        "file": "packages/clinical-content/src/question-ship-manifest.ts",
        "sha256": "cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a",
        "currentSha256": "b470422f55280d0a7b0fe318f0254b83be6864f57f4faa7609f32fbc2103475a"
      },
      {
        "file": "packages/clinical-content/src/synthetic-content.ts",
        "sha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
        "currentSha256": "9c51a1e0d1fdfb4c0d28b70cb9de3695dacf0eeb87ea0b7485b6e5f154d6e56b"
      },
      {
        "file": "docs/research/question-new-n4-round2-20261110.json",
        "sha256": "791db7f442111edab01cca5c9e05ba601daef8e3766f5602c89a7a64b5774e57",
        "currentSha256": "791db7f442111edab01cca5c9e05ba601daef8e3766f5602c89a7a64b5774e57"
      }
    ]
  },
  "secondaryNotes": "The two live groin variants carry hernia-groin as secondary. Age-neutral midline-hernia recognition belongs to its existing organ-topic owner, even when a child is shown. No assigned cross-topic scored sequence or identity reuse is present.",
  "activeMilestone": "Wave 8 topic research, complete audit, supported gap drafts, focused validation and bounded handoff. Manager owns independent review, acceptance and integration.",
  "ownerDirectionVerbatim": "I feel like they are still a little confusing and we may be missing some of the concepts that are most tested and testable. ... look up everything they can about that topic and decide what concepts on that are the most testable. Then look at all the questions that fit in that topic category and critically analyze if it is a good question based on the rules and feedback you have gotten from me on what is a good and what is a bad question. Then the worker also looks for gaps on that topic that it can fill in with more questions. Remember to try to create multiple part questions when possible. ... The goal of this is to increase the number of questions, fill gaps, test the testable stuff, and to make the current existing questions better and more accurate. Also remember that the questions need to be difficult.",
  "ownerSettingDirection": "The game is an outpatient clinic/ambulatory surgery center with no ICU, ED or trauma bay. Hospital content is presented as outside-hospital chart review in clinic using existing settings."
}
```

## Salvage review follow-up (current)

**Four PASS contexts preserved exactly; intussusception revised only for chronology; gastroschisis parked.** This is the current handoff. All earlier assignment/source/review material below remains historical provenance.

The sole re-review candidate is case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2 / node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2 / question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2. Status remains **salvage**, pending independent re-review and named clinical approval. The scored concept stays concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.

### Review receipt and untouched PASS contexts

```json
{
  "reviewFile": "docs/research/question-topic-pediatric-gi-abdominal-wall-review-salvage-20261111.json",
  "reviewFileSha256": "809e8362400762de8e6d03c294b36d206198048d2a4afa293af9425429a5eddf",
  "counts": {
    "passPreserved": 4,
    "intussusceptionRevised": 1,
    "gastroschisisParked": 1,
    "currentSalvageCandidates": 5,
    "newMedicalClaims": 0
  },
  "protectedPassCases": [
    {
      "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
      "nodeId": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
      "caseSha256": "6ed04de62c0f5154efec5f64d0e6c8d5fb653a4aa04618b1cf08dd21f428f35f",
      "nodeSha256": "58bab61235bd6da190dec3e27925e86c787cf7a2e71bd8c3f14a7f1f18a5de18",
      "questionSha256": "f0a196c1be8166afcb583741decca5950ea206981d345ae744e6dea1e190e492",
      "fullProposalSha256": "314a19471fec1e7acab093aade804baa0e088a02602d8e4ba7eea95b4c4c854c"
    },
    {
      "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
      "nodeId": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
      "caseSha256": "33a8b304173a07ac40d9de34431a369ce69849319b5ac97d7659618e2970b88c",
      "nodeSha256": "b213ae8af6bcf5ff5e18361e51f8166981a0a1727dc6e5aa9c03c8250d259085",
      "questionSha256": "591060294b042395e1b3d1e4ba58c173fcad4fd31a0164bb00ec9cec7895860a",
      "fullProposalSha256": "ce133735cc38e7a02be00853a0a9fc903bf1bf5015cf4c242cb32175574103d4"
    },
    {
      "caseId": "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
      "nodeId": "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
      "caseSha256": "472b44951a7be43233384f5fd1cfa061d9b695cd769f827ae22a36b0819b800e",
      "nodeSha256": "259b87413e186edd3468fa1c490cde8296b1b887e52644aeae8bd62c40a90527",
      "questionSha256": "0f70110765b732d0def1de259d034e4640f55116ab0988e8abc2898e2afa7fe0",
      "fullProposalSha256": "6acfb71d5fe40e328991be1fb80ccd1366bcc2539d821d5d27f7091a087a635b"
    },
    {
      "caseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
      "nodeId": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
      "caseSha256": "d1c0148f6a06a3245b72ca6ee7835bc132f0c31be0e4de7f59396d49ebc02e6f",
      "nodeSha256": "e1cd051092d60bdb3ad143b047ff0bfed398e0e6c091c3b86595dd30641bc796",
      "questionSha256": "80bee6ef43cb7be685280ddc9199a76eca8d3c3284f3c85a5c07b6daf75f768e",
      "fullProposalSha256": "e7ea0b4d0d575ec461ab1c89a2a3f6176c4b4a5b6f2eded01abb50169d103405"
    }
  ]
}
```

Meconium, NEC, preterm hernia and Wilms were not edited. The focused test compares their complete current runtime cases and question objects, salvage proposals, node/case/concept definitions and timing records against the frozen pre-edit inputs. It also verifies child art and parent admission.

### Gastroschisis: parked, excluded from re-review

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance-salvage.v1",
  "nodeId": "node.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "status": "parked",
  "reReviewEligible": false,
  "reason": "Parked by explicit manager direction after salvage review rated this version easy and not two-step. The physiological safety finding and frozen item are preserved; no further repair or re-review is requested."
}
```

The unchanged frozen gastroschisis material remains in the archive. It is absent from all active case/node/question/concept arrays and from the salvage review queue. No further repair was attempted after the manager dropped the easy version.

### Intussusception: chronology-only salvage v2

The reviewer accepted moderate, genuinely two-step reasoning. This repair does not add a clinical hint or a new finding: partial anatomical progress, residual disease, trapped fluid, current perfusion and the abdominal examination still determine the repeat-versus-operation comparison.

The current clinic attendee and the earlier admission are explicit. The original v1 question/node/case remain in salvageReviewFollowup.intussusceptionBefore and earlier frozen records. New v2 identities avoid silently changing a reviewed version; the clinical concept and its history stay attached to the same meaning.

Concrete response to each clarity issue and suggestion:
```json
{
  "clarityIssues": [
    {
      "index": 0,
      "response": "Current clinic attendance by Sofia with a parent is explicit. The presentation places the scored care in her earlier admission at age 8, and the update is labelled the contemporaneous hospital note."
    },
    {
      "index": 1,
      "response": "Corrected the article to an 8-year-old girl and explicitly states that Sofia attends with a parent."
    }
  ],
  "suggestions": [
    {
      "index": 0,
      "response": "Applied explicit child-attendance, recorded-admission-at-age-8 and past-tense hospital-note framing."
    },
    {
      "index": 1,
      "response": "The new task asks which next plan was most appropriate after the first reduction attempt in the recorded admission. All clinical choices, findings and feedback are unchanged."
    },
    {
      "index": 2,
      "response": "Added an exact Melissa review question for the older-child imaging/history and repeat-versus-operation ranking. No new lead-point, recurrence or negative imaging finding was invented."
    }
  ],
  "difficulty": "Retained the reviewer-accepted moderate two-step clinical comparison. Removing raw progress/safety observations would change the ranking; this repair adds no clinical shortcut."
}
```

Exact revised runtime case:
```json
{
  "id": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
  "pediatricProfile": {
    "version": "pediatric-patient-profile.v1",
    "requiresParent": true,
    "clinicalScope": "outpatient"
  },
  "displayName": "Hospital course review",
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
  "patientDisplayName": "Sofia Reed",
  "prototypeDemographics": {
    "ageYears": 8,
    "sexLabel": "Female"
  },
  "chiefComplaint": "Hospital course review",
  "presentation": "In clinic, {patientName}, an 8-year-old girl, attends with a parent. The founder reviews outside hospital records from her earlier admission at age 8; all questions concern that recorded admission.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2",
      "pediatricProfile": {
        "version": "pediatric-patient-profile.v1",
        "requiresParent": true,
        "clinicalScope": "outpatient"
      },
      "prototypeDemographics": {
        "ageYears": 8,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Hospital course review",
      "presentation": "In clinic, {patientName}, an 8-year-old girl, attends with a parent. The founder reviews outside hospital records from her earlier admission at age 8; all questions concern that recorded admission."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 4,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [
    "capability.pediatric_examination"
  ],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
    "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
  ],
  "decisionNodes": [
    {
      "id": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
      "primaryConceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
      "currentUpdate": "Recorded hospital note from {patientName}'s admission at age 8: she had received IV fluids and remained under pediatric surgical observation for ileocolic intussusception.",
      "stem": "Which next plan was most appropriate for {patientName} after the first reduction attempt in the recorded admission?",
      "answerChoices": [
        {
          "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
          "label": "Attempt a delayed repeat image-guided enema",
          "isCorrect": true,
          "rationale": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
          "label": "Proceed to operative reduction now",
          "isCorrect": false,
          "rationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
          "label": "Observe for spontaneous completion of reduction",
          "isCorrect": false,
          "rationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed outside-record observations; fictional patient",
        "items": [
          {
            "label": "Initial study",
            "value": "Ultrasound confirmed ileocolic intussusception with a small amount of fluid between the bowel layers."
          },
          {
            "label": "Reduction record",
            "value": "The enema advanced the leading edge from the transverse colon toward the cecum, but residual intussusception remains. No perforation occurred."
          },
          {
            "label": "Reassessment",
            "value": "She is well perfused and comfortable between cramps. The abdomen is soft without guarding."
          }
        ]
      },
      "sourceLabels": [
        "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
        "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
            "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
          ]
        },
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
            "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
          ]
        }
      ]
    }
  ],
  "learningSummary": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction."
}
```

**key shown first for review only.** Runtime answers shuffle. Exact revised question:
```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "stem": "Which next plan was most appropriate for {patientName} after the first reduction attempt in the recorded admission?",
  "exhibit": {
    "kind": "keyValue",
    "caption": "Constructed outside-record observations; fictional patient",
    "items": [
      {
        "label": "Initial study",
        "value": "Ultrasound confirmed ileocolic intussusception with a small amount of fluid between the bowel layers."
      },
      {
        "label": "Reduction record",
        "value": "The enema advanced the leading edge from the transverse colon toward the cecum, but residual intussusception remains. No perforation occurred."
      },
      {
        "label": "Reassessment",
        "value": "She is well perfused and comfortable between cramps. The abdomen is soft without guarding."
      }
    ]
  },
  "answerChoices": [
    {
      "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
      "label": "Attempt a delayed repeat image-guided enema",
      "isCorrect": true,
      "rationale": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
      "distractorRationale": null
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
      "label": "Proceed to operative reduction now",
      "isCorrect": false,
      "rationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
      "distractorRationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable."
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
      "label": "Observe for spontaneous completion of reduction",
      "isCorrect": false,
      "rationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
      "distractorRationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern."
    }
  ],
  "explanation": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
  "supportingEvidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.intussusception-risk",
    "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
    "claim.pediatric-gi-abdominal-wall.intussusception-operation",
    "claim.pediatric-gi-abdominal-wall.intussusception-transient"
  ]
}
```

Clinical fields unchanged from the reviewed salvage version:
```json
{
  "unchangedExhibit": {
    "kind": "keyValue",
    "caption": "Constructed outside-record observations; fictional patient",
    "items": [
      {
        "label": "Initial study",
        "value": "Ultrasound confirmed ileocolic intussusception with a small amount of fluid between the bowel layers."
      },
      {
        "label": "Reduction record",
        "value": "The enema advanced the leading edge from the transverse colon toward the cecum, but residual intussusception remains. No perforation occurred."
      },
      {
        "label": "Reassessment",
        "value": "She is well perfused and comfortable between cramps. The abdomen is soft without guarding."
      }
    ]
  },
  "unchangedChoices": [
    {
      "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
      "label": "Attempt a delayed repeat image-guided enema",
      "isCorrect": true,
      "rationale": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
      "serviceRequest": null
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
      "label": "Proceed to operative reduction now",
      "isCorrect": false,
      "rationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
      "serviceRequest": null
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
      "label": "Observe for spontaneous completion of reduction",
      "isCorrect": false,
      "rationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
      "serviceRequest": null
    }
  ],
  "unchangedExplanation": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
  "reasoning": {
    "interpretation": "Interpret partial anatomical progress and trapped fluid separately: residual disease remains, but a risk predictor does not itself prohibit another enema.",
    "decision": "Combine progress with the current stable examination to choose a delayed repeat attempt instead of mandatory surgery or passive observation.",
    "closestCredibleError": "Operate immediately because trapped fluid and incomplete reduction are overread as absolute failure.",
    "decidingObservation": "The leading edge moved substantially and she remains well perfused without guarding.",
    "consequenceOfError": "The repeat attempt is reasonable, not compulsory. A clinician must confirm the local radiology/surgery decision and quality of the closest operative alternative.",
    "deletionTest": "Deleting progress removes the main reason to prefer a repeat attempt; deleting the reassessment leaves the safety of another enema unresolved.",
    "counterfactual": "If the leading edge had not moved and she developed guarding or poor perfusion, operative reduction becomes the best offered plan.",
    "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate"
  },
  "clinicalProfile": {
    "version": "pediatric-patient-profile.v1",
    "requiresParent": true,
    "clinicalScope": "outpatient"
  },
  "demographics": {
    "ageYears": 8,
    "sexLabel": "Female"
  }
}
```

Manual author check:
```json
{
  "status": "salvage",
  "scoredFieldCheck": "Only task/current-update tense and record-time framing changed, with separately versioned identities. All findings, clinical choices/IDs/key, feedback and evidence remain exact.",
  "contextCheck": "Sofia explicitly attends clinic with a parent, an 8-year-old girl. The outside admission at age 8 and contemporaneous hospital note define the scored timepoint. Child demographics and pediatric profile are unchanged.",
  "compositionCheck": "One scored node; no leadpoint-failure companion, later episode or prior explanation.",
  "runtimeCheck": "The existing child profile, clinic capability and no_test registry contract are preserved; focused admission check will be rerun.",
  "approvalCheck": "Revised salvage v2 awaits independent re-review. No prior PASS is inherited; Melissa must confirm the exact older-child repeat-versus-operation comparison."
}
```

### Owner approvals needed

For this exact older-child record and imaging, does the observed progress/stability support the repeat-versus-operation ranking? No lead-point or recurrence finding has been invented; add one only if genuinely needed and supported. All four PASS contexts and all medical source/claim records remain untouched. No lead-point, recurrence observation or negative study was added to force the key.

### Exact validation

Working directory: packages/clinical-content. Command: `npm.cmd test -- --pool=threads src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts`. Exit 0.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  21 passed (21)
   Start at  23:38:57
   Duration  6.05s (transform 4.07s, setup 0ms, import 5.76s, tests 218ms, environment 0ms)
```

The first run exposed a test-only in-place sort in an older assertion; it now sorts a copy. The final focused run passes all 21 tests. Earlier package typecheck output below is historical and was not rerun in this focused-test-only follow-up.

### Current bounded handoff

```text
Topic pediatric-gi-abdominal-wall; intussusception salvage review follow-up
Files changed only the five owned topic files: module, focused test, research Markdown, packet JSON and source ledger.
Counts preserved PASS 4, revised salvage 1, parked/dropped salvage 1, new clinical meanings 0, new medical claims 0.
Only re-review case case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v2
Only re-review node node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2
Only re-review question question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v2
Concept retained concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1
Intussusception repair Sofia explicitly attends clinic with a parent, an 8-year-old girl. The earlier admission at age 8 is explicit, the update is a recorded contemporaneous hospital note, and the task asks which plan was most appropriate then. The child profile, all clinical findings, alternatives/IDs/key, rationales, explanation and decision-changing counterfactual remain unchanged.
PASS untouched node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2; node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1; node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1; node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2
Parked node.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1; Parked by explicit manager direction after salvage review rated this version easy and not two-step. The physiological safety finding and frozen item are preserved; no further repair or re-review is requested. Re-review eligibility false; no active executable or review export.
Owner approvals needed Melissa confirms the older-child record/imaging and exact delayed-repeat-versus-operation comparison. No lead-point or recurrence observation/negative was invented. All versions remain needs_clinician_review; no prior PASS is inherited by revised intussusception v2.
Validation from packages/clinical-content: npm.cmd test -- --pool=threads src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts => exit 0; Test Files 1 passed (1); Tests 21 passed (21). Exact output recorded. Typecheck was not rerun for this focused-test-only follow-up; earlier results remain historical.
Open work Manager reviews only the revised intussusception v2 salvage context. No shared file, manifest, runtime or registry was changed; no commit/push/deploy/install/agents.
```

## Archived acceptance batch 4 salvage (historical)

The following six-case packet is preserved as prior provenance. Its old review counts, intussusception v1 wording and gastroschisis candidate are superseded by the current disposition above.



**Status: salvage — six exact PASS nodes; zero scored wording changes.** This section is the current handoff. The preceding assignment remains unchanged. The earlier audit/revision packet below is archived history; its old presentation ages and review counts are not the current salvage contexts.

Manager reference: docs/research/question-topic-acceptance-batch4-20261111.md. Applicable PASS records and hashes are pinned in the JSON packet salvage.reviewInputs and salvageProposals. The current module explicitly exports PEDIATRIC_GI_TOPIC_SALVAGE_CASES / SALVAGE_NODES / SALVAGE_QUESTIONS / SALVAGE_TIMING_ENTRIES; use these six contexts rather than nested historical reviewInput cases.

### Current identities

Case ID | Node ID | Question variant | Clinic child | Outside record age
--- | --- | --- | --- | ---
case.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance-salvage.v1 | node.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1 | question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1 | 5 years / Male | 1-day-old
case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v1 | node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1 | question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1 | 8 years / Female | 8-year-old
case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1 | node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2 | question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2 | 6 years / Female | 2-day-old
case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1 | node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 | question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 | 5 years / Male | 3-week-old
case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1 | node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1 | question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1 | 5 years / Male | 12-week-old
case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1 | node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2 | question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2 | 5 years / Male | 5-year-old

### Existing pediatric contract and minimal context changes

The existing admitted clinic cases put pediatricProfile on both the case and its one approvedInstantiationProfile. The marker is {"version":"pediatric-patient-profile.v1","requiresParent":true,"clinicalScope":"outpatient"}. Both levels carry explicit matching age and sex. Schema and child-art selection require age 5-17; authored art bands, not disease weights, determine compatible stills. The four infant records therefore use a later school-age clinic attendee while keeping the original infant age explicit in the outside record. No infant is relabelled as school-age during the scored clinical event.

Only six minimal clinic presentation wrappers and their runtime metadata changed. All questions still refer to the original outside care; the four neonatal wrappers explicitly say so. The generic accompanying parent matches the existing runtime family path and avoids inventing named parent identities or requiring a shared registry change. Required clinical setting remains clinic; the pediatric examination capability and stage 4 apply.

The three original outside-record timing/order alternatives remain archived separately. They are not clinic orders: the salvage timing entries are no_test, with no service requests or result gates. This satisfies the existing pediatric semantic gate without enacting neonatal/inpatient care or a pediatric procedure in clinic.

```json
{
  "runtimeReferences": [
    "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/batch-helpers.ts",
    "packages/clinical-content/src/schema.ts",
    "packages/game-domain/src/pediatric-eligibility.ts",
    "packages/game-domain/src/characterStillCatalog.ts",
    "packages/game-domain/src/clinical-case-eligibility.ts",
    "packages/game-domain/src/pediatric-family.ts"
  ],
  "runtimeDecision": "The existing profile/child-art contract covers age 5-17. A school-age child attends clinic with a parent while the founder reviews the explicitly dated infant record. The infant age is retained separately and never substituted into the scored record. Existing inpatient care remains outside-hospital chart review. Generic pediatric-family creation supplies the accompanying parent; no named-family registry or new runtime setting is required.",
  "timingDecision": "These are scored reviews of recorded outside-hospital decisions, not clinic diagnostic requests. Runtime entries are no_test; prior outside-record placeholder timing/order information is retained separately for provenance, with no service request or result gate introduced.",
  "counts": {
    "requested": 6,
    "salvage": 6,
    "newNodes": 0,
    "newQuestions": 0,
    "newConcepts": 0,
    "newMedicalClaims": 0,
    "standaloneCases": 6,
    "excludedNonPassCompanions": 2
  },
  "acceptanceSnapshot": {
    "manifestId": "question-ship.2026-11-11.v13",
    "authorityRows": 664,
    "cases": 1330,
    "nodes": 1530,
    "registeredConcepts": 1019,
    "scoredConcepts": 824,
    "source": "docs/research/question-topic-acceptance-batch4-20261111.md",
    "note": "Receipt snapshot, not a claim that this salvage is already in the default release."
  }
}
```

### Exact salvage cases and PASS preservation

**key shown first for review only.** Runtime answers shuffle. Full before/after objects, applicable PASS review records, excluded companions, case/profile metadata and exact hashes are in salvageProposals. These are presentation salvages; none confers clinical approval.

#### node.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1

Status: **salvage**. Case case.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance-salvage.v1. Exact prior PASS source docs/research/question-topic-pediatric-gi-abdominal-wall-review2-20261111.json.

```json
{
  "sourceCaseId": "case.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1",
  "sourceReviewedCaseId": "case.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1",
  "caseId": "case.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance-salvage.v1",
  "nodeId": "node.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "excludedCompanionNodeIds": [],
  "clinicDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "recordDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "recordAgeText": "1-day-old",
  "profileId": "profile.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance-salvage.v1"
}
```

Current complete runtime case:
```json
{
  "id": "case.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance-salvage.v1",
  "pediatricProfile": {
    "version": "pediatric-patient-profile.v1",
    "requiresParent": true,
    "clinicalScope": "outpatient"
  },
  "displayName": "Birth record review",
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance-salvage.v1",
  "patientDisplayName": "Oliver Hayes",
  "prototypeDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "chiefComplaint": "Birth record review",
  "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 1-day-old infant; all questions concern that recorded neonatal care.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance-salvage.v1",
      "pediatricProfile": {
        "version": "pediatric-patient-profile.v1",
        "requiresParent": true,
        "clinicalScope": "outpatient"
      },
      "prototypeDemographics": {
        "ageYears": 5,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Birth record review",
      "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 1-day-old infant; all questions concern that recorded neonatal care."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 4,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [
    "capability.pediatric_examination"
  ],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "source.pediatric-gi-abdominal-wall.ernica-gastroschisis-2024",
    "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020"
  ],
  "decisionNodes": [
    {
      "id": "node.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
      "primaryConceptId": "concept.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
      "currentUpdate": "{patientName}'s birth record describes uncovered bowel beside a separately inserted umbilical cord. The founder reviews the outside operative note in clinic.",
      "stem": "Which abdominal-wall plan best fits {patientName}'s recorded response to reduction?",
      "answerChoices": [
        {
          "id": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.silo",
          "label": "Staged reduction with a silo",
          "isCorrect": true,
          "rationale": "The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutured",
          "label": "Primary sutured fascial closure",
          "isCorrect": false,
          "rationale": "Completing the same full reduction under tension would recreate the observed compromise. Bowel viability before reduction does not establish that the abdomen can safely contain it now.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutureless",
          "label": "Primary sutureless cord closure",
          "isCorrect": false,
          "rationale": "Avoiding sutures does not remove the pressure effect of returning all bowel to an inadequate abdominal domain. Primary sutureless closure still requires safe reduction.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed outside-record observations; fictional patient",
        "items": [
          {
            "label": "Before reduction",
            "value": "Bowel is perfused and intact. Ventilation and lower-limb perfusion are satisfactory."
          },
          {
            "label": "Trial reduction",
            "value": "As all bowel is returned to the abdomen, ventilatory pressure rises and lower-limb perfusion diminishes. Both improve when the bowel is released from the attempted reduction."
          }
        ]
      },
      "sourceLabels": [
        "source.pediatric-gi-abdominal-wall.ernica-gastroschisis-2024",
        "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutured",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Completing the same full reduction under tension would recreate the observed compromise. Bowel viability before reduction does not establish that the abdomen can safely contain it now.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.ernica-gastroschisis-2024",
            "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020"
          ]
        },
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutureless",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Avoiding sutures does not remove the pressure effect of returning all bowel to an inadequate abdominal domain. Primary sutureless closure still requires safe reduction.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.ernica-gastroschisis-2024",
            "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020"
          ]
        }
      ]
    }
  ],
  "learningSummary": "The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity."
}
```

Exact unchanged question:
```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "stem": "Which abdominal-wall plan best fits {patientName}'s recorded response to reduction?",
  "exhibit": {
    "kind": "keyValue",
    "caption": "Constructed outside-record observations; fictional patient",
    "items": [
      {
        "label": "Before reduction",
        "value": "Bowel is perfused and intact. Ventilation and lower-limb perfusion are satisfactory."
      },
      {
        "label": "Trial reduction",
        "value": "As all bowel is returned to the abdomen, ventilatory pressure rises and lower-limb perfusion diminishes. Both improve when the bowel is released from the attempted reduction."
      }
    ]
  },
  "answerChoices": [
    {
      "id": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.silo",
      "label": "Staged reduction with a silo",
      "isCorrect": true,
      "rationale": "The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity.",
      "distractorRationale": null
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutured",
      "label": "Primary sutured fascial closure",
      "isCorrect": false,
      "rationale": "Completing the same full reduction under tension would recreate the observed compromise. Bowel viability before reduction does not establish that the abdomen can safely contain it now.",
      "distractorRationale": "Completing the same full reduction under tension would recreate the observed compromise. Bowel viability before reduction does not establish that the abdomen can safely contain it now."
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutureless",
      "label": "Primary sutureless cord closure",
      "isCorrect": false,
      "rationale": "Avoiding sutures does not remove the pressure effect of returning all bowel to an inadequate abdominal domain. Primary sutureless closure still requires safe reduction.",
      "distractorRationale": "Avoiding sutures does not remove the pressure effect of returning all bowel to an inadequate abdominal domain. Primary sutureless closure still requires safe reduction."
    }
  ],
  "explanation": "The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity.",
  "supportingEvidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage"
  ]
}
```

Preservation hashes:
```json
{
  "beforeNode": "46996c08d7201056ff40976bdfffb6de8c2f4543a3ad5d7ae524970801880d5e",
  "afterNode": "46996c08d7201056ff40976bdfffb6de8c2f4543a3ad5d7ae524970801880d5e",
  "beforeQuestion": "81e1276aeab2da156112c250f49673ff3311ce4141950295c220feb30a72557f",
  "afterQuestion": "81e1276aeab2da156112c250f49673ff3311ce4141950295c220feb30a72557f",
  "afterCase": "841e20f0fb0b2c28a06f001822fcaee98031ff309e1abb8bc9d09d501764d25b"
}
```

Salvage author check:
```json
{
  "status": "salvage",
  "scoredFieldCheck": "Complete original scored node and question objects match the frozen PASS input SHA-256; no wording, options, key, exhibits or feedback changed.",
  "contextCheck": "Only the explicit clinic child/parent wrapper changed. Current clinic age and historical record age are separate; the presentation directs neonatal questions to the recorded care, without adding an interpretation or answering the task.",
  "compositionCheck": "One scored node. No excluded/non-PASS companion is in the case or learning summary.",
  "runtimeCheck": "Focused native admission passed with the existing pediatric marker, compatible child still and parent companion. No test, procedure or hospital care is enacted in clinic.",
  "approvalCheck": "The question keeps its existing editorial PASS reference; the new presentation wrapper remains salvage/needs_clinician_review and is not automatically accepted."
}
```

#### node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1

Status: **salvage**. Case case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v1. Exact prior PASS source docs/research/question-topic-pediatric-gi-abdominal-wall-review2-20261111.json.

```json
{
  "sourceCaseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-standalone.v1",
  "sourceReviewedCaseId": "case.pediatric-gi-abdominal-wall.intussusception-course.v1",
  "caseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v1",
  "nodeId": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "excludedCompanionNodeIds": [
    "node.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1"
  ],
  "clinicDemographics": {
    "ageYears": 8,
    "sexLabel": "Female"
  },
  "recordDemographics": {
    "ageYears": 8,
    "sexLabel": "Female"
  },
  "recordAgeText": "8-year-old",
  "profileId": "profile.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v1"
}
```

Current complete runtime case:
```json
{
  "id": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v1",
  "pediatricProfile": {
    "version": "pediatric-patient-profile.v1",
    "requiresParent": true,
    "clinicalScope": "outpatient"
  },
  "displayName": "Hospital course review",
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v1",
  "patientDisplayName": "Sofia Reed",
  "prototypeDemographics": {
    "ageYears": 8,
    "sexLabel": "Female"
  },
  "chiefComplaint": "Hospital course review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 8-year-old girl, with a parent.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v1",
      "pediatricProfile": {
        "version": "pediatric-patient-profile.v1",
        "requiresParent": true,
        "clinicalScope": "outpatient"
      },
      "prototypeDemographics": {
        "ageYears": 8,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Hospital course review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 8-year-old girl, with a parent."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 4,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [
    "capability.pediatric_examination"
  ],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
    "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
  ],
  "decisionNodes": [
    {
      "id": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
      "primaryConceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
      "currentUpdate": "The founder reviews {patientName}'s outside admission for ileocolic intussusception. She has received IV fluids and is under pediatric surgical observation.",
      "stem": "Which next plan is most appropriate for {patientName} after the first reduction attempt?",
      "answerChoices": [
        {
          "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
          "label": "Attempt a delayed repeat image-guided enema",
          "isCorrect": true,
          "rationale": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
          "label": "Proceed to operative reduction now",
          "isCorrect": false,
          "rationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
          "label": "Observe for spontaneous completion of reduction",
          "isCorrect": false,
          "rationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed outside-record observations; fictional patient",
        "items": [
          {
            "label": "Initial study",
            "value": "Ultrasound confirmed ileocolic intussusception with a small amount of fluid between the bowel layers."
          },
          {
            "label": "Reduction record",
            "value": "The enema advanced the leading edge from the transverse colon toward the cecum, but residual intussusception remains. No perforation occurred."
          },
          {
            "label": "Reassessment",
            "value": "She is well perfused and comfortable between cramps. The abdomen is soft without guarding."
          }
        ]
      },
      "sourceLabels": [
        "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
        "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
            "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
          ]
        },
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
            "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
          ]
        }
      ]
    }
  ],
  "learningSummary": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction."
}
```

Exact unchanged question:
```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "stem": "Which next plan is most appropriate for {patientName} after the first reduction attempt?",
  "exhibit": {
    "kind": "keyValue",
    "caption": "Constructed outside-record observations; fictional patient",
    "items": [
      {
        "label": "Initial study",
        "value": "Ultrasound confirmed ileocolic intussusception with a small amount of fluid between the bowel layers."
      },
      {
        "label": "Reduction record",
        "value": "The enema advanced the leading edge from the transverse colon toward the cecum, but residual intussusception remains. No perforation occurred."
      },
      {
        "label": "Reassessment",
        "value": "She is well perfused and comfortable between cramps. The abdomen is soft without guarding."
      }
    ]
  },
  "answerChoices": [
    {
      "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
      "label": "Attempt a delayed repeat image-guided enema",
      "isCorrect": true,
      "rationale": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
      "distractorRationale": null
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
      "label": "Proceed to operative reduction now",
      "isCorrect": false,
      "rationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
      "distractorRationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable."
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
      "label": "Observe for spontaneous completion of reduction",
      "isCorrect": false,
      "rationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
      "distractorRationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern."
    }
  ],
  "explanation": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
  "supportingEvidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.intussusception-risk",
    "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
    "claim.pediatric-gi-abdominal-wall.intussusception-operation",
    "claim.pediatric-gi-abdominal-wall.intussusception-transient"
  ]
}
```

Preservation hashes:
```json
{
  "beforeNode": "16fd05ec4a715877dd2a31327e3172db6f0837f5896a963ccba825e9d1e883ca",
  "afterNode": "16fd05ec4a715877dd2a31327e3172db6f0837f5896a963ccba825e9d1e883ca",
  "beforeQuestion": "0e88e5dc1d6c129f560c8e888d14e22b83a5d347029dd6761342c2e6d58d81c2",
  "afterQuestion": "0e88e5dc1d6c129f560c8e888d14e22b83a5d347029dd6761342c2e6d58d81c2",
  "afterCase": "0936a2e605c05ed74219ca3e849752ddce5abf2934868d26c934ef76b205e626"
}
```

Salvage author check:
```json
{
  "status": "salvage",
  "scoredFieldCheck": "Complete original scored node and question objects match the frozen PASS input SHA-256; no wording, options, key, exhibits or feedback changed.",
  "contextCheck": "Only the explicit clinic child/parent wrapper changed. Current clinic age and historical record age are separate; the presentation directs neonatal questions to the recorded care, without adding an interpretation or answering the task.",
  "compositionCheck": "One scored node. No excluded/non-PASS companion is in the case or learning summary.",
  "runtimeCheck": "Focused native admission passed with the existing pediatric marker, compatible child still and parent companion. No test, procedure or hospital care is enacted in clinic.",
  "approvalCheck": "The question keeps its existing editorial PASS reference; the new presentation wrapper remains salvage/needs_clinician_review and is not automatically accepted."
}
```

#### node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2

Status: **salvage**. Case case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1. Exact prior PASS source docs/research/question-topic-pediatric-gi-abdominal-wall-review2-20261111.json.

```json
{
  "sourceCaseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-standalone.v2",
  "sourceReviewedCaseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-standalone.v2",
  "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
  "nodeId": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
  "excludedCompanionNodeIds": [],
  "clinicDemographics": {
    "ageYears": 6,
    "sexLabel": "Female"
  },
  "recordDemographics": {
    "ageYears": 0,
    "sexLabel": "Female"
  },
  "recordAgeText": "2-day-old",
  "profileId": "profile.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1"
}
```

Current complete runtime case:
```json
{
  "id": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
  "pediatricProfile": {
    "version": "pediatric-patient-profile.v1",
    "requiresParent": true,
    "clinicalScope": "outpatient"
  },
  "displayName": "Obstruction record review",
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
  "patientDisplayName": "Isla Reed",
  "prototypeDemographics": {
    "ageYears": 6,
    "sexLabel": "Female"
  },
  "chiefComplaint": "Obstruction record review",
  "presentation": "In clinic, {patientName}, a 6-year-old girl, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 2-day-old infant; all questions concern that recorded neonatal care.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1",
      "pediatricProfile": {
        "version": "pediatric-patient-profile.v1",
        "requiresParent": true,
        "clinicalScope": "outpatient"
      },
      "prototypeDemographics": {
        "ageYears": 6,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Obstruction record review",
      "presentation": "In clinic, {patientName}, a 6-year-old girl, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 2-day-old infant; all questions concern that recorded neonatal care."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 4,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [
    "capability.pediatric_examination"
  ],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
  ],
  "decisionNodes": [
    {
      "id": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
      "primaryConceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
      "currentUpdate": "{patientName}'s outside neonatal team has treated bilious drainage and distension with gastric decompression and IV fluids. She has completed a first image-guided therapeutic water-soluble contrast enema.",
      "stem": "Which next decompression plan best fits {patientName}'s treatment response?",
      "answerChoices": [
        {
          "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.repeat",
          "label": "Repeat image-guided therapeutic contrast decompression",
          "isCorrect": true,
          "rationale": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
          "label": "Proceed to operative bowel decompression",
          "isCorrect": false,
          "rationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
          "label": "Continue gastric drainage with observation",
          "isCorrect": false,
          "rationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed outside-record observations; fictional patient",
        "items": [
          {
            "label": "Therapeutic procedure record",
            "value": "Contrast traversed a small-caliber colon and entered the distal ileum around intraluminal pellets. During the procedure the contrast advanced farther proximally, pellet burden decreased and meconium passed; further ileal pellets remained."
          },
          {
            "label": "After the procedure",
            "value": "Distension decreased but persists with bilious gastric drainage. Perfusion and urine output are maintained. The abdomen is soft without erythema or guarding; imaging shows no free gas, volvulus or obstructing pseudocyst."
          }
        ]
      },
      "sourceLabels": [
        "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
          ]
        },
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
          ]
        }
      ]
    }
  ],
  "learningSummary": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied."
}
```

Exact unchanged question:
```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
  "stem": "Which next decompression plan best fits {patientName}'s treatment response?",
  "exhibit": {
    "kind": "keyValue",
    "caption": "Constructed outside-record observations; fictional patient",
    "items": [
      {
        "label": "Therapeutic procedure record",
        "value": "Contrast traversed a small-caliber colon and entered the distal ileum around intraluminal pellets. During the procedure the contrast advanced farther proximally, pellet burden decreased and meconium passed; further ileal pellets remained."
      },
      {
        "label": "After the procedure",
        "value": "Distension decreased but persists with bilious gastric drainage. Perfusion and urine output are maintained. The abdomen is soft without erythema or guarding; imaging shows no free gas, volvulus or obstructing pseudocyst."
      }
    ]
  },
  "answerChoices": [
    {
      "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.repeat",
      "label": "Repeat image-guided therapeutic contrast decompression",
      "isCorrect": true,
      "rationale": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
      "distractorRationale": null
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
      "label": "Proceed to operative bowel decompression",
      "isCorrect": false,
      "rationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.",
      "distractorRationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt."
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
      "label": "Continue gastric drainage with observation",
      "isCorrect": false,
      "rationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.",
      "distractorRationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment."
    }
  ],
  "explanation": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
  "supportingEvidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
    "claim.pediatric-gi-abdominal-wall.meconium-enema",
    "claim.pediatric-gi-abdominal-wall.meconium-repeat",
    "claim.pediatric-gi-abdominal-wall.meconium-complicated"
  ]
}
```

Preservation hashes:
```json
{
  "beforeNode": "58bab61235bd6da190dec3e27925e86c787cf7a2e71bd8c3f14a7f1f18a5de18",
  "afterNode": "58bab61235bd6da190dec3e27925e86c787cf7a2e71bd8c3f14a7f1f18a5de18",
  "beforeQuestion": "f0a196c1be8166afcb583741decca5950ea206981d345ae744e6dea1e190e492",
  "afterQuestion": "f0a196c1be8166afcb583741decca5950ea206981d345ae744e6dea1e190e492",
  "afterCase": "6ed04de62c0f5154efec5f64d0e6c8d5fb653a4aa04618b1cf08dd21f428f35f"
}
```

Salvage author check:
```json
{
  "status": "salvage",
  "scoredFieldCheck": "Complete original scored node and question objects match the frozen PASS input SHA-256; no wording, options, key, exhibits or feedback changed.",
  "contextCheck": "Only the explicit clinic child/parent wrapper changed. Current clinic age and historical record age are separate; the presentation directs neonatal questions to the recorded care, without adding an interpretation or answering the task.",
  "compositionCheck": "One scored node. No excluded/non-PASS companion is in the case or learning summary.",
  "runtimeCheck": "Focused native admission passed with the existing pediatric marker, compatible child still and parent companion. No test, procedure or hospital care is enacted in clinic.",
  "approvalCheck": "The question keeps its existing editorial PASS reference; the new presentation wrapper remains salvage/needs_clinician_review and is not automatically accepted."
}
```

#### node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1

Status: **salvage**. Case case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1. Exact prior PASS source docs/research/question-topic-pediatric-gi-abdominal-wall-review2-20261111.json.

```json
{
  "sourceCaseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-standalone.v1",
  "sourceReviewedCaseId": "case.pediatric-gi-abdominal-wall.nec-course.v1",
  "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
  "nodeId": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
  "excludedCompanionNodeIds": [
    "node.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1"
  ],
  "clinicDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "recordDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "recordAgeText": "3-week-old",
  "profileId": "profile.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1"
}
```

Current complete runtime case:
```json
{
  "id": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
  "pediatricProfile": {
    "version": "pediatric-patient-profile.v1",
    "requiresParent": true,
    "clinicalScope": "outpatient"
  },
  "displayName": "Neonatal course review",
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
  "patientDisplayName": "Ethan Brooks",
  "prototypeDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "chiefComplaint": "Neonatal course review",
  "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 3-week-old infant; all questions concern that recorded neonatal care.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1",
      "pediatricProfile": {
        "version": "pediatric-patient-profile.v1",
        "requiresParent": true,
        "clinicalScope": "outpatient"
      },
      "prototypeDemographics": {
        "ageYears": 5,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Neonatal course review",
      "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 3-week-old infant; all questions concern that recorded neonatal care."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 4,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [
    "capability.pediatric_examination"
  ],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
  ],
  "decisionNodes": [
    {
      "id": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
      "primaryConceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
      "currentUpdate": "{patientName} was born preterm and is receiving neonatal medical treatment for NEC in an outside hospital.",
      "stem": "Which next plan is best supported by {patientName}'s current course?",
      "answerChoices": [
        {
          "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.medical",
          "label": "Continue nonoperative NEC treatment",
          "isCorrect": true,
          "rationale": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
          "label": "Perform exploratory laparotomy",
          "isCorrect": false,
          "rationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
          "label": "Insert a peritoneal drain",
          "isCorrect": false,
          "rationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed outside-record observations; fictional patient",
        "items": [
          {
            "label": "Serial radiology reports",
            "value": "Pneumatosis has decreased, but one dilated loop remains in the same position on consecutive films. No free intraperitoneal gas is reported."
          },
          {
            "label": "Concurrent clinical trend",
            "value": "Abdominal tenderness and distension have lessened. Ventilator and circulatory support have decreased, and lactate is falling."
          }
        ]
      },
      "sourceLabels": [
        "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
          ]
        },
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
          ]
        }
      ]
    }
  ],
  "learningSummary": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment."
}
```

Exact unchanged question:
```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
  "stem": "Which next plan is best supported by {patientName}'s current course?",
  "exhibit": {
    "kind": "keyValue",
    "caption": "Constructed outside-record observations; fictional patient",
    "items": [
      {
        "label": "Serial radiology reports",
        "value": "Pneumatosis has decreased, but one dilated loop remains in the same position on consecutive films. No free intraperitoneal gas is reported."
      },
      {
        "label": "Concurrent clinical trend",
        "value": "Abdominal tenderness and distension have lessened. Ventilator and circulatory support have decreased, and lactate is falling."
      }
    ]
  },
  "answerChoices": [
    {
      "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.medical",
      "label": "Continue nonoperative NEC treatment",
      "isCorrect": true,
      "rationale": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
      "distractorRationale": null
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
      "label": "Perform exploratory laparotomy",
      "isCorrect": false,
      "rationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.",
      "distractorRationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving."
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
      "label": "Insert a peritoneal drain",
      "isCorrect": false,
      "rationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.",
      "distractorRationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination."
    }
  ],
  "explanation": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
  "supportingEvidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
    "claim.pediatric-gi-abdominal-wall.nec-drain",
    "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
  ]
}
```

Preservation hashes:
```json
{
  "beforeNode": "b213ae8af6bcf5ff5e18361e51f8166981a0a1727dc6e5aa9c03c8250d259085",
  "afterNode": "b213ae8af6bcf5ff5e18361e51f8166981a0a1727dc6e5aa9c03c8250d259085",
  "beforeQuestion": "591060294b042395e1b3d1e4ba58c173fcad4fd31a0164bb00ec9cec7895860a",
  "afterQuestion": "591060294b042395e1b3d1e4ba58c173fcad4fd31a0164bb00ec9cec7895860a",
  "afterCase": "33a8b304173a07ac40d9de34431a369ce69849319b5ac97d7659618e2970b88c"
}
```

Salvage author check:
```json
{
  "status": "salvage",
  "scoredFieldCheck": "Complete original scored node and question objects match the frozen PASS input SHA-256; no wording, options, key, exhibits or feedback changed.",
  "contextCheck": "Only the explicit clinic child/parent wrapper changed. Current clinic age and historical record age are separate; the presentation directs neonatal questions to the recorded care, without adding an interpretation or answering the task.",
  "compositionCheck": "One scored node. No excluded/non-PASS companion is in the case or learning summary.",
  "runtimeCheck": "Focused native admission passed with the existing pediatric marker, compatible child still and parent companion. No test, procedure or hospital care is enacted in clinic.",
  "approvalCheck": "The question keeps its existing editorial PASS reference; the new presentation wrapper remains salvage/needs_clinician_review and is not automatically accepted."
}
```

#### node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1

Status: **salvage**. Case case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1. Exact prior PASS source docs/research/question-topic-pediatric-gi-abdominal-wall-review2-20261111.json.

```json
{
  "sourceCaseId": "case.pediatric-gi-abdominal-wall.preterm-groin-timing.v1",
  "sourceReviewedCaseId": "case.pediatric-gi-abdominal-wall.preterm-groin-timing.v1",
  "caseId": "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
  "nodeId": "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
  "excludedCompanionNodeIds": [],
  "clinicDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "recordDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "recordAgeText": "12-week-old",
  "profileId": "profile.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1"
}
```

Current complete runtime case:
```json
{
  "id": "case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
  "pediatricProfile": {
    "version": "pediatric-patient-profile.v1",
    "requiresParent": true,
    "clinicalScope": "outpatient"
  },
  "displayName": "Groin timing review",
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
  "patientDisplayName": "Henry Parker",
  "prototypeDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "chiefComplaint": "Groin timing review",
  "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 12-week-old infant; all questions concern that recorded neonatal care.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1",
      "pediatricProfile": {
        "version": "pediatric-patient-profile.v1",
        "requiresParent": true,
        "clinicalScope": "outpatient"
      },
      "prototypeDemographics": {
        "ageYears": 5,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Groin timing review",
      "presentation": "In clinic, {patientName}, a 5-year-old boy, attends with a parent. The founder reviews outside hospital records from when {patientName} was a 12-week-old infant; all questions concern that recorded neonatal care."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 4,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [
    "capability.pediatric_examination"
  ],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
  ],
  "decisionNodes": [
    {
      "id": "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
      "primaryConceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
      "currentUpdate": "{patientName} was born at 26 weeks and remains in an outside neonatal unit. Discharge is being planned with ongoing respiratory follow-up.",
      "stem": "Which repair-timing plan is most appropriate for {patientName}'s current groin finding?",
      "answerChoices": [
        {
          "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.after",
          "label": "Plan repair after the neonatal hospitalization",
          "isCorrect": true,
          "rationale": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.before",
          "label": "Plan repair before neonatal discharge",
          "isCorrect": false,
          "rationale": "Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.observe",
          "label": "Use serial surveillance for spontaneous resolution",
          "isCorrect": false,
          "rationale": "The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed outside-record observations; fictional patient",
        "items": [
          {
            "label": "Groin course",
            "value": "Pediatric surgical examinations repeatedly show an inguinal bulge that reduces completely. There have been no painful irreducible episodes, vomiting or skin changes."
          },
          {
            "label": "Respiratory and follow-up context",
            "value": "He still needs oxygen for bronchopulmonary dysplasia. His family can attend surgical follow-up and has been taught the warning signs requiring urgent reassessment."
          }
        ]
      },
      "sourceLabels": [
        "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.before",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
          ]
        },
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.observe",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
          ]
        }
      ]
    }
  ],
  "learningSummary": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule."
}
```

Exact unchanged question:
```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
  "stem": "Which repair-timing plan is most appropriate for {patientName}'s current groin finding?",
  "exhibit": {
    "kind": "keyValue",
    "caption": "Constructed outside-record observations; fictional patient",
    "items": [
      {
        "label": "Groin course",
        "value": "Pediatric surgical examinations repeatedly show an inguinal bulge that reduces completely. There have been no painful irreducible episodes, vomiting or skin changes."
      },
      {
        "label": "Respiratory and follow-up context",
        "value": "He still needs oxygen for bronchopulmonary dysplasia. His family can attend surgical follow-up and has been taught the warning signs requiring urgent reassessment."
      }
    ]
  },
  "answerChoices": [
    {
      "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.after",
      "label": "Plan repair after the neonatal hospitalization",
      "isCorrect": true,
      "rationale": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.",
      "distractorRationale": null
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.before",
      "label": "Plan repair before neonatal discharge",
      "isCorrect": false,
      "rationale": "Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison.",
      "distractorRationale": "Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison."
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.observe",
      "label": "Use serial surveillance for spontaneous resolution",
      "isCorrect": false,
      "rationale": "The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan.",
      "distractorRationale": "The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan."
    }
  ],
  "explanation": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.",
  "supportingEvidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
  ]
}
```

Preservation hashes:
```json
{
  "beforeNode": "259b87413e186edd3468fa1c490cde8296b1b887e52644aeae8bd62c40a90527",
  "afterNode": "259b87413e186edd3468fa1c490cde8296b1b887e52644aeae8bd62c40a90527",
  "beforeQuestion": "0f70110765b732d0def1de259d034e4640f55116ab0988e8abc2898e2afa7fe0",
  "afterQuestion": "0f70110765b732d0def1de259d034e4640f55116ab0988e8abc2898e2afa7fe0",
  "afterCase": "472b44951a7be43233384f5fd1cfa061d9b695cd769f827ae22a36b0819b800e"
}
```

Salvage author check:
```json
{
  "status": "salvage",
  "scoredFieldCheck": "Complete original scored node and question objects match the frozen PASS input SHA-256; no wording, options, key, exhibits or feedback changed.",
  "contextCheck": "Only the explicit clinic child/parent wrapper changed. Current clinic age and historical record age are separate; the presentation directs neonatal questions to the recorded care, without adding an interpretation or answering the task.",
  "compositionCheck": "One scored node. No excluded/non-PASS companion is in the case or learning summary.",
  "runtimeCheck": "Focused native admission passed with the existing pediatric marker, compatible child still and parent companion. No test, procedure or hospital care is enacted in clinic.",
  "approvalCheck": "The question keeps its existing editorial PASS reference; the new presentation wrapper remains salvage/needs_clinician_review and is not automatically accepted."
}
```

#### node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2

Status: **salvage**. Case case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1. Exact prior PASS source docs/research/question-topic-pediatric-gi-abdominal-wall-review2-20261111.json.

```json
{
  "sourceCaseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-standalone.v2",
  "sourceReviewedCaseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-standalone.v2",
  "caseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
  "nodeId": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
  "excludedCompanionNodeIds": [],
  "clinicDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "recordDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "recordAgeText": "5-year-old",
  "profileId": "profile.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1"
}
```

Current complete runtime case:
```json
{
  "id": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
  "pediatricProfile": {
    "version": "pediatric-patient-profile.v1",
    "requiresParent": true,
    "clinicalScope": "outpatient"
  },
  "displayName": "Renal mass review",
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
  "patientDisplayName": "Noah Bennett",
  "prototypeDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "chiefComplaint": "Renal mass review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with a parent.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1",
      "pediatricProfile": {
        "version": "pediatric-patient-profile.v1",
        "requiresParent": true,
        "clinicalScope": "outpatient"
      },
      "prototypeDemographics": {
        "ageYears": 5,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Renal mass review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with a parent."
    }
  ],
  "tutorialEligible": false,
  "routineEligible": true,
  "earliestFacilityStage": 4,
  "requiredClinicalSetting": "clinic",
  "requiredCapabilityIds": [
    "capability.pediatric_examination"
  ],
  "rewardTierId": "reward.clinic_basic",
  "sourceLabels": [
    "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
  ],
  "decisionNodes": [
    {
      "id": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
      "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
      "primaryConceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
      "currentUpdate": "{patientName}'s outside pediatric oncology center uses the COG/North American Wilms pathway. The team is selecting his initial treatment sequence for a renal mass.",
      "stem": "Which initial tumor-directed sequence should the outside team select for {patientName}?",
      "answerChoices": [
        {
          "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.biopsy",
          "label": "Biopsy, preoperative chemotherapy, then resection",
          "isCorrect": true,
          "rationale": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy",
          "label": "Nephrectomy with thrombectomy, then chemotherapy",
          "isCorrect": false,
          "rationale": "Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step.",
          "serviceRequest": null
        },
        {
          "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.chemotherapy",
          "label": "Preoperative chemotherapy, then resection histology",
          "isCorrect": false,
          "rationale": "This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.",
      "exhibit": {
        "kind": "keyValue",
        "caption": "Constructed outside-record observations; fictional patient",
        "items": [
          {
            "label": "Anatomic imaging",
            "value": "A mass expands the right renal parenchyma. The left kidney is normal. Enhancing tissue extends continuously from the right renal vein into the vena cava; its upper edge reaches the hepatic-vein confluence."
          },
          {
            "label": "Specialist review",
            "value": "The imaging appearance is typical of Wilms tumor. The staging review shows no distant lesions."
          }
        ]
      },
      "sourceLabels": [
        "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
      ],
      "resultGateAfter": null,
      "terminalDispositions": [
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
          ]
        },
        {
          "answerChoiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.chemotherapy",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The clinic record review ends with feedback; no hospital treatment or patient outcome is simulated.",
          "clinicalRationale": "This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted.",
          "sourceLabels": [
            "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
          ]
        }
      ]
    }
  ],
  "learningSummary": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception."
}
```

Exact unchanged question:
```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
  "stem": "Which initial tumor-directed sequence should the outside team select for {patientName}?",
  "exhibit": {
    "kind": "keyValue",
    "caption": "Constructed outside-record observations; fictional patient",
    "items": [
      {
        "label": "Anatomic imaging",
        "value": "A mass expands the right renal parenchyma. The left kidney is normal. Enhancing tissue extends continuously from the right renal vein into the vena cava; its upper edge reaches the hepatic-vein confluence."
      },
      {
        "label": "Specialist review",
        "value": "The imaging appearance is typical of Wilms tumor. The staging review shows no distant lesions."
      }
    ]
  },
  "answerChoices": [
    {
      "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.biopsy",
      "label": "Biopsy, preoperative chemotherapy, then resection",
      "isCorrect": true,
      "rationale": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.",
      "distractorRationale": null
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy",
      "label": "Nephrectomy with thrombectomy, then chemotherapy",
      "isCorrect": false,
      "rationale": "Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step.",
      "distractorRationale": "Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step."
    },
    {
      "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.chemotherapy",
      "label": "Preoperative chemotherapy, then resection histology",
      "isCorrect": false,
      "rationale": "This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted.",
      "distractorRationale": "This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted."
    }
  ],
  "explanation": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.",
  "supportingEvidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
    "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
    "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
    "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy"
  ]
}
```

Preservation hashes:
```json
{
  "beforeNode": "e1cd051092d60bdb3ad143b047ff0bfed398e0e6c091c3b86595dd30641bc796",
  "afterNode": "e1cd051092d60bdb3ad143b047ff0bfed398e0e6c091c3b86595dd30641bc796",
  "beforeQuestion": "80bee6ef43cb7be685280ddc9199a76eca8d3c3284f3c85a5c07b6daf75f768e",
  "afterQuestion": "80bee6ef43cb7be685280ddc9199a76eca8d3c3284f3c85a5c07b6daf75f768e",
  "afterCase": "d1c0148f6a06a3245b72ca6ee7835bc132f0c31be0e4de7f59396d49ebc02e6f"
}
```

Salvage author check:
```json
{
  "status": "salvage",
  "scoredFieldCheck": "Complete original scored node and question objects match the frozen PASS input SHA-256; no wording, options, key, exhibits or feedback changed.",
  "contextCheck": "Only the explicit clinic child/parent wrapper changed. Current clinic age and historical record age are separate; the presentation directs neonatal questions to the recorded care, without adding an interpretation or answering the task.",
  "compositionCheck": "One scored node. No excluded/non-PASS companion is in the case or learning summary.",
  "runtimeCheck": "Focused native admission passed with the existing pediatric marker, compatible child still and parent companion. No test, procedure or hospital care is enacted in clinic.",
  "approvalCheck": "The question keeps its existing editorial PASS reference; the new presentation wrapper remains salvage/needs_clinician_review and is not automatically accepted."
}
```

### Owner approvals needed

All six clinical versions and the exact new clinic child/parent presentations remain needs_clinician_review. Melissa must approve exact versions before clinical promotion. The manager reviews the salvage wrappers and their existing PASS records before acceptance; the original appendicolith/umbilical timing holds are untouched. No new clinical evidence claim, source, scored concept or FSRS history transfer was introduced.

### Validation

Command: `npm.cmd test -- --pool=threads src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts` (working directory packages/clinical-content). Exit 0.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  20 passed (20)
   Start at  23:20:23
   Duration  8.74s (transform 5.81s, setup 0ms, import 8.28s, tests 336ms, environment 0ms)
```

Command: `npm.cmd run typecheck` (working directory packages/clinical-content). Exit 1.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(2516,14): error TS2322: Type '{ pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; releasePointId?: string | undefined; ... 19 more ...; learningSummary: string; }[]' is not assignable to type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }[]'.
  Type '{ pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; releasePointId?: string | undefined; ... 19 more ...; learningSummary: string; }' is not assignable to type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.
    Types of property 'decisionNodes' are incompatible.
      Type '{ questionVariantId: string; primaryConceptId: string; currentUpdate?: string | undefined; stem: string; showServicePreviews?: boolean | undefined; answerChoices: { id: string; label: string; isCorrect: boolean; rationale?: string | undefined; serviceRequest: { ...; } | null; }[]; ... 7 more ...; terminalDisposition...' is not assignable to type '{ id: string; questionVariantId: string; primaryConceptId: string; currentUpdate?: string | undefined; stem: string; showServicePreviews?: boolean | undefined; answerChoices: { id: string; label: string; isCorrect: boolean; rationale?: string | undefined; serviceRequest: { ...; } | null; }[]; ... 6 more ...; termina...'.
        Type '{ questionVariantId: string; primaryConceptId: string; currentUpdate?: string | undefined; stem: string; showServicePreviews?: boolean | undefined; answerChoices: { id: string; label: string; isCorrect: boolean; rationale?: string | undefined; serviceRequest: { ...; } | null; }[]; ... 7 more ...; terminalDisposition...' is not assignable to type '{ id: string; questionVariantId: string; primaryConceptId: string; currentUpdate?: string | undefined; stem: string; showServicePreviews?: boolean | undefined; answerChoices: { id: string; label: string; isCorrect: boolean; rationale?: string | undefined; serviceRequest: { ...; } | null; }[]; ... 6 more ...; termina...'.
          Types of property 'terminalDispositions' are incompatible.
            Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }[]' is not assignable to type '({ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; })[]'.
              Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; }'.
                Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; }'.
                  Types of property 'clinicalRationale' are incompatible.
                    Type 'string | undefined' is not assignable to type 'string'.
                      Type 'undefined' is not assignable to type 'string'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

Command: `node -e "for (const f of ['docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.json','docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json']) { JSON.parse(require('fs').readFileSync(f,'utf8')); console.log('PASS JSON.parse: '+f); }"` (working directory .). Exit 0.

```text
PASS JSON.parse: docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.json
PASS JSON.parse: docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json
```

### Bounded salvage handoff

```text
Topic pediatric-gi-abdominal-wall; acceptance batch4 pediatric identity salvage
Files changed packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.ts
  packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts
  docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.md
  docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.json
  docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json
Counts requested 6, salvage 6, scored wording changed 0, new questions 0, new concepts 0, new medical claims 0; six standalone cases.
Case/node identities
  case.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance-salvage.v1 -> node.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1 (question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1)
  case.pediatric-gi-abdominal-wall.intussusception-partial-progress-salvage.v1 -> node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1 (question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1)
  case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-salvage.v1 -> node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2 (question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2)
  case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-salvage.v1 -> node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 (question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1)
  case.pediatric-gi-abdominal-wall.preterm-hernia-timing-salvage.v1 -> node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1 (question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1)
  case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-salvage.v1 -> node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2 (question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2)
Clinical frame Four infant charts are reviewed by the same named child at a school-age clinic follow-up. Current age/sex is explicit and child-art compatible; original infant ages remain explicit in the reviewed records. Two other child ages/sexes are retained. A generic parent accompanies every child. All six full scored node/question objects remain exact.
Composition Intussusception and NEC non-PASS companions are excluded; new explicit salvage case identities point to the one-node contexts. All six have the existing neutral final-answer metadata.
Runtime metadata Case and finite-profile pediatricProfile markers match the admitted pediatric contract, with capability.pediatric_examination and stage 4. Current chart-review timing is no_test. Three old outside-record timing/order alternatives are retained separately, not registered as clinic tests. No new setting, named-family registry or runtime change is needed.
Owner approvals needed Existing six clinical versions and exact new clinic record-review presentations remain needs_clinician_review. Editorial PASS is not named clinical approval. Historical appendicolith and umbilical-age holds remain unchanged.
Validation From packages/clinical-content: npm.cmd test -- --pool=threads src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts => exit 0; Test Files 1 passed (1), Tests 20 passed (20), including all six native child/parent admissions. npm.cmd run typecheck => exit 1; out-of-lane TS2322 colon-diverticular module (2516,14), clinicalRationale string | undefined. No owned-file diagnostics. Both owned JSON outputs parse. Full exact outputs are recorded.
Open work Manager reviews salvage contexts and exact PASS references, resolves unrelated package typecheck, and decides acceptance/integration. No shared files were edited and no commit, push, deploy, install or agents were used.
```

## Archived earlier audit and revision packet (historical)

The remaining content is the unchanged pre-salvage research packet, retained for exact prior presentation/source/review provenance. Current salvage identities, profiles and validation are above.

## Scope, snapshots, drift and progress

Follow-up outcome: **4 pass-preserved, 8 revised once, 5 parked** out of 17 exact reviewed items. The active sidecar contains **12 standalone cases / 12 scored nodes / 12 concepts**. No mixed multi-part case remains. All clinical versions remain needs_clinician_review. The eight revisions have author checks and await independent re-review; no new PASS is asserted.

The original assignment audit remains 3 exact variants: 0 kept, 0 rewritten, 3 retire-and-replace proposals. These shared source definitions were not edited. Of the initial 17 draft variants, 12 remain executable; this follow-up adds no net question. Four current meanings have new concept identities with predecessors retained; eight current identities are retained from the initial batch.

Dispatch baseline: manifest 145 rows; 1,151 cases / 1,462 nodes / 610 registered concepts. Current read-only observation: question-ship.2026-11-11.v12, 404 rows; 1250 cases / 1514 nodes / 813 registered concepts. The topic sidecar is absent from the default release. Only shared manifest/assembly hashes differ from the assigned source snapshot; assigned source hashes remain exact.

```json
{
  "independentReviewPath": "docs/research/question-topic-pediatric-gi-abdominal-wall-review-20261111.json",
  "reviewFileSha256": "f457a48f395be364bcce883ca202350cc227c98ab87df1bf36d8803e081c3eaa",
  "counts": {
    "reviewed": 17,
    "passPreserved": 4,
    "revised": 8,
    "parked": 5,
    "active": 12,
    "standaloneCases": 12,
    "multipartCases": 0,
    "stableCurrentConceptIds": 8,
    "newMeaningConceptIds": 4,
    "netAdditionalQuestions": 0
  },
  "caseComposition": {
    "policy": "No active multi-part case contains an unreviewed or parked companion. Every current case is standalone; all four PASS exact node/question/visible-context versions are preserved.",
    "splits": [
      {
        "fromCaseId": "case.pediatric-gi-abdominal-wall.intussusception-course.v1",
        "toCaseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-standalone.v1",
        "nodeId": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
        "reason": "Companion parked after one revision assessment; exact PASS wording retained."
      },
      {
        "fromCaseId": "case.pediatric-gi-abdominal-wall.nec-course.v1",
        "toCaseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-standalone.v1",
        "nodeId": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
        "reason": "Companion parked after one revision assessment; exact PASS wording retained."
      }
    ],
    "nativeSchemaFinding": "A focused module import showed that former nonfinal nodes with empty terminalDispositions fail the native final-node requirement. Standalone wrappers therefore add neutral no_terminal_outcome records; all reviewed clinical fields and question objects remain exact. Original complete node objects remain archived and exported for SHA-256 verification."
  },
  "liveTreeObservation": {
    "observedOn": "2026-11-11",
    "captureTimeUtc": "2026-11-12T00:18:28.542Z",
    "clockNote": "UTC capture crosses midnight; the topic date is 2026-11-11 in America/New_York.",
    "manifestId": "question-ship.2026-11-11.v12",
    "manifestRows": 404,
    "cases": 1250,
    "nodes": 1514,
    "registeredConcepts": 813,
    "topicCasesInDefault": [],
    "sourceInputs": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/batch-helpers.ts",
        "baselineSha256": "2d42183c4de8342ba989bf06cff5fa1222163f2ffb101d52c29f0d5af7835569",
        "currentSha256": "2d42183c4de8342ba989bf06cff5fa1222163f2ffb101d52c29f0d5af7835569"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/evidence-claims.ts",
        "baselineSha256": "e48f6a379f06faf2f7d1af63eb735646aa0d927cbfc9cca53ab2024c0fa7f5d4",
        "currentSha256": "e48f6a379f06faf2f7d1af63eb735646aa0d927cbfc9cca53ab2024c0fa7f5d4"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
        "baselineSha256": "eeb969e78880a28535c81e918220fa1b97d9aea8941f76d73882ff59dd256eda",
        "currentSha256": "eeb969e78880a28535c81e918220fa1b97d9aea8941f76d73882ff59dd256eda"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts",
        "baselineSha256": "df8cf958b36ec6f6608b114c3369b27df92e5d8f24e320a49f49d2f4ec795410",
        "currentSha256": "df8cf958b36ec6f6608b114c3369b27df92e5d8f24e320a49f49d2f4ec795410"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/source-catalog.ts",
        "baselineSha256": "4310c183eeb67b802356ea786f9243b4133c7c2ef7b63f955de0517ab68058ca",
        "currentSha256": "4310c183eeb67b802356ea786f9243b4133c7c2ef7b63f955de0517ab68058ca"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
        "baselineSha256": "e05be2a3198450eddbce2645647f22f61cf63bf86155af2e9d540403c60ba47e",
        "currentSha256": "e05be2a3198450eddbce2645647f22f61cf63bf86155af2e9d540403c60ba47e"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-additional.ts",
        "baselineSha256": "7862226fe3da4b64e42f7e04a6344db55c964dfdd22538e9adbff31d47c7be4a",
        "currentSha256": "7862226fe3da4b64e42f7e04a6344db55c964dfdd22538e9adbff31d47c7be4a"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-dispositions.ts",
        "baselineSha256": "9ee3bb1895812bca7aa24e7574fbe154c05680679c9ab9cb8e416b6f632d9dbd",
        "currentSha256": "9ee3bb1895812bca7aa24e7574fbe154c05680679c9ab9cb8e416b6f632d9dbd"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-evidence.ts",
        "baselineSha256": "d19c66a6faa471f5bc08d9dfb5e3ebc25d344bb24c025a42314448fac5f3a3ca",
        "currentSha256": "d19c66a6faa471f5bc08d9dfb5e3ebc25d344bb24c025a42314448fac5f3a3ca"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-materialize.ts",
        "baselineSha256": "69eb962066927ceb0d51dca85f836576712c4481f216cf50302c6f9afa33df64",
        "currentSha256": "69eb962066927ceb0d51dca85f836576712c4481f216cf50302c6f9afa33df64"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-reference-bindings.ts",
        "baselineSha256": "800b329cb9d1c1c155009dfece9261cb96de71471bb389320dc628ac9e3c6811",
        "currentSha256": "800b329cb9d1c1c155009dfece9261cb96de71471bb389320dc628ac9e3c6811"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-revisions.ts",
        "baselineSha256": "809f8d2033d2f79a4b5e9fd43250d091f5fbdde8d7feb4f03cd5850e14e77454",
        "currentSha256": "809f8d2033d2f79a4b5e9fd43250d091f5fbdde8d7feb4f03cd5850e14e77454"
      },
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-types.ts",
        "baselineSha256": "6a0276a21f2bad7479f2e2e3ececc1b62ae726373ff5c3fd8634c1e2085fa495",
        "currentSha256": "6a0276a21f2bad7479f2e2e3ececc1b62ae726373ff5c3fd8634c1e2085fa495"
      },
      {
        "file": "packages/clinical-content/src/question-ship-manifest.ts",
        "baselineSha256": "cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a",
        "currentSha256": "c891343f89e29b0009e65c4f464b5ca694f9fce0f43eb5960b7bc5542dbba7bc"
      },
      {
        "file": "packages/clinical-content/src/synthetic-content.ts",
        "baselineSha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
        "currentSha256": "8c76b4cb6c6458682b0b31023f1a214405733b2dd5b67f378d699a153e561b25"
      },
      {
        "file": "docs/research/question-new-n4-round2-20261110.json",
        "baselineSha256": "791db7f442111edab01cca5c9e05ba601daef8e3766f5602c89a7a64b5774e57",
        "currentSha256": "791db7f442111edab01cca5c9e05ba601daef8e3766f5602c89a7a64b5774e57"
      }
    ]
  }
}
```

The only authorized written files are the module, test, packet Markdown, packet JSON and source ledger in this slug lane. Shared manifest, registries, runtime, other topics, shared plans and shared handoff were preserved. Network access was available for permitted targeted verification. No agents, installs, commits, pushes, publication or deployment were performed.

Current progress and next action:
```json
[
  {
    "date": "2026-11-11",
    "completed": "Read root AGENTS, worker brief, complete v15 authoring standard, topic taxonomy and complete assigned identity lists. Shared dirty worktree observed; only five owned paths authorized.",
    "nextAction": "Verify permitted current sources, materialized exact before versions, and source hashes; complete audit and supported gap drafts."
  },
  {
    "date": "2026-11-11",
    "completed": "All three exact-context audits complete. Seventeen nodes in eleven clinic record-review cases, fifteen source records and thirty-eight claims. Manual gates include specific cue attacks and counterfactual repairs.",
    "nextAction": "Materialize sidecar, run focused test and package typecheck, generate complete packet. Manager owns independent review and acceptance."
  },
  {
    "date": "2026-11-11",
    "completed": "Authoring and scoped implementation complete; focused 9/9 passed. Package typecheck reports one out-of-lane pancreas file error. All seventeen drafts remain needs_clinician_review.",
    "nextAction": "Manager inspects the five-file lane, resolves the package typecheck, obtains independent review and named clinical decisions, then decides exact retirement/acceptance/integration."
  },
  {
    "date": "2026-11-11",
    "completed": "Authoring and scoped implementation complete; focused 9/9 passed. Package typecheck reports one out-of-lane pancreas file error. All seventeen drafts remain needs_clinician_review.",
    "nextAction": "Manager inspects the five-file lane, resolves the package typecheck, obtains independent review and named clinical decisions, then decides exact retirement/acceptance/integration."
  },
  {
    "on": "2026-11-11",
    "action": "Independent review input frozen before follow-up edits; four exact PASS items will be preserved. Work remains within the same five owned files."
  },
  {
    "date": "2026-11-11",
    "completed": "Independent review follow-up authored: four exact PASS preserved, eight revised once and five parked with explicit unresolved reasons. No mixed multi-part cases remain in the active preview.",
    "nextAction": "Materialize exact current snapshots, run focused tests and package typecheck, record complete outcomes and handoff."
  },
  {
    "date": "2026-11-11",
    "completed": "Final focused test 12/12 passed; all four PASS clinical versions verified exact. Clinical-content typecheck reports four oncology genetics test diagnostics and one pancreas diagnostic, with none in owned files. Full outputs recorded.",
    "nextAction": "Manager resolves out-of-lane diagnostics, obtains independent re-review of eight revisions and Melissa clinical approval, then decides exact acceptance and integration."
  }
]
```

## Ranked testable concepts and coverage/gap matrix

Ranks are editorial judgments of consequence and testability, not claims about ABSITE frequency or observed player performance. Current review status qualifies the original gap coverage.

Rank | Decision | Existing coverage / audit | Current exact review disposition | Evidence claims
--- | --- | --- | --- | ---
1 | Reassess the urgency of evolving neonatal intestinal obstruction. | No assigned coverage; gap draft | parked question.pediatric-gi-abdominal-wall.bilious-deterioration.v1 | claim.pediatric-gi-abdominal-wall.volvulus-operation, claim.pediatric-gi-abdominal-wall.bilious-deterioration, claim.pediatric-gi-abdominal-wall.bilious-contrast
2 | Assess an incomplete contrast study in neonatal bilious vomiting. | No assigned coverage; gap draft | revised question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2 | claim.pediatric-gi-abdominal-wall.bilious-normal-film, claim.pediatric-gi-abdominal-wall.bilious-contrast, claim.pediatric-gi-abdominal-wall.pyloric-evaluation, claim.pediatric-gi-abdominal-wall.meconium-enema
3 | Use residual chloride and acid-base disturbance when judging operative readiness. | No assigned coverage; gap draft | revised question.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2 | claim.pediatric-gi-abdominal-wall.pyloric-correction, claim.pediatric-gi-abdominal-wall.pyloric-definitive, claim.pediatric-gi-abdominal-wall.pyloric-evaluation
4 | Select management after partial ileocolic reduction with persistent stability. | No assigned coverage; gap draft | pass-preserved question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1 | claim.pediatric-gi-abdominal-wall.intussusception-risk, claim.pediatric-gi-abdominal-wall.intussusception-repeat, claim.pediatric-gi-abdominal-wall.intussusception-operation, claim.pediatric-gi-abdominal-wall.intussusception-transient
5 | Escalate persistent intussusception after failed repeat reduction and a structural lead point. | No assigned coverage; gap draft | parked question.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1 | claim.pediatric-gi-abdominal-wall.intussusception-operation, claim.pediatric-gi-abdominal-wall.intussusception-repeat
6 | Resolve inadequate rectal histology before diagnosing Hirschsprung disease. | No assigned coverage; gap draft | revised question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2 | claim.pediatric-gi-abdominal-wall.hscr-biopsy, claim.pediatric-gi-abdominal-wall.hscr-contrast-limit, claim.pediatric-gi-abdominal-wall.hscr-functional
7 | Choose structural assessment after pull-through despite ganglionated tissue. | No assigned coverage; gap draft | revised question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2 | claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical, claim.pediatric-gi-abdominal-wall.hscr-biopsy, claim.pediatric-gi-abdominal-wall.hscr-functional
8 | Interpret a fixed bowel loop against improving NEC physiology. | No assigned coverage; gap draft | pass-preserved question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 | claim.pediatric-gi-abdominal-wall.nec-fixed-loop, claim.pediatric-gi-abdominal-wall.nec-drain, claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty
9 | Escalate NEC after failure of a bridging peritoneal drain. | No assigned coverage; gap draft | parked question.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1 | claim.pediatric-gi-abdominal-wall.nec-drain, claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty
10 | Choose closure strategy after physiologic intolerance of complete reduction. | No assigned coverage; gap draft | pass-preserved question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1 | claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy, claim.pediatric-gi-abdominal-wall.gastroschisis-pressure, claim.pediatric-gi-abdominal-wall.gastroschisis-silo, claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage
11 | Apply cardiopulmonary status to giant omphalocele closure strategy. | No assigned coverage; gap draft | revised question.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2 | claim.pediatric-gi-abdominal-wall.omphalocele-anatomy, claim.pediatric-gi-abdominal-wall.omphalocele-respiratory, claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy, claim.pediatric-gi-abdominal-wall.gastroschisis-pressure, claim.pediatric-gi-abdominal-wall.gastroschisis-silo
12 | Select nonoperative decompression for uncomplicated meconium ileus. | No assigned coverage; gap draft | revised question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2 | claim.pediatric-gi-abdominal-wall.meconium-obstruction, claim.pediatric-gi-abdominal-wall.meconium-enema, claim.pediatric-gi-abdominal-wall.meconium-complicated, claim.pediatric-gi-abdominal-wall.hscr-biopsy, claim.pediatric-gi-abdominal-wall.hscr-irrigation
13 | Apply the COG framework to a typical unilateral resectable childhood renal mass. | No assigned coverage; gap draft | revised question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2 | claim.pediatric-gi-abdominal-wall.wilms-no-biopsy, claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage, claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions
14 | Plan regional nodal staging despite normal-appearing nodes. | No assigned coverage; gap draft | revised question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2 | claim.pediatric-gi-abdominal-wall.wilms-nodes
15 | Use major-vessel involvement to choose tissue strategy for an extrarenal pediatric mass. | No assigned coverage; gap draft | parked question.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1 | claim.pediatric-gi-abdominal-wall.neuroblastoma-evaluation, claim.pediatric-gi-abdominal-wall.neuroblastoma-vascular-risk, claim.pediatric-gi-abdominal-wall.neuroblastoma-biopsy, claim.pediatric-gi-abdominal-wall.wilms-no-biopsy
16 | Balance prematurity-related respiratory risk against reducible hernia risk. | Many-to-one replacement | pass-preserved question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1 | claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff, claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory
17 | Select a repeat study after inadequate assessment of suspected pyloric obstruction. | No assigned coverage; gap draft | parked question.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1 | claim.pediatric-gi-abdominal-wall.pyloric-evaluation, claim.pediatric-gi-abdominal-wall.pyloric-ultrasound, claim.pediatric-gi-abdominal-wall.bilious-contrast, claim.pediatric-gi-abdominal-wall.meconium-enema

Remaining gaps and source limitations:
```json
[
  {
    "topic": "Neonatal intestinal atresia and embryologic mechanisms",
    "priority": "high",
    "disposition": "Source/clinical verification next; no scored draft",
    "nextAction": "Verify a current permitted operative guideline and author a real patency/reconstruction decision rather than a double-bubble label."
  },
  {
    "topic": "Meckel diverticulum and pediatric GI bleeding",
    "priority": "high",
    "disposition": "Uncovered; no scored draft",
    "nextAction": "Verify permitted nuclear-medicine/surgical guidance for a consequential localization-versus-operative decision."
  },
  {
    "topic": "Hirschsprung-associated enterocolitis and continence",
    "priority": "high",
    "disposition": "Current guideline surveyed; exact regimen not authored",
    "nextAction": "Develop a distinct treatment/bowel-pattern decision with verified components, not another sampling item."
  },
  {
    "topic": "Post-NEC stricture and intestinal rehabilitation",
    "priority": "medium",
    "disposition": "Remaining follow-up gap",
    "nextAction": "Verify age-specific evidence and coordinate age-neutral nutrition companions with their topic owner."
  },
  {
    "topic": "Hepatoblastoma and other childhood abdominal masses",
    "priority": "medium",
    "disposition": "Uncovered",
    "nextAction": "Obtain current permitted tumor guidance; current mass drafts cover Wilms and neuroblastoma only."
  },
  {
    "topic": "Pediatric appendicolith/nonoperative appendicitis",
    "priority": "high",
    "disposition": "Unkeyed n4-slot-P06 preserved",
    "nextAction": "Verify the exact newer WSES pediatric boundary in permitted full guidance; do not substitute the old 2020 rule."
  },
  {
    "topic": "Fixed childhood umbilical-hernia repair age",
    "priority": "medium",
    "disposition": "Both withheld records preserved",
    "nextAction": "Melissa resolves the source disagreement before any fixed-age rule is keyed."
  },
  "Parked exact review items: question.pediatric-gi-abdominal-wall.bilious-deterioration.v1, question.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1, question.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1, question.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1, question.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1. Reopen only with the specific supporting findings/alternatives or an explicitly accepted easy purpose documented in each park reason."
]
```

## Complete exact-question audit

Record / exact variants | Concept / case / nodes | Verdict | Reasons | Proposed replacement
--- | --- | --- | --- | ---
inventory.ba2242ed0fad69df / question.pediatric-clinic.groin-bulge-after-play.v1 | concept.pediatric-clinic.inguinal-hernia-referral / case.pediatric-clinic.groin-bulge-after-play / node.pediatric-clinic.groin-bulge-after-play.1 | Retire-and-replace | The task supplies the hernia interpretation and asks for its associated referral; two consequential inferences are absent. Primary-care observation and parent-led monitoring repeat one error. Pain-dependent referral is a weak delay alternative, not a residual management choice. No exact accepted basic purpose, independent PASS or clinical approval was found. Low tier does not confer an exception. | question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1
inventory.8d54669d25a2afc2 / question.pediatric-clinic.intermittent-groin-swelling.v2 | concept.pediatric-clinic.inguinal-hernia-referral / case.pediatric-clinic.intermittent-groin-swelling / node.pediatric-clinic.intermittent-groin-swelling.1 | Retire-and-replace | Clinically apparent inguinal hernia pre-resolves the finding; all three alternatives omit or delay the same referral. Dynamic examination and absence of acute symptoms are appropriate but make the observation/delay options trivial. This cosmetic sibling repeats Noah's stable concept without another consequential decision or accepted basic purpose. | question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1
inventory.0c5779b81101107a / question.n4.intermittent-groin-contents-versus-fluid-scan.v1 | concept.n4r2.pediatric-groin-contents-and-reducibility / case.n4.intermittent-groin-contents-versus-fluid-scan.v1 / node.n4.intermittent-groin-contents-versus-fluid-scan.v1 | Retire-and-replace | Deleting the earlier quiet ultrasound leaves the same obvious herniotomy answer; the report discrepancy does not earn an inference. A parent video cannot establish bowel tissue identity through skin. Current bowel sounds and reduction already announce the key distinction. Exact independent review2 says REVISE, easy, twoStep false. A new timing-risk meaning is proposed instead of another recognition rewrite. | question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1

All three unique assigned variants have one verdict. The unkeyed/withheld planning rows are separate and are not scored audit verdicts. Exact audit details:
```json
[
  {
    "recordId": "inventory.ba2242ed0fad69df",
    "conceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
    "caseId": "case.pediatric-clinic.groin-bulge-after-play",
    "nodeIds": [
      "node.pediatric-clinic.groin-bulge-after-play.1"
    ],
    "variantIds": [
      "question.pediatric-clinic.groin-bulge-after-play.v1"
    ],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
      "line": 82,
      "export": "HERNIA_FAMILY",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
        "line": 82,
        "export": "HERNIA_FAMILY",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts",
        "line": 20,
        "export": "PEDIATRIC_CLINIC_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "beforeContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "beforeNodeSha256": "b9d98d76529d3ccb8f0f431db0660e75008987fb5009b229912da3adfadb4073",
    "beforeCaseSha256": "ac82b189e90e78cc85c6324253639b140e8c2b1b35671c8d6bdee62e39bef86e",
    "beforeQuestionSha256": "275069f9e681f2a00e6b72b2b651f8c0ae9d20f730a944668d9d412383fdca55",
    "currentStatus": "live original",
    "clinicalReviewStatus": "needs_clinician_review",
    "clinicalApprovalReference": null,
    "frozenIndependentPassReference": null,
    "editorialAcceptance": null,
    "verdict": "Retire-and-replace",
    "reasons": [
      "The task supplies the hernia interpretation and asks for its associated referral; two consequential inferences are absent.",
      "Primary-care observation and parent-led monitoring repeat one error. Pain-dependent referral is a weak delay alternative, not a residual management choice.",
      "No exact accepted basic purpose, independent PASS or clinical approval was found. Low tier does not confer an exception."
    ],
    "presentationAudit": "Short complaint, named age/sex, single exact caregiver profile and clinic setting are appropriate. Preserve the historical profile; presentation compliance does not establish resident difficulty.",
    "sequenceAudit": "Standalone node; no earlier feedback, cross-topic companion or identity reuse.",
    "timingAudit": "No existing testing choice. Preserve historical no-test metadata.",
    "sourceAudit": "Original evidence and dates retained in historical ledger. Valid clinical facts do not rescue redundant construction.",
    "replacementQuestionIds": [
      "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1"
    ],
    "replacementConceptIds": [
      "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1"
    ],
    "identityDecision": "Separate timing concept; old concepts, definitions, saves and FSRS histories preserved. Retirement is a future manager proposal only.",
    "priorIndependentReview": []
  },
  {
    "recordId": "inventory.8d54669d25a2afc2",
    "conceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
    "caseId": "case.pediatric-clinic.intermittent-groin-swelling",
    "nodeIds": [
      "node.pediatric-clinic.intermittent-groin-swelling.1"
    ],
    "variantIds": [
      "question.pediatric-clinic.intermittent-groin-swelling.v2"
    ],
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
      "line": 82,
      "export": "HERNIA_FAMILY",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/hernia.ts",
        "line": 82,
        "export": "HERNIA_FAMILY",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/pediatric-clinic-batch.ts",
        "line": 20,
        "export": "PEDIATRIC_CLINIC_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "beforeContentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "beforeNodeSha256": "420b279b9f7e0de790191f753cc1b2e87d8b4624e7a4bbc793411c5354aca1a4",
    "beforeCaseSha256": "5a9e01d7f4828b345126d2f2d71cc1662b6750a358d1a6349a33e1454f0eaacc",
    "beforeQuestionSha256": "29bcba563076215caecbd23292f6760696c50f80d04224cf7602fb04bb37f8b1",
    "currentStatus": "live original",
    "clinicalReviewStatus": "needs_clinician_review",
    "clinicalApprovalReference": null,
    "frozenIndependentPassReference": null,
    "editorialAcceptance": null,
    "verdict": "Retire-and-replace",
    "reasons": [
      "Clinically apparent inguinal hernia pre-resolves the finding; all three alternatives omit or delay the same referral.",
      "Dynamic examination and absence of acute symptoms are appropriate but make the observation/delay options trivial.",
      "This cosmetic sibling repeats Noah's stable concept without another consequential decision or accepted basic purpose."
    ],
    "presentationAudit": "Short complaint, named age/sex, single exact caregiver profile and clinic setting are appropriate. Preserve the historical profile; presentation compliance does not establish resident difficulty.",
    "sequenceAudit": "Standalone node; no earlier feedback, cross-topic companion or identity reuse.",
    "timingAudit": "No existing testing choice. Preserve historical no-test metadata.",
    "sourceAudit": "Original evidence and dates retained in historical ledger. Valid clinical facts do not rescue redundant construction.",
    "replacementQuestionIds": [
      "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1"
    ],
    "replacementConceptIds": [
      "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1"
    ],
    "identityDecision": "Separate timing concept; old concepts, definitions, saves and FSRS histories preserved. Retirement is a future manager proposal only.",
    "priorIndependentReview": []
  },
  {
    "recordId": "inventory.0c5779b81101107a",
    "conceptId": "concept.n4r2.pediatric-groin-contents-and-reducibility",
    "caseId": "case.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "nodeIds": [
      "node.n4.intermittent-groin-contents-versus-fluid-scan.v1"
    ],
    "variantIds": [
      "question.n4.intermittent-groin-contents-versus-fluid-scan.v1"
    ],
    "fileLocation": {
      "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
      "line": 33,
      "export": "QUESTION_NEW_N4_ROUND2_QUESTIONS",
      "locator": "exported computed definition"
    },
    "fileLocations": [
      {
        "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
        "line": 33,
        "export": "QUESTION_NEW_N4_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      {
        "file": "packages/clinical-content/src/question-n4-accepted-20261110.ts",
        "line": 173,
        "export": "QUESTION_NEW_N4_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      }
    ],
    "beforeContentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "beforeNodeSha256": "302620024d2e7987a7f0615719e5caf6dad5ce1684666dbe1e024eb8456eccc2",
    "beforeCaseSha256": "af72afd82cd2c9e7b6397b4631a4b16a800d560cc6b7b13f91f25716a3d873d5",
    "beforeQuestionSha256": "54f4e2c05fcd04a39397de5abcbb22e8015188da62459a5b8c82d9cd2b7a0033",
    "currentStatus": "draft parked",
    "clinicalReviewStatus": "needs_clinician_review",
    "clinicalApprovalReference": null,
    "frozenIndependentPassReference": null,
    "editorialAcceptance": null,
    "verdict": "Retire-and-replace",
    "reasons": [
      "Deleting the earlier quiet ultrasound leaves the same obvious herniotomy answer; the report discrepancy does not earn an inference.",
      "A parent video cannot establish bowel tissue identity through skin. Current bowel sounds and reduction already announce the key distinction.",
      "Exact independent review2 says REVISE, easy, twoStep false. A new timing-risk meaning is proposed instead of another recognition rewrite."
    ],
    "presentationAudit": "Short complaint, named age/sex, single exact caregiver profile and clinic setting are appropriate. Preserve the historical profile; presentation compliance does not establish resident difficulty.",
    "sequenceAudit": "Standalone node; no earlier feedback, cross-topic companion or identity reuse.",
    "timingAudit": "No existing testing choice. Preserve historical no-test metadata.",
    "sourceAudit": "Original evidence and dates retained in historical ledger. Valid clinical facts do not rescue redundant construction.",
    "replacementQuestionIds": [
      "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1"
    ],
    "replacementConceptIds": [
      "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1"
    ],
    "identityDecision": "Separate timing concept; old concepts, definitions, saves and FSRS histories preserved. Retirement is a future manager proposal only.",
    "priorIndependentReview": [
      {
        "id": "review.n4.intermittent-groin-contents-versus-fluid-scan.v1",
        "title": "Intermittent pediatric groin swelling",
        "verdict": "REVISE",
        "difficulty": "easy",
        "twoStep": false,
        "cues": [
          {
            "phrase": "The bulge returns into the abdomen with gentle pressure. The abdomen is soft, the groin is not tender, and he has continued eating and passing stool.",
            "why": "The cluster of reassuring observations makes Arrange emergency groin exploration readily dismissible even without detailed pediatric surgical knowledge. These are necessary urgency findings to retain, but they leave a weak emergency competitor."
          },
          {
            "phrase": "bowel sounds are heard over the bulge today",
            "why": "Alongside the loop-shaped moving structure, this strongly announces enteric rather than fluid-only contents. It is a raw clinical observation, not literally a diagnosis label, but substantially pre-resolves the hydrocele-versus-hernia distinction for a resident."
          }
        ],
        "fairness": [
          "Node node.n4.intermittent-groin-contents-versus-fluid-scan.v1: planned inguinal herniotomy is the defensible best offered plan for the current reducible enteric groin findings without the described signs of an acute complication. No confident clinical inaccuracy is identified in that ranking.",
          "The quiet fluid-only scan does not create a necessary second inference: deleting the entire previous-ultrasound sentence leaves the same straightforward diagnosis and disposition. The task remains familiar reducible-hernia recognition followed by routine elective-versus-emergency triage.",
          "The options compare three plans, but continued hydrocele follow-up is contradicted by the current findings and emergency exploration is contradicted by reducibility and the reassuring course. Neither offers a close residual decision for a PGY-2/3 resident. twoStep is false under the owner's consequential-reasoning standard, despite the nominal diagnose-then-treat sequence.",
          "The parent video describes an externally visible loop-shaped movement, not verified anatomical contents. It should not be treated as direct visualization of bowel through the skin. The current clinical examination already carries the decision, so this uncertain interpretation is unnecessary to defend the key; no confident claim of physical impossibility is made.",
          "Clinic phase, named child and caregiver fit. No treatment deadline or age cutoff is inferred. The unspecified duration of a hypothetical hydrocele would also prevent this item from teaching a general observation policy for hydroceles at this age."
        ],
        "suggestions": [
          "Retain reducibility, tenderness and obstructive-symptom information. Seek explicit acceptance as basic recognition/triage, or develop a verified residual decision that these findings do not already settle.",
          "Make any prior imaging discrepancy necessary to the revised choice; otherwise remove it rather than counting historical conflict as an additional reasoning step.",
          "Describe a parent video as observable swelling behavior without claiming it establishes tissue identity. Use credible current plans rather than a fluid-only diagnosis and an unsupported emergency operation as the main distractors."
        ]
      }
    ]
  }
]
```

### Original assigned before snapshots

These exact legacy definitions are retained for source/history review; retirement has not been applied. Full case objects include their original sequence and finite profiles.

#### question.pediatric-clinic.groin-bulge-after-play.v1

```json
{
  "recordId": "inventory.ba2242ed0fad69df",
  "sourceCase": {
    "id": "case.pediatric-clinic.groin-bulge-after-play",
    "pediatricProfile": {
      "version": "pediatric-patient-profile.v1",
      "requiresParent": true,
      "clinicalScope": "outpatient"
    },
    "displayName": "Refer a childhood inguinal hernia",
    "patientPresentationVariantId": "presentation.pediatric-clinic.groin-bulge-after-play",
    "releasePointId": "release.l4.pediatrics",
    "patientDisplayName": "Noah Bennett",
    "prototypeDemographics": {
      "ageYears": 5,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Groin bulge",
    "presentation": "Noah Bennett, a 5-year-old boy, visits the clinic with his father, Daniel Bennett, who remains in the same room throughout the visit. His father has noticed a painless bulge in Noah's right groin during active play. A soft groin bulge appears when Noah coughs and disappears when he lies down. Noah is comfortable, with no vomiting or abdominal pain.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-clinic.groin-bulge-after-play.boy5",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 5,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Groin bulge",
        "presentation": "Noah Bennett, a 5-year-old boy, visits the clinic with his father, Daniel Bennett, who remains in the same room throughout the visit. His father has noticed a painless bulge in Noah's right groin during active play. A soft groin bulge appears when Noah coughs and disappears when he lies down. Noah is comfortable, with no vomiting or abdominal pain."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 4,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [
      "capability.pediatric_examination"
    ],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "source.pediatric-clinic.cornwall-surgery-2025",
      "source.pediatric-clinic.nhs-hernia-2026"
    ],
    "decisionNodes": [
      {
        "id": "node.pediatric-clinic.groin-bulge-after-play.1",
        "questionVariantId": "question.pediatric-clinic.groin-bulge-after-play.v1",
        "primaryConceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
        "stem": "Which outpatient plan is most appropriate for Noah Bennett's clinically suspected inguinal hernia?",
        "answerChoices": [
          {
            "id": "choice.groin-bulge-after-play.surgery",
            "label": "Refer for pediatric surgical assessment",
            "isCorrect": true,
            "rationale": "The clinical groin-hernia finding warrants pediatric surgical referral even though Noah is comfortable today.",
            "serviceRequest": null
          },
          {
            "id": "choice.groin-bulge-after-play.observe",
            "label": "Continue observation in primary care",
            "isCorrect": false,
            "rationale": "Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia.",
            "serviceRequest": null
          },
          {
            "id": "choice.groin-bulge-after-play.parent-monitoring",
            "label": "Continue parent-led monitoring of the bulge",
            "isCorrect": false,
            "rationale": "Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment.",
            "serviceRequest": null
          },
          {
            "id": "choice.groin-bulge-after-play.pain-dependent",
            "label": "Defer surgical referral until pain develops",
            "isCorrect": false,
            "rationale": "The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Noah's history and examination support a childhood inguinal hernia. Arrange pediatric surgical assessment, including when the child is comfortable and the bulge settles with position.",
        "teachingPoint": "A clinically suspected childhood inguinal hernia belongs in a pediatric surgical referral pathway.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025",
          "source.pediatric-clinic.nhs-hernia-2026"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.groin-bulge-after-play.observe",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          },
          {
            "answerChoiceId": "choice.groin-bulge-after-play.parent-monitoring",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          },
          {
            "answerChoiceId": "choice.groin-bulge-after-play.pain-dependent",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Review the teaching point and choice rationales for this clinic visit."
  },
  "node": {
    "id": "node.pediatric-clinic.groin-bulge-after-play.1",
    "questionVariantId": "question.pediatric-clinic.groin-bulge-after-play.v1",
    "primaryConceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
    "stem": "Which outpatient plan is most appropriate for Noah Bennett's clinically suspected inguinal hernia?",
    "answerChoices": [
      {
        "id": "choice.groin-bulge-after-play.surgery",
        "label": "Refer for pediatric surgical assessment",
        "isCorrect": true,
        "rationale": "The clinical groin-hernia finding warrants pediatric surgical referral even though Noah is comfortable today.",
        "serviceRequest": null
      },
      {
        "id": "choice.groin-bulge-after-play.observe",
        "label": "Continue observation in primary care",
        "isCorrect": false,
        "rationale": "Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia.",
        "serviceRequest": null
      },
      {
        "id": "choice.groin-bulge-after-play.parent-monitoring",
        "label": "Continue parent-led monitoring of the bulge",
        "isCorrect": false,
        "rationale": "Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment.",
        "serviceRequest": null
      },
      {
        "id": "choice.groin-bulge-after-play.pain-dependent",
        "label": "Defer surgical referral until pain develops",
        "isCorrect": false,
        "rationale": "The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral.",
        "serviceRequest": null
      }
    ],
    "shuffleAnswers": true,
    "explanation": "Noah's history and examination support a childhood inguinal hernia. Arrange pediatric surgical assessment, including when the child is comfortable and the bulge settles with position.",
    "teachingPoint": "A clinically suspected childhood inguinal hernia belongs in a pediatric surgical referral pathway.",
    "sourceLabels": [
      "source.pediatric-clinic.cornwall-surgery-2025",
      "source.pediatric-clinic.nhs-hernia-2026"
    ],
    "resultGateAfter": null,
    "terminalDispositions": [
      {
        "answerChoiceId": "choice.groin-bulge-after-play.observe",
        "kind": "no_terminal_outcome",
        "consequenceNarrative": "Review the teaching point and choice rationales.",
        "clinicalRationale": "Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025"
        ]
      },
      {
        "answerChoiceId": "choice.groin-bulge-after-play.parent-monitoring",
        "kind": "no_terminal_outcome",
        "consequenceNarrative": "Review the teaching point and choice rationales.",
        "clinicalRationale": "Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025"
        ]
      },
      {
        "answerChoiceId": "choice.groin-bulge-after-play.pain-dependent",
        "kind": "no_terminal_outcome",
        "consequenceNarrative": "Review the teaching point and choice rationales.",
        "clinicalRationale": "The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025"
        ]
      }
    ]
  },
  "question": {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-clinic.groin-bulge-after-play.v1",
    "conceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
    "patientPresentationVariantId": "presentation.pediatric-clinic.groin-bulge-after-play",
    "patientPresentation": "Noah Bennett, a 5-year-old boy, visits the clinic with his father, Daniel Bennett, who remains in the same room throughout the visit. His father has noticed a painless bulge in Noah's right groin during active play. A soft groin bulge appears when Noah coughs and disappears when he lies down. Noah is comfortable, with no vomiting or abdominal pain.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-clinic.groin-bulge-after-play.boy5",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 5,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Groin bulge",
        "presentation": "Noah Bennett, a 5-year-old boy, visits the clinic with his father, Daniel Bennett, who remains in the same room throughout the visit. His father has noticed a painless bulge in Noah's right groin during active play. A soft groin bulge appears when Noah coughs and disappears when he lies down. Noah is comfortable, with no vomiting or abdominal pain."
      }
    ],
    "stem": "Which outpatient plan is most appropriate for Noah Bennett's clinically suspected inguinal hernia?",
    "answerChoices": [
      {
        "id": "choice.groin-bulge-after-play.surgery",
        "label": "Refer for pediatric surgical assessment",
        "isCorrect": true,
        "rationale": "The clinical groin-hernia finding warrants pediatric surgical referral even though Noah is comfortable today.",
        "distractorRationale": null
      },
      {
        "id": "choice.groin-bulge-after-play.observe",
        "label": "Continue observation in primary care",
        "isCorrect": false,
        "rationale": "Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia.",
        "distractorRationale": "Observation alone does not follow the child-specific referral recommendation for a clinically suspected inguinal hernia."
      },
      {
        "id": "choice.groin-bulge-after-play.parent-monitoring",
        "label": "Continue parent-led monitoring of the bulge",
        "isCorrect": false,
        "rationale": "Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment.",
        "distractorRationale": "Parent observations help establish the history, but monitoring alone omits the indicated pediatric surgical assessment."
      },
      {
        "id": "choice.groin-bulge-after-play.pain-dependent",
        "label": "Defer surgical referral until pain develops",
        "isCorrect": false,
        "rationale": "The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral.",
        "distractorRationale": "The child-specific referral recommendation is based on the clinical hernia finding; pain is not required before referral."
      }
    ],
    "explanation": "Noah's history and examination support a childhood inguinal hernia. Arrange pediatric surgical assessment, including when the child is comfortable and the bulge settles with position.",
    "teachingPoint": "A clinically suspected childhood inguinal hernia belongs in a pediatric surgical referral pathway.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-clinic.dynamic-groin-bulge",
      "claim.pediatric-clinic.clinical-groin-hernia-referral"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-08",
      "clinicianSignOff": false,
      "scope": "Editorial and provenance checks only; no clinical approval or release admission."
    }
  },
  "nodeSha256": "b9d98d76529d3ccb8f0f431db0660e75008987fb5009b229912da3adfadb4073",
  "caseSha256": "ac82b189e90e78cc85c6324253639b140e8c2b1b35671c8d6bdee62e39bef86e",
  "questionSha256": "275069f9e681f2a00e6b72b2b651f8c0ae9d20f730a944668d9d412383fdca55"
}
```

#### question.pediatric-clinic.intermittent-groin-swelling.v2

```json
{
  "recordId": "inventory.8d54669d25a2afc2",
  "sourceCase": {
    "id": "case.pediatric-clinic.intermittent-groin-swelling",
    "pediatricProfile": {
      "version": "pediatric-patient-profile.v1",
      "requiresParent": true,
      "clinicalScope": "outpatient"
    },
    "displayName": "Refer a childhood inguinal hernia",
    "patientPresentationVariantId": "presentation.pediatric-clinic.intermittent-groin-swelling",
    "releasePointId": "release.l4.pediatrics",
    "patientDisplayName": "Sofia Reed",
    "prototypeDemographics": {
      "ageYears": 9,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Intermittent groin swelling",
    "presentation": "Sofia Reed, a 9-year-old girl, visits the clinic with her mother, Helen Reed, who remains in the same room throughout the visit. Her mother describes a recurrent left groin bulge that appears when Sofia strains and disappears while she rests. The same soft bulge is visible during today's examination and settles when Sofia lies down. Sofia has no pain, vomiting or skin change.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-clinic.intermittent-groin-swelling.girl9",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 9,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Intermittent groin swelling",
        "presentation": "Sofia Reed, a 9-year-old girl, visits the clinic with her mother, Helen Reed, who remains in the same room throughout the visit. Her mother describes a recurrent left groin bulge that appears when Sofia strains and disappears while she rests. The same soft bulge is visible during today's examination and settles when Sofia lies down. Sofia has no pain, vomiting or skin change."
      }
    ],
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 4,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [
      "capability.pediatric_examination"
    ],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "source.pediatric-clinic.cornwall-surgery-2025",
      "source.pediatric-clinic.nhs-hernia-2026"
    ],
    "decisionNodes": [
      {
        "id": "node.pediatric-clinic.intermittent-groin-swelling.1",
        "questionVariantId": "question.pediatric-clinic.intermittent-groin-swelling.v2",
        "primaryConceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
        "stem": "What is the best outpatient disposition for Sofia Reed's clinically apparent inguinal hernia?",
        "answerChoices": [
          {
            "id": "choice.intermittent-groin-swelling.surgery",
            "label": "Arrange a pediatric surgery referral",
            "isCorrect": true,
            "rationale": "The clinically apparent childhood inguinal hernia should be assessed by pediatric surgery.",
            "serviceRequest": null
          },
          {
            "id": "choice.intermittent-groin-swelling.observe",
            "label": "Arrange routine primary-care observation",
            "isCorrect": false,
            "rationale": "Routine observation alone omits the recommended referral for a childhood inguinal hernia.",
            "serviceRequest": null
          },
          {
            "id": "choice.intermittent-groin-swelling.parent-monitoring",
            "label": "Arrange parent-led monitoring of the bulge",
            "isCorrect": false,
            "rationale": "The parental history already contributes to the diagnosis; further parent monitoring alone does not replace surgical assessment.",
            "serviceRequest": null
          },
          {
            "id": "choice.intermittent-groin-swelling.pain-dependent",
            "label": "Arrange surgical referral if pain develops",
            "isCorrect": false,
            "rationale": "A clinically apparent childhood inguinal hernia warrants referral even while it is painless.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "Sofia's parent history and examination support a clinically apparent childhood groin hernia. Arrange pediatric surgical assessment based on these clinical findings.",
        "teachingPoint": "Child-specific groin-hernia referral is based on clinical history and examination.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025",
          "source.pediatric-clinic.nhs-hernia-2026"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.intermittent-groin-swelling.observe",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "Routine observation alone omits the recommended referral for a childhood inguinal hernia.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          },
          {
            "answerChoiceId": "choice.intermittent-groin-swelling.parent-monitoring",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "The parental history already contributes to the diagnosis; further parent monitoring alone does not replace surgical assessment.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          },
          {
            "answerChoiceId": "choice.intermittent-groin-swelling.pain-dependent",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the teaching point and choice rationales.",
            "clinicalRationale": "A clinically apparent childhood inguinal hernia warrants referral even while it is painless.",
            "sourceLabels": [
              "source.pediatric-clinic.cornwall-surgery-2025"
            ]
          }
        ]
      }
    ],
    "learningSummary": "Review the teaching point and choice rationales for this clinic visit."
  },
  "node": {
    "id": "node.pediatric-clinic.intermittent-groin-swelling.1",
    "questionVariantId": "question.pediatric-clinic.intermittent-groin-swelling.v2",
    "primaryConceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
    "stem": "What is the best outpatient disposition for Sofia Reed's clinically apparent inguinal hernia?",
    "answerChoices": [
      {
        "id": "choice.intermittent-groin-swelling.surgery",
        "label": "Arrange a pediatric surgery referral",
        "isCorrect": true,
        "rationale": "The clinically apparent childhood inguinal hernia should be assessed by pediatric surgery.",
        "serviceRequest": null
      },
      {
        "id": "choice.intermittent-groin-swelling.observe",
        "label": "Arrange routine primary-care observation",
        "isCorrect": false,
        "rationale": "Routine observation alone omits the recommended referral for a childhood inguinal hernia.",
        "serviceRequest": null
      },
      {
        "id": "choice.intermittent-groin-swelling.parent-monitoring",
        "label": "Arrange parent-led monitoring of the bulge",
        "isCorrect": false,
        "rationale": "The parental history already contributes to the diagnosis; further parent monitoring alone does not replace surgical assessment.",
        "serviceRequest": null
      },
      {
        "id": "choice.intermittent-groin-swelling.pain-dependent",
        "label": "Arrange surgical referral if pain develops",
        "isCorrect": false,
        "rationale": "A clinically apparent childhood inguinal hernia warrants referral even while it is painless.",
        "serviceRequest": null
      }
    ],
    "shuffleAnswers": true,
    "explanation": "Sofia's parent history and examination support a clinically apparent childhood groin hernia. Arrange pediatric surgical assessment based on these clinical findings.",
    "teachingPoint": "Child-specific groin-hernia referral is based on clinical history and examination.",
    "sourceLabels": [
      "source.pediatric-clinic.cornwall-surgery-2025",
      "source.pediatric-clinic.nhs-hernia-2026"
    ],
    "resultGateAfter": null,
    "terminalDispositions": [
      {
        "answerChoiceId": "choice.intermittent-groin-swelling.observe",
        "kind": "no_terminal_outcome",
        "consequenceNarrative": "Review the teaching point and choice rationales.",
        "clinicalRationale": "Routine observation alone omits the recommended referral for a childhood inguinal hernia.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025"
        ]
      },
      {
        "answerChoiceId": "choice.intermittent-groin-swelling.parent-monitoring",
        "kind": "no_terminal_outcome",
        "consequenceNarrative": "Review the teaching point and choice rationales.",
        "clinicalRationale": "The parental history already contributes to the diagnosis; further parent monitoring alone does not replace surgical assessment.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025"
        ]
      },
      {
        "answerChoiceId": "choice.intermittent-groin-swelling.pain-dependent",
        "kind": "no_terminal_outcome",
        "consequenceNarrative": "Review the teaching point and choice rationales.",
        "clinicalRationale": "A clinically apparent childhood inguinal hernia warrants referral even while it is painless.",
        "sourceLabels": [
          "source.pediatric-clinic.cornwall-surgery-2025"
        ]
      }
    ]
  },
  "question": {
    "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.pediatric-clinic.intermittent-groin-swelling.v2",
    "conceptId": "concept.pediatric-clinic.inguinal-hernia-referral",
    "patientPresentationVariantId": "presentation.pediatric-clinic.intermittent-groin-swelling",
    "patientPresentation": "Sofia Reed, a 9-year-old girl, visits the clinic with her mother, Helen Reed, who remains in the same room throughout the visit. Her mother describes a recurrent left groin bulge that appears when Sofia strains and disappears while she rests. The same soft bulge is visible during today's examination and settles when Sofia lies down. Sofia has no pain, vomiting or skin change.",
    "approvedInstantiationProfiles": [
      {
        "id": "profile.pediatric-clinic.intermittent-groin-swelling.girl9",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        },
        "prototypeDemographics": {
          "ageYears": 9,
          "sexLabel": "Female"
        },
        "chiefComplaint": "Intermittent groin swelling",
        "presentation": "Sofia Reed, a 9-year-old girl, visits the clinic with her mother, Helen Reed, who remains in the same room throughout the visit. Her mother describes a recurrent left groin bulge that appears when Sofia strains and disappears while she rests. The same soft bulge is visible during today's examination and settles when Sofia lies down. Sofia has no pain, vomiting or skin change."
      }
    ],
    "stem": "What is the best outpatient disposition for Sofia Reed's clinically apparent inguinal hernia?",
    "answerChoices": [
      {
        "id": "choice.intermittent-groin-swelling.surgery",
        "label": "Arrange a pediatric surgery referral",
        "isCorrect": true,
        "rationale": "The clinically apparent childhood inguinal hernia should be assessed by pediatric surgery.",
        "distractorRationale": null
      },
      {
        "id": "choice.intermittent-groin-swelling.observe",
        "label": "Arrange routine primary-care observation",
        "isCorrect": false,
        "rationale": "Routine observation alone omits the recommended referral for a childhood inguinal hernia.",
        "distractorRationale": "Routine observation alone omits the recommended referral for a childhood inguinal hernia."
      },
      {
        "id": "choice.intermittent-groin-swelling.parent-monitoring",
        "label": "Arrange parent-led monitoring of the bulge",
        "isCorrect": false,
        "rationale": "The parental history already contributes to the diagnosis; further parent monitoring alone does not replace surgical assessment.",
        "distractorRationale": "The parental history already contributes to the diagnosis; further parent monitoring alone does not replace surgical assessment."
      },
      {
        "id": "choice.intermittent-groin-swelling.pain-dependent",
        "label": "Arrange surgical referral if pain develops",
        "isCorrect": false,
        "rationale": "A clinically apparent childhood inguinal hernia warrants referral even while it is painless.",
        "distractorRationale": "A clinically apparent childhood inguinal hernia warrants referral even while it is painless."
      }
    ],
    "explanation": "Sofia's parent history and examination support a clinically apparent childhood groin hernia. Arrange pediatric surgical assessment based on these clinical findings.",
    "teachingPoint": "Child-specific groin-hernia referral is based on clinical history and examination.",
    "supportingEvidenceClaimIds": [
      "claim.pediatric-clinic.dynamic-groin-bulge",
      "claim.pediatric-clinic.clinical-groin-hernia-referral"
    ],
    "agentReview": {
      "authority": "owner-delegated agent authoring and review",
      "reviewedOn": "2026-10-08",
      "clinicianSignOff": false,
      "scope": "Editorial and provenance checks only; no clinical approval or release admission."
    }
  },
  "nodeSha256": "420b279b9f7e0de790191f753cc1b2e87d8b4624e7a4bbc793411c5354aca1a4",
  "caseSha256": "5a9e01d7f4828b345126d2f2d71cc1662b6750a358d1a6349a33e1454f0eaacc",
  "questionSha256": "29bcba563076215caecbd23292f6760696c50f80d04224cf7602fb04bb37f8b1"
}
```

#### question.n4.intermittent-groin-contents-versus-fluid-scan.v1

```json
{
  "recordId": "inventory.0c5779b81101107a",
  "sourceCase": {
    "id": "case.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "displayName": "Intermittent groin swelling",
    "patientDisplayName": "Noah Bennett",
    "patientPresentationVariantId": "presentation.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "prototypeDemographics": {
      "ageYears": 5,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Intermittent groin swelling",
    "presentation": "{patientName}, a 5-year-old boy, attends pediatric surgery clinic with his father Daniel for intermittent right groin swelling. A prior ultrasound obtained while the swelling was absent described fluid in the canal.",
    "pediatricProfile": {
      "version": "pediatric-patient-profile.v1",
      "requiresParent": true,
      "clinicalScope": "outpatient"
    },
    "approvedInstantiationProfiles": [
      {
        "id": "profile.n4.intermittent-groin-contents-versus-fluid-scan.v1",
        "prototypeDemographics": {
          "ageYears": 5,
          "sexLabel": "Male"
        },
        "chiefComplaint": "Intermittent groin swelling",
        "presentation": "{patientName}, a 5-year-old boy, attends pediatric surgery clinic with his father Daniel for intermittent right groin swelling. A prior ultrasound obtained while the swelling was absent described fluid in the canal.",
        "pediatricProfile": {
          "version": "pediatric-patient-profile.v1",
          "requiresParent": true,
          "clinicalScope": "outpatient"
        }
      }
    ],
    "releasePointId": "release.l4.pediatrics",
    "tutorialEligible": false,
    "routineEligible": true,
    "earliestFacilityStage": 4,
    "requiredClinicalSetting": "clinic",
    "requiredCapabilityIds": [
      "capability.pediatric_examination"
    ],
    "rewardTierId": "reward.clinic_basic",
    "sourceLabels": [
      "Queensland children’s inguinal hernia guidance",
      "NHS congenital inguinal hernia and hydrocoeles guidance"
    ],
    "learningSummary": "A quiet study showing fluid does not exclude intermittent bowel entry into the same canal. Current dynamic findings establish the hernia problem; reduction and the comfortable abdominal examination distinguish a planned repair from emergency exploration. Use a specific herniotomy plan rather than treating this as a persistent fluid collection.",
    "decisionNodes": [
      {
        "id": "node.n4.intermittent-groin-contents-versus-fluid-scan.v1",
        "questionVariantId": "question.n4.intermittent-groin-contents-versus-fluid-scan.v1",
        "primaryConceptId": "concept.n4r2.pediatric-groin-contents-and-reducibility",
        "stem": "Which plan should be selected for {patientName}’s groin swelling?",
        "exhibit": {
          "kind": "keyValue",
          "caption": "Original constructed procedure record; fictional observations",
          "items": [
            {
              "label": "During standing and coughing",
              "value": "A groin bulge extends toward the scrotum. A parent’s video from a larger episode shows a loop-shaped structure moving within the swelling; bowel sounds are heard over the bulge today."
            },
            {
              "label": "During recumbent examination",
              "value": "The bulge returns into the abdomen with gentle pressure. The abdomen is soft, the groin is not tender, and he has continued eating and passing stool."
            }
          ]
        },
        "answerChoices": [
          {
            "id": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.repair",
            "label": "Schedule inguinal herniotomy",
            "isCorrect": true,
            "rationale": "Dynamic contents and reducibility support a bowel-containing hernia despite the quiet fluid-only study. A reducible child’s hernia needs planned repair rather than hydrocele follow-up.",
            "serviceRequest": null
          },
          {
            "id": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.observe",
            "label": "Continue hydrocele follow-up",
            "isCorrect": false,
            "rationale": "The earlier quiet scan does not explain the currently reducible bulge with enteric findings.",
            "serviceRequest": null
          },
          {
            "id": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.emergency",
            "label": "Arrange emergency groin exploration",
            "isCorrect": false,
            "rationale": "The present bulge reduces, and the child has no current obstructive or ischemic findings to justify this timing.",
            "serviceRequest": null
          }
        ],
        "shuffleAnswers": true,
        "explanation": "A quiet study showing fluid does not exclude intermittent bowel entry into the same canal. Current dynamic findings establish the hernia problem; reduction and the comfortable abdominal examination distinguish a planned repair from emergency exploration. Use a specific herniotomy plan rather than treating this as a persistent fluid collection.",
        "sourceLabels": [
          "Queensland children’s inguinal hernia guidance",
          "NHS congenital inguinal hernia and hydrocoeles guidance"
        ],
        "resultGateAfter": null,
        "terminalDispositions": [
          {
            "answerChoiceId": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.observe",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the findings and care decision before continuing; no patient outcome is simulated.",
            "clinicalRationale": "The earlier quiet scan does not explain the currently reducible bulge with enteric findings.",
            "sourceLabels": [
              "Queensland children’s inguinal hernia guidance",
              "NHS congenital inguinal hernia and hydrocoeles guidance"
            ]
          },
          {
            "answerChoiceId": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.emergency",
            "kind": "no_terminal_outcome",
            "consequenceNarrative": "Review the findings and care decision before continuing; no patient outcome is simulated.",
            "clinicalRationale": "The present bulge reduces, and the child has no current obstructive or ischemic findings to justify this timing.",
            "sourceLabels": [
              "Queensland children’s inguinal hernia guidance",
              "NHS congenital inguinal hernia and hydrocoeles guidance"
            ]
          }
        ]
      }
    ]
  },
  "node": {
    "id": "node.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "questionVariantId": "question.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "primaryConceptId": "concept.n4r2.pediatric-groin-contents-and-reducibility",
    "stem": "Which plan should be selected for {patientName}’s groin swelling?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed procedure record; fictional observations",
      "items": [
        {
          "label": "During standing and coughing",
          "value": "A groin bulge extends toward the scrotum. A parent’s video from a larger episode shows a loop-shaped structure moving within the swelling; bowel sounds are heard over the bulge today."
        },
        {
          "label": "During recumbent examination",
          "value": "The bulge returns into the abdomen with gentle pressure. The abdomen is soft, the groin is not tender, and he has continued eating and passing stool."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.repair",
        "label": "Schedule inguinal herniotomy",
        "isCorrect": true,
        "rationale": "Dynamic contents and reducibility support a bowel-containing hernia despite the quiet fluid-only study. A reducible child’s hernia needs planned repair rather than hydrocele follow-up.",
        "serviceRequest": null
      },
      {
        "id": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.observe",
        "label": "Continue hydrocele follow-up",
        "isCorrect": false,
        "rationale": "The earlier quiet scan does not explain the currently reducible bulge with enteric findings.",
        "serviceRequest": null
      },
      {
        "id": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.emergency",
        "label": "Arrange emergency groin exploration",
        "isCorrect": false,
        "rationale": "The present bulge reduces, and the child has no current obstructive or ischemic findings to justify this timing.",
        "serviceRequest": null
      }
    ],
    "shuffleAnswers": true,
    "explanation": "A quiet study showing fluid does not exclude intermittent bowel entry into the same canal. Current dynamic findings establish the hernia problem; reduction and the comfortable abdominal examination distinguish a planned repair from emergency exploration. Use a specific herniotomy plan rather than treating this as a persistent fluid collection.",
    "sourceLabels": [
      "Queensland children’s inguinal hernia guidance",
      "NHS congenital inguinal hernia and hydrocoeles guidance"
    ],
    "resultGateAfter": null,
    "terminalDispositions": [
      {
        "answerChoiceId": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.observe",
        "kind": "no_terminal_outcome",
        "consequenceNarrative": "Review the findings and care decision before continuing; no patient outcome is simulated.",
        "clinicalRationale": "The earlier quiet scan does not explain the currently reducible bulge with enteric findings.",
        "sourceLabels": [
          "Queensland children’s inguinal hernia guidance",
          "NHS congenital inguinal hernia and hydrocoeles guidance"
        ]
      },
      {
        "answerChoiceId": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.emergency",
        "kind": "no_terminal_outcome",
        "consequenceNarrative": "Review the findings and care decision before continuing; no patient outcome is simulated.",
        "clinicalRationale": "The present bulge reduces, and the child has no current obstructive or ischemic findings to justify this timing.",
        "sourceLabels": [
          "Queensland children’s inguinal hernia guidance",
          "NHS congenital inguinal hernia and hydrocoeles guidance"
        ]
      }
    ]
  },
  "question": {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "question.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "conceptId": "concept.n4r2.pediatric-groin-contents-and-reducibility",
    "stem": "Which plan should be selected for {patientName}’s groin swelling?",
    "exhibit": {
      "kind": "keyValue",
      "caption": "Original constructed procedure record; fictional observations",
      "items": [
        {
          "label": "During standing and coughing",
          "value": "A groin bulge extends toward the scrotum. A parent’s video from a larger episode shows a loop-shaped structure moving within the swelling; bowel sounds are heard over the bulge today."
        },
        {
          "label": "During recumbent examination",
          "value": "The bulge returns into the abdomen with gentle pressure. The abdomen is soft, the groin is not tender, and he has continued eating and passing stool."
        }
      ]
    },
    "answerChoices": [
      {
        "id": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.repair",
        "label": "Schedule inguinal herniotomy",
        "isCorrect": true,
        "rationale": "Dynamic contents and reducibility support a bowel-containing hernia despite the quiet fluid-only study. A reducible child’s hernia needs planned repair rather than hydrocele follow-up.",
        "distractorRationale": null
      },
      {
        "id": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.observe",
        "label": "Continue hydrocele follow-up",
        "isCorrect": false,
        "rationale": "The earlier quiet scan does not explain the currently reducible bulge with enteric findings.",
        "distractorRationale": "The earlier quiet scan does not explain the currently reducible bulge with enteric findings."
      },
      {
        "id": "choice.n4.intermittent-groin-contents-versus-fluid-scan.v1.emergency",
        "label": "Arrange emergency groin exploration",
        "isCorrect": false,
        "rationale": "The present bulge reduces, and the child has no current obstructive or ischemic findings to justify this timing.",
        "distractorRationale": "The present bulge reduces, and the child has no current obstructive or ischemic findings to justify this timing."
      }
    ],
    "explanation": "A quiet study showing fluid does not exclude intermittent bowel entry into the same canal. Current dynamic findings establish the hernia problem; reduction and the comfortable abdominal examination distinguish a planned repair from emergency exploration. Use a specific herniotomy plan rather than treating this as a persistent fluid collection.",
    "supportingEvidenceClaimIds": [
      "claim.n4r2.child-groin-dynamic-contents",
      "claim.n4r2.child-hernia-repair",
      "claim.n4r2.child-hernia-urgent-boundary"
    ]
  },
  "nodeSha256": "302620024d2e7987a7f0615719e5caf6dad5ce1684666dbe1e024eb8456eccc2",
  "caseSha256": "af72afd82cd2c9e7b6397b4631a4b16a800d560cc6b7b13f91f25716a3d873d5",
  "questionSha256": "54f4e2c05fcd04a39397de5abcbb22e8015188da62459a5b8c82d9cd2b7a0033"
}
```

### Held and unkeyed planning

```json
[
  {
    "recordId": "n4-slot-P06",
    "sourceSlotId": "P06",
    "primaryTopicSlug": "pediatric-gi-abdominal-wall",
    "conceptId": null,
    "caseId": null,
    "nodeIds": [],
    "variantIds": [],
    "chiefComplaint": null,
    "taskTextShort": "The newer 2025 WSES edition was published in 2026. Its exact pediatric appendicolith/NOM boundary was not verified in accessible permitted full guidance. Do not silently substitute the 2020 rule or use paywalled snippets.",
    "status": "draft parked",
    "inventoryKind": "unkeyed planned slot",
    "reason": "The newer 2025 WSES edition was published in 2026. Its exact pediatric appendicolith/NOM boundary was not verified in accessible permitted full guidance. Do not silently substitute the 2020 rule or use paywalled snippets.",
    "ownerQuestion": null,
    "fileLocation": {
      "file": "docs/research/question-new-n4-round2-20261110.json"
    },
    "priorPlanningLocation": {
      "file": "docs/research/question-new-n4-20261110.json"
    },
    "planningDisposition": "Preserved unkeyed/withheld; excluded from scored verdict totals.",
    "nextAction": "Manager obtains permitted evidence and named clinical decision before authoring."
  },
  {
    "recordId": "conflict.pediatric-clinic.umbilical-repair-age",
    "primaryTopicSlug": "pediatric-gi-abdominal-wall",
    "secondaryTopicSlugs": [],
    "conceptId": null,
    "caseId": null,
    "nodeIds": [],
    "variantIds": [],
    "chiefComplaint": null,
    "taskTextShort": "A fixed childhood umbilical-hernia repair age or mandatory age-based referral rule",
    "status": "draft parked",
    "inventoryKind": "withheld teaching point",
    "reason": "No question authored. Preserve the different source positions for named clinician review; do not average ages or imply the oldest source controls.",
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/evidence-claims.ts",
      "export": "WITHHELD_DISAGREEMENTS"
    },
    "claimId": "claim.pediatric-clinic.umbilical-repair-age-disagreement",
    "sourceIds": [],
    "clinicalReviewStatus": "needs_clinician_review",
    "planningDisposition": "Preserved unkeyed/withheld; excluded from scored verdict totals.",
    "nextAction": "Manager obtains permitted evidence and named clinical decision before authoring."
  },
  {
    "recordId": "withheld.pediatric-clinic.umbilical-timing",
    "primaryTopicSlug": "pediatric-gi-abdominal-wall",
    "secondaryTopicSlugs": [],
    "conceptId": null,
    "caseId": null,
    "nodeIds": [],
    "variantIds": [],
    "chiefComplaint": null,
    "taskTextShort": "Umbilical repair age",
    "status": "draft parked",
    "inventoryKind": "withheld teaching point",
    "reason": "Eligible source disagreement is preserved in conflict.pediatric-clinic.umbilical-repair-age; the planned timing/referral concept was dropped.",
    "fileLocation": {
      "file": "packages/clinical-content/src/development-batch/2026-10-08-pediatric-clinic/evidence-claims.ts",
      "export": "WITHHELD_TOPICS"
    },
    "claimId": null,
    "sourceIds": [],
    "clinicalReviewStatus": "needs_clinician_review",
    "planningDisposition": "Preserved unkeyed/withheld; excluded from scored verdict totals.",
    "nextAction": "Manager obtains permitted evidence and named clinical decision before authoring."
  }
]
```

## Exact independent-review disposition and before/after packet

The independent review JSON is a read-only input with SHA-256 above. Its 17 original node/question/case snapshots are frozen in packet JSON at independentReviewFollowup.reviewInput. The before displays below are historical review inputs, not selectable current cases. Exact full former multi-part objects remain there for chronology/feedback inspection. No historical failed companion is part of the current preview.

Reviewed exact question | Original verdict | Status | Current exact question | Current case
--- | --- | --- | --- | ---
question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v1 | REVISE | revised | question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2 | case.pediatric-gi-abdominal-wall.bilious-incomplete-study-standalone.v2
question.pediatric-gi-abdominal-wall.bilious-deterioration.v1 | REVISE | parked | No executable key | Parked
question.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1 | REVISE | parked | No executable key | Parked
question.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v1 | REVISE | revised | question.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2 | case.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis-standalone.v2
question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1 | PASS | pass-preserved | question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1 | case.pediatric-gi-abdominal-wall.intussusception-partial-progress-standalone.v1
question.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1 | REVISE | parked | No executable key | Parked
question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v1 | REVISE | revised | question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2 | case.pediatric-gi-abdominal-wall.hscr-superficial-biopsy-standalone.v2
question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v1 | REVISE | revised | question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2 | case.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction-standalone.v2
question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 | PASS | pass-preserved | question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1 | case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-standalone.v1
question.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1 | REVISE | parked | No executable key | Parked
question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1 | PASS | pass-preserved | question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1 | case.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1
question.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v1 | REVISE | revised | question.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2 | case.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary-standalone.v2
question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1 | REVISE | revised | question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2 | case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-standalone.v2
question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v1 | REVISE | revised | question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2 | case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-standalone.v2
question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v1 | REVISE | revised | question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2 | case.pediatric-gi-abdominal-wall.wilms-normal-node-sampling-standalone.v2
question.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1 | REVISE | parked | No executable key | Parked
question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1 | PASS | pass-preserved | question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1 | case.pediatric-gi-abdominal-wall.preterm-groin-timing.v1

### question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v1

Status: **revised**. Original verdict REVISE; original difficulty easy; original two-step false. Revision passes 1.

Concrete response actions:

1. Replaced the records-following task with a direct current imaging-plan question. Added warm extremities, brisk refill and maintained urine output, rather than inferring stability from a soft abdomen.
2. All labels now use parallel imaging-plan grammar; none uniquely completes the named omission. The actual acquisition, rather than a second description of an unfinished test, changes review versus repeat.
3. Kept bilious drainage and the plain-film limitation. Replaced weak pyloric and enema options with existing-series review, repeat contrast and expert Doppler; the same answer no longer follows when the acquisition log is removed. This is a standalone v2, with no later operative feedback.

Indexed review notes and responses:
```json
[
  {
    "category": "clarityIssues",
    "index": 0,
    "reviewNote": "The task 'Which investigation should follow Maya Wilson's current records?' is awkward: records are reviewed, while an investigation follows the clinical assessment. Ask for the next investigation for her ongoing bilious vomiting.",
    "disposition": "revised",
    "response": "Replaced the records-following task with a direct current imaging-plan question. Added warm extremities, brisk refill and maintained urine output, rather than inferring stability from a soft abdomen."
  },
  {
    "category": "clarityIssues",
    "index": 1,
    "reviewNote": "A soft abdomen does not by itself establish circulatory stability. The diagnostic pathway would be clearer with a concise current perfusion assessment.",
    "disposition": "revised",
    "response": "Replaced the records-following task with a direct current imaging-plan question. Added warm extremities, brisk refill and maintained urine output, rather than inferring stability from a soft abdomen."
  },
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "the remainder of the duodenal course was not imaged / Complete an upper-GI contrast examination",
      "why": "An explicitly unfinished contrast examination pairs with the only option beginning 'Complete.' A reader can select completion rather than reason about what the acquired study excludes. The acquisition limitation is necessary information; the option-level completion cue is avoidable."
    },
    "disposition": "revised",
    "response": "All labels now use parallel imaging-plan grammar; none uniquely completes the named omission. The actual acquisition, rather than a second description of an unfinished test, changes review versus repeat."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "An upper-GI examination is the best offered investigation for ongoing neonatal bilious vomiting with an unassessed duodenal course. A reassuring plain film does not resolve the concern. No confident clinical error identified in that explanation.",
    "disposition": "revised",
    "response": "Replaced the records-following task with a direct current imaging-plan question. Added warm extremities, brisk refill and maintained urine output, rather than inferring stability from a soft abdomen."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "Pyloric ultrasound is a weak competitor in this 3-day-old with dark-green emesis. The same answer follows after deleting the entire acquisition record, so that record does not supply a second consequential decision against these options.",
    "disposition": "revised",
    "response": "All labels now use parallel imaging-plan grammar; none uniquely completes the named omission. The actual acquisition, rather than a second description of an unfinished test, changes review versus repeat."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "This first node is self-contained. Its explanation identifies the unresolved rotational question but does not disclose the later operative answer.",
    "disposition": "revised",
    "response": "Kept bilious drainage and the plain-film limitation. Replaced weak pyloric and enema options with existing-series review, repeat contrast and expert Doppler; the same answer no longer follows when the acquisition log is removed. This is a standalone v2, with no later operative feedback."
  },
  {
    "category": "fairness",
    "index": 3,
    "reviewNote": "Review scope: all 17 new executable nodes were assessed from their visible candidate fields, including prior explanations in paired cases. Three proposed-retirement historical records and the parked/held records were noted, not scored. This is an offline editorial review, not source verification or clinical approval; all drafts remain needs_clinician_review.",
    "disposition": "revised",
    "response": "Replaced the records-following task with a direct current imaging-plan question. Added warm extremities, brisk refill and maintained urine output, rather than inferring stability from a soft abdomen."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Use parallel investigation labels without making 'Complete' unique to the key.",
    "disposition": "revised",
    "response": "Kept bilious drainage and the plain-film limitation. Replaced weak pyloric and enema options with existing-series review, repeat contrast and expert Doppler; the same answer no longer follows when the acquisition log is removed. This is a standalone v2, with no later operative feedback."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Make acquisition adequacy change the decision between credible diagnostic paths; do not add more descriptions of the same missing examination. Preserve bilious emesis and necessary safety findings.",
    "disposition": "revised",
    "response": "Kept bilious drainage and the plain-film limitation. Replaced weak pyloric and enema options with existing-series review, repeat contrast and expert Doppler; the same answer no longer follows when the acquisition log is removed. This is a standalone v2, with no later operative feedback."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "State current perfusion and use a direct next-investigation task. Retain the high-yield bilious-vomiting objective.",
    "disposition": "revised",
    "response": "Kept bilious drainage and the plain-film limitation. Replaced weak pyloric and enema options with existing-series review, repeat contrast and expert Doppler; the same answer no longer follows when the acquisition log is removed. This is a standalone v2, with no later operative feedback."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.bilious-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.bilious-incomplete-study.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Maya Wilson",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.bilious-course.v1",
  "chiefComplaint": "Newborn record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-day-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.bilious-course.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Newborn record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-day-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: First outside-hospital record: {patientName} has repeated dark-green emesis while receiving gastric decompression and IV fluids.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Abdominal examination and film",
      "value": "The abdomen is soft. Plain radiography shows gas through the bowel without a fixed obstructive pattern."
    },
    {
      "label": "Contrast acquisition record",
      "value": "The completed acquisition stops after contrast leaves the duodenal bulb; the remainder of the duodenal course was not imaged. The report describes gastric emptying."
    },
    {
      "label": "Clinical course",
      "value": "Green gastric drainage continues; temperature and the inflammatory evaluation have not suggested infection."
    }
  ]
}
```

Task: Which investigation should follow {patientName}'s current records?

**key shown first for review only**

1. Complete an upper-GI contrast examination **[KEY]**

Feedback: Persistent green drainage still requires assessment of intestinal rotation. The actual acquisition did not image the required duodenal course, so gastric emptying does not resolve that question.

2. Obtain a targeted pyloric ultrasound

Feedback: A pyloric study addresses gastric-outlet obstruction; it does not replace the incomplete assessment prompted by persistent green drainage.

3. Obtain a water-soluble contrast enema

Feedback: The record raises an unresolved proximal rotational problem rather than an established distal meconium obstruction.

Explanation: Persistent green drainage still requires assessment of intestinal rotation. The actual acquisition did not image the required duodenal course, so gastric emptying does not resolve that question.

Evidence claims: claim.pediatric-gi-abdominal-wall.bilious-normal-film, claim.pediatric-gi-abdominal-wall.bilious-contrast, claim.pediatric-gi-abdominal-wall.pyloric-evaluation, claim.pediatric-gi-abdominal-wall.meconium-enema.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: revised exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.bilious-incomplete-study-standalone.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.bilious-exported-versus-acquired-series.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Maya Wilson",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.bilious-incomplete-study-standalone.v2",
  "chiefComplaint": "Newborn record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-day-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.bilious-incomplete-study-standalone.v2",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Newborn record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-day-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName} continues to have dark-green gastric drainage in the outside neonatal unit. Gastric decompression and IV fluids continue while the pediatric team reviews her imaging.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Current examination",
      "value": "Her extremities are warm, capillary refill is brisk and urine output is maintained. The abdomen is soft without tenderness. The plain film shows gas through the bowel."
    },
    {
      "label": "Transferred material",
      "value": "The receiving viewer contains gastric and duodenal-bulb stills. The report comments on gastric emptying."
    },
    {
      "label": "Original acquisition log",
      "value": "The same examination also has stored frontal and lateral fluoroscopic sequences following contrast through the duodenum to the duodenojejunal junction. Those sequences were not included in the transferred image set."
    }
  ]
}
```

Task: Which imaging plan should the outside team select next for {patientName}'s ongoing bilious drainage?

**key shown first for review only**

1. Seek pediatric review of the original upper-GI series **[KEY]**

Feedback: The transferred stills cannot settle rotation. The log documents a larger acquired series, so obtain prompt specialist interpretation of those original images before assuming that the examination must be reacquired.

2. Repeat upper-GI fluoroscopy with pediatric radiology

Feedback: A new examination is appropriate if the original acquisition did not represent the duodenal course or cannot be interpreted. Here the absent transferred images are documented in the original archive; review that series first.

3. Obtain mesenteric Doppler with pediatric radiology

Feedback: Expert ultrasound has a role in this differential, but changing modalities does not resolve what the already acquired contrast series shows. Its role is not restricted to a universally inferior test.

Explanation: The transferred stills cannot settle rotation. The log documents a larger acquired series, so obtain prompt specialist interpretation of those original images before assuming that the examination must be reacquired.

Evidence claims: claim.pediatric-gi-abdominal-wall.bilious-normal-film, claim.pediatric-gi-abdominal-wall.bilious-contrast, claim.pediatric-gi-abdominal-wall.bilious-series-review, claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "Persistent green drainage is not cleared by gas on a plain film or by a report of gastric emptying.",
  "decision": "Distinguish the images displayed at the receiving site from the sequences actually acquired, then seek interpretation of the existing relevant series rather than automatically repeating it.",
  "closestCredibleError": "Repeat upper-GI fluoroscopy because the transferred viewer ends at the bulb.",
  "decidingObservation": "The acquisition log documents archived duodenal and duodenojejunal sequences omitted from the export.",
  "consequenceOfError": "A redundant acquisition may delay interpretation and add exposure; accepting the partial transferred record could leave rotation unevaluated.",
  "deletionTest": "Without persistent bilious drainage there is no stated urgent rotational question. Without the original acquisition log, repeat upper-GI imaging is the best offered plan because the visible record is limited. Perfusion anchors the current diagnostic phase.",
  "counterfactual": "If the original acquisition log instead confirmed that imaging stopped at the bulb and no later series was acquired, repeat upper-GI fluoroscopy becomes the best offered plan.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.repeat"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "Removed the unique Complete verb, pyloric and lower-tract foils. All three labels specify a pediatric imaging plan. The archive distinction is essential provenance, not an authored declaration that the study is normal or diagnostic.",
  "oneStageAndCategory": "All alternatives are current imaging plans during ongoing outside-hospital assessment; decompression and resuscitation are common background care.",
  "twoConsequentialSteps": "Persistent green drainage is not cleared by gas on a plain film or by a report of gastric emptying. Then Distinguish the images displayed at the receiving site from the sequences actually acquired, then seek interpretation of the existing relevant series rather than automatically repeating it.",
  "residentDifficulty": "Predicted moderate: the strongest error is unnecessary reacquisition after mistaking an export failure for an acquisition failure. This is an original record-review application; a radiologist must confirm that this archive is sufficient for prompt review.",
  "oneBestAnswer": "The acquisition log documents archived duodenal and duodenojejunal sequences omitted from the export. Counterfactual: If the original acquisition log instead confirmed that imaging stopped at the bulb and no later series was acquired, repeat upper-GI fluoroscopy becomes the best offered plan.",
  "sequenceAndFiniteProfileAttack": "Standalone named 3-day-old female outside-hospital record review. No prior answer, later episode or feedback is displayed; one finite profile preserves the constrained age and sex.",
  "repairAndRecheck": "Re-solved with the log removed and then with acquisition truly absent: repeat upper-GI becomes preferable. No finding of normal rotation or promise that review will avoid another test is supplied.",
  "remainingRisk": "The review-before-reacquisition preference is an original application of source-supported diagnostic-quality second-opinion sharing. Melissa and pediatric radiology must confirm this exact ranking; ultrasound remains a legitimate alternative when further imaging is needed.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Revised once for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.review",
    "label": "Seek pediatric review of the original upper-GI series",
    "rationale": "The transferred stills cannot settle rotation. The log documents a larger acquired series, so obtain prompt specialist interpretation of those original images before assuming that the examination must be reacquired.",
    "temptation": "Repeat contrast reflexively because the receiving viewer lacks the later sequences.",
    "correctUnder": "A complete relevant series was acquired but is absent from the transferred set.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.bilious-normal-film",
      "claim.pediatric-gi-abdominal-wall.bilious-contrast",
      "claim.pediatric-gi-abdominal-wall.bilious-series-review"
    ],
    "timingProfileId": "timing.test.combined_diagnostic"
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.repeat",
    "label": "Repeat upper-GI fluoroscopy with pediatric radiology",
    "rationale": "A new examination is appropriate if the original acquisition did not represent the duodenal course or cannot be interpreted. Here the absent transferred images are documented in the original archive; review that series first.",
    "temptation": "Equate a missing export with missing acquisition.",
    "correctUnder": "The original acquisition actually stopped at the bulb or specialist review found the stored series inadequate.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.bilious-contrast",
      "claim.pediatric-gi-abdominal-wall.bilious-series-review"
    ],
    "timingProfileId": "timing.test.radiography"
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.doppler",
    "label": "Obtain mesenteric Doppler with pediatric radiology",
    "rationale": "Expert ultrasound has a role in this differential, but changing modalities does not resolve what the already acquired contrast series shows. Its role is not restricted to a universally inferior test.",
    "temptation": "Avoid repeat radiation by changing modalities without reviewing the existing diagnostic record.",
    "correctUnder": "Specialist review requires further assessment and selects expert ultrasound within the local pathway.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role",
      "claim.pediatric-gi-abdominal-wall.bilious-series-review"
    ],
    "timingProfileId": "timing.test.ultrasound"
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.bilious-normal-film",
    "claim.pediatric-gi-abdominal-wall.bilious-contrast",
    "claim.pediatric-gi-abdominal-wall.bilious-series-review",
    "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.bilious-normal-film",
    "claim.pediatric-gi-abdominal-wall.bilious-contrast",
    "claim.pediatric-gi-abdominal-wall.bilious-series-review",
    "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.bilious-normal-film",
    "claim.pediatric-gi-abdominal-wall.bilious-contrast",
    "claim.pediatric-gi-abdominal-wall.bilious-series-review",
    "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.review",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.bilious-normal-film",
        "claim.pediatric-gi-abdominal-wall.bilious-contrast",
        "claim.pediatric-gi-abdominal-wall.bilious-series-review"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.repeat",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.bilious-contrast",
        "claim.pediatric-gi-abdominal-wall.bilious-series-review"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.doppler",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role",
        "claim.pediatric-gi-abdominal-wall.bilious-series-review"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.bilious-normal-film",
    "claim.pediatric-gi-abdominal-wall.bilious-contrast",
    "claim.pediatric-gi-abdominal-wall.bilious-series-review",
    "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role"
  ]
}
```

Constructed data policy: Age, chronology, reported measurements, examinations and responses are fictional patient observations, not empirical cutoffs, probabilities or demographic weights.

Exact current snapshot hashes:
```json
{
  "node": "6524deec858d4fb5a1a8f2a437e8ecf66debd142f37394540cd492eda9cdbb72",
  "question": "6b69e24dea66eb125b30e92ce841796b574d0f23318ef4a3ea4770797e0d45cf",
  "clinicalCase": "6fc5621226479c5af603c39a2d51d3b034b7bacb86322b58d42186ea5a935929"
}
```

### question.pediatric-gi-abdominal-wall.bilious-deterioration.v1

Status: **parked**. Original verdict REVISE; original difficulty easy; original two-step false. Revision passes 1.

Concrete response actions:

1. Retained the diagnosis, acquired tenderness and perfusion decline in the archived input. Their urgency is valid and is not hidden to manufacture ambiguity.
2. The two cues and all fairness notes were accepted: repeat imaging and unchanged support are weak, and deterioration adds urgency rather than a second decision. A distinct operative decision lacks the necessary supported findings.
3. Parked instead of requesting an unapproved easy safety exception or inventing an operative viability scenario. The earlier stable imaging node is independent.

Indexed review notes and responses:
```json
[
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "the radiologist reports midgut volvulus",
      "why": "The report supplies the diagnosis; the requested action is its familiar emergency treatment. A named diagnosis is permissible for management, but it removes the claimed interpretive step here."
    },
    "disposition": "parked",
    "response": "The two cues and all fairness notes were accepted: repeat imaging and unchanged support are weak, and deterioration adds urgency rather than a second decision. A distinct operative decision lacks the necessary supported findings."
  },
  {
    "category": "cues",
    "index": 1,
    "reviewNote": {
      "phrase": "Perfusion and urine output worsen, and lactate rises despite IV fluid treatment / Proceed to urgent operative exploration",
      "why": "Escalating danger pairs with the only urgent active treatment. The other options repeat a completed diagnostic study or continue already-failing support, making generic escalation sufficient."
    },
    "disposition": "parked",
    "response": "The two cues and all fairness notes were accepted: repeat imaging and unchanged support are weak, and deterioration adds urgency rather than a second decision. A distinct operative decision lacks the necessary supported findings."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "Urgent exploration is clearly the best offered plan; the clinical explanation is sound. Resuscitation remains concurrent care, not an alternative to correcting volvulus.",
    "disposition": "parked",
    "response": "Parked instead of requesting an unapproved easy safety exception or inventing an operative viability scenario. The earlier stable imaging node is independent."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "Confirmed midgut volvulus already warrants urgent surgical treatment. The deterioration exhibit strengthens urgency but does not change the answer against these distractors.",
    "disposition": "parked",
    "response": "Retained the diagnosis, acquired tenderness and perfusion decline in the archived input. Their urgency is valid and is not hidden to manufacture ambiguity."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The transition from incomplete to completed imaging is coherent, and this node states the decisive result independently. The preceding explanation does not explicitly supply surgery, although the pair predictably progresses from diagnosis to treatment.",
    "disposition": "parked",
    "response": "The two cues and all fairness notes were accepted: repeat imaging and unchanged support are weak, and deterioration adds urgency rather than a second decision. A distinct operative decision lacks the necessary supported findings."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Retain the emergency findings. Either seek explicit acceptance as an easy safety-recognition item or test a distinct consequential operative decision using adequate findings and credible alternatives.",
    "disposition": "parked",
    "response": "Parked instead of requesting an unapproved easy safety exception or inventing an operative viability scenario. The earlier stable imaging node is independent."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Do not manufacture difficulty by making repeat imaging or observation appear appropriate for documented volvulus. Removing the diagnosis label alone will not create two consequential steps.",
    "disposition": "parked",
    "response": "Parked instead of requesting an unapproved easy safety exception or inventing an operative viability scenario. The earlier stable imaging node is independent."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.bilious-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.bilious-deterioration.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.bilious-deterioration.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Maya Wilson",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.bilious-course.v1",
  "chiefComplaint": "Newborn record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-day-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.bilious-course.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Newborn record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-day-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: Subsequent outside record for {patientName}: the contrast study has been completed, and the hospital team is reassessing the new observations below.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Completed upper-GI report",
      "value": "The duodenum follows a tightly spiraled course with abrupt distal hold-up; the radiologist reports midgut volvulus."
    },
    {
      "label": "Change during resuscitation",
      "value": "The abdomen becomes tender and mottled. Perfusion and urine output worsen, and lactate rises despite IV fluid treatment."
    }
  ]
}
```

Task: Which plan should the outside surgical team select for {patientName} now?

**key shown first for review only**

1. Proceed to urgent operative exploration **[KEY]**

Feedback: The completed study plus worsening abdominal and perfusion findings supports urgent exploration for volvulus, with bowel viability assessed during surgery. Further diagnostic observation risks ongoing ischemia.

2. Repeat the upper-GI contrast examination

Feedback: The rotational examination is now complete and has identified volvulus. Repeating it does not address deteriorating perfusion.

3. Continue gastric decompression and reassessment

Feedback: Decompression and fluids remain background care, but they do not correct the documented volvulus while perfusion worsens.

Explanation: The completed study plus worsening abdominal and perfusion findings supports urgent exploration for volvulus, with bowel viability assessed during surgery. Further diagnostic observation risks ongoing ischemia.

Evidence claims: claim.pediatric-gi-abdominal-wall.volvulus-operation, claim.pediatric-gi-abdominal-wall.bilious-deterioration, claim.pediatric-gi-abdominal-wall.bilious-contrast.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: parked; no executable scored key

```json
{
  "reviewedQuestionVariantId": "question.pediatric-gi-abdominal-wall.bilious-deterioration.v1",
  "reviewedNodeId": "node.pediatric-gi-abdominal-wall.bilious-deterioration.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.bilious-deterioration.v1",
  "status": "parked",
  "reason": "The supported emergency key remains easy recognition; confirmed volvulus itself determines urgent operation. A harder operative-extent decision would require additional source-verified viability findings and alternatives not established in this record. There is no accepted easy safety-role reference.",
  "attemptedRevision": "Considered removing the radiologist diagnosis and comparing detorsion, bowel resection and staged viability reassessment. Removing the label alone does not add a consequential step; choosing resection extent without an actual supported bowel-viability record would be unfair.",
  "clinicalReviewStatus": "needs_clinician_review",
  "keyState": "No current executable question or scored key; original reviewed v1 retained only in reviewInput.",
  "reopenOwner": "Manager with Melissa and the relevant pediatric specialist",
  "reviewInputPointer": "independentReviewFollowup.reviewInput.proposals[questionVariantId=question.pediatric-gi-abdominal-wall.bilious-deterioration.v1]"
}
```

A fair harder version was assessed once and could not be completed from the supported facts. The archived key is not a current proposal. Reopening belongs to the manager with Melissa and the named specialty.

### question.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1

Status: **parked**. Original verdict REVISE; original difficulty easy; original two-step false. Revision passes 1.

Concrete response actions:

1. Accepted the explanation-versus-label discrepancy. A proposed expert-repeat label would need an actual technical difference that was not source-verified.
2. Removing nondiagnostic and the lower-tract foil would fix wording but leave upper-GI contrast a credible next study; it is not confined to bilious emesis.
3. Parked pending pediatric radiology selection of the exact acquisition failure, repeat technique and ranking. The fair biochemical-readiness node is separated and states its own diagnosis.

Indexed review notes and responses:
```json
[
  {
    "category": "clarityIssues",
    "index": 0,
    "reviewNote": "The explanation specifies 'expert targeted ultrasound,' but the answer label only specifies a repeat study. The case does not describe a changed acquisition approach that addresses the original gas limitation.",
    "disposition": "parked",
    "response": "Accepted the explanation-versus-label discrepancy. A proposed expert-repeat label would need an actual technical difference that was not source-verified."
  },
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "The report lists the study as nondiagnostic / Repeat targeted pyloric ultrasonography",
      "why": "An explicit failed-test conclusion and the same named anatomic target make repetition the obvious repair. The raw acquisition observations already establish the limitation; the interpretive label adds scaffolding."
    },
    "disposition": "parked",
    "response": "Removing nondiagnostic and the lower-tract foil would fix wording but leave upper-GI contrast a credible next study; it is not confined to bilious emesis."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "Repeat expert ultrasound is a reasonable preferred approach, but upper-GI contrast is also a clinically credible investigation after an inconclusive ultrasound in persistent nonbilious vomiting. It is not reserved for bilious vomiting. The candidate needs a clearer basis for ranking those paths; I am not asserting that the proposed key is clinically wrong.",
    "disposition": "parked",
    "response": "Parked pending pediatric radiology selection of the exact acquisition failure, repeat technique and ranking. The fair biochemical-readiness node is separated and states its own diagnosis."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "Contrast enema does not meaningfully compete for a gastric-outlet presentation. The item is mostly recognition of the usual first test plus a named adequacy problem.",
    "disposition": "parked",
    "response": "Accepted the explanation-versus-label discrepancy. A proposed expert-repeat label would need an actual technical difference that was not source-verified."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "This first node stands alone. Its explanation does not teach the subsequent metabolic-readiness answer.",
    "disposition": "parked",
    "response": "Removing nondiagnostic and the lower-tract foil would fix wording but leave upper-GI contrast a credible next study; it is not confined to bilious emesis."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Have clinical review settle the repeat-ultrasound versus contrast-study boundary for this exact acquisition failure and describe any decision-critical technical difference neutrally.",
    "disposition": "parked",
    "response": "Parked pending pediatric radiology selection of the exact acquisition failure, repeat technique and ranking. The fair biochemical-readiness node is separated and states its own diagnosis."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Keep the acquisition observations, remove the redundant 'nondiagnostic' teaching label if it adds no information, and replace the lower-tract foil with a credible competing investigation or strategy.",
    "disposition": "parked",
    "response": "Parked pending pediatric radiology selection of the exact acquisition failure, repeat technique and ranking. The fair biochemical-readiness node is separated and states its own diagnosis."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Explain why the closest contrast-study alternative is less appropriate here without implying it has no role in evaluating nonbilious obstruction.",
    "disposition": "parked",
    "response": "Parked pending pediatric radiology selection of the exact acquisition failure, repeat technique and ranking. The fair biochemical-readiness node is separated and states its own diagnosis."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.pyloric-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Liam Carter",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.pyloric-course.v1",
  "chiefComplaint": "Vomiting record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 6-week-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.pyloric-course.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Vomiting record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 6-week-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside records describe increasingly forceful nonbilious vomiting after feeds and falling weight.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Outside ultrasound acquisition",
      "value": "Bowel gas prevented sustained visualization of the pyloric channel; only intermittent still images were acquired. The report lists the study as nondiagnostic."
    },
    {
      "label": "Current examination",
      "value": "The abdomen remains soft. There has been no green emesis; IV fluids are being given for reduced urine output."
    }
  ]
}
```

Task: Which investigation should the outside team obtain next for {patientName}?

**key shown first for review only**

1. Repeat targeted pyloric ultrasonography **[KEY]**

Feedback: The prior acquisition did not adequately examine the suspected site. Progressive nonbilious vomiting and weight loss justify expert targeted ultrasound rather than treating that record as a negative examination.

2. Obtain an upper-GI contrast study

Feedback: Upper-GI contrast can answer a different obstructive question, but expert repeat ultrasound directly addresses this inadequately assessed pylorus and symptom pattern.

3. Obtain a water-soluble contrast enema

Feedback: A lower-tract contrast examination does not address the gastric-outlet pattern or repair the inadequate pyloric acquisition.

Explanation: The prior acquisition did not adequately examine the suspected site. Progressive nonbilious vomiting and weight loss justify expert targeted ultrasound rather than treating that record as a negative examination.

Evidence claims: claim.pediatric-gi-abdominal-wall.pyloric-evaluation, claim.pediatric-gi-abdominal-wall.pyloric-ultrasound, claim.pediatric-gi-abdominal-wall.bilious-contrast, claim.pediatric-gi-abdominal-wall.meconium-enema.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: parked; no executable scored key

```json
{
  "reviewedQuestionVariantId": "question.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1",
  "reviewedNodeId": "node.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1",
  "status": "parked",
  "reason": "The permitted local guideline supports expert review/repeat ultrasound but is overdue and does not establish a unique repeat-ultrasound-versus-upper-GI ranking for this exact gas-limited examination. A fair moderate item cannot retain a disputed key.",
  "attemptedRevision": "Considered a repeat examination explicitly performed by pediatric radiology after a changed acquisition approach, with upper-GI contrast and another upper-tract investigation. The needed technical intervention and third credible path were not verified; adding them would manufacture the ranking.",
  "clinicalReviewStatus": "needs_clinician_review",
  "keyState": "No current executable question or scored key; original reviewed v1 retained only in reviewInput.",
  "reopenOwner": "Manager with Melissa and the relevant pediatric specialist",
  "reviewInputPointer": "independentReviewFollowup.reviewInput.proposals[questionVariantId=question.pediatric-gi-abdominal-wall.pyloric-inadequate-ultrasound.v1]"
}
```

A fair harder version was assessed once and could not be completed from the supported facts. The archived key is not a current proposal. Reopening belongs to the manager with Melissa and the named specialty.

### question.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v1

Status: **revised**. Original verdict REVISE; original difficulty moderate; original two-step true. Revision passes 1.

Concrete response actions:

1. Removed the attempted milk feeds and oral trial together, so there is no ambiguous post-diagnosis feeding sequence.
2. The oral foil is replaced by an IV maintenance plan; all options now compare perioperative plans.
3. Preserved clinical-versus-biochemical recovery with substantial constructed values. Feedback explicitly avoids a universal reference-range anesthesia cutoff and asks Melissa to confirm the exact findings against current local practice.

Indexed review notes and responses:
```json
[
  {
    "category": "clarityIssues",
    "index": 0,
    "reviewNote": "Attempted milk feeds after ultrasound-confirmed obstruction and during preoperative correction are an awkward clinical sequence. The text does not say whether the feeding failure preceded confirmation.",
    "disposition": "revised",
    "response": "Removed the attempted milk feeds and oral trial together, so there is no ambiguous post-diagnosis feeding sequence."
  },
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "Vomiting recurs with attempted milk feeds / Defer pyloromyotomy for an oral rehydration trial",
      "why": "The exhibit directly defeats the oral route, leaving a two-option contest. That distractor is particularly weak after established mechanical outlet obstruction."
    },
    "disposition": "revised",
    "response": "The oral foil is replaced by an IV maintenance plan; all options now compare perioperative plans."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "The intended inference is meaningful: restored perfusion and normal potassium do not establish correction of the remaining chloride-depletion alkalosis. Further IV correction is the best offered plan on the intended reading.",
    "disposition": "revised",
    "response": "Preserved clinical-versus-biochemical recovery with substantial constructed values. Feedback explicitly avoids a universal reference-range anesthesia cutoff and asks Melissa to confirm the exact findings against current local practice."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "Reference-relative laboratory descriptions can be sufficient and do not require invented thresholds. Nevertheless, 'outside the reference range' should not be taught as a universal anesthesia cutoff; the explanation should remain tied to unresolved clinically meaningful alkalosis. No exact readiness criterion was independently verified in this offline review.",
    "disposition": "revised",
    "response": "Removed the attempted milk feeds and oral trial together, so there is no ambiguous post-diagnosis feeding sequence."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The later node independently states the diagnosis and treatment response, and the preceding ultrasound explanation does not give away the timing decision.",
    "disposition": "revised",
    "response": "The oral foil is replaced by an IV maintenance plan; all options now compare perioperative plans."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Clarify the feeding chronology or remove the milk-feed sentence and the oral-rehydration foil together.",
    "disposition": "revised",
    "response": "Preserved clinical-versus-biochemical recovery with substantial constructed values. Feedback explicitly avoids a universal reference-range anesthesia cutoff and asks Melissa to confirm the exact findings against current local practice."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Preserve the tension between clinical improvement and biochemical recovery, but compare credible perioperative plans instead of an oral trial for known obstruction.",
    "disposition": "revised",
    "response": "Preserved clinical-versus-biochemical recovery with substantial constructed values. Feedback explicitly avoids a universal reference-range anesthesia cutoff and asks Melissa to confirm the exact findings against current local practice."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Have Melissa confirm that the supplied laboratory description establishes a meaningful unresolved abnormality; use supported criteria if greater precision is necessary, not newly invented cutoffs.",
    "disposition": "revised",
    "response": "Preserved clinical-versus-biochemical recovery with substantial constructed values. Feedback explicitly avoids a universal reference-range anesthesia cutoff and asks Melissa to confirm the exact findings against current local practice."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.pyloric-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Liam Carter",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.pyloric-course.v1",
  "chiefComplaint": "Vomiting record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 6-week-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.pyloric-course.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Vomiting record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 6-week-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: A subsequent outside record confirms hypertrophic pyloric stenosis on expert ultrasound. {patientName} has received IV resuscitation.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Clinical response",
      "value": "Peripheral perfusion and urine output have recovered. Vomiting recurs with attempted milk feeds."
    },
    {
      "label": "Current laboratory record",
      "value": "Sodium and potassium are within their reference ranges. Chloride remains below its reference range; pH and bicarbonate remain above their reference ranges."
    }
  ]
}
```

Task: Which operative-timing plan is best supported by {patientName}'s current record?

**key shown first for review only**

1. Defer pyloromyotomy for further metabolic correction **[KEY]**

Feedback: Recovered perfusion and normal sodium/potassium do not establish correction of chloride-depletion alkalosis. Continue IV correction and reassess the biochemical state before pyloromyotomy.

2. Proceed to pyloromyotomy during maintenance fluids

Feedback: The persisting chloride and acid-base abnormalities remain a preoperative problem despite normal potassium and improved urine output.

3. Defer pyloromyotomy for an oral rehydration trial

Feedback: Recurrent vomiting with milk feeds and established outlet obstruction do not support relying on oral replacement to complete correction.

Explanation: Recovered perfusion and normal sodium/potassium do not establish correction of chloride-depletion alkalosis. Continue IV correction and reassess the biochemical state before pyloromyotomy.

Evidence claims: claim.pediatric-gi-abdominal-wall.pyloric-correction, claim.pediatric-gi-abdominal-wall.pyloric-definitive, claim.pediatric-gi-abdominal-wall.pyloric-evaluation.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: revised exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis-standalone.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Liam Carter",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis-standalone.v2",
  "chiefComplaint": "Vomiting record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 6-week-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis-standalone.v2",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Vomiting record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 6-week-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside pediatric surgical record confirms hypertrophic pyloric stenosis by ultrasound. He remains on gastric decompression after initial IV resuscitation; nonbilious gastric losses continue.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Response to resuscitation",
      "value": "Peripheral perfusion and urine output have recovered."
    },
    {
      "label": "Current laboratory results",
      "value": "Sodium 138 mmol/L; potassium 4.1 mmol/L; chloride 83 mmol/L; bicarbonate 39 mmol/L; venous pH 7.55."
    }
  ]
}
```

Task: Which perioperative plan is most appropriate for {patientName} now?

**key shown first for review only**

1. Continue IV correction before pyloromyotomy **[KEY]**

Feedback: The chloride and acid-base values show substantial unresolved chloride-depletion alkalosis despite the improved circulation and potassium. Continue directed IV correction and replacement of losses before anesthesia.

2. Begin pyloromyotomy during IV correction

Feedback: Definitive repair is needed, but beginning now treats recovered perfusion and normal potassium as sufficient while substantial alkalosis remains. This is not an arbitrary rule that any reference-range deviation forbids anesthesia.

3. Continue IV maintenance before pyloromyotomy

Feedback: Waiting on maintenance fluid without actively correcting the remaining deficit and replacing continuing gastric losses does not address the reason to defer repair. No particular fluid prescription or dose is being scored.

Explanation: The chloride and acid-base values show substantial unresolved chloride-depletion alkalosis despite the improved circulation and potassium. Continue directed IV correction and replacement of losses before anesthesia.

Evidence claims: claim.pediatric-gi-abdominal-wall.pyloric-correction, claim.pediatric-gi-abdominal-wall.pyloric-definitive.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "Interpret the raw chloride, bicarbonate and pH together as persistent chloride-depletion alkalosis despite restored circulation and potassium.",
  "decision": "Select further directed correction before anesthesia rather than proceeding after partial recovery or merely waiting on maintenance fluid.",
  "closestCredibleError": "Begin pyloromyotomy after normal potassium and recovered urine output.",
  "decidingObservation": "Chloride 83 mmol/L, bicarbonate 39 mmol/L and pH 7.55 persist while ongoing gastric losses continue.",
  "consequenceOfError": "The unresolved metabolic problem would be carried into anesthesia, or persist if maintenance is substituted for correction.",
  "deletionTest": "Removing the acid-base results removes the reason to defer. Removing recovered perfusion and potassium eliminates the credible premature-readiness trap. Continuing gastric loss distinguishes active replacement from passive maintenance.",
  "counterfactual": "If reassessment instead showed restored hydration with chloride and acid-base values corrected and losses appropriately replaced, begin pyloromyotomy becomes the best offered plan.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2.operate"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "Removed the milk-feed chronology and oral-rehydration foil. Three similarly scoped perioperative plans differ by correction versus operation versus maintenance; the key does not uniquely name a safe setting or specialist.",
  "oneStageAndCategory": "All choices concern the current preoperative fluid-and-operation plan after established pyloric stenosis, with decompression common to all.",
  "twoConsequentialSteps": "Interpret the raw chloride, bicarbonate and pH together as persistent chloride-depletion alkalosis despite restored circulation and potassium. Then Select further directed correction before anesthesia rather than proceeding after partial recovery or merely waiting on maintenance fluid.",
  "residentDifficulty": "Predicted moderate: normal potassium and restored circulation compete with substantial remaining alkalosis; maintenance is a credible incomplete correction error.",
  "oneBestAnswer": "Chloride 83 mmol/L, bicarbonate 39 mmol/L and pH 7.55 persist while ongoing gastric losses continue. Counterfactual: If reassessment instead showed restored hydration with chloride and acid-base values corrected and losses appropriately replaced, begin pyloromyotomy becomes the best offered plan.",
  "sequenceAndFiniteProfileAttack": "Standalone named 6-week-old male outside-hospital record review. No prior answer, later episode or feedback is displayed; one finite profile preserves the constrained age and sex.",
  "repairAndRecheck": "Changed vaguely reference-relative abnormalities to explicitly constructed substantial values. Re-solved the corrected-laboratory counterfactual without teaching any universal numerical anesthesia threshold.",
  "remainingRisk": "Exact values are fictional patient results, not readiness cutoffs. Existing local sources are overdue; Melissa and pediatric anesthesia must confirm this exact degree of abnormality and current local correction practice.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Revised once for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2.correct",
    "label": "Continue IV correction before pyloromyotomy",
    "rationale": "The chloride and acid-base values show substantial unresolved chloride-depletion alkalosis despite the improved circulation and potassium. Continue directed IV correction and replacement of losses before anesthesia.",
    "temptation": "Recognize that initial circulatory improvement is not the full preoperative endpoint.",
    "correctUnder": "Clinically meaningful chloride-depletion alkalosis remains after initial resuscitation.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.pyloric-correction"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2.operate",
    "label": "Begin pyloromyotomy during IV correction",
    "rationale": "Definitive repair is needed, but beginning now treats recovered perfusion and normal potassium as sufficient while substantial alkalosis remains. This is not an arbitrary rule that any reference-range deviation forbids anesthesia.",
    "temptation": "Prioritize definitive relief once circulation and potassium improve.",
    "correctUnder": "Hydration and the clinically important electrolyte and acid-base disturbances have also been corrected.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.pyloric-correction",
      "claim.pediatric-gi-abdominal-wall.pyloric-definitive"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2.maintenance",
    "label": "Continue IV maintenance before pyloromyotomy",
    "rationale": "Waiting on maintenance fluid without actively correcting the remaining deficit and replacing continuing gastric losses does not address the reason to defer repair. No particular fluid prescription or dose is being scored.",
    "temptation": "Assume time on maintenance fluid will substitute for deficit and loss correction.",
    "correctUnder": "Preoperative correction is complete and maintenance support is appropriate while awaiting the planned operation.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.pyloric-correction"
    ],
    "timingProfileId": null
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.pyloric-correction",
    "claim.pediatric-gi-abdominal-wall.pyloric-definitive"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.pyloric-correction",
    "claim.pediatric-gi-abdominal-wall.pyloric-definitive"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.pyloric-correction",
    "claim.pediatric-gi-abdominal-wall.pyloric-definitive"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2.correct",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.pyloric-correction"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2.operate",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.pyloric-correction",
        "claim.pediatric-gi-abdominal-wall.pyloric-definitive"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2.maintenance",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.pyloric-correction"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.pyloric-correction",
    "claim.pediatric-gi-abdominal-wall.pyloric-definitive"
  ]
}
```

Constructed data policy: Age, chronology, reported measurements, examinations and responses are fictional patient observations, not empirical cutoffs, probabilities or demographic weights.

Exact current snapshot hashes:
```json
{
  "node": "2a42d431216455da6f93c5d5b3745f801729993e318c23a30b744a749d41b075",
  "question": "d02d1d82656f5e7f0a040054e78e25be0afb8eeed00372a515443834729edb49",
  "clinicalCase": "6488d3ba191aa7e4734c31607bd945e5388bf3578032921ff714ad9109aa9772"
}
```

### question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1

Status: **pass-preserved**. Original verdict PASS; original difficulty moderate; original two-step true. Revision passes 0.

Concrete response actions:

1. Preserve the exact independent-PASS clinical wording, choices, feedback, header and finite profile; do not apply optional copyedits.
2. Retain original complete reviewed objects and hashes. Only the two extracted standalone wrappers receive mandatory neutral final-answer metadata.
3. Remove all future/parked companion content; editorial PASS remains separate from named clinical approval.

Indexed review notes and responses:
```json
[
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "The child has residual ileocolic disease, meaningful movement during the first enema, and preserved perfusion without guarding or perforation. Those observations support a repeat attempt over either assuming resolution or immediately treating the first partial reduction as definitive failure.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "Two consequential judgments remain: distinguish incomplete but productive reduction from failure without progress, then apply the current safety findings despite the adverse fluid finding. Trapped fluid is clinically relevant evidence, not a nonmedical wording shortcut.",
    "disposition": "pass-preserved",
    "response": "No later episode or feedback is included in the standalone case. Editorial PASS remains separate from named clinical approval."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "Older age deserves lead-point awareness but does not by itself make repeat enema wrong. No lead point is supplied in this first episode; the later mass must not be used retrospectively to answer this node.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "fairness",
    "index": 3,
    "reviewNote": "The node stands alone. Its explanation supports considering repeat reduction rather than promising success or imposing a fabricated number of attempts. This is editorial PASS only, not clinical approval.",
    "disposition": "pass-preserved",
    "response": "No later episode or feedback is included in the standalone case. Editorial PASS remains separate from named clinical approval."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Optional copyedit: change 'a 8-year-old girl' to 'an 8-year-old girl.' Preserve the clinically meaningful progress and safety observations.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Keep the later recurrent episode and its structural finding out of this node's pre-answer display.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.intussusception-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Sofia Reed",
  "prototypeDemographics": {
    "ageYears": 8,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.intussusception-course.v1",
  "chiefComplaint": "Hospital course review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 8-year-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.intussusception-course.v1",
      "prototypeDemographics": {
        "ageYears": 8,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Hospital course review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 8-year-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: The founder reviews {patientName}'s outside admission for ileocolic intussusception. She has received IV fluids and is under pediatric surgical observation.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Initial study",
      "value": "Ultrasound confirmed ileocolic intussusception with a small amount of fluid between the bowel layers."
    },
    {
      "label": "Reduction record",
      "value": "The enema advanced the leading edge from the transverse colon toward the cecum, but residual intussusception remains. No perforation occurred."
    },
    {
      "label": "Reassessment",
      "value": "She is well perfused and comfortable between cramps. The abdomen is soft without guarding."
    }
  ]
}
```

Task: Which next plan is most appropriate for {patientName} after the first reduction attempt?

**key shown first for review only**

1. Attempt a delayed repeat image-guided enema **[KEY]**

Feedback: Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.

2. Proceed to operative reduction now

Feedback: Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.

3. Observe for spontaneous completion of reduction

Feedback: Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.

Explanation: Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.

Evidence claims: claim.pediatric-gi-abdominal-wall.intussusception-risk, claim.pediatric-gi-abdominal-wall.intussusception-repeat, claim.pediatric-gi-abdominal-wall.intussusception-operation, claim.pediatric-gi-abdominal-wall.intussusception-transient.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: pass-preserved exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-standalone.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Sofia Reed",
  "prototypeDemographics": {
    "ageYears": 8,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.intussusception-partial-progress-standalone.v1",
  "chiefComplaint": "Hospital course review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 8-year-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.intussusception-partial-progress-standalone.v1",
      "prototypeDemographics": {
        "ageYears": 8,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Hospital course review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 8-year-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: The founder reviews {patientName}'s outside admission for ileocolic intussusception. She has received IV fluids and is under pediatric surgical observation.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Initial study",
      "value": "Ultrasound confirmed ileocolic intussusception with a small amount of fluid between the bowel layers."
    },
    {
      "label": "Reduction record",
      "value": "The enema advanced the leading edge from the transverse colon toward the cecum, but residual intussusception remains. No perforation occurred."
    },
    {
      "label": "Reassessment",
      "value": "She is well perfused and comfortable between cramps. The abdomen is soft without guarding."
    }
  ]
}
```

Task: Which next plan is most appropriate for {patientName} after the first reduction attempt?

**key shown first for review only**

1. Attempt a delayed repeat image-guided enema **[KEY]**

Feedback: Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.

2. Proceed to operative reduction now

Feedback: Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.

3. Observe for spontaneous completion of reduction

Feedback: Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.

Explanation: Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.

Evidence claims: claim.pediatric-gi-abdominal-wall.intussusception-risk, claim.pediatric-gi-abdominal-wall.intussusception-repeat, claim.pediatric-gi-abdominal-wall.intussusception-operation, claim.pediatric-gi-abdominal-wall.intussusception-transient.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "Interpret partial anatomical progress and trapped fluid separately: residual disease remains, but a risk predictor does not itself prohibit another enema.",
  "decision": "Combine progress with the current stable examination to choose a delayed repeat attempt instead of mandatory surgery or passive observation.",
  "closestCredibleError": "Operate immediately because trapped fluid and incomplete reduction are overread as absolute failure.",
  "decidingObservation": "The leading edge moved substantially and she remains well perfused without guarding.",
  "consequenceOfError": "The repeat attempt is reasonable, not compulsory. A clinician must confirm the local radiology/surgery decision and quality of the closest operative alternative.",
  "deletionTest": "Deleting progress removes the main reason to prefer a repeat attempt; deleting the reassessment leaves the safety of another enema unresolved.",
  "counterfactual": "If the leading edge had not moved and she developed guarding or poor perfusion, operative reduction becomes the best offered plan.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "No phrase eligible for another enema appears before options. The key is not longest or uniquely comprehensive; the procedure estimate is scoped to image-guided reduction, not proof of gameplay execution.",
  "oneStageAndCategory": "Three management plans for residual ileocolic intussusception at the same post-attempt stage.",
  "twoConsequentialSteps": "Interpret partial anatomical progress and trapped fluid separately: residual disease remains, but a risk predictor does not itself prohibit another enema. Then Combine progress with the current stable examination to choose a delayed repeat attempt instead of mandatory surgery or passive observation.",
  "residentDifficulty": "Predicted moderate/hard: partial technical progress competes with two concerning findings rather than a simple stable-versus-shock recognition item.",
  "oneBestAnswer": "The leading edge moved substantially and she remains well perfused without guarding. Counterfactual: If the leading edge had not moved and she developed guarding or poor perfusion, operative reduction becomes the best offered plan.",
  "sequenceAndFiniteProfileAttack": "The header uses a known diagnosis for a management task; it does not reveal the later structural lesion.",
  "repairAndRecheck": "Removed a draft statement calling the first attempt a failure; retained the observed movement and remaining disease, then re-solved the options.",
  "remainingRisk": "The repeat attempt is reasonable, not compulsory. A clinician must confirm the local radiology/surgery decision and quality of the closest operative alternative.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Draft for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "label": "Attempt a delayed repeat image-guided enema",
    "rationale": "Substantial partial progress with ongoing stability supports considering a delayed repeat enema. Trapped fluid may lower success but does not independently prohibit nonoperative reduction.",
    "temptation": "Distinguish a risk predictor from an absolute contraindication.",
    "correctUnder": "Stable partial reduction without peritonitis or perforation.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.intussusception-risk",
      "claim.pediatric-gi-abdominal-wall.intussusception-repeat"
    ],
    "timingProfileId": "timing.test.combined_diagnostic",
    "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat"
  },
  {
    "label": "Proceed to operative reduction now",
    "rationale": "Immediate operation becomes more compelling with deterioration, perforation or persistent failure without a reasonable repeat opportunity; this first attempt made progress while she remains stable.",
    "temptation": "Treat any first incomplete enema or trapped fluid as a mandatory operation.",
    "correctUnder": "Persistent failed reduction or newly concerning examination/perfusion findings.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
      "claim.pediatric-gi-abdominal-wall.intussusception-operation"
    ],
    "timingProfileId": null,
    "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate"
  },
  {
    "label": "Observe for spontaneous completion of reduction",
    "rationale": "Documented residual ileocolic intussusception with continuing cramps needs an active reduction plan rather than assuming the transient small-bowel pattern.",
    "temptation": "Mistake partial improvement for completed reduction.",
    "correctUnder": "A transient small-bowel intussusception that has resolved on reassessment rather than residual ileocolic disease.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
      "claim.pediatric-gi-abdominal-wall.intussusception-operation",
      "claim.pediatric-gi-abdominal-wall.intussusception-transient"
    ],
    "timingProfileId": null,
    "id": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe"
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.intussusception-risk",
    "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
    "claim.pediatric-gi-abdominal-wall.intussusception-operation",
    "claim.pediatric-gi-abdominal-wall.intussusception-transient"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.intussusception-risk",
    "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
    "claim.pediatric-gi-abdominal-wall.intussusception-operation",
    "claim.pediatric-gi-abdominal-wall.intussusception-transient"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.intussusception-risk",
    "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
    "claim.pediatric-gi-abdominal-wall.intussusception-operation",
    "claim.pediatric-gi-abdominal-wall.intussusception-transient"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.intussusception-risk",
        "claim.pediatric-gi-abdominal-wall.intussusception-repeat"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
        "claim.pediatric-gi-abdominal-wall.intussusception-operation"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
        "claim.pediatric-gi-abdominal-wall.intussusception-operation",
        "claim.pediatric-gi-abdominal-wall.intussusception-transient"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.intussusception-risk",
    "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
    "claim.pediatric-gi-abdominal-wall.intussusception-operation",
    "claim.pediatric-gi-abdominal-wall.intussusception-transient"
  ]
}
```

Constructed data policy: Age, chronology, reported measurements, examinations and responses are fictional patient observations, not empirical cutoffs, probabilities or demographic weights.

Exact current snapshot hashes:
```json
{
  "node": "16fd05ec4a715877dd2a31327e3172db6f0837f5896a963ccba825e9d1e883ca",
  "question": "0e88e5dc1d6c129f560c8e888d14e22b83a5d347029dd6761342c2e6d58d81c2",
  "clinicalCase": "3ef0989060c59e2fadcd59929e0281e626103b0dd18918773eeee89488f77591"
}
```

PASS preservation and required standalone composition metadata:
```json
{
  "reviewedNodeSha256": "c0533450a47c1aaf59a65168ec4125c9e5f5cdf9d765443223d21393062fe34c",
  "reviewedQuestionSha256": "0e88e5dc1d6c129f560c8e888d14e22b83a5d347029dd6761342c2e6d58d81c2",
  "visibleHeaderAndProfile": "Exact original presentation, complaint, age, sex and finite-profile content retained. Case identity/profile identity changes only for standalone extraction; authored PASS wording and clinical node fields and question objects are unchanged.",
  "splitFromCaseId": "case.pediatric-gi-abdominal-wall.intussusception-course.v1",
  "wrapperChanges": [
    "Case and presentation/profile identities for standalone extraction",
    "Remove the parked companion from decisionNodes and learningSummary",
    "Add only required neutral no_terminal_outcome metadata to wrong final choices, copying unchanged reviewed rationale and sourceLabels"
  ],
  "preservationScope": "Exact original complete node and question snapshots preserved; standalone node is identical after excluding only terminalDispositions. No PASS clinical wording, answer label, exhibit, rationale, explanation or visible header/profile text changed.",
  "currentQuestionSha256": "0e88e5dc1d6c129f560c8e888d14e22b83a5d347029dd6761342c2e6d58d81c2",
  "originalFullNodeSha256": "c0533450a47c1aaf59a65168ec4125c9e5f5cdf9d765443223d21393062fe34c",
  "currentClinicalNodeSha256": "e31ade04048cc044b79e31feab8221fb856a1a9273452f93e82a9e556f68dc98",
  "reviewedClinicalNodeSha256": "e31ade04048cc044b79e31feab8221fb856a1a9273452f93e82a9e556f68dc98"
}
```

### question.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1

Status: **parked**. Original verdict REVISE; original difficulty easy; original two-step false. Revision passes 1.

Concrete response actions:

1. Accepted both cue findings: repeated nonprogress makes another enema weak, and only the key addresses the structural lesion with a second action. No further nonprogress detail was added to pretend difficulty.
2. Preserved the full between-episode chronology and current symptoms in the archived input. A lead-point operation alone remains easy despite clinically sound teaching.
3. Parked the companion. Split the reviewed PASS partial-progress node into a standalone case, retaining exact wording including its original header grammar; no later mass is shown.

Indexed review notes and responses:
```json
[
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "Two separate image-guided sessions produced no movement / Attempt another delayed image-guided enema",
      "why": "The option repeats an explicitly ineffective intervention. Coupled with persistent symptoms, this supports a generic 'do something different' shortcut."
    },
    "disposition": "parked",
    "response": "Preserved the full between-episode chronology and current symptoms in the archived input. A lead-point operation alone remains easy despite clinically sound teaching."
  },
  {
    "category": "cues",
    "index": 1,
    "reviewNote": {
      "phrase": "a discrete intraluminal mass that moves with the leading edge / Perform operative reduction and assess the lead point",
      "why": "Only the key offers to address the newly introduced structural finding and contains a second action. The other plans do not engage that finding."
    },
    "disposition": "parked",
    "response": "Preserved the full between-episode chronology and current symptoms in the archived input. A lead-point operation alone remains easy despite clinically sound teaching."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "Operation with assessment of the structural lesion is the best offered answer. The explanation appropriately grounds the decision in persistent failure and anatomy rather than age or recurrence alone.",
    "disposition": "parked",
    "response": "Parked the companion. Split the reviewed PASS partial-progress node into a standalone case, retaining exact wording including its original header grammar; no later mass is shown."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "Failure without progress and an apparent lead point both point to the same intervention; against these options they do not create two independent consequential steps. Passive observation is not a credible competitor for this symptomatic persistent ileocolic obstruction.",
    "disposition": "parked",
    "response": "Accepted both cue findings: repeated nonprogress makes another enema weak, and only the key addresses the structural lesion with a second action. No further nonprogress detail was added to pretend difficulty."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "Chronology is coherent: full reduction occurred between episodes, and the current failure is explicitly described. The node stands alone, but the preceding explanation has already emphasized that partial progress supports another enema; reversing that taught feature makes this follow-up easier.",
    "disposition": "parked",
    "response": "Preserved the full between-episode chronology and current symptoms in the archived input. A lead-point operation alone remains easy despite clinically sound teaching."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Test a distinct clinically consequential decision after failed reduction, with plausible competing plans and the findings needed to distinguish them, or explicitly seek an accepted easy reinforcement role.",
    "disposition": "parked",
    "response": "Parked the companion. Split the reviewed PASS partial-progress node into a standalone case, retaining exact wording including its original header grammar; no later mass is shown."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Avoid making the key uniquely comprehensive. Do not weaken or conceal genuine failed-reduction findings just to make further enemas appear attractive.",
    "disposition": "parked",
    "response": "Parked the companion. Split the reviewed PASS partial-progress node into a standalone case, retaining exact wording including its original header grammar; no later mass is shown."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Copyedit 'a 8-year-old girl' to 'an 8-year-old girl.'",
    "disposition": "parked",
    "response": "Parked the companion. Split the reviewed PASS partial-progress node into a standalone case, retaining exact wording including its original header grammar; no later mass is shown."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.intussusception-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Sofia Reed",
  "prototypeDemographics": {
    "ageYears": 8,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.intussusception-course.v1",
  "chiefComplaint": "Hospital course review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 8-year-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.intussusception-course.v1",
      "prototypeDemographics": {
        "ageYears": 8,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Hospital course review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 8-year-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: A later outside admission documents recurrent pain after {patientName} had previously achieved full enema reduction.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Current ultrasound",
      "value": "Ileocolic intussusception persists around a discrete intraluminal mass that moves with the leading edge."
    },
    {
      "label": "Current reduction course",
      "value": "Two separate image-guided sessions produced no movement of the leading edge. Cramping and vomiting continue despite resuscitation; the abdomen remains soft and she is well perfused."
    }
  ]
}
```

Task: Which plan should the outside team select for {patientName} during this admission?

**key shown first for review only**

1. Perform operative reduction and assess the lead point **[KEY]**

Feedback: Persistent unreduced disease despite reasonable attempts plus a structural lead point supports operative assessment. The reason is ongoing failure and anatomy, rather than recurrence or age by itself.

2. Attempt another delayed image-guided enema

Feedback: A repeat was reasonable in the earlier course because the leading edge moved. Current separate attempts have not moved it, and a structural lesion remains.

3. Observe with repeat abdominal examinations

Feedback: Hemodynamic stability does not demonstrate reduction or remove the symptomatic lead point. Observation leaves the current mechanical problem unresolved.

Explanation: Persistent unreduced disease despite reasonable attempts plus a structural lead point supports operative assessment. The reason is ongoing failure and anatomy, rather than recurrence or age by itself.

Evidence claims: claim.pediatric-gi-abdominal-wall.intussusception-operation, claim.pediatric-gi-abdominal-wall.intussusception-repeat.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: parked; no executable scored key

```json
{
  "reviewedQuestionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1",
  "reviewedNodeId": "node.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1",
  "status": "parked",
  "reason": "Persistent failed reduction and an apparent lead point both indicate operative assessment; the original options create easy escalation, not two consequential judgments. A more specific operative choice cannot be fairly keyed without lesion, bowel viability and procedural evidence beyond this record.",
  "attemptedRevision": "Considered comparing operative reduction with focal lead-point treatment, immediate segmental resection and another enema. The first two overlap or depend on unsupplied lesion/viability findings; repeated failed enemas remain an unfair foil.",
  "clinicalReviewStatus": "needs_clinician_review",
  "keyState": "No current executable question or scored key; original reviewed v1 retained only in reviewInput.",
  "reopenOwner": "Manager with Melissa and the relevant pediatric specialist",
  "reviewInputPointer": "independentReviewFollowup.reviewInput.proposals[questionVariantId=question.pediatric-gi-abdominal-wall.intussusception-leadpoint-failure.v1]"
}
```

A fair harder version was assessed once and could not be completed from the supported facts. The archived key is not a current proposal. Reopening belongs to the manager with Melissa and the named specialty.

### question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v1

Status: **revised**. Original verdict REVISE; original difficulty easy; original two-step false. Revision passes 1.

Concrete response actions:

1. Removed the adequate-submucosa wording from the key and made the task neutral. The new specimen composition is explicit raw information rather than a predeclared inadequacy.
2. The specimen-status inference now changes the next investigation: existing adequate tissue gets further histology; a superficial counterfactual gets a new specimen. New scored meaning receives a new concept ID with its predecessor recorded.
3. No age-specific biopsy technique is keyed. The 2026 ERNICA recommendation for further histologic evaluation and calretinin was rechecked; the original v1 remains archived rather than silently changed.

Indexed review notes and responses:
```json
[
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "no submucosa / Repeat rectal biopsy with adequate submucosa",
      "why": "The key literally supplies the named missing tissue. A reader does not need to know where ganglion cells are assessed to choose the option that repairs the explicitly stated omission."
    },
    "disposition": "revised",
    "response": "The specimen-status inference now changes the next investigation: existing adequate tissue gets further histology; a superficial counterfactual gets a new specimen. New scored meaning receives a new concept ID with its predecessor recorded."
  },
  {
    "category": "cues",
    "index": 1,
    "reviewNote": {
      "phrase": "establish Ava Morgan's diagnosis before definitive surgery",
      "why": "The definitive-diagnosis wording strongly favors histology over contrast imaging or physiology. A resident can select biopsy without interpreting this particular specimen."
    },
    "disposition": "revised",
    "response": "The specimen-status inference now changes the next investigation: existing adequate tissue gets further histology; a superficial counterfactual gets a new specimen. New scored meaning receives a new concept ID with its predecessor recorded."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "The specimen cannot establish aganglionosis simply because no ganglion cells were found in tissue lacking submucosa. Representative rectal histology is the best offered confirmatory test; the nondiagnostic enema does not exclude disease.",
    "disposition": "revised",
    "response": "No age-specific biopsy technique is keyed. The 2026 ERNICA recommendation for further histologic evaluation and calretinin was rechecked; the original v1 remains archived rather than silently changed."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "The explanation is appropriately limited and does not equate the superficial result with a negative adequate biopsy. The problem is the bypassable reasoning, not a confident clinical inaccuracy.",
    "disposition": "revised",
    "response": "Removed the adequate-submucosa wording from the key and made the task neutral. The new specimen composition is explicit raw information rather than a predeclared inadequacy."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The initial node stands alone. Its explanation does not disclose the later postoperative mechanical-assessment answer.",
    "disposition": "revised",
    "response": "The specimen-status inference now changes the next investigation: existing adequate tissue gets further histology; a superficial counterfactual gets a new specimen. New scored meaning receives a new concept ID with its predecessor recorded."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Remove 'with adequate submucosa' from the pre-answer label and keep the tissue requirement in feedback; retain the actual specimen composition in the exhibit.",
    "disposition": "revised",
    "response": "No age-specific biopsy technique is keyed. The 2026 ERNICA recommendation for further histologic evaluation and calretinin was rechecked; the original v1 remains archived rather than silently changed."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Use a neutral next-investigation task and a specimen-status decision that genuinely changes which investigation is justified, rather than asking the standard confirmatory test irrespective of the specimen.",
    "disposition": "revised",
    "response": "No age-specific biopsy technique is keyed. The 2026 ERNICA recommendation for further histologic evaluation and calretinin was rechecked; the original v1 remains archived rather than silently changed."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Have clinical review specify the appropriate repeat sampling approach for this older child if procedure selection is intended; do not invent a depth or age threshold.",
    "disposition": "revised",
    "response": "No age-specific biopsy technique is keyed. The 2026 ERNICA recommendation for further histologic evaluation and calretinin was rechecked; the original v1 remains archived rather than silently changed."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.hscr-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Ava Morgan",
  "prototypeDemographics": {
    "ageYears": 7,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.hscr-course.v1",
  "chiefComplaint": "Bowel record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 7-year-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.hscr-course.v1",
      "prototypeDemographics": {
        "ageYears": 7,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Bowel record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 7-year-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside records describe constipation beginning in early infancy, recurrent distension and poor weight gain.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Contrast examination",
      "value": "The colon is dilated; the radiologist could not identify a definite transition zone."
    },
    {
      "label": "Rectal specimen",
      "value": "A posterior rectal sample taken 3 cm above the dentate line contains mucosa with scant muscularis mucosae and no submucosa. No ganglion cells are identified."
    }
  ]
}
```

Task: Which investigation should establish {patientName}'s diagnosis before definitive surgery?

**key shown first for review only**

1. Repeat rectal biopsy with adequate submucosa **[KEY]**

Feedback: The absence of ganglion cells in tissue that lacks submucosa cannot establish aganglionosis. Obtain representative histology; the nondiagnostic contrast study neither proves nor excludes Hirschsprung disease.

2. Repeat contrast enema with delayed imaging

Feedback: A more complete anatomical study may be useful for planning, but cannot replace representative histology before establishing this diagnosis.

3. Obtain anorectal manometry with reflex testing

Feedback: Manometry can guide suspicion, but does not substitute for the representative rectal histology required before definitive surgery in this record.

Explanation: The absence of ganglion cells in tissue that lacks submucosa cannot establish aganglionosis. Obtain representative histology; the nondiagnostic contrast study neither proves nor excludes Hirschsprung disease.

Evidence claims: claim.pediatric-gi-abdominal-wall.hscr-biopsy, claim.pediatric-gi-abdominal-wall.hscr-contrast-limit, claim.pediatric-gi-abdominal-wall.hscr-functional.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: revised exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.hscr-superficial-biopsy-standalone.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.hscr-rectal-histology-completion.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Ava Morgan",
  "prototypeDemographics": {
    "ageYears": 7,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.hscr-superficial-biopsy-standalone.v2",
  "chiefComplaint": "Bowel record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 7-year-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.hscr-superficial-biopsy-standalone.v2",
      "prototypeDemographics": {
        "ageYears": 7,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Bowel record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 7-year-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside records describe constipation since early infancy, distension and poor weight gain. The pediatric team is reviewing her rectal biopsy before selecting the next investigation.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Rectal specimen record",
      "value": "The posterior rectal specimen was taken 3 cm above the dentate line. It contains mucosa and broad submucosa; the paraffin block remains available."
    },
    {
      "label": "Initial pathology",
      "value": "No ganglion cells are identified on the initial H&E sections. Ancillary stains have not been performed."
    }
  ]
}
```

Task: Which diagnostic step should the outside team select next for {patientName}?

**key shown first for review only**

1. Obtain expert histology with calretinin studies **[KEY]**

Feedback: Representative tissue is already present. An initial H&E report without identified ganglion cells requires further expert histologic evaluation, including ancillary methods, before it is treated as confirmation of aganglionosis.

2. Obtain a new rectal biopsy specimen

Feedback: A new sample would address a tissue-acquisition problem, but the current specimen already contains submucosa at a relevant site. Initial H&E nonvisualization does not by itself establish that new sampling is the next step.

3. Obtain anorectal manometry with reflex testing

Feedback: Physiology may contribute to evaluation, but it does not settle the interpretation of the representative biopsy already obtained. Finish the histologic assessment rather than substitute a reflex result for it.

Explanation: Representative tissue is already present. An initial H&E report without identified ganglion cells requires further expert histologic evaluation, including ancillary methods, before it is treated as confirmation of aganglionosis.

Evidence claims: claim.pediatric-gi-abdominal-wall.hscr-biopsy, claim.pediatric-gi-abdominal-wall.hscr-histology-completion, claim.pediatric-gi-abdominal-wall.hscr-contrast-limit, claim.pediatric-gi-abdominal-wall.postoperative-test-purpose.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "The specimen contains the needed tissue; an initial H&E nonvisualization is not the same problem as absent submucosa.",
  "decision": "Complete expert histologic evaluation on the existing material before repeating acquisition or switching to physiology.",
  "closestCredibleError": "Repeat rectal biopsy because no ganglion cells were identified on the initial sections.",
  "decidingObservation": "Broad submucosa is represented and the paraffin block is retained, while ancillary work remains undone.",
  "consequenceOfError": "Unnecessary repeat sampling or a premature aganglionosis conclusion could follow.",
  "deletionTest": "Removing tissue composition makes review versus resampling ambiguous. Removing the initial H&E status removes the reason for further histology. Removing longstanding symptoms removes the reason for the invasive diagnostic pathway.",
  "counterfactual": "If the same initial report came from mucosa and muscularis mucosae without submucosa, a new rectal biopsy specimen becomes the best offered plan.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.biopsy"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "Removed the missing-tissue-to-adequate-tissue label match and the definitive-diagnosis task. The exhibit now changes specimen status; the key names a real histologic investigation rather than announcing adequacy.",
  "oneStageAndCategory": "All three are diagnostic steps during unresolved Hirschsprung evaluation; no operation or treatment competes with a premature information-gathering choice.",
  "twoConsequentialSteps": "The specimen contains the needed tissue; an initial H&E nonvisualization is not the same problem as absent submucosa. Then Complete expert histologic evaluation on the existing material before repeating acquisition or switching to physiology.",
  "residentDifficulty": "Predicted moderate: a resident must distinguish tissue representation from interpretation completeness instead of reflexively repeating any negative-cell specimen.",
  "oneBestAnswer": "Broad submucosa is represented and the paraffin block is retained, while ancillary work remains undone. Counterfactual: If the same initial report came from mucosa and muscularis mucosae without submucosa, a new rectal biopsy specimen becomes the best offered plan.",
  "sequenceAndFiniteProfileAttack": "Standalone named 7-year-old female outside-hospital record review. No prior answer, later episode or feedback is displayed; one finite profile preserves the constrained age and sex.",
  "repairAndRecheck": "Re-solved with absent submucosa: repeat sampling wins. Expert histology is preferred only with the stated site, broad represented submucosa and retained material. Procedure choice for repeat sampling is not scored.",
  "remainingRisk": "Current ERNICA supports histologic completion. Melissa must verify that the constructed specimen and initial reading justify the exact review-versus-resampling ranking; no stain is sufficient without appropriate tissue.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Revised once for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.histology",
    "label": "Obtain expert histology with calretinin studies",
    "rationale": "Representative tissue is already present. An initial H&E report without identified ganglion cells requires further expert histologic evaluation, including ancillary methods, before it is treated as confirmation of aganglionosis.",
    "temptation": "Complete the interpretation of represented tissue rather than equate initial nonvisualization with a final diagnosis.",
    "correctUnder": "Appropriately sited tissue with submucosa remains available for histologic completion.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
      "claim.pediatric-gi-abdominal-wall.hscr-histology-completion"
    ],
    "timingProfileId": "timing.test.biopsy"
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.biopsy",
    "label": "Obtain a new rectal biopsy specimen",
    "rationale": "A new sample would address a tissue-acquisition problem, but the current specimen already contains submucosa at a relevant site. Initial H&E nonvisualization does not by itself establish that new sampling is the next step.",
    "temptation": "Apply the superficial-biopsy rule to every report lacking identified ganglion cells.",
    "correctUnder": "The original specimen lacks the relevant tissue, is from an inappropriate site, or cannot support expert completion.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
      "claim.pediatric-gi-abdominal-wall.hscr-histology-completion"
    ],
    "timingProfileId": "timing.test.biopsy"
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.manometry",
    "label": "Obtain anorectal manometry with reflex testing",
    "rationale": "Physiology may contribute to evaluation, but it does not settle the interpretation of the representative biopsy already obtained. Finish the histologic assessment rather than substitute a reflex result for it.",
    "temptation": "Choose a different modality after an apparently negative first reading.",
    "correctUnder": "The residual clinical question concerns anorectal function after adequate histologic and structural assessment.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.hscr-contrast-limit",
      "claim.pediatric-gi-abdominal-wall.hscr-histology-completion",
      "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
    ],
    "timingProfileId": "timing.test.physiology"
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
    "claim.pediatric-gi-abdominal-wall.hscr-histology-completion",
    "claim.pediatric-gi-abdominal-wall.hscr-contrast-limit",
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
    "claim.pediatric-gi-abdominal-wall.hscr-histology-completion",
    "claim.pediatric-gi-abdominal-wall.hscr-contrast-limit",
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
    "claim.pediatric-gi-abdominal-wall.hscr-histology-completion",
    "claim.pediatric-gi-abdominal-wall.hscr-contrast-limit",
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.histology",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
        "claim.pediatric-gi-abdominal-wall.hscr-histology-completion"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.biopsy",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
        "claim.pediatric-gi-abdominal-wall.hscr-histology-completion"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.manometry",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.hscr-contrast-limit",
        "claim.pediatric-gi-abdominal-wall.hscr-histology-completion",
        "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
    "claim.pediatric-gi-abdominal-wall.hscr-histology-completion",
    "claim.pediatric-gi-abdominal-wall.hscr-contrast-limit",
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
  ]
}
```

Constructed data policy: Patient age, chronology, reported findings and responses are fictional observations, not empirical thresholds or probabilities.

Exact current snapshot hashes:
```json
{
  "node": "c74eaa726ca69baa2f6355d320df6a9cd845d3bb770bf7495744d0a9f4013565",
  "question": "db71970f60b268918561bf175c30eabb72fa43946871603e6955cf615e402c46",
  "clinicalCase": "1152306729890915ec07f5b588aa3a3979b3f01d04e2d63b485593bce5242ac8"
}
```

### question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v1

Status: **revised**. Original verdict REVISE; original difficulty moderate; original two-step true. Revision passes 1.

Concrete response actions:

1. Specified eight months since surgery, initial spontaneous stooling and subsequent progressive difficulty over two months. These are constructed chronology, not a required waiting period.
2. Removed examination intolerance and the redundant representative-biopsy option; each choice now contains the same examination plus one investigation.
3. Restated Hirschsprung disease and surgery in this standalone node. Preserved the innervation-versus-anatomy inference; the counterfactual assumes completed structural assessment and a specified remaining outlet-function question.

Indexed review notes and responses:
```json
[
  {
    "category": "clarityIssues",
    "index": 0,
    "reviewNote": "The interval from pull-through and the postoperative bowel-function trajectory are unspecified. 'Persistent' could describe immediate recovery or an established later obstructive problem; this matters to the workup.",
    "disposition": "revised",
    "response": "Specified eight months since surgery, initial spontaneous stooling and subsequent progressive difficulty over two months. These are constructed chronology, not a required waiting period."
  },
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "she cannot tolerate further examination / anesthetized anorectal examination",
      "why": "The key directly fixes the sole named unfinished procedure. It also bundles imaging with an examination while the other options each offer a single diagnostic modality."
    },
    "disposition": "revised",
    "response": "Removed examination intolerance and the redundant representative-biopsy option; each choice now contains the same examination plus one investigation."
  },
  {
    "category": "cues",
    "index": 1,
    "reviewNote": {
      "phrase": "a recent representative biopsy ... contain normal ganglion cells / Repeat rectal biopsy with expert histopathology",
      "why": "The distractor repeats a recent explicitly representative test with no supplied specimen or interpretive discrepancy. This makes it a disposable completed-test foil."
    },
    "disposition": "revised",
    "response": "Removed examination intolerance and the redundant representative-biopsy option; each choice now contains the same examination plus one investigation."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "Structural assessment before assigning a functional outlet mechanism is a defensible preferred approach. Normal ganglionated tissue does not establish an anatomically unobstructed pull-through.",
    "disposition": "revised",
    "response": "Specified eight months since surgery, initial spontaneous stooling and subsequent progressive difficulty over two months. These are constructed chronology, not a required waiting period."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "The intended two steps are worthwhile: interpret what the pathology excludes and what it does not, then sequence structural versus functional evaluation. The current option construction makes that sequence too easy to bypass.",
    "disposition": "revised",
    "response": "Removed examination intolerance and the redundant representative-biopsy option; each choice now contains the same examination plus one investigation."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The node independently states Hirschsprung disease, surgery and biopsy findings, so it does not require the preceding answer. The earlier histology explanation provides background but does not explicitly teach this key. Exact postoperative timing still needs clarification; I have not independently verified a mandatory test sequence.",
    "disposition": "revised",
    "response": "Restated Hirschsprung disease and surgery in this standalone node. Preserved the innervation-versus-anatomy inference; the counterfactual assumes completed structural assessment and a specified remaining outlet-function question."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "State whether bowel function never recovered or initially improved and then worsened, with a clinically supported postoperative context.",
    "disposition": "revised",
    "response": "Restated Hirschsprung disease and surgery in this standalone node. Preserved the innervation-versus-anatomy inference; the counterfactual assumes completed structural assessment and a specified remaining outlet-function question."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Compare similarly scoped diagnostic plans and remove the repeat-biopsy foil unless there is a genuine residual histologic uncertainty.",
    "disposition": "revised",
    "response": "Restated Hirschsprung disease and surgery in this standalone node. Preserved the innervation-versus-anatomy inference; the counterfactual assumes completed structural assessment and a specified remaining outlet-function question."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Keep the intolerance of awake examination if needed for procedure choice, but make interpretation of the postoperative findings, rather than matching 'cannot tolerate' to 'anesthetized,' determine the key.",
    "disposition": "revised",
    "response": "Restated Hirschsprung disease and surgery in this standalone node. Preserved the innervation-versus-anatomy inference; the counterfactual assumes completed structural assessment and a specified remaining outlet-function question."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.hscr-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Ava Morgan",
  "prototypeDemographics": {
    "ageYears": 7,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.hscr-course.v1",
  "chiefComplaint": "Bowel record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 7-year-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.hscr-course.v1",
      "prototypeDemographics": {
        "ageYears": 7,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Bowel record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 7-year-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: A subsequent record documents {patientName}'s pull-through after representative biopsy confirmed Hirschsprung disease. She now has persistent distension and difficult evacuation.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Pathology review",
      "value": "The proximal resection margin and a recent representative biopsy of the pulled-through bowel contain normal ganglion cells."
    },
    {
      "label": "Current course and examination",
      "value": "Soft stool is difficult to pass. The attempted awake examination stops at the anal verge because she cannot tolerate further examination; temperature and perfusion remain normal."
    }
  ]
}
```

Task: Which assessment should come next for {patientName}'s postoperative obstruction?

**key shown first for review only**

1. Contrast enema with anesthetized anorectal examination **[KEY]**

Feedback: Normal ganglionated tissue does not exclude an anastomotic or pull-through mechanical problem. Complete structural assessment before assigning a functional outlet mechanism.

2. Repeat rectal biopsy with expert histopathology

Feedback: Representative pulled-through tissue and the original margin have already been reviewed. Another tissue sample does not address the currently unassessed mechanical pathway.

3. Anorectal manometry with outlet-pressure assessment

Feedback: A functional outlet assessment may become relevant, but should not replace the structural examination and contrast evaluation in this incomplete postoperative workup.

Explanation: Normal ganglionated tissue does not exclude an anastomotic or pull-through mechanical problem. Complete structural assessment before assigning a functional outlet mechanism.

Evidence claims: claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical, claim.pediatric-gi-abdominal-wall.hscr-biopsy, claim.pediatric-gi-abdominal-wall.hscr-functional.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: revised exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction-standalone.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Ava Morgan",
  "prototypeDemographics": {
    "ageYears": 7,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction-standalone.v2",
  "chiefComplaint": "Bowel record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 7-year-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction-standalone.v2",
      "prototypeDemographics": {
        "ageYears": 7,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Bowel record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 7-year-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName} had a pull-through for biopsy-confirmed Hirschsprung disease eight months before this outside visit. She initially passed spontaneous stools; during the last two months, soft stools have become progressively difficult to evacuate and distension has returned.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Histology record",
      "value": "Expert review of the proximal resection margin and a recent representative biopsy of the pulled-through bowel shows ganglion cells."
    },
    {
      "label": "Current assessment",
      "value": "She is afebrile and well perfused. No contrast assessment of the reconstructed bowel has been performed during this symptomatic period."
    }
  ]
}
```

Task: Which investigation plan should the outside team select next for {patientName}'s recurrent postoperative obstruction?

**key shown first for review only**

1. Rectal examination plus contrast enema **[KEY]**

Feedback: Ganglionated tissue establishes innervation at the sampled sites; it does not show that the reconstructed bowel is patent or untwisted. Examine the rectum and define the postoperative anatomy before assigning the symptoms to a functional mechanism.

2. Rectal examination plus anorectal manometry

Feedback: Outlet dysfunction is plausible, but normal ganglionation does not exclude a stricture, cuff problem or twist. The missing current anatomical assessment makes contrast evaluation the better next plan here.

3. Rectal examination plus colonic transit study

Feedback: A transit study addresses movement through the colon. It does not establish the postoperative configuration that remains in question in this record. It can become relevant to a residual motility question after outlet and structural evaluation.

Explanation: Ganglionated tissue establishes innervation at the sampled sites; it does not show that the reconstructed bowel is patent or untwisted. Examine the rectum and define the postoperative anatomy before assigning the symptoms to a functional mechanism.

Evidence claims: claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical, claim.pediatric-gi-abdominal-wall.hscr-biopsy, claim.pediatric-gi-abdominal-wall.postoperative-test-purpose.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "Normal ganglionation does not exclude an acquired mechanical problem after an initial period of stooling.",
  "decision": "Choose current structural assessment before classifying the persistent symptoms as outlet dysfunction or delayed colonic transit.",
  "closestCredibleError": "Choose anorectal manometry because ganglionated tissue is overread as a complete exclusion of postoperative obstruction.",
  "decidingObservation": "Bowel function initially recovered and later deteriorated, while current pull-through anatomy has not been assessed.",
  "consequenceOfError": "A mechanically remediable obstruction could be assigned prematurely to functional disease.",
  "deletionTest": "The initial recovery and later decline distinguish an acquired problem from immediate recovery. Removing the histology destroys the intended normal-innervation trap. Removing the anatomy status makes the diagnostic sequence uncertain.",
  "counterfactual": "If a current rectal examination and contrast study had already demonstrated an unobstructed reconstruction and the residual question were anorectal function, anorectal manometry becomes the best offered next investigation.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.physiology"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "Removed the intolerant-exam-to-anesthesia match and the repeated recent-biopsy foil. All options combine the same rectal examination with one specified diagnostic modality; no key-only bundle remains.",
  "oneStageAndCategory": "All choices are similarly scoped investigation plans for the same established late postoperative problem.",
  "twoConsequentialSteps": "Normal ganglionation does not exclude an acquired mechanical problem after an initial period of stooling. Then Choose current structural assessment before classifying the persistent symptoms as outlet dysfunction or delayed colonic transit.",
  "residentDifficulty": "Predicted moderate: the closest competing functional study is credible only after separating what normal histology does and does not exclude.",
  "oneBestAnswer": "Bowel function initially recovered and later deteriorated, while current pull-through anatomy has not been assessed. Counterfactual: If a current rectal examination and contrast study had already demonstrated an unobstructed reconstruction and the residual question were anorectal function, anorectal manometry becomes the best offered next investigation.",
  "sequenceAndFiniteProfileAttack": "Standalone named 7-year-old female outside-hospital record review. No prior answer, later episode or feedback is displayed; one finite profile preserves the constrained age and sex.",
  "repairAndRecheck": "Added exact fictional chronology without making it a clinical timing threshold. Re-solved after changing current anatomy to already assessed; physiology then addresses the stated residual question.",
  "remainingRisk": "ERNICA supports rectal examination and contrast evaluation for mechanical causes. It does not impose one universal test order for every postoperative child. NIDDK cross-check supports test purpose only.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Revised once for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.structure",
    "label": "Rectal examination plus contrast enema",
    "rationale": "Ganglionated tissue establishes innervation at the sampled sites; it does not show that the reconstructed bowel is patent or untwisted. Examine the rectum and define the postoperative anatomy before assigning the symptoms to a functional mechanism.",
    "temptation": "Distinguish histologic adequacy from anatomical patency.",
    "correctUnder": "Recurrent postoperative obstructive symptoms with innervation reviewed but current reconstructed anatomy unassessed.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
      "claim.pediatric-gi-abdominal-wall.hscr-biopsy"
    ],
    "timingProfileId": "timing.test.combined_diagnostic"
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.physiology",
    "label": "Rectal examination plus anorectal manometry",
    "rationale": "Outlet dysfunction is plausible, but normal ganglionation does not exclude a stricture, cuff problem or twist. The missing current anatomical assessment makes contrast evaluation the better next plan here.",
    "temptation": "Treat ganglionated tissue as proof that all structural causes were excluded.",
    "correctUnder": "Current structural assessment is reassuring and the remaining question is specifically anorectal function.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
      "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
    ],
    "timingProfileId": "timing.test.physiology"
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.transit",
    "label": "Rectal examination plus colonic transit study",
    "rationale": "A transit study addresses movement through the colon. It does not establish the postoperative configuration that remains in question in this record. It can become relevant to a residual motility question after outlet and structural evaluation.",
    "temptation": "Attribute recurrent distension to colonic dysmotility once histology is reassuring.",
    "correctUnder": "Anatomy and outlet function have been assessed and a residual colonic transit question remains.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
      "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
    ],
    "timingProfileId": "timing.test.physiology"
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
    "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
    "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
    "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.structure",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
        "claim.pediatric-gi-abdominal-wall.hscr-biopsy"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.physiology",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
        "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.transit",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
        "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
    "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
  ]
}
```

Constructed data policy: Patient age, chronology, reported findings and responses are fictional observations, not empirical thresholds or probabilities.

Exact current snapshot hashes:
```json
{
  "node": "b74bcdd693f56ec920e7e5eb9794c06aa8a42dd477f5df8ed522792d3ac71a6f",
  "question": "06c53c3759a1cfc3cc0fc60a818e82913ee17b49adaca26bedd06ace886c042e",
  "clinicalCase": "b8ad769f47a356139de72269df4fa5ad545cf09b5c6352e53558b103a8c1810f"
}
```

### question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1

Status: **pass-preserved**. Original verdict PASS; original difficulty moderate; original two-step true. Revision passes 0.

Concrete response actions:

1. Preserve the exact independent-PASS clinical wording, choices, feedback, header and finite profile; do not apply optional copyedits.
2. Retain original complete reviewed objects and hashes. Only the two extracted standalone wrappers receive mandatory neutral final-answer metadata.
3. Remove all future/parked companion content; editorial PASS remains separate from named clinical approval.

Indexed review notes and responses:
```json
[
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "The important conflict is visible: a persistent dilated loop versus improving abdominal findings, declining support and falling lactate, without reported free gas. Continued close nonoperative treatment is the best offered plan; the explanation does not claim the loop is harmless.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "The learner must interpret the concerning radiographic persistence in context, then decide whether it outweighs the clinical response sufficiently to justify intervention. The improvement observations are decision-critical evidence, not a lexical cue to the answer.",
    "disposition": "pass-preserved",
    "response": "No later episode or feedback is included in the standalone case. Editorial PASS remains separate from named clinical approval."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "Laparotomy is the meaningful competing error. Drainage is weaker without demonstrated perforation or instability but remains in the same intervention category. No confident clinical inaccuracy identified.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "fairness",
    "index": 3,
    "reviewNote": "This first node stands alone and exposes no subsequent perforation. Its explanation does not preannounce the later rescue-laparotomy answer. Editorial PASS does not verify the cited guideline or confer clinical approval.",
    "disposition": "pass-preserved",
    "response": "No later episode or feedback is included in the standalone case. Editorial PASS remains separate from named clinical approval."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Preserve the discordance between imaging and clinical course. Keep close reassessment explicit in feedback and do not convert this into an absolute rule against surgery whenever free gas is absent.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.nec-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Ethan Brooks",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.nec-course.v1",
  "chiefComplaint": "Neonatal course review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-week-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.nec-course.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Neonatal course review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-week-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName} was born preterm and is receiving neonatal medical treatment for NEC in an outside hospital.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Serial radiology reports",
      "value": "Pneumatosis has decreased, but one dilated loop remains in the same position on consecutive films. No free intraperitoneal gas is reported."
    },
    {
      "label": "Concurrent clinical trend",
      "value": "Abdominal tenderness and distension have lessened. Ventilator and circulatory support have decreased, and lactate is falling."
    }
  ]
}
```

Task: Which next plan is best supported by {patientName}'s current course?

**key shown first for review only**

1. Continue nonoperative NEC treatment **[KEY]**

Feedback: A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.

2. Perform exploratory laparotomy

Feedback: The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.

3. Insert a peritoneal drain

Feedback: The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.

Explanation: A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.

Evidence claims: claim.pediatric-gi-abdominal-wall.nec-fixed-loop, claim.pediatric-gi-abdominal-wall.nec-drain, claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: pass-preserved exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-standalone.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Ethan Brooks",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.nec-fixed-loop-context-standalone.v1",
  "chiefComplaint": "Neonatal course review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-week-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.nec-fixed-loop-context-standalone.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Neonatal course review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-week-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName} was born preterm and is receiving neonatal medical treatment for NEC in an outside hospital.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Serial radiology reports",
      "value": "Pneumatosis has decreased, but one dilated loop remains in the same position on consecutive films. No free intraperitoneal gas is reported."
    },
    {
      "label": "Concurrent clinical trend",
      "value": "Abdominal tenderness and distension have lessened. Ventilator and circulatory support have decreased, and lactate is falling."
    }
  ]
}
```

Task: Which next plan is best supported by {patientName}'s current course?

**key shown first for review only**

1. Continue nonoperative NEC treatment **[KEY]**

Feedback: A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.

2. Perform exploratory laparotomy

Feedback: The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.

3. Insert a peritoneal drain

Feedback: The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.

Explanation: A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.

Evidence claims: claim.pediatric-gi-abdominal-wall.nec-fixed-loop, claim.pediatric-gi-abdominal-wall.nec-drain, claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "Distinguish persistent loop position from documented perforation or proven bowel necrosis.",
  "decision": "Integrate the improving abdominal, perfusion and support trends before choosing operative versus continued medical management.",
  "closestCredibleError": "Laparotomy because fixed loop has been memorized as an absolute trigger.",
  "decidingObservation": "The imaging concern persists while multiple clinical measures improve.",
  "consequenceOfError": "Unnecessary intervention could follow, while treating an isolated sign as reassuring in every context would also be unsafe.",
  "deletionTest": "Deleting the response trend makes the management ranking uncertain; deleting the loop removes the meaningful conflict. Absence of free air alone is not the reason for the key.",
  "counterfactual": "If new free intraperitoneal gas appeared with worsening perfusion at an expert surgical center, operative assessment rather than continued medical treatment would be the offered plan.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "No interpretation such as resolving NEC precedes the answer. Three concise intervention plans, with medical care common background to all. Necessary free-air status is not the only discriminator.",
  "oneStageAndCategory": "Choice of additional intervention during outside-hospital NEC care.",
  "twoConsequentialSteps": "Distinguish persistent loop position from documented perforation or proven bowel necrosis. Then Integrate the improving abdominal, perfusion and support trends before choosing operative versus continued medical management.",
  "residentDifficulty": "Predicted moderate/hard: a familiar radiographic rule competes with a clear but independently interpreted clinical trajectory.",
  "oneBestAnswer": "The imaging concern persists while multiple clinical measures improve. Counterfactual: If new free intraperitoneal gas appeared with worsening perfusion at an expert surgical center, operative assessment rather than continued medical treatment would be the offered plan.",
  "sequenceAndFiniteProfileAttack": "No perforation, drain or future deterioration is exposed before this first node.",
  "repairAndRecheck": "Removed fixed-loop-equals-necrosis language and kept independent radiology/support observations; re-solved the operative alternatives. Removed a repeated clinic-review framing sentence after the deletion check; the clinical observations and key are unchanged.",
  "remainingRisk": "ERNICA advice is conditional and very-low certainty. This is not a promise that an improving infant can never need surgery.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Draft for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.medical",
    "label": "Continue nonoperative NEC treatment",
    "rationale": "A persistent loop is concerning but is not an independent absolute surgical trigger. Here the concurrent abdominal and support trends favor continued close medical treatment and reassessment.",
    "temptation": "Weigh the imaging finding against actual physiologic response.",
    "correctUnder": "A concerning isolated radiographic sign in an otherwise improving infant under expert surveillance.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.nec-fixed-loop"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
    "label": "Perform exploratory laparotomy",
    "rationale": "The unchanged loop does not by itself establish nonviable bowel or a need for laparotomy when the overall course is improving.",
    "temptation": "Treat a traditional radiographic sign as an automatic operative indication.",
    "correctUnder": "Perforation or an overall course concerning for disease requiring operative assessment, rather than an isolated loop.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
      "claim.pediatric-gi-abdominal-wall.nec-drain"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
    "label": "Insert a peritoneal drain",
    "rationale": "The current record does not establish perforated NEC or a bridge indication for drainage. A fixed loop is not equivalent to free intraperitoneal contamination.",
    "temptation": "Substitute a less invasive surgical procedure for a missing indication.",
    "correctUnder": "Suspected or confirmed perforation with patient/center factors favoring drainage.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.nec-drain",
      "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
    ],
    "timingProfileId": null
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
    "claim.pediatric-gi-abdominal-wall.nec-drain",
    "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
    "claim.pediatric-gi-abdominal-wall.nec-drain",
    "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
    "claim.pediatric-gi-abdominal-wall.nec-drain",
    "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.medical",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.nec-fixed-loop"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.laparotomy",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
        "claim.pediatric-gi-abdominal-wall.nec-drain"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1.drain",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.nec-drain",
        "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
    "claim.pediatric-gi-abdominal-wall.nec-drain",
    "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
  ]
}
```

Constructed data policy: Patient age, chronology, reported findings and responses are fictional observations, not empirical thresholds or probabilities.

Exact current snapshot hashes:
```json
{
  "node": "b213ae8af6bcf5ff5e18361e51f8166981a0a1727dc6e5aa9c03c8250d259085",
  "question": "591060294b042395e1b3d1e4ba58c173fcad4fd31a0164bb00ec9cec7895860a",
  "clinicalCase": "53265546f9087bf46cbdca9bb7be72c9407002b63e13aaadc71158354b5b8957"
}
```

PASS preservation and required standalone composition metadata:
```json
{
  "reviewedNodeSha256": "ea041f4775428704c92d6d0e7ca19655de5957d11cf6e44c8ead9d0d2a4147f3",
  "reviewedQuestionSha256": "591060294b042395e1b3d1e4ba58c173fcad4fd31a0164bb00ec9cec7895860a",
  "visibleHeaderAndProfile": "Exact original presentation, complaint, age, sex and finite-profile content retained. Case identity/profile identity changes only for standalone extraction; authored PASS wording and clinical node fields and question objects are unchanged.",
  "splitFromCaseId": "case.pediatric-gi-abdominal-wall.nec-course.v1",
  "wrapperChanges": [
    "Case and presentation/profile identities for standalone extraction",
    "Remove the parked companion from decisionNodes and learningSummary",
    "Add only required neutral no_terminal_outcome metadata to wrong final choices, copying unchanged reviewed rationale and sourceLabels"
  ],
  "preservationScope": "Exact original complete node and question snapshots preserved; standalone node is identical after excluding only terminalDispositions. No PASS clinical wording, answer label, exhibit, rationale, explanation or visible header/profile text changed.",
  "currentQuestionSha256": "591060294b042395e1b3d1e4ba58c173fcad4fd31a0164bb00ec9cec7895860a",
  "originalFullNodeSha256": "ea041f4775428704c92d6d0e7ca19655de5957d11cf6e44c8ead9d0d2a4147f3",
  "currentClinicalNodeSha256": "c588342518ca6818ace73addba8a3b880bb107144c5ae636d7000dae2f217e0d",
  "reviewedClinicalNodeSha256": "c588342518ca6818ace73addba8a3b880bb107144c5ae636d7000dae2f217e0d"
}
```

### question.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1

Status: **parked**. Original verdict REVISE; original difficulty easy; original two-step false. Revision passes 1.

Concrete response actions:

1. Accepted the unspecified interval. A fictional course could be clarified, but there is no universal waiting period to teach and chronology alone does not repair difficulty.
2. Accepted both defeated-distractor cues and all three fairness notes: the key is sound, patency is not proof of source control, and the item is not a substantial two-step contest.
3. Parked without inventing malfunction or hiding deterioration. Split the exact PASS fixed-loop node into a self-contained improving-course case, with no later drainage episode.

Indexed review notes and responses:
```json
[
  {
    "category": "clarityIssues",
    "index": 0,
    "reviewNote": "The time course after drainage is not specified. The direction of deterioration is clear, but the response interval would help distinguish immediate peri-transfer instability from continued failure of the drainage strategy.",
    "disposition": "parked",
    "response": "Accepted the unspecified interval. A fictional course could be clarified, but there is no universal waiting period to teach and chronology alone does not repair difficulty."
  },
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "The drain flushes freely ... little residual free fluid / Replace the existing peritoneal drain",
      "why": "The stem explicitly reports that the device functions and there is little undrained fluid, directly removing the replacement option."
    },
    "disposition": "parked",
    "response": "Accepted both defeated-distractor cues and all three fairness notes: the key is sound, patency is not proof of source control, and the item is not a substantial two-step contest."
  },
  {
    "category": "cues",
    "index": 1,
    "reviewNote": {
      "phrase": "Vasopressor and ventilator support have increased despite ongoing neonatal resuscitation / Continue the current drainage strategy",
      "why": "Continued deterioration directly removes unchanged treatment. Laparotomy is the only novel strategy and is selectable through generic failed-treatment escalation."
    },
    "disposition": "parked",
    "response": "Accepted both defeated-distractor cues and all three fairness notes: the key is sound, patency is not proof of source control, and the item is not a substantial two-step contest."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "Laparotomy for assessment is the best offered plan in the described deteriorating infant with perforated NEC despite drainage. The explanation does not assert that drain output proves adequate source control.",
    "disposition": "parked",
    "response": "Accepted the unspecified interval. A fictional course could be clarified, but there is no universal waiting period to teach and chronology alone does not repair difficulty."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "The physiological findings justify escalation, but the two drain choices do not create a substantial resident-level decision against surgery. Naming a patent drain and then choosing the only different treatment is not two consequential clinical inferences.",
    "disposition": "parked",
    "response": "Accepted both defeated-distractor cues and all three fairness notes: the key is sound, patency is not proof of source control, and the item is not a substantial two-step contest."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The later episode supplies perforation, drainage and current decline, so it can stand alone and does not contradict the earlier improving course. Earlier feedback does not state this operative answer.",
    "disposition": "parked",
    "response": "Parked without inventing malfunction or hiding deterioration. Split the exact PASS fixed-loop node into a self-contained improving-course case, with no later drainage episode."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Clarify the response chronology without inventing a universal waiting interval.",
    "disposition": "parked",
    "response": "Parked without inventing malfunction or hiding deterioration. Split the exact PASS fixed-loop node into a self-contained improving-course case, with no later drainage episode."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Keep this as an explicitly accepted safety-recognition item, or move the scored objective to a different consequential surgical decision with credible competitors and adequate observations.",
    "disposition": "parked",
    "response": "Parked without inventing malfunction or hiding deterioration. Split the exact PASS fixed-loop node into a self-contained improving-course case, with no later drainage episode."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Do not conceal deterioration or make drain exchange attractive through fabricated malfunction solely to increase difficulty.",
    "disposition": "parked",
    "response": "Parked without inventing malfunction or hiding deterioration. Split the exact PASS fixed-loop node into a self-contained improving-course case, with no later drainage episode."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.nec-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Ethan Brooks",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.nec-course.v1",
  "chiefComplaint": "Neonatal course review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-week-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.nec-course.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Neonatal course review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 3-week-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: A later outside-hospital course for {patientName} documents perforated NEC. A peritoneal drain was placed during initial instability, and he has now reached a pediatric surgical center.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Drain and imaging record",
      "value": "The drain flushes freely and continues to return enteric material. Ultrasound shows little residual free fluid; the abdominal wall has become more erythematous."
    },
    {
      "label": "Response after drainage",
      "value": "Abdominal distension and metabolic acidosis worsen. Vasopressor and ventilator support have increased despite ongoing neonatal resuscitation."
    }
  ]
}
```

Task: Which next plan should the receiving team select for {patientName}?

**key shown first for review only**

1. Proceed to laparotomy for bowel assessment **[KEY]**

Feedback: A patent drain with little residual fluid has not reversed the clinical decline. Drainage can be a bridge; worsening disease after it requires reassessment for definitive operative bowel evaluation.

2. Replace the existing peritoneal drain

Feedback: A larger or repositioned drain is less persuasive when patency is documented and little undrained fluid remains while systemic and abdominal disease worsen.

3. Continue the current drainage strategy

Feedback: Enteric return does not demonstrate that ongoing NEC is controlled. Continuing the same bridge despite escalating support misses the acquired failure of that strategy.

Explanation: A patent drain with little residual fluid has not reversed the clinical decline. Drainage can be a bridge; worsening disease after it requires reassessment for definitive operative bowel evaluation.

Evidence claims: claim.pediatric-gi-abdominal-wall.nec-drain, claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: parked; no executable scored key

```json
{
  "reviewedQuestionVariantId": "question.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1",
  "reviewedNodeId": "node.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1",
  "status": "parked",
  "reason": "The supported conclusion is escalation for ongoing deterioration, while the two drain alternatives are directly defeated. Clarifying elapsed time cannot create a difficult two-step decision, and no supported new intraoperative bowel-assessment objective is available in this record.",
  "attemptedRevision": "Considered adding initial improvement followed by acquired decline and comparing laparotomy, repositioning and continued drainage. This repairs chronology but leaves generic escalation sufficient unless a drain malfunction or different operative problem is fabricated.",
  "clinicalReviewStatus": "needs_clinician_review",
  "keyState": "No current executable question or scored key; original reviewed v1 retained only in reviewInput.",
  "reopenOwner": "Manager with Melissa and the relevant pediatric specialist",
  "reviewInputPointer": "independentReviewFollowup.reviewInput.proposals[questionVariantId=question.pediatric-gi-abdominal-wall.nec-deterioration-after-drain.v1]"
}
```

A fair harder version was assessed once and could not be completed from the supported facts. The archived key is not a current proposal. Reopening belongs to the manager with Melissa and the named specialty.

### question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1

Status: **pass-preserved**. Original verdict PASS; original difficulty moderate; original two-step true. Revision passes 0.

Concrete response actions:

1. Preserve the exact independent-PASS clinical wording, choices, feedback, header and finite profile; do not apply optional copyedits.
2. Retain original complete reviewed objects and hashes. Only the two extracted standalone wrappers receive mandatory neutral final-answer metadata.
3. Remove all future/parked companion content; editorial PASS remains separate from named clinical approval.

Indexed review notes and responses:
```json
[
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "The reversible deterioration during full reduction links respiratory and perfusion compromise to abdominal capacity. Staged silo reduction is the best offered plan; changing only the covering technique does not resolve intolerance of returning all bowel at once.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "Both steps have consequences: interpret the paired reduction/release response, then distinguish a change in reduction strategy from a change in closure material. Primary sutureless closure is a credible conceptual trap for someone attributing the problem only to fascial sutures.",
    "disposition": "pass-preserved",
    "response": "No later episode or feedback is included in the standalone case. Editorial PASS remains separate from named clinical approval."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The two primary-closure labels share wording, but choosing the staged alternative requires interpreting the physiological response; there is no key-only teaching phrase, unsupported absolute or hidden diagnosis needed to answer.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "fairness",
    "index": 3,
    "reviewNote": "The standalone case supplies anatomy, bowel condition, baseline status and the trial response. No confident clinical error identified; editorial PASS is not clinical approval.",
    "disposition": "pass-preserved",
    "response": "No later episode or feedback is included in the standalone case. Editorial PASS remains separate from named clinical approval."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Retain the before/during/release comparison and the distinction between reduction and coverage. Avoid adding an interpreted label such as 'cannot tolerate primary closure' before the choice.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Oliver Hayes",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1",
  "chiefComplaint": "Birth record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 1-day-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Birth record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 1-day-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s birth record describes uncovered bowel beside a separately inserted umbilical cord. The founder reviews the outside operative note in clinic.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Before reduction",
      "value": "Bowel is perfused and intact. Ventilation and lower-limb perfusion are satisfactory."
    },
    {
      "label": "Trial reduction",
      "value": "As all bowel is returned to the abdomen, ventilatory pressure rises and lower-limb perfusion diminishes. Both improve when the bowel is released from the attempted reduction."
    }
  ]
}
```

Task: Which abdominal-wall plan best fits {patientName}'s recorded response to reduction?

**key shown first for review only**

1. Staged reduction with a silo **[KEY]**

Feedback: The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity.

2. Primary sutured fascial closure

Feedback: Completing the same full reduction under tension would recreate the observed compromise. Bowel viability before reduction does not establish that the abdomen can safely contain it now.

3. Primary sutureless cord closure

Feedback: Avoiding sutures does not remove the pressure effect of returning all bowel to an inadequate abdominal domain. Primary sutureless closure still requires safe reduction.

Explanation: The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity.

Evidence claims: claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy, claim.pediatric-gi-abdominal-wall.gastroschisis-pressure, claim.pediatric-gi-abdominal-wall.gastroschisis-silo, claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: pass-preserved exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Oliver Hayes",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1",
  "chiefComplaint": "Birth record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 1-day-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Birth record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 1-day-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s birth record describes uncovered bowel beside a separately inserted umbilical cord. The founder reviews the outside operative note in clinic.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Before reduction",
      "value": "Bowel is perfused and intact. Ventilation and lower-limb perfusion are satisfactory."
    },
    {
      "label": "Trial reduction",
      "value": "As all bowel is returned to the abdomen, ventilatory pressure rises and lower-limb perfusion diminishes. Both improve when the bowel is released from the attempted reduction."
    }
  ]
}
```

Task: Which abdominal-wall plan best fits {patientName}'s recorded response to reduction?

**key shown first for review only**

1. Staged reduction with a silo **[KEY]**

Feedback: The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity.

2. Primary sutured fascial closure

Feedback: Completing the same full reduction under tension would recreate the observed compromise. Bowel viability before reduction does not establish that the abdomen can safely contain it now.

3. Primary sutureless cord closure

Feedback: Avoiding sutures does not remove the pressure effect of returning all bowel to an inadequate abdominal domain. Primary sutureless closure still requires safe reduction.

Explanation: The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity.

Evidence claims: claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy, claim.pediatric-gi-abdominal-wall.gastroschisis-pressure, claim.pediatric-gi-abdominal-wall.gastroschisis-silo, claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "Identify the reversible coupled ventilatory and perfusion response to complete reduction.",
  "decision": "Choose gradual reduction rather than change only the surface closure method.",
  "closestCredibleError": "Select sutureless closure to avoid tension while repeating the same intolerable full reduction.",
  "decidingObservation": "Both abnormalities appear with reduction and reverse on release.",
  "consequenceOfError": "Respiratory or splanchnic/peripheral perfusion compromise could recur.",
  "deletionTest": "Without the response-and-release comparison there is no supported ranking of the primary versus staged options. Intact bowel preserves a real primary-closure competitor rather than an unrelated resection task.",
  "counterfactual": "If full reduction caused no respiratory or perfusion change, the fascia could close safely, and the cord could not cover the defect, primary sutured fascial closure would be the best offered plan.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutured"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "The task does not name pressure or staged closure; both primary methods remain credible before the response is interpreted. Labels are parallel closure strategies without explanatory clauses.",
  "oneStageAndCategory": "Three closure strategies at the same outside operative stage.",
  "twoConsequentialSteps": "Identify the reversible coupled ventilatory and perfusion response to complete reduction. Then Choose gradual reduction rather than change only the surface closure method.",
  "residentDifficulty": "Predicted moderate/hard: the resident must connect a reversible physiologic experiment to a closure decision and resist the sutureless-equals-no-pressure error.",
  "oneBestAnswer": "Both abnormalities appear with reduction and reverse on release. Counterfactual: If full reduction caused no respiratory or perfusion change, the fascia could close safely, and the cord could not cover the defect, primary sutured fascial closure would be the best offered plan.",
  "sequenceAndFiniteProfileAttack": "Single node; no preceding explanation supplies the silo answer. One exact neonatal profile remains fixed.",
  "repairAndRecheck": "Removed a preinterpreted small-abdominal-domain conclusion and used the actual reduction/release response; re-solved both primary techniques. Counterfactual recheck: safe reduction alone left both primary methods reasonable; an unsuitable cord and safely closable fascia select the offered sutured method.",
  "remainingRisk": "No numeric compartment or ventilator cutoff, universal closure superiority or in-clinic neonatal operation is authored.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Draft for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.silo",
    "label": "Staged reduction with a silo",
    "rationale": "The response ties full reduction to respiratory and perfusion compromise. A silo permits gradual reduction while protecting the bowel; a different covering technique does not by itself solve inadequate abdominal capacity.",
    "temptation": "Infer the physiologic effect of abdominal domain from a reversible change.",
    "correctUnder": "Inability to tolerate primary reduction safely.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
      "claim.pediatric-gi-abdominal-wall.gastroschisis-silo"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutured",
    "label": "Primary sutured fascial closure",
    "rationale": "Completing the same full reduction under tension would recreate the observed compromise. Bowel viability before reduction does not establish that the abdomen can safely contain it now.",
    "temptation": "Equate intact bowel with suitability for primary closure.",
    "correctUnder": "Full reduction is tolerated without clinically important respiratory or perfusion compromise.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
      "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutureless",
    "label": "Primary sutureless cord closure",
    "rationale": "Avoiding sutures does not remove the pressure effect of returning all bowel to an inadequate abdominal domain. Primary sutureless closure still requires safe reduction.",
    "temptation": "Assume a less invasive surface closure eliminates the internal pressure problem.",
    "correctUnder": "Safe complete reduction with suitable cord coverage and patient condition.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
      "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
      "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage"
    ],
    "timingProfileId": null
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.silo",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
        "claim.pediatric-gi-abdominal-wall.gastroschisis-silo"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutured",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
        "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1.sutureless",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
        "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
        "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage"
  ]
}
```

Constructed data policy: Patient age, chronology, reported findings and responses are fictional observations, not empirical thresholds or probabilities.

Exact current snapshot hashes:
```json
{
  "node": "46996c08d7201056ff40976bdfffb6de8c2f4543a3ad5d7ae524970801880d5e",
  "question": "81e1276aeab2da156112c250f49673ff3311ce4141950295c220feb30a72557f",
  "clinicalCase": "af8307dd0aa6a3a475f518bbc8aa179dd4543fd1574c2190c7a3b3d4e9a054b0"
}
```

PASS preservation and required standalone composition metadata:
```json
{
  "reviewedNodeSha256": "46996c08d7201056ff40976bdfffb6de8c2f4543a3ad5d7ae524970801880d5e",
  "reviewedQuestionSha256": "81e1276aeab2da156112c250f49673ff3311ce4141950295c220feb30a72557f",
  "visibleHeaderAndProfile": "Exact original presentation, complaint, age, sex and finite-profile content retained. Case identity/profile identity changes only for standalone extraction; authored PASS wording and node/question objects are unchanged.",
  "splitFromCaseId": null,
  "currentQuestionSha256": "81e1276aeab2da156112c250f49673ff3311ce4141950295c220feb30a72557f",
  "originalFullNodeSha256": "46996c08d7201056ff40976bdfffb6de8c2f4543a3ad5d7ae524970801880d5e",
  "currentClinicalNodeSha256": "d560227cd03b2809e47866c95c9cedbb2edf79f128de2bb8bd2a1fcded37ffb6",
  "reviewedClinicalNodeSha256": "d560227cd03b2809e47866c95c9cedbb2edf79f128de2bb8bd2a1fcded37ffb6"
}
```

### question.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v1

Status: **revised**. Original verdict REVISE; original difficulty moderate; original two-step true. Revision passes 1.

Concrete response actions:

1. Replaced substantial support with intubation and increasing oxygen and pressure requirements plus the observed ductal shunt. These are fictional observations, not a prescribed threshold.
2. Specified whether reduction starts now in all three labels. Deferred reduction during stabilization and immediate staged reduction no longer describe the same timing.
3. Reverified the 2026 ERNICA subgroup recommendation and recorded its expert-consensus/very-low-evidence limitation. Feedback explicitly compares the key with gradual staged reduction; Melissa still must confirm the exact preference.

Indexed review notes and responses:
```json
[
  {
    "category": "clarityIssues",
    "index": 0,
    "reviewNote": "'Respiratory support remains substantial' is an imprecise severity description. The shunt finding is useful, but the support requirement and trajectory are not concretely described.",
    "disposition": "revised",
    "response": "Replaced substantial support with intubation and increasing oxygen and pressure requirements plus the observed ductal shunt. These are fictional observations, not a prescribed threshold."
  },
  {
    "category": "clarityIssues",
    "index": 1,
    "reviewNote": "'Staged reduction followed by surgical closure' has no stated pace or initial timing, so it can overlap with a delayed strategy after stabilization.",
    "disposition": "revised",
    "response": "Replaced substantial support with intubation and increasing oxygen and pressure requirements plus the observed ductal shunt. These are fictional observations, not a prescribed threshold."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "The anatomy and cardiopulmonary findings support avoiding an immediate tight reduction. Initial sac care with delayed closure is clinically plausible, and the intended two steps are to recognize limited domain and apply the pulmonary risk to timing.",
    "disposition": "revised",
    "response": "Reverified the 2026 ERNICA subgroup recommendation and recorded its expert-consensus/very-low-evidence limitation. Feedback explicitly compares the key with gradual staged reduction; Melissa still must confirm the exact preference."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "The explanation contrasts the key with 'forcing early reduction,' but the closest option is staged reduction, not necessarily forced early reduction. That description does not fairly defeat the strongest distractor.",
    "disposition": "revised",
    "response": "Replaced substantial support with intubation and increasing oxygen and pressure requirements plus the observed ductal shunt. These are fictional observations, not a prescribed threshold."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "I am uncertain that the visible findings alone make delayed sac care uniquely preferable to every interpretation of the staged option. The statement that 'Current expert guidance favors' this plan was not independently verified without network access; this is a ranking uncertainty, not an allegation that delayed care is wrong.",
    "disposition": "revised",
    "response": "Specified whether reduction starts now in all three labels. Deferred reduction during stabilization and immediate staged reduction no longer describe the same timing."
  },
  {
    "category": "fairness",
    "index": 3,
    "reviewNote": "The case stands alone and the task is complete. The concept is high yield; uncertainty between strategies should not be counted as hard question difficulty.",
    "disposition": "revised",
    "response": "Reverified the 2026 ERNICA subgroup recommendation and recorded its expert-consensus/very-low-evidence limitation. Feedback explicitly compares the key with gradual staged reduction; Melissa still must confirm the exact preference."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Define the intended initial timing of both nonoperative and staged strategies so the options do not overlap.",
    "disposition": "revised",
    "response": "Reverified the 2026 ERNICA subgroup recommendation and recorded its expert-consensus/very-low-evidence limitation. Feedback explicitly compares the key with gradual staged reduction; Melissa still must confirm the exact preference."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Replace 'substantial' with relevant observed support and trajectory already supported by permitted evidence, without inventing a cutoff.",
    "disposition": "revised",
    "response": "Reverified the 2026 ERNICA subgroup recommendation and recorded its expert-consensus/very-low-evidence limitation. Feedback explicitly compares the key with gradual staged reduction; Melissa still must confirm the exact preference."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Have Melissa confirm the exact subgroup preference and its limitations. Explain why gradual staged reduction is less appropriate for this particular infant, rather than substituting forced primary reduction as the comparator.",
    "disposition": "revised",
    "response": "Reverified the 2026 ERNICA subgroup recommendation and recorded its expert-consensus/very-low-evidence limitation. Feedback explicitly compares the key with gradual staged reduction; Melissa still must confirm the exact preference."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.omphalocele-closure.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Ella Bennett",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.omphalocele-closure.v1",
  "chiefComplaint": "Closure plan review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 4-day-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.omphalocele-closure.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Closure plan review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 4-day-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside neonatal team asks for review of the initial abdominal-wall plan. A large sac at the cord base contains liver and bowel.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Sac and abdomen",
      "value": "The sac is intact. Most of the liver remains outside the abdominal cavity, and the abdominal domain is small."
    },
    {
      "label": "Cardiopulmonary record",
      "value": "Respiratory support remains substantial. Echocardiography documents pulmonary hypertension, with right-to-left ductal shunting."
    }
  ]
}
```

Task: Which initial abdominal-wall strategy is most appropriate for {patientName}?

**key shown first for review only**

1. Nonoperative sac care with delayed closure **[KEY]**

Feedback: The intact sac permits a delayed strategy, while marked respiratory disease and pulmonary hypertension weigh against forcing early reduction. Current expert guidance favors initial nonoperative care in this subgroup.

2. Staged reduction followed by surgical closure

Feedback: Staged reduction is a legitimate alternative in selected giant omphaloceles, but the current pulmonary compromise favors initially avoiding reduction and planning delayed closure.

3. Primary reduction with fascial closure

Feedback: Small domain and substantial cardiopulmonary compromise make immediate full reduction poorly supported in this record.

Explanation: The intact sac permits a delayed strategy, while marked respiratory disease and pulmonary hypertension weigh against forcing early reduction. Current expert guidance favors initial nonoperative care in this subgroup.

Evidence claims: claim.pediatric-gi-abdominal-wall.omphalocele-anatomy, claim.pediatric-gi-abdominal-wall.omphalocele-respiratory, claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy, claim.pediatric-gi-abdominal-wall.gastroschisis-pressure, claim.pediatric-gi-abdominal-wall.gastroschisis-silo.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: revised exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary-standalone.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Ella Bennett",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary-standalone.v2",
  "chiefComplaint": "Closure plan review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 4-day-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary-standalone.v2",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Closure plan review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 4-day-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside neonatal team is selecting the initial abdominal-wall plan. A sac at the cord base contains bowel and most of the liver.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Sac and abdomen",
      "value": "The sac remains intact. Most of the liver lies outside the abdominal cavity, whose domain is small."
    },
    {
      "label": "Respiratory course",
      "value": "She remains intubated. Serial assessments show increasing inspired oxygen and ventilator pressure requirements. Echocardiography shows right-to-left ductal shunting with elevated pulmonary arterial pressure."
    }
  ]
}
```

Task: Which abdominal-wall plan should the outside team begin now for {patientName}?

**key shown first for review only**

1. Protect the sac and defer reduction during stabilization **[KEY]**

Feedback: For the current pulmonary compromise, ERNICA favors initial nonoperative care with delayed closure. This preference concerns avoiding an additional reduction burden now; it also applies when the alternative is gradual staged reduction, not just forceful primary closure.

2. Begin staged reduction now and close after reduction

Feedback: Gradual reduction is a legitimate strategy for a giant omphalocele. The closest decision here is whether to start it during worsening respiratory support; current expert guidance favors nonoperative stabilization in this pulmonary subgroup. Staging is not inherently forceful or never appropriate.

3. Begin complete reduction now and close the fascia

Feedback: Limited abdominal domain and the current respiratory course make complete reduction with primary closure a poor initial strategy. Primary closure remains appropriate for selected smaller defects in a suitable physiological state.

Explanation: For the current pulmonary compromise, ERNICA favors initial nonoperative care with delayed closure. This preference concerns avoiding an additional reduction burden now; it also applies when the alternative is gradual staged reduction, not just forceful primary closure.

Evidence claims: claim.pediatric-gi-abdominal-wall.omphalocele-anatomy, claim.pediatric-gi-abdominal-wall.omphalocele-respiratory, claim.pediatric-gi-abdominal-wall.omphalocele-primary-context.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "Infer a liver-containing limited-domain omphalocele from the sac and organ position, then recognize active cardiopulmonary compromise from the trajectory and shunt.",
  "decision": "Choose nonoperative sac protection while stabilizing rather than starting even gradual reduction now.",
  "closestCredibleError": "Start staged reduction immediately because primary closure is unlikely in a large liver-containing defect.",
  "decidingObservation": "Escalating ventilator requirements and right-to-left ductal shunting occur before any planned reduction.",
  "consequenceOfError": "Starting reduction could add respiratory or hemodynamic burden during active pulmonary compromise.",
  "deletionTest": "Without the cardiopulmonary findings both staged and delayed giant-defect strategies remain reasonable; no unique ranking is claimed. Sac integrity and limited domain define the feasible strategies.",
  "counterfactual": "If the sac instead contained only a small amount of bowel, the infant breathed comfortably without pulmonary hypertension, and reduction produced no physiological change, primary reduction with fascial closure becomes the best offered definitive strategy.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2.primary"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "No invented numerical severity cutoff is supplied. Each label explicitly states what begins now and its closure timing, preventing staged reduction after future stabilization from overlapping the key.",
  "oneStageAndCategory": "All choices are initial abdominal-wall management plans now; respiratory stabilization is shared care and does not imply a new gameplay ICU.",
  "twoConsequentialSteps": "Infer a liver-containing limited-domain omphalocele from the sac and organ position, then recognize active cardiopulmonary compromise from the trajectory and shunt. Then Choose nonoperative sac protection while stabilizing rather than starting even gradual reduction now.",
  "residentDifficulty": "Predicted moderate: staged reduction is a credible nearest competitor; pulmonary trajectory, rather than defect size alone, selects the initial plan.",
  "oneBestAnswer": "Escalating ventilator requirements and right-to-left ductal shunting occur before any planned reduction. Counterfactual: If the sac instead contained only a small amount of bowel, the infant breathed comfortably without pulmonary hypertension, and reduction produced no physiological change, primary reduction with fascial closure becomes the best offered definitive strategy.",
  "sequenceAndFiniteProfileAttack": "Standalone named 4-day-old female outside-hospital record review. No prior answer, later episode or feedback is displayed; one finite profile preserves the constrained age and sex.",
  "repairAndRecheck": "Rechecked the exact 2026 ERNICA pulmonary-subgroup preference. Feedback now compares delayed care with gradual staged reduction directly. Stable giant cases are explicitly not assigned the same unique preference.",
  "remainingRisk": "Pulmonary-subgroup preference is expert consensus, with very-low certainty comparative evidence. Melissa must confirm this exact patient-level ranking; no fixed delayed-closure age or topical regimen is authored.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Revised once for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2.delayed",
    "label": "Protect the sac and defer reduction during stabilization",
    "rationale": "For the current pulmonary compromise, ERNICA favors initial nonoperative care with delayed closure. This preference concerns avoiding an additional reduction burden now; it also applies when the alternative is gradual staged reduction, not just forceful primary closure.",
    "temptation": "Use the pulmonary subgroup preference rather than defect size alone.",
    "correctUnder": "An intact liver-containing sac and major active respiratory or pulmonary vascular compromise.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
      "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2.staged",
    "label": "Begin staged reduction now and close after reduction",
    "rationale": "Gradual reduction is a legitimate strategy for a giant omphalocele. The closest decision here is whether to start it during worsening respiratory support; current expert guidance favors nonoperative stabilization in this pulmonary subgroup. Staging is not inherently forceful or never appropriate.",
    "temptation": "Choose a silo because limited domain prevents primary closure, without using the current pulmonary findings to decide when reduction should begin.",
    "correctUnder": "A specialist team selects staged repair in a sufficiently stabilized giant-omphalocele patient; the pulmonary preference no longer determines the same ranking.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2.primary",
    "label": "Begin complete reduction now and close the fascia",
    "rationale": "Limited abdominal domain and the current respiratory course make complete reduction with primary closure a poor initial strategy. Primary closure remains appropriate for selected smaller defects in a suitable physiological state.",
    "temptation": "Treat the intact sac as evidence that immediate complete closure is feasible.",
    "correctUnder": "An intact non-giant defect with a small bowel-only sac permits reduction without adverse physiological change.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
      "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory",
      "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context"
    ],
    "timingProfileId": null
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
    "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory",
    "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
    "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory",
    "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
    "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory",
    "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2.delayed",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
        "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2.staged",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2.primary",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
        "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory",
        "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
    "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory",
    "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context"
  ]
}
```

Constructed data policy: Patient age, chronology, reported findings and responses are fictional observations, not empirical thresholds or probabilities.

Exact current snapshot hashes:
```json
{
  "node": "d96a336f1377462b0ffd8f55fc28ca024778a3fde8c74aa13ee4e92fce8193bd",
  "question": "3d871fd7b48c8796c0333b8e16d6d53f7179e55bbe0db1da15982666dcf1e8c5",
  "clinicalCase": "00d3194a99cb781712f457068b2f15a02161b88c8a11057e30c00e697ec3f0de"
}
```

### question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1

Status: **revised**. Original verdict REVISE; original difficulty moderate; original two-step true. Revision passes 1.

Concrete response actions:

1. Specified that the first examination was therapeutic, completed and partially effective; the next proposed procedure is explicitly a repeat therapeutic intervention.
2. Supplied changes in contrast reach, pellet burden, distension and persistent drainage. The distinction now rests on actual response rather than an undefined diagnostic-versus-therapeutic label.
3. Removed the weaker distal-ileal rectal-irrigation foil. Feedback weighs the operative alternative against observed progress; the source limitation and exact clinical ranking remain explicit. No universal count or waiting threshold is authored.

Indexed review notes and responses:
```json
[
  {
    "category": "clarityIssues",
    "index": 0,
    "reviewNote": "The diagnostic record already describes a contrast enema reaching the distal ileum and passing meconium. The keyed 'Image-guided water-soluble contrast enema' does not state whether it is a repeat, completion or a materially different therapeutic procedure.",
    "disposition": "revised",
    "response": "Specified that the first examination was therapeutic, completed and partially effective; the next proposed procedure is explicitly a repeat therapeutic intervention."
  },
  {
    "category": "clarityIssues",
    "index": 1,
    "reviewNote": "The initial contrast examination's intent, adequacy and treatment response are insufficiently specified to judge whether conservative decompression has meaningfully failed.",
    "disposition": "revised",
    "response": "Specified that the first examination was therapeutic, completed and partially effective; the next proposed procedure is explicitly a repeat therapeutic intervention."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "The findings support meconium ileus without a supplied operative complication, and therapeutic contrast decompression after resuscitation is reasonable. Interpreting the anatomy and distinguishing uncomplicated disease from an operative complication are worthwhile linked judgments.",
    "disposition": "revised",
    "response": "Removed the weaker distal-ileal rectal-irrigation foil. Feedback weighs the operative alternative against observed progress; the source limitation and exact clinical ranking remain explicit. No universal count or waiting threshold is authored."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "The strongest fairness problem is procedural sequencing: the offered key may simply repeat the procedure already performed. Persistent distension after a diagnostic study and persistent obstruction after an adequate therapeutic course are different decision states; the stem does not clearly distinguish them.",
    "disposition": "revised",
    "response": "Specified that the first examination was therapeutic, completed and partially effective; the next proposed procedure is explicitly a repeat therapeutic intervention."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "Saline rectal irrigation is a weaker competitor for distal ileal pellets than for a colonic evacuation problem. The explanation says the key is 'reasonable' but does not resolve the operative alternative if adequate therapeutic attempts have already failed.",
    "disposition": "revised",
    "response": "Supplied changes in contrast reach, pellet burden, distension and persistent drainage. The distinction now rests on actual response rather than an undefined diagnostic-versus-therapeutic label."
  },
  {
    "category": "fairness",
    "index": 3,
    "reviewNote": "The single node contains its own clinical context, but internal chronology needs repair. No confident clinical inaccuracy is asserted about the intended uncomplicated-meconium-ileus strategy.",
    "disposition": "revised",
    "response": "Removed the weaker distal-ileal rectal-irrigation foil. Feedback weighs the operative alternative against observed progress; the source limitation and exact clinical ranking remain explicit. No universal count or waiting threshold is authored."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Specify what the completed examination actually attempted and accomplished, and label the proposed next enema as a repeat or therapeutic completion when appropriate.",
    "disposition": "revised",
    "response": "Removed the weaker distal-ileal rectal-irrigation foil. Feedback weighs the operative alternative against observed progress; the source limitation and exact clinical ranking remain explicit. No universal count or waiting threshold is authored."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Supply the supported response/adequacy observations that distinguish another contrast attempt from surgery. Do not invent a universal number of attempts or elapsed-time threshold.",
    "disposition": "revised",
    "response": "Removed the weaker distal-ileal rectal-irrigation foil. Feedback weighs the operative alternative against observed progress; the source limitation and exact clinical ranking remain explicit. No universal count or waiting threshold is authored."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Explain the closest operative alternative using the actual prior treatment, while retaining the resuscitation and complication findings.",
    "disposition": "revised",
    "response": "Removed the weaker distal-ileal rectal-irrigation foil. Feedback weighs the operative alternative against observed progress; the source limitation and exact clinical ranking remain explicit. No universal count or waiting threshold is authored."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.meconium-obstruction.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Isla Reed",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.meconium-obstruction.v1",
  "chiefComplaint": "Obstruction record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 2-day-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.meconium-obstruction.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Obstruction record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 2-day-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside neonatal record describes failure to pass meconium, bilious drainage and abdominal distension. Gastric decompression and IV resuscitation have restored perfusion.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Diagnostic contrast record",
      "value": "Contrast passes through a small-caliber colon into the distal ileum, outlining multiple intraluminal pellets. Some meconium passes, but distension persists."
    },
    {
      "label": "Reassessment",
      "value": "The abdomen is soft without erythema. Imaging shows no free intraperitoneal gas, volvulus or obstructing pseudocyst."
    }
  ]
}
```

Task: Which intervention should the outside team select next for {patientName}?

**key shown first for review only**

1. Image-guided water-soluble contrast enema **[KEY]**

Feedback: The study shows intraluminal meconium with continuity into the distal ileum, and current findings do not establish an operative complication. After resuscitation, a carefully supervised therapeutic contrast enema is a reasonable decompression strategy.

2. Operative exploration with bowel decompression

Feedback: Surgery is appropriate for complications or unsuccessful nonoperative decompression, but the current study and stable course support a supervised nonoperative attempt first.

3. Serial saline rectal irrigations

Feedback: A distal rectal decompression strategy does not directly address the demonstrated obstructing ileal meconium. The relevant pathway is image-guided decompression of the ileal contents.

Explanation: The study shows intraluminal meconium with continuity into the distal ileum, and current findings do not establish an operative complication. After resuscitation, a carefully supervised therapeutic contrast enema is a reasonable decompression strategy.

Evidence claims: claim.pediatric-gi-abdominal-wall.meconium-obstruction, claim.pediatric-gi-abdominal-wall.meconium-enema, claim.pediatric-gi-abdominal-wall.meconium-complicated, claim.pediatric-gi-abdominal-wall.hscr-biopsy, claim.pediatric-gi-abdominal-wall.hscr-irrigation.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: revised exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-standalone.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Isla Reed",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Female"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-standalone.v2",
  "chiefComplaint": "Obstruction record review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 2-day-old girl, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-standalone.v2",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Obstruction record review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 2-day-old girl, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside neonatal team has treated bilious drainage and distension with gastric decompression and IV fluids. She has completed a first image-guided therapeutic water-soluble contrast enema.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Therapeutic procedure record",
      "value": "Contrast traversed a small-caliber colon and entered the distal ileum around intraluminal pellets. During the procedure the contrast advanced farther proximally, pellet burden decreased and meconium passed; further ileal pellets remained."
    },
    {
      "label": "After the procedure",
      "value": "Distension decreased but persists with bilious gastric drainage. Perfusion and urine output are maintained. The abdomen is soft without erythema or guarding; imaging shows no free gas, volvulus or obstructing pseudocyst."
    }
  ]
}
```

Task: Which next decompression plan best fits {patientName}'s treatment response?

**key shown first for review only**

1. Repeat image-guided therapeutic contrast decompression **[KEY]**

Feedback: There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.

2. Proceed to operative bowel decompression

Feedback: Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.

3. Continue gastric drainage with observation

Feedback: Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.

Explanation: There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.

Evidence claims: claim.pediatric-gi-abdominal-wall.meconium-obstruction, claim.pediatric-gi-abdominal-wall.meconium-enema, claim.pediatric-gi-abdominal-wall.meconium-repeat, claim.pediatric-gi-abdominal-wall.meconium-complicated.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "The contrast progression, reduced pellet burden and partial improvement establish productive but incomplete therapeutic decompression, not just a diagnostic study or complete resolution.",
  "decision": "Combine continuing obstruction with maintained perfusion and absence of an operative complication to select another supervised therapeutic attempt.",
  "closestCredibleError": "Proceed to surgery because the first enema did not immediately clear all symptoms.",
  "decidingObservation": "Pellet burden and distension decreased while residual ileal pellets and bilious drainage remain.",
  "consequenceOfError": "An avoidable operation or untreated continuing obstruction could follow from confusing partial response with failure or resolution.",
  "deletionTest": "Without the actual response record, repeat versus surgery is ambiguous. Without residual burden and drainage, observation is more credible. Perfusion and the complication assessment establish safety eligibility.",
  "counterfactual": "If the same infant instead had free intraperitoneal gas after the procedure, operative bowel decompression and assessment becomes the best offered plan rather than another enema.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "Replaced the vague diagnostic enema with an explicitly completed therapeutic first procedure and described actual progress. The keyed label now says repeat therapeutic decompression. Saline rectal irrigation is replaced by the credible partial-resolution observation error.",
  "oneStageAndCategory": "All choices are the current decompression strategy after the same completed therapeutic procedure; background IV and gastric support are common.",
  "twoConsequentialSteps": "The contrast progression, reduced pellet burden and partial improvement establish productive but incomplete therapeutic decompression, not just a diagnostic study or complete resolution. Then Combine continuing obstruction with maintained perfusion and absence of an operative complication to select another supervised therapeutic attempt.",
  "residentDifficulty": "Predicted moderate: productive partial response must be distinguished both from failure and from resolution, then combined with the current complication boundary.",
  "oneBestAnswer": "Pellet burden and distension decreased while residual ileal pellets and bilious drainage remain. Counterfactual: If the same infant instead had free intraperitoneal gas after the procedure, operative bowel decompression and assessment becomes the best offered plan rather than another enema.",
  "sequenceAndFiniteProfileAttack": "Standalone named 2-day-old female outside-hospital record review. No prior answer, later episode or feedback is displayed; one finite profile preserves the constrained age and sex.",
  "repairAndRecheck": "Re-solved after changing response to absent progress and after adding perforation. No mandatory number of attempts or elapsed waiting interval is introduced; incomplete progress is not automatically failure.",
  "remainingRisk": "One licensed systematic review with heterogeneous protocols supports repeat enemas, not a compulsory next step for every partial response. Melissa and pediatric radiology must confirm that this precise degree of progress reasonably favors another attempt over surgery.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Revised once for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.repeat",
    "label": "Repeat image-guided therapeutic contrast decompression",
    "rationale": "There is persistent obstruction, but the first therapeutic attempt produced anatomical and clinical progress. In this resuscitated infant without an operative complication, another supervised contrast attempt is preferred to declaring failure or assuming resolution. No universal attempt count or interval is implied.",
    "temptation": "Interpret response and eligibility together instead of treating any residual distension as failure.",
    "correctUnder": "Productive but incomplete decompression in uncomplicated meconium ileus with maintained perfusion.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
      "claim.pediatric-gi-abdominal-wall.meconium-enema",
      "claim.pediatric-gi-abdominal-wall.meconium-repeat",
      "claim.pediatric-gi-abdominal-wall.meconium-complicated"
    ],
    "timingProfileId": "timing.test.combined_diagnostic"
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
    "label": "Proceed to operative bowel decompression",
    "rationale": "Surgery is the meaningful alternative when obstruction persists without effective nonoperative progress or complications develop. Here the first therapeutic procedure demonstrably reduced the burden, and current findings support another supervised attempt.",
    "temptation": "Treat continued drainage after one incomplete response as established failure of the entire nonoperative course.",
    "correctUnder": "Perforation, volvulus or persistent obstruction despite an adequately assessed unsuccessful nonoperative course.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.meconium-complicated",
      "claim.pediatric-gi-abdominal-wall.meconium-repeat"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
    "label": "Continue gastric drainage with observation",
    "rationale": "Passing some meconium does not establish complete ileal clearance. Ongoing bilious drainage and residual pellets make passive observation a weaker decompression plan than continued directed treatment.",
    "temptation": "Equate partial meconium passage with resolution.",
    "correctUnder": "The obstruction has resolved, with improving distension and gastric drainage and no residual obstructing burden.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
      "claim.pediatric-gi-abdominal-wall.meconium-repeat"
    ],
    "timingProfileId": null
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
    "claim.pediatric-gi-abdominal-wall.meconium-enema",
    "claim.pediatric-gi-abdominal-wall.meconium-repeat",
    "claim.pediatric-gi-abdominal-wall.meconium-complicated"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
    "claim.pediatric-gi-abdominal-wall.meconium-enema",
    "claim.pediatric-gi-abdominal-wall.meconium-repeat",
    "claim.pediatric-gi-abdominal-wall.meconium-complicated"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
    "claim.pediatric-gi-abdominal-wall.meconium-enema",
    "claim.pediatric-gi-abdominal-wall.meconium-repeat",
    "claim.pediatric-gi-abdominal-wall.meconium-complicated"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.repeat",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
        "claim.pediatric-gi-abdominal-wall.meconium-enema",
        "claim.pediatric-gi-abdominal-wall.meconium-repeat",
        "claim.pediatric-gi-abdominal-wall.meconium-complicated"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.meconium-complicated",
        "claim.pediatric-gi-abdominal-wall.meconium-repeat"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
        "claim.pediatric-gi-abdominal-wall.meconium-repeat"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
    "claim.pediatric-gi-abdominal-wall.meconium-enema",
    "claim.pediatric-gi-abdominal-wall.meconium-repeat",
    "claim.pediatric-gi-abdominal-wall.meconium-complicated"
  ]
}
```

Constructed data policy: Patient age, chronology, reported findings and responses are fictional observations, not empirical thresholds or probabilities.

Exact current snapshot hashes:
```json
{
  "node": "58bab61235bd6da190dec3e27925e86c787cf7a2e71bd8c3f14a7f1f18a5de18",
  "question": "f0a196c1be8166afcb583741decca5950ea206981d345ae744e6dea1e190e492",
  "clinicalCase": "5e6023d415f67e45260d1f21a1fc7068f1b4fff862261eebecbd72a2de1291c5"
}
```

### question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v1

Status: **revised**. Original verdict REVISE; original difficulty easy; original two-step false. Revision passes 1.

Concrete response actions:

1. Kept COG/North American context and replaced the operative-eligibility conclusion with continuous renal-vein/caval imaging and the superior extent.
2. The pediatric center is shared context for every option. All labels now compare treatment sequences with similar scope.
3. Changed the scored meaning to the verified high-caval exception and pretreatment histology decision, with a new concept ID and exact predecessor retained. The sequence does not reveal or require any companion node.

Indexed review notes and responses:
```json
[
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "the lesion can be removed intact without resecting an adjacent organ",
      "why": "This is an authored operative-eligibility conclusion rather than just an anatomic observation. It supplies the principal reason for the surgery-first answer."
    },
    "disposition": "revised",
    "response": "The pediatric center is shared context for every option. All labels now compare treatment sequences with similar scope."
  },
  {
    "category": "cues",
    "index": 1,
    "reviewNote": {
      "phrase": "Up-front nephrectomy at the pediatric center",
      "why": "Only the key repeats the already supplied specialist-center setting. That qualifier adds reassuring specificity without distinguishing an actual alternative setting."
    },
    "disposition": "revised",
    "response": "The pediatric center is shared context for every option. All labels now compare treatment sequences with similar scope."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "Up-front nephrectomy is the best offered plan under the stated COG pathway for the typical, unilateral, explicitly resectable presentation. Stating COG is necessary to avoid conflating different treatment paradigms; it should not be removed to manufacture difficulty.",
    "disposition": "revised",
    "response": "Changed the scored meaning to the verified high-caval exception and pretreatment histology decision, with a new concept ID and exact predecessor retained. The sequence does not reveal or require any companion node."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "The candidate supplies both the tumor interpretation and the resectability conclusion, leaving recall of the protocol's usual sequence. Biopsy-first and chemotherapy-first plans are recognizable real alternatives, but the case has already announced why neither is intended here.",
    "disposition": "revised",
    "response": "Kept COG/North American context and replaced the operative-eligibility conclusion with continuous renal-vein/caval imaging and the superior extent."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The explanation's biopsy/stage caution is consistent with the intended concept; no confident clinical error identified. The first node stands alone. It does not explicitly give away regional-node sampling in the next node.",
    "disposition": "revised",
    "response": "The pediatric center is shared context for every option. All labels now compare treatment sequences with similar scope."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Keep the named treatment pathway and replace the resectability conclusion with concrete relevant anatomic observations that the resident must apply.",
    "disposition": "revised",
    "response": "Changed the scored meaning to the verified high-caval exception and pretreatment histology decision, with a new concept ID and exact predecessor retained. The sequence does not reveal or require any companion node."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Put the pediatric-center setting in shared context and use equally scoped plan labels.",
    "disposition": "revised",
    "response": "Changed the scored meaning to the verified high-caval exception and pretreatment histology decision, with a new concept ID and exact predecessor retained. The sequence does not reveal or require any companion node."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Make a genuine protocol exception or treatment-sequencing distinction consequential, with supported criteria. Otherwise classify this as easy protocol recall and seek explicit acceptance for that purpose.",
    "disposition": "revised",
    "response": "Changed the scored meaning to the verified high-caval exception and pretreatment histology decision, with a new concept ID and exact predecessor retained. The sequence does not reveal or require any companion node."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.renal-mass-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Noah Bennett",
  "prototypeDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.renal-mass-course.v1",
  "chiefComplaint": "Renal mass review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.renal-mass-course.v1",
      "prototypeDemographics": {
        "ageYears": 5,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Renal mass review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside pediatric oncology center uses the COG/North American Wilms pathway. The team reviews his initial renal-mass records before treatment.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Anatomic review",
      "value": "The mass is centered in the right kidney; the left kidney is normal. The renal vein and vena cava are patent, and the lesion can be removed intact without resecting an adjacent organ."
    },
    {
      "label": "Staging review",
      "value": "Imaging shows no distant disease. The multidisciplinary radiology review describes the appearance as typical of Wilms tumor; no tissue has yet been obtained."
    }
  ]
}
```

Task: Which initial tumor-directed plan best fits {patientName}'s record?

**key shown first for review only**

1. Up-front nephrectomy at the pediatric center **[KEY]**

Feedback: Under the stated COG pathway, a typical resectable unilateral Wilms-pattern renal mass generally proceeds to nephrectomy. Biopsy first is not required for this presentation and can change local stage.

2. Core biopsy followed by preoperative chemotherapy

Feedback: This is a credible route for atypical or unresectable disease, but the stated anatomy and COG context do not establish that indication.

3. Preoperative chemotherapy followed by nephrectomy

Feedback: That is a valid strategy in another Wilms framework and selected COG circumstances, but is not the initial plan for this typical resectable unilateral COG presentation.

Explanation: Under the stated COG pathway, a typical resectable unilateral Wilms-pattern renal mass generally proceeds to nephrectomy. Biopsy first is not required for this presentation and can change local stage.

Evidence claims: claim.pediatric-gi-abdominal-wall.wilms-no-biopsy, claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage, claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: revised exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-standalone.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Noah Bennett",
  "prototypeDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-standalone.v2",
  "chiefComplaint": "Renal mass review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-standalone.v2",
      "prototypeDemographics": {
        "ageYears": 5,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Renal mass review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside pediatric oncology center uses the COG/North American Wilms pathway. The team is selecting his initial treatment sequence for a renal mass.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Anatomic imaging",
      "value": "A mass expands the right renal parenchyma. The left kidney is normal. Enhancing tissue extends continuously from the right renal vein into the vena cava; its upper edge reaches the hepatic-vein confluence."
    },
    {
      "label": "Specialist review",
      "value": "The imaging appearance is typical of Wilms tumor. The staging review shows no distant lesions."
    }
  ]
}
```

Task: Which initial tumor-directed sequence should the outside team select for {patientName}?

**key shown first for review only**

1. Biopsy, preoperative chemotherapy, then resection **[KEY]**

Feedback: The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.

2. Nephrectomy with thrombectomy, then chemotherapy

Feedback: Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step.

3. Preoperative chemotherapy, then resection histology

Feedback: This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted.

Explanation: The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.

Evidence claims: claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first, claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions, claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage, claim.pediatric-gi-abdominal-wall.wilms-no-biopsy.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "Recognize continuous renal-vein and caval extension and locate its superior extent at the hepatic veins rather than merely label a unilateral renal tumor.",
  "decision": "Apply the COG vascular exception and preserve its pretreatment histology requirement when selecting the sequence.",
  "closestCredibleError": "Perform up-front nephrectomy and thrombectomy because the tumor is unilateral and staging is localized.",
  "decidingObservation": "The upper end of continuous enhancing intravascular tissue reaches the hepatic-vein confluence.",
  "consequenceOfError": "Major high-caval surgery could be undertaken before the recommended preoperative-treatment assessment, or therapy begun under an unstated protocol.",
  "deletionTest": "Removing the upper caval extent makes usual COG surgery-first plausible. Removing the named COG framework makes chemotherapy before resection histology a competing paradigm. Contralateral normality avoids a separate bilateral exception.",
  "counterfactual": "If imaging instead confined the venous extension to the renal vein below the cava, with otherwise suitable unilateral resection anatomy and no other preoperative-treatment exception, nephrectomy with thrombectomy followed by chemotherapy becomes the best offered sequence.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "Removed the authored safe-resection conclusion and the key-only pediatric-center qualifier. All options are comparably specified treatment sequences; the intravascular anatomy must be interpreted.",
  "oneStageAndCategory": "Three initial tumor-directed sequences in the same specialist and protocol context; no incidental test or unrelated treatment competes.",
  "twoConsequentialSteps": "Recognize continuous renal-vein and caval extension and locate its superior extent at the hepatic veins rather than merely label a unilateral renal tumor. Then Apply the COG vascular exception and preserve its pretreatment histology requirement when selecting the sequence.",
  "residentDifficulty": "Predicted moderate/hard: default COG surgery-first and the biopsy-upstaging caution compete with a genuine high-caval exception and its histology requirement.",
  "oneBestAnswer": "The upper end of continuous enhancing intravascular tissue reaches the hepatic-vein confluence. Counterfactual: If imaging instead confined the venous extension to the renal vein below the cava, with otherwise suitable unilateral resection anatomy and no other preoperative-treatment exception, nephrectomy with thrombectomy followed by chemotherapy becomes the best offered sequence.",
  "sequenceAndFiniteProfileAttack": "Standalone named 5-year-old male outside-hospital record review. No prior answer, later episode or feedback is displayed; one finite profile preserves the constrained age and sex.",
  "repairAndRecheck": "Reverified NCI wording at or above the hepatic veins. Re-solved after moving the extent to the renal vein. No exact chemotherapy regimen, duration or required shrinkage threshold is invented.",
  "remainingRisk": "NCI is a professional government evidence summary rather than the full COG protocol. Melissa and pediatric oncology must confirm the current exact sequence and biopsy plan; no local approval is implied.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Revised once for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.biopsy",
    "label": "Biopsy, preoperative chemotherapy, then resection",
    "rationale": "The caval extension reaches the hepatic veins, an exception to the usual up-front nephrectomy pathway. Under the stated framework, obtain histology and use preoperative chemotherapy before reassessing resection. The usual caution about biopsy upstaging does not erase this exception.",
    "temptation": "Apply the vascular extent and the named protocol together.",
    "correctUnder": "Presumed Wilms tumor whose caval extension reaches the hepatic-vein level.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
      "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
      "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage"
    ],
    "timingProfileId": "timing.test.biopsy"
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy",
    "label": "Nephrectomy with thrombectomy, then chemotherapy",
    "rationale": "Up-front nephrectomy is usual for a typical resectable unilateral mass, but the superior caval extent changes the preferred sequence here. Localized staging does not by itself establish that immediate thrombectomy is the right first step.",
    "temptation": "Generalize the usual COG surgery-first pathway to every unilateral tumor without metastatic disease.",
    "correctUnder": "A typical unilateral tumor without the high caval extension or another preoperative-treatment exception can undergo up-front resection.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy",
      "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
      "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.chemotherapy",
    "label": "Preoperative chemotherapy, then resection histology",
    "rationale": "This sequence postpones the tissue diagnosis until resection. The named COG pathway for this exception calls for biopsy with preoperative therapy; a different treatment framework should not be silently substituted.",
    "temptation": "Use a familiar preoperative-chemotherapy paradigm without retaining the stated COG histology requirement.",
    "correctUnder": "A protocol explicitly permitting initial treatment of a typical renal mass without pretreatment biopsy governs the patient.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first"
    ],
    "timingProfileId": null
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
    "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
    "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
    "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
    "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
    "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
    "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
    "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
    "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
    "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.biopsy",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
        "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
        "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy",
        "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
        "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.chemotherapy",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
    "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
    "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
    "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy"
  ]
}
```

Constructed data policy: Patient age, chronology, reported findings and responses are fictional observations, not empirical thresholds or probabilities.

Exact current snapshot hashes:
```json
{
  "node": "e1cd051092d60bdb3ad143b047ff0bfed398e0e6c091c3b86595dd30641bc796",
  "question": "80bee6ef43cb7be685280ddc9199a76eca8d3c3284f3c85a5c07b6daf75f768e",
  "clinicalCase": "0b6e12a22066e24b35493f61c9c8aa001708be1fd76365e485022ecad150ecf0"
}
```

### question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v1

Status: **revised**. Original verdict REVISE; original difficulty easy; original two-step false. Revision passes 1.

Concrete response actions:

1. Restated presumed Wilms and COG/North American context directly in the node, so it is fully self-contained.
2. Replaced the repeated normal-appearance rule with a specimen-completeness decision before closure. Raw adipose-and-vessel histology must be interpreted before choosing whether sampling is finished; no ornamental measurements added.
3. Preserved normal gross findings as the under-staging temptation and kept actual regional sampling distinct from formal clearance. New meaning receives its own concept identity; no unverified postoperative reoperation recommendation is introduced.

Indexed review notes and responses:
```json
[
  {
    "category": "clarityIssues",
    "index": 0,
    "reviewNote": "The current update and exhibit say only 'nephrectomy' and 'kidney mass.' They do not restate the presumed Wilms diagnosis or COG context. The shared presentation is a generic record review, so the node is not fully self-contained when presented independently.",
    "disposition": "revised",
    "response": "Restated presumed Wilms and COG/North American context directly in the node, so it is fully self-contained."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "Given the preceding Wilms context, regional lymph-node sampling is the best offered strategy despite normal imaging and gross appearance. Formal lymphadenectomy is a credible over-treatment error; omission is the under-staging error.",
    "disposition": "revised",
    "response": "Replaced the repeated normal-appearance rule with a specimen-completeness decision before closure. Raw adipose-and-vessel histology must be interpreted before choosing whether sampling is finished; no ornamental measurements added."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "Normal appearance is necessary to test the misconception, not an unfair cue. However, the answer remains the standard sampling requirement; normal size and softness do not create a second consequential decision or a difficult staging interpretation.",
    "disposition": "revised",
    "response": "Preserved normal gross findings as the under-staging temptation and kept actual regional sampling distinct from formal clearance. New meaning receives its own concept identity; no unverified postoperative reoperation recommendation is introduced."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The pair is coherent, and the earlier explanation does not teach node sampling. Standalone fairness is weaker because the tumor identity is supplied only by the preceding node and the post-answer explanation.",
    "disposition": "revised",
    "response": "Restated presumed Wilms and COG/North American context directly in the node, so it is fully self-contained."
  },
  {
    "category": "fairness",
    "index": 3,
    "reviewNote": "No confident clinical error identified in the sampling explanation when applied to Wilms tumor. The rule should not be generalized to every unspecified pediatric renal operation.",
    "disposition": "revised",
    "response": "Replaced the repeated normal-appearance rule with a specimen-completeness decision before closure. Raw adipose-and-vessel histology must be interpreted before choosing whether sampling is finished; no ornamental measurements added."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Restate the presumed Wilms diagnosis and applicable treatment context in the current node.",
    "disposition": "revised",
    "response": "Preserved normal gross findings as the under-staging temptation and kept actual regional sampling distinct from formal clearance. New meaning receives its own concept identity; no unverified postoperative reoperation recommendation is introduced."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Retain this high-yield rule as an explicitly accepted easy item, or test a separate staging/completeness decision whose findings alter what must be done; do not add decorative nodal measurements.",
    "disposition": "revised",
    "response": "Preserved normal gross findings as the under-staging temptation and kept actual regional sampling distinct from formal clearance. New meaning receives its own concept identity; no unverified postoperative reoperation recommendation is introduced."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Keep the distinction between regional sampling and formal lymphadenectomy clear in feedback.",
    "disposition": "revised",
    "response": "Preserved normal gross findings as the under-staging temptation and kept actual regional sampling distinct from formal clearance. New meaning receives its own concept identity; no unverified postoperative reoperation recommendation is introduced."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.renal-mass-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Noah Bennett",
  "prototypeDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.renal-mass-course.v1",
  "chiefComplaint": "Renal mass review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.renal-mass-course.v1",
      "prototypeDemographics": {
        "ageYears": 5,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Renal mass review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: At {patientName}'s planned outside nephrectomy, the operative team reviews the regional-node plan.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Preoperative nodal imaging",
      "value": "No regional lymph node is enlarged or radiologically suspicious."
    },
    {
      "label": "Operative inspection",
      "value": "The visible regional nodes are small and soft. The kidney mass remains intact without rupture or spill."
    }
  ]
}
```

Task: Which regional-node strategy is appropriate during {patientName}'s nephrectomy?

**key shown first for review only**

1. Sample regional lymph nodes **[KEY]**

Feedback: Normal size, imaging and gross appearance do not reliably establish negative microscopic nodes. Regional sampling is required for local Wilms staging.

2. Omit regional lymph-node sampling

Feedback: Normal imaging and inspection cannot replace histologic regional staging. An intact primary tumor does not establish a negative nodal stage.

3. Perform formal retroperitoneal lymphadenectomy

Feedback: The goal is representative regional staging, not routine radical node clearance. Grossly normal nodes do not create an indication for a more extensive dissection.

Explanation: Normal size, imaging and gross appearance do not reliably establish negative microscopic nodes. Regional sampling is required for local Wilms staging.

Evidence claims: claim.pediatric-gi-abdominal-wall.wilms-nodes.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: revised exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.wilms-normal-node-sampling-standalone.v2",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "conceptId": "concept.pediatric-gi-abdominal-wall.wilms-nodal-sample-adequacy.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Noah Bennett",
  "prototypeDemographics": {
    "ageYears": 5,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.wilms-normal-node-sampling-standalone.v2",
  "chiefComplaint": "Renal mass review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.wilms-normal-node-sampling-standalone.v2",
      "prototypeDemographics": {
        "ageYears": 5,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Renal mass review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 5-year-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName} is undergoing outside nephrectomy for presumed unilateral Wilms tumor under a COG/North American pathway. Before closure, the surgeon reviews the regional sampling record.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Nodal assessment",
      "value": "Preoperative imaging shows no suspicious regional nodes. The visible hilar and periaortic nodes are small and soft."
    },
    {
      "label": "Submitted specimen",
      "value": "The only separate specimen was labelled right hilar tissue. The pathologist reports the entire submitted fragment as mature adipose tissue and small vessels, with no malignant cells identified."
    }
  ]
}
```

Task: Which regional-node plan should the outside team select before completing {patientName}'s operation?

**key shown first for review only**

1. Submit hilar and periaortic node samples **[KEY]**

Feedback: The reported fragment is fat and vessels, not a histologically assessed lymph-node sample. No malignant cells in that fragment cannot establish regional node status. Obtain actual regional samples rather than rely on normal appearance or perform formal clearance.

2. Close without further regional-node sampling

Feedback: The negative phrase applies to the tissue actually submitted. It does not establish that regional nodes were sampled, and their normal appearance is not a reliable substitute for histology.

3. Perform formal retroperitoneal node clearance

Feedback: The unresolved task is staging with regional samples. Formal retroperitoneal clearance is not the required sampling operation and is not justified merely because the submitted fragment missed nodal tissue.

Explanation: The reported fragment is fat and vessels, not a histologically assessed lymph-node sample. No malignant cells in that fragment cannot establish regional node status. Obtain actual regional samples rather than rely on normal appearance or perform formal clearance.

Evidence claims: claim.pediatric-gi-abdominal-wall.wilms-nodes, claim.pediatric-gi-abdominal-wall.wilms-sample-provenance, claim.pediatric-gi-abdominal-wall.wilms-sampling-extent.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "The reassuring pathology result applies to fat and vessels, so it has not established the status of the intended lymph nodes.",
  "decision": "Choose regional staging samples of the appropriate scope rather than omit further sampling or escalate to formal clearance.",
  "closestCredibleError": "Close because no malignant cells were found and both imaging and gross nodes appear reassuring.",
  "decidingObservation": "The entire only submitted regional fragment contains adipose tissue and vessels; actual nodal tissue has not been represented.",
  "consequenceOfError": "An unstaged regional basin may be incorrectly recorded as negative and affect subsequent treatment assessment.",
  "deletionTest": "Removing specimen composition collapses the new tissue-provenance decision into the original sampling-rule recall. Removing normal gross findings weakens the credible temptation to accept the submitted negative phrase. The before-closure stage makes this a current completion decision, not an invented reoperation rule.",
  "counterfactual": "If the report instead documented represented hilar and periaortic lymph nodes with negative histology, all suspicious basins had been sampled and no other staging issue remained, closure without further regional sampling becomes the best offered plan.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.close"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "Restated tumor and COG context. Used the raw tissue description rather than a conclusion that nodal sampling failed. No decorative measurements or fixed node quota is supplied.",
  "oneStageAndCategory": "All options are the regional operative completion plan before closure in the same operation.",
  "twoConsequentialSteps": "The reassuring pathology result applies to fat and vessels, so it has not established the status of the intended lymph nodes. Then Choose regional staging samples of the appropriate scope rather than omit further sampling or escalate to formal clearance.",
  "residentDifficulty": "Predicted moderate: a superficially benign pathology phrase is tempting only if its specimen provenance is ignored. Formal clearance remains the credible overtreatment error.",
  "oneBestAnswer": "The entire only submitted regional fragment contains adipose tissue and vessels; actual nodal tissue has not been represented. Counterfactual: If the report instead documented represented hilar and periaortic lymph nodes with negative histology, all suspicious basins had been sampled and no other staging issue remained, closure without further regional sampling becomes the best offered plan.",
  "sequenceAndFiniteProfileAttack": "Standalone named 5-year-old male outside-hospital record review. No prior answer, later episode or feedback is displayed; one finite profile preserves the constrained age and sex.",
  "repairAndRecheck": "Re-solved with actual nodes represented in both named basins; closure then wins. The scenario supplies an intraoperative pathology communication without teaching routine frozen sections or a mandatory minimum count.",
  "remainingRisk": "NCI supports actual regional nodal sampling and its scope. The constructed report is a provenance application; Melissa must confirm clinical realism and that additional samples are the best exact before-closure action.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Revised once for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.sample",
    "label": "Submit hilar and periaortic node samples",
    "rationale": "The reported fragment is fat and vessels, not a histologically assessed lymph-node sample. No malignant cells in that fragment cannot establish regional node status. Obtain actual regional samples rather than rely on normal appearance or perform formal clearance.",
    "temptation": "Interpret specimen provenance before accepting a reassuring negative phrase.",
    "correctUnder": "The intended nodal submission contains no represented lymph-node tissue.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-nodes",
      "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
      "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
    ],
    "timingProfileId": "timing.test.biopsy"
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.close",
    "label": "Close without further regional-node sampling",
    "rationale": "The negative phrase applies to the tissue actually submitted. It does not establish that regional nodes were sampled, and their normal appearance is not a reliable substitute for histology.",
    "temptation": "Read no malignant cells as a completed negative regional stage without checking specimen composition.",
    "correctUnder": "The operative and pathology records already establish representative hilar and periaortic node sampling with no remaining suspicious basin or other staging concern.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-nodes",
      "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.dissection",
    "label": "Perform formal retroperitoneal node clearance",
    "rationale": "The unresolved task is staging with regional samples. Formal retroperitoneal clearance is not the required sampling operation and is not justified merely because the submitted fragment missed nodal tissue.",
    "temptation": "Overcorrect an incomplete sample by treating sampling as a formal clearance indication.",
    "correctUnder": "A separate, established oncologic indication for that operation exists; the current specimen error by itself is not such an indication.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
    ],
    "timingProfileId": null
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.wilms-nodes",
    "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
    "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.wilms-nodes",
    "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
    "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.wilms-nodes",
    "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
    "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.sample",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.wilms-nodes",
        "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
        "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.close",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.wilms-nodes",
        "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.dissection",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.wilms-nodes",
    "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
    "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
  ]
}
```

Constructed data policy: Patient age, chronology, reported findings and responses are fictional observations, not empirical thresholds or probabilities.

Exact current snapshot hashes:
```json
{
  "node": "c52ef08c34cf5792291fd72fe96ae563de6dff2327d0f3ef0250615b8300aa79",
  "question": "3b1cc59752689a5f2c7d5ddfdd2cea0796a434d58e27889819f8a35d0fc35ab6",
  "clinicalCase": "8e98b0a059a442f8b70198bc59d5adfb9afe10d92e652dd120d2a4a4e45b33fd"
}
```

### question.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1

Status: **parked**. Original verdict REVISE; original difficulty moderate; original two-step true. Revision passes 1.

Concrete response actions:

1. Accepted both cue findings. The redundant organ exclusion and named missing information would be removed in a future supported version; the raw mass-kidney relationship and arterial encasement remain essential.
2. Retained the valid origin-plus-operative-risk teaching point in the parked rationale. It is not recast as a universal adrenal-mass biopsy rule.
3. Parked rather than substitute an overlapping biopsy method or an unvetted third option. Pediatric oncology must provide a credible same-stage alternative whose ranking depends on the current anatomy.

Indexed review notes and responses:
```json
[
  {
    "category": "cues",
    "index": 0,
    "reviewNote": {
      "phrase": "There is no renal-parenchymal mass / Perform an up-front radical nephrectomy",
      "why": "The exhibit explicitly excludes the target organ of this distractor, making nephrectomy an easily discarded foil. The displacement description already supplies the anatomic relationship."
    },
    "disposition": "parked",
    "response": "Retained the valid origin-plus-operative-risk teaching point in the parked rationale. It is not recast as a universal adrenal-mass biopsy rule."
  },
  {
    "category": "cues",
    "index": 1,
    "reviewNote": {
      "phrase": "No tissue diagnosis is available / Obtain a core biopsy for tumor characterization",
      "why": "Only the key repairs the named missing information; both alternatives are definitive operations. This creates a cautious-test shortcut before vessel encasement is interpreted."
    },
    "disposition": "parked",
    "response": "Retained the valid origin-plus-operative-risk teaching point in the parked rationale. It is not recast as a universal adrenal-mass biopsy rule."
  },
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "The suprarenal origin, raised VMA/HVA and major-vessel involvement support the intended neuroblastic-tumor workup. Biopsy for characterization is the best offered initial procedural plan; complete up-front resection is the meaningful competing error.",
    "disposition": "parked",
    "response": "Parked rather than substitute an overlapping biopsy method or an unvetted third option. Pediatric oncology must provide a credible same-stage alternative whose ranking depends on the current anatomy."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "The intended two steps are present: localize/interpret the tumor pattern, then use surgical-risk anatomy to choose diagnosis before definitive resection. The anatomically excluded nephrectomy and explicit information-gap sentence weaken that reasoning test.",
    "disposition": "parked",
    "response": "Accepted both cue findings. The redundant organ exclusion and named missing information would be removed in a future supported version; the raw mass-kidney relationship and arterial encasement remain essential."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The standalone task is complete and no confident clinical inaccuracy is identified. The explanation is appropriately tied to this tumor pattern rather than offering biopsy as a general rule for every adrenal mass.",
    "disposition": "parked",
    "response": "Retained the valid origin-plus-operative-risk teaching point in the parked rationale. It is not recast as a universal adrenal-mass biopsy rule."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Replace radical nephrectomy with a genuinely credible tumor-workup or procedural alternative at this stage, vetted by a clinician.",
    "disposition": "parked",
    "response": "Parked rather than substitute an overlapping biopsy method or an unvetted third option. Pediatric oncology must provide a credible same-stage alternative whose ranking depends on the current anatomy."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Keep the mass-kidney relationship and vessel findings. Remove the redundant organ-exclusion sentence if those observations already establish origin.",
    "disposition": "parked",
    "response": "Parked rather than substitute an overlapping biopsy method or an unvetted third option. Pediatric oncology must provide a credible same-stage alternative whose ranking depends on the current anatomy."
  },
  {
    "category": "suggestions",
    "index": 2,
    "reviewNote": "Make vessel involvement determine the choice between comparably specified plans; avoid a unique named-omission-to-biopsy match.",
    "disposition": "parked",
    "response": "Parked rather than substitute an overlapping biopsy method or an unvetted third option. Pediatric oncology must provide a credible same-stage alternative whose ranking depends on the current anatomy."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.adrenal-mass-course.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Mason Lee",
  "prototypeDemographics": {
    "ageYears": 6,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.adrenal-mass-course.v1",
  "chiefComplaint": "Abdominal mass review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 6-year-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.adrenal-mass-course.v1",
      "prototypeDemographics": {
        "ageYears": 6,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Abdominal mass review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 6-year-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName}'s outside pediatric tumor team asks for review of his initial abdominal-mass workup.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Anatomical report",
      "value": "The left suprarenal mass displaces the kidney inferiorly and surrounds the origins of the celiac and superior mesenteric arteries. There is no renal-parenchymal mass or distant disease on staging studies."
    },
    {
      "label": "Biochemical record",
      "value": "Urinary VMA and HVA are above the laboratory's age-adjusted reference ranges. No tissue diagnosis is available."
    }
  ]
}
```

Task: Which initial procedural plan is most appropriate for {patientName}'s mass?

**key shown first for review only**

1. Obtain a core biopsy for tumor characterization **[KEY]**

Feedback: The extrarenal catecholamine-associated pattern suggests a neuroblastic tumor, and major-vessel encasement is an imaging-defined surgical risk. Obtain tissue to guide risk-based therapy rather than attempt an up-front definitive resection.

2. Attempt complete up-front tumor resection

Feedback: No distant disease does not make major-vessel encasement low-risk. The record supports tissue characterization before a definitive resection strategy.

3. Perform an up-front radical nephrectomy

Feedback: The kidney is displaced rather than the site of the mass. Applying the typical Wilms strategy would remove an organ without addressing the stated extrarenal origin and vessel involvement.

Explanation: The extrarenal catecholamine-associated pattern suggests a neuroblastic tumor, and major-vessel encasement is an imaging-defined surgical risk. Obtain tissue to guide risk-based therapy rather than attempt an up-front definitive resection.

Evidence claims: claim.pediatric-gi-abdominal-wall.neuroblastoma-evaluation, claim.pediatric-gi-abdominal-wall.neuroblastoma-vascular-risk, claim.pediatric-gi-abdominal-wall.neuroblastoma-biopsy, claim.pediatric-gi-abdominal-wall.wilms-no-biopsy.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: parked; no executable scored key

```json
{
  "reviewedQuestionVariantId": "question.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1",
  "reviewedNodeId": "node.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1",
  "status": "parked",
  "reason": "A biopsy-versus-primary-resection decision is supported by the vessel anatomy, but the third anatomically credible same-stage option was not established. Core and incisional biopsy overlap, while observation or chemotherapy without adequate characterization would need different supported eligibility. A three-option fair moderate version could not be completed in this bounded pass.",
  "attemptedRevision": "Considered deleting explicit no renal mass/no tissue sentences and replacing nephrectomy with incisional biopsy, observation or chemotherapy before histology. Incisional biopsy is also a supported L2 approach; the other choices require additional patient-specific criteria and would be weak or unsafe as written.",
  "clinicalReviewStatus": "needs_clinician_review",
  "keyState": "No current executable question or scored key; original reviewed v1 retained only in reviewInput.",
  "reopenOwner": "Manager with Melissa and the relevant pediatric specialist",
  "reviewInputPointer": "independentReviewFollowup.reviewInput.proposals[questionVariantId=question.pediatric-gi-abdominal-wall.neuroblastoma-risk-biopsy.v1]"
}
```

A fair harder version was assessed once and could not be completed from the supported facts. The archived key is not a current proposal. Reopening belongs to the manager with Melissa and the named specialty.

### question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1

Status: **pass-preserved**. Original verdict PASS; original difficulty moderate; original two-step true. Revision passes 0.

Concrete response actions:

1. Preserve the exact independent-PASS clinical wording, choices, feedback, header and finite profile; do not apply optional copyedits.
2. Retain original complete reviewed objects and hashes. Only the two extracted standalone wrappers receive mandatory neutral final-answer metadata.
3. Remove all future/parked companion content; editorial PASS remains separate from named clinical approval.

Indexed review notes and responses:
```json
[
  {
    "category": "fairness",
    "index": 0,
    "reviewNote": "The visible context supports planned repair after neonatal hospitalization: the bulge repeatedly reduces, no acute episodes are reported, oxygen dependence persists, and follow-up with urgent-return education is established. The key is a planned repair, not indefinite observation.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "fairness",
    "index": 1,
    "reviewNote": "Two consequential judgments remain: distinguish a currently reducible hernia from an urgent incarceration problem, then balance perioperative respiratory risk against the risks of waiting. Before-discharge repair is a credible alternative, so the pulmonary and follow-up findings have a real job.",
    "disposition": "pass-preserved",
    "response": "No later episode or feedback is included in the standalone case. Editorial PASS remains separate from named clinical approval."
  },
  {
    "category": "fairness",
    "index": 2,
    "reviewNote": "The family-follow-up sentence is legitimate decision-critical context in this timing comparison, not merely permission to perform a keyed procedure. The spontaneous-resolution distractor is weaker but tests an important distinction from other infant groin findings.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "fairness",
    "index": 3,
    "reviewNote": "The explanation correctly presents an individualized balance rather than a compulsory age rule. I judge delayed planned repair the best offered answer for this exact context, but have not independently verified current comparative evidence or a timing cutoff; Melissa must confirm the clinical ranking. The standalone node is clear. Editorial PASS does not approve a universal delayed-repair policy.",
    "disposition": "pass-preserved",
    "response": "No later episode or feedback is included in the standalone case. Editorial PASS remains separate from named clinical approval."
  },
  {
    "category": "suggestions",
    "index": 0,
    "reviewNote": "Preserve reducibility, respiratory risk and reliable follow-up together. Keep the plan explicitly scheduled and retain urgent-return education.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  },
  {
    "category": "suggestions",
    "index": 1,
    "reviewNote": "Do not turn 'after the neonatal hospitalization' into an unsupported fixed age or imply that all preterm hernias should wait.",
    "disposition": "pass-preserved",
    "response": "Exact PASS node, question, raw observations, alternatives, explanation, reasoning and header/profile content preserved. Optional copyedits were not applied because the manager requested exact preservation."
  }
]
```

#### Before: exact reviewed v1 (historical, non-executable)

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.preterm-groin-timing.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Henry Parker",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.preterm-groin-timing.v1",
  "chiefComplaint": "Groin timing review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 12-week-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.preterm-groin-timing.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Groin timing review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 12-week-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName} was born at 26 weeks and remains in an outside neonatal unit. Discharge is being planned with ongoing respiratory follow-up.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Groin course",
      "value": "Pediatric surgical examinations repeatedly show an inguinal bulge that reduces completely. There have been no painful irreducible episodes, vomiting or skin changes."
    },
    {
      "label": "Respiratory and follow-up context",
      "value": "He still needs oxygen for bronchopulmonary dysplasia. His family can attend surgical follow-up and has been taught the warning signs requiring urgent reassessment."
    }
  ]
}
```

Task: Which repair-timing plan is most appropriate for {patientName}'s current groin finding?

**key shown first for review only**

1. Plan repair after the neonatal hospitalization **[KEY]**

Feedback: For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.

2. Plan repair before neonatal discharge

Feedback: Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison.

3. Use serial surveillance for spontaneous resolution

Feedback: The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan.

Explanation: For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.

Evidence claims: claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff, claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

#### After: pass-preserved exact current candidate

```json
{
  "caseId": "case.pediatric-gi-abdominal-wall.preterm-groin-timing.v1",
  "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "conceptId": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
  "clinicalReviewStatus": "needs_clinician_review",
  "patientDisplayName": "Henry Parker",
  "prototypeDemographics": {
    "ageYears": 0,
    "sexLabel": "Male"
  },
  "patientPresentationVariantId": "presentation.pediatric-gi-abdominal-wall.preterm-groin-timing.v1",
  "chiefComplaint": "Groin timing review",
  "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 12-week-old boy, with the child's mother.",
  "approvedInstantiationProfiles": [
    {
      "id": "profile.pediatric-gi-abdominal-wall.preterm-groin-timing.v1",
      "prototypeDemographics": {
        "ageYears": 0,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Groin timing review",
      "presentation": "In clinic, the founder reviews outside hospital records for {patientName}, a 12-week-old boy, with the child's mother."
    }
  ],
  "requiredClinicalSetting": "clinic",
  "earliestFacilityStage": 4,
  "requiredCapabilityIds": []
}
```

Current update: {patientName} was born at 26 weeks and remains in an outside neonatal unit. Discharge is being planned with ongoing respiratory follow-up.

Exhibit:
```json
{
  "kind": "keyValue",
  "caption": "Constructed outside-record observations; fictional patient",
  "items": [
    {
      "label": "Groin course",
      "value": "Pediatric surgical examinations repeatedly show an inguinal bulge that reduces completely. There have been no painful irreducible episodes, vomiting or skin changes."
    },
    {
      "label": "Respiratory and follow-up context",
      "value": "He still needs oxygen for bronchopulmonary dysplasia. His family can attend surgical follow-up and has been taught the warning signs requiring urgent reassessment."
    }
  ]
}
```

Task: Which repair-timing plan is most appropriate for {patientName}'s current groin finding?

**key shown first for review only**

1. Plan repair after the neonatal hospitalization **[KEY]**

Feedback: For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.

2. Plan repair before neonatal discharge

Feedback: Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison.

3. Use serial surveillance for spontaneous resolution

Feedback: The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan.

Explanation: For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.

Evidence claims: claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff, claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory.

Runtime shuffle: true. No hospital treatment/test is executed; service requests are null.

Reasoning, nearest competitor, deciding observation, deletion and counterfactual:
```json
{
  "interpretation": "Recognize a reducible hernia without current incarceration while interpreting ongoing prematurity-related respiratory disease.",
  "decision": "Balance the competing hazards and choose a scheduled delayed strategy instead of a compulsory pre-discharge repair or indefinite surveillance.",
  "closestCredibleError": "Require before-discharge repair solely because this is a child, despite current respiratory comorbidity.",
  "decidingObservation": "The hernia remains reducible without acute episodes while respiratory disease persists and follow-up is workable.",
  "consequenceOfError": "Unnecessary respiratory morbidity or, at the opposite extreme, an unmonitored delay could follow.",
  "deletionTest": "Deleting respiratory disease removes the reason to favor delay; deleting the reducibility/episode history removes the safety boundary. Follow-up context is necessary to the real tradeoff rather than a permission that surgery is available.",
  "counterfactual": "If painful irreducible episodes emerged or reliable follow-up could not be maintained, an earlier repair plan could become preferable after urgent specialist reassessment.",
  "counterfactualChoiceId": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.before"
}
```

Manual author gate (self-check, not independent approval):
```json
{
  "kind": "manual_author_self_check",
  "rubric": "question-authoring.2026-11-08.v15",
  "checkedOn": "2026-11-11",
  "coverTheKeyCueAttack": "No exact repair age, trial threshold, oxygen dose or effect size is supplied. The two planned timing options are genuine competitors. The surveillance label names a positive strategy rather than advertising an incomplete plan; the persistent examination finding must be applied.",
  "oneStageAndCategory": "Timing of an already indicated pediatric repair; no technique or anesthesia comparison is smuggled in.",
  "twoConsequentialSteps": "Recognize a reducible hernia without current incarceration while interpreting ongoing prematurity-related respiratory disease. Then Balance the competing hazards and choose a scheduled delayed strategy instead of a compulsory pre-discharge repair or indefinite surveillance.",
  "residentDifficulty": "Predicted moderate/hard: competing real harms distinguish this from the former obvious referral question. The clinical ranking is conditional and must be reviewed by Melissa.",
  "oneBestAnswer": "The hernia remains reducible without acute episodes while respiratory disease persists and follow-up is workable. Counterfactual: If painful irreducible episodes emerged or reliable follow-up could not be maintained, an earlier repair plan could become preferable after urgent specialist reassessment.",
  "sequenceAndFiniteProfileAttack": "Single node. No parent video or previous fluid-only scan supplies tissue identity; the actual pediatric surgical examinations establish the finding.",
  "repairAndRecheck": "Replaced the superficial referral/urgency contrast with a respiratory-versus-incarceration tradeoff and removed the trial-specific age cutoff; re-solved all timing plans. Final option recheck removed the phrase without a repair plan from the surveillance label, kept the same documented-persistence discriminator and re-solved the three strategies. Exact clinical ranking still needs named review.",
  "remainingRisk": "The 2025 syntheses differ on incarceration estimates. No disputed claim of zero incarceration risk is taught. Delayed timing is a reasonable patient-specific proposal, not universally mandatory.",
  "independent": false,
  "clinicalApproval": false,
  "verdict": "Draft for independent review; author self-check is not PASS"
}
```

Per-choice temptation, conditions and claim/timing mapping:
```json
[
  {
    "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.after",
    "label": "Plan repair after the neonatal hospitalization",
    "rationale": "For a currently reducible hernia in a very preterm infant with ongoing respiratory disease, a delayed planned repair with follow-up is reasonable. The timing balances respiratory risk against incarceration during the wait; it is not indefinite observation or a universal age rule.",
    "temptation": "Apply the respiratory-risk and hernia-urgency findings together.",
    "correctUnder": "Selected reducible hernia with substantial prematurity-related respiratory risk and a reliable follow-up plan.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.before",
    "label": "Plan repair before neonatal discharge",
    "rationale": "Earlier repair limits the time exposed to incarceration risk, but carries respiratory tradeoffs in this infant. No current incarceration complication requires overriding the respiratory consideration in the offered comparison.",
    "temptation": "Treat every pediatric hernia as requiring repair before the current hospitalization ends.",
    "correctUnder": "A changed hernia course or patient/follow-up factors making delay less appropriate after specialist review.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
    ],
    "timingProfileId": null
  },
  {
    "id": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.observe",
    "label": "Use serial surveillance for spontaneous resolution",
    "rationale": "The current record repeatedly demonstrates a hernia, rather than documented resolution. Its reducibility supports a planned timing discussion, not a presumption that repair will become unnecessary. Reassessment remains part of the delayed surgical plan.",
    "temptation": "Treat the possibility of spontaneous resolution as sufficient reason to abandon a planned repair pathway.",
    "correctUnder": "A subsequently resolved finding confirmed on surgical reassessment with a revised diagnosis/plan, not the repeatedly demonstrated current hernia.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
    ],
    "timingProfileId": null
  }
]
```

Clinical statement mapping:
```json
{
  "presentation": "Fixed fictional patient and clinic record-review frame",
  "currentUpdateClaims": [
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
  ],
  "exhibitInferenceClaims": [
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
  ],
  "taskClaims": [
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
  ],
  "choiceMappings": [
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.after",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
        "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.before",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
        "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
      ]
    },
    {
      "choiceId": "choice.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1.observe",
      "claimIds": [
        "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
        "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
      ]
    }
  ],
  "feedbackClaims": [
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
  ]
}
```

Constructed data policy: Patient age, chronology, reported findings and responses are fictional observations, not empirical thresholds or probabilities.

Exact current snapshot hashes:
```json
{
  "node": "259b87413e186edd3468fa1c490cde8296b1b887e52644aeae8bd62c40a90527",
  "question": "0f70110765b732d0def1de259d034e4640f55116ab0988e8abc2898e2afa7fe0",
  "clinicalCase": "762989136b2dab5b80d5e8e5838a49213eaf22e35c94a3d634479a53016e4282"
}
```

PASS preservation and required standalone composition metadata:
```json
{
  "reviewedNodeSha256": "259b87413e186edd3468fa1c490cde8296b1b887e52644aeae8bd62c40a90527",
  "reviewedQuestionSha256": "0f70110765b732d0def1de259d034e4640f55116ab0988e8abc2898e2afa7fe0",
  "visibleHeaderAndProfile": "Exact original presentation, complaint, age, sex and finite-profile content retained. Case identity/profile identity changes only for standalone extraction; authored PASS wording and node/question objects are unchanged.",
  "splitFromCaseId": null,
  "currentQuestionSha256": "0f70110765b732d0def1de259d034e4640f55116ab0988e8abc2898e2afa7fe0",
  "originalFullNodeSha256": "259b87413e186edd3468fa1c490cde8296b1b887e52644aeae8bd62c40a90527",
  "currentClinicalNodeSha256": "af4ef945044dd7491c65b6fdaa8cb124d9fdac13261ffbcebb7996076897129a",
  "reviewedClinicalNodeSha256": "af4ef945044dd7491c65b6fdaa8cb124d9fdac13261ffbcebb7996076897129a"
}
```

## Stable identity, preserved reviews and composition

Eight revised questions use new v2 question/node versions. Four retain their scored concept ID because the clinical meaning is unchanged; four receive new concept IDs for materially changed objectives. The four PASS questions and their clinical node fields remain exact v1 versions. Their original full reviewed objects and hashes are retained; tests pin these to the independent-review input rather than regenerating expected hashes.

The two former first-node PASS items need neutral no_terminal_outcome metadata as standalone final nodes under the existing case schema. That wrapper change adds no clinical statement and copies the unchanged answer rationale. The other two singleton PASS cases remain fully object-identical. No wording, display context, finite-profile content, choice, exhibit, key or explanation was copyedited.

```json
[
  {
    "previousConceptId": "concept.pediatric-gi-abdominal-wall.bilious-incomplete-study.v1",
    "currentConceptId": "concept.pediatric-gi-abdominal-wall.bilious-exported-versus-acquired-series.v1",
    "reason": "Materially changed scored objective after independent review: Distinguish missing transferred contrast images from an unperformed acquisition during the evaluation of neonatal bilious vomiting.",
    "historyPolicy": "New meaning, new concept identity. Keep the exact predecessor and all histories; do not migrate FSRS history."
  },
  {
    "previousConceptId": "concept.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v1",
    "currentConceptId": "concept.pediatric-gi-abdominal-wall.hscr-rectal-histology-completion.v1",
    "reason": "Materially changed scored objective after independent review: Distinguish representative rectal tissue awaiting histologic completion from a biopsy that must be resampled.",
    "historyPolicy": "New meaning, new concept identity. Keep the exact predecessor and all histories; do not migrate FSRS history."
  },
  {
    "previousConceptId": "concept.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v1",
    "currentConceptId": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
    "reason": "Materially changed scored objective after independent review: Apply the hepatic-vein-level caval-extension exception to initial treatment of presumed Wilms tumor under a COG pathway.",
    "historyPolicy": "New meaning, new concept identity. Keep the exact predecessor and all histories; do not migrate FSRS history."
  },
  {
    "previousConceptId": "concept.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v1",
    "currentConceptId": "concept.pediatric-gi-abdominal-wall.wilms-nodal-sample-adequacy.v1",
    "reason": "Materially changed scored objective after independent review: Interpret the tissue actually submitted before declaring regional Wilms staging complete.",
    "historyPolicy": "New meaning, new concept identity. Keep the exact predecessor and all histories; do not migrate FSRS history."
  }
]
```

Current concept records:
```json
[
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.bilious-exported-versus-acquired-series.v1",
    "displayName": "Distinguish missing transferred contrast images from an unperformed acquisition during the evaluation of neonatal bilious vomiting.",
    "learningObjective": "Distinguish missing transferred contrast images from an unperformed acquisition during the evaluation of neonatal bilious vomiting.",
    "conceptType": "workup",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [
      "concept.pediatric-gi-abdominal-wall.bilious-incomplete-study.v1"
    ],
    "clinicalReason": "Materially changed scored objective after independent review: Distinguish missing transferred contrast images from an unperformed acquisition during the evaluation of neonatal bilious vomiting.",
    "historyPolicy": "New meaning, new concept identity. Keep the exact predecessor and all histories; do not migrate FSRS history.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.bilious-normal-film",
      "claim.pediatric-gi-abdominal-wall.bilious-contrast",
      "claim.pediatric-gi-abdominal-wall.bilious-series-review",
      "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v1",
    "displayName": "Separate restored circulation from correction of chloride-depletion alkalosis before pyloromyotomy.",
    "learningObjective": "Separate restored circulation from correction of chloride-depletion alkalosis before pyloromyotomy.",
    "conceptType": "management",
    "conceptRelation": "same_meaning_new_question_version",
    "previousConceptIds": [],
    "clinicalReason": "Same scored clinical decision, revised wording/findings/options after independent review; preserve this concept identity.",
    "historyPolicy": "Preserve stable concept ID and attached history; exact v1 definition and question retained in reviewInput.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.pyloric-correction",
      "claim.pediatric-gi-abdominal-wall.pyloric-definitive"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
    "displayName": "Select management after partial ileocolic reduction with persistent stability.",
    "learningObjective": "Select management after partial ileocolic reduction with persistent stability.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [],
    "clinicalReason": "A consequential pediatric decision not scored by the two existing groin-referral identities.",
    "historyPolicy": "Create a separate concept; do not migrate old FSRS history or alter frozen encounters.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.intussusception-risk",
      "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
      "claim.pediatric-gi-abdominal-wall.intussusception-operation",
      "claim.pediatric-gi-abdominal-wall.intussusception-transient"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.hscr-rectal-histology-completion.v1",
    "displayName": "Distinguish representative rectal tissue awaiting histologic completion from a biopsy that must be resampled.",
    "learningObjective": "Distinguish representative rectal tissue awaiting histologic completion from a biopsy that must be resampled.",
    "conceptType": "workup",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [
      "concept.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v1"
    ],
    "clinicalReason": "Materially changed scored objective after independent review: Distinguish representative rectal tissue awaiting histologic completion from a biopsy that must be resampled.",
    "historyPolicy": "New meaning, new concept identity. Keep the exact predecessor and all histories; do not migrate FSRS history.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
      "claim.pediatric-gi-abdominal-wall.hscr-histology-completion",
      "claim.pediatric-gi-abdominal-wall.hscr-contrast-limit",
      "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v1",
    "displayName": "Sequence structural and functional assessment of acquired obstructive symptoms after a ganglionated pull-through.",
    "learningObjective": "Sequence structural and functional assessment of acquired obstructive symptoms after a ganglionated pull-through.",
    "conceptType": "workup",
    "conceptRelation": "same_meaning_new_question_version",
    "previousConceptIds": [],
    "clinicalReason": "Same scored clinical decision, revised wording/findings/options after independent review; preserve this concept identity.",
    "historyPolicy": "Preserve stable concept ID and attached history; exact v1 definition and question retained in reviewInput.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
      "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
      "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "displayName": "Interpret a fixed bowel loop against improving NEC physiology.",
    "learningObjective": "Interpret a fixed bowel loop against improving NEC physiology.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [],
    "clinicalReason": "Consequential pediatric objective absent from the assigned bank.",
    "historyPolicy": "New identity; do not transfer old histories or alter frozen encounters.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
      "claim.pediatric-gi-abdominal-wall.nec-drain",
      "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
    "displayName": "Choose closure strategy after physiologic intolerance of complete reduction.",
    "learningObjective": "Choose closure strategy after physiologic intolerance of complete reduction.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [],
    "clinicalReason": "Consequential pediatric objective absent from the assigned bank.",
    "historyPolicy": "New identity; do not transfer old histories or alter frozen encounters.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy",
      "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
      "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
      "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v1",
    "displayName": "Apply current cardiopulmonary findings to the initial timing of reduction for a liver-containing omphalocele.",
    "learningObjective": "Apply current cardiopulmonary findings to the initial timing of reduction for a liver-containing omphalocele.",
    "conceptType": "management",
    "conceptRelation": "same_meaning_new_question_version",
    "previousConceptIds": [],
    "clinicalReason": "Same scored clinical decision, revised wording/findings/options after independent review; preserve this concept identity.",
    "historyPolicy": "Preserve stable concept ID and attached history; exact v1 definition and question retained in reviewInput.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
      "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory",
      "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1",
    "displayName": "Distinguish productive partial therapeutic decompression from completed resolution or failed nonoperative treatment of uncomplicated meconium ileus.",
    "learningObjective": "Distinguish productive partial therapeutic decompression from completed resolution or failed nonoperative treatment of uncomplicated meconium ileus.",
    "conceptType": "management",
    "conceptRelation": "same_meaning_new_question_version",
    "previousConceptIds": [],
    "clinicalReason": "Same scored clinical decision, revised wording/findings/options after independent review; preserve this concept identity.",
    "historyPolicy": "Preserve stable concept ID and attached history; exact v1 definition and question retained in reviewInput.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
      "claim.pediatric-gi-abdominal-wall.meconium-enema",
      "claim.pediatric-gi-abdominal-wall.meconium-repeat",
      "claim.pediatric-gi-abdominal-wall.meconium-complicated"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1",
    "displayName": "Apply the hepatic-vein-level caval-extension exception to initial treatment of presumed Wilms tumor under a COG pathway.",
    "learningObjective": "Apply the hepatic-vein-level caval-extension exception to initial treatment of presumed Wilms tumor under a COG pathway.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [
      "concept.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v1"
    ],
    "clinicalReason": "Materially changed scored objective after independent review: Apply the hepatic-vein-level caval-extension exception to initial treatment of presumed Wilms tumor under a COG pathway.",
    "historyPolicy": "New meaning, new concept identity. Keep the exact predecessor and all histories; do not migrate FSRS history.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
      "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
      "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
      "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.wilms-nodal-sample-adequacy.v1",
    "displayName": "Interpret the tissue actually submitted before declaring regional Wilms staging complete.",
    "learningObjective": "Interpret the tissue actually submitted before declaring regional Wilms staging complete.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [
      "concept.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v1"
    ],
    "clinicalReason": "Materially changed scored objective after independent review: Interpret the tissue actually submitted before declaring regional Wilms staging complete.",
    "historyPolicy": "New meaning, new concept identity. Keep the exact predecessor and all histories; do not migrate FSRS history.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.wilms-nodes",
      "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
      "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
    ],
    "earliestFacilityStage": 4
  },
  {
    "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "concept.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "displayName": "Balance prematurity-related respiratory risk against reducible hernia risk.",
    "learningObjective": "Balance prematurity-related respiratory risk against reducible hernia risk.",
    "conceptType": "management",
    "conceptRelation": "new_meaning",
    "previousConceptIds": [
      "concept.n4r2.pediatric-groin-contents-and-reducibility",
      "concept.pediatric-clinic.inguinal-hernia-referral"
    ],
    "clinicalReason": "Materially new timing tradeoff replaces repetitive generic referral/contents-triage objectives. Both old concept IDs and all histories are retained; no FSRS migration.",
    "historyPolicy": "New identity; do not transfer old histories or alter frozen encounters.",
    "evidenceClaimIds": [
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
      "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
    ],
    "earliestFacilityStage": 4
  }
]
```

Historical review and approval constraints:
```json
{
  "priorReview": [
    {
      "id": "review.n4.intermittent-groin-contents-versus-fluid-scan.v1",
      "title": "Intermittent pediatric groin swelling",
      "verdict": "REVISE",
      "difficulty": "easy",
      "twoStep": false,
      "cues": [
        {
          "phrase": "The bulge returns into the abdomen with gentle pressure. The abdomen is soft, the groin is not tender, and he has continued eating and passing stool.",
          "why": "The cluster of reassuring observations makes Arrange emergency groin exploration readily dismissible even without detailed pediatric surgical knowledge. These are necessary urgency findings to retain, but they leave a weak emergency competitor."
        },
        {
          "phrase": "bowel sounds are heard over the bulge today",
          "why": "Alongside the loop-shaped moving structure, this strongly announces enteric rather than fluid-only contents. It is a raw clinical observation, not literally a diagnosis label, but substantially pre-resolves the hydrocele-versus-hernia distinction for a resident."
        }
      ],
      "fairness": [
        "Node node.n4.intermittent-groin-contents-versus-fluid-scan.v1: planned inguinal herniotomy is the defensible best offered plan for the current reducible enteric groin findings without the described signs of an acute complication. No confident clinical inaccuracy is identified in that ranking.",
        "The quiet fluid-only scan does not create a necessary second inference: deleting the entire previous-ultrasound sentence leaves the same straightforward diagnosis and disposition. The task remains familiar reducible-hernia recognition followed by routine elective-versus-emergency triage.",
        "The options compare three plans, but continued hydrocele follow-up is contradicted by the current findings and emergency exploration is contradicted by reducibility and the reassuring course. Neither offers a close residual decision for a PGY-2/3 resident. twoStep is false under the owner's consequential-reasoning standard, despite the nominal diagnose-then-treat sequence.",
        "The parent video describes an externally visible loop-shaped movement, not verified anatomical contents. It should not be treated as direct visualization of bowel through the skin. The current clinical examination already carries the decision, so this uncertain interpretation is unnecessary to defend the key; no confident claim of physical impossibility is made.",
        "Clinic phase, named child and caregiver fit. No treatment deadline or age cutoff is inferred. The unspecified duration of a hypothetical hydrocele would also prevent this item from teaching a general observation policy for hydroceles at this age."
      ],
      "suggestions": [
        "Retain reducibility, tenderness and obstructive-symptom information. Seek explicit acceptance as basic recognition/triage, or develop a verified residual decision that these findings do not already settle.",
        "Make any prior imaging discrepancy necessary to the revised choice; otherwise remove it rather than counting historical conflict as an additional reasoning step.",
        "Describe a parent video as observable swelling behavior without claiming it establishes tissue identity. Use credible current plans rather than a fluid-only diagnosis and an unsupported emergency operation as the main distractors."
      ]
    }
  ],
  "historicalReviewReferences": [
    {
      "file": "docs/research/question-new-n4-review2-20261110.json",
      "sha256": "4ce5bc5b8070893970a3f406ef54a67cde0c7231b5a7cdf72f4e31389bcb02e6",
      "itemIds": [
        "review.n4.intermittent-groin-contents-versus-fluid-scan.v1"
      ],
      "verdict": "REVISE",
      "clinicalApproval": false
    }
  ],
  "assignedFrozenReferences": [],
  "clinicalReviewStatus": "needs_clinician_review"
}
```

All current cases are standalone. Do not recompose any former sequence until every exact scored node has independent PASS and the complete visible sequence is reviewed. The choice to split is ordinary composition within the owner-approved clinic setting, not a proposal for an ICU/ED runtime.

## Atomic claims, full source records and rights

Authoritative medical guidance and reuse permission are recorded separately. The exact source ledger is sources-question-topic-pediatric-gi-abdominal-wall-20261111.json: sources (17), claims (47), statementMappings (12), sourceToClaimMappings, claimToQuestionMappings, historicalSources (6), historicalClaims (6), reviewInputMappings, excludedSources and limitations. Old access/check dates are retained. Archived v1 mappings remain separate from current executable-question mappings.

Every claim remains needs_clinician_review. Fictional patient measurements/chronology are constructed observations, not empirical frequencies, universal thresholds or treatment rules. The new specimen-provenance and archive interpretations explicitly identify original reasoning applications and their source limits. Single-source management claims retain that limitation.

Targeted follow-up source verification:
```json
{
  "on": "2026-11-11",
  "network": "Permitted web access available; official government/professional and licensed article pages were read for targeted factual verification.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bapm-2024",
    "source.pediatric-gi-abdominal-wall.nnuh-pyloric-2022",
    "source.pediatric-gi-abdominal-wall.ernica-hscr-2026",
    "source.pediatric-gi-abdominal-wall.ernica-omphalocele-2026",
    "source.pediatric-gi-abdominal-wall.donos-meconium-2024",
    "source.pediatric-gi-abdominal-wall.nci-wilms-2025",
    "source.pediatric-gi-abdominal-wall.niddk-constipation-tests-2018",
    "source.pediatric-gi-abdominal-wall.yang-malrotation-2024"
  ],
  "newClaimIds": [
    "claim.pediatric-gi-abdominal-wall.bilious-series-review",
    "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role",
    "claim.pediatric-gi-abdominal-wall.hscr-histology-completion",
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose",
    "claim.pediatric-gi-abdominal-wall.meconium-repeat",
    "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
    "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
    "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent",
    "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context"
  ],
  "limits": "No proprietary source or question bank used. No copied prose, tables, figures, full articles or excerpts stored. All exact clinical decisions remain unapproved; management claims with one adequate source retain that limitation.",
  "licenseCheck": "The article-level Creative Commons link resolved to CC BY 4.0 on 2026-11-11."
}
```

### Atomic claim records

#### claim.pediatric-gi-abdominal-wall.bilious-normal-film

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.bilious-normal-film",
  "statement": "A normal plain abdominal radiograph does not exclude malrotation in a newborn with persistent bile-stained vomiting.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bapm-2024"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "No numerical test accuracy or automatic surgery rule.",
  "applicablePopulation": "Newborns with persistent green emesis.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.bilious-contrast

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.bilious-contrast",
  "statement": "A stable newborn with persistent bile-stained vomiting and no alternative explanation requires an upper-GI contrast study to assess intestinal rotation.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bapm-2024"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "A study must answer the rotational question; early gastric emptying observations alone do not establish the duodenal course. This adequacy judgment is an original logical application, not a new acquisition protocol.",
  "applicablePopulation": "Stable term newborns.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.bilious-deterioration

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.bilious-deterioration",
  "statement": "Abdominal tenderness or lactic acidosis with neonatal bilious vomiting warrants time-critical pediatric surgical escalation.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bapm-2024"
  ],
  "evidenceCategory": "disposition",
  "certainty": "moderate",
  "limitation": "Do not apply a stable-infant imaging schedule to deterioration.",
  "applicablePopulation": "Newborns with abnormal abdominal signs or perfusion.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.volvulus-operation

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.volvulus-operation",
  "statement": "Midgut volvulus requires emergency operative treatment, with detorsion and assessment of bowel viability.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.gosh-malrotation-2019",
    "source.pediatric-gi-abdominal-wall.bapm-2024"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Government patient source is older; BAPM independently supports time-critical escalation. No mandatory resection without viability assessment.",
  "applicablePopulation": "Infants with volvulus.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.pyloric-evaluation

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.pyloric-evaluation",
  "statement": "Progressive nonbilious vomiting and weight loss in a young infant warrant evaluation for pyloric obstruction, even if an earlier scan did not establish it.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nnuh-pyloric-2022"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "One directly checked local guideline, overdue review. No diagnostic measurement threshold authored.",
  "applicablePopulation": "Young infants with persistent vomiting.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.pyloric-ultrasound

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.pyloric-ultrasound",
  "statement": "Persistent clinical suspicion after a technically inadequate outside pyloric ultrasound warrants expert review or repeat targeted ultrasound.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nnuh-pyloric-2022"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "Repeat acquisition is justified by actual technical inadequacy, not a missing exported image presumed unperformed.",
  "applicablePopulation": "Infants whose pylorus was not adequately assessed.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.pyloric-correction

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.pyloric-correction",
  "statement": "Pyloromyotomy follows correction of dehydration, chloride depletion and acid-base disturbance; normalization of sodium or potassium alone is insufficient.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nnuh-pyloric-2022",
    "source.pediatric-gi-abdominal-wall.oxford-pyloric-2015"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Both local guidelines are older/overdue. Only the shared correction principle is used; exact medication, fluid and laboratory targets withheld.",
  "applicablePopulation": "Infants with pyloric stenosis and metabolic alkalosis.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.pyloric-definitive

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.pyloric-definitive",
  "statement": "Pyloromyotomy is definitive treatment for hypertrophic pyloric stenosis.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nnuh-pyloric-2022"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "No ranking of open versus laparoscopic repair.",
  "applicablePopulation": "Infants with established pyloric stenosis.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.intussusception-risk

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.intussusception-risk",
  "statement": "Unfavorable ultrasound findings such as trapped fluid can predict more difficult reduction without independently prohibiting enema reduction in a stable child without peritonitis or perforation.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
    "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "No pressure, success probability or fixed number of attempts authored.",
  "applicablePopulation": "Stable children with ileocolic intussusception.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.intussusception-repeat

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
  "statement": "A delayed repeat image-guided enema is a reasonable option after partial reduction when the child remains stable and lacks peritoneal signs.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
    "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Conditional and locally determined; no mandatory waiting interval.",
  "applicablePopulation": "Children with partial progress during initial reduction.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.intussusception-operation

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.intussusception-operation",
  "statement": "Persistently symptomatic intussusception that remains unreduced after reasonable enema attempts requires operative assessment; a documented lead point strengthens that need.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
    "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Recurrence alone is not a contraindication to another enema. Operation is keyed for persistent failed reduction plus a structural lesion, not age alone.",
  "applicablePopulation": "Persistent or recurrent ileocolic intussusception.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.hscr-biopsy

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
  "statement": "Hirschsprung diagnosis requires representative rectal histology containing adequate submucosa; a superficial sample without ganglion cells is not diagnostic.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-hscr-2026"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "Current guideline; one directly checked publication. Tissue absence is not proven disease or a negative test.",
  "applicablePopulation": "Children with suspected Hirschsprung disease.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.hscr-contrast-limit

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.hscr-contrast-limit",
  "statement": "Contrast enema cannot replace representative rectal histology when Hirschsprung disease remains clinically suspected.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-hscr-2026"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "No transition-zone absence rule or exact sensitivity authored.",
  "applicablePopulation": "Children with longstanding obstructive symptoms.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
  "statement": "Persistent obstruction after pull-through warrants rectal examination and contrast evaluation for a mechanical cause before a functional outlet treatment.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-hscr-2026"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "Normal ganglionated tissue does not exclude an anastomotic or pull-through mechanical problem. No automatic redo or preventive dilatation rule.",
  "applicablePopulation": "Children with obstructive symptoms after pull-through.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.hscr-functional

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.hscr-functional",
  "statement": "Botulinum toxin can be considered for persistent outlet obstruction after mechanical causes have been assessed.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-hscr-2026"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "No dosage or universal response prediction; not a substitute for structural assessment.",
  "applicablePopulation": "Selected postoperative Hirschsprung patients.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.nec-fixed-loop

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
  "statement": "A fixed bowel loop should be interpreted with the infant's overall course rather than treated as an independent absolute indication for NEC surgery.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Conditional recommendation, very-low certainty. No reassuring inference from absence of free air alone.",
  "applicablePopulation": "Premature infants with NEC.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.nec-drain

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.nec-drain",
  "statement": "Peritoneal drainage can serve as a bridge when early NEC operation is not possible, and deterioration after drainage may still require laparotomy.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Many require later laparotomy; exact rescue thresholds are not defined.",
  "applicablePopulation": "Premature infants with suspected or confirmed perforated NEC.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty",
  "statement": "Initial laparotomy and initial drainage are both reasonable approaches to perforated NEC depending on patient and center factors.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-nec-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "low",
  "limitation": "No universal superiority claim; the authored later deterioration is distinct from initial procedural choice.",
  "applicablePopulation": "Premature neonates with perforated NEC.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy",
  "statement": "Gastroschisis usually involves exposed bowel through a defect beside an otherwise inserted umbilical cord, without a covering sac.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-gastroschisis-2024",
    "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020"
  ],
  "evidenceCategory": "anatomy",
  "certainty": "moderate",
  "limitation": "No copied anatomic figure or universal laterality rule.",
  "applicablePopulation": "Neonates with abdominal-wall defects.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.gastroschisis-pressure

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
  "statement": "Bowel reduction can cause respiratory and perfusion compromise when abdominal capacity is inadequate.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020"
  ],
  "evidenceCategory": "safety_boundary",
  "certainty": "moderate",
  "limitation": "One directly read narrative publication for this physiology; no intra-abdominal or ventilator cutoff taught.",
  "applicablePopulation": "Neonates during gastroschisis reduction.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.gastroschisis-silo

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
  "statement": "A silo permits staged reduction when primary reduction cannot be tolerated safely.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020",
    "source.pediatric-gi-abdominal-wall.ernica-gastroschisis-2024"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Changing the covering technique does not remove the physiologic effect of full reduction. No assertion that one closure method is best for every infant.",
  "applicablePopulation": "Neonates with intolerance of primary reduction.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.omphalocele-anatomy

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
  "statement": "An omphalocele is a midline abdominal-wall defect with herniated organs within a sac at the cord base.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-omphalocele-2026"
  ],
  "evidenceCategory": "anatomy",
  "certainty": "moderate",
  "limitation": "No numeric giant-defect definition authored.",
  "applicablePopulation": "Neonates with omphalocele.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.omphalocele-respiratory

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory",
  "statement": "For a giant omphalocele with respiratory distress or pulmonary hypertension, initial nonoperative management with delayed closure is favored by current expert guidance.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-omphalocele-2026"
  ],
  "evidenceCategory": "management",
  "certainty": "low",
  "limitation": "Expert consensus; very-low certainty comparative evidence. In other patients staged reduction and delayed closure are both defensible.",
  "applicablePopulation": "Infants with giant omphalocele and cardiopulmonary compromise.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.meconium-obstruction

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
  "statement": "Inspissated meconium in the distal ileum can cause neonatal bowel obstruction and warrants cystic-fibrosis evaluation.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
  ],
  "evidenceCategory": "presentation",
  "certainty": "moderate",
  "limitation": "Meconium ileus is not itself proof of cystic fibrosis.",
  "applicablePopulation": "Neonates with meconium ileus.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.meconium-enema

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.meconium-enema",
  "statement": "Selected stable infants with uncomplicated meconium ileus can undergo image-guided water-soluble contrast enema after resuscitation.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Single adequate systematic review; nonstandard practice. No contrast product, concentration, dose or attempt count keyed.",
  "applicablePopulation": "Resuscitated stable infants without perforation or other operative complications.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.meconium-complicated

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.meconium-complicated",
  "statement": "Perforation, volvulus or failed nonoperative decompression changes the operative boundary in meconium ileus.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Specific operative reconstruction depends on anatomy and clinical condition.",
  "applicablePopulation": "Infants with complicated or non-resolving meconium ileus.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.wilms-no-biopsy

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy",
  "statement": "Under the COG/North American pathway, a typical resectable unilateral Wilms tumor is generally managed with up-front nephrectomy rather than preoperative biopsy.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Do not generalize to SIOP, bilateral tumors, atypical appearance, high caval extension or unsafe resection. One government evidence summary checked.",
  "applicablePopulation": "Typical unilateral resectable renal tumors in a COG-aligned center.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
  "statement": "Preoperative biopsy of an otherwise resectable Wilms tumor can assign local stage III under COG staging.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
  ],
  "evidenceCategory": "safety_boundary",
  "certainty": "moderate",
  "limitation": "Does not imply biopsy is forbidden for inoperable or atypical masses.",
  "applicablePopulation": "COG-treated Wilms tumor.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.wilms-nodes

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.wilms-nodes",
  "statement": "Regional lymph-node sampling is required for local staging of Wilms tumor because gross appearance and imaging do not reliably exclude nodal involvement.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "No exact node count or formal lymphadenectomy template authored.",
  "applicablePopulation": "Children undergoing Wilms nephrectomy.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
  "statement": "Bilateral disease or tumor thrombus reaching the hepatic-vein level can alter the up-front nephrectomy pathway.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Counterfactual only; no drug regimen or automatic transplant/nephron-sparing technique.",
  "applicablePopulation": "Wilms tumor operative planning.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.neuroblastoma-evaluation

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.neuroblastoma-evaluation",
  "statement": "Urinary catecholamine metabolites and cross-sectional anatomic findings contribute to neuroblastoma evaluation.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-neuroblastoma-2025"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "Elevated metabolites do not by themselves establish histology or a full risk group.",
  "applicablePopulation": "Children with an abdominal neuroblastic tumor.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.neuroblastoma-vascular-risk

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.neuroblastoma-vascular-risk",
  "statement": "Encasement of major abdominal vessels is an imaging-defined surgical risk factor in neuroblastoma.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-neuroblastoma-2025"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "An imaging-defined risk factor is not distant metastatic disease.",
  "applicablePopulation": "Locoregional abdominal neuroblastoma.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.neuroblastoma-biopsy

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.neuroblastoma-biopsy",
  "statement": "For neuroblastoma with imaging-defined surgical risk factors, tissue biopsy is generally preferred to an attempted up-front definitive resection.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-neuroblastoma-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "Full biology and staging still govern treatment; no chemotherapy regimen specified.",
  "applicablePopulation": "Children with L2-pattern neuroblastoma.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
  "statement": "Preterm inguinal-hernia timing balances incarceration during delay against respiratory and recurrence complications associated with earlier repair.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "low",
  "limitation": "Predominantly retrospective synthesis; not an absolute repair-age rule. Other 2025 syntheses differ on the incarceration estimate.",
  "applicablePopulation": "Preterm infants with inguinal hernia during initial hospitalization.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory",
  "statement": "For a reducible hernia in a very preterm infant with ongoing respiratory disease, planning repair after the initial neonatal hospitalization can be reasonable with surgical follow-up and incarceration precautions.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "low",
  "limitation": "One adequately licensed directly read synthesis. Clinical timing needs named review; no fixed postmenstrual age, weight or deadline is taught.",
  "applicablePopulation": "Reducible inguinal hernia with neonatal respiratory comorbidity.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.intussusception-transient

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.intussusception-transient",
  "statement": "Transient small-bowel intussusception that resolves clinically and on reassessment differs from persistent symptomatic ileocolic intussusception.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.kps-intussusception-2023"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "applicablePopulation": "Children with transient small-bowel invagination.",
  "limitation": "The authored case has residual ileocolic disease; no length cutoff or automatic observation rule.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage",
  "statement": "Primary sutureless cord closure requires suitable tissue to cover the defect after safe bowel reduction.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "applicablePopulation": "Infants being considered for sutureless closure.",
  "limitation": "Counterfactual boundary only; no ranking when both primary methods are suitable.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.hscr-irrigation

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.hscr-irrigation",
  "statement": "Specialist-directed saline rectal irrigations can decompress the bowel before definitive Hirschsprung surgery.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-hscr-2026"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "applicablePopulation": "Children with Hirschsprung disease under specialist care.",
  "limitation": "No volume, catheter, frequency or home-instruction protocol authored.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.bilious-series-review

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.bilious-series-review",
  "statement": "Diagnostic-quality archived gastrointestinal contrast series can be shared for pediatric radiology review; missing transferred images do not prove that the corresponding acquisition was never performed.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.bapm-2024"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "BAPM supports diagnostic-quality image sharing for second opinions; the exported-versus-acquired distinction and preference to inspect an existing series are an original record-provenance application, not a directly compared clinical trial.",
  "applicablePopulation": "Neonates or children in the exact constructed vignette; no universal protocol.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role",
  "statement": "Expert ultrasound can assess malrotation with volvulus, but its role depends on local expertise and it does not make an already acquired upper-GI series irrelevant.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.yang-malrotation-2024",
    "source.pediatric-gi-abdominal-wall.bapm-2024"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "low",
  "limitation": "One retrospective cohort plus a professional framework; no universal modality superiority, accuracy estimate or required sequence is taught.",
  "applicablePopulation": "Neonates or children in the exact constructed vignette; no universal protocol.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.hscr-histology-completion

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.hscr-histology-completion",
  "statement": "When ganglion cells are not identified on H&E, expert evaluation with additional histologic methods, including calretinin, is needed before concluding that Hirschsprung disease is established.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-hscr-2026"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "Current society recommendation; no ancillary stain is presented as a substitute for appropriate specimen site and tissue representation. Single current guideline for this exact claim.",
  "applicablePopulation": "Children evaluated for Hirschsprung disease or postoperative obstruction, as specified.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.postoperative-test-purpose

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose",
  "statement": "Anorectal manometry evaluates anorectal function, whereas a colorectal transit study evaluates movement through the colon.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.niddk-constipation-tests-2018"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "Government patient information establishes test purpose, not the required post-pull-through sequence; the pediatric sequence is supported separately by ERNICA. Source last reviewed 2018.",
  "applicablePopulation": "Children evaluated for Hirschsprung disease or postoperative obstruction, as specified.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.meconium-repeat

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.meconium-repeat",
  "statement": "Repeat image-guided contrast enemas can decompress selected uncomplicated meconium ileus; persistent obstruction after a first attempt does not by itself define failure of the whole nonoperative course.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.donos-meconium-2024"
  ],
  "evidenceCategory": "management",
  "certainty": "low",
  "limitation": "Single adequate licensed systematic review with heterogeneous protocols; it does not establish a universal attempt count, interval, contrast preparation or obligatory repeat instead of surgery.",
  "applicablePopulation": "Neonates or children in the exact constructed vignette; no universal protocol.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
  "statement": "For presumed Wilms tumor with caval tumor extension at or above the hepatic veins, a biopsy and preoperative chemotherapy pathway is suggested before resection.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "NCI professional evidence summary, not a formal COG protocol document. Exact multidisciplinary plan and biopsy technique require clinician review; no regimen or response threshold is specified.",
  "applicablePopulation": "Children with presumed Wilms tumor in the stated COG/North American treatment context.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.wilms-sample-provenance

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
  "statement": "A fragment containing only fat and vessels cannot supply the histologic status of regional lymph nodes needed for Wilms staging.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
  ],
  "evidenceCategory": "evaluation",
  "certainty": "moderate",
  "limitation": "Original tissue-provenance inference from the requirement for actual nodal histology. NCI does not prescribe this constructed intraoperative report or routine frozen section; no minimum node count is invented.",
  "applicablePopulation": "Children with presumed Wilms tumor in the stated COG/North American treatment context.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.wilms-sampling-extent

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent",
  "statement": "Hilar and periaortic node samples are appropriate for Wilms staging even when nodes appear normal; formal retroperitoneal clearance is not the staging sampling operation.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.nci-wilms-2025"
  ],
  "evidenceCategory": "management",
  "certainty": "moderate",
  "limitation": "NCI describes regional sampling; no exact count, broad dissection mandate, or automatic postoperative reoperation rule is inferred. Single professional government summary.",
  "applicablePopulation": "Children with presumed Wilms tumor in the stated COG/North American treatment context.",
  "lastCheckedOn": "2026-11-11"
}
```

#### claim.pediatric-gi-abdominal-wall.omphalocele-primary-context

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context",
  "statement": "Primary closure is an option for a non-giant, intact omphalocele when the patient and anatomy permit it; it is not automatically an emergency.",
  "sourceIds": [
    "source.pediatric-gi-abdominal-wall.ernica-omphalocele-2026"
  ],
  "evidenceCategory": "management",
  "certainty": "low",
  "limitation": "Current society guidance; no size threshold, age rule or respiratory cutoff is used in this question. Comparative evidence is limited and clinician judgment remains necessary.",
  "applicablePopulation": "Neonates or children in the exact constructed vignette; no universal protocol.",
  "lastCheckedOn": "2026-11-11"
}
```

### Full current source records

#### source.pediatric-gi-abdominal-wall.bapm-2024

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.bapm-2024",
  "title": "Management of Bilious Vomiting in the Newborn Period and Radiological Support for Neonatal Services: A Framework for Practice",
  "completeCitation": "British Association of Perinatal Medicine. Management of Bilious Vomiting in the Newborn Period and Radiological Support for Neonatal Services: A Framework for Practice. February 2024.",
  "organizationOrJournal": "British Association of Perinatal Medicine",
  "authors": [
    "BAPM working group"
  ],
  "publicationYear": 2024,
  "doi": null,
  "pmid": null,
  "officialUrl": "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/bapm/file_asset/file/2422/Bilious_Vomiting_Framework_Feb_2024.pdf",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "Copyright retained; targeted verification",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
  "authorityAssessment": "National professional framework, not an absolute operative protocol. Supports diagnostic contrast and escalation by current examination, perfusion and infection status; a well stable infant is not assigned the same urgency as an acute abdomen.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.bilious-normal-film",
    "claim.pediatric-gi-abdominal-wall.bilious-contrast",
    "claim.pediatric-gi-abdominal-wall.bilious-deterioration",
    "claim.pediatric-gi-abdominal-wall.volvulus-operation",
    "claim.pediatric-gi-abdominal-wall.bilious-series-review",
    "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Public society document copyright checked. Two guessed terms-page routes were unavailable; no general AI license claimed. Only narrow factual verification under the repository society-guidance allowance; no source text retained."
}
```

#### source.pediatric-gi-abdominal-wall.gosh-malrotation-2019

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.gosh-malrotation-2019",
  "title": "Malrotation and volvulus",
  "completeCitation": "Great Ormond Street Hospital Specialist Neonatal and Paediatric Surgery team and Child and Family Information Group. Malrotation and volvulus. Reference 2019F0604; reviewed 1 October 2019.",
  "organizationOrJournal": "Great Ormond Street Hospital NHS Foundation Trust",
  "authors": [
    "Specialist Neonatal and Paediatric Surgery team",
    "Child and Family Information Group"
  ],
  "publicationYear": 2019,
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.gosh.nhs.uk/conditions-and-treatments/conditions-we-treat/malrotation-and-volvulus/",
  "accessedOn": "2026-11-11",
  "sourceClass": "government_guidance",
  "licenseLabel": "Copyright retained; targeted verification",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
  "authorityAssessment": "Specialist NHS patient information; overdue review. Used narrowly for emergency operative treatment of volvulus and checking bowel viability, cross-checked against BAPM escalation. Not evidence for an exact resection margin or universal approach.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.volvulus-operation"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": "https://www.gosh.nhs.uk/terms-and-conditions/",
  "accessAndRightsFinding": "Terms allow private research/study and encourage links; no AI/automated prohibition stated. No GOSH material is reproduced or distributed; no diagram or patient photograph accessed for reuse."
}
```

#### source.pediatric-gi-abdominal-wall.nnuh-pyloric-2022

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.nnuh-pyloric-2022",
  "title": "Trust Guideline for the Management of Projectile Vomiting in Infants (Pyloric Stenosis)",
  "completeCitation": "Mansoor K. Trust Guideline for the Management of Projectile Vomiting in Infants (Pyloric Stenosis). Norfolk and Norwich University Hospitals NHS Foundation Trust. Trust Docs 1307, version 4.1; approved 18 January 2022; review due 18 January 2025.",
  "organizationOrJournal": "Norfolk and Norwich University Hospitals NHS Foundation Trust",
  "authors": [
    "Khizer Mansoor",
    "Clinical Guidelines Assessment Panel"
  ],
  "publicationYear": 2022,
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.nnuh.nhs.uk/publication/download/projectile-vomiting-in-infants-pyloric-stenosis-ca4056-v4-1/",
  "accessedOn": "2026-11-11",
  "sourceClass": "government_guidance",
  "licenseLabel": "Copyright retained; targeted verification",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
  "authorityAssessment": "Local hospital clinical guideline; overdue review date retained. Narrow ultrasound and preoperative chloride/acid-base correction facts only. Outdated ranitidine text, exact fluid regimen, ultrasound cutoffs and scheduling windows are excluded.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.pyloric-evaluation",
    "claim.pediatric-gi-abdominal-wall.pyloric-ultrasound",
    "claim.pediatric-gi-abdominal-wall.pyloric-correction",
    "claim.pediatric-gi-abdominal-wall.pyloric-definitive"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Official publicly accessible Trust clinical PDF checked. Local terms route unavailable; NHS central OGL policy is not automatically applied to Trust content. Factual checks only, no copying."
}
```

#### source.pediatric-gi-abdominal-wall.oxford-pyloric-2015

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.oxford-pyloric-2015",
  "title": "Guidelines for the management of Pyloric Stenosis",
  "completeCitation": "Fulford-Smith, Bradshaw, Wagener. Guidelines for the management of Pyloric Stenosis. Oxford University Hospitals NHS Foundation Trust. 2015.",
  "organizationOrJournal": "Oxford University Hospitals NHS Foundation Trust",
  "authors": [
    "Fulford-Smith",
    "Bradshaw",
    "Wagener"
  ],
  "publicationYear": 2015,
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.ouh.nhs.uk/media/qz4kiyk4/pyloric-stenosis-guidelines.pdf",
  "accessedOn": "2026-11-11",
  "sourceClass": "government_guidance",
  "licenseLabel": "Copyright retained; targeted verification",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
  "authorityAssessment": "Older independent NHS local guideline. Cross-check of metabolic correction before surgery only; not current verification of thresholds or a preferred feeding regimen.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.pyloric-correction"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Article-level license and public document checked; no protected expression retained."
}
```

#### source.pediatric-gi-abdominal-wall.bspr-intussusception-2017

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
  "title": "A UK evidence based guideline for the acute management of paediatric intussusception",
  "completeCitation": "BSPR Intussusception Working Group. A UK evidence based guideline for the acute management of paediatric intussusception. Final-draft document dated 18 August 2017; public BSPR copy posted under 2024/01.",
  "organizationOrJournal": "British Society of Paediatric Radiology",
  "authors": [
    "BSPR Intussusception Working Group"
  ],
  "publicationYear": 2017,
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.bspr.co.uk/wp-content/uploads/2024/01/2017.08.18-Intussusception-Guideline-Final-Draft.pdf",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "Copyright retained; targeted verification",
  "reuseStatus": "copyrighted_targeted_verification_only",
  "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
  "authorityAssessment": "Professional radiology/surgery working-group guidance. The filename says final draft and the document is older; grade C/D repeat-enema advice is not presented as a high-certainty universal requirement.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.intussusception-risk",
    "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
    "claim.pediatric-gi-abdominal-wall.intussusception-operation"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Public official society PDF checked. Privacy-policy route unavailable; no express AI prohibition in document. No algorithm copied; current society review provides a separate cross-check."
}
```

#### source.pediatric-gi-abdominal-wall.kps-intussusception-2023

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.kps-intussusception-2023",
  "title": "Current diagnosis and image-guided reduction for intussusception in children",
  "completeCitation": "Hwang J, Yoon HM, Kim PH, Jung AY, Lee JS, Cho YA. Current diagnosis and image-guided reduction for intussusception in children. Clin Exp Pediatr. 2023;66(1):12-21. Published online 4 July 2022. doi:10.3345/cep.2021.01816.",
  "organizationOrJournal": "Clinical and Experimental Pediatrics / Korean Pediatric Society",
  "authors": [
    "Jisun Hwang",
    "Hee Mang Yoon",
    "Pyeong Hwa Kim",
    "Ah Young Jung",
    "Jin Seong Lee",
    "Young Ah Cho"
  ],
  "publicationYear": 2023,
  "doi": "10.3345/cep.2021.01816",
  "pmid": null,
  "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9815940/",
  "accessedOn": "2026-11-11",
  "sourceClass": "narrative_review",
  "licenseLabel": "CC BY-NC 4.0; limited factual verification",
  "reuseStatus": "cc_by_nc_4_0_restricted",
  "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
  "authorityAssessment": "Specialty-society narrative review, not a new formal guideline. Used for narrow clinical cross-checks of partial reduction, recurrence, lead points and operative boundary.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.intussusception-risk",
    "claim.pediatric-gi-abdominal-wall.intussusception-repeat",
    "claim.pediatric-gi-abdominal-wall.intussusception-operation",
    "claim.pediatric-gi-abdominal-wall.intussusception-transient"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Article-level CC BY-NC 4.0 explicitly checked. No source expression adapted or licensed content incorporated into a commercial asset; only underlying clinical facts independently synthesized. Do not infer commercial rights to the article or figures."
}
```

#### source.pediatric-gi-abdominal-wall.ernica-hscr-2026

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.ernica-hscr-2026",
  "title": "Updated ERNICA guidelines for the management of rectosigmoid Hirschsprung disease 2025",
  "completeCitation": "Rossi D, Irvine W, Granstrom AL, et al. Updated European Reference Network for rare Inherited and Congenital Digestive and Gastrointestinal Anomalies guidelines for the management of rectosigmoid Hirschsprung disease 2025. J Pediatr Gastroenterol Nutr. 2026;83(1):185-207. doi:10.1002/jpn3.70442. Online 30 April 2026; corrected May/June 2026.",
  "organizationOrJournal": "Journal of Pediatric Gastroenterology and Nutrition / ERNICA",
  "authors": [
    "Daniel Rossi",
    "Willemijn Irvine",
    "Anna-Lena Granstrom",
    "et al."
  ],
  "publicationYear": 2026,
  "doi": "10.1002/jpn3.70442",
  "pmid": null,
  "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13342790/",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "CC BY-NC 4.0; limited factual verification",
  "reuseStatus": "cc_by_nc_4_0_restricted",
  "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
  "authorityAssessment": "Current multidisciplinary guideline; many recommendations retain level III evidence. Uses the actual 2026 publication despite 2025 in title. Old 2020 guidance is not treated as independent corroboration.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.hscr-biopsy",
    "claim.pediatric-gi-abdominal-wall.hscr-contrast-limit",
    "claim.pediatric-gi-abdominal-wall.hscr-postoperative-mechanical",
    "claim.pediatric-gi-abdominal-wall.hscr-functional",
    "claim.pediatric-gi-abdominal-wall.hscr-irrigation",
    "claim.pediatric-gi-abdominal-wall.hscr-histology-completion"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Public PMC copy identifies article-level CC BY-NC 4.0. Publisher full-text route returned 403. Targeted professional-guideline facts checked in licensed public copy; no expression, table or illustration adapted. Anatomical calibration wording has residual tension; universal calibration timing is not authored."
}
```

#### source.pediatric-gi-abdominal-wall.ernica-nec-2025

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.ernica-nec-2025",
  "title": "ERNICA Evidence-Based Guideline on Surgical Aspects of Necrotizing Enterocolitis in Premature Neonates",
  "completeCitation": "Hulscher J, Irvine W, Conforti A, et al. European Reference Network for Inherited and Congenital Anomalies Evidence-Based Guideline on Surgical Aspects of Necrotizing Enterocolitis in Premature Neonates. Neonatology. 2025;122(3):376-384. doi:10.1159/000542540. Online 19 November 2024.",
  "organizationOrJournal": "Neonatology / ERNICA",
  "authors": [
    "Jan Hulscher",
    "Willemijn Irvine",
    "Andrea Conforti",
    "et al."
  ],
  "publicationYear": 2025,
  "doi": "10.1159/000542540",
  "pmid": null,
  "officialUrl": "https://pure.eur.nl/ws/files/226057027/European_Reference_Network_for_Inherited_and_Congenital_Anomalies_Evidence-Based_Guideline_on_Surgical_Aspects_of_Necrotizing_Enterocolitis_in_Premature_Neonates.pdf",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "CC BY 4.0",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized with bibliographic attribution. No source prose, figure, table, algorithm or clinical vignette reproduced; fictional applications are original. License permissiveness is separate from medical authority.",
  "authorityAssessment": "Current GRADE guidance with mostly very-low certainty. Does not establish universal laparotomy superiority over drainage or a single laboratory threshold for surgery.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.nec-fixed-loop",
    "claim.pediatric-gi-abdominal-wall.nec-drain",
    "claim.pediatric-gi-abdominal-wall.nec-procedure-uncertainty"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Article and institutional cover explicitly identify CC BY; used the university-hosted publisher version after PMC returned a browser check. No bypass of authentication or challenge attempted."
}
```

#### source.pediatric-gi-abdominal-wall.ernica-gastroschisis-2024

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.ernica-gastroschisis-2024",
  "title": "ERNICA evidence based guideline on the management of gastroschisis",
  "completeCitation": "Burgos CM, Irvine W, Vivanti A, et al. European reference network for rare inherited congenital anomalies (ERNICA) evidence based guideline on the management of gastroschisis. Orphanet J Rare Dis. 2024;19:60. doi:10.1186/s13023-024-03062-8.",
  "organizationOrJournal": "Orphanet Journal of Rare Diseases / ERNICA",
  "authors": [
    "Carmen Mesas Burgos",
    "Willemijn Irvine",
    "Alexandre Vivanti",
    "et al."
  ],
  "publicationYear": 2024,
  "doi": "10.1186/s13023-024-03062-8",
  "pmid": null,
  "officialUrl": "https://www.ern-ernica.eu/_files/ugd/c8fbf6_f72e0ff2be3348cbbb18e1687ff5e0b3.pdf",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "CC BY 4.0",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized with bibliographic attribution. No source prose, figure, table, algorithm or clinical vignette reproduced; fictional applications are original. License permissiveness is separate from medical authority.",
  "authorityAssessment": "Current multidisciplinary GRADE guideline, mostly low/very-low certainty for closure comparisons. Supports patient/bowel-dependent closure and silo use; no universal best closure.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-silo"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Article-level license and public document checked; no protected expression retained."
}
```

#### source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020",
  "title": "Gastroschisis: A State-of-the-Art Review",
  "completeCitation": "Bhat V, Moront M, Bhandari V. Gastroschisis: A State-of-the-Art Review. Children (Basel). 2020;7(12):302. doi:10.3390/children7120302.",
  "organizationOrJournal": "Children (Basel)",
  "authors": [
    "Vishwanath Bhat",
    "Matthew Moront",
    "Vineet Bhandari"
  ],
  "publicationYear": 2020,
  "doi": "10.3390/children7120302",
  "pmid": null,
  "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7765881/",
  "accessedOn": "2026-11-11",
  "sourceClass": "narrative_review",
  "licenseLabel": "CC BY 4.0",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized with bibliographic attribution. No source prose, figure, table, algorithm or clinical vignette reproduced; fictional applications are original. License permissiveness is separate from medical authority.",
  "authorityAssessment": "Older independent narrative review used only for physiologic intolerance of reduction and the role of staged silo after failed primary reduction; current ERNICA cross-check retained. No copied algorithm or figure.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.gastroschisis-anatomy",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-pressure",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-silo",
    "claim.pediatric-gi-abdominal-wall.gastroschisis-cord-coverage"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Publisher search rendition and article-level CC BY notice verified; direct PMC returned browser check and later publisher returned 429. No bypass or downloaded source artifact; only verified underlying closure facts used."
}
```

#### source.pediatric-gi-abdominal-wall.ernica-omphalocele-2026

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.ernica-omphalocele-2026",
  "title": "ERNICA evidence based guideline on omphalocele",
  "completeCitation": "Irvine W, van der Kamp LM, Spivack O, et al. ERNICA evidence based guideline on omphalocele. Orphanet J Rare Dis. 2026;21:193. doi:10.1186/s13023-026-04293-7. Published 7 March 2026.",
  "organizationOrJournal": "Orphanet Journal of Rare Diseases / ERNICA",
  "authors": [
    "Willemijn Irvine",
    "Linde Margriet van der Kamp",
    "Olivia Spivack",
    "et al."
  ],
  "publicationYear": 2026,
  "doi": "10.1186/s13023-026-04293-7",
  "pmid": null,
  "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13162432/",
  "accessedOn": "2026-11-11",
  "sourceClass": "professional_society_guideline",
  "licenseLabel": "CC BY 4.0",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized with bibliographic attribution. No source prose, figure, table, algorithm or clinical vignette reproduced; fictional applications are original. License permissiveness is separate from medical authority.",
  "authorityAssessment": "Current GRADE guidance. Closure preference with respiratory distress/pulmonary hypertension is expert consensus; comparative data are very-low certainty. No exact size, age or topical-agent regimen authored.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.omphalocele-anatomy",
    "claim.pediatric-gi-abdominal-wall.omphalocele-respiratory",
    "claim.pediatric-gi-abdominal-wall.omphalocele-primary-context"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Article-level license and public document checked; no protected expression retained."
}
```

#### source.pediatric-gi-abdominal-wall.donos-meconium-2024

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.donos-meconium-2024",
  "title": "Diagnosis and Management of Simple and Complicated Meconium Ileus in Cystic Fibrosis, a Systematic Review",
  "completeCitation": "Donos MA, Ghiga G, Trandafir LM, et al. Diagnosis and Management of Simple and Complicated Meconium Ileus in Cystic Fibrosis, a Systematic Review. Diagnostics (Basel). 2024;14(11):1179. doi:10.3390/diagnostics14111179.",
  "organizationOrJournal": "Diagnostics (Basel)",
  "authors": [
    "Madalina Andreea Donos",
    "Gabriela Ghiga",
    "Laura Mihaela Trandafir",
    "et al."
  ],
  "publicationYear": 2024,
  "doi": "10.3390/diagnostics14111179",
  "pmid": null,
  "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11171516/",
  "accessedOn": "2026-11-11",
  "sourceClass": "systematic_review",
  "licenseLabel": "CC BY 4.0",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized with bibliographic attribution. No source prose, figure, table, algorithm or clinical vignette reproduced; fictional applications are original. License permissiveness is separate from medical authority.",
  "authorityAssessment": "Recent systematic review; heterogeneous small observational studies and nonstandard treatment. One adequate directly read publication for the authored treatment boundary. Do not adopt its exact fluid volumes, enema concentrations or attempt counts.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.meconium-obstruction",
    "claim.pediatric-gi-abdominal-wall.meconium-enema",
    "claim.pediatric-gi-abdominal-wall.meconium-complicated",
    "claim.pediatric-gi-abdominal-wall.meconium-repeat"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Article-level license and public document checked; no protected expression retained."
}
```

#### source.pediatric-gi-abdominal-wall.nci-wilms-2025

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.nci-wilms-2025",
  "title": "Wilms Tumor and Other Childhood Kidney Tumors Treatment (PDQ) - Health Professional Version",
  "completeCitation": "PDQ Pediatric Treatment Editorial Board. Wilms Tumor and Other Childhood Kidney Tumors Treatment (PDQ), Health Professional Version. Bethesda, MD: National Cancer Institute. Updated 15 April 2025. Accessed 11 November 2026.",
  "organizationOrJournal": "National Cancer Institute",
  "authors": [
    "PDQ Pediatric Treatment Editorial Board"
  ],
  "publicationYear": 2025,
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.cancer.gov/types/kidney/hp/wilms-treatment-pdq",
  "accessedOn": "2026-11-11",
  "sourceClass": "government_guidance",
  "licenseLabel": "Government publication; conditions apply",
  "reuseStatus": "public_domain_conditions_apply",
  "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
  "authorityAssessment": "Peer-reviewed government evidence summary, expressly not a policy statement/formal guideline. COG/North American pathway must be stated; SIOP preoperative chemotherapy is a valid different framework. One primary summary checked for surgical facts.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.wilms-no-biopsy",
    "claim.pediatric-gi-abdominal-wall.wilms-biopsy-stage",
    "claim.pediatric-gi-abdominal-wall.wilms-nodes",
    "claim.pediatric-gi-abdominal-wall.wilms-preop-exceptions",
    "claim.pediatric-gi-abdominal-wall.wilms-caval-biopsy-first",
    "claim.pediatric-gi-abdominal-wall.wilms-sample-provenance",
    "claim.pediatric-gi-abdominal-wall.wilms-sampling-extent"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": "https://www.cancer.gov/policies/copyright-reuse",
  "accessAndRightsFinding": "NCI reuse policy and PDQ permission section checked. Credit NCI; no endorsement implied. Third-party images/tables excluded; this packet is original content, not an NCI PDQ summary."
}
```

#### source.pediatric-gi-abdominal-wall.nci-neuroblastoma-2025

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.nci-neuroblastoma-2025",
  "title": "Neuroblastoma Treatment (PDQ) - Health Professional Version",
  "completeCitation": "PDQ Pediatric Treatment Editorial Board. Neuroblastoma Treatment (PDQ), Health Professional Version. Bethesda, MD: National Cancer Institute. Updated 28 April 2025. Accessed 11 November 2026.",
  "organizationOrJournal": "National Cancer Institute",
  "authors": [
    "PDQ Pediatric Treatment Editorial Board"
  ],
  "publicationYear": 2025,
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.cancer.gov/types/neuroblastoma/hp/neuroblastoma-treatment-pdq",
  "accessedOn": "2026-11-11",
  "sourceClass": "government_guidance",
  "licenseLabel": "Government publication; conditions apply",
  "reuseStatus": "public_domain_conditions_apply",
  "reuseNotes": "Copyright retained. Targeted factual verification only; no copied or closely paraphrased expression, source excerpts, images or algorithms. Public access is not treated as blanket AI permission. No express AI/automated-access prohibition was identified in the accessed document; no corpus or bulk collection was made.",
  "authorityAssessment": "Peer-reviewed government evidence summary, not a formal guideline. Distinguishes imaging-defined surgical risk from metastatic stage; does not establish a complete risk group from anatomy alone.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.neuroblastoma-evaluation",
    "claim.pediatric-gi-abdominal-wall.neuroblastoma-vascular-risk",
    "claim.pediatric-gi-abdominal-wall.neuroblastoma-biopsy"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": "https://www.cancer.gov/policies/copyright-reuse",
  "accessAndRightsFinding": "NCI reuse and PDQ-specific conditions checked; no images, protected table or risk-group algorithm copied. No NCI/NIH endorsement implied."
}
```

#### source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025",
  "title": "Meta-Analysis to Determine Optimal Timing for Repair of Inguinal Hernia in Pre-Term Infants",
  "completeCitation": "Hashmi TM, Ashraf H, Fatima T, et al. Meta-Analysis to Determine Optimal Timing for Repair of Inguinal Hernia in Pre-Term Infants. World J Surg. 2025;49(9):2540-2548. doi:10.1002/wjs.70014. Published online 25 July 2025.",
  "organizationOrJournal": "World Journal of Surgery",
  "authors": [
    "Tallal Mushtaq Hashmi",
    "Hadiah Ashraf",
    "Tehreem Fatima",
    "Amna Javed",
    "Abdullah",
    "Muhammad Abdullah Kashif",
    "Soban Raza",
    "Khawaja Haris Ismail",
    "Arooj Fatima",
    "Javed Iqbal",
    "Raheel Ahmed",
    "Areeba Ahsan",
    "Mushood Ahmed"
  ],
  "publicationYear": 2025,
  "doi": "10.1002/wjs.70014",
  "pmid": null,
  "officialUrl": "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/wjs.70014",
  "accessedOn": "2026-11-11",
  "sourceClass": "systematic_review",
  "licenseLabel": "CC BY 4.0",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Article-level CC BY 4.0; https://creativecommons.org/licenses/by/4.0/. Underlying facts independently synthesized with bibliographic attribution. No source prose, figure, table, algorithm or clinical vignette reproduced; fictional applications are original. License permissiveness is separate from medical authority.",
  "authorityAssessment": "Recent synthesis includes one RCT and predominantly retrospective cohorts. Respiratory versus incarceration tradeoff is real; this does not justify one compulsory repair age. Different syntheses disagree on the incarceration estimate.",
  "usageRole": "both",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-tradeoff",
    "claim.pediatric-gi-abdominal-wall.preterm-hernia-respiratory"
  ],
  "accessMethod": "public_primary_document_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": null,
  "accessAndRightsFinding": "Official full PDF and explicit Creative Commons Attribution license statement verified, not inferred from PMC or a search snippet. No exact effect size or trial-specific age threshold is taught."
}
```

#### source.pediatric-gi-abdominal-wall.niddk-constipation-tests-2018

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.niddk-constipation-tests-2018",
  "title": "Diagnosis of Constipation",
  "completeCitation": "National Institute of Diabetes and Digestive and Kidney Diseases. Diagnosis of Constipation. National Institutes of Health. Last reviewed May 2018.",
  "organizationOrJournal": "National Institute of Diabetes and Digestive and Kidney Diseases, National Institutes of Health",
  "authors": [
    "NIDDK"
  ],
  "publicationYear": 2018,
  "doi": null,
  "pmid": null,
  "officialUrl": "https://www.niddk.nih.gov/health-information/digestive-diseases/constipation/diagnosis",
  "accessedOn": "2026-11-11",
  "sourceClass": "government_guidance",
  "licenseLabel": "U.S. government information; NIDDK copyright conditions and third-party exceptions apply",
  "reuseStatus": "public_domain_conditions_apply",
  "reuseNotes": "Original factual synthesis only. NIDDK copyright page states most information is copyright-free with exceptions for co-sponsored materials, graphics and logos. No text, branding or graphics reproduced; no endorsement implied.",
  "authorityAssessment": "Government-reviewed patient information is adequate for the narrow purpose of distinguishing test functions. It is not pediatric postoperative specialist guidance and does not establish a mandatory workup order.",
  "usageRole": "cross_check",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.postoperative-test-purpose"
  ],
  "accessMethod": "public_official_page_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": "https://www.niddk.nih.gov/copyright",
  "accessAndRightsFinding": "Official text and copyright page accessed successfully. Only the purposes of manometry and colorectal transit testing were extracted."
}
```

#### source.pediatric-gi-abdominal-wall.yang-malrotation-2024

```json
{
  "contentVersion": "clinical.question-topic-pediatric-gi-abdominal-wall.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "id": "source.pediatric-gi-abdominal-wall.yang-malrotation-2024",
  "title": "Identification and treatment of intestinal malrotation with midgut volvulus in childhood: a multicenter retrospective study",
  "completeCitation": "Yang X, Wang W, Wang K, Zhao J, Sun L, Jiang S, Wang Y, Feng W, Ding G, Fu T, Li A, Geng L. Identification and treatment of intestinal malrotation with midgut volvulus in childhood: a multicenter retrospective study. Front Pediatr. 2024;12:1390856. doi:10.3389/fped.2024.1390856.",
  "organizationOrJournal": "Frontiers in Pediatrics",
  "authors": [
    "X Yang",
    "W Wang",
    "K Wang",
    "J Zhao",
    "L Sun",
    "S Jiang",
    "Y Wang",
    "W Feng",
    "G Ding",
    "T Fu",
    "A Li",
    "L Geng"
  ],
  "publicationYear": 2024,
  "doi": "10.3389/fped.2024.1390856",
  "pmid": null,
  "officialUrl": "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2024.1390856/full",
  "accessedOn": "2026-11-11",
  "sourceClass": "observational_study",
  "licenseLabel": "Creative Commons Attribution (CC BY), article copyright notice",
  "reuseStatus": "cc_by_4_0",
  "reuseNotes": "Authors and publication credited in this complete citation. Only underlying facts independently synthesized; no source prose, tables, figures or numerical performance estimates retained.",
  "authorityAssessment": "Small retrospective multicenter surgical cohort. Supports ultrasound as a credible expert modality, not a universal ultrasound-versus-contrast ranking or a policy for reviewing transferred images.",
  "usageRole": "cross_check",
  "evidenceClaimIds": [
    "claim.pediatric-gi-abdominal-wall.bilious-ultrasound-role"
  ],
  "accessMethod": "public_licensed_article_targeted_read",
  "rightsCheckedOn": "2026-11-11",
  "termsUrl": "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2024.1390856/full",
  "accessAndRightsFinding": "Article-level CC BY notice verified before retaining facts; no full text or excerpts stored.",
  "licenseUrl": "https://creativecommons.org/licenses/by/4.0/",
  "attributionNote": "Yang and coauthors, Frontiers in Pediatrics 2024, DOI 10.3389/fped.2024.1390856. Underlying facts independently synthesized; no expression, figures or data tables adapted. No endorsement implied."
}
```

### Historical evidence and excluded sources

Exact preserved original records are in the ledger historicalSources/historicalClaims arrays. They are historical evidence, not newly checked evidence.

```json
{
  "historicalSources": [
    {
      "contentVersion": "clinical.question-new-n4.2026-11-10.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.pediatric-clinic.cornwall-surgery-2025",
      "title": "Paediatric Surgery",
      "completeCitation": "Faux W, Burns S. Paediatric Surgery. NHS Cornwall and Isles of Scilly Referral Management Service. Version 1.2; partial update 9 May 2025. Review date listed as 9 May 2026. Accessed 8 October 2026.",
      "organizationOrJournal": "NHS Cornwall and Isles of Scilly Referral Management Service",
      "authors": [
        "Will Faux",
        "S. Burns"
      ],
      "publicationYear": 2025,
      "publicationDateNote": "The page identifies a partial update on 2025-05-09 and a review date on 2026-05-09; the latter is not assumed to be a completed update.",
      "officialUrl": "https://rms.cornwall.nhs.uk/rms/primary_care_clinical_referral_criteria/rms/primary_care_clinical_referral_criteria/paediatrics/paediatric_surgery",
      "sourceClass": "government_guidance",
      "licenseLabel": "Copyright NHS/Kernow CCG; all rights reserved",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Targeted factual verification only; no copyrighted expression, source excerpts, tables, figures, algorithms or clinical vignettes are stored or reproduced. Copyright is not treated as AI-use permission.",
      "authorityAssessment": "Local NHS referral guidance authored by a consultant pediatric surgeon and GP. Adequate for narrow referral facts; not a national operative guideline. Retractile-testis terminology and umbilical repair ages are retained as disagreements, not teaching rules.",
      "usageRole": "both",
      "accessMethod": "primary_html_targeted_read",
      "doi": null,
      "pmid": null,
      "accessedOn": "2026-10-08",
      "evidenceClaimIds": [
        "claim.pediatric-clinic.dynamic-groin-bulge",
        "claim.pediatric-clinic.clinical-groin-hernia-referral",
        "claim.pediatric-clinic.umbilical-repair-age-disagreement",
        "claim.pediatric-clinic.acquired-testis-ascent",
        "claim.pediatric-clinic.ascending-testis-referral",
        "claim.pediatric-clinic.retractile-ascent-surveillance",
        "claim.pediatric-clinic.high-retractile-terminology-disagreement",
        "claim.n4.8f03b4ef56b7"
      ]
    },
    {
      "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.pediatric-clinic.nhs-hernia-2026",
      "title": "Hernia",
      "completeCitation": "NHS website. Hernia. Reviewed 19 May 2026. Accessed 8 October 2026.",
      "organizationOrJournal": "NHS website",
      "authors": [
        "NHS website editorial team"
      ],
      "publicationYear": 2026,
      "publicationDateNote": "Page last reviewed 2026-05-19; next review due 2029-05-19.",
      "officialUrl": "https://www.nhs.uk/conditions/hernia/",
      "sourceClass": "government_guidance",
      "licenseLabel": "Open Government Licence v3.0 where applicable; third-party material, logos and images excluded",
      "licenseUrl": "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      "termsUrl": "https://www.nhs.uk/our-policies/terms-and-conditions/",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Only underlying facts were checked and independently expressed. No prose, table, illustration or algorithm is reproduced. Contains public sector information licensed under the Open Government Licence v3.0. The existing reuse enum is conservative because it has no OGL category.",
      "authorityAssessment": "Current government patient guidance used only for general hernia location and dynamic bulge facts. Adult lifestyle advice and management recommendations are not transferred to children.",
      "usageRole": "cross_check",
      "accessMethod": "primary_html_targeted_read",
      "doi": null,
      "pmid": null,
      "accessedOn": "2026-10-08",
      "evidenceClaimIds": [
        "claim.pediatric-clinic.dynamic-groin-bulge",
        "claim.pediatric-clinic.umbilical-location",
        "claim.pediatric-clinic.inguinal-location",
        "claim.pediatric-clinic.femoral-location"
      ]
    },
    {
      "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.pediatric-clinic.nhs-umbilical-2025",
      "title": "Umbilical hernia",
      "completeCitation": "NHS website. Umbilical hernia. Reviewed 24 November 2025. Accessed 8 October 2026.",
      "organizationOrJournal": "NHS website",
      "authors": [
        "NHS website editorial team"
      ],
      "publicationYear": 2025,
      "publicationDateNote": "Page last reviewed 2025-11-24; next review due 2028-11-24.",
      "officialUrl": "https://www.nhs.uk/conditions/umbilical-hernia/",
      "sourceClass": "government_guidance",
      "licenseLabel": "Open Government Licence v3.0 where applicable; third-party material, logos and images excluded",
      "licenseUrl": "https://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/",
      "termsUrl": "https://www.nhs.uk/our-policies/terms-and-conditions/",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Only underlying facts were checked and independently expressed. No prose, table, illustration or algorithm is reproduced. Contains public sector information licensed under the Open Government Licence v3.0. The existing reuse enum is conservative because it has no OGL category.",
      "authorityAssessment": "Current government patient guidance. Used for navel location and to preserve disagreement about repair ages; no repair-age question is admitted.",
      "usageRole": "cross_check",
      "accessMethod": "primary_html_targeted_read",
      "doi": null,
      "pmid": null,
      "accessedOn": "2026-10-08",
      "evidenceClaimIds": [
        "claim.pediatric-clinic.umbilical-location",
        "claim.pediatric-clinic.umbilical-repair-age-disagreement"
      ]
    },
    {
      "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.pediatric-clinic.gosh-midline-hernia-2016",
      "title": "Umbilical and epigastric hernia",
      "completeCitation": "Great Ormond Street Hospital General Surgery Department and Child and Family Information Group. Umbilical and epigastric hernia. Reference 2016F1150; reviewed 1 July 2016. Accessed 8 October 2026.",
      "organizationOrJournal": "Great Ormond Street Hospital for Children NHS Foundation Trust",
      "authors": [
        "General Surgery Department",
        "Child and Family Information Group"
      ],
      "publicationYear": 2016,
      "publicationDateNote": "Last review 2016-07-01; displayed next review 2017-07-01 is overdue. Used narrowly for anatomy, not current treatment timing.",
      "officialUrl": "https://www.gosh.nhs.uk/conditions-and-treatments/conditions-we-treat/umbilical-and-epigastric-hernia/",
      "sourceClass": "open_educational_resource",
      "licenseLabel": "Copyright GOSH/UCL; private research and in-house noncommercial study conditions",
      "termsUrl": "https://www.gosh.nhs.uk/terms-and-conditions/",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Targeted factual verification only; no copyrighted expression, source excerpts, tables, figures, algorithms or clinical vignettes are stored or reproduced. Copyright is not treated as AI-use permission. Terms reviewed 2026-05-20 permit private research/study; no source material is distributed. Terms encourage hyperlinks and do not state an automated/AI access prohibition. Patient images are excluded.",
      "authorityAssessment": "Specialist pediatric hospital information, but dated. Basic epigastric/umbilical anatomy is used with an explicit dated-source limitation; treatment-age guidance is withheld.",
      "usageRole": "both",
      "accessMethod": "primary_html_targeted_read",
      "doi": null,
      "pmid": null,
      "accessedOn": "2026-10-08",
      "evidenceClaimIds": [
        "claim.pediatric-clinic.epigastric-fat-defect",
        "claim.pediatric-clinic.umbilical-location",
        "claim.pediatric-clinic.umbilical-repair-age-disagreement"
      ]
    },
    {
      "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.n4r2.queensland-child-inguinal-hernia",
      "title": "Queensland children’s inguinal hernia guidance",
      "completeCitation": "Department of Paediatric Surgery and Urology, Queensland Children’s Hospital. Inguinal hernia. Fact sheet FS177. Reviewed December 2016; public page updated October 2023.",
      "organizationOrJournal": "Children’s Health Queensland, Queensland Government",
      "authors": [
        "Department of Paediatric Surgery and Urology, Queensland Children’s Hospital"
      ],
      "publicationYear": 2023,
      "officialUrl": "https://www.childrens.health.qld.gov.au/health-a-to-z/inguinal-hernia",
      "doi": null,
      "pmid": null,
      "accessedOn": "2026-11-10",
      "sourceClass": "government_guidance",
      "licenseLabel": "Government patient guidance; rights retained except as allowed by government terms",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
      "authorityAssessment": "Public pediatric surgical guidance, not a graded trial or exact scheduling standard. Older clinical review date explicitly retained.",
      "usageRole": "evidence",
      "evidenceClaimIds": [
        "claim.n4r2.child-groin-dynamic-contents",
        "claim.n4r2.child-hernia-repair",
        "claim.n4r2.child-hernia-urgent-boundary"
      ],
      "verificationUse": "Targeted dynamic presentation, herniotomy and nonreduction urgency verification."
    },
    {
      "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "source.n4r2.south-tees-child-groin-2024",
      "title": "NHS congenital inguinal hernia and hydrocoeles guidance",
      "completeCitation": "South Tees Hospitals NHS Foundation Trust. Congenital inguinal hernia and hydrocoeles. Updated August 30, 2024.",
      "organizationOrJournal": "South Tees Hospitals NHS Foundation Trust",
      "authors": [
        "South Tees Hospitals NHS Foundation Trust"
      ],
      "publicationYear": 2024,
      "officialUrl": "https://www.southtees.nhs.uk/services/children-and-young-people/specialty/general-surgery/congenital-inguinal-hernia-and-hydrocoeles/",
      "doi": null,
      "pmid": null,
      "accessedOn": "2026-11-10",
      "sourceClass": "government_guidance",
      "licenseLabel": "NHS public guidance; copyright retained, no blanket OGL assumption",
      "reuseStatus": "copyrighted_targeted_verification_only",
      "reuseNotes": "Targeted underlying facts independently synthesized; no source expression, figures, tables, algorithms, excerpts or full text retained. ",
      "authorityAssessment": "Public pediatric surgical guidance; distinction between fluid and bowel contents, not a diagnostic accuracy study.",
      "usageRole": "cross_check",
      "evidenceClaimIds": [
        "claim.n4r2.child-groin-dynamic-contents",
        "claim.n4r2.child-hernia-repair",
        "claim.n4r2.child-hernia-urgent-boundary"
      ],
      "verificationUse": "Independent targeted contents and operative-need cross-check."
    }
  ],
  "historicalClaims": [
    {
      "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.pediatric-clinic.dynamic-groin-bulge",
      "statement": "A groin hernia can produce an intermittent bulge that becomes more evident with strain and less evident while lying down.",
      "sourceIds": [
        "source.pediatric-clinic.nhs-hernia-2026",
        "source.pediatric-clinic.cornwall-surgery-2025"
      ],
      "evidenceCategory": "presentation",
      "certainty": "moderate",
      "limitation": "General NHS bulge facts are cross-checked with a child-specific referral pathway; the narrative does not prescribe a reduction maneuver.",
      "applicablePopulation": "School-age children and adolescents with a suspected groin hernia.",
      "lastCheckedOn": "2026-10-08"
    },
    {
      "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.pediatric-clinic.clinical-groin-hernia-referral",
      "statement": "A clinically suspected childhood inguinal hernia warrants pediatric surgical referral based on the history or examination.",
      "sourceIds": [
        "source.pediatric-clinic.cornwall-surgery-2025"
      ],
      "evidenceCategory": "disposition",
      "certainty": "moderate",
      "limitation": "One eligible local NHS referral pathway, partially updated in 2025; its displayed 2026 review date is not assumed to be a completed update. No independent national pediatric management guideline was admitted. No operative deadline or technique is taught.",
      "applicablePopulation": "Children with a clinically apparent or parent-reported inguinal hernia.",
      "lastCheckedOn": "2026-10-08"
    },
    {
      "contentVersion": "development-batch.2026-10-08.pediatric-clinic.1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.pediatric-clinic.umbilical-repair-age-disagreement",
      "statement": "The checked NHS and GOSH sources do not give a uniform age for considering persistent childhood umbilical hernia repair.",
      "sourceIds": [
        "source.pediatric-clinic.nhs-umbilical-2025",
        "source.pediatric-clinic.gosh-midline-hernia-2016",
        "source.pediatric-clinic.cornwall-surgery-2025"
      ],
      "evidenceCategory": "management",
      "certainty": "conflicting",
      "limitation": "Withheld from questions. NHS patient guidance discusses persistence at age 5, dated GOSH information discusses age 3, and Cornwall lists repair no earlier than age 4 alongside a narrower review policy. These are source positions, not averaged recommendations.",
      "applicablePopulation": "Children with a persistent umbilical hernia.",
      "lastCheckedOn": "2026-10-08"
    },
    {
      "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.n4r2.child-groin-dynamic-contents",
      "statement": "A pediatric inguinal hernia can appear with straining and recede when relaxed; an isolated hydrocele contains fluid rather than herniated bowel.",
      "sourceIds": [
        "source.n4r2.queensland-child-inguinal-hernia",
        "source.n4r2.south-tees-child-groin-2024"
      ],
      "evidenceCategory": "presentation",
      "certainty": "moderate",
      "limitation": "The quiet fluid-only image does not itself establish later bowel entry; that inference requires current clinical findings.",
      "applicablePopulation": "Children with intermittent groin/scrotal swelling",
      "lastCheckedOn": "2026-11-10"
    },
    {
      "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.n4r2.child-hernia-repair",
      "statement": "A clinically established pediatric inguinal hernia warrants surgical repair; a reducible presentation can be managed with a planned herniotomy.",
      "sourceIds": [
        "source.n4r2.queensland-child-inguinal-hernia",
        "source.n4r2.south-tees-child-groin-2024"
      ],
      "evidenceCategory": "management",
      "certainty": "moderate",
      "limitation": "No exact delay or repair interval is taught; real timing follows pediatric clinical assessment.",
      "applicablePopulation": "Children with clinically established reducible inguinal hernia",
      "lastCheckedOn": "2026-11-10"
    },
    {
      "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
      "reviewStatus": "needs_clinician_review",
      "aiAssistedDrafting": true,
      "lastClinicianReview": null,
      "id": "claim.n4r2.child-hernia-urgent-boundary",
      "statement": "A persistently irreducible pediatric inguinal hernia or concerning obstruction/strangulation findings warrants urgent surgical assessment rather than routine observation.",
      "sourceIds": [
        "source.n4r2.queensland-child-inguinal-hernia",
        "source.n4r2.south-tees-child-groin-2024"
      ],
      "evidenceCategory": "safety_boundary",
      "certainty": "moderate",
      "limitation": "No exact time-to-strangulation probability or vital-sign cutoff is inferred.",
      "applicablePopulation": "Children with groin hernias and concerning current findings",
      "lastCheckedOn": "2026-11-10"
    }
  ],
  "excludedSources": [
    {
      "organization": "Royal Children's Hospital Melbourne",
      "url": "https://www.rch.org.au/terms-and-conditions/",
      "reason": "Existing repository exclusion: automated robot/scraper restriction. Search-result appearances were not used for clinical evidence."
    },
    {
      "organization": "American College of Surgeons",
      "url": "https://www.facs.org/general-terms/",
      "reason": "Existing repository exclusion: AI incorporation restriction. No content retrieved or used."
    },
    {
      "organization": "American Medical Association / JAMA",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10966421/",
      "reason": "Copyright/rights check showed all rights reserved. Not used as a licensed article corpus or as a source for the new claims; the independently read CC BY 2025 synthesis is cited instead."
    },
    {
      "organization": "NHSGGC",
      "url": "https://www.clinicalguidelines.scot.nhs.uk/ggc-paediatric-guidelines/ggc-paediatric-guidelines/surgery/hypertrophic-pyloric-stenosis-rhc-1229/",
      "reason": "403 full-text response. Search snippets not used to establish thresholds or treatment."
    },
    {
      "organization": "Commercial/proprietary products",
      "url": null,
      "reason": "UpToDate, AccessSurgery, question banks, paid reviews, proprietary SCORE and textbooks excluded; no corpus used."
    },
    {
      "id": "excluded.acr-vomiting-2020.followup",
      "url": "https://acsearch.acr.org/docs/69445/Narrative/",
      "reason": "Direct official page returned 403 and guessed official terms URL was inaccessible. Did not rely on search-result snippets or add ACR claims."
    },
    {
      "id": "excluded.nguyen-malrotation-2021.followup",
      "url": "https://pmc.ncbi.nlm.nih.gov/articles/PMC8526644/",
      "reason": "Public author-manuscript landing page did not establish a reusable article license. No claims retained from that manuscript; licensed Yang 2024 used only for ultrasound role."
    }
  ],
  "limitations": [
    "This is a bounded survey, not an exhaustive systematic review or an official examination blueprint.",
    "No article text/excerpts or protected graphics are stored.",
    "NC-licensed society material supplies targeted factual verification only, not permission to reproduce commercial assets.",
    "Current management recommendations with only one adequate publication are explicitly limited in their atomic claims.",
    "Historical sources retain original access/check dates in separate arrays; mapping check is recorded independently.",
    "No gameplay web access, AI call, analytics or patient data was added."
  ]
}
```

No proprietary textbook, UpToDate, AccessSurgery, question bank, paid review, SCORE module, recalled question, copied source prose, source table/figure/algorithm or full article text is part of this packet. The society-guidance route is narrow factual verification, not blanket AI permission; noncommercial licenses are not treated as game-expression licenses. The Yang article license link was verified as CC BY 4.0 and attributed in its source record.

## Exact timing, order and safe-link proposals

All 13 testing alternatives, including distractors, have existing placeholder profiles tied to exact choice IDs and labels. No fixed wait duration appears in question prose. Investigations are outside-record plans marked not_executed / future_planned; no local service is requested and no result gate runs. The combined_diagnostic profile is used for combined or therapeutic plans; clinical_procedure (anoscopy) is not reused for enema.

```json
[
  {
    "caseId": "case.pediatric-gi-abdominal-wall.bilious-incomplete-study-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.review",
          "choiceLabel": "Seek pediatric review of the original upper-GI series",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.combined_diagnostic"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.repeat",
          "choiceLabel": "Repeat upper-GI fluoroscopy with pediatric radiology",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.radiography"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.doppler",
          "choiceLabel": "Obtain mesenteric Doppler with pediatric radiology",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ultrasound"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-standalone.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
          "choiceLabel": "Attempt a delayed repeat image-guided enema",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.combined_diagnostic"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.operate",
          "choiceLabel": "Proceed to operative reduction now",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.observe",
          "choiceLabel": "Observe for spontaneous completion of reduction",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.hscr-superficial-biopsy-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.histology",
          "choiceLabel": "Obtain expert histology with calretinin studies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.biopsy",
          "choiceLabel": "Obtain a new rectal biopsy specimen",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.manometry",
          "choiceLabel": "Obtain anorectal manometry with reflex testing",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.structure",
          "choiceLabel": "Rectal examination plus contrast enema",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.combined_diagnostic"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.physiology",
          "choiceLabel": "Rectal examination plus anorectal manometry",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.transit",
          "choiceLabel": "Rectal examination plus colonic transit study",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.physiology"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.nec-fixed-loop-context-standalone.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.gastroschisis-reduction.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.repeat",
          "choiceLabel": "Repeat image-guided therapeutic contrast decompression",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.combined_diagnostic"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.surgery",
          "choiceLabel": "Proceed to operative bowel decompression",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.observe",
          "choiceLabel": "Continue gastric drainage with observation",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.biopsy",
          "choiceLabel": "Biopsy, preoperative chemotherapy, then resection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.nephrectomy",
          "choiceLabel": "Nephrectomy with thrombectomy, then chemotherapy",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.chemotherapy",
          "choiceLabel": "Preoperative chemotherapy, then resection histology",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.wilms-normal-node-sampling-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.sample",
          "choiceLabel": "Submit hilar and periaortic node samples",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.close",
          "choiceLabel": "Close without further regional-node sampling",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.dissection",
          "choiceLabel": "Perform formal retroperitoneal node clearance",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.preterm-groin-timing.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1",
    "classification": {
      "kind": "no_test"
    }
  }
]
```

Exact order proposals:
```json
[
  {
    "caseId": "case.pediatric-gi-abdominal-wall.bilious-incomplete-study-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.review",
    "choiceLabel": "Seek pediatric review of the original upper-GI series",
    "timingProfileId": "timing.test.combined_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.bilious-incomplete-study-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.repeat",
    "choiceLabel": "Repeat upper-GI fluoroscopy with pediatric radiology",
    "timingProfileId": "timing.test.radiography",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.bilious-incomplete-study-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2.doppler",
    "choiceLabel": "Obtain mesenteric Doppler with pediatric radiology",
    "timingProfileId": "timing.test.ultrasound",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.intussusception-partial-progress-standalone.v1",
    "nodeId": "node.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
    "choiceId": "choice.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1.repeat",
    "choiceLabel": "Attempt a delayed repeat image-guided enema",
    "timingProfileId": "timing.test.combined_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.hscr-superficial-biopsy-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.histology",
    "choiceLabel": "Obtain expert histology with calretinin studies",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.hscr-superficial-biopsy-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.biopsy",
    "choiceLabel": "Obtain a new rectal biopsy specimen",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.hscr-superficial-biopsy-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2.manometry",
    "choiceLabel": "Obtain anorectal manometry with reflex testing",
    "timingProfileId": "timing.test.physiology",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.structure",
    "choiceLabel": "Rectal examination plus contrast enema",
    "timingProfileId": "timing.test.combined_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.physiology",
    "choiceLabel": "Rectal examination plus anorectal manometry",
    "timingProfileId": "timing.test.physiology",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2.transit",
    "choiceLabel": "Rectal examination plus colonic transit study",
    "timingProfileId": "timing.test.physiology",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2.repeat",
    "choiceLabel": "Repeat image-guided therapeutic contrast decompression",
    "timingProfileId": "timing.test.combined_diagnostic",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.wilms-cog-initial-plan-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2.biopsy",
    "choiceLabel": "Biopsy, preoperative chemotherapy, then resection",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  },
  {
    "caseId": "case.pediatric-gi-abdominal-wall.wilms-normal-node-sampling-standalone.v2",
    "nodeId": "node.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2",
    "questionVariantId": "question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2",
    "choiceId": "choice.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2.sample",
    "choiceLabel": "Submit hilar and periaortic node samples",
    "timingProfileId": "timing.test.biopsy",
    "disposition": {
      "kind": "not_executed",
      "reason": "future_planned"
    },
    "scope": "Placeholder wait estimate for a reviewed outside-hospital plan; no local service is requested or executed."
  }
]
```

Safe external links use target _blank, rel noopener noreferrer and referrerPolicy no-referrer. Runtime reads authored data only; it never retrieves a source or calls a model during gameplay.

```json
[
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.bapm-2024",
    "label": "Management of Bilious Vomiting in the Newborn Period and Radiological Support for Neonatal Services: A Framework for Practice",
    "href": "https://hubble-live-assets.s3.eu-west-1.amazonaws.com/bapm/file_asset/file/2422/Bilious_Vomiting_Framework_Feb_2024.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.gosh-malrotation-2019",
    "label": "Malrotation and volvulus",
    "href": "https://www.gosh.nhs.uk/conditions-and-treatments/conditions-we-treat/malrotation-and-volvulus/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.nnuh-pyloric-2022",
    "label": "Trust Guideline for the Management of Projectile Vomiting in Infants (Pyloric Stenosis)",
    "href": "https://www.nnuh.nhs.uk/publication/download/projectile-vomiting-in-infants-pyloric-stenosis-ca4056-v4-1/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.oxford-pyloric-2015",
    "label": "Guidelines for the management of Pyloric Stenosis",
    "href": "https://www.ouh.nhs.uk/media/qz4kiyk4/pyloric-stenosis-guidelines.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.bspr-intussusception-2017",
    "label": "A UK evidence based guideline for the acute management of paediatric intussusception",
    "href": "https://www.bspr.co.uk/wp-content/uploads/2024/01/2017.08.18-Intussusception-Guideline-Final-Draft.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.kps-intussusception-2023",
    "label": "Current diagnosis and image-guided reduction for intussusception in children",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC9815940/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.ernica-hscr-2026",
    "label": "Updated ERNICA guidelines for the management of rectosigmoid Hirschsprung disease 2025",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13342790/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.ernica-nec-2025",
    "label": "ERNICA Evidence-Based Guideline on Surgical Aspects of Necrotizing Enterocolitis in Premature Neonates",
    "href": "https://pure.eur.nl/ws/files/226057027/European_Reference_Network_for_Inherited_and_Congenital_Anomalies_Evidence-Based_Guideline_on_Surgical_Aspects_of_Necrotizing_Enterocolitis_in_Premature_Neonates.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.ernica-gastroschisis-2024",
    "label": "ERNICA evidence based guideline on the management of gastroschisis",
    "href": "https://www.ern-ernica.eu/_files/ugd/c8fbf6_f72e0ff2be3348cbbb18e1687ff5e0b3.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.bhat-gastroschisis-2020",
    "label": "Gastroschisis: A State-of-the-Art Review",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC7765881/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.ernica-omphalocele-2026",
    "label": "ERNICA evidence based guideline on omphalocele",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC13162432/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.donos-meconium-2024",
    "label": "Diagnosis and Management of Simple and Complicated Meconium Ileus in Cystic Fibrosis, a Systematic Review",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC11171516/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.nci-wilms-2025",
    "label": "Wilms Tumor and Other Childhood Kidney Tumors Treatment (PDQ) - Health Professional Version",
    "href": "https://www.cancer.gov/types/kidney/hp/wilms-treatment-pdq",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.nci-neuroblastoma-2025",
    "label": "Neuroblastoma Treatment (PDQ) - Health Professional Version",
    "href": "https://www.cancer.gov/types/neuroblastoma/hp/neuroblastoma-treatment-pdq",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.hashmi-preterm-hernia-2025",
    "label": "Meta-Analysis to Determine Optimal Timing for Repair of Inguinal Hernia in Pre-Term Infants",
    "href": "https://onlinelibrary.wiley.com/doi/pdfdirect/10.1002/wjs.70014",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.niddk-constipation-tests-2018",
    "label": "Diagnosis of Constipation",
    "href": "https://www.niddk.nih.gov/health-information/digestive-diseases/constipation/diagnosis",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  },
  {
    "sourceId": "source.pediatric-gi-abdominal-wall.yang-malrotation-2024",
    "label": "Identification and treatment of intestinal malrotation with midgut volvulus in childhood: a multicenter retrospective study",
    "href": "https://www.frontiersin.org/journals/pediatrics/articles/10.3389/fped.2024.1390856/full",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer"
  }
]
```

Shared integration dependencies:
```json
[
  "Explicit-import authoring preview only; no ship manifest, shared registries, selectors, runtime or accepted release edited.",
  "All current cases have one scored node. Intussusception and NEC PASS nodes are extracted with exact clinical wording/header/profile and original reviewed objects retained. Native case validation requires a terminal disposition for every wrong final answer; standalone wrappers add only the existing neutral no_terminal_outcome metadata with the unchanged choice rationale. No treatment or patient outcome is simulated.",
  "Do not recompose former sequences until ALL exact scored nodes receive independent PASS and the complete visible sequence is reviewed. Revised candidates do not inherit prior verdicts.",
  "Manager owns selector/FSRS, timing/order registry and manifest integration after acceptance. Old case/node/question/concept definitions and historical timing/order mappings remain in the archived review input.",
  "Owner clinic/ASC decision is honored: every outside neonatal/hospital case is a named chart review in clinic using existing setting; no new ICU/ED setting is proposed."
]
```

## Owner approvals needed

Melissa must approve exact clinical versions separately from independent editorial review. The original appendicolith and umbilical timing holds remain unkeyed. For every current revision, the exact competing actions, evidence boundary and clinical question are below. Parking is not permission to ship the archived key.

```json
[
  {
    "id": "owner.pediatric-gi-abdominal-wall.umbilical-age",
    "affectedIds": [
      "conflict.pediatric-clinic.umbilical-repair-age",
      "withheld.pediatric-clinic.umbilical-timing"
    ],
    "competingActions": [
      "Age-based repair/referral",
      "Observation with reassessment"
    ],
    "evidenceBoundary": "Exact historical source disagreement has no applicable named resolution.",
    "questionForMelissa": "Keep a fixed repair/referral age withheld, or which exact age-specific rule and sources should govern a future item?",
    "keyState": "Unkeyed; preserve hold."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.appendicolith",
    "affectedIds": [
      "n4-slot-P06"
    ],
    "competingActions": [
      "Appendectomy",
      "Selected antibiotic-first management"
    ],
    "evidenceBoundary": "Newer WSES pediatric appendicolith/NOM boundary remains unverified in permitted full guidance.",
    "questionForMelissa": "After current permitted guidance is obtained, which pediatric appendicolith/NOM boundary may be tested? Keep P06 unkeyed meanwhile.",
    "keyState": "Unkeyed; preserve hold."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.preterm-timing",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1"
    ],
    "competingActions": [
      "Planned repair after neonatal hospitalization",
      "Repair before discharge"
    ],
    "evidenceBoundary": "One licensed 2025 synthesis supports a tradeoff, not a compulsory age. Incarceration estimates differ across syntheses.",
    "questionForMelissa": "Do reducibility, no acute episodes, ongoing BPD and reliable follow-up make post-discharge repair the single best offered plan in this exact version, or should it remain unkeyed pending additional patient-specific criteria?",
    "keyState": "Conditional draft key; not accepted."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.review-v2.bilious-incomplete-study",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
      "concept.pediatric-gi-abdominal-wall.bilious-exported-versus-acquired-series.v1"
    ],
    "competingActions": [
      "Seek pediatric review of the original upper-GI series",
      "Repeat upper-GI fluoroscopy with pediatric radiology",
      "Obtain mesenteric Doppler with pediatric radiology"
    ],
    "evidenceBoundary": "The review-before-reacquisition preference is an original application of source-supported diagnostic-quality second-opinion sharing. Melissa and pediatric radiology must confirm this exact ranking; ultrasound remains a legitimate alternative when further imaging is needed.",
    "questionForMelissa": "Does the exact deciding observation make Seek pediatric review of the original upper-GI series the single best offered plan against Repeat upper-GI fluoroscopy with pediatric radiology in this constructed record? The review-before-reacquisition preference is an original application of source-supported diagnostic-quality second-opinion sharing. Melissa and pediatric radiology must confirm this exact ranking; ultrasound remains a legitimate alternative when further imaging is needed.",
    "keyState": "Draft key; independent re-review and named clinical approval pending."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.review-v2.pyloric-residual-alkalosis",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2",
      "concept.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v1"
    ],
    "competingActions": [
      "Continue IV correction before pyloromyotomy",
      "Begin pyloromyotomy during IV correction",
      "Continue IV maintenance before pyloromyotomy"
    ],
    "evidenceBoundary": "Exact values are fictional patient results, not readiness cutoffs. Existing local sources are overdue; Melissa and pediatric anesthesia must confirm this exact degree of abnormality and current local correction practice.",
    "questionForMelissa": "Does the exact deciding observation make Continue IV correction before pyloromyotomy the single best offered plan against Begin pyloromyotomy during IV correction in this constructed record? Exact values are fictional patient results, not readiness cutoffs. Existing local sources are overdue; Melissa and pediatric anesthesia must confirm this exact degree of abnormality and current local correction practice.",
    "keyState": "Draft key; independent re-review and named clinical approval pending."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.review-v2.hscr-superficial-biopsy",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
      "concept.pediatric-gi-abdominal-wall.hscr-rectal-histology-completion.v1"
    ],
    "competingActions": [
      "Obtain expert histology with calretinin studies",
      "Obtain a new rectal biopsy specimen",
      "Obtain anorectal manometry with reflex testing"
    ],
    "evidenceBoundary": "Current ERNICA supports histologic completion. Melissa must verify that the constructed specimen and initial reading justify the exact review-versus-resampling ranking; no stain is sufficient without appropriate tissue.",
    "questionForMelissa": "Does the exact deciding observation make Obtain expert histology with calretinin studies the single best offered plan against Obtain a new rectal biopsy specimen in this constructed record? Current ERNICA supports histologic completion. Melissa must verify that the constructed specimen and initial reading justify the exact review-versus-resampling ranking; no stain is sufficient without appropriate tissue.",
    "keyState": "Draft key; independent re-review and named clinical approval pending."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.review-v2.hscr-postpullthrough-obstruction",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
      "concept.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v1"
    ],
    "competingActions": [
      "Rectal examination plus contrast enema",
      "Rectal examination plus anorectal manometry",
      "Rectal examination plus colonic transit study"
    ],
    "evidenceBoundary": "ERNICA supports rectal examination and contrast evaluation for mechanical causes. It does not impose one universal test order for every postoperative child. NIDDK cross-check supports test purpose only.",
    "questionForMelissa": "Does the exact deciding observation make Rectal examination plus contrast enema the single best offered plan against Rectal examination plus anorectal manometry in this constructed record? ERNICA supports rectal examination and contrast evaluation for mechanical causes. It does not impose one universal test order for every postoperative child. NIDDK cross-check supports test purpose only.",
    "keyState": "Draft key; independent re-review and named clinical approval pending."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.review-v2.omphalocele-pulmonary-boundary",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2",
      "concept.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v1"
    ],
    "competingActions": [
      "Protect the sac and defer reduction during stabilization",
      "Begin staged reduction now and close after reduction",
      "Begin complete reduction now and close the fascia"
    ],
    "evidenceBoundary": "Pulmonary-subgroup preference is expert consensus, with very-low certainty comparative evidence. Melissa must confirm this exact patient-level ranking; no fixed delayed-closure age or topical regimen is authored.",
    "questionForMelissa": "Does the exact deciding observation make Protect the sac and defer reduction during stabilization the single best offered plan against Begin staged reduction now and close after reduction in this constructed record? Pulmonary-subgroup preference is expert consensus, with very-low certainty comparative evidence. Melissa must confirm this exact patient-level ranking; no fixed delayed-closure age or topical regimen is authored.",
    "keyState": "Draft key; independent re-review and named clinical approval pending."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.review-v2.meconium-resuscitated-boundary",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
      "concept.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v1"
    ],
    "competingActions": [
      "Repeat image-guided therapeutic contrast decompression",
      "Proceed to operative bowel decompression",
      "Continue gastric drainage with observation"
    ],
    "evidenceBoundary": "One licensed systematic review with heterogeneous protocols supports repeat enemas, not a compulsory next step for every partial response. Melissa and pediatric radiology must confirm that this precise degree of progress reasonably favors another attempt over surgery.",
    "questionForMelissa": "Does the exact deciding observation make Repeat image-guided therapeutic contrast decompression the single best offered plan against Proceed to operative bowel decompression in this constructed record? One licensed systematic review with heterogeneous protocols supports repeat enemas, not a compulsory next step for every partial response. Melissa and pediatric radiology must confirm that this precise degree of progress reasonably favors another attempt over surgery.",
    "keyState": "Draft key; independent re-review and named clinical approval pending."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.review-v2.wilms-cog-initial-plan",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
      "concept.pediatric-gi-abdominal-wall.wilms-caval-extension-initial-plan.v1"
    ],
    "competingActions": [
      "Biopsy, preoperative chemotherapy, then resection",
      "Nephrectomy with thrombectomy, then chemotherapy",
      "Preoperative chemotherapy, then resection histology"
    ],
    "evidenceBoundary": "NCI is a professional government evidence summary rather than the full COG protocol. Melissa and pediatric oncology must confirm the current exact sequence and biopsy plan; no local approval is implied.",
    "questionForMelissa": "Does the exact deciding observation make Biopsy, preoperative chemotherapy, then resection the single best offered plan against Nephrectomy with thrombectomy, then chemotherapy in this constructed record? NCI is a professional government evidence summary rather than the full COG protocol. Melissa and pediatric oncology must confirm the current exact sequence and biopsy plan; no local approval is implied.",
    "keyState": "Draft key; independent re-review and named clinical approval pending."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.review-v2.wilms-normal-node-sampling",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2",
      "concept.pediatric-gi-abdominal-wall.wilms-nodal-sample-adequacy.v1"
    ],
    "competingActions": [
      "Submit hilar and periaortic node samples",
      "Close without further regional-node sampling",
      "Perform formal retroperitoneal node clearance"
    ],
    "evidenceBoundary": "NCI supports actual regional nodal sampling and its scope. The constructed report is a provenance application; Melissa must confirm clinical realism and that additional samples are the best exact before-closure action.",
    "questionForMelissa": "Does the exact deciding observation make Submit hilar and periaortic node samples the single best offered plan against Close without further regional-node sampling in this constructed record? NCI supports actual regional nodal sampling and its scope. The constructed report is a provenance application; Melissa must confirm clinical realism and that additional samples are the best exact before-closure action.",
    "keyState": "Draft key; independent re-review and named clinical approval pending."
  },
  {
    "id": "owner.pediatric-gi-abdominal-wall.all-current-exact-signoff",
    "affectedIds": [
      "question.pediatric-gi-abdominal-wall.bilious-incomplete-study.v2",
      "question.pediatric-gi-abdominal-wall.pyloric-residual-alkalosis.v2",
      "question.pediatric-gi-abdominal-wall.intussusception-partial-progress.v1",
      "question.pediatric-gi-abdominal-wall.hscr-superficial-biopsy.v2",
      "question.pediatric-gi-abdominal-wall.hscr-postpullthrough-obstruction.v2",
      "question.pediatric-gi-abdominal-wall.nec-fixed-loop-context.v1",
      "question.pediatric-gi-abdominal-wall.gastroschisis-domain-intolerance.v1",
      "question.pediatric-gi-abdominal-wall.omphalocele-pulmonary-boundary.v2",
      "question.pediatric-gi-abdominal-wall.meconium-resuscitated-boundary.v2",
      "question.pediatric-gi-abdominal-wall.wilms-cog-initial-plan.v2",
      "question.pediatric-gi-abdominal-wall.wilms-normal-node-sampling.v2",
      "question.pediatric-gi-abdominal-wall.preterm-hernia-timing.v1"
    ],
    "competingActions": [
      "Approve exact current versions",
      "Request clinical correction or withhold"
    ],
    "evidenceBoundary": "Editorial PASS is not clinical approval. All sources, claims, questions, profiles and counterfactuals remain needs_clinician_review.",
    "questionForMelissa": "Review each of the twelve exact current question versions and their evidence, including the four preserved editorial PASS items; no automatic promotion is permitted.",
    "keyState": "All needs_clinician_review."
  }
]
```

## Validation and handoff

Only the requested focused Vitest file and the clinical-content typecheck are used. Structural tests do not establish medical accuracy or clinical approval. The manager owns assembled-release advisory lint and cross-topic composition after acceptance.

```json
{
  "status": "not_run",
  "reason": "Focused tests only under worker scope. Manager runs assembled-release advisory lint and cross-topic integration after acceptance.",
  "manualDisposition": "Four exact editorial PASS versions preserved, eight concrete manual v2 gates recorded and five items parked with failed-repair reasons. Revised author gates confer no independent PASS or clinical approval."
}
```

### Focused topic test

Working directory: packages/clinical-content

Command: `npm.cmd test -- --pool=threads src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts`

Exit code: 0.
```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  12 passed (12)
   Start at  19:21:26
   Duration  1.19s (transform 653ms, setup 0ms, import 952ms, tests 46ms, environment 0ms)
```

### Clinical-content package typecheck

Working directory: packages/clinical-content

Command: `npm.cmd run typecheck`

Exit code: 1.
```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-oncology-genetics-principles-20261111.test.ts(64,52): error TS18046: 'r' is of type 'unknown'.
src/question-topic-oncology-genetics-principles-20261111.test.ts(65,100): error TS18046: 'r' is of type 'unknown'.
src/question-topic-oncology-genetics-principles-20261111.test.ts(82,67): error TS18046: 'r' is of type 'unknown'.
src/question-topic-oncology-genetics-principles-20261111.test.ts(166,94): error TS18046: 'r' is of type 'unknown'.
src/question-topic-pancreas-chronic-cysts-neoplasia-20261111.ts(997,48): error TS2322: Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }[]' is not assignable to type '({ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; })[]'.
  Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; }'.
    Type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string | undefined; sourceLabels: string[]; }' is not assignable to type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; }'.
      Types of property 'clinicalRationale' are incompatible.
        Type 'string | undefined' is not assignable to type 'string'.
          Type 'undefined' is not assignable to type 'string'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

### Owned JSON parse

Working directory: .

Command: `node -e "for (const f of ['docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.json','docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json']) { JSON.parse(require('fs').readFileSync(f,'utf8')); console.log('PASS JSON.parse: '+f); }"`

Exit code: 0.
```text
PASS JSON.parse: docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.json
PASS JSON.parse: docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json
```

## Final bounded handoff

```text
Topic pediatric-gi-abdominal-wall
Files changed packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.ts
  packages/clinical-content/src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts
  docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.md
  docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.json
  docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json
Inventory original program primary-topic inventory: 3 exact variants / 3 case-node audit rows / 2 historical concepts. Dispatch 145 manifest rows; 1,151 cases / 1,462 nodes / 610 concepts. Read-only current v12: 404 rows; 1,250 / 1,514 / 813. Assigned source definitions and old histories unchanged; sidecar absent from default release.
Counts follow-up audited 17, kept 4 (pass-preserved), rewritten 8 (revised once), retired 0, new 0, parked 5. Original assigned audit unchanged: audited 3, kept 0, rewritten 0, retired-and-replaced proposed 3. Twelve initial batch draft questions remain active.
Count basis 17 unique exact reviewed v1 variants = 4 preserved + 8 revised v2 + 5 parked; 12 active standalone cases/nodes/concepts, 0 multi-part cases. Eight current concept IDs retained; four materially changed meanings receive new concept IDs; original 17 definitions and both historical concept histories remain intact.
Held/unkeyed original 3 planning rows: n4-slot-P06; conflict.pediatric-clinic.umbilical-repair-age; withheld.pediatric-clinic.umbilical-timing. Newly parked 5 original question slugs: bilious-deterioration.v1; pyloric-inadequate-ultrasound.v1; intussusception-leadpoint-failure.v1; nec-deterioration-after-drain.v1; neuroblastoma-risk-biopsy.v1 (all under question.pediatric-gi-abdominal-wall). No parked executable key.
Research 17 full source records / 47 atomic claims, including nine follow-up claims and two additional permitted sources. Current ERNICA and NCI boundaries reverified. Single-source, low-certainty and overdue local-source limits are explicit. No proprietary corpus or source expression retained.
Packet docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.md; docs/research/question-topic-pediatric-gi-abdominal-wall-20261111.json; docs/research/sources-question-topic-pediatric-gi-abdominal-wall-20261111.json.
Identity preservation All four exact PASS questions, clinical node fields and visible headers/profiles preserved; two singleton cases fully identical. Two formerly nonfinal PASS nodes extracted into standalone cases with only required neutral final-answer metadata added to wrappers. Exact original full objects/hashes retained. No automatic FSRS history transfer.
Owner approvals needed Melissa: exact 12 clinical versions and all counterfactuals. Specific v2 rankings: archived imaging review versus reacquisition; substantial residual alkalosis versus proceeding; represented histology completion versus resampling; post-pull-through anatomy versus physiology; pulmonary-subgroup delayed versus immediate staged omphalocele reduction; partial meconium response repeat versus surgery; high-caval Wilms biopsy/preoperative sequence; actual nodal sample completion versus accepting a fat-only negative report. Preserve preterm-timing, appendicolith and umbilical-age clinical holds.
Integration Manager obtains independent re-review of eight revisions and checks standalone wrappers, then exact acceptance, named clinical approval, shared timing/order/selector/FSRS/manifest integration. All cases use existing clinic chart review. No shared file edited; do not recompose until ALL exact scored nodes have independent PASS.
Validation From packages/clinical-content: npm.cmd test -- --pool=threads src/question-topic-pediatric-gi-abdominal-wall-20261111.test.ts => exit 0; Test Files 1 passed (1); Tests 12 passed (12). npm.cmd run typecheck => exit 1; TS18046 oncology genetics test lines 64,65,82,166 and TS2322 pancreas module line 997, all out of lane. Complete exact outputs are in validation. Two owned JSONs parse successfully; all five files have valid UTF-8 and zero trailing whitespace; 17/17 review rows reconciled.
Open work Manager: resolve concurrent out-of-lane package diagnostics, independently review eight revised versions, obtain Melissa's exact clinical decisions, accept or park, and integrate only accepted versions. Local five-file work is uncommitted/unpushed; manager owns the backup checkpoint. Bounded worker follow-up complete.
```

The bounded review follow-up is handed back to the manager. Exact acceptance, any clinical decisions, broader integration, the out-of-lane package fix and backup checkpoint belong to the manager. This local five-file state has not been committed or pushed.
