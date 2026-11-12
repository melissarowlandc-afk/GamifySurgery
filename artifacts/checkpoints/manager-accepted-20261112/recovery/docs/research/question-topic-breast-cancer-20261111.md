# Breast cancer topic - round 2 review response

## Assignment and preserved inventory

Wave 6, topic `breast-cancer`, taxonomy title Breast - carcinoma staging and treatment. High priority. Invasive carcinoma, DCIS, Paget/inflammatory cancer, biology, stage, breast/axillary surgery, neoadjuvant response and adjuvant sequencing are included. Phyllodes remains breast-benign-high-risk and germline interpretation remains oncology-genetics-principles. Five-file lane only; no shared manifest, registry, runtime, selector, saves or other worker files were edited.

The original assignment contains 50 exact variant/case-node rows (32 live and 18 retained), with 12 registered live concepts plus one retained-only identity. The original 7 Keep / 7 Rewrite / 36 retirement proposals remain an inventory audit, not a claim that release content was removed. A parked replacement now carries an explicit do-not-withdraw integration hold. Complete original rows, source hashes, holds and historical exact PASS references follow.

<details><summary>Complete self-filled assignment and historical review references</summary>

```json
{
  "topicSlug": "breast-cancer",
  "wave": 6,
  "taxonomy": {
    "slug": "breast-cancer",
    "title": "Breast — carcinoma staging and treatment",
    "priority": "high",
    "scopeIn": "Invasive carcinoma, DCIS, Paget and inflammatory breast cancer, tumor biology, stage, breast/axillary surgery, neoadjuvant response and adjuvant sequencing.",
    "scopeOut": "Phyllodes remains in breast-benign-high-risk to keep one fibroepithelial family together. Germline interpretation belongs to oncology-genetics-principles.",
    "priorityReason": "A high-priority oncologic topic with major gaps possible despite many related imaging cases.",
    "researchAgenda": [
      "Subtype and stage-to-treatment sequencing",
      "Axillary management after neoadjuvant treatment",
      "Margin, specimen orientation and reconstruction consequences"
    ],
    "counts": {
      "liveConcepts": 12,
      "liveNodes": 32,
      "liveCases": 23,
      "liveVariants": 32,
      "liveAcceptedNodes": 5,
      "liveOriginalNodes": 27,
      "registeredConcepts": 12,
      "registeredWithoutLiveNodes": 0,
      "drafts": 18,
      "draftVariants": 18,
      "draftConcepts": 8,
      "explicitOwnerHeldVersions": 0,
      "unassembledDraftVariants": 0,
      "unkeyedParkedSlots": 0,
      "withheldTeachingPoints": 0,
      "liveClinicalConcepts": 12
    },
    "coverageSignal": "partial",
    "coverageReason": "Live identities cover part of this scope. The research agenda flags breadth to check, and the topic worker must judge redundancy and question quality.",
    "testingWeightBasis": "Owner-directed editorial estimate of general-surgery testing relevance. No exam percentages or official blueprint weights are asserted.",
    "workerLane": [
      "packages/clinical-content/src/question-topic-breast-cancer-20261111.ts",
      "packages/clinical-content/src/question-topic-breast-cancer-20261111.test.ts",
      "docs/research/question-topic-breast-cancer-20261111.json",
      "docs/research/question-topic-breast-cancer-20261111.md",
      "docs/research/sources-question-topic-breast-cancer-20261111.json"
    ],
    "wave": 6
  },
  "baseline": {
    "generatedAt": "2026-11-11T15:41:40.423Z",
    "snapshotCapturedAt": "2026-11-11T15:28:05.732Z",
    "release": {
      "id": "clinical.synthetic.prototype.v1",
      "manifestId": "question-ship.2026-11-10.v9",
      "manifestFile": "packages/clinical-content/src/question-ship-manifest.ts",
      "assemblyFile": "packages/clinical-content/src/synthetic-content.ts",
      "assemblyExport": "SYNTHETIC_CLINICAL_RELEASE",
      "catalogRegistryMeaning": "610 registered concept identities include 156 with no live node. Active coverage uses the 454 primaryConceptId identities actually scored in default-release nodes."
    },
    "totals": {
      "topics": 60,
      "waves": 12,
      "workersPerWave": 5,
      "liveCases": 1151,
      "liveNodeOccurrences": 1462,
      "liveVariants": 1457,
      "registeredConcepts": 610,
      "activeLiveConcepts": 454,
      "registeredConceptsWithoutLiveNodes": 156,
      "liveAcceptedNodes": 144,
      "liveOriginalNodes": 1318,
      "manifestAcceptanceRows": 145,
      "manifestAcceptanceRowsOutsideDefaultProjection": 1,
      "retainedNonliveInventoryRows": 1044,
      "retainedNonliveVariants": 1043,
      "materializedNonliveNodeRows": 908,
      "unassembledAuthoredVariants": 136,
      "allMappedConcepts": 725,
      "allMappedCases": 1295,
      "allMappedNodeIds": 1617,
      "allMappedVariantIds": 2493,
      "explicitOwnerHeldVersions": 13,
      "ownerDecisionQuestions": 14,
      "unkeyedParkedSlots": 4,
      "withheldTeachingPoints": 16,
      "crossTopicLiveCases": 25,
      "liveCasesWithMultipleScoredTopics": 22,
      "sourceModulesRead": 435,
      "sourceImportErrors": 0,
      "uniqueWorkerLaneFiles": 300,
      "laneCollisions": 0
    }
  },
  "activeManagerHandoff": "docs/handoffs/CURRENT_THREAD_HANDOFF.md",
  "inventory": [
    {
      "recordId": "inventory.f7c8025a0c8d1c7f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "caseId": "case.gs028b.post-neoadjuvant-breast.a-axillary-response",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.a-axillary-response.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v3"
      ],
      "chiefComplaint": "Review response imaging",
      "taskTextShort": "Which assessment frame is most appropriate?",
      "taskText": "Which assessment frame is most appropriate?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
        "line": 98,
        "export": "POST_NEoadjuvant_BREAST",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 15,
          "export": "GS028_20260929_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 16,
          "export": "GS028_20260929_CASES",
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
        "claim.nact.response-mapping"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.a-axillary-response.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.83973a2df6c544b7",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "caseId": "case.gs028b.post-neoadjuvant-breast.a-no-marker",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.a-no-marker.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v4"
      ],
      "chiefComplaint": "Nonpalpable site after therapy",
      "taskTextShort": "Which planning principle is most important?",
      "taskText": "Which planning principle is most important?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
        "line": 98,
        "export": "POST_NEoadjuvant_BREAST",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 15,
          "export": "GS028_20260929_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 16,
          "export": "GS028_20260929_CASES",
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
        "claim.nact.response-mapping"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.a-no-marker.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.fcd1fd67366500e9",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "caseId": "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1"
      ],
      "chiefComplaint": "Residual breast finding",
      "taskTextShort": "Which localization plan should be arranged for {patientName}?",
      "taskText": "Which localization plan should be arranged for {patientName}?",
      "status": "live accepted",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": {
        "acceptanceId": "B2B10",
        "sourceView": "batch2b-round2",
        "decisionFile": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
      },
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
        "line": 1577,
        "export": "QUESTION_BANK_BATCH2B_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
          "line": 1577,
          "export": "QUESTION_BANK_BATCH2B_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-20261104.ts",
          "line": 8,
          "export": "QUESTION_BANK_BATCH2B_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.nact.response-mapping",
        "claim.qbp2b.b2b10.application"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.d30ef236931a083e",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
      "caseId": "case.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2"
      ],
      "chiefComplaint": "Post-treatment breast review",
      "taskTextShort": "Which breast and axillary operation should be discussed for {patientName}?",
      "taskText": "Which breast and axillary operation should be discussed for {patientName}?",
      "status": "live accepted",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": {
        "acceptanceId": "B2B08",
        "sourceView": "batch2b-round2",
        "decisionFile": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
      },
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
        "line": 1201,
        "export": "QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
          "line": 1201,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts",
          "line": 9,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.nact.bcs-selection",
        "claim.nact.response-mapping",
        "claim.brief.ibc.core-biopsy-confirmation",
        "claim.brief.ibc.trimodality-sequence",
        "claim.qbp2b.r2.b2b08.application",
        "claim.qbp2b.r2.inflammatory-response-operation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.f944e62682cabf3c",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "caseId": "case.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v4"
      ],
      "chiefComplaint": "Conservation after response",
      "taskTextShort": "Which surgical option remains reasonable to discuss?",
      "taskText": "Which surgical option remains reasonable to discuss?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
        "line": 98,
        "export": "POST_NEoadjuvant_BREAST",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 15,
          "export": "GS028_20260929_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 16,
          "export": "GS028_20260929_CASES",
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
        "claim.nact.bcs-selection",
        "claim.nact.oncoplastic-selection"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.727ec0c610ffdfb4",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "caseId": "case.gs028b.post-neoadjuvant-breast.b-radiation-declined",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.b-radiation-declined.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v3"
      ],
      "chiefComplaint": "Preferences after chemotherapy",
      "taskTextShort": "Which operative direction should now be discussed?",
      "taskText": "Which operative direction should now be discussed?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
        "line": 98,
        "export": "POST_NEoadjuvant_BREAST",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 15,
          "export": "GS028_20260929_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 16,
          "export": "GS028_20260929_CASES",
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
        "claim.nact.bcs-selection"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.b-radiation-declined.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.ba9d9c448a10651e",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.2"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v1"
      ],
      "chiefComplaint": "Post-treatment breast mapping",
      "taskTextShort": "Which local-treatment plan best fits the patient's stated conservation goal?",
      "taskText": "Which local-treatment plan best fits the patient's stated conservation goal?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
        "line": 98,
        "export": "POST_NEoadjuvant_BREAST",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 15,
          "export": "GS028_20260929_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 16,
          "export": "GS028_20260929_CASES",
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
        "claim.nact.bcs-selection"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.7ee95b4c5e965b5f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2"
      ],
      "chiefComplaint": "Post-treatment breast mapping",
      "taskTextShort": "Which endpoints should be requested for {patientName}'s bracketing?",
      "taskText": "Which endpoints should be requested for {patientName}'s bracketing?",
      "status": "live accepted",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": {
        "acceptanceId": "B2B24",
        "sourceView": "batch2b-round2",
        "decisionFile": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
      },
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
        "line": 4444,
        "export": "QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
          "line": 4444,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts",
          "line": 9,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.nact.response-mapping",
        "claim.nact.bcs-selection",
        "claim.qbp2b.r2.b2b24.application",
        "claim.qbp2b.r2.residual-calcification-bracketing"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.238de9e452c13324",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.margin-bcs-wbrt",
      "caseId": "case.gs028c.dcis.a-five-mm-request",
      "nodeIds": [
        "node.gs028c.dcis.a-five-mm-request.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v4"
      ],
      "chiefComplaint": "Ask for a wider margin",
      "taskTextShort": "What should the surgeon recommend about re-excision when {patientName} has a 2-mm negative margin for pure DCIS with planned whole-breast irradiation?",
      "taskText": "What should the surgeon recommend about re-excision when {patientName} has a 2-mm negative margin for pure DCIS with planned whole-breast irradiation?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
        "line": 6,
        "export": "DCIS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 4,
          "export": "GS028_20261002_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 5,
          "export": "GS028_20261002_CASES",
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
        "claim.gs028c.dcis.margin-two-mm",
        "claim.gs028c.dcis.margin-no-routine-wider"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.a-five-mm-request.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.825f4a3c889c2f4b",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.final-cavity-shave-plan.v1",
      "caseId": "case.gs028c.dcis.a-one-mm-individualize",
      "nodeIds": [
        "node.gs028c.dcis.a-one-mm-individualize.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v3.r3"
      ],
      "chiefComplaint": "DCIS margin review",
      "taskTextShort": "Which breast treatment plan is most appropriate for {patientName} now?",
      "taskText": "Which breast treatment plan is most appropriate for {patientName} now?",
      "status": "live accepted",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": {
        "acceptanceId": "F01",
        "sourceView": "flags-round3",
        "decisionFile": "docs/research/question-flags-manager-decision-20261104.md"
      },
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-flags-round2-20261104-data.ts",
        "line": 11,
        "export": "QUESTION_FLAG_ROUND2_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-round2-20261104-data.ts",
          "line": 11,
          "export": "QUESTION_FLAG_ROUND2_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-flags-round2-20261104.ts",
          "line": 7,
          "export": "QUESTION_FLAG_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028c.dcis.margin-two-mm",
        "claim.gs028c.dcis.margin-no-routine-wider",
        "claim.gs028c.dcis.margin-narrow-individualize"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.a-one-mm-individualize.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.78f6485cbd42c30e",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.margin-bcs-wbrt",
      "caseId": "case.gs028c.dcis.a-three-mm-wbrt",
      "nodeIds": [
        "node.gs028c.dcis.a-three-mm-wbrt.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v2"
      ],
      "chiefComplaint": "Discuss another excision",
      "taskTextShort": "How should a 3-mm margin affect {patientName}'s surgical plan for pure DCIS with whole-breast irradiation?",
      "taskText": "How should a 3-mm margin affect {patientName}'s surgical plan for pure DCIS with whole-breast irradiation?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
        "line": 6,
        "export": "DCIS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 4,
          "export": "GS028_20261002_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 5,
          "export": "GS028_20261002_CASES",
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
        "claim.gs028c.dcis.margin-two-mm",
        "claim.gs028c.dcis.margin-no-routine-wider"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.a-three-mm-wbrt.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.61cafc85d6c08068",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.margin-bcs-wbrt",
      "caseId": "case.gs028c.dcis.a-two-mm-wbrt",
      "nodeIds": [
        "node.gs028c.dcis.a-two-mm-wbrt.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v1"
      ],
      "chiefComplaint": "Review DCIS margin",
      "taskTextShort": "Which surgical-margin recommendation is appropriate for {patientName}'s pure DCIS treated with whole-breast irradiation?",
      "taskText": "Which surgical-margin recommendation is appropriate for {patientName}'s pure DCIS treated with whole-breast irradiation?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
        "line": 6,
        "export": "DCIS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 4,
          "export": "GS028_20261002_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 5,
          "export": "GS028_20261002_CASES",
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
        "claim.gs028c.dcis.margin-two-mm"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.a-two-mm-wbrt.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.9b7ceba08a624bdf",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.sentinel-node-setting",
      "caseId": "case.gs028c.dcis.b-invasion-concern",
      "nodeIds": [
        "node.gs028c.dcis.b-invasion-concern.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v4"
      ],
      "chiefComplaint": "Review DCIS with a mass",
      "taskTextShort": "Which axillary-staging strategy is appropriate for {patientName}'s DCIS with concern for occult invasion?",
      "taskText": "Which axillary-staging strategy is appropriate for {patientName}'s DCIS with concern for occult invasion?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
        "line": 6,
        "export": "DCIS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 4,
          "export": "GS028_20261002_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 5,
          "export": "GS028_20261002_CASES",
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
        "claim.gs028c.dcis.axilla-risk-setting"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.b-invasion-concern.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.4182a81f1361e947",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.sentinel-node-setting",
      "caseId": "case.gs028c.dcis.b-mastectomy",
      "nodeIds": [
        "node.gs028c.dcis.b-mastectomy.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v1"
      ],
      "chiefComplaint": "Plan lymph-node staging",
      "taskTextShort": "Which axillary-staging strategy should accompany {patientName}'s mastectomy for pure DCIS?",
      "taskText": "Which axillary-staging strategy should accompany {patientName}'s mastectomy for pure DCIS?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
        "line": 6,
        "export": "DCIS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 4,
          "export": "GS028_20261002_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 5,
          "export": "GS028_20261002_CASES",
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
        "claim.gs028c.dcis.axilla-mastectomy"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.b-mastectomy.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.e40ab68891af5d77",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
      "nodeIds": [
        "node.gs028c.dcis.b-oncoplastic-mapping.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v3.r4"
      ],
      "chiefComplaint": "DCIS surgical planning",
      "taskTextShort": "Which axillary procedure should be planned for {patientName} at this operation?",
      "taskText": "Which axillary procedure should be planned for {patientName} at this operation?",
      "status": "live accepted",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": {
        "acceptanceId": "F10",
        "sourceView": "flags-round3",
        "decisionFile": "docs/research/question-flags-manager-decision-20261104.md"
      },
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-flags-round3-20261104-data.ts",
        "line": 1835,
        "export": "QUESTION_FLAG_ROUND3_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-round3-20261104-data.ts",
          "line": 1835,
          "export": "QUESTION_FLAG_ROUND3_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-flags-round3-20261104.ts",
          "line": 7,
          "export": "QUESTION_FLAG_ROUND3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028c.dcis.axilla-mastectomy",
        "claim.gs028c.dcis.axilla-omit-bcs",
        "claim.gs028c.dcis.axilla-risk-setting",
        "claim.qf3.dcis-specimen-operation-application"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.d05af376875fb4c1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.sentinel-node-setting",
      "caseId": "case.gs028c.dcis.b-routine-lumpectomy",
      "nodeIds": [
        "node.gs028c.dcis.b-routine-lumpectomy.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v2"
      ],
      "chiefComplaint": "Discuss node surgery",
      "taskTextShort": "Which axillary-staging strategy is appropriate for {patientName}'s routine breast-conservation operation for pure DCIS?",
      "taskText": "Which axillary-staging strategy is appropriate for {patientName}'s routine breast-conservation operation for pure DCIS?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
        "line": 6,
        "export": "DCIS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 4,
          "export": "GS028_20261002_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 5,
          "export": "GS028_20261002_CASES",
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
        "claim.gs028c.dcis.axilla-omit-bcs"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.b-routine-lumpectomy.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.ed73af3b25279c15",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "caseId": "case.inflammatory-breast-cancer.diffuse-swelling",
      "nodeIds": [
        "node.inflammatory-breast-cancer.diffuse-swelling.1"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v2"
      ],
      "chiefComplaint": "Breast swelling",
      "taskTextShort": "Which diagnostic pathway should be arranged now?",
      "taskText": "Which diagnostic pathway should be arranged now?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
        "line": 361,
        "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 361,
          "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 362,
          "export": "INFLAMMATORY_BREAST_CANCER_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.ibc.core-biopsy-confirmation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.diffuse-swelling.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.df3c372c97333ac4",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "caseId": "case.inflammatory-breast-cancer.diffuse-swelling",
      "nodeIds": [
        "node.inflammatory-breast-cancer.diffuse-swelling.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v2"
      ],
      "chiefComplaint": "Breast swelling",
      "taskTextShort": "Which treatment sequence should be planned?",
      "taskText": "Which treatment sequence should be planned?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
        "line": 361,
        "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 361,
          "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 362,
          "export": "INFLAMMATORY_BREAST_CANCER_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.ibc.trimodality-sequence"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.diffuse-swelling.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.d986ea5fe71563a4",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "caseId": "case.inflammatory-breast-cancer.peau-dorange",
      "nodeIds": [
        "node.inflammatory-breast-cancer.peau-dorange.1"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v3"
      ],
      "chiefComplaint": "Breast skin changes",
      "taskTextShort": "Which diagnostic pathway should be arranged now?",
      "taskText": "Which diagnostic pathway should be arranged now?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
        "line": 361,
        "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 361,
          "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 362,
          "export": "INFLAMMATORY_BREAST_CANCER_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.ibc.core-biopsy-confirmation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.peau-dorange.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.e8e80be66113e2a2",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "caseId": "case.inflammatory-breast-cancer.peau-dorange",
      "nodeIds": [
        "node.inflammatory-breast-cancer.peau-dorange.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v3"
      ],
      "chiefComplaint": "Breast skin changes",
      "taskTextShort": "Which treatment sequence should be planned?",
      "taskText": "Which treatment sequence should be planned?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
        "line": 361,
        "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 361,
          "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 362,
          "export": "INFLAMMATORY_BREAST_CANCER_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.ibc.trimodality-sequence"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.peau-dorange.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.b8c1c9e3fb0b5b6e",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
      "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
      "nodeIds": [
        "node.inflammatory-breast-cancer.persistent-erythema.1"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5"
      ],
      "chiefComplaint": "Breast erythema",
      "taskTextShort": "Which next care plan best fits {patientName}'s current findings?",
      "taskText": "Which next care plan best fits {patientName}'s current findings?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-quality-adversarial-r4-20261102-data.ts",
        "line": 6636,
        "export": "QUESTION_QUALITY_ADVERSARIAL_R4_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-r4-20261102-data.ts",
          "line": 6636,
          "export": "QUESTION_QUALITY_ADVERSARIAL_R4_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-20261102.ts",
          "line": 26,
          "export": "QUESTION_QUALITY_CURRENT_REVISIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-r4-20261102.ts",
          "line": 26,
          "export": "QUESTION_QUALITY_ADVERSARIAL_R4_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.brief.ibc.core-biopsy-confirmation",
        "claim.qq20261102a.ibc-core-versus-adjunctive-skin",
        "claim.qq20261102c.breast-core-target-discordance"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.b5be6528feac0c43",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
      "nodeIds": [
        "node.inflammatory-breast-cancer.persistent-erythema.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3"
      ],
      "chiefComplaint": "Breast erythema",
      "taskTextShort": "If initial systemic therapy removes the palpable breast mass and skin changes, which local treatment plan should be retained for {patientName}?",
      "taskText": "If initial systemic therapy removes the palpable breast mass and skin changes, which local treatment plan should be retained for {patientName}?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-quality-adversarial-20261102-data.ts",
        "line": 10733,
        "export": "QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-20261102-data.ts",
          "line": 10733,
          "export": "QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-20261102.ts",
          "line": 13,
          "export": "QUESTION_QUALITY_ADVERSARIAL_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.brief.ibc.trimodality-sequence",
        "claim.qq20261102a.ibc-response-local-treatment"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.31e1f9173768a0ac",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "caseId": "case.inflammatory-breast-cancer.rapid-redness",
      "nodeIds": [
        "node.inflammatory-breast-cancer.rapid-redness.1"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v1"
      ],
      "chiefComplaint": "Breast redness",
      "taskTextShort": "Which diagnostic pathway should be arranged now?",
      "taskText": "Which diagnostic pathway should be arranged now?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
        "line": 361,
        "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 361,
          "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 362,
          "export": "INFLAMMATORY_BREAST_CANCER_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.ibc.core-biopsy-confirmation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.rapid-redness.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.5f59f9a6b1656f40",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "caseId": "case.inflammatory-breast-cancer.rapid-redness",
      "nodeIds": [
        "node.inflammatory-breast-cancer.rapid-redness.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v1"
      ],
      "chiefComplaint": "Breast redness",
      "taskTextShort": "Which treatment sequence should be planned?",
      "taskText": "Which treatment sequence should be planned?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
        "line": 361,
        "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 361,
          "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 362,
          "export": "INFLAMMATORY_BREAST_CANCER_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.ibc.trimodality-sequence"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.rapid-redness.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.f46060d1c53ecc0f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.mammary-paget.full-thickness-biopsy",
      "caseId": "case.mammary-paget.areolar-rash",
      "nodeIds": [
        "node.mammary-paget.areolar-rash.1"
      ],
      "variantIds": [
        "question.mammary-paget.full-thickness-biopsy.v3"
      ],
      "chiefComplaint": "Areolar rash",
      "taskTextShort": "Which test should establish the skin diagnosis?",
      "taskText": "Which test should establish the skin diagnosis?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
        "line": 294,
        "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 294,
          "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 295,
          "export": "MAMMARY_PAGET_DISEASE_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.mammary-paget.full-thickness-biopsy"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.mammary-paget.areolar-rash.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.23e7034bcf47c61d",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.mammary-paget.underlying-breast-evaluation",
      "caseId": "case.mammary-paget.areolar-rash",
      "nodeIds": [
        "node.mammary-paget.areolar-rash.2"
      ],
      "variantIds": [
        "question.mammary-paget.underlying-breast-evaluation.v3"
      ],
      "chiefComplaint": "Areolar rash",
      "taskTextShort": "Which breast evaluation should follow?",
      "taskText": "Which breast evaluation should follow?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
        "line": 294,
        "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 294,
          "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 295,
          "export": "MAMMARY_PAGET_DISEASE_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.mammary-paget.underlying-breast-evaluation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.mammary-paget.areolar-rash.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.68dd2f4c3af7e4d9",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.mammary-paget.full-thickness-biopsy",
      "caseId": "case.mammary-paget.crusted-nipple",
      "nodeIds": [
        "node.mammary-paget.crusted-nipple.1"
      ],
      "variantIds": [
        "question.mammary-paget.full-thickness-biopsy.v1"
      ],
      "chiefComplaint": "Crusted nipple",
      "taskTextShort": "Which test should establish the skin diagnosis?",
      "taskText": "Which test should establish the skin diagnosis?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
        "line": 294,
        "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 294,
          "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 295,
          "export": "MAMMARY_PAGET_DISEASE_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.mammary-paget.full-thickness-biopsy"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.mammary-paget.crusted-nipple.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.8b47e2385064c22b",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.mammary-paget.underlying-breast-evaluation",
      "caseId": "case.mammary-paget.crusted-nipple",
      "nodeIds": [
        "node.mammary-paget.crusted-nipple.2"
      ],
      "variantIds": [
        "question.mammary-paget.underlying-breast-evaluation.v1"
      ],
      "chiefComplaint": "Crusted nipple",
      "taskTextShort": "Which breast evaluation should follow?",
      "taskText": "Which breast evaluation should follow?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
        "line": 294,
        "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 294,
          "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 295,
          "export": "MAMMARY_PAGET_DISEASE_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.mammary-paget.underlying-breast-evaluation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.mammary-paget.crusted-nipple.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.194edeb0578fdc98",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.mammary-paget.full-thickness-biopsy",
      "caseId": "case.mammary-paget.nipple-erosion",
      "nodeIds": [
        "node.mammary-paget.nipple-erosion.1"
      ],
      "variantIds": [
        "question.mammary-paget.full-thickness-biopsy.v2"
      ],
      "chiefComplaint": "Nipple erosion",
      "taskTextShort": "Which test should establish the skin diagnosis?",
      "taskText": "Which test should establish the skin diagnosis?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
        "line": 294,
        "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 294,
          "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 295,
          "export": "MAMMARY_PAGET_DISEASE_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.mammary-paget.full-thickness-biopsy"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.mammary-paget.nipple-erosion.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.9ba51a53c221bc88",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.mammary-paget.underlying-breast-evaluation",
      "caseId": "case.mammary-paget.nipple-erosion",
      "nodeIds": [
        "node.mammary-paget.nipple-erosion.2"
      ],
      "variantIds": [
        "question.mammary-paget.underlying-breast-evaluation.v2"
      ],
      "chiefComplaint": "Nipple erosion",
      "taskTextShort": "Which breast evaluation should follow?",
      "taskText": "Which breast evaluation should follow?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
        "line": 294,
        "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 294,
          "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 295,
          "export": "MAMMARY_PAGET_DISEASE_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.mammary-paget.underlying-breast-evaluation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.mammary-paget.nipple-erosion.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.5951ee29c7e35669",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.mammary-paget.full-thickness-biopsy",
      "caseId": "case.mammary-paget.scaly-nipple",
      "nodeIds": [
        "node.mammary-paget.scaly-nipple.1"
      ],
      "variantIds": [
        "question.mammary-paget.full-thickness-biopsy.v4"
      ],
      "chiefComplaint": "Scaly nipple",
      "taskTextShort": "Which test should establish the skin diagnosis?",
      "taskText": "Which test should establish the skin diagnosis?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
        "line": 294,
        "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 294,
          "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 295,
          "export": "MAMMARY_PAGET_DISEASE_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.mammary-paget.full-thickness-biopsy"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.mammary-paget.scaly-nipple.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.73a13f5ee0683ae5",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.mammary-paget.underlying-breast-evaluation",
      "caseId": "case.mammary-paget.scaly-nipple",
      "nodeIds": [
        "node.mammary-paget.scaly-nipple.2"
      ],
      "variantIds": [
        "question.mammary-paget.underlying-breast-evaluation.v4"
      ],
      "chiefComplaint": "Scaly nipple",
      "taskTextShort": "Which breast evaluation should follow?",
      "taskText": "Which breast evaluation should follow?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
        "line": 294,
        "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 294,
          "export": "MAMMARY_PAGET_DISEASE_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 295,
          "export": "MAMMARY_PAGET_DISEASE_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
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
        "claim.brief.mammary-paget.underlying-breast-evaluation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.mammary-paget.scaly-nipple.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.1f4cff1ef311195b",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "caseId": "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2"
      ],
      "chiefComplaint": "Residual breast mass",
      "taskTextShort": "Which information should guide the operative map?",
      "taskText": "Which information should guide the operative map?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
        "line": 98,
        "export": "POST_NEoadjuvant_BREAST",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 15,
          "export": "GS028_20260929_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 16,
          "export": "GS028_20260929_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.nact.response-mapping"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.3c818c683365821e",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "caseId": "case.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2"
      ],
      "chiefComplaint": "Choose breast operation",
      "taskTextShort": "Which planning direction is most appropriate?",
      "taskText": "Which planning direction is most appropriate?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
        "line": 98,
        "export": "POST_NEoadjuvant_BREAST",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 15,
          "export": "GS028_20260929_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 16,
          "export": "GS028_20260929_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.nact.bcs-selection"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.87fadb8ff2b1fa95",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "caseId": "case.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r1"
      ],
      "chiefComplaint": "Breast operation planning",
      "taskTextShort": "Which breast operation should be discussed for {patientName}?",
      "taskText": "Which breast operation should be discussed for {patientName}?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
        "line": 1276,
        "export": "QUESTION_BANK_BATCH2B_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
          "line": 1276,
          "export": "QUESTION_BANK_BATCH2B_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-20261104.ts",
          "line": 8,
          "export": "QUESTION_BANK_BATCH2B_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_CATALOG_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1548,
          "export": "QUESTION_CATALOG_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.nact.bcs-selection",
        "claim.nact.response-mapping",
        "claim.nact.oncoplastic-selection",
        "claim.qbp2b.b2b08.application"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.3e57ec0fd235f48f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1"
      ],
      "chiefComplaint": "Plan surgery after therapy",
      "taskTextShort": "Which preoperative plan best maps the treated site?",
      "taskText": "Which preoperative plan best maps the treated site?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
        "line": 98,
        "export": "POST_NEoadjuvant_BREAST",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 15,
          "export": "GS028_20260929_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 98,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 16,
          "export": "GS028_20260929_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.nact.response-mapping"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.9a6153529e7d9f8d",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1"
      ],
      "chiefComplaint": "Post-treatment breast mapping",
      "taskTextShort": "Which endpoints should be requested for {patientName}'s image-guided bracketing?",
      "taskText": "Which endpoints should be requested for {patientName}'s image-guided bracketing?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
        "line": 3635,
        "export": "QUESTION_BANK_BATCH2B_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
          "line": 3635,
          "export": "QUESTION_BANK_BATCH2B_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-20261104.ts",
          "line": 8,
          "export": "QUESTION_BANK_BATCH2B_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_CATALOG_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1548,
          "export": "QUESTION_CATALOG_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.nact.response-mapping",
        "claim.qbp2b.b2b24.application"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.661cc23c2826a8f6",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.margin-bcs-wbrt",
      "caseId": "case.gs028c.dcis.a-one-mm-individualize",
      "nodeIds": [
        "node.gs028c.dcis.a-one-mm-individualize.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v3"
      ],
      "chiefComplaint": "Review a narrow margin",
      "taskTextShort": "Which surgical-margin approach best addresses {patientName}'s 1-mm negative margin after breast-conserving surgery for pure DCIS?",
      "taskText": "Which surgical-margin approach best addresses {patientName}'s 1-mm negative margin after breast-conserving surgery for pure DCIS?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
        "line": 6,
        "export": "DCIS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 4,
          "export": "GS028_20261002_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 5,
          "export": "GS028_20261002_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028c.dcis.margin-narrow-individualize"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.a-one-mm-individualize.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.26171d7824bbfef9",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.margin-bcs-wbrt",
      "caseId": "case.gs028c.dcis.a-one-mm-individualize",
      "nodeIds": [
        "node.gs028c.dcis.a-one-mm-individualize.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v3.r2"
      ],
      "chiefComplaint": "DCIS follow-up",
      "taskTextShort": "Which next plan best addresses {patientName}'s surgical margin before irradiation?",
      "taskText": "Which next plan best addresses {patientName}'s surgical margin before irradiation?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-flags-20261104-data.ts",
        "line": 11,
        "export": "QUESTION_FLAG_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-20261104-data.ts",
          "line": 11,
          "export": "QUESTION_FLAG_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-flags-20261104.ts",
          "line": 20,
          "export": "QUESTION_FLAG_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_FLAGS_ROUND1_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1381,
          "export": "QUESTION_FLAGS_ROUND1_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028c.dcis.margin-narrow-individualize"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.a-one-mm-individualize.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.3cf435398d9eaf29",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.sentinel-node-setting",
      "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
      "nodeIds": [
        "node.gs028c.dcis.b-oncoplastic-mapping.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v3"
      ],
      "chiefComplaint": "Coordinate oncoplastic surgery",
      "taskTextShort": "Which axillary-staging plan best fits {patientName}'s pure DCIS when oncoplastic surgery will compromise later mapping?",
      "taskText": "Which axillary-staging plan best fits {patientName}'s pure DCIS when oncoplastic surgery will compromise later mapping?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
        "line": 6,
        "export": "DCIS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 4,
          "export": "GS028_20261002_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 6,
          "export": "DCIS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 5,
          "export": "GS028_20261002_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028c.dcis.axilla-risk-setting"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.962420a72809f8b6",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
      "nodeIds": [
        "node.gs028c.dcis.b-oncoplastic-mapping.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v3.r2"
      ],
      "chiefComplaint": "DCIS surgical planning",
      "taskTextShort": "Which axillary plan should accompany {patientName}'s mastectomy?",
      "taskText": "Which axillary plan should accompany {patientName}'s mastectomy?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-flags-20261104-data.ts",
        "line": 1228,
        "export": "QUESTION_FLAG_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-20261104-data.ts",
          "line": 1228,
          "export": "QUESTION_FLAG_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-flags-20261104.ts",
          "line": 20,
          "export": "QUESTION_FLAG_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_FLAGS_ROUND1_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1381,
          "export": "QUESTION_FLAGS_ROUND1_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028c.dcis.axilla-risk-setting",
        "claim.gs028c.dcis.axilla-mastectomy",
        "claim.gs028c.dcis.axilla-omit-bcs"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.e43c0d720ed294d1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
      "nodeIds": [
        "node.gs028c.dcis.b-oncoplastic-mapping.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v3.r3"
      ],
      "chiefComplaint": "DCIS surgical planning",
      "taskTextShort": "Which axillary management strategy is most appropriate for {patientName}'s current operative plan?",
      "taskText": "Which axillary management strategy is most appropriate for {patientName}'s current operative plan?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-flags-round2-20261104-data.ts",
        "line": 1954,
        "export": "QUESTION_FLAG_ROUND2_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-round2-20261104-data.ts",
          "line": 1954,
          "export": "QUESTION_FLAG_ROUND2_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-flags-round2-20261104.ts",
          "line": 7,
          "export": "QUESTION_FLAG_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_BANK_PRE_BATCH2A_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1387,
          "export": "QUESTION_BANK_PRE_BATCH2A_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028c.dcis.axilla-mastectomy",
        "claim.gs028c.dcis.axilla-omit-bcs",
        "claim.gs028c.dcis.axilla-risk-setting"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.06c91bae8b10d514",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
      "nodeIds": [
        "node.inflammatory-breast-cancer.persistent-erythema.1"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4"
      ],
      "chiefComplaint": "Breast erythema",
      "taskTextShort": "Which diagnostic pathway should be arranged now?",
      "taskText": "Which diagnostic pathway should be arranged now?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
        "line": 361,
        "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 361,
          "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 362,
          "export": "INFLAMMATORY_BREAST_CANCER_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.brief.ibc.core-biopsy-confirmation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.47de3649006952e5",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
      "nodeIds": [
        "node.inflammatory-breast-cancer.persistent-erythema.1"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r2"
      ],
      "chiefComplaint": "Breast erythema",
      "taskTextShort": "Which diagnostic plan should be arranged for {patientName}'s breast changes?",
      "taskText": "Which diagnostic plan should be arranged for {patientName}'s breast changes?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-quality-batch1-20261102-data.ts",
        "line": 5500,
        "export": "QUESTION_QUALITY_BATCH1_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-quality-batch1-20261102-data.ts",
          "line": 5500,
          "export": "QUESTION_QUALITY_BATCH1_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-quality-batch1-20261102.ts",
          "line": 7,
          "export": "QUESTION_QUALITY_BATCH1_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_QUALITY_PRE_ADVERSARIAL_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1342,
          "export": "QUESTION_QUALITY_PRE_ADVERSARIAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.brief.ibc.core-biopsy-confirmation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.c0752947e5f5d9e2",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
      "nodeIds": [
        "node.inflammatory-breast-cancer.persistent-erythema.1"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r3"
      ],
      "chiefComplaint": "Breast erythema",
      "taskTextShort": "Which tissue-sampling plan should come first for {patientName}?",
      "taskText": "Which tissue-sampling plan should come first for {patientName}?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-quality-adversarial-20261102-data.ts",
        "line": 10521,
        "export": "QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-20261102-data.ts",
          "line": 10521,
          "export": "QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-20261102.ts",
          "line": 13,
          "export": "QUESTION_QUALITY_ADVERSARIAL_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_QUALITY_PRE_ADVERSARIAL_R3_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1347,
          "export": "QUESTION_QUALITY_PRE_ADVERSARIAL_R3_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.brief.ibc.core-biopsy-confirmation",
        "claim.qq20261102a.ibc-core-versus-adjunctive-skin"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.719130e7f4099649",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
      "nodeIds": [
        "node.inflammatory-breast-cancer.persistent-erythema.1"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r4"
      ],
      "chiefComplaint": "Breast erythema",
      "taskTextShort": "Which tissue-sampling plan should be arranged next for {patientName}?",
      "taskText": "Which tissue-sampling plan should be arranged next for {patientName}?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-quality-adversarial-r3-20261102-data.ts",
        "line": 7326,
        "export": "QUESTION_QUALITY_ADVERSARIAL_R3_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-r3-20261102-data.ts",
          "line": 7326,
          "export": "QUESTION_QUALITY_ADVERSARIAL_R3_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-20261102.ts",
          "line": 14,
          "export": "QUESTION_QUALITY_PRE_ADVERSARIAL_R4_REVISIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-r3-20261102.ts",
          "line": 7,
          "export": "QUESTION_QUALITY_ADVERSARIAL_R3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_QUALITY_PRE_ADVERSARIAL_R4_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1352,
          "export": "QUESTION_QUALITY_PRE_ADVERSARIAL_R4_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.brief.ibc.core-biopsy-confirmation",
        "claim.qq20261102a.ibc-core-versus-adjunctive-skin"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.707ff368c4c91e05",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
      "nodeIds": [
        "node.inflammatory-breast-cancer.persistent-erythema.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4"
      ],
      "chiefComplaint": "Breast erythema",
      "taskTextShort": "Which treatment sequence should be planned?",
      "taskText": "Which treatment sequence should be planned?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
        "line": 361,
        "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 361,
          "export": "INFLAMMATORY_BREAST_CANCER_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 14,
          "export": "BRIEF_EARLY_LEVELS_20260917_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 362,
          "export": "INFLAMMATORY_BREAST_CANCER_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 15,
          "export": "BRIEF_EARLY_LEVELS_20260917_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.brief.ibc.trimodality-sequence"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.107fcc8ab32199a8",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
      "nodeIds": [
        "node.inflammatory-breast-cancer.persistent-erythema.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r2"
      ],
      "chiefComplaint": "Breast erythema",
      "taskTextShort": "Which treatment sequence should be planned for {patientName}'s confirmed inflammatory breast cancer?",
      "taskText": "Which treatment sequence should be planned for {patientName}'s confirmed inflammatory breast cancer?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-quality-batch1-20261102-data.ts",
        "line": 5595,
        "export": "QUESTION_QUALITY_BATCH1_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-quality-batch1-20261102-data.ts",
          "line": 5595,
          "export": "QUESTION_QUALITY_BATCH1_DEFINITIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-quality-batch1-20261102.ts",
          "line": 7,
          "export": "QUESTION_QUALITY_BATCH1_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_QUALITY_PRE_ADVERSARIAL_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1342,
          "export": "QUESTION_QUALITY_PRE_ADVERSARIAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.brief.ibc.trimodality-sequence"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.2",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.9e04457e3e6a62f1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "caseId": "case.n4.dcis-gland-removal-and-sentinel-sequence.v1",
      "nodeIds": [
        "node.n4.dcis-gland-removal-and-sentinel-sequence.v1"
      ],
      "variantIds": [
        "question.n4.dcis-gland-removal-and-sentinel-sequence.v1"
      ],
      "chiefComplaint": "DCIS surgery",
      "taskTextShort": "Which axillary plan should be selected for {patientName}'s DCIS surgery?",
      "taskText": "Which axillary plan should be selected for {patientName}'s DCIS surgery?",
      "status": "draft parked",
      "retentionState": "explicit editorial park",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [
        "review.n4.dcis-gland-removal-and-sentinel-sequence.v1"
      ],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n4-20261110.ts",
        "line": 40,
        "export": "QUESTION_NEW_N4_CATALOG_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n4-20261110.ts",
          "line": 40,
          "export": "QUESTION_NEW_N4_CATALOG_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-n4-accepted-20261110.ts",
          "line": null,
          "export": "QUESTION_NEW_N4_CATALOG_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n4-20261110.ts",
          "line": 41,
          "export": "QUESTION_NEW_N4_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
          "line": 47,
          "export": "QUESTION_NEW_N4_ROUND2_CATALOG_RELEASE",
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
        "claim.n4.c47adccfb385",
        "claim.n4.dd856cda49d5",
        "claim.n4.6c61d104e5a1",
        "claim.n4.ddbff2935560"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n4.dcis-gland-removal-and-sentinel-sequence.v1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    },
    {
      "recordId": "inventory.02be90363ef5bc68",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n4r2.lumpectomy-target-marker-reconciliation",
      "caseId": "case.n4.lumpectomy-marker-identity-and-target.v1",
      "nodeIds": [
        "node.n4.lumpectomy-marker-identity-and-target.v1"
      ],
      "variantIds": [
        "question.n4.lumpectomy-marker-identity-and-target.v1"
      ],
      "chiefComplaint": "Lumpectomy",
      "taskTextShort": "Which operative plan should be selected for {patientName} before closure?",
      "taskText": "Which operative plan should be selected for {patientName} before closure?",
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
        "claim.n4r2.bcs-all-targets",
        "claim.n4r2.bcs-specimen-confirmation"
      ],
      "casePrimaryTopicSlug": "breast-cancer",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n4.lumpectomy-marker-identity-and-target.v1",
          "primaryTopicSlug": "breast-cancer"
        }
      ]
    }
  ],
  "concepts": [
    {
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection",
      "displayName": "Select breast conservation after neoadjuvant therapy",
      "learningObjective": "Recognize selected noninflammatory breast cancers that remain eligible for breast conservation after response.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 3,
      "liveNodeOccurrences": 3,
      "inventoryRecordIds": [
        "inventory.f944e62682cabf3c",
        "inventory.727ec0c610ffdfb4",
        "inventory.ba9d9c448a10651e",
        "inventory.3c818c683365821e",
        "inventory.87fadb8ff2b1fa95"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 97,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 13,
          "export": "GS028_20260929_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "displayName": "Map breast cancer response after neoadjuvant therapy",
      "learningObjective": "Integrate baseline and post-treatment breast/axillary findings and localization into operative mapping.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live accepted",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.f7c8025a0c8d1c7f",
        "inventory.83973a2df6c544b7",
        "inventory.fcd1fd67366500e9",
        "inventory.7ee95b4c5e965b5f",
        "inventory.1f4cff1ef311195b",
        "inventory.3e57ec0fd235f48f",
        "inventory.9a6153529e7d9f8d"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
          "line": 97,
          "export": "POST_NEoadjuvant_BREAST",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 13,
          "export": "GS028_20260929_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
      "displayName": "Retain the inflammatory-disease boundary after response",
      "learningObjective": "Interpret the pretreatment skin/pathology record and apply its breast and axillary surgical implications despite a reassuring current response.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live accepted",
      "liveCases": 1,
      "liveNodeOccurrences": 1,
      "inventoryRecordIds": [
        "inventory.d30ef236931a083e"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
          "line": 1268,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_CONCEPT_VERSIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts",
          "line": 10,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.dcis.final-cavity-shave-plan.v1",
      "displayName": "Apply final DCIS cavity-margin findings",
      "learningObjective": "Reconcile oriented main and additional cavity specimens, then apply the pure-DCIS margin rule to the final treatment decision.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live accepted",
      "liveCases": 1,
      "liveNodeOccurrences": 1,
      "inventoryRecordIds": [
        "inventory.825f4a3c889c2f4b"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-round2-20261104-data.ts",
          "line": 126,
          "export": "QUESTION_FLAG_ROUND2_CONCEPT_VERSIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-flags-round2-20261104.ts",
          "line": 8,
          "export": "QUESTION_FLAG_ROUND2_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.dcis.margin-bcs-wbrt",
      "displayName": "DCIS margins with breast conservation",
      "learningObjective": "Apply the 2-mm standard and individualize narrower negative margins for pure DCIS treated with breast conservation and whole-breast irradiation.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 3,
      "liveNodeOccurrences": 3,
      "inventoryRecordIds": [
        "inventory.238de9e452c13324",
        "inventory.78f6485cbd42c30e",
        "inventory.61cafc85d6c08068",
        "inventory.661cc23c2826a8f6",
        "inventory.26171d7824bbfef9"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 17,
          "export": "DCIS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 2,
          "export": "GS028_20261002_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "displayName": "DCIS axillary staging at mastectomy",
      "learningObjective": "Apply the planned mastectomy setting to choose the timing and extent of axillary staging for sampled DCIS.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live accepted",
      "liveCases": 1,
      "liveNodeOccurrences": 1,
      "inventoryRecordIds": [
        "inventory.e40ab68891af5d77",
        "inventory.962420a72809f8b6",
        "inventory.e43c0d720ed294d1",
        "inventory.9e04457e3e6a62f1"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-20261104-data.ts",
          "line": 1292,
          "export": "QUESTION_FLAG_CONCEPT_VERSIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-new-n4-reference-bindings.ts",
          "line": 41,
          "export": "QUESTION_NEW_N4_REUSED_CONCEPTS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-flags-20261104.ts",
          "line": 21,
          "export": "QUESTION_FLAG_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n4-20261110.ts",
          "line": 47,
          "export": "QUESTION_NEW_N4_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
          "line": 47,
          "export": "QUESTION_NEW_N4_ROUND2_CATALOG_RELEASE",
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
    },
    {
      "conceptId": "concept.dcis.sentinel-node-setting",
      "displayName": "Sentinel-node staging in DCIS",
      "learningObjective": "Use the planned breast operation, future mapping, and invasion concern to decide whether DCIS requires sentinel-node staging.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 3,
      "liveNodeOccurrences": 3,
      "inventoryRecordIds": [
        "inventory.9b7ceba08a624bdf",
        "inventory.4182a81f1361e947",
        "inventory.d05af376875fb4c1",
        "inventory.3cf435398d9eaf29"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
          "line": 17,
          "export": "DCIS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
          "line": 2,
          "export": "GS028_20261002_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation",
      "displayName": "Tissue confirmation of inflammatory breast cancer",
      "learningObjective": "Arrange breast core biopsy and staging for a rapid diffuse inflammatory breast presentation without an abscess.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 3,
      "liveNodeOccurrences": 3,
      "inventoryRecordIds": [
        "inventory.ed73af3b25279c15",
        "inventory.d986ea5fe71563a4",
        "inventory.31e1f9173768a0ac",
        "inventory.06c91bae8b10d514",
        "inventory.47de3649006952e5",
        "inventory.c0752947e5f5d9e2",
        "inventory.719130e7f4099649"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 24,
          "export": "INFLAMMATORY_BREAST_CANCER_CONCEPTS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 12,
          "export": "BRIEF_EARLY_LEVELS_20260917_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
      "displayName": "Resolve breast imaging/core-biopsy discordance",
      "learningObjective": "Interpret target position and specimen contents after a benign breast core result and choose representative further tissue assessment rather than dismiss a persistent suspicious parenchymal lesion.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 1,
      "liveNodeOccurrences": 1,
      "inventoryRecordIds": [
        "inventory.b8c1c9e3fb0b5b6e"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-r4-20261102-data.ts",
          "line": 6718,
          "export": "QUESTION_QUALITY_ADVERSARIAL_R4_CONCEPT_VERSIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-quality-adversarial-r4-20261102.ts",
          "line": 27,
          "export": "QUESTION_QUALITY_ADVERSARIAL_R4_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "displayName": "Neoadjuvant sequence for stage III inflammatory breast cancer",
      "learningObjective": "Select neoadjuvant systemic therapy before modified radical mastectomy and postmastectomy radiation for stage III inflammatory breast cancer.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.df3c372c97333ac4",
        "inventory.e8e80be66113e2a2",
        "inventory.b5be6528feac0c43",
        "inventory.5f59f9a6b1656f40",
        "inventory.707ff368c4c91e05",
        "inventory.107fcc8ab32199a8"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
          "line": 25,
          "export": "INFLAMMATORY_BREAST_CANCER_CONCEPTS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 12,
          "export": "BRIEF_EARLY_LEVELS_20260917_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.mammary-paget.full-thickness-biopsy",
      "displayName": "Full-thickness biopsy for suspected mammary Paget disease",
      "learningObjective": "Select full-thickness nipple-areolar skin biopsy for persistent unilateral changes suspicious for mammary Paget disease.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.f46060d1c53ecc0f",
        "inventory.68dd2f4c3af7e4d9",
        "inventory.194edeb0578fdc98",
        "inventory.5951ee29c7e35669"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 22,
          "export": "MAMMARY_PAGET_DISEASE_CONCEPTS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 12,
          "export": "BRIEF_EARLY_LEVELS_20260917_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.mammary-paget.underlying-breast-evaluation",
      "displayName": "Underlying breast evaluation after mammary Paget diagnosis",
      "learningObjective": "Evaluate for underlying breast carcinoma with mammography and ultrasound after mammary Paget disease is confirmed.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.23e7034bcf47c61d",
        "inventory.8b47e2385064c22b",
        "inventory.9ba51a53c221bc88",
        "inventory.73a13f5ee0683ae5"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
          "line": 23,
          "export": "MAMMARY_PAGET_DISEASE_CONCEPTS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
          "line": 12,
          "export": "BRIEF_EARLY_LEVELS_20260917_AUTHORING_CONCEPTS",
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
    },
    {
      "conceptId": "concept.n4r2.lumpectomy-target-marker-reconciliation",
      "displayName": "Lumpectomy",
      "learningObjective": "Reconcile specimen and preoperative marker identities before deciding whether the current breast excision contains the malignant target.",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.02be90363ef5bc68"
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
    }
  ],
  "caseAssignments": [
    {
      "caseId": "case.gs028b.post-neoadjuvant-breast.a-axillary-response",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.f7c8025a0c8d1c7f"
      ],
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.a-axillary-response.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028b.post-neoadjuvant-breast.a-no-marker",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.83973a2df6c544b7"
      ],
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.a-no-marker.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028b.post-neoadjuvant-breast.a-residual-palpable",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.fcd1fd67366500e9",
        "inventory.1f4cff1ef311195b"
      ],
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028b.post-neoadjuvant-breast.b-diffuse-residual",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.d30ef236931a083e",
        "inventory.3c818c683365821e",
        "inventory.87fadb8ff2b1fa95"
      ],
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2",
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2",
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.f944e62682cabf3c"
      ],
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028b.post-neoadjuvant-breast.b-radiation-declined",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.727ec0c610ffdfb4"
      ],
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.b-radiation-declined.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028b.post-neoadjuvant-breast.paired-marker-residual",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.ba9d9c448a10651e",
        "inventory.7ee95b4c5e965b5f",
        "inventory.3e57ec0fd235f48f",
        "inventory.9a6153529e7d9f8d"
      ],
      "nodeIds": [
        "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.2",
        "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1"
      ],
      "variantIds": [
        "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v1",
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2",
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1",
        "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.dcis.a-five-mm-request",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.238de9e452c13324"
      ],
      "nodeIds": [
        "node.gs028c.dcis.a-five-mm-request.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.dcis.a-one-mm-individualize",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.825f4a3c889c2f4b",
        "inventory.661cc23c2826a8f6",
        "inventory.26171d7824bbfef9"
      ],
      "nodeIds": [
        "node.gs028c.dcis.a-one-mm-individualize.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v3.r3",
        "question.dcis.margin-bcs-wbrt.v3",
        "question.dcis.margin-bcs-wbrt.v3.r2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.dcis.a-three-mm-wbrt",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.78f6485cbd42c30e"
      ],
      "nodeIds": [
        "node.gs028c.dcis.a-three-mm-wbrt.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.dcis.a-two-mm-wbrt",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.61cafc85d6c08068"
      ],
      "nodeIds": [
        "node.gs028c.dcis.a-two-mm-wbrt.1"
      ],
      "variantIds": [
        "question.dcis.margin-bcs-wbrt.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.dcis.b-invasion-concern",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.9b7ceba08a624bdf"
      ],
      "nodeIds": [
        "node.gs028c.dcis.b-invasion-concern.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.dcis.b-mastectomy",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.4182a81f1361e947"
      ],
      "nodeIds": [
        "node.gs028c.dcis.b-mastectomy.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.dcis.b-oncoplastic-mapping",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.e40ab68891af5d77",
        "inventory.3cf435398d9eaf29",
        "inventory.962420a72809f8b6",
        "inventory.e43c0d720ed294d1"
      ],
      "nodeIds": [
        "node.gs028c.dcis.b-oncoplastic-mapping.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v3.r4",
        "question.dcis.sentinel-node-setting.v3",
        "question.dcis.sentinel-node-setting.v3.r2",
        "question.dcis.sentinel-node-setting.v3.r3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.dcis.b-routine-lumpectomy",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.d05af376875fb4c1"
      ],
      "nodeIds": [
        "node.gs028c.dcis.b-routine-lumpectomy.1"
      ],
      "variantIds": [
        "question.dcis.sentinel-node-setting.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.inflammatory-breast-cancer.diffuse-swelling",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.ed73af3b25279c15",
        "inventory.df3c372c97333ac4"
      ],
      "nodeIds": [
        "node.inflammatory-breast-cancer.diffuse-swelling.1",
        "node.inflammatory-breast-cancer.diffuse-swelling.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.inflammatory-breast-cancer.peau-dorange",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.d986ea5fe71563a4",
        "inventory.e8e80be66113e2a2"
      ],
      "nodeIds": [
        "node.inflammatory-breast-cancer.peau-dorange.1",
        "node.inflammatory-breast-cancer.peau-dorange.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v3",
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.inflammatory-breast-cancer.persistent-erythema",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.b8c1c9e3fb0b5b6e",
        "inventory.b5be6528feac0c43",
        "inventory.06c91bae8b10d514",
        "inventory.47de3649006952e5",
        "inventory.c0752947e5f5d9e2",
        "inventory.719130e7f4099649",
        "inventory.707ff368c4c91e05",
        "inventory.107fcc8ab32199a8"
      ],
      "nodeIds": [
        "node.inflammatory-breast-cancer.persistent-erythema.1",
        "node.inflammatory-breast-cancer.persistent-erythema.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5",
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3",
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4",
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r2",
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r3",
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r4",
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4",
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.inflammatory-breast-cancer.rapid-redness",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.31e1f9173768a0ac",
        "inventory.5f59f9a6b1656f40"
      ],
      "nodeIds": [
        "node.inflammatory-breast-cancer.rapid-redness.1",
        "node.inflammatory-breast-cancer.rapid-redness.2"
      ],
      "variantIds": [
        "question.inflammatory-breast-cancer.core-biopsy-confirmation.v1",
        "question.inflammatory-breast-cancer.neoadjuvant-sequence.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.mammary-paget.areolar-rash",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.f46060d1c53ecc0f",
        "inventory.23e7034bcf47c61d"
      ],
      "nodeIds": [
        "node.mammary-paget.areolar-rash.1",
        "node.mammary-paget.areolar-rash.2"
      ],
      "variantIds": [
        "question.mammary-paget.full-thickness-biopsy.v3",
        "question.mammary-paget.underlying-breast-evaluation.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.mammary-paget.crusted-nipple",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.68dd2f4c3af7e4d9",
        "inventory.8b47e2385064c22b"
      ],
      "nodeIds": [
        "node.mammary-paget.crusted-nipple.1",
        "node.mammary-paget.crusted-nipple.2"
      ],
      "variantIds": [
        "question.mammary-paget.full-thickness-biopsy.v1",
        "question.mammary-paget.underlying-breast-evaluation.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.mammary-paget.nipple-erosion",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.194edeb0578fdc98",
        "inventory.9ba51a53c221bc88"
      ],
      "nodeIds": [
        "node.mammary-paget.nipple-erosion.1",
        "node.mammary-paget.nipple-erosion.2"
      ],
      "variantIds": [
        "question.mammary-paget.full-thickness-biopsy.v2",
        "question.mammary-paget.underlying-breast-evaluation.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.mammary-paget.scaly-nipple",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "breast-cancer"
      ],
      "inventoryRecordIds": [
        "inventory.5951ee29c7e35669",
        "inventory.73a13f5ee0683ae5"
      ],
      "nodeIds": [
        "node.mammary-paget.scaly-nipple.1",
        "node.mammary-paget.scaly-nipple.2"
      ],
      "variantIds": [
        "question.mammary-paget.full-thickness-biopsy.v4",
        "question.mammary-paget.underlying-breast-evaluation.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n4.dcis-gland-removal-and-sentinel-sequence.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.9e04457e3e6a62f1"
      ],
      "nodeIds": [
        "node.n4.dcis-gland-removal-and-sentinel-sequence.v1"
      ],
      "variantIds": [
        "question.n4.dcis-gland-removal-and-sentinel-sequence.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n4.lumpectomy-marker-identity-and-target.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.02be90363ef5bc68"
      ],
      "nodeIds": [
        "node.n4.lumpectomy-marker-identity-and-target.v1"
      ],
      "variantIds": [
        "question.n4.lumpectomy-marker-identity-and-target.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    }
  ],
  "nodeAssignments": [
    {
      "nodeId": "node.gs028b.post-neoadjuvant-breast.a-axillary-response.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.f7c8025a0c8d1c7f"
      ]
    },
    {
      "nodeId": "node.gs028b.post-neoadjuvant-breast.a-no-marker.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.83973a2df6c544b7"
      ]
    },
    {
      "nodeId": "node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.fcd1fd67366500e9",
        "inventory.1f4cff1ef311195b"
      ]
    },
    {
      "nodeId": "node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
        "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
      ],
      "inventoryRecordIds": [
        "inventory.d30ef236931a083e",
        "inventory.3c818c683365821e",
        "inventory.87fadb8ff2b1fa95"
      ]
    },
    {
      "nodeId": "node.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
      ],
      "inventoryRecordIds": [
        "inventory.f944e62682cabf3c"
      ]
    },
    {
      "nodeId": "node.gs028b.post-neoadjuvant-breast.b-radiation-declined.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
      ],
      "inventoryRecordIds": [
        "inventory.727ec0c610ffdfb4"
      ]
    },
    {
      "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.7ee95b4c5e965b5f",
        "inventory.3e57ec0fd235f48f",
        "inventory.9a6153529e7d9f8d"
      ]
    },
    {
      "nodeId": "node.gs028b.post-neoadjuvant-breast.paired-marker-residual.2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
      ],
      "inventoryRecordIds": [
        "inventory.ba9d9c448a10651e"
      ]
    },
    {
      "nodeId": "node.gs028c.dcis.a-five-mm-request.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.margin-bcs-wbrt"
      ],
      "inventoryRecordIds": [
        "inventory.238de9e452c13324"
      ]
    },
    {
      "nodeId": "node.gs028c.dcis.a-one-mm-individualize.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.final-cavity-shave-plan.v1",
        "concept.dcis.margin-bcs-wbrt"
      ],
      "inventoryRecordIds": [
        "inventory.825f4a3c889c2f4b",
        "inventory.661cc23c2826a8f6",
        "inventory.26171d7824bbfef9"
      ]
    },
    {
      "nodeId": "node.gs028c.dcis.a-three-mm-wbrt.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.margin-bcs-wbrt"
      ],
      "inventoryRecordIds": [
        "inventory.78f6485cbd42c30e"
      ]
    },
    {
      "nodeId": "node.gs028c.dcis.a-two-mm-wbrt.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.margin-bcs-wbrt"
      ],
      "inventoryRecordIds": [
        "inventory.61cafc85d6c08068"
      ]
    },
    {
      "nodeId": "node.gs028c.dcis.b-invasion-concern.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.sentinel-node-setting"
      ],
      "inventoryRecordIds": [
        "inventory.9b7ceba08a624bdf"
      ]
    },
    {
      "nodeId": "node.gs028c.dcis.b-mastectomy.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.sentinel-node-setting"
      ],
      "inventoryRecordIds": [
        "inventory.4182a81f1361e947"
      ]
    },
    {
      "nodeId": "node.gs028c.dcis.b-oncoplastic-mapping.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.sentinel-node-mastectomy.v1",
        "concept.dcis.sentinel-node-setting"
      ],
      "inventoryRecordIds": [
        "inventory.e40ab68891af5d77",
        "inventory.3cf435398d9eaf29",
        "inventory.962420a72809f8b6",
        "inventory.e43c0d720ed294d1"
      ]
    },
    {
      "nodeId": "node.gs028c.dcis.b-routine-lumpectomy.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.sentinel-node-setting"
      ],
      "inventoryRecordIds": [
        "inventory.d05af376875fb4c1"
      ]
    },
    {
      "nodeId": "node.inflammatory-breast-cancer.diffuse-swelling.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.ed73af3b25279c15"
      ]
    },
    {
      "nodeId": "node.inflammatory-breast-cancer.diffuse-swelling.2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.df3c372c97333ac4"
      ]
    },
    {
      "nodeId": "node.inflammatory-breast-cancer.peau-dorange.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.d986ea5fe71563a4"
      ]
    },
    {
      "nodeId": "node.inflammatory-breast-cancer.peau-dorange.2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.e8e80be66113e2a2"
      ]
    },
    {
      "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.b8c1c9e3fb0b5b6e",
        "inventory.06c91bae8b10d514",
        "inventory.47de3649006952e5",
        "inventory.c0752947e5f5d9e2",
        "inventory.719130e7f4099649"
      ]
    },
    {
      "nodeId": "node.inflammatory-breast-cancer.persistent-erythema.2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.b5be6528feac0c43",
        "inventory.707ff368c4c91e05",
        "inventory.107fcc8ab32199a8"
      ]
    },
    {
      "nodeId": "node.inflammatory-breast-cancer.rapid-redness.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.31e1f9173768a0ac"
      ]
    },
    {
      "nodeId": "node.inflammatory-breast-cancer.rapid-redness.2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.5f59f9a6b1656f40"
      ]
    },
    {
      "nodeId": "node.mammary-paget.areolar-rash.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.full-thickness-biopsy"
      ],
      "inventoryRecordIds": [
        "inventory.f46060d1c53ecc0f"
      ]
    },
    {
      "nodeId": "node.mammary-paget.areolar-rash.2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.underlying-breast-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.23e7034bcf47c61d"
      ]
    },
    {
      "nodeId": "node.mammary-paget.crusted-nipple.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.full-thickness-biopsy"
      ],
      "inventoryRecordIds": [
        "inventory.68dd2f4c3af7e4d9"
      ]
    },
    {
      "nodeId": "node.mammary-paget.crusted-nipple.2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.underlying-breast-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.8b47e2385064c22b"
      ]
    },
    {
      "nodeId": "node.mammary-paget.nipple-erosion.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.full-thickness-biopsy"
      ],
      "inventoryRecordIds": [
        "inventory.194edeb0578fdc98"
      ]
    },
    {
      "nodeId": "node.mammary-paget.nipple-erosion.2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.underlying-breast-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.9ba51a53c221bc88"
      ]
    },
    {
      "nodeId": "node.mammary-paget.scaly-nipple.1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.full-thickness-biopsy"
      ],
      "inventoryRecordIds": [
        "inventory.5951ee29c7e35669"
      ]
    },
    {
      "nodeId": "node.mammary-paget.scaly-nipple.2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.underlying-breast-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.73a13f5ee0683ae5"
      ]
    },
    {
      "nodeId": "node.n4.dcis-gland-removal-and-sentinel-sequence.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.dcis.sentinel-node-mastectomy.v1"
      ],
      "inventoryRecordIds": [
        "inventory.9e04457e3e6a62f1"
      ]
    },
    {
      "nodeId": "node.n4.lumpectomy-marker-identity-and-target.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n4r2.lumpectomy-target-marker-reconciliation"
      ],
      "inventoryRecordIds": [
        "inventory.02be90363ef5bc68"
      ]
    }
  ],
  "variantAssignments": [
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
      ],
      "inventoryRecordIds": [
        "inventory.ba9d9c448a10651e"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
      ],
      "inventoryRecordIds": [
        "inventory.3c818c683365821e"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
      ],
      "inventoryRecordIds": [
        "inventory.87fadb8ff2b1fa95"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1"
      ],
      "inventoryRecordIds": [
        "inventory.d30ef236931a083e"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
      ],
      "inventoryRecordIds": [
        "inventory.727ec0c610ffdfb4"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection"
      ],
      "inventoryRecordIds": [
        "inventory.f944e62682cabf3c"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.3e57ec0fd235f48f"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.9a6153529e7d9f8d"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.7ee95b4c5e965b5f"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.1f4cff1ef311195b"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.fcd1fd67366500e9"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.f7c8025a0c8d1c7f"
      ]
    },
    {
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.83973a2df6c544b7"
      ]
    },
    {
      "variantId": "question.dcis.margin-bcs-wbrt.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.margin-bcs-wbrt"
      ],
      "inventoryRecordIds": [
        "inventory.61cafc85d6c08068"
      ]
    },
    {
      "variantId": "question.dcis.margin-bcs-wbrt.v2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.margin-bcs-wbrt"
      ],
      "inventoryRecordIds": [
        "inventory.78f6485cbd42c30e"
      ]
    },
    {
      "variantId": "question.dcis.margin-bcs-wbrt.v3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.dcis.margin-bcs-wbrt"
      ],
      "inventoryRecordIds": [
        "inventory.661cc23c2826a8f6"
      ]
    },
    {
      "variantId": "question.dcis.margin-bcs-wbrt.v3.r2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.dcis.margin-bcs-wbrt"
      ],
      "inventoryRecordIds": [
        "inventory.26171d7824bbfef9"
      ]
    },
    {
      "variantId": "question.dcis.margin-bcs-wbrt.v3.r3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.final-cavity-shave-plan.v1"
      ],
      "inventoryRecordIds": [
        "inventory.825f4a3c889c2f4b"
      ]
    },
    {
      "variantId": "question.dcis.margin-bcs-wbrt.v4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.margin-bcs-wbrt"
      ],
      "inventoryRecordIds": [
        "inventory.238de9e452c13324"
      ]
    },
    {
      "variantId": "question.dcis.sentinel-node-setting.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.sentinel-node-setting"
      ],
      "inventoryRecordIds": [
        "inventory.4182a81f1361e947"
      ]
    },
    {
      "variantId": "question.dcis.sentinel-node-setting.v2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.sentinel-node-setting"
      ],
      "inventoryRecordIds": [
        "inventory.d05af376875fb4c1"
      ]
    },
    {
      "variantId": "question.dcis.sentinel-node-setting.v3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.dcis.sentinel-node-setting"
      ],
      "inventoryRecordIds": [
        "inventory.3cf435398d9eaf29"
      ]
    },
    {
      "variantId": "question.dcis.sentinel-node-setting.v3.r2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.dcis.sentinel-node-mastectomy.v1"
      ],
      "inventoryRecordIds": [
        "inventory.962420a72809f8b6"
      ]
    },
    {
      "variantId": "question.dcis.sentinel-node-setting.v3.r3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.dcis.sentinel-node-mastectomy.v1"
      ],
      "inventoryRecordIds": [
        "inventory.e43c0d720ed294d1"
      ]
    },
    {
      "variantId": "question.dcis.sentinel-node-setting.v3.r4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.sentinel-node-mastectomy.v1"
      ],
      "inventoryRecordIds": [
        "inventory.e40ab68891af5d77"
      ]
    },
    {
      "variantId": "question.dcis.sentinel-node-setting.v4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.dcis.sentinel-node-setting"
      ],
      "inventoryRecordIds": [
        "inventory.9b7ceba08a624bdf"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.31e1f9173768a0ac"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.ed73af3b25279c15"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.d986ea5fe71563a4"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.06c91bae8b10d514"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.47de3649006952e5"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.c0752947e5f5d9e2"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation"
      ],
      "inventoryRecordIds": [
        "inventory.719130e7f4099649"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2"
      ],
      "inventoryRecordIds": [
        "inventory.b8c1c9e3fb0b5b6e"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.5f59f9a6b1656f40"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.df3c372c97333ac4"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.e8e80be66113e2a2"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.707ff368c4c91e05"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.107fcc8ab32199a8"
      ]
    },
    {
      "variantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.inflammatory-breast-cancer.neoadjuvant-sequence"
      ],
      "inventoryRecordIds": [
        "inventory.b5be6528feac0c43"
      ]
    },
    {
      "variantId": "question.mammary-paget.full-thickness-biopsy.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.full-thickness-biopsy"
      ],
      "inventoryRecordIds": [
        "inventory.68dd2f4c3af7e4d9"
      ]
    },
    {
      "variantId": "question.mammary-paget.full-thickness-biopsy.v2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.full-thickness-biopsy"
      ],
      "inventoryRecordIds": [
        "inventory.194edeb0578fdc98"
      ]
    },
    {
      "variantId": "question.mammary-paget.full-thickness-biopsy.v3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.full-thickness-biopsy"
      ],
      "inventoryRecordIds": [
        "inventory.f46060d1c53ecc0f"
      ]
    },
    {
      "variantId": "question.mammary-paget.full-thickness-biopsy.v4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.full-thickness-biopsy"
      ],
      "inventoryRecordIds": [
        "inventory.5951ee29c7e35669"
      ]
    },
    {
      "variantId": "question.mammary-paget.underlying-breast-evaluation.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.underlying-breast-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.8b47e2385064c22b"
      ]
    },
    {
      "variantId": "question.mammary-paget.underlying-breast-evaluation.v2",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.underlying-breast-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.9ba51a53c221bc88"
      ]
    },
    {
      "variantId": "question.mammary-paget.underlying-breast-evaluation.v3",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.underlying-breast-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.23e7034bcf47c61d"
      ]
    },
    {
      "variantId": "question.mammary-paget.underlying-breast-evaluation.v4",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.mammary-paget.underlying-breast-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.73a13f5ee0683ae5"
      ]
    },
    {
      "variantId": "question.n4.dcis-gland-removal-and-sentinel-sequence.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.dcis.sentinel-node-mastectomy.v1"
      ],
      "inventoryRecordIds": [
        "inventory.9e04457e3e6a62f1"
      ]
    },
    {
      "variantId": "question.n4.lumpectomy-marker-identity-and-target.v1",
      "primaryTopicSlug": "breast-cancer",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n4r2.lumpectomy-target-marker-reconciliation"
      ],
      "inventoryRecordIds": [
        "inventory.02be90363ef5bc68"
      ]
    }
  ],
  "identityReuseNotes": [],
  "recordedHolds": [
    {
      "id": "review.n4.dcis-gland-removal-and-sentinel-sequence.v1",
      "kind": "quality_park",
      "recordFile": "docs/research/question-new-n4-round2-20261110.json",
      "reason": "The actual operation choice is determined preoperatively. No verified new intraoperative finding changes the axillary decision; an intra-op version would be misleading.",
      "match": {
        "variantId": "question.n4.dcis-gland-removal-and-sentinel-sequence.v1"
      },
      "slot": "R1:dcis-gland-removal-and-sentinel-sequence",
      "ownerQuestion": null,
      "inventoryRecordIds": [
        "inventory.9e04457e3e6a62f1"
      ]
    }
  ],
  "unkeyedDraftSlots": [],
  "withheldTeachingPoints": [],
  "ownerApprovalsNeeded": [],
  "inputFiles": [
    {
      "file": "packages/clinical-content/src/development-batch/2026-09-17/brief-early-levels-batch.ts",
      "sha256": "360561d1f1607b99e5f23af95fe56d757408a7afd118cf9e9c1cf6c3cee28846"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts",
      "sha256": "a5cabef53a078d5c4813c9bb3b844fdde15ce9451fd30d5673200f5daa2be2a8"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts",
      "sha256": "4c4c27ce5d13ac439682056b4491f101c0952f21f7e0f99d8613cc613904951c"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts",
      "sha256": "811e612623e9de1ba59029730b65f09a93fe27d743296cde4840325c6561c765"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/pre-endoscopy-batch.ts",
      "sha256": "01fa8f226f4efb192848752d4a5f5e4e2ba1f25aa4d0678a57bd7f14009b23d9"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts",
      "sha256": "37c43fba3d14b044b3f06b5625c10ab17e37c98ff8afb80225b2e2764af67bf9"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
      "sha256": "2b04f9d100b5b432bc0f16c06dfe128ec129dbe924b898ce1f2fb829ae808f07"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/pre-endoscopy-batch.ts",
      "sha256": "00131bcdbbca213cbeacb9f640a406761cd017ee8e9b94cab9b9da7c40bd67ed"
    },
    {
      "file": "packages/clinical-content/src/index.ts",
      "sha256": "9b9217631c612cf22b5237808d4eedf0b065472d165190bfbcec2b691921ae5b"
    },
    {
      "file": "packages/clinical-content/src/pilot-content.ts",
      "sha256": "2c0d3b7e5232eb9602640601e736aa79a0d2991be19a4258f89aa38d772ac963"
    },
    {
      "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
      "sha256": "5c03e84388207c06ba6e721741b7383cb78e460ab98da4ace4aef1a082795196"
    },
    {
      "file": "packages/clinical-content/src/question-bank-batch2b-20261104.ts",
      "sha256": "3d768de874bc821c1aa312d59c6f92b03717dec3f59555e1b61047d39733049d"
    },
    {
      "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
      "sha256": "32bad25a7d35431e7e8fb6c2f3868905097007c4e3512f2bb8b61430af4834df"
    },
    {
      "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts",
      "sha256": "358051fb4ad7441513e379f835cc6afd9d69a59aa2729a93fad594db55ea4dfe"
    },
    {
      "file": "packages/clinical-content/src/question-flags-20261104-data.ts",
      "sha256": "0fa520db3a9c3bdedc3bbfc136e8ec1d23f2f259191712a848a05d7344dfdc78"
    },
    {
      "file": "packages/clinical-content/src/question-flags-20261104.ts",
      "sha256": "9131f7f1be7b2c2c20ffc1d7d72634ff69f1511620c66fe2dbfbf74d8fac556e"
    },
    {
      "file": "packages/clinical-content/src/question-flags-round2-20261104-data.ts",
      "sha256": "8b845ae0b85a328c5a5b384a7be17e885423b8372a0ddaa31a76c5b1e08deac9"
    },
    {
      "file": "packages/clinical-content/src/question-flags-round2-20261104.ts",
      "sha256": "8932e60db6762df66810ba0992766d2bc21ce9ffdc1bc0c0c8cc7c3e0322257d"
    },
    {
      "file": "packages/clinical-content/src/question-flags-round3-20261104-data.ts",
      "sha256": "b47081a164cdde7e0b2a9e7df35b32dfd658bb0772a75544ac2c1862cf6e9da2"
    },
    {
      "file": "packages/clinical-content/src/question-flags-round3-20261104.ts",
      "sha256": "d32476015827e917e831564feafb40ef6ae60e85ea8d6c9fb643cf61707411e5"
    },
    {
      "file": "packages/clinical-content/src/question-n4-accepted-20261110.ts",
      "sha256": "fb1f5367740d1da8d0c8608818912ef8ae5b20401277bd93be82bb96223af6b3"
    },
    {
      "file": "packages/clinical-content/src/question-new-n4-20261110.ts",
      "sha256": "754f7caa2700f5f4f970f34ade35172f39e5cc33741e823f4f51da74a6daacc9"
    },
    {
      "file": "packages/clinical-content/src/question-new-n4-round2-20261110.ts",
      "sha256": "e05be2a3198450eddbce2645647f22f61cf63bf86155af2e9d540403c60ba47e"
    },
    {
      "file": "packages/clinical-content/src/question-quality-adversarial-20261102-data.ts",
      "sha256": "04abd031b224ea0eff55626cc983443493549517057e3a93760bcb40d1c6ab17"
    },
    {
      "file": "packages/clinical-content/src/question-quality-adversarial-20261102.ts",
      "sha256": "7da11630a357e1ed7c36c4579aa99d46e6cd14d5a5f014a8dcb9ec63df2c7a2d"
    },
    {
      "file": "packages/clinical-content/src/question-quality-adversarial-r3-20261102-data.ts",
      "sha256": "c39f1bb565dba8eb5cbb32dbe0fc9dcad3c27beeb49c3af782fe2c90ccbf1b00"
    },
    {
      "file": "packages/clinical-content/src/question-quality-adversarial-r3-20261102.ts",
      "sha256": "6f2251f33b190470131c683cf6e565fd0b13f2b104574b2e753dacc4de3ec4be"
    },
    {
      "file": "packages/clinical-content/src/question-quality-adversarial-r4-20261102-data.ts",
      "sha256": "d80fb06aee3e2e540114c1a065e988e3e303ff2ac86c3718f2b10c1a2b942574"
    },
    {
      "file": "packages/clinical-content/src/question-quality-adversarial-r4-20261102.ts",
      "sha256": "6ae2cfd4932c20ee946d545da7370983c21c1484f28c882d02b03989bbbc2969"
    },
    {
      "file": "packages/clinical-content/src/question-quality-batch1-20261102-data.ts",
      "sha256": "5b49c457b95974d55858476c148ec23d5c37a88ba39d430fe67b48eb33547c85"
    },
    {
      "file": "packages/clinical-content/src/question-quality-batch1-20261102.ts",
      "sha256": "1aac74fec55e37bdd1463eb88e111590953bcd69e53467efc7c867d4f8d37928"
    },
    {
      "file": "packages/clinical-content/src/synthetic-content.ts",
      "sha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd"
    }
  ],
  "frozenAndAcceptedReferences": [
    {
      "id": "B2B08",
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2",
      "conceptId": "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
      "originalDecisionFile": "docs/research/question-bank-batch2b-review2-20261104.json",
      "originalDecisionFileSha256": "80f5622d0d646d912243569003af5f734c02d1468a19d0a74656ab5122ad741f",
      "originalReview": {
        "id": "B2B08",
        "title": "Use the pretreatment skin presentation when planning after response",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "cues": [],
        "fairness": [
          "The resident must recognize the pretreatment inflammatory presentation and apply its continuing implications despite apparent breast and nodal response. This is a meaningful boundary against de-escalation after neoadjuvant treatment.",
          "Mastectomy with axillary dissection is the defensible offered plan for the presented inflammatory, initially node-positive disease. The balanced matrix gives no component-frequency or length cue.",
          "Importance: high breast oncology and ABSITE-style reasoning. Realism: the before/after record is coherent; the initially extensive rapid skin findings are necessary even though the table repeats some of them. This surgical task does not purport to describe all multimodal treatment."
        ],
        "suggestions": [
          "Retain the pretreatment skin extent and nodal confirmation; do not turn disappearance of the skin changes into permission for a different disease category."
        ]
      },
      "originalRecordedHashes": [],
      "managerAcceptance": {
        "acceptanceId": "B2B08",
        "sourceView": "batch2b-round2",
        "decisionFile": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
      },
      "exactSourceVersion": "question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2",
      "topicNodeSha256": "c96f2e15bef780241e8d2620bcf10fbf30340380939a2044a100a0c166fed4fb",
      "topicProjectionSha256": "b90a4db724745f13090f8ddde229dbba87c6879433fb1ef7131dcbfa5f8b518e",
      "exactCaseSha256": "65ba527de610a837c54f86039e72bd8e472b609f61beb511d84512aad04209bb",
      "clinicalApproval": null,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "preservationRule": "Exact independent PASS: retain visible fields, profiles, source question and history; no inherited approval for new versions."
    },
    {
      "id": "B2B10",
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "originalDecisionFile": "docs/research/question-bank-batch2b-review2-20261104.json",
      "originalDecisionFileSha256": "80f5622d0d646d912243569003af5f734c02d1468a19d0a74656ab5122ad741f",
      "originalReview": {
        "id": "B2B10",
        "title": "Resolve response and localization discordance before breast resection",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "cues": [],
        "fairness": [
          "Frozen PASS retained. Interpretation establishes that the palpable remnant and enhancing focus are one location, whereas the original marked bed is another; the learner must cover both relevant sites.",
          "The key is defensible, and the balanced component frequencies prevent convergence. Rejecting a redundant pair requires interpreting the site record rather than reading option style.",
          "Importance: high practical breast localization. Realism: marker/response discordance is credible. Localization of both sites is not a claim that enhancement alone defines microscopic disease or clear margins."
        ],
        "suggestions": [
          "Preserve the frozen version and the explicit distinction between the original marker and current palpable/enhancing focus."
        ]
      },
      "originalRecordedHashes": [],
      "managerAcceptance": {
        "acceptanceId": "B2B10",
        "sourceView": "batch2b-round2",
        "decisionFile": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
      },
      "exactSourceVersion": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1",
      "topicNodeSha256": "693d938739046c298b56572eb129004630f50d54e866f60d3bd0dc203c99b99b",
      "topicProjectionSha256": "ec88149f2e9cbfe967d31801f1381646a3f2469d00879493b7e4a794a1bf3600",
      "exactCaseSha256": "d7549eb807f7e2321388c4c1e7541038702131bd0c0130b7294094fb74e76d6e",
      "clinicalApproval": null,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "preservationRule": "Exact independent PASS: retain visible fields, profiles, source question and history; no inherited approval for new versions."
    },
    {
      "id": "B2B24",
      "variantId": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2",
      "conceptId": "concept.breast-cancer-after-neoadjuvant-therapy.response-mapping",
      "originalDecisionFile": "docs/research/question-bank-batch2b-review2-20261104.json",
      "originalDecisionFileSha256": "80f5622d0d646d912243569003af5f734c02d1468a19d0a74656ab5122ad741f",
      "originalReview": {
        "id": "B2B24",
        "title": "Bracket the malignant residual field rather than the MRI edge",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "cues": [],
        "fairness": [
          "The learner must interpret the sampled epithelial/necrotic finding as residual in-situ malignancy and incorporate its mapped extent beyond MRI enhancement. M-to-C is the defensible bracket within the expressly established conservation field.",
          "Every option shares M and differs only at the other endpoint, so there is no majority-component cue. The pathological description at C supplies meaningful evidence; it is not a diagnosis label or an explanation that directly instructs the endpoint choice.",
          "Importance: high breast conservation planning after therapy. Realism: the stated one-quadrant scope and established conservation decision repair the earlier missing operative scope.",
          "The referenced image exists at apps/player/public/clinical-exhibits/batch2b-r2-b24-breast-map.png and was visually inspected. It is legible, explicitly constructed, and consistent with the text: M-E enhancement, M-C calcifications, P old palpable extent. This verifies the asset, not in-game rendering or microscopic margins."
        ],
        "suggestions": [
          "Preserve the explicit operative scope and spatial map. Keep the interpretation of the C specimen for the learner rather than adding a malignant-endpoint caption."
        ]
      },
      "originalRecordedHashes": [],
      "managerAcceptance": {
        "acceptanceId": "B2B24",
        "sourceView": "batch2b-round2",
        "decisionFile": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
      },
      "exactSourceVersion": "question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2",
      "topicNodeSha256": "79ad3f724a089566f89761fc3de5570779b7095a6cf7fe108786ec41e72e45ff",
      "topicProjectionSha256": "a7322c4eaa655b8d607ab5c139363d93ffc68d1ed48b5acd08360ef4c2cdd4e6",
      "exactCaseSha256": "228a2f3649c62eb789f815ae9d018399de89a8d22fb4a795606223182dcc936d",
      "clinicalApproval": null,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "preservationRule": "Exact independent PASS: retain visible fields, profiles, source question and history; no inherited approval for new versions."
    },
    {
      "id": "F01",
      "variantId": "question.dcis.margin-bcs-wbrt.v3.r3",
      "conceptId": "concept.dcis.final-cavity-shave-plan.v1",
      "originalDecisionFile": "docs/research/question-flags-adversarial-review2-20261104.json",
      "originalDecisionFileSha256": "ecca16ddd5bf4fec2f8525e9212ae30e7ed31661073d4f8f0c2e9ee4a4002cf1",
      "originalReview": {
        "id": "F01",
        "title": "DCIS: which inked surface is the final margin?",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "cues": [],
        "fairness": [
          "Original flag fully resolved: yes. Review versus re-excision no longer competes as sequential parts of one plan; all options now describe treatment.",
          "The keyed plan is defensible among the offered choices: the resident must distinguish the main specimen edge from the separately oriented final cavity boundary, then apply the pure-DCIS/irradiation margin rule. The main-specimen 1-mm distance is a credible temptation rather than the final margin.",
          "No exploitable zero-knowledge wording, grammar, length, absolute or convergence cue identified. Whole-breast irradiation appears in both the key and the closest competitor; the planned irradiation does not distinguish those choices. Completed reconciliation and the mammographic observations provide decision context rather than permission for a uniquely available action.",
          "Completion mastectomy is a weaker competitor than posterior re-excision, but the specimen interpretation still makes the closest alternative substantive. No decision-critical omission or confident clinical error identified within this focused margin question.",
          "Review scope for all 16 entries: judgments use only Presentation, Current update, Exhibit, Task and Options in after; titles and author reasoning are not learner evidence. Flags and handoffs establish history only. Difficulty is a qualitative PGY-2/3 prediction. No network/source re-verification, runtime/profile/feedback audit or clinical sign-off was performed. All drafts remain needs_clinician_review. Held F14 is excluded from this array and verdict/difficulty counts; its existing hold is unchanged."
        ],
        "suggestions": [
          "Retain the explicit specimen orientation and final external edge; do not simplify them back to a single margin summary.",
          "Retain this exact version for independent clinical sign-off. If strengthening the mastectomy competitor, preserve the clear distinction between the original and final posterior boundaries and obtain a new review of the changed version."
        ]
      },
      "originalRecordedHashes": [],
      "managerAcceptance": {
        "acceptanceId": "F01",
        "sourceView": "flags-round3",
        "decisionFile": "docs/research/question-flags-manager-decision-20261104.md"
      },
      "exactSourceVersion": "question.dcis.margin-bcs-wbrt.v3.r3",
      "topicNodeSha256": "e4d92ddc973101aed1241c9a3ffd3e0ceca4a8c7b99d03402541b15b727fc30f",
      "topicProjectionSha256": "839cc05138b0500215f485825ed21efe9f83f30d57cd18f1ace224a644a0365b",
      "exactCaseSha256": "835a9033c24fc56c02929c23300122d9ed873aadbc41a77f38eb0c60b8965132",
      "clinicalApproval": null,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "preservationRule": "Exact independent PASS: retain visible fields, profiles, source question and history; no inherited approval for new versions."
    },
    {
      "id": "F10",
      "variantId": "question.dcis.sentinel-node-setting.v3.r4",
      "conceptId": "concept.dcis.sentinel-node-mastectomy.v1",
      "originalDecisionFile": "docs/research/question-flags-adversarial-review3-20261104.json",
      "originalDecisionFileSha256": "41157331a9dcf0f8fee2eb4320dc00cda8922f1ceabad9b95d49bb6682b235bf",
      "originalReview": {
        "id": "F10",
        "title": "DCIS on both sides: choose the axillary staging plan",
        "verdict": "REVISE",
        "difficulty": "easy",
        "twoStep": false,
        "cues": [
          {
            "phrase": "On the left, separated areas occupy several breast regions",
            "why": "Combined with the much larger left operation and localized right operation, this gives a nonmedical severity/laterality heuristic for choosing left staging. It does not prove the medical rule, but supports the key without knowing why the operation changes staging."
          },
          {
            "phrase": "the planned specimen includes the gland from the clavicle to the inframammary fold, while the skin envelope is retained for reconstruction",
            "why": "This is a lengthy descriptive substitute for a familiar operation. Recognizing that operation supplies the conventional staging rule; paraphrasing its name does not create a second consequential inference. This is mainly a difficulty issue rather than a forbidden diagnosis cue."
          }
        ],
        "fairness": [
          "Original flag fully resolved: yes for the confusing threatened-lymphatic-mapping premise. The item now uses a conventional operation-dependent staging decision instead of asserting an unspecified mapping compromise.",
          "The left-only sentinel-node plan is the defensible best offered conventional answer for the described left mastectomy and right breast-conserving procedure in pure DCIS. No specific right-sided feature is supplied that makes an exception clearly applicable. No confident clinical inaccuracy identified.",
          "The normal bilateral nodal observations do not themselves exclude microscopic disease; retaining them is legitimate. The laterality set is balanced and does not create component-majority convergence.",
          "Likely easy for PGY-2/3: identify the two operations and apply a familiar staging rule. Calling the operation by its specimen description adds decoding, not a clinically consequential second step."
        ],
        "suggestions": [
          "Use conventional operation names unless the exact specimen distinction changes the decision. Avoid hiding simple terminology inside longer prose to simulate difficulty.",
          "Either obtain explicit acceptance for this foundational rule or use a source-supported, clinically meaningful staging dilemma with credible alternatives and enough data to resolve it.",
          "Do not reintroduce the unsupported assumption that any oncoplastic procedure compromises subsequent mapping. Keep a genuine exception conditional on verified operative details and clinician review."
        ]
      },
      "originalRecordedHashes": [],
      "managerAcceptance": {
        "acceptanceId": "F10",
        "sourceView": "flags-round3",
        "decisionFile": "docs/research/question-flags-manager-decision-20261104.md"
      },
      "exactSourceVersion": "question.dcis.sentinel-node-setting.v3.r4",
      "topicNodeSha256": "a29b0a9898662b294384437762921344b8a5789044087f4d8596cad567d32a81",
      "topicProjectionSha256": "b74abff62ad63aca6c610d4129fc7597be55a2cd931244852f7f35df0972a1a0",
      "exactCaseSha256": "5312de29223b30912ecf06fe0a4faf2764357db06d5bc8d128ae2c55844156da",
      "clinicalApproval": null,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "preservationRule": "F10 is manager-accepted REVISE, not PASS or an accepted basic exception. Preserve fallback and retain its resident-difficulty backlog."
    },
    {
      "id": "B37",
      "variantId": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5",
      "conceptId": "concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2",
      "originalDecisionFile": "docs/research/question-batch1-adversarial-review7-20261102.json",
      "originalDecisionFileSha256": "e7ec82cfb216ee71986918209e39754173044b1349f916e839f781ac8036b4c9",
      "originalReview": {
        "id": "B37",
        "title": "Resolve breast imaging/core-biopsy discordance",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "cues": [],
        "fairness": [
          "Preservation-only PASS: question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5. Exact UTF-8 JSON.stringify bytes of the after fields match the saved review-six packet in tools/question-quality/fixtures/adversarial-r7-before-20261102.json. After-field SHA-256: 24f188d953695da2c0fd068aedd6fa1fd606947bdc9c0904f0d80c08d70f6ef9.",
          "The assembled question object and full target-node/shared-case projection also match that snapshot byte-for-byte under the same serialization. Projection includes complaint, presentation, patient display name, canonical demographics, all instantiation profiles and full target node. Projection SHA-256: b9a37e1ec03990276e4da08a3978df1a5dea79a1d21d3d0b64d9a978bfc53669. Verdict, difficulty and twoStep are carried from review six, not a new clinical or difficulty assessment."
        ],
        "suggestions": []
      },
      "originalRecordedHashes": [
        "24f188d953695da2c0fd068aedd6fa1fd606947bdc9c0904f0d80c08d70f6ef9",
        "b9a37e1ec03990276e4da08a3978df1a5dea79a1d21d3d0b64d9a978bfc53669"
      ],
      "managerAcceptance": null,
      "exactSourceVersion": "question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5",
      "topicNodeSha256": "680f2c1f399aa07ba05a623d04b6a37f54880d22874bdf0981d18cac82fc2a27",
      "topicProjectionSha256": "ce73cb6a3b18dac42853449647a58da4e85a30763521c05b60e5f7f6ac1c8434",
      "exactCaseSha256": "ce84afb43a774b801b31c56900c664d2b7fa4bfabc40d036da233323dabedbe3",
      "clinicalApproval": null,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "preservationRule": "Exact independent PASS: retain visible fields, profiles, source question and history; no inherited approval for new versions."
    },
    {
      "id": "B37-context",
      "variantId": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3",
      "conceptId": "concept.inflammatory-breast-cancer.neoadjuvant-sequence",
      "originalDecisionFile": "docs/research/question-batch1-adversarial-review7-20261102.json",
      "originalDecisionFileSha256": "e7ec82cfb216ee71986918209e39754173044b1349f916e839f781ac8036b4c9",
      "originalReview": {
        "id": "B37-context",
        "title": "Neoadjuvant sequence for stage III inflammatory breast cancer",
        "verdict": "PASS",
        "difficulty": "moderate",
        "twoStep": true,
        "cues": [],
        "fairness": [
          "Preservation-only PASS: question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3. Exact UTF-8 JSON.stringify bytes of the after fields match the saved review-six packet in tools/question-quality/fixtures/adversarial-r7-before-20261102.json. After-field SHA-256: e8a05f43130948ea7d42916882265ea5db481593de3863cf9c64ced7237bbb73.",
          "The assembled question object and full target-node/shared-case projection also match that snapshot byte-for-byte under the same serialization. Projection includes complaint, presentation, patient display name, canonical demographics, all instantiation profiles and full target node. Projection SHA-256: 64d29cdd9d06d439e35c0a4f0ef779a7dfb758c444dcec451ce437aa2c6d0b49. Verdict, difficulty and twoStep are carried from review six, not a new clinical or difficulty assessment."
        ],
        "suggestions": []
      },
      "originalRecordedHashes": [
        "e8a05f43130948ea7d42916882265ea5db481593de3863cf9c64ced7237bbb73",
        "64d29cdd9d06d439e35c0a4f0ef779a7dfb758c444dcec451ce437aa2c6d0b49"
      ],
      "managerAcceptance": null,
      "exactSourceVersion": "question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3",
      "topicNodeSha256": "db508384f1e72ef2d08a030c9f5b49451395f8968a8ca668fbc65c301287a654",
      "topicProjectionSha256": "7850bd03e34cef3c0f874bdfdf5dae422d7a3e6beb0a196b273c6154450a155e",
      "exactCaseSha256": "ce84afb43a774b801b31c56900c664d2b7fa4bfabc40d036da233323dabedbe3",
      "clinicalApproval": null,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "preservationRule": "Exact independent PASS: retain visible fields, profiles, source question and history; no inherited approval for new versions."
    }
  ],
  "secondaryTopicAndOwnershipNotes": {
    "primaryBreastCrossTopicCases": [],
    "identityReuseNotes": [],
    "notes": [
      "All assigned cases have breast-cancer primary ownership and no mapped cross-topic sequences.",
      "New recurrent-tumor assay choice uses inherited-susceptibility testing only as a distractor; germline interpretation remains oncology-genetics-principles.",
      "Phyllodes/fibroepithelial decisions remain breast-benign-high-risk; no corresponding source hold is imported into this lane."
    ]
  }
}
```

</details>

## Current outcome, drift and next action

**20 reviewed: 7 pass-preserved, 6 revised, 7 parked.** The active explicit-import preview contains **13 nodes in 12 clinic cases**, with 13 concept identities. Eleven meanings reuse round-one identities; the broader recurrent-assay and upfront radiation-selection objectives have two explicit new concept versions. All questions, claims, profiles and concepts remain `needs_clinician_review`. Six revised v2 items have author checks, not independent PASS.

The only multi-part active case is the unchanged two-PASS DCIS sequence. The inflammatory sequence, MRI-discordance and residual-HER2 PASS targets are split from mixed cases into standalone case envelopes. Their complete target-node and question hashes, presentation, complaint, name and demographics match the reviewed versions. Optional style suggestions on PASS items were deliberately not applied because the manager required exact preservation. New split envelopes still require manager composition acceptance.

The whole reviewed v1 authoring module remains under `BREAST_CANCER_TOPIC_ROUND1_*` exports for history. The default preview and primary current exports contain no parked question and no mixed multi-part case. No revised wording is labelled independently passed.

Current live-tree observation:

```json
{
  "capturedAt": "2026-11-11T21:59:41.535Z",
  "manifestId": "question-ship.2026-11-11.v11",
  "manifestRows": 193,
  "cases": 1174,
  "nodes": 1491,
  "concepts": 654
}
```

The historical manifest v9/v11 capture remains in JSON. Global work has advanced concurrently; no source definition or original exact clinical approval has been overwritten. Next: Final focused test/typecheck, then manager independently rereviews six v2 items and accepts the three split PASS case envelopes. Clinical approval remains Melissa Rowland's separate exact-version decision.

## Independent review and item status

Review: [question-topic-breast-cancer-review-20261111.json](question-topic-breast-cancer-review-20261111.json), SHA-256 `58b907f299dd33fd3676ebdc5e055e6ed2b0e23216f0b2d252aeeee20660a5a9`. Review wording and all clarity issues, cues, fairness notes and suggestions are retained exactly in the structured packet. The table covers every one of its 20 rows.

| Reviewed variant | Verdict | Status / active variant | Response |
|---|---|---|---|
| question.topic.breast-cancer.current-recurrence-receptor-specimen.v1 | REVISE | **revised** / question.topic.breast-cancer.current-recurrence-receptor-specimen.v2 | Removed the named missing assay, adequacy conclusion and unrelated germline option. Compared a current negative bone report, current nondecalcified metastatic tissue and historical primary tissue. The processing/validation record is the deciding evidence; current results can still govern if technically reliable. Removed software/scope language from feedback. ASCO specimen-processing guidance was directly verified and recorded with reserved rights. |
| question.topic.breast-cancer.mastectomy-rni-omit-alnd.v1 | REVISE | **revised** / question.topic.breast-cancer.mastectomy-rni-omit-alnd.v2 | Retained upfront phase, limited node burden and actual nodal field. Replaced repeat staging with three locoregional treatment policies: the planned field, addition of dissection, or chest-wall-only de-escalation. A patient morbidity/control goal distinguishes gratuitous combined therapy from the supported radiation pathway. Current ASBrS population and NCI morbidity evidence were rechecked; no new clinical approval claimed. |
| question.topic.breast-cancer.mastectomy-no-rni-alnd.v1 | REVISE | **parked** / none; unkeyed park | One revision attempt: Removed the redundant no-NST sentence and tried a regional-plan set: completion ALND, regional reirradiation, or no further regional treatment. Disposition: The specialist's actual reirradiation exclusion makes that third plan inapplicable; repeating mapping or limited arbitrary sampling remains filler. A fair difficult three-choice comparison was not established without changing the clinical premise or inventing another acceptable procedure. Next: Retain the legitimate binary teaching boundary as an unkeyed authoring gap; obtain a source-supported third policy or a specifically accepted foundational format before authoring again. |
| question.topic.breast-cancer.initial-cno-response-slnb.v1 | REVISE | **parked** / none; unkeyed park | One revision attempt: Removed the unused breast marker and tried a failed-mapping/result-adequacy follow-up instead of the simple normal-examination staging choice. Disposition: The supplied facts still do not establish a concrete acquisition failure. Adding one would require a verified next-action criterion distinguishing remapping, completion dissection and acceptance; the current source supports optimized technique but not the invented failure workflow. The original remains easy recall without an accepted basic exception. Next: Keep the cN0 staging gap visible; do not emit a keyed invented failure-management item. |
| question.topic.breast-cancer.initial-fixed-nodes-alnd.v1 | PASS | **pass-preserved** / question.topic.breast-cancer.initial-fixed-nodes-alnd.v1 | Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval. |
| question.topic.breast-cancer.skin-versus-parenchymal-tissue.v1 | REVISE | **parked** / none; unkeyed park | One revision attempt: Replaced the named unsampled target with a proposed needle-path/specimen record and replaced aspiration with repeat core, open incisional sampling and additional skin punches. Disposition: That attempt duplicates the already preserved breast-core-discordance objective, while the supplied evidence does not establish a uniquely ranked repeat-core versus incisional plan in a genuinely difficult new case. Simply hiding the compartment or removing the fluid negative would reduce fairness rather than add inference. Next: Preserve the exact inflammatory treatment-sequence PASS separately. Revisit diagnostic expansion only with supported acquisition data and three credible tissue plans. |
| question.topic.breast-cancer.inflammatory-initial-sequence.v1 | PASS | **pass-preserved** / question.topic.breast-cancer.inflammatory-initial-sequence.v1 | Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval. |
| question.topic.breast-cancer.marker-target-reconciliation.v1 | PASS | **pass-preserved** / question.topic.breast-cancer.marker-target-reconciliation.v1 | Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval. |
| question.topic.breast-cancer.nipple-representative-skin.v1 | REVISE | **parked** / none; unkeyed park | One revision attempt: Tried comparing superficial, punch and wedge specimens with different represented tissues instead of announcing missing epidermis. Disposition: No supported observation fairly ranks adequate punch against wedge, and an obviously epidermis-free sample recreates the same one-step compartment match. A harder adequate-sample/extent decision was not established without new clinical criteria. Next: Keep the Paget biopsy gap unkeyed rather than claim a new basic acceptance or fabricate a preferred biopsy technique. |
| question.topic.breast-cancer.verify-mri-focus.v1 | REVISE | **parked** / none; unkeyed park | One revision attempt: Replaced the feasibility/missing-biopsy sentences with the proposed resection geometry and tried same-stage second-look imaging, additional-target biopsy and primary-target reassessment. Disposition: The primary has no actual adequacy problem; repeating it is still filler. Distinguishing second-look imaging from image-guided biopsy needs an actual supported acquisition/visibility record. The attempted rewrite did not establish that prerequisite fairly. Next: Split the exact benign-sample-discordance PASS into a self-contained case. Commission a distinct supported imaging-acquisition dilemma rather than reuse its target-provenance answer. |
| question.topic.breast-cancer.benign-sample-discordance.v1 | PASS | **pass-preserved** / question.topic.breast-cancer.benign-sample-discordance.v1 | Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval. |
| question.topic.breast-cancer.map-nonenhancing-field.v1 | REVISE | **parked** / none; unkeyed park | One revision attempt: Added a proposed pretreatment calcification map and compared residual-field sampling, current-enhancement sampling and direct image-localized excision. Disposition: If the field was already known malignant, the added biopsy need is not established; if not characterized, the exact post-NST sampling-to-resection implication still requires clinician confirmation. Negative selected cores must not be invented as permission to leave a suspicious field. Next: Park this workflow. The separate revised operation case starts with already acquired mapped malignant tissue and does not imply an unverified diagnostic algorithm. |
| question.topic.breast-cancer.diffuse-malignant-residual.v1 | REVISE | **revised** / question.topic.breast-cancer.diffuse-malignant-residual.v2 | Removed undocumented multiple original foci. The standalone record consistently has one original invasive target and a later continuous malignant calcification field from the center through all quadrants. Both conservation options now attempt to address that current field. The geometry, rather than an invented breast-volume cutoff or old-target-only foil, determines the operation. |
| question.topic.breast-cancer.dcis-positive-shave.v1 | PASS | **pass-preserved** / question.topic.breast-cancer.dcis-positive-shave.v1 | Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval. |
| question.topic.breast-cancer.invasive-with-dcis-margin.v1 | PASS | **pass-preserved** / question.topic.breast-cancer.invasive-with-dcis-margin.v1 | Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval. |
| question.topic.breast-cancer.her2-neoadjuvant-sequence.v1 | REVISE | **revised** / question.topic.breast-cancer.her2-neoadjuvant-sequence.v2 | All options now contain chemotherapy, trastuzumab/pertuzumab and surgery. The alternatives differ in grouping/timing, eliminating the key-only HER2 match and inapplicable endocrine foil. NCI explicitly supports combined systemic treatment before surgery and describes chemotherapy-free dual-blockade trial exploration; exact doses/cycles are not authored. Split the later PASS adjuvant node rather than change its text. |
| question.topic.breast-cancer.converted-node-targeted-staging.v1 | REVISE | **parked** / none; unkeyed park | One revision attempt: Removed the critique-style without label and tried a mapping-adequacy version with negative sentinel specimens but an unretrieved original clip. Disposition: The current ASBrS guide allows adequate staging in selected patients with three or more negative sentinel nodes even without clip retrieval. A missing clip is therefore not a universal dissection/retrieval trigger. Changing the count or inventing an immediate rescue sequence would not establish a uniquely ranked action from the supplied facts. Next: Preserve the exact later residual-HER2 PASS independently. Ask for an explicitly supported technical retrieval/failure scenario before another keyed staging-adequacy draft. |
| question.topic.breast-cancer.residual-her2-adjuvant.v1 | PASS | **pass-preserved** / question.topic.breast-cancer.residual-her2-adjuvant.v1 | Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval. |
| question.topic.breast-cancer.upfront-one-positive-no-alnd.v1 | REVISE | **revised** / question.topic.breast-cancer.upfront-one-positive-no-alnd.v2 | Corrected the palpable-node wording. Replaced repeated mapping with an actual partial-breast versus whole-breast completion policy alongside dissection. Nodal positivity now matters to both de-escalation boundaries. The third policy has direct APBI eligibility support; exact radiation fields are not invented. A new concept version records the materially broader radiation-eligibility objective. |
| question.topic.breast-cancer.post-nst-micrometastasis-alnd.v1 | REVISE | **revised** / question.topic.breast-cancer.post-nst-micrometastasis-alnd.v2 | Corrected palpability to axillary nodes, kept the measured deposit and adequate retrieval, and replaced repeat staging with no additional axillary treatment. Shared whole-breast care stays in context. Completion dissection, nodal radiation, and no additional regional therapy are real policies with different applicable populations. The positive residual-micrometastasis indication was rechecked in the February 2026 ASBrS guide; Melissa review remains pending. |

## Case composition and exact PASS preservation

- `case.topic.breast-cancer.initial-bulky-nodes-response.v1`: question.topic.breast-cancer.initial-fixed-nodes-alnd.v1 [pass-preserved]. Self-contained standalone. PASS payloads split from mixed cases preserve exact reviewed presentation and target node.
- `case.topic.breast-cancer.diffuse-skin-clinic-review-pass-split.v2`: question.topic.breast-cancer.inflammatory-initial-sequence.v1 [pass-preserved]. Split exact PASS payload from a mixed case; currentUpdate already supplies the prerequisite clinical events.
- `case.topic.breast-cancer.localization-specimen-chart.v1`: question.topic.breast-cancer.marker-target-reconciliation.v1 [pass-preserved]. Self-contained standalone. PASS payloads split from mixed cases preserve exact reviewed presentation and target node.
- `case.topic.breast-cancer.additional-mri-focus-pass-split.v2`: question.topic.breast-cancer.benign-sample-discordance.v1 [pass-preserved]. Split exact PASS payload from a mixed case; currentUpdate already supplies the prerequisite clinical events.
- `case.topic.breast-cancer.dcis-final-boundary.v1`: question.topic.breast-cancer.dcis-positive-shave.v1 [pass-preserved]; question.topic.breast-cancer.invasive-with-dcis-margin.v1 [pass-preserved]. Paired-only two-PASS DCIS case retained exactly. Existing all-concepts unseen-or-due eligibility remains unchanged.
- `case.topic.breast-cancer.her2-treatment-course-pass-split.v2`: question.topic.breast-cancer.residual-her2-adjuvant.v1 [pass-preserved]. Split exact PASS payload from a mixed case; currentUpdate already supplies the prerequisite clinical events.
- `case.topic.breast-cancer.recurrent-tumor-biology-r2.v2`: question.topic.breast-cancer.current-recurrence-receptor-specimen.v2 [revised]. Self-contained standalone. PASS payloads split from mixed cases preserve exact reviewed presentation and target node.
- `case.topic.breast-cancer.mastectomy-with-rni-r2.v2`: question.topic.breast-cancer.mastectomy-rni-omit-alnd.v2 [revised]. Self-contained standalone. PASS payloads split from mixed cases preserve exact reviewed presentation and target node.
- `case.topic.breast-cancer.residual-breast-distribution-r2.v2`: question.topic.breast-cancer.diffuse-malignant-residual.v2 [revised]. Self-contained standalone. PASS payloads split from mixed cases preserve exact reviewed presentation and target node.
- `case.topic.breast-cancer.her2-treatment-course-r2.v2`: question.topic.breast-cancer.her2-neoadjuvant-sequence.v2 [revised]. Self-contained standalone. PASS payloads split from mixed cases preserve exact reviewed presentation and target node.
- `case.topic.breast-cancer.upfront-positive-sentinel-r2.v2`: question.topic.breast-cancer.upfront-one-positive-no-alnd.v2 [revised]. Self-contained standalone. PASS payloads split from mixed cases preserve exact reviewed presentation and target node.
- `case.topic.breast-cancer.post-nst-positive-sentinel-r2.v2`: question.topic.breast-cancer.post-nst-micrometastasis-alnd.v2 [revised]. Self-contained standalone. PASS payloads split from mixed cases preserve exact reviewed presentation and target node.

The two-node DCIS case retains its entire original case hash. For the three splits, changing the case envelope is explicitly authorized; it does not authorize changing the passed patient or target-node fields. Test evidence checks all seven passed question/node hashes and patient fields, plus all twenty archived round-one case/question hashes.

```json
[
  {
    "questionVariantId": "question.topic.breast-cancer.initial-fixed-nodes-alnd.v1",
    "questionSha256": "882fb7152170349f889fc76ebde7eb9c3bb04e6345f3f3346099d46dd6f8efef",
    "nodeSha256": "2081e0052d077b756988ccfe903f51f5ebde7d737bc540f86c32aa4816786ca3",
    "headerFieldsUnchanged": true,
    "reviewedCaseId": "case.topic.breast-cancer.initial-bulky-nodes-response.v1",
    "activeCaseId": "case.topic.breast-cancer.initial-bulky-nodes-response.v1",
    "caseEnvelopeChanged": false,
    "originalReviewFile": "docs/research/question-topic-breast-cancer-review-20261111.json",
    "clinicalApproval": false
  },
  {
    "questionVariantId": "question.topic.breast-cancer.inflammatory-initial-sequence.v1",
    "questionSha256": "1b77a1db8e8e5d514d981e1fdde05309071213e817678c1cd42976aede53ec0c",
    "nodeSha256": "e0319fadedcc4d7282c4e9dfffc769df93aef924f472bee97da17b4b0ef6f38b",
    "headerFieldsUnchanged": true,
    "reviewedCaseId": "case.topic.breast-cancer.diffuse-skin-clinic-review.v1",
    "activeCaseId": "case.topic.breast-cancer.diffuse-skin-clinic-review-pass-split.v2",
    "caseEnvelopeChanged": true,
    "originalReviewFile": "docs/research/question-topic-breast-cancer-review-20261111.json",
    "clinicalApproval": false
  },
  {
    "questionVariantId": "question.topic.breast-cancer.marker-target-reconciliation.v1",
    "questionSha256": "6dd884128e7b66a6bcc8ab021c7d458cf804f3e0dafe90fa6cc739d5068a050d",
    "nodeSha256": "8cef9a77f95dd064596d11b29cd0ed7fe9daaba418545c98ccbad67b34fa3a08",
    "headerFieldsUnchanged": true,
    "reviewedCaseId": "case.topic.breast-cancer.localization-specimen-chart.v1",
    "activeCaseId": "case.topic.breast-cancer.localization-specimen-chart.v1",
    "caseEnvelopeChanged": false,
    "originalReviewFile": "docs/research/question-topic-breast-cancer-review-20261111.json",
    "clinicalApproval": false
  },
  {
    "questionVariantId": "question.topic.breast-cancer.benign-sample-discordance.v1",
    "questionSha256": "a6c0f56b8a145ccfd953187221643432ac2c7447b51fe5262aecc49c89e47f95",
    "nodeSha256": "cf64dbe25521e8f3b75cc87a77ce4347d4163f170b381b0b04d279ac92402087",
    "headerFieldsUnchanged": true,
    "reviewedCaseId": "case.topic.breast-cancer.additional-mri-focus.v1",
    "activeCaseId": "case.topic.breast-cancer.additional-mri-focus-pass-split.v2",
    "caseEnvelopeChanged": true,
    "originalReviewFile": "docs/research/question-topic-breast-cancer-review-20261111.json",
    "clinicalApproval": false
  },
  {
    "questionVariantId": "question.topic.breast-cancer.dcis-positive-shave.v1",
    "questionSha256": "392a092a09b5bffc65eb48e2fbbab4a888d89f24d24273b7dae995653ac28cbe",
    "nodeSha256": "280766179f0f91d15270051cf38eb37b798e7e9c1fcc5ff139e0c83dc180c264",
    "headerFieldsUnchanged": true,
    "reviewedCaseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "activeCaseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "caseEnvelopeChanged": false,
    "originalReviewFile": "docs/research/question-topic-breast-cancer-review-20261111.json",
    "clinicalApproval": false
  },
  {
    "questionVariantId": "question.topic.breast-cancer.invasive-with-dcis-margin.v1",
    "questionSha256": "f78c6e4bfc5a498119f193ca0713cb3733a5fbf2806b7c58fab1f13e43bf5361",
    "nodeSha256": "2b8d9f8049182a3488e9e5f6352281a6142abcdfe9ff5e3cac94d7e84512ab4e",
    "headerFieldsUnchanged": true,
    "reviewedCaseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "activeCaseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "caseEnvelopeChanged": false,
    "originalReviewFile": "docs/research/question-topic-breast-cancer-review-20261111.json",
    "clinicalApproval": false
  },
  {
    "questionVariantId": "question.topic.breast-cancer.residual-her2-adjuvant.v1",
    "questionSha256": "95996cee88ce8ac022bf5e19c61a8980f99a6dea515c8a36ed0a62b3281b170e",
    "nodeSha256": "213e664e57c9e6f1f3c03342ade50323c27fe5085e872e9a63d336b09e63e159",
    "headerFieldsUnchanged": true,
    "reviewedCaseId": "case.topic.breast-cancer.her2-treatment-course.v1",
    "activeCaseId": "case.topic.breast-cancer.her2-treatment-course-pass-split.v2",
    "caseEnvelopeChanged": true,
    "originalReviewFile": "docs/research/question-topic-breast-cancer-review-20261111.json",
    "clinicalApproval": false
  }
]
```

## Current exact before/after review packet

All options below are **key shown first for review only.** Runtime options shuffle. There are no new standalone additions outside the reviewed 20-item response.

### question.topic.breast-cancer.current-recurrence-receptor-specimen.v2 - revised

Concept: `concept.topic.breast-cancer.current-recurrence-biomarker-evidence.v2`. Previous concept: concept.topic.breast-cancer.current-recurrence-biomarker-evidence.v1. Question/node SHA-256: `37d81b56e7b0d69c653fad8c3f1840a633127a1593a23403a237c4ec6c39a107` / `41f2c79d7253c96f785728545bee66c63160430511712631199dc502beba492c`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.recurrent-tumor-biology.v1`; variant: `question.topic.breast-cancer.current-recurrence-receptor-specimen.v1`; node: `node.topic.breast-cancer.current-recurrence-receptor-specimen.v1`.
- Patient: Marian Cole, 64-year-old Female. Complaint: **Recurrence treatment review**.
- Presentation: {patientName}, a 64-year-old woman, attends clinic with new liver lesions after treatment of an ER-positive, HER2-negative breast cancer. The outside liver core contains metastatic breast carcinoma with sufficient viable tumor for additional assays. Its receptor studies have not been performed. The archived primary's receptor results are in the chart, and her systemic treatment is being reconsidered.
- Current update: (none)
- Exhibit: (none)
- Task: **Which laboratory assessment should guide {patientName}'s current tumor-receptor reassessment?**

**key shown first for review only.**

1. **ER, PR and HER2 testing on the liver core** (key) - The adequate current tumor can establish the recurrence's predictive phenotype; the archived primary does not prove that phenotype is unchanged.
2. **ER, PR and HER2 testing on the archived breast specimen** - It reassesses the historical primary rather than establishing the present metastatic tumor's phenotype.
3. **Hereditary breast-cancer panel testing on blood** - A germline panel addresses inherited susceptibility, not expression of predictive receptors in the current carcinoma.

Explanation: The current core is adequate tumor tissue from the recurrence. Use it to reassess predictive receptor status rather than assume the original phenotype persists. Hereditary testing answers a separate question; no germline interpretation or metastatic drug regimen is scored here.

#### Current

- Case: `case.topic.breast-cancer.recurrent-tumor-biology-r2.v2`; variant: `question.topic.breast-cancer.current-recurrence-receptor-specimen.v2`; node: `node.topic.breast-cancer.current-recurrence-receptor-specimen.v2`.
- Patient: Marian Cole, 64-year-old Female. Complaint: **Recurrence treatment review**.
- Presentation: {patientName}, a 64-year-old woman, attends clinic after recurrence of previously ER-positive breast cancer. A bone core now contains metastatic breast carcinoma and is reported ER-negative, PR-negative and HER2-negative. Its processing record shows acid decalcification; the assay-validation record does not cover that process. A separate liver-core block contains viable metastatic breast carcinoma and was fixed without decalcification. The original breast block also contains viable carcinoma.
- Current update: (none)
- Exhibit: (none)
- Task: **Which laboratory plan should guide {patientName}'s current treatment reassessment?**

**key shown first for review only.**

1. **Assay ER, PR and HER2 on the liver-core block** (key) - The nondecalcified current metastasis can reassess biology without inheriting the bone sample's unvalidated preanalytic process.
2. **Use the reported bone-core receptor profile** - A current specimen is normally valuable, but the negative profile cannot be treated as settled conversion when the actual decalcification process is outside assay validation and suitable alternative tissue exists.
3. **Reassay ER, PR and HER2 on the breast block** - It can confirm historical biology but cannot resolve whether the recurrence has genuinely changed phenotype.

Explanation: Receptor discordance can reflect a genuine biological change or a testing problem. The negative bone profile was obtained after a process outside the assay's validation. Test the available nondecalcified metastatic tissue to establish a more reliable current profile; repeating the primary answers a different chronological question.

Review response: Removed the named missing assay, adequacy conclusion and unrelated germline option. Compared a current negative bone report, current nondecalcified metastatic tissue and historical primary tissue. The processing/validation record is the deciding evidence; current results can still govern if technically reliable. Removed software/scope language from feedback. ASCO specimen-processing guidance was directly verified and recorded with reserved rights.

- Reasoning step 1: Interpret acid processing outside assay validation as a limitation on the negative metastatic profile, rather than proof of receptor conversion.
- Reasoning step 2: Choose the viable nondecalcified current metastasis instead of either accepting that profile or retreating to historical tumor biology.
- Closest error: Accept the latest bone receptor report because current tissue should normally outrank the primary.
- Deciding observation: The negative bone profile followed an unvalidated decalcification process, while a nondecalcified current metastatic block is available.
- Consequence: A technically uncertain negative profile can be mistaken for a biological treatment target change.
- Decision-changing counterfactual: If the bone sample had validated processing and reliable assays, a discordant current metastatic profile could legitimately guide treatment.
- Deletion/context check: Deleting the processing record removes the reason to question the current bone profile; deleting the liver provenance makes the selected current evidence unavailable. No missing assay is announced.

Five concrete author checks:

1. Cover-the-key attack: All three plans concern the same tumor receptor evidence. Removed the germline foil and the named unperformed assay. Current bone, current liver and historical primary each offer a real but different evidentiary temptation.
2. One stage/category: Laboratory evidence plan before changing systemic treatment.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted hard: current-versus-historical evidence must be reconciled with preanalytic reliability, not just tissue availability.
5. Defensible key boundary: The negative bone profile followed an unvalidated decalcification process, while a nondecalcified current metastatic block is available. Counterfactual: If the bone sample had validated processing and reliable assays, a discordant current metastatic profile could legitimately guide treatment.

Sequence and identity: Standalone revision; no earlier feedback supplies the processing interpretation or choice. One revision addresses every review cue. New concept version explicitly records the material addition of assay-validity interpretation; prior FSRS history is retained.

- `choice.topic.breast-cancer.current-recurrence-receptor-specimen.bone.v2`: temptation Prioritizes specimen recency without interpreting processing-related uncertainty. Ranking: A current specimen is normally valuable, but the negative profile cannot be treated as settled conversion when the actual decalcification process is outside assay validation and suitable alternative tissue exists. When reasonable: A technically reliable current metastatic assay can guide therapy even if it differs from the old primary. Claims: claim.breast-cancer.r2.decalcified-receptor-caution.
- `choice.topic.breast-cancer.current-recurrence-receptor-specimen.primary.v2`: temptation Escapes a technically questionable current result by returning to the familiar primary. Ranking: It can confirm historical biology but cannot resolve whether the recurrence has genuinely changed phenotype. When reasonable: A question about the original assay itself would appropriately use the original block. Claims: claim.breast-cancer.recurrent-biomarkers, claim.breast-cancer.r2.decalcified-receptor-caution.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.recurrent-tumor-biology-r2.v2",
    "questionVariantId": "question.topic.breast-cancer.current-recurrence-receptor-specimen.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.recurrent-biomarkers",
          "claim.breast-cancer.r2.decalcified-receptor-caution"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.current-recurrence-receptor-specimen.liver.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.current-recurrence-receptor-specimen.liver.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.recurrent-biomarkers",
          "claim.breast-cancer.r2.decalcified-receptor-caution"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.current-recurrence-receptor-specimen.bone.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.current-recurrence-receptor-specimen.bone.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.r2.decalcified-receptor-caution"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.current-recurrence-receptor-specimen.primary.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.current-recurrence-receptor-specimen.primary.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.recurrent-biomarkers",
          "claim.breast-cancer.r2.decalcified-receptor-caution"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.recurrent-tumor-biology-r2.v2",
    "nodeId": "node.topic.breast-cancer.current-recurrence-receptor-specimen.v2",
    "questionVariantId": "question.topic.breast-cancer.current-recurrence-receptor-specimen.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.breast-cancer.current-recurrence-receptor-specimen.liver.v2",
          "choiceLabel": "Assay ER, PR and HER2 on the liver-core block",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        },
        {
          "choiceId": "choice.topic.breast-cancer.current-recurrence-receptor-specimen.bone.v2",
          "choiceLabel": "Use the reported bone-core receptor profile",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.breast-cancer.current-recurrence-receptor-specimen.primary.v2",
          "choiceLabel": "Reassay ER, PR and HER2 on the breast block",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.pathology_review"
          }
        }
      ]
    }
  }
}
```

### question.topic.breast-cancer.mastectomy-rni-omit-alnd.v2 - revised

Concept: `concept.topic.breast-cancer.mastectomy-radiation-axillary-boundary.v1`. Previous concept: unchanged meaning. Question/node SHA-256: `06589ffdff88c0bcba79bbb9941f34324c9273951cdd019bfba1e77bc9ca0f72` / `3ac7645e507bf5916d743d55b2291add8f17d86a5abef90c766eeb838e026e3c`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.mastectomy-with-rni.v1`; variant: `question.topic.breast-cancer.mastectomy-rni-omit-alnd.v1`; node: `node.topic.breast-cancer.mastectomy-rni-omit-alnd.v1`.
- Patient: Vivian Hart, 62-year-old Female. Complaint: **Completion axillary review**.
- Presentation: {patientName}, a 62-year-old woman, attends clinic after upfront mastectomy and sentinel biopsy for a 2.8-cm noninflammatory invasive cancer. Her axilla was clinically negative before surgery. Two of four sentinel nodes contain metastases; there is no gross extranodal disease. The radiation oncologist has planned postmastectomy chest-wall and regional nodal irradiation, and systemic therapy is planned.
- Current update: (none)
- Exhibit: (none)
- Task: **Which further axillary operation should be recommended for {patientName}?**

**key shown first for review only.**

1. **No completion axillary operation** (key) - Selected upfront mastectomy patients with one or two positive sentinel nodes can omit ALND when the adjuvant plan includes regional nodal irradiation.
2. **Completion level I–II axillary dissection** - It treats mastectomy plus any positive sentinel finding as an unconditional ALND requirement, despite the stated limited burden and nodal irradiation.
3. **Repeat sentinel mapping and axillary sampling** - The completed representative sentinel procedure already establishes the relevant limited burden; repeat staging is not a substitute for interpreting that information.

Explanation: Mastectomy does not impose an unconditional completion-ALND rule. In selected upfront cases with limited positive sentinel burden, planned regional nodal irradiation can support omission. This is a radiation-dependent decision and should not be applied to post-NST residual nodes.

#### Current

- Case: `case.topic.breast-cancer.mastectomy-with-rni-r2.v2`; variant: `question.topic.breast-cancer.mastectomy-rni-omit-alnd.v2`; node: `node.topic.breast-cancer.mastectomy-rni-omit-alnd.v2`.
- Patient: Vivian Hart, 62-year-old Female. Complaint: **Completion axillary review**.
- Presentation: {patientName}, a 62-year-old woman, attends clinic after upfront mastectomy and sentinel biopsy for a 2.8-cm noninflammatory invasive cancer. No axillary nodes were palpable before surgery. Two of four sentinel nodes contain metastases, with no gross extranodal disease. Postmastectomy chest-wall and regional nodal irradiation is planned. She wants to minimize arm morbidity while preserving appropriate regional control; systemic therapy is planned.
- Current update: (none)
- Exhibit: (none)
- Task: **Which locoregional treatment plan should be recommended for {patientName}?**

**key shown first for review only.**

1. **Chest-wall and regional nodal irradiation** (key) - The eligible upfront limited-node setting supports the planned radiation pathway without adding completion dissection and its arm morbidity.
2. **Axillary dissection followed by chest-wall and regional nodal irradiation** - Adding dissection to the already applicable regional radiation plan is not required by these two positive sentinel nodes and works against the stated morbidity goal.
3. **Chest-wall irradiation** - It drops the nodal-treatment component on which this mastectomy omission pathway depends.

Explanation: The regional nodal component matters. In this selected upfront mastectomy setting, the planned nodal irradiation supports omission of completion dissection. Adding dissection increases treatment burden, while reducing the field to the chest wall discards the component supporting the omission strategy.

Review response: Retained upfront phase, limited node burden and actual nodal field. Replaced repeat staging with three locoregional treatment policies: the planned field, addition of dissection, or chest-wall-only de-escalation. A patient morbidity/control goal distinguishes gratuitous combined therapy from the supported radiation pathway. Current ASBrS population and NCI morbidity evidence were rechecked; no new clinical approval claimed.

- Reasoning step 1: Identify the upfront clinically node-negative, limited positive-sentinel population.
- Reasoning step 2: Apply the actual nodal radiation component and morbidity goal to distinguish the supported omission pathway from extra surgery or inadequate field de-escalation.
- Closest error: Treat the chest-wall field as equivalent to chest-wall plus regional nodal irradiation after mastectomy.
- Deciding observation: Only two sentinel nodes are involved and a regional nodal field is actually planned.
- Consequence: A field mistake can remove the basis for omission, while automatically combining treatments adds avoidable morbidity.
- Decision-changing counterfactual: If regional nodal irradiation were ruled out, the offered radiation-only omission plan would no longer apply.
- Deletion/context check: The nodal burden and precise field are both necessary. The morbidity goal distinguishes an appropriate omission pathway from adding a redundant operation.

Five concrete author checks:

1. Cover-the-key attack: All choices are concrete locoregional treatment plans. Repeat mapping is gone; radiation appears in every option, so the task's locoregional wording does not uniquely match the key.
2. One stage/category: Postmastectomy locoregional treatment rather than repeated staging.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted fair moderate: the nearest field and surgery errors are credible; no harder rating is manufactured from an ordinary limited-node rule.
5. Defensible key boundary: Only two sentinel nodes are involved and a regional nodal field is actually planned. Counterfactual: If regional nodal irradiation were ruled out, the offered radiation-only omission plan would no longer apply.

Sequence and identity: Standalone revised case; no unchanged PASS presentation is modified. One revision broadens options to genuine regional-treatment strategies and keeps the reviewed population/field criteria explicit. Meaning remains the radiation-dependent axillary boundary.

- `choice.topic.breast-cancer.mastectomy-rni-omit-alnd.combined.v2`: temptation Applies a positive-node surgery rule despite a radiation-supported omission population. Ranking: Adding dissection to the already applicable regional radiation plan is not required by these two positive sentinel nodes and works against the stated morbidity goal. When reasonable: Residual disease after NST or a different higher-burden presentation can require a surgical regional approach. Claims: claim.breast-cancer.mastectomy-rni, claim.breast-cancer.r2.regional-treatment-morbidity, claim.breast-cancer.nst-residual-nodes.
- `choice.topic.breast-cancer.mastectomy-rni-omit-alnd.wall.v2`: temptation Transfers limited-node breast-conservation de-escalation to mastectomy while overlooking its different radiation context. Ranking: It drops the nodal-treatment component on which this mastectomy omission pathway depends. When reasonable: A node-negative mastectomy patient with an independent chest-wall indication would present a different field question. Claims: claim.breast-cancer.mastectomy-rni.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.mastectomy-with-rni-r2.v2",
    "questionVariantId": "question.topic.breast-cancer.mastectomy-rni-omit-alnd.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.mastectomy-rni",
          "claim.breast-cancer.r2.regional-treatment-morbidity",
          "claim.breast-cancer.nst-residual-nodes"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.mastectomy-rni-omit-alnd.rni.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.mastectomy-rni-omit-alnd.rni.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.mastectomy-rni",
          "claim.breast-cancer.r2.regional-treatment-morbidity"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.mastectomy-rni-omit-alnd.combined.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.mastectomy-rni-omit-alnd.combined.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.mastectomy-rni",
          "claim.breast-cancer.r2.regional-treatment-morbidity",
          "claim.breast-cancer.nst-residual-nodes"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.mastectomy-rni-omit-alnd.wall.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.mastectomy-rni-omit-alnd.wall.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.mastectomy-rni"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.mastectomy-with-rni-r2.v2",
    "nodeId": "node.topic.breast-cancer.mastectomy-rni-omit-alnd.v2",
    "questionVariantId": "question.topic.breast-cancer.mastectomy-rni-omit-alnd.v2",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

### question.topic.breast-cancer.initial-fixed-nodes-alnd.v1 - pass-preserved

Concept: `concept.topic.breast-cancer.initial-bulky-nodal-boundary.v1`. Previous concept: unchanged meaning. Question/node SHA-256: `882fb7152170349f889fc76ebde7eb9c3bb04e6345f3f3346099d46dd6f8efef` / `2081e0052d077b756988ccfe903f51f5ebde7d737bc540f86c32aa4816786ca3`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.initial-bulky-nodes-response.v1`; variant: `question.topic.breast-cancer.initial-fixed-nodes-alnd.v1`; node: `node.topic.breast-cancer.initial-fixed-nodes-alnd.v1`.
- Patient: Paula Davis, 50-year-old Female. Complaint: **Axillary response review**.
- Presentation: {patientName}, a 50-year-old woman, attends clinic after neoadjuvant treatment for noninflammatory breast cancer. The pretreatment surgeon documented a fixed cluster of axillary nodes, and a core contained metastatic carcinoma. A node was clipped. The cluster is no longer palpable, and current ultrasound shows smaller nodes. Definitive breast surgery is planned.
- Current update: (none)
- Exhibit: (none)
- Task: **Which axillary operation should be planned for {patientName}?**

**key shown first for review only.**

1. **Level I–II axillary lymph-node dissection** (key) - Pretreatment fixed/matted biopsy-proven disease falls outside the usual initially cN1 response pathway used to support targeted staging.
2. **Dual-tracer sentinel mapping with clipped-node retrieval** - It imports a selected initially cN1 de-escalation strategy into a pretreatment fixed-cluster presentation with less established sentinel performance.
3. **Single-tracer sentinel mapping and excision** - It both crosses the original burden boundary and omits the optimization used in selected initially node-positive settings.

Explanation: The original fixed nodal cluster is decision-critical. A favorable current response does not place this case into the usual initially mobile cN1 targeted-staging population. Current ASBrS guidance supports axillary dissection for the represented pretreatment higher-burden setting.

#### Current

- Case: `case.topic.breast-cancer.initial-bulky-nodes-response.v1`; variant: `question.topic.breast-cancer.initial-fixed-nodes-alnd.v1`; node: `node.topic.breast-cancer.initial-fixed-nodes-alnd.v1`.
- Patient: Paula Davis, 50-year-old Female. Complaint: **Axillary response review**.
- Presentation: {patientName}, a 50-year-old woman, attends clinic after neoadjuvant treatment for noninflammatory breast cancer. The pretreatment surgeon documented a fixed cluster of axillary nodes, and a core contained metastatic carcinoma. A node was clipped. The cluster is no longer palpable, and current ultrasound shows smaller nodes. Definitive breast surgery is planned.
- Current update: (none)
- Exhibit: (none)
- Task: **Which axillary operation should be planned for {patientName}?**

**key shown first for review only.**

1. **Level I–II axillary lymph-node dissection** (key) - Pretreatment fixed/matted biopsy-proven disease falls outside the usual initially cN1 response pathway used to support targeted staging.
2. **Dual-tracer sentinel mapping with clipped-node retrieval** - It imports a selected initially cN1 de-escalation strategy into a pretreatment fixed-cluster presentation with less established sentinel performance.
3. **Single-tracer sentinel mapping and excision** - It both crosses the original burden boundary and omits the optimization used in selected initially node-positive settings.

Explanation: The original fixed nodal cluster is decision-critical. A favorable current response does not place this case into the usual initially mobile cN1 targeted-staging population. Current ASBrS guidance supports axillary dissection for the represented pretreatment higher-burden setting.

Review response: Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval.

**Exact PASS payload preserved.** The following is the original author reasoning, not a new independent assessment. Its optional editorial suggestions remain notes, not silent wording changes.

- Reasoning step 1: Interpret the pretreatment fixed cluster as a different burden category from a mobile involved node.
- Reasoning step 2: Retain that original boundary when choosing the operation after response.
- Closest error: Choose targeted de-escalation because the clipped node is now small and nonpalpable.
- Deciding observation: The original examination documented a fixed nodal cluster, not a single mobile involved node.
- Consequence: Reclassifying baseline burden from the response examination can apply inadequately supported staging.
- Decision-changing counterfactual: If the original involved nodes were mobile cN1 and now clinically negative, optimized targeted/sentinel staging could become the key.
- Deletion/context check: Without the original fixed-cluster record, the offered targeted strategy would become plausible. Current response creates the conflict rather than settling it.

Five concrete author checks:

1. Cover-the-key attack: The task does not name a nodal category or a dissection indication. Technical options are concrete and comparable; the same targeted technique is the key in a different meaningful case.
2. One stage/category: Axillary operation during definitive surgery after neoadjuvant therapy.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted hard: baseline burden must outweigh an apparently reassuring current response.
5. Defensible key boundary: The original examination documented a fixed nodal cluster, not a single mobile involved node. Counterfactual: If the original involved nodes were mobile cN1 and now clinically negative, optimized targeted/sentinel staging could become the key.

Sequence and identity: Standalone; prior explanations from the converted-cN1 case are not part of this visible encounter. New distinct high-burden meaning, separate from uncomplicated post-NST staging; no frozen inflammatory phenotype is changed.

- `choice.topic.breast-cancer.initial-fixed-nodes-alnd.tad.v1`: temptation Lets current response erase the original nodal category. Ranking: It imports a selected initially cN1 de-escalation strategy into a pretreatment fixed-cluster presentation with less established sentinel performance. When reasonable: The same technique is appropriate in selected initially mobile cN1, now clinically negative noninflammatory disease. Claims: claim.breast-cancer.high-burden-axilla, claim.breast-cancer.nst-negative-staging.
- `choice.topic.breast-cancer.initial-fixed-nodes-alnd.sln.v1`: temptation Uses the current normal-looking axilla as if it were an uncomplicated upfront staging case. Ranking: It both crosses the original burden boundary and omits the optimization used in selected initially node-positive settings. When reasonable: An initially node-negative presentation is a different sentinel-staging setting. Claims: claim.breast-cancer.high-burden-axilla, claim.breast-cancer.nst-negative-staging.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.initial-bulky-nodes-response.v1",
    "questionVariantId": "question.topic.breast-cancer.initial-fixed-nodes-alnd.v1",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.high-burden-axilla",
          "claim.breast-cancer.nst-negative-staging"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.initial-fixed-nodes-alnd.alnd.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.initial-fixed-nodes-alnd.alnd.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.high-burden-axilla"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.initial-fixed-nodes-alnd.tad.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.initial-fixed-nodes-alnd.tad.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.high-burden-axilla",
          "claim.breast-cancer.nst-negative-staging"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.initial-fixed-nodes-alnd.sln.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.initial-fixed-nodes-alnd.sln.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.high-burden-axilla",
          "claim.breast-cancer.nst-negative-staging"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.initial-bulky-nodes-response.v1",
    "nodeId": "node.topic.breast-cancer.initial-fixed-nodes-alnd.v1",
    "questionVariantId": "question.topic.breast-cancer.initial-fixed-nodes-alnd.v1",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

### question.topic.breast-cancer.inflammatory-initial-sequence.v1 - pass-preserved

Concept: `concept.inflammatory-breast-cancer.neoadjuvant-sequence`. Previous concept: unchanged meaning. Question/node SHA-256: `1b77a1db8e8e5d514d981e1fdde05309071213e817678c1cd42976aede53ec0c` / `e0319fadedcc4d7282c4e9dfffc769df93aef924f472bee97da17b4b0ef6f38b`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.diffuse-skin-clinic-review.v1`; variant: `question.topic.breast-cancer.inflammatory-initial-sequence.v1`; node: `node.topic.breast-cancer.inflammatory-initial-sequence.v1`.
- Patient: Diana Wells, 49-year-old Female. Complaint: **Progressive breast swelling**.
- Presentation: {patientName}, a 49-year-old woman, attends clinic with rapidly progressive right breast redness and pitting over much of the breast. Ultrasound shows a persistent irregular parenchymal area and thickened skin. Skin punch sections contain dermis with inflammation; the parenchymal area has not been sampled. There is no drainable collection.
- Current update: {patientName}'s breast core confirms invasive carcinoma; ER, PR and HER2 testing is complete. The pretreatment photographs show erythema and pitting across most of the breast, with progression documented before biopsy. Regional nodal sampling contains carcinoma, and systemic staging finds no distant metastasis. No cancer treatment has yet been given.
- Exhibit: (none)
- Task: **Which treatment sequence should be recommended for {patientName}?**

**key shown first for review only.**

1. **Systemic therapy, modified radical mastectomy, radiation** (key) - The original diffuse inflammatory presentation with confirmed nonmetastatic carcinoma calls for systemic treatment before the definitive breast/axillary operation and radiation.
2. **Modified radical mastectomy, systemic therapy, radiation** - The operation is not ordinarily the first treatment for this pretreatment inflammatory presentation.
3. **Radiation, systemic therapy, modified radical mastectomy** - It makes local radiation the initial step rather than the established systemic-first approach for this nonmetastatic presentation.

Explanation: The original skin extent matters even though invasive carcinoma is confirmed on a breast core. In the nonmetastatic inflammatory setting, systemic therapy precedes modified radical mastectomy and postoperative radiation. The case does not yet supply a treatment response or a reconstruction timetable.

#### Current

- Case: `case.topic.breast-cancer.diffuse-skin-clinic-review-pass-split.v2`; variant: `question.topic.breast-cancer.inflammatory-initial-sequence.v1`; node: `node.topic.breast-cancer.inflammatory-initial-sequence.v1`.
- Patient: Diana Wells, 49-year-old Female. Complaint: **Progressive breast swelling**.
- Presentation: {patientName}, a 49-year-old woman, attends clinic with rapidly progressive right breast redness and pitting over much of the breast. Ultrasound shows a persistent irregular parenchymal area and thickened skin. Skin punch sections contain dermis with inflammation; the parenchymal area has not been sampled. There is no drainable collection.
- Current update: {patientName}'s breast core confirms invasive carcinoma; ER, PR and HER2 testing is complete. The pretreatment photographs show erythema and pitting across most of the breast, with progression documented before biopsy. Regional nodal sampling contains carcinoma, and systemic staging finds no distant metastasis. No cancer treatment has yet been given.
- Exhibit: (none)
- Task: **Which treatment sequence should be recommended for {patientName}?**

**key shown first for review only.**

1. **Systemic therapy, modified radical mastectomy, radiation** (key) - The original diffuse inflammatory presentation with confirmed nonmetastatic carcinoma calls for systemic treatment before the definitive breast/axillary operation and radiation.
2. **Modified radical mastectomy, systemic therapy, radiation** - The operation is not ordinarily the first treatment for this pretreatment inflammatory presentation.
3. **Radiation, systemic therapy, modified radical mastectomy** - It makes local radiation the initial step rather than the established systemic-first approach for this nonmetastatic presentation.

Explanation: The original skin extent matters even though invasive carcinoma is confirmed on a breast core. In the nonmetastatic inflammatory setting, systemic therapy precedes modified radical mastectomy and postoperative radiation. The case does not yet supply a treatment response or a reconstruction timetable.

Review response: Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval.

**Exact PASS payload preserved.** The following is the original author reasoning, not a new independent assessment. Its optional editorial suggestions remain notes, not silent wording changes.

- Reasoning step 1: Integrate rapid diffuse pretreatment skin involvement with invasive pathology and regional-only staging.
- Reasoning step 2: Apply the inflammatory systemic-first sequence rather than immediate surgery or radiation.
- Closest error: Begin with mastectomy because the known disease is regionally resectable.
- Deciding observation: Documented pretreatment diffuse skin phenotype with invasive cancer and no distant spread.
- Consequence: A localized surgery-first model is applied to the wrong clinical disease setting.
- Decision-changing counterfactual: A localized noninflammatory primary could make surgery first appropriate; distant metastasis would change the curative trimodality framework.
- Deletion/context check: Removing skin chronology or distant staging changes the available sequence; biomarker completion allows treatment planning without inventing a regimen.

Five concrete author checks:

1. Cover-the-key attack: Each option uses the same three modalities and differs only in phase order. Neither word novelty nor a uniquely complete multimodal key selects the answer.
2. One stage/category: Initial sequence of definitive multimodal treatment.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted moderate/hard: distinguish an inflammatory phenotype from simply operable regional cancer using the original record.
5. Defensible key boundary: Documented pretreatment diffuse skin phenotype with invasive cancer and no distant spread. Counterfactual: A localized noninflammatory primary could make surgery first appropriate; distant metastasis would change the curative trimodality framework.

Sequence and identity: The first node feedback establishes diagnosis needs without giving this sequence. No hypothetical future response is treated as an observed response. Same sequence concept; repairs the original set's omitted-radiation and lumpectomy caricatures without touching the frozen B37-context variant.

- `choice.topic.breast-cancer.inflammatory-initial-sequence.surgery.v1`: temptation Prioritizes immediate resection of an operable primary before systemic treatment. Ranking: The operation is not ordinarily the first treatment for this pretreatment inflammatory presentation. When reasonable: Selected noninflammatory resectable cancers may be treated with surgery first. Claims: claim.breast-cancer.ibc-sequence.
- `choice.topic.breast-cancer.inflammatory-initial-sequence.radiation.v1`: temptation Treats extensive skin involvement as a reason to irradiate before systemic treatment. Ranking: It makes local radiation the initial step rather than the established systemic-first approach for this nonmetastatic presentation. When reasonable: Different local-control or palliation circumstances require their own multidisciplinary sequence; this record does not establish one. Claims: claim.breast-cancer.ibc-sequence.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.diffuse-skin-clinic-review-pass-split.v2",
    "questionVariantId": "question.topic.breast-cancer.inflammatory-initial-sequence.v1",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.ibc-sequence"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.inflammatory-initial-sequence.systemic.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.inflammatory-initial-sequence.systemic.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.ibc-sequence"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.inflammatory-initial-sequence.surgery.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.inflammatory-initial-sequence.surgery.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.ibc-sequence"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.inflammatory-initial-sequence.radiation.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.inflammatory-initial-sequence.radiation.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.ibc-sequence"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.diffuse-skin-clinic-review-pass-split.v2",
    "nodeId": "node.topic.breast-cancer.inflammatory-initial-sequence.v1",
    "questionVariantId": "question.topic.breast-cancer.inflammatory-initial-sequence.v1",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

### question.topic.breast-cancer.marker-target-reconciliation.v1 - pass-preserved

Concept: `concept.n4r2.lumpectomy-target-marker-reconciliation`. Previous concept: unchanged meaning. Question/node SHA-256: `6dd884128e7b66a6bcc8ab021c7d458cf804f3e0dafe90fa6cc739d5068a050d` / `8cef9a77f95dd064596d11b29cd0ed7fe9daaba418545c98ccbad67b34fa3a08`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.localization-specimen-chart.v1`; variant: `question.topic.breast-cancer.marker-target-reconciliation.v1`; node: `node.topic.breast-cancer.marker-target-reconciliation.v1`.
- Patient: Julia Grant, 58-year-old Female. Complaint: **Operative image review**.
- Presentation: The founder reviews outside operating-room records in clinic for {patientName}, a 58-year-old woman undergoing wire-localized lumpectomy for left DCIS calcifications. The first oriented specimen has been removed. The breast surgeon requests review before closure.
- Current update: (none)
- Exhibit: {"kind":"keyValue","caption":"Constructed outside localization and specimen record","items":[{"label":"After original core biopsy","value":"The DCIS calcification cluster is centered at the biopsy cavity. The top-hat marker is documented in separate fat medial to the cluster."},{"label":"Localization images","value":"The wire tip crosses the calcification cluster; the top-hat marker remains medial to the wire tip."},{"label":"Oriented specimen views","value":"The full mapped calcification cluster and wire tip are visible. The top-hat marker is absent."},{"label":"Current breast image","value":"No residual target calcifications are seen; the top-hat marker remains at its documented medial position."}]}
- Task: **Which operative plan should be recommended for {patientName} before closure?**

**key shown first for review only.**

1. **Complete closure and await permanent histologic margins** (key) - The intended radiographic lesion is represented. The absent marker occupied a documented separate position before surgery; it is not a substitute for the lesion or a microscopic margin result.
2. **Excise the medial marker bed and repeat specimen imaging** - It would chase the separately positioned marker despite current imaging confirmation of target retrieval.
3. **Obtain additional specimen views before completing closure** - The supplied orthogonal specimen views and current breast image already resolve whether the mapped target was removed; further views do not establish microscopic margins.

Explanation: The target and marker were documented at separate positions before localization. Specimen and current breast images support removal of the mapped calcification target. Chasing the marker is not required by its absence in this constructed record; final histology still determines microscopic margins.

#### Current

- Case: `case.topic.breast-cancer.localization-specimen-chart.v1`; variant: `question.topic.breast-cancer.marker-target-reconciliation.v1`; node: `node.topic.breast-cancer.marker-target-reconciliation.v1`.
- Patient: Julia Grant, 58-year-old Female. Complaint: **Operative image review**.
- Presentation: The founder reviews outside operating-room records in clinic for {patientName}, a 58-year-old woman undergoing wire-localized lumpectomy for left DCIS calcifications. The first oriented specimen has been removed. The breast surgeon requests review before closure.
- Current update: (none)
- Exhibit: {"kind":"keyValue","caption":"Constructed outside localization and specimen record","items":[{"label":"After original core biopsy","value":"The DCIS calcification cluster is centered at the biopsy cavity. The top-hat marker is documented in separate fat medial to the cluster."},{"label":"Localization images","value":"The wire tip crosses the calcification cluster; the top-hat marker remains medial to the wire tip."},{"label":"Oriented specimen views","value":"The full mapped calcification cluster and wire tip are visible. The top-hat marker is absent."},{"label":"Current breast image","value":"No residual target calcifications are seen; the top-hat marker remains at its documented medial position."}]}
- Task: **Which operative plan should be recommended for {patientName} before closure?**

**key shown first for review only.**

1. **Complete closure and await permanent histologic margins** (key) - The intended radiographic lesion is represented. The absent marker occupied a documented separate position before surgery; it is not a substitute for the lesion or a microscopic margin result.
2. **Excise the medial marker bed and repeat specimen imaging** - It would chase the separately positioned marker despite current imaging confirmation of target retrieval.
3. **Obtain additional specimen views before completing closure** - The supplied orthogonal specimen views and current breast image already resolve whether the mapped target was removed; further views do not establish microscopic margins.

Explanation: The target and marker were documented at separate positions before localization. Specimen and current breast images support removal of the mapped calcification target. Chasing the marker is not required by its absence in this constructed record; final histology still determines microscopic margins.

Review response: Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval.

**Exact PASS payload preserved.** The following is the original author reasoning, not a new independent assessment. Its optional editorial suggestions remain notes, not silent wording changes.

- Reasoning step 1: Reconstruct the marker-to-malignant-target relationship from the original and localization records.
- Reasoning step 2: Use actual target representation to choose closure versus more imaging or tissue removal.
- Closest error: Excise additional medial tissue merely because the top-hat marker is absent from the specimen.
- Deciding observation: The marker was separate before surgery, while all mapped target calcifications are in the oriented specimen.
- Consequence: A marker-only shortcut can remove unnecessary tissue or misclassify true target failure in another case.
- Decision-changing counterfactual: If the original marker lay within the cluster and current imaging showed residual cluster with it, targeted further excision would replace closure.
- Deletion/context check: The original marker relationship is essential: delete it and absent marker plus visible calcifications leaves an unresolved discrepancy. Current imaging is needed to distinguish an unexplained missing marker from known target retrieval.

Five concrete author checks:

1. Cover-the-key attack: Reversed the prior draft's explicitly retained target. Each plan is a realistic preclosure action. The key does not assert clear microscopic margins, and no sentence says 'the correct target has been removed'.
2. One stage/category: Disposition of the operative field after localization/specimen review.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted moderate/hard: resist chasing a familiar marker when the longitudinal target relationship differs.
5. Defensible key boundary: The marker was separate before surgery, while all mapped target calcifications are in the oriented specimen. Counterfactual: If the original marker lay within the cluster and current imaging showed residual cluster with it, targeted further excision would replace closure.

Sequence and identity: Standalone clinic chart review; no new operating-room setting or executed local service is required. Preserves the N4r2 target-reconciliation concept. The original's current-localization sentence revealed the missed target; this new exact version requires longitudinal interpretation.

- `choice.topic.breast-cancer.marker-target-reconciliation.marker.v1`: temptation Treats marker retrieval as identical to malignant target retrieval even when their relation is documented differently. Ranking: It would chase the separately positioned marker despite current imaging confirmation of target retrieval. When reasonable: A marker within a persisting proven target could appropriately guide further excision. Claims: claim.breast-cancer.specimen-target.
- `choice.topic.breast-cancer.marker-target-reconciliation.views.v1`: temptation Uses more pictures to compensate for a marker absence that is already explained by the original localization relation. Ranking: The supplied orthogonal specimen views and current breast image already resolve whether the mapped target was removed; further views do not establish microscopic margins. When reasonable: An inadequately depicted specimen or unresolved target location would justify further imaging before an operative decision. Claims: claim.breast-cancer.specimen-target.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.localization-specimen-chart.v1",
    "questionVariantId": "question.topic.breast-cancer.marker-target-reconciliation.v1",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.specimen-target"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.marker-target-reconciliation.closure.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.marker-target-reconciliation.closure.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.specimen-target"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.marker-target-reconciliation.marker.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.marker-target-reconciliation.marker.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.specimen-target"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.marker-target-reconciliation.views.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.marker-target-reconciliation.views.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.specimen-target"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.localization-specimen-chart.v1",
    "nodeId": "node.topic.breast-cancer.marker-target-reconciliation.v1",
    "questionVariantId": "question.topic.breast-cancer.marker-target-reconciliation.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.breast-cancer.marker-target-reconciliation.closure.v1",
          "choiceLabel": "Complete closure and await permanent histologic margins",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.breast-cancer.marker-target-reconciliation.marker.v1",
          "choiceLabel": "Excise the medial marker bed and repeat specimen imaging",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        },
        {
          "choiceId": "choice.topic.breast-cancer.marker-target-reconciliation.views.v1",
          "choiceLabel": "Obtain additional specimen views before completing closure",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mammography"
          }
        }
      ]
    }
  }
}
```

### question.topic.breast-cancer.benign-sample-discordance.v1 - pass-preserved

Concept: `concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2`. Previous concept: unchanged meaning. Question/node SHA-256: `a6c0f56b8a145ccfd953187221643432ac2c7447b51fe5262aecc49c89e47f95` / `cf64dbe25521e8f3b75cc87a77ce4347d4163f170b381b0b04d279ac92402087`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.additional-mri-focus.v1`; variant: `question.topic.breast-cancer.benign-sample-discordance.v1`; node: `node.topic.breast-cancer.benign-sample-discordance.v1`.
- Patient: Claire Morgan, 57-year-old Female. Complaint: **Review breast extent**.
- Presentation: {patientName}, a 57-year-old woman, attends clinic with a biopsy-proven left invasive carcinoma at 10 o'clock. Mammography and ultrasound show one localized lesion. MRI also shows a separate irregular enhancing focus at 4 o'clock. The radiologist can target both findings; only the 10-o'clock lesion has been sampled. The additional focus would change the planned breast resection.
- Current update: The 4-o'clock focus is sampled. Pathology shows mature adipose tissue and scant stroma. Archived needle images put the sampling notch posterior to the enhancing focus, and the postprocedure marker is in that same fat plane. Repeat targeted imaging still shows the irregular focus. {patientName}'s primary remains localized at 10 o'clock.
- Exhibit: (none)
- Task: **Which plan should {patientName} receive for the 4-o'clock finding?**

**key shown first for review only.**

1. **Repeat image-guided sampling of the 4-o'clock focus** (key) - The sample's location and contents do not represent the persisting target, so its benign result cannot settle that focus.
2. **Interval breast imaging after the primary resection** - The nonrepresentative sample has not resolved the additional suspicious focus before surgery is finalized.
3. **Proceed to mastectomy for both mapped breast sites** - The additional focus remains unproven, so this would treat uncertain extent as established separate malignancy.

Explanation: A benign report is not independent of its target. The needle position and adipose specimen leave the irregular focus unrepresented. Resolve that focus with representative tissue before either dismissing it or using it to justify a larger cancer operation.

#### Current

- Case: `case.topic.breast-cancer.additional-mri-focus-pass-split.v2`; variant: `question.topic.breast-cancer.benign-sample-discordance.v1`; node: `node.topic.breast-cancer.benign-sample-discordance.v1`.
- Patient: Claire Morgan, 57-year-old Female. Complaint: **Review breast extent**.
- Presentation: {patientName}, a 57-year-old woman, attends clinic with a biopsy-proven left invasive carcinoma at 10 o'clock. Mammography and ultrasound show one localized lesion. MRI also shows a separate irregular enhancing focus at 4 o'clock. The radiologist can target both findings; only the 10-o'clock lesion has been sampled. The additional focus would change the planned breast resection.
- Current update: The 4-o'clock focus is sampled. Pathology shows mature adipose tissue and scant stroma. Archived needle images put the sampling notch posterior to the enhancing focus, and the postprocedure marker is in that same fat plane. Repeat targeted imaging still shows the irregular focus. {patientName}'s primary remains localized at 10 o'clock.
- Exhibit: (none)
- Task: **Which plan should {patientName} receive for the 4-o'clock finding?**

**key shown first for review only.**

1. **Repeat image-guided sampling of the 4-o'clock focus** (key) - The sample's location and contents do not represent the persisting target, so its benign result cannot settle that focus.
2. **Interval breast imaging after the primary resection** - The nonrepresentative sample has not resolved the additional suspicious focus before surgery is finalized.
3. **Proceed to mastectomy for both mapped breast sites** - The additional focus remains unproven, so this would treat uncertain extent as established separate malignancy.

Explanation: A benign report is not independent of its target. The needle position and adipose specimen leave the irregular focus unrepresented. Resolve that focus with representative tissue before either dismissing it or using it to justify a larger cancer operation.

Review response: Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval.

**Exact PASS payload preserved.** The following is the original author reasoning, not a new independent assessment. Its optional editorial suggestions remain notes, not silent wording changes.

- Reasoning step 1: Infer nonrepresentation from the notch, marker and tissue contents.
- Reasoning step 2: Choose repeat representative sampling rather than benign-result surveillance or unproven cancer surgery.
- Closest error: Treat the benign pathology label as evidence about the enhancing focus.
- Deciding observation: The sampling notch and marker were posterior to the persistent target in fat.
- Consequence: Either missed additional disease or unnecessary mastectomy can follow a provenance error.
- Decision-changing counterfactual: A correctly positioned notch with representative benign tissue explaining the imaging would permit a benign-concordant pathway.
- Deletion/context check: Without the new acquisition and specimen contents, the earlier task merely called for biopsy; this update earns a separate adequacy decision.

Five concrete author checks:

1. Cover-the-key attack: The update describes positions without saying 'missed target'. Three care plans differ at the real point of uncertainty; the key does not add a unique list of general cautions.
2. One stage/category: Disposition of the unresolved additional focus after tissue sampling.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted moderate/hard: neither benign-label reassurance nor automatic malignant attribution is justified.
5. Defensible key boundary: The sampling notch and marker were posterior to the persistent target in fat. Counterfactual: A correctly positioned notch with representative benign tissue explaining the imaging would permit a benign-concordant pathway.

Sequence and identity: Earlier feedback says to sample the focus, not that any subsequent benign report is adequate. The source meaning matches the stable existing discordance concept. Reuses the existing breast-core discordance meaning despite its historical inflammatory ID. Adds a noninflammatory context without moving FSRS history to a new construct.

- `choice.topic.breast-cancer.benign-sample-discordance.surveillance.v1`: temptation Accepts 'benign' without checking which tissue was examined. Ranking: The nonrepresentative sample has not resolved the additional suspicious focus before surgery is finalized. When reasonable: A benign concordant represented focus could be followed as appropriate while treating the primary. Claims: claim.breast-cancer.verify-additional-focus.
- `choice.topic.breast-cancer.benign-sample-discordance.mastectomy.v1`: temptation Equates a failed benign biopsy with confirmation of multicentric cancer. Ranking: The additional focus remains unproven, so this would treat uncertain extent as established separate malignancy. When reasonable: Representative malignant findings across an unresectable conservation field could justify mastectomy. Claims: claim.breast-cancer.verify-additional-focus, claim.breast-cancer.diffuse-calcifications.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.additional-mri-focus-pass-split.v2",
    "questionVariantId": "question.topic.breast-cancer.benign-sample-discordance.v1",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.verify-additional-focus",
          "claim.breast-cancer.diffuse-calcifications"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.benign-sample-discordance.repeat.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.benign-sample-discordance.repeat.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.verify-additional-focus"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.benign-sample-discordance.surveillance.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.benign-sample-discordance.surveillance.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.verify-additional-focus"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.benign-sample-discordance.mastectomy.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.benign-sample-discordance.mastectomy.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.verify-additional-focus",
          "claim.breast-cancer.diffuse-calcifications"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.additional-mri-focus-pass-split.v2",
    "nodeId": "node.topic.breast-cancer.benign-sample-discordance.v1",
    "questionVariantId": "question.topic.breast-cancer.benign-sample-discordance.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.breast-cancer.benign-sample-discordance.repeat.v1",
          "choiceLabel": "Repeat image-guided sampling of the 4-o'clock focus",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_core_biopsy"
          }
        },
        {
          "choiceId": "choice.topic.breast-cancer.benign-sample-discordance.surveillance.v1",
          "choiceLabel": "Interval breast imaging after the primary resection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.breast_imaging_bundle"
          }
        },
        {
          "choiceId": "choice.topic.breast-cancer.benign-sample-discordance.mastectomy.v1",
          "choiceLabel": "Proceed to mastectomy for both mapped breast sites",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  }
}
```

### question.topic.breast-cancer.diffuse-malignant-residual.v2 - revised

Concept: `concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection`. Previous concept: unchanged meaning. Question/node SHA-256: `4cdfe1e101727c342bb8f01ebe454eacb88e99ee88897c1712d3656799727355` / `3f0ec4b7fc94e39d1c6d55d8911bdc9b80bbd7fbcb7efd70675feb672d3a84b0`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.residual-breast-distribution.v1`; variant: `question.topic.breast-cancer.diffuse-malignant-residual.v1`; node: `node.topic.breast-cancer.diffuse-malignant-residual.v1`.
- Patient: Alicia Hayes, 48-year-old Female. Complaint: **Surgery after treatment**.
- Presentation: {patientName}, a 48-year-old woman, attends clinic after neoadjuvant treatment for noninflammatory left breast cancer. The original mass is no longer palpable. MRI shows a small enhancing remnant around its marker, while mammography shows branching calcifications extending well beyond that remnant into separated breast regions.
- Current update: Mapped calcification samples from the central breast, tissue between the original foci and multiple peripheral quadrants contain DCIS without stromal invasion identified in those samples. The calcification field reaches the gland periphery in those regions. The MRI remnant remains small. {patientName} has not had prior breast radiation.
- Exhibit: (none)
- Task: **Which breast operation should be recommended for {patientName}?**

**key shown first for review only.**

1. **Mastectomy of the affected breast** (key) - The verified malignant calcification distribution is diffuse; excision of a small enhancing remnant would not encompass it.
2. **Localized excision of the marked enhancing bed** - It follows the MRI response while leaving the broader sampled malignant field outside the excision.
3. **Oncoplastic excision of the original focal tumor sites** - Resecting the focal sites does not encompass the malignant intervening and peripheral field.

Explanation: The sampled sites establish a distributed residual malignant field beyond the small MRI remnant. That current field determines whether a breast-conserving operation can encompass the malignancy. Diffuse malignant calcifications favor mastectomy here; absence of invasion in individual cores is not a whole-breast clearance claim.

#### Current

- Case: `case.topic.breast-cancer.residual-breast-distribution-r2.v2`; variant: `question.topic.breast-cancer.diffuse-malignant-residual.v2`; node: `node.topic.breast-cancer.diffuse-malignant-residual.v2`.
- Patient: Alicia Hayes, 48-year-old Female. Complaint: **Surgery after treatment**.
- Presentation: {patientName}, a 48-year-old woman, attends clinic after neoadjuvant treatment for noninflammatory left breast cancer. The pretreatment invasive mass was localized at one marked upper-outer site. Current MRI shows a small enhancing remnant there. Mammography shows branching calcifications continuous through the central breast into all four peripheral quadrants. Separate mapped samples from the central, upper-inner, lower-inner, lower-outer and upper-outer field contain DCIS. These calcifications reach the gland periphery.
- Current update: (none)
- Exhibit: (none)
- Task: **Which breast operation should be recommended for {patientName}?**

**key shown first for review only.**

1. **Mastectomy of the affected breast** (key) - The distributed proven malignant calcification field is a conservation contraindication despite the small enhancing remnant.
2. **Bracketed oncoplastic reduction encompassing the calcification field** - Oncoplastic redistribution does not remove the oncologic limitation imposed by diffuse malignant calcifications across the breast.
3. **Multiple image-localized lumpectomies across the calcified regions** - The record is a continuous intervening malignant field, not a few discrete separable foci that can each be encompassed.

Explanation: Interpret the distribution across modalities and sampled sites. The enhancing invasive remnant is small, but the malignant calcification field is continuous through the central breast and all quadrants. Mastectomy addresses that diffuse extent. Neither oncoplastic rearrangement nor multiple focal resections makes diffuse malignant calcifications a routine conservation setting.

Review response: Removed undocumented multiple original foci. The standalone record consistently has one original invasive target and a later continuous malignant calcification field from the center through all quadrants. Both conservation options now attempt to address that current field. The geometry, rather than an invented breast-volume cutoff or old-target-only foil, determines the operation.

- Reasoning step 1: Reconstruct the continuous malignant field from the mammographic geography and positive mapped samples despite a small MRI remnant.
- Reasoning step 2: Apply the diffuse-malignant-calcification boundary to genuine operations that attempt to encompass the current disease.
- Closest error: Choose a bracketed oncoplastic reduction because it appears able to remove more tissue than an ordinary lumpectomy.
- Deciding observation: Positive mapped sites span the central breast and every peripheral quadrant within a continuous calcified field.
- Consequence: Treating diffuse disease as a set of focal targets can leave intervening malignancy or create an unsupported conservation plan.
- Decision-changing counterfactual: With a localized encompassable field or a few discrete appropriately resectable foci, conservation could again be considered.
- Deletion/context check: Without the continuous all-quadrant map, mastectomy is not established. The small MRI remnant creates the meaningful conflicting signal. No breast-volume cutoff is invented.

Five concrete author checks:

1. Cover-the-key attack: Both conservation choices explicitly attempt to encompass the current field, rather than knowingly excise old targets. No sentence supplies the conclusion that conservation is impossible.
2. One stage/category: Definitive breast resection after verified residual extent.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted fair moderate/hard: the choice depends on diffuse versus selected multifocal geometry rather than an incomplete-option shortcut.
5. Defensible key boundary: Positive mapped sites span the central breast and every peripheral quadrant within a continuous calcified field. Counterfactual: With a localized encompassable field or a few discrete appropriately resectable foci, conservation could again be considered.

Sequence and identity: Self-contained standalone: the uncertain earlier mapping-workflow node is parked. The original single-mass map is consistent throughout. One revision removes undocumented original foci, supplies a consistent current field and replaces both old-target-only foils with real current-field conservation attempts.

- `choice.topic.breast-cancer.diffuse-malignant-residual.reduction.v2`: temptation Treats an oncoplastic technique as a solution to every broad resection distribution. Ranking: Oncoplastic redistribution does not remove the oncologic limitation imposed by diffuse malignant calcifications across the breast. When reasonable: A selected localized field with an appropriate resection and radiation plan may be suitable for an oncoplastic approach. Claims: claim.breast-cancer.diffuse-calcifications.
- `choice.topic.breast-cancer.diffuse-malignant-residual.multiple.v2`: temptation Extends selected multifocal conservation evidence to diffuse continuous disease. Ranking: The record is a continuous intervening malignant field, not a few discrete separable foci that can each be encompassed. When reasonable: Separate limited foci with no diffuse malignant intervening field can support selected multiple-site conservation. Claims: claim.breast-cancer.diffuse-calcifications.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.residual-breast-distribution-r2.v2",
    "questionVariantId": "question.topic.breast-cancer.diffuse-malignant-residual.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.diffuse-calcifications",
          "claim.breast-cancer.response-localization"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.diffuse-malignant-residual.mastectomy.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.diffuse-malignant-residual.mastectomy.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.diffuse-calcifications",
          "claim.breast-cancer.response-localization"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.diffuse-malignant-residual.reduction.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.diffuse-malignant-residual.reduction.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.diffuse-calcifications"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.diffuse-malignant-residual.multiple.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.diffuse-malignant-residual.multiple.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.diffuse-calcifications"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.residual-breast-distribution-r2.v2",
    "nodeId": "node.topic.breast-cancer.diffuse-malignant-residual.v2",
    "questionVariantId": "question.topic.breast-cancer.diffuse-malignant-residual.v2",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

### question.topic.breast-cancer.dcis-positive-shave.v1 - pass-preserved

Concept: `concept.dcis.margin-bcs-wbrt`. Previous concept: unchanged meaning. Question/node SHA-256: `392a092a09b5bffc65eb48e2fbbab4a888d89f24d24273b7dae995653ac28cbe` / `280766179f0f91d15270051cf38eb37b798e7e9c1fcc5ff139e0c83dc180c264`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.dcis-final-boundary.v1`; variant: `question.topic.breast-cancer.dcis-positive-shave.v1`; node: `node.topic.breast-cancer.dcis-positive-shave.v1`.
- Patient: Elena Brooks, 54-year-old Female. Complaint: **Excision pathology review**.
- Presentation: {patientName}, a 54-year-old woman, attends clinic after right lumpectomy for calcification-detected DCIS. Whole-breast radiation is planned. She wants to retain the breast if further surgery is needed.
- Current update: (none)
- Exhibit: {"kind":"keyValue","caption":"Constructed oriented pathology record","items":[{"label":"Main lumpectomy","value":"Pure DCIS; all inked surfaces clear by at least 3 mm."},{"label":"Additional lateral cavity shave","value":"The surgeon marks its external surface with a suture. DCIS reaches ink on that surface over several sections."},{"label":"Lateral cavity","value":"Breast parenchyma remains beyond this radial boundary; the lesion is not diffuse on the reconciled mammogram."}]}
- Task: **Which breast treatment plan should {patientName} receive next?**

**key shown first for review only.**

1. **Lateral cavity re-excision, then whole-breast radiation** (key) - The separately oriented shave is the final lateral boundary, and DCIS reaches that ink where breast tissue remains.
2. **Whole-breast radiation, then breast surveillance** - The main specimen's clearance does not cancel tumor on the new radial boundary; planned radiation does not establish surgical clearance.
3. **Completion mastectomy, then breast surveillance** - An addressable positive radial margin is not itself a requirement for mastectomy when disease is localized and breast preservation remains intended.

Explanation: The additional shave establishes the final lateral edge. Its external ink is involved, despite wider clearance on the main specimen. Further lateral excision addresses the remaining radial tissue before planned radiation; the record does not establish a need for mastectomy.

#### Current

- Case: `case.topic.breast-cancer.dcis-final-boundary.v1`; variant: `question.topic.breast-cancer.dcis-positive-shave.v1`; node: `node.topic.breast-cancer.dcis-positive-shave.v1`.
- Patient: Elena Brooks, 54-year-old Female. Complaint: **Excision pathology review**.
- Presentation: {patientName}, a 54-year-old woman, attends clinic after right lumpectomy for calcification-detected DCIS. Whole-breast radiation is planned. She wants to retain the breast if further surgery is needed.
- Current update: (none)
- Exhibit: {"kind":"keyValue","caption":"Constructed oriented pathology record","items":[{"label":"Main lumpectomy","value":"Pure DCIS; all inked surfaces clear by at least 3 mm."},{"label":"Additional lateral cavity shave","value":"The surgeon marks its external surface with a suture. DCIS reaches ink on that surface over several sections."},{"label":"Lateral cavity","value":"Breast parenchyma remains beyond this radial boundary; the lesion is not diffuse on the reconciled mammogram."}]}
- Task: **Which breast treatment plan should {patientName} receive next?**

**key shown first for review only.**

1. **Lateral cavity re-excision, then whole-breast radiation** (key) - The separately oriented shave is the final lateral boundary, and DCIS reaches that ink where breast tissue remains.
2. **Whole-breast radiation, then breast surveillance** - The main specimen's clearance does not cancel tumor on the new radial boundary; planned radiation does not establish surgical clearance.
3. **Completion mastectomy, then breast surveillance** - An addressable positive radial margin is not itself a requirement for mastectomy when disease is localized and breast preservation remains intended.

Explanation: The additional shave establishes the final lateral edge. Its external ink is involved, despite wider clearance on the main specimen. Further lateral excision addresses the remaining radial tissue before planned radiation; the record does not establish a need for mastectomy.

Review response: Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval.

**Exact PASS payload preserved.** The following is the original author reasoning, not a new independent assessment. Its optional editorial suggestions remain notes, not silent wording changes.

- Reasoning step 1: Determine which oriented surface is the final lateral boundary.
- Reasoning step 2: Apply tumor-on-ink management to the remaining radial breast tissue.
- Closest error: Proceed to radiation using the main specimen's 3-mm distance.
- Deciding observation: DCIS reaches the marked external ink of the additional lateral shave.
- Consequence: Treating the main specimen as final can leave an involved radial boundary untreated surgically.
- Decision-changing counterfactual: If the additional shave's external edge were 2 mm clear with the same localized imaging, proceed to radiation rather than re-excise.
- Deletion/context check: Without the shave orientation and ink observation, the apparently adequate main specimen supports the competing plan. Radial residual parenchyma prevents misapplication of a skin/fascia exception.

Five concrete author checks:

1. Cover-the-key attack: The complaint and task do not call the margin positive. All choices are complete local-treatment sequences; no option advertises an omitted safety action. The main-specimen measurement supports a credible shortcut.
2. One stage/category: Next definitive local-treatment plan after final pathology.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted moderate/hard: final-specimen hierarchy competes with an adequate main margin, not two competing memorized widths.
5. Defensible key boundary: DCIS reaches the marked external ink of the additional lateral shave. Counterfactual: If the additional shave's external edge were 2 mm clear with the same localized imaging, proceed to radiation rather than re-excise.

Sequence and identity: First node. Feedback does not state the invasive-cancer margin rule used by the later node. Reuses the stable DCIS margin meaning; replaces a 2-mm recall item with a final-boundary application. No existing definition is overwritten.

- `choice.topic.breast-cancer.dcis-positive-shave.radiation.v1`: temptation Applies the adequate main-specimen distance to the wrong final boundary. Ranking: The main specimen's clearance does not cancel tumor on the new radial boundary; planned radiation does not establish surgical clearance. When reasonable: If the oriented final lateral boundary were adequately clear, this would be appropriate. Claims: claim.breast-cancer.dcis-margin, claim.breast-cancer.radial-positive-margin, claim.breast-cancer.specimen-provenance.
- `choice.topic.breast-cancer.dcis-positive-shave.mastectomy.v1`: temptation Treats any residual DCIS as failure of the entire conservation pathway. Ranking: An addressable positive radial margin is not itself a requirement for mastectomy when disease is localized and breast preservation remains intended. When reasonable: Diffuse malignant distribution or persistent uncorrectable margins could make mastectomy appropriate. Claims: claim.breast-cancer.radial-positive-margin, claim.breast-cancer.diffuse-calcifications.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "questionVariantId": "question.topic.breast-cancer.dcis-positive-shave.v1",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.dcis-margin",
          "claim.breast-cancer.radial-positive-margin",
          "claim.breast-cancer.specimen-provenance",
          "claim.breast-cancer.diffuse-calcifications"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.dcis-positive-shave.lateral.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.dcis-positive-shave.lateral.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.radial-positive-margin",
          "claim.breast-cancer.specimen-provenance"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.dcis-positive-shave.radiation.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.dcis-positive-shave.radiation.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.dcis-margin",
          "claim.breast-cancer.radial-positive-margin",
          "claim.breast-cancer.specimen-provenance"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.dcis-positive-shave.mastectomy.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.dcis-positive-shave.mastectomy.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.radial-positive-margin",
          "claim.breast-cancer.diffuse-calcifications"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "nodeId": "node.topic.breast-cancer.dcis-positive-shave.v1",
    "questionVariantId": "question.topic.breast-cancer.dcis-positive-shave.v1",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

### question.topic.breast-cancer.invasive-with-dcis-margin.v1 - pass-preserved

Concept: `concept.topic.breast-cancer.invasive-component-margin.v1`. Previous concept: unchanged meaning. Question/node SHA-256: `f78c6e4bfc5a498119f193ca0713cb3733a5fbf2806b7c58fab1f13e43bf5361` / `2b8d9f8049182a3488e9e5f6352281a6142abcdfe9ff5e3cac94d7e84512ab4e`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.dcis-final-boundary.v1`; variant: `question.topic.breast-cancer.invasive-with-dcis-margin.v1`; node: `node.topic.breast-cancer.invasive-with-dcis-margin.v1`.
- Patient: Elena Brooks, 54-year-old Female. Complaint: **Excision pathology review**.
- Presentation: {patientName}, a 54-year-old woman, attends clinic after right lumpectomy for calcification-detected DCIS. Whole-breast radiation is planned. She wants to retain the breast if further surgery is needed.
- Current update: {patientName}'s lateral re-excision is now complete. Review of the combined specimens identifies an 8-mm invasive carcinoma surrounded by DCIS. The final lateral edge is 0.7 mm from DCIS; neither invasive carcinoma nor DCIS touches ink. The other final edges are clear, and postexcision mammography shows no residual suspicious calcifications. Whole-breast radiation and indicated systemic treatment are planned.
- Exhibit: (none)
- Task: **Which additional breast operation should {patientName} be offered for the final lateral margin?**

**key shown first for review only.**

1. **No additional breast excision** (key) - This is invasive carcinoma with associated DCIS, not pure DCIS. No tumor reaches the final ink and no separate residual imaging target is reported.
2. **Another lateral cavity re-excision** - It applies the pure-DCIS width requirement to an invasive carcinoma specimen despite absence of tumor on ink.
3. **Completion mastectomy** - A close but ink-negative DCIS component accompanying invasive cancer is not a stand-alone indication for mastectomy.

Explanation: Definitive histology changes which margin framework applies. For invasive carcinoma with associated DCIS in this US conservation pathway, no tumor on ink is generally sufficient. The original DCIS diagnosis does not impose a new 2-mm requirement on the DCIS component of this specimen.

#### Current

- Case: `case.topic.breast-cancer.dcis-final-boundary.v1`; variant: `question.topic.breast-cancer.invasive-with-dcis-margin.v1`; node: `node.topic.breast-cancer.invasive-with-dcis-margin.v1`.
- Patient: Elena Brooks, 54-year-old Female. Complaint: **Excision pathology review**.
- Presentation: {patientName}, a 54-year-old woman, attends clinic after right lumpectomy for calcification-detected DCIS. Whole-breast radiation is planned. She wants to retain the breast if further surgery is needed.
- Current update: {patientName}'s lateral re-excision is now complete. Review of the combined specimens identifies an 8-mm invasive carcinoma surrounded by DCIS. The final lateral edge is 0.7 mm from DCIS; neither invasive carcinoma nor DCIS touches ink. The other final edges are clear, and postexcision mammography shows no residual suspicious calcifications. Whole-breast radiation and indicated systemic treatment are planned.
- Exhibit: (none)
- Task: **Which additional breast operation should {patientName} be offered for the final lateral margin?**

**key shown first for review only.**

1. **No additional breast excision** (key) - This is invasive carcinoma with associated DCIS, not pure DCIS. No tumor reaches the final ink and no separate residual imaging target is reported.
2. **Another lateral cavity re-excision** - It applies the pure-DCIS width requirement to an invasive carcinoma specimen despite absence of tumor on ink.
3. **Completion mastectomy** - A close but ink-negative DCIS component accompanying invasive cancer is not a stand-alone indication for mastectomy.

Explanation: Definitive histology changes which margin framework applies. For invasive carcinoma with associated DCIS in this US conservation pathway, no tumor on ink is generally sufficient. The original DCIS diagnosis does not impose a new 2-mm requirement on the DCIS component of this specimen.

Review response: Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval.

**Exact PASS payload preserved.** The following is the original author reasoning, not a new independent assessment. Its optional editorial suggestions remain notes, not silent wording changes.

- Reasoning step 1: Recognize that the final specimen contains a substantive invasive component.
- Reasoning step 2: Use the invasive-cancer margin standard rather than automatically extending the prior pure-DCIS rule.
- Closest error: Order another re-excision because the DCIS distance remains below 2 mm.
- Deciding observation: An 8-mm invasive component is present and both components are off the final ink.
- Consequence: Using the wrong framework can cause an unnecessary additional breast operation.
- Decision-changing counterfactual: If final lateral ink contained carcinoma, further lateral excision would again be favored.
- Deletion/context check: The invasive component is essential; remove it and the narrower pure-DCIS decision is individualized rather than the same categorical answer. Imaging clearance prevents a hidden separate target.

Five concrete author checks:

1. Cover-the-key attack: The update gives measurements and ink observations, not 'adequate margins'. All choices are operations at the same stage. The earlier node's 2-mm counterfactual deliberately creates a credible carry-forward error, not the next key.
2. One stage/category: Need for another breast operation after definitive re-excision pathology.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted hard: applies a changed histologic framework despite the strongly rehearsed DCIS standard.
5. Defensible key boundary: An 8-mm invasive component is present and both components are off the final ink. Counterfactual: If final lateral ink contained carcinoma, further lateral excision would again be favored.

Sequence and identity: Later feedback does not reveal axillary or systemic-treatment answers. Each later currentUpdate is an outside-care chart event, not a result generated by an uninstalled service. New meaning under a new concept; do not transfer the old pure-DCIS FSRS history to this invasive-component decision.

- `choice.topic.breast-cancer.invasive-with-dcis-margin.lateral.v1`: temptation Carries the earlier DCIS framework forward after the definitive diagnosis changes. Ranking: It applies the pure-DCIS width requirement to an invasive carcinoma specimen despite absence of tumor on ink. When reasonable: Pure DCIS with a clinically consequential close radial margin would require a different case-specific assessment; tumor on ink would favor excision. Claims: claim.breast-cancer.invasive-margin, claim.breast-cancer.dcis-margin, claim.breast-cancer.radial-positive-margin.
- `choice.topic.breast-cancer.invasive-with-dcis-margin.completion.v1`: temptation Treats two operations and persistent sub-2-mm distance as automatic failure of conservation. Ranking: A close but ink-negative DCIS component accompanying invasive cancer is not a stand-alone indication for mastectomy. When reasonable: Diffuse residual malignant disease or unresectable positive margins would change the operation. Claims: claim.breast-cancer.invasive-margin, claim.breast-cancer.diffuse-calcifications.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "questionVariantId": "question.topic.breast-cancer.invasive-with-dcis-margin.v1",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.invasive-margin",
          "claim.breast-cancer.dcis-margin",
          "claim.breast-cancer.radial-positive-margin",
          "claim.breast-cancer.diffuse-calcifications"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.invasive-with-dcis-margin.none.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.invasive-with-dcis-margin.none.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.invasive-margin"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.invasive-with-dcis-margin.lateral.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.invasive-with-dcis-margin.lateral.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.invasive-margin",
          "claim.breast-cancer.dcis-margin",
          "claim.breast-cancer.radial-positive-margin"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.invasive-with-dcis-margin.completion.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.invasive-with-dcis-margin.completion.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.invasive-margin",
          "claim.breast-cancer.diffuse-calcifications"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.dcis-final-boundary.v1",
    "nodeId": "node.topic.breast-cancer.invasive-with-dcis-margin.v1",
    "questionVariantId": "question.topic.breast-cancer.invasive-with-dcis-margin.v1",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

### question.topic.breast-cancer.her2-neoadjuvant-sequence.v2 - revised

Concept: `concept.topic.breast-cancer.biology-treatment-sequence.v1`. Previous concept: unchanged meaning. Question/node SHA-256: `cb826b39474b1500f71acb6ca2955d22c8288671d3fb81e60fc35571403d7b56` / `2848f65a0198efe47e84831785a14cf51bd3d42ed7f7d8086bd018bbe252130d`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.her2-treatment-course.v1`; variant: `question.topic.breast-cancer.her2-neoadjuvant-sequence.v1`; node: `node.topic.breast-cancer.her2-neoadjuvant-sequence.v1`.
- Patient: Maya Ellis, 46-year-old Female. Complaint: **Breast treatment planning**.
- Presentation: {patientName}, a 46-year-old woman, brings outside biopsy and staging records to clinic. Her right breast contains a 4.3-cm invasive ductal carcinoma without diffuse skin changes. Core biopsy of a mobile right axillary node contains metastatic carcinoma. Tumor ER and PR are negative and HER2 immunostaining is 3+. Staging shows no distant metastasis.
- Current update: (none)
- Exhibit: (none)
- Task: **Which initial treatment strategy should the clinic recommend for {patientName}?**

**key shown first for review only.**

1. **Preoperative chemotherapy with HER2-directed therapy** (key) - The HER2-positive, node-positive substantial primary is an established neoadjuvant setting; systemic response can inform later treatment.
2. **Breast and axillary surgery followed by systemic therapy** - It bypasses the advantages of the established neoadjuvant strategy in this HER2-positive regional presentation.
3. **Preoperative endocrine therapy followed by breast surgery** - The reported tumor lacks hormone receptors and instead has HER2 positivity; endocrine treatment does not address this biology.

Explanation: The initial choice depends on more than whether the primary can be removed. Its HER2-positive biology and regional nodal involvement support neoadjuvant chemotherapy with HER2-directed treatment. The oncology team selects the exact regimen after medical eligibility review.

#### Current

- Case: `case.topic.breast-cancer.her2-treatment-course-r2.v2`; variant: `question.topic.breast-cancer.her2-neoadjuvant-sequence.v2`; node: `node.topic.breast-cancer.her2-neoadjuvant-sequence.v2`.
- Patient: Maya Ellis, 46-year-old Female. Complaint: **Breast treatment planning**.
- Presentation: {patientName}, a 46-year-old woman, brings outside biopsy and staging records to clinic. Her right breast contains a 4.3-cm invasive ductal carcinoma without diffuse skin changes. Core biopsy of a mobile right axillary node contains metastatic carcinoma. Tumor ER and PR are negative and HER2 immunostaining is 3+. Staging shows no distant metastasis.
- Current update: (none)
- Exhibit: (none)
- Task: **Which initial treatment sequence should be recommended for {patientName}?**

**key shown first for review only.**

1. **Chemotherapy with trastuzumab/pertuzumab, then surgery** (key) - The substantial node-positive HER2-positive tumor supports a complete combined neoadjuvant regimen before the definitive operation.
2. **Surgery, then chemotherapy with trastuzumab/pertuzumab** - It postpones the established combined systemic strategy until after resection in this node-positive substantial primary.
3. **Trastuzumab/pertuzumab, then surgery, then chemotherapy** - It defers the cytotoxic component instead of delivering the preferred combined preoperative regimen; trial exploration of chemotherapy-free blockade does not establish this as the routine choice here.

Explanation: HER2 identifies a treatment target, but it does not settle timing. With this substantial primary and proven nodal disease, chemotherapy with HER2-directed treatment before surgery provides the established neoadjuvant approach. All three plans contain HER2-directed treatment; postponing all or part of systemic therapy until after surgery loses that combined preoperative strategy.

Review response: All options now contain chemotherapy, trastuzumab/pertuzumab and surgery. The alternatives differ in grouping/timing, eliminating the key-only HER2 match and inapplicable endocrine foil. NCI explicitly supports combined systemic treatment before surgery and describes chemotherapy-free dual-blockade trial exploration; exact doses/cycles are not authored. Split the later PASS adjuvant node rather than change its text.

- Reasoning step 1: Interpret receptor status together with the substantial primary and proven regional disease.
- Reasoning step 2: Select combined preoperative systemic therapy rather than moving either the whole regimen or its chemotherapy component until after surgery.
- Closest error: Choose the surgery-first plan because all visible disease appears operable.
- Deciding observation: A 4.3-cm HER2-positive primary has biopsy-proven mobile nodal metastasis before any treatment.
- Consequence: An operability shortcut can bypass an established response-guided systemic-first pathway.
- Decision-changing counterfactual: A small node-negative primary would change the timing balance toward an appropriate surgery-first pathway.
- Deletion/context check: Regional burden and original biology are needed to prefer a neoadjuvant course; no option can be chosen by HER2 word matching because every plan includes the same targeted drugs.

Five concrete author checks:

1. Cover-the-key attack: Removed the endocrine foil. All labels contain surgery, chemotherapy and trastuzumab/pertuzumab, differing in phase and grouping rather than key-only biomarker vocabulary.
2. One stage/category: Initial sequence of the same cancer-treatment components.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted fair moderate: a real surgery-first competitor and a recognizable targeted-de-escalation sequencing error replace an inapplicable endocrine choice.
5. Defensible key boundary: A 4.3-cm HER2-positive primary has biopsy-proven mobile nodal metastasis before any treatment. Counterfactual: A small node-negative primary would change the timing balance toward an appropriate surgery-first pathway.

Sequence and identity: Standalone revised node. The PASSED later adjuvant node is isolated with its exact original wording. One revision fixes the unique HER2 label and endocrine filler without claiming a new independent PASS or adding drug doses.

- `choice.topic.breast-cancer.her2-neoadjuvant-sequence.surgery.v2`: temptation Uses resectability to favor immediate surgery despite the response-guided neoadjuvant setting. Ranking: It postpones the established combined systemic strategy until after resection in this node-positive substantial primary. When reasonable: An appropriately selected small node-negative cancer may be managed with upfront surgery. Claims: claim.breast-cancer.her2-sequence, claim.breast-cancer.r2.her2-complete-preoperative-regimen.
- `choice.topic.breast-cancer.her2-neoadjuvant-sequence.split.v2`: temptation Treats the predictive target as sufficient reason to postpone chemotherapy until after surgery. Ranking: It defers the cytotoxic component instead of delivering the preferred combined preoperative regimen; trial exploration of chemotherapy-free blockade does not establish this as the routine choice here. When reasonable: A separately reviewed de-escalation protocol or a genuine chemotherapy contraindication would require a different treatment question. Claims: claim.breast-cancer.r2.her2-complete-preoperative-regimen.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.her2-treatment-course-r2.v2",
    "questionVariantId": "question.topic.breast-cancer.her2-neoadjuvant-sequence.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.her2-sequence",
          "claim.breast-cancer.r2.her2-complete-preoperative-regimen"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.her2-neoadjuvant-sequence.combined.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.her2-neoadjuvant-sequence.combined.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.her2-sequence",
          "claim.breast-cancer.r2.her2-complete-preoperative-regimen"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.her2-neoadjuvant-sequence.surgery.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.her2-neoadjuvant-sequence.surgery.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.her2-sequence",
          "claim.breast-cancer.r2.her2-complete-preoperative-regimen"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.her2-neoadjuvant-sequence.split.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.her2-neoadjuvant-sequence.split.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.r2.her2-complete-preoperative-regimen"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.her2-treatment-course-r2.v2",
    "nodeId": "node.topic.breast-cancer.her2-neoadjuvant-sequence.v2",
    "questionVariantId": "question.topic.breast-cancer.her2-neoadjuvant-sequence.v2",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

### question.topic.breast-cancer.residual-her2-adjuvant.v1 - pass-preserved

Concept: `concept.topic.breast-cancer.residual-invasive-her2-adjuvant.v1`. Previous concept: unchanged meaning. Question/node SHA-256: `95996cee88ce8ac022bf5e19c61a8980f99a6dea515c8a36ed0a62b3281b170e` / `213e664e57c9e6f1f3c03342ade50323c27fe5085e872e9a63d336b09e63e159`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.her2-treatment-course.v1`; variant: `question.topic.breast-cancer.residual-her2-adjuvant.v1`; node: `node.topic.breast-cancer.residual-her2-adjuvant.v1`.
- Patient: Maya Ellis, 46-year-old Female. Complaint: **Breast treatment planning**.
- Presentation: {patientName}, a 46-year-old woman, brings outside biopsy and staging records to clinic. Her right breast contains a 4.3-cm invasive ductal carcinoma without diffuse skin changes. Core biopsy of a mobile right axillary node contains metastatic carcinoma. Tumor ER and PR are negative and HER2 immunostaining is 3+. Staging shows no distant metastasis.
- Current update: {patientName} undergoes breast resection and optimized axillary staging at the referring hospital. All retrieved nodes are free of carcinoma. Breast pathology shows a 6-mm invasive focus within the treated bed, plus DCIS; margins are clear. The original tumor was HER2-positive, and preoperative treatment included a taxane and trastuzumab. Recovery is uncomplicated.
- Exhibit: (none)
- Task: **Which adjuvant systemic treatment should be raised at {patientName}'s oncology review?**

**key shown first for review only.**

1. **Ado-trastuzumab emtansine** (key) - Residual invasive disease after the stated HER2-directed neoadjuvant treatment matches the indication for adjuvant T-DM1 consideration.
2. **Continuation of trastuzumab** - Continuing the same agent overlooks the residual invasive-disease reason to consider changing the adjuvant strategy.
3. **Extended adjuvant neratinib** - It is a different later adjuvant strategy, not the indicated residual-invasive response adaptation offered here.

Explanation: A small invasive focus is still residual invasive disease. That finding after taxane/trastuzumab-based therapy supports oncology consideration of ado-trastuzumab emtansine. Clear nodes and clear breast margins answer different questions; the clinic is recommending review, not administering a regimen.

#### Current

- Case: `case.topic.breast-cancer.her2-treatment-course-pass-split.v2`; variant: `question.topic.breast-cancer.residual-her2-adjuvant.v1`; node: `node.topic.breast-cancer.residual-her2-adjuvant.v1`.
- Patient: Maya Ellis, 46-year-old Female. Complaint: **Breast treatment planning**.
- Presentation: {patientName}, a 46-year-old woman, brings outside biopsy and staging records to clinic. Her right breast contains a 4.3-cm invasive ductal carcinoma without diffuse skin changes. Core biopsy of a mobile right axillary node contains metastatic carcinoma. Tumor ER and PR are negative and HER2 immunostaining is 3+. Staging shows no distant metastasis.
- Current update: {patientName} undergoes breast resection and optimized axillary staging at the referring hospital. All retrieved nodes are free of carcinoma. Breast pathology shows a 6-mm invasive focus within the treated bed, plus DCIS; margins are clear. The original tumor was HER2-positive, and preoperative treatment included a taxane and trastuzumab. Recovery is uncomplicated.
- Exhibit: (none)
- Task: **Which adjuvant systemic treatment should be raised at {patientName}'s oncology review?**

**key shown first for review only.**

1. **Ado-trastuzumab emtansine** (key) - Residual invasive disease after the stated HER2-directed neoadjuvant treatment matches the indication for adjuvant T-DM1 consideration.
2. **Continuation of trastuzumab** - Continuing the same agent overlooks the residual invasive-disease reason to consider changing the adjuvant strategy.
3. **Extended adjuvant neratinib** - It is a different later adjuvant strategy, not the indicated residual-invasive response adaptation offered here.

Explanation: A small invasive focus is still residual invasive disease. That finding after taxane/trastuzumab-based therapy supports oncology consideration of ado-trastuzumab emtansine. Clear nodes and clear breast margins answer different questions; the clinic is recommending review, not administering a regimen.

Review response: Preserve exact PASS wording and payload despite optional suggestions. A mixed-case split is authorized by the manager; header/patient fields and the entire reviewed target node/question remain unchanged. Split-envelope composition is separately reported, not a new clinical approval.

**Exact PASS payload preserved.** The following is the original author reasoning, not a new independent assessment. Its optional editorial suggestions remain notes, not silent wording changes.

- Reasoning step 1: Separate residual invasive carcinoma from DCIS-only persistence and nodal clearance.
- Reasoning step 2: Apply the post-neoadjuvant residual-invasive HER2 indication to adjuvant planning.
- Closest error: Continue trastuzumab because the remaining invasive focus is small and the nodes are clear.
- Deciding observation: A documented invasive focus remains after taxane/trastuzumab-based treatment.
- Consequence: Calling this a complete invasive response can miss a supported response-adapted adjuvant option.
- Decision-changing counterfactual: If the bed contained DCIS only with no residual invasive disease anywhere, this T-DM1 indication would not be established.
- Deletion/context check: Residual histologic type and prior drugs are indispensable; surgery size and imaging appearance would not establish the indication.

Five concrete author checks:

1. Cover-the-key attack: Every choice is a named HER2-directed systemic agent. No unique 'residual disease' phrase appears in the key label; rationale and eligibility cautions are post-answer.
2. One stage/category: Adjuvant systemic agent for oncology consideration.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted moderate/hard: separates local clearance, nodal response and invasive treatment response.
5. Defensible key boundary: A documented invasive focus remains after taxane/trastuzumab-based treatment. Counterfactual: If the bed contained DCIS only with no residual invasive disease anywhere, this T-DM1 indication would not be established.

Sequence and identity: Prior feedback does not mention T-DM1. The new pathology, not the earlier response scan, drives this decision. New gap identity with exact original HER2 biology and prior treatment retained; no dosing or duration added.

- `choice.topic.breast-cancer.residual-her2-adjuvant.trastuzumab.v1`: temptation Treats a small residual focus and negative axilla as equivalent to complete invasive response. Ranking: Continuing the same agent overlooks the residual invasive-disease reason to consider changing the adjuvant strategy. When reasonable: With complete invasive response, continuing an appropriate trastuzumab-based course could be reasonable. Claims: claim.breast-cancer.residual-her2.
- `choice.topic.breast-cancer.residual-her2-adjuvant.neratinib.v1`: temptation Selects another HER2-directed drug without matching its clinical phase. Ranking: It is a different later adjuvant strategy, not the indicated residual-invasive response adaptation offered here. When reasonable: Selected patients after completing trastuzumab-based adjuvant therapy may discuss extended treatment in a different setting. Claims: claim.breast-cancer.residual-her2, claim.breast-cancer.extended-neratinib-phase.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.her2-treatment-course-pass-split.v2",
    "questionVariantId": "question.topic.breast-cancer.residual-her2-adjuvant.v1",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.residual-her2",
          "claim.breast-cancer.extended-neratinib-phase"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.residual-her2-adjuvant.tdm1.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.residual-her2-adjuvant.tdm1.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.residual-her2"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.residual-her2-adjuvant.trastuzumab.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.residual-her2-adjuvant.trastuzumab.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.residual-her2"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.residual-her2-adjuvant.neratinib.v1].label",
          "answerChoices[id=choice.topic.breast-cancer.residual-her2-adjuvant.neratinib.v1].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.residual-her2",
          "claim.breast-cancer.extended-neratinib-phase"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.her2-treatment-course-pass-split.v2",
    "nodeId": "node.topic.breast-cancer.residual-her2-adjuvant.v1",
    "questionVariantId": "question.topic.breast-cancer.residual-her2-adjuvant.v1",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

### question.topic.breast-cancer.upfront-one-positive-no-alnd.v2 - revised

Concept: `concept.topic.breast-cancer.upfront-limited-sentinel-burden.v2`. Previous concept: concept.topic.breast-cancer.upfront-limited-sentinel-burden.v1. Question/node SHA-256: `4668488fd1c4e2c0d4d0a4a322c3fbbc200da3c1d1bf3d4d0af9a3ef8dcc8e93` / `94761a6b3c4d3e7935d41925ddfa9d10241a8ae6c4429700af7c103136881a49`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.upfront-positive-sentinel.v1`; variant: `question.topic.breast-cancer.upfront-one-positive-no-alnd.v1`; node: `node.topic.breast-cancer.upfront-one-positive-no-alnd.v1`.
- Patient: Nora Blake, 58-year-old Female. Complaint: **Axillary surgery review**.
- Presentation: {patientName}, a 58-year-old woman, attends clinic after left lumpectomy and sentinel-node biopsy performed as her first cancer treatment. The primary is a 2.4-cm invasive carcinoma with clear margins. Before surgery the axilla was not palpable. One of three sentinel nodes contains a 4-mm metastasis; there are no matted nodes or gross extranodal extension. Whole-breast radiation and systemic therapy are planned.
- Current update: (none)
- Exhibit: (none)
- Task: **Which further axillary operation should be recommended for {patientName}?**

**key shown first for review only.**

1. **No completion axillary operation** (key) - The supplied upfront BCS, clinically negative axilla, limited sentinel burden and planned radiation fit the omission population.
2. **Completion level I–II axillary dissection** - A sentinel macrometastasis does not automatically require dissection in this selected upfront conservation setting.
3. **Repeat sentinel-node mapping and excision** - The initial operation already establishes limited sentinel involvement; repeating mapping is not the required response to a positive sampled node.

Explanation: Interpret the positive node in its treatment context. This is upfront surgery with breast conservation, limited sentinel involvement and planned whole-breast radiation. Completion axillary dissection need not follow automatically.

#### Current

- Case: `case.topic.breast-cancer.upfront-positive-sentinel-r2.v2`; variant: `question.topic.breast-cancer.upfront-one-positive-no-alnd.v2`; node: `node.topic.breast-cancer.upfront-one-positive-no-alnd.v2`.
- Patient: Nora Blake, 58-year-old Female. Complaint: **Axillary surgery review**.
- Presentation: {patientName}, a 58-year-old woman, attends clinic after left lumpectomy and sentinel-node biopsy as her first cancer treatment. The 2.4-cm invasive carcinoma has clear margins. No axillary lymph nodes were palpable before surgery. One of three sentinel nodes contains a 4-mm metastasis, with no matted nodes or gross extranodal extension. Systemic therapy is planned. She asks to minimize treatment morbidity while maintaining appropriate breast and regional control.
- Current update: (none)
- Exhibit: (none)
- Task: **Which locoregional plan should be recommended for {patientName}?**

**key shown first for review only.**

1. **Whole-breast irradiation with no completion axillary operation** (key) - The upfront conservation, limited sentinel burden and whole-breast treatment pathway support omission of completion dissection.
2. **Whole-breast irradiation after completion axillary dissection** - It applies an automatic dissection rule despite the eligible limited-burden upfront conservation setting.
3. **Partial-breast irradiation with no completion axillary operation** - It substitutes a partial-breast-only plan despite pathologically positive nodes, outside routine APBI eligibility.

Explanation: The nodal result does not mandate completion dissection in this eligible upfront conservation pathway. It also does not make every less-intensive radiation plan interchangeable: whole-breast treatment supports this omission setting, while positive nodes exclude routine partial-breast-only treatment. Regional nodal field details remain a separate radiation-oncology assessment.

Review response: Corrected the palpable-node wording. Replaced repeated mapping with an actual partial-breast versus whole-breast completion policy alongside dissection. Nodal positivity now matters to both de-escalation boundaries. The third policy has direct APBI eligibility support; exact radiation fields are not invented. A new concept version records the materially broader radiation-eligibility objective.

- Reasoning step 1: Interpret one macrometastatic sentinel node within an upfront clinically node-negative conservation population.
- Reasoning step 2: Choose a radiation-supported omission plan rather than add dissection or incorrectly combine omission with partial-breast-only treatment.
- Closest error: Infer that if axillary dissection can be omitted, partial-breast irradiation can also replace whole-breast treatment.
- Deciding observation: Pathologically positive sentinel tissue coexists with otherwise eligible upfront conservation criteria.
- Consequence: Combining unrelated de-escalation rules can place the patient outside the supporting treatment population.
- Decision-changing counterfactual: If the nodes were pathologically negative and the other APBI criteria were met, partial-breast treatment could become a reasonable plan.
- Deletion/context check: Removing nodal positivity changes both the surgical interpretation and partial-breast eligibility. The radiation comparison is no longer pre-decided by a declared plan.

Five concrete author checks:

1. Cover-the-key attack: Corrected palpable-node anatomy. Three actual locoregional courses replace repeat sentinel staging; components recur across options and none is a uniquely cautious omnibus plan.
2. One stage/category: Locoregional completion treatment after upfront lumpectomy.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted moderate/hard: distinguishes two interacting but noninterchangeable de-escalation decisions.
5. Defensible key boundary: Pathologically positive sentinel tissue coexists with otherwise eligible upfront conservation criteria. Counterfactual: If the nodes were pathologically negative and the other APBI criteria were met, partial-breast treatment could become a reasonable plan.

Sequence and identity: Standalone, with no preceding postoperative-NST explanation to supply the boundary. One revision removes the filler and fixes clarity. Explicit new concept version preserves the prior narrower axillary-surgery history because radiation-eligibility interpretation is now scored.

- `choice.topic.breast-cancer.upfront-one-positive-no-alnd.dissection.v2`: temptation Treats every sentinel macrometastasis as a completion-dissection indication. Ranking: It applies an automatic dissection rule despite the eligible limited-burden upfront conservation setting. When reasonable: Heavier nodal burden or post-NST residual metastasis can change the surgical indication. Claims: claim.breast-cancer.upfront-limited-nodes, claim.breast-cancer.nst-residual-nodes.
- `choice.topic.breast-cancer.upfront-one-positive-no-alnd.partial.v2`: temptation Combines two attractive de-escalations as if omission of dissection proved partial-breast eligibility. Ranking: It substitutes a partial-breast-only plan despite pathologically positive nodes, outside routine APBI eligibility. When reasonable: An otherwise suitable node-negative patient may be a partial-breast candidate after separate assessment. Claims: claim.breast-cancer.r2.partial-breast-node-positive.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.upfront-positive-sentinel-r2.v2",
    "questionVariantId": "question.topic.breast-cancer.upfront-one-positive-no-alnd.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.upfront-limited-nodes",
          "claim.breast-cancer.r2.partial-breast-node-positive",
          "claim.breast-cancer.r2.regional-treatment-morbidity",
          "claim.breast-cancer.nst-residual-nodes"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.upfront-one-positive-no-alnd.whole.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.upfront-one-positive-no-alnd.whole.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.upfront-limited-nodes",
          "claim.breast-cancer.r2.regional-treatment-morbidity"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.upfront-one-positive-no-alnd.dissection.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.upfront-one-positive-no-alnd.dissection.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.upfront-limited-nodes",
          "claim.breast-cancer.nst-residual-nodes"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.upfront-one-positive-no-alnd.partial.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.upfront-one-positive-no-alnd.partial.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.r2.partial-breast-node-positive"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.upfront-positive-sentinel-r2.v2",
    "nodeId": "node.topic.breast-cancer.upfront-one-positive-no-alnd.v2",
    "questionVariantId": "question.topic.breast-cancer.upfront-one-positive-no-alnd.v2",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

### question.topic.breast-cancer.post-nst-micrometastasis-alnd.v2 - revised

Concept: `concept.topic.breast-cancer.post-nst-residual-axillary-disease.v1`. Previous concept: unchanged meaning. Question/node SHA-256: `bab2fe1ba18f59370d4f0f84788d51f052f098b114f60028afbef5055963fe31` / `b93376850af6c806d33c33d5be6200d307ef4edf3eeb2a83c93174a788177461`.

#### Before (exact reviewed v1)

- Case: `case.topic.breast-cancer.post-nst-positive-sentinel.v1`; variant: `question.topic.breast-cancer.post-nst-micrometastasis-alnd.v1`; node: `node.topic.breast-cancer.post-nst-micrometastasis-alnd.v1`.
- Patient: Sofia Reed, 51-year-old Female. Complaint: **Post-treatment nodal review**.
- Presentation: {patientName}, a 51-year-old woman, brings outside operative records to clinic after neoadjuvant chemotherapy for noninflammatory left breast cancer. The initially mobile positive axillary node was clipped. At surgery, dual-tracer mapping retrieved the clipped node and three sentinel nodes. The clipped node contains a 0.9-mm carcinoma deposit; the other nodes are negative. The axilla is no longer palpable and postoperative regional radiation is planned.
- Current update: (none)
- Exhibit: (none)
- Task: **Which further axillary treatment should be recommended for {patientName} under current standard guidance?**

**key shown first for review only.**

1. **Completion axillary dissection with planned radiation** (key) - The sampled residual deposit is micrometastatic disease after NST, for which current guidance retains completion ALND.
2. **Regional nodal radiation without completion dissection** - Upfront de-escalation evidence does not automatically replace ALND for post-NST residual micro- or macrometastasis.
3. **Repeat targeted sentinel surgery before radiation** - Representative sampling has already found residual disease; repeating staging does not remove the established treatment indication.

Explanation: A residual small metastasis after NST has a different management boundary from a positive sentinel node at upfront lumpectomy. The adequate targeted sample contains residual micrometastatic carcinoma. Planned nodal radiation is not, by itself, current proof that completion dissection can be omitted in this setting.

#### Current

- Case: `case.topic.breast-cancer.post-nst-positive-sentinel-r2.v2`; variant: `question.topic.breast-cancer.post-nst-micrometastasis-alnd.v2`; node: `node.topic.breast-cancer.post-nst-micrometastasis-alnd.v2`.
- Patient: Sofia Reed, 51-year-old Female. Complaint: **Post-treatment nodal review**.
- Presentation: {patientName}, a 51-year-old woman, brings outside operative records to clinic after neoadjuvant chemotherapy for noninflammatory left breast cancer and subsequent lumpectomy. The initially mobile positive axillary node was clipped. Dual-tracer mapping retrieved that clipped node and three sentinel nodes. The clipped node contains a 0.9-mm carcinoma deposit; the others are negative. No axillary lymph nodes are now palpable. Whole-breast irradiation is planned; the additional axillary treatment remains under discussion.
- Current update: (none)
- Exhibit: (none)
- Task: **Which additional axillary treatment should be recommended for {patientName}?**

**key shown first for review only.**

1. **Completion level I-II axillary dissection** (key) - Residual micrometastasis after NST is a positive indication for completion ALND in the February 2026 ASBrS guide; adequate retrieval establishes the residual finding rather than eliminating its treatment implication.
2. **Axillary and regional nodal irradiation** - It replaces the currently recommended completion operation with a radiation alternative whose equivalence in this post-NST residual setting is not established by the retrieved guide.
3. **No additional axillary treatment** - It carries the upfront conservation omission rule across to documented residual disease after NST.

Explanation: The 0.9-mm focus is residual micrometastatic disease after systemic treatment, not a pathologically negative axilla. The February 2026 ASBrS guide identifies this as an indication for completion ALND. Planned breast irradiation and the small residual burden do not transfer the patient into the upfront-surgery omission population. Radiation-field planning follows the multidisciplinary regional plan.

Review response: Corrected palpability to axillary nodes, kept the measured deposit and adequate retrieval, and replaced repeat staging with no additional axillary treatment. Shared whole-breast care stays in context. Completion dissection, nodal radiation, and no additional regional therapy are real policies with different applicable populations. The positive residual-micrometastasis indication was rechecked in the February 2026 ASBrS guide; Melissa review remains pending.

- Reasoning step 1: Interpret the measured deposit as residual micrometastasis despite successful retrieval and a reassuring examination.
- Reasoning step 2: Apply the post-NST residual-node indication rather than either upfront-surgery radiation substitution or omission.
- Closest error: Replace dissection with axillary radiation because the deposit is small and was removed in a mapped node.
- Deciding observation: The 0.9-mm metastasis remains after neoadjuvant therapy, not at an upfront conservation operation.
- Consequence: Cross-population extrapolation can omit the regional operation recommended for residual disease.
- Decision-changing counterfactual: The analogous limited sentinel finding at upfront conservation could support no completion operation; an adequate ypN0 result after NST also changes the decision.
- Deletion/context check: Both measured burden and treatment chronology matter. Palpation is corrected to nodes and cannot overrule the positive specimen.

Five concrete author checks:

1. Cover-the-key attack: Three real axillary treatment policies replace repeated completed staging. Shared whole-breast treatment stays outside options, so the key is not uniquely comprehensive or uniquely linked to radiation wording.
2. One stage/category: Additional regional treatment after pathological post-NST staging.
3. Two consequential inferences: the explicit steps above.
4. Qualitative predicted difficulty: Predicted hard: the strongest error is a plausible radiation-based de-escalation supported in a different phase.
5. Defensible key boundary: The 0.9-mm metastasis remains after neoadjuvant therapy, not at an upfront conservation operation. Counterfactual: The analogous limited sentinel finding at upfront conservation could support no completion operation; an adequate ypN0 result after NST also changes the decision.

Sequence and identity: Standalone revised case; no prior feedback supplies the boundary. Its dated source check is recorded separately from clinician approval. One revision fixes anatomy, replaces the staging filler and positively states the sourced residual-micrometastasis indication; clinical review remains pending.

- `choice.topic.breast-cancer.post-nst-micrometastasis-alnd.radiation.v2`: temptation Transfers an upfront axillary-radiation alternative to a residual post-treatment positive node. Ranking: It replaces the currently recommended completion operation with a radiation alternative whose equivalence in this post-NST residual setting is not established by the retrieved guide. When reasonable: An eligible upfront-surgery patient with limited sentinel involvement can have a different regional-radiation pathway. Claims: claim.breast-cancer.nst-residual-nodes, claim.breast-cancer.upfront-limited-nodes.
- `choice.topic.breast-cancer.post-nst-micrometastasis-alnd.none.v2`: temptation Treats a small deposit plus normal palpation as sufficient for the upfront limited-node omission pathway. Ranking: It carries the upfront conservation omission rule across to documented residual disease after NST. When reasonable: The comparable limited positive-sentinel finding at upfront conservation with appropriate radiation can permit no further axillary operation. Claims: claim.breast-cancer.nst-residual-nodes, claim.breast-cancer.upfront-limited-nodes, claim.breast-cancer.nodal-deposit-size.

Exact field/choice evidence mapping and timing proposal:

```json
{
  "statementMapping": {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.breast-cancer.post-nst-positive-sentinel-r2.v2",
    "questionVariantId": "question.topic.breast-cancer.post-nst-micrometastasis-alnd.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fixed fictional observations. No new empirical frequencies, medication rules or clinical thresholds."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "objective",
          "presentation.relationships",
          "currentUpdate.relationships",
          "explanation",
          "reasoning"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.nst-residual-nodes",
          "claim.breast-cancer.upfront-limited-nodes",
          "claim.breast-cancer.nodal-deposit-size"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.post-nst-micrometastasis-alnd.alnd.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.post-nst-micrometastasis-alnd.alnd.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.nst-residual-nodes",
          "claim.breast-cancer.nodal-deposit-size"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.post-nst-micrometastasis-alnd.radiation.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.post-nst-micrometastasis-alnd.radiation.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.nst-residual-nodes",
          "claim.breast-cancer.upfront-limited-nodes"
        ]
      },
      {
        "fields": [
          "answerChoices[id=choice.topic.breast-cancer.post-nst-micrometastasis-alnd.none.v2].label",
          "answerChoices[id=choice.topic.breast-cancer.post-nst-micrometastasis-alnd.none.v2].rationale"
        ],
        "evidenceClaimIds": [
          "claim.breast-cancer.nst-residual-nodes",
          "claim.breast-cancer.upfront-limited-nodes",
          "claim.breast-cancer.nodal-deposit-size"
        ]
      }
    ]
  },
  "timing": {
    "caseId": "case.topic.breast-cancer.post-nst-positive-sentinel-r2.v2",
    "nodeId": "node.topic.breast-cancer.post-nst-micrometastasis-alnd.v2",
    "questionVariantId": "question.topic.breast-cancer.post-nst-micrometastasis-alnd.v2",
    "classification": {
      "kind": "no_test"
    }
  }
}
```

## Parked revision attempts

Every returned item received one documented revision attempt. These seven attempts did not establish both the required fairness and meaningful difficulty from supported facts. They have **no current question variant, no scored key and no active preview node**. A claim that an item is important is not an accepted basic exception.

### question.topic.breast-cancer.mastectomy-no-rni-alnd.v1 - parked

Attempt: Removed the redundant no-NST sentence and tried a regional-plan set: completion ALND, regional reirradiation, or no further regional treatment.

Unresolved issue: The specialist's actual reirradiation exclusion makes that third plan inapplicable; repeating mapping or limited arbitrary sampling remains filler. A fair difficult three-choice comparison was not established without changing the clinical premise or inventing another acceptable procedure.

Next action: Retain the legitimate binary teaching boundary as an unkeyed authoring gap; obtain a source-supported third policy or a specifically accepted foundational format before authoring again.

Evidence claims: claim.breast-cancer.mastectomy-rni. Review status remains needs_clinician_review; no failed attempt is repackaged as PASS.

### question.topic.breast-cancer.initial-cno-response-slnb.v1 - parked

Attempt: Removed the unused breast marker and tried a failed-mapping/result-adequacy follow-up instead of the simple normal-examination staging choice.

Unresolved issue: The supplied facts still do not establish a concrete acquisition failure. Adding one would require a verified next-action criterion distinguishing remapping, completion dissection and acceptance; the current source supports optimized technique but not the invented failure workflow. The original remains easy recall without an accepted basic exception.

Next action: Keep the cN0 staging gap visible; do not emit a keyed invented failure-management item.

Evidence claims: claim.breast-cancer.nst-initial-cno, claim.breast-cancer.nst-negative-staging, claim.breast-cancer.high-burden-axilla. Review status remains needs_clinician_review; no failed attempt is repackaged as PASS.

### question.topic.breast-cancer.skin-versus-parenchymal-tissue.v1 - parked

Attempt: Replaced the named unsampled target with a proposed needle-path/specimen record and replaced aspiration with repeat core, open incisional sampling and additional skin punches.

Unresolved issue: That attempt duplicates the already preserved breast-core-discordance objective, while the supplied evidence does not establish a uniquely ranked repeat-core versus incisional plan in a genuinely difficult new case. Simply hiding the compartment or removing the fluid negative would reduce fairness rather than add inference.

Next action: Preserve the exact inflammatory treatment-sequence PASS separately. Revisit diagnostic expansion only with supported acquisition data and three credible tissue plans.

Evidence claims: claim.breast-cancer.ibc-tissue. Review status remains needs_clinician_review; no failed attempt is repackaged as PASS.

### question.topic.breast-cancer.nipple-representative-skin.v1 - parked

Attempt: Tried comparing superficial, punch and wedge specimens with different represented tissues instead of announcing missing epidermis.

Unresolved issue: No supported observation fairly ranks adequate punch against wedge, and an obviously epidermis-free sample recreates the same one-step compartment match. A harder adequate-sample/extent decision was not established without new clinical criteria.

Next action: Keep the Paget biopsy gap unkeyed rather than claim a new basic acceptance or fabricate a preferred biopsy technique.

Evidence claims: claim.breast-cancer.paget-biopsy. Review status remains needs_clinician_review; no failed attempt is repackaged as PASS.

### question.topic.breast-cancer.verify-mri-focus.v1 - parked

Attempt: Replaced the feasibility/missing-biopsy sentences with the proposed resection geometry and tried same-stage second-look imaging, additional-target biopsy and primary-target reassessment.

Unresolved issue: The primary has no actual adequacy problem; repeating it is still filler. Distinguishing second-look imaging from image-guided biopsy needs an actual supported acquisition/visibility record. The attempted rewrite did not establish that prerequisite fairly.

Next action: Split the exact benign-sample-discordance PASS into a self-contained case. Commission a distinct supported imaging-acquisition dilemma rather than reuse its target-provenance answer.

Evidence claims: claim.breast-cancer.verify-additional-focus. Review status remains needs_clinician_review; no failed attempt is repackaged as PASS.

### question.topic.breast-cancer.map-nonenhancing-field.v1 - parked

Attempt: Added a proposed pretreatment calcification map and compared residual-field sampling, current-enhancement sampling and direct image-localized excision.

Unresolved issue: If the field was already known malignant, the added biopsy need is not established; if not characterized, the exact post-NST sampling-to-resection implication still requires clinician confirmation. Negative selected cores must not be invented as permission to leave a suspicious field.

Next action: Park this workflow. The separate revised operation case starts with already acquired mapped malignant tissue and does not imply an unverified diagnostic algorithm.

Evidence claims: claim.breast-cancer.response-localization, claim.breast-cancer.verify-additional-focus. Review status remains needs_clinician_review; no failed attempt is repackaged as PASS.

### question.topic.breast-cancer.converted-node-targeted-staging.v1 - parked

Attempt: Removed the critique-style without label and tried a mapping-adequacy version with negative sentinel specimens but an unretrieved original clip.

Unresolved issue: The current ASBrS guide allows adequate staging in selected patients with three or more negative sentinel nodes even without clip retrieval. A missing clip is therefore not a universal dissection/retrieval trigger. Changing the count or inventing an immediate rescue sequence would not establish a uniquely ranked action from the supplied facts.

Next action: Preserve the exact later residual-HER2 PASS independently. Ask for an explicitly supported technical retrieval/failure scenario before another keyed staging-adequacy draft.

Evidence claims: claim.breast-cancer.nst-negative-staging, claim.breast-cancer.r2.clip-retrieval-not-universal. Review status remains needs_clinician_review; no failed attempt is repackaged as PASS.

## Ranked coverage and remaining gaps

The original 13-family research ranking is retained in JSON with exact inventory mappings. Current review disposition now controls what it proposes for supply:

| Ranked family | Active proposal/status | Remaining boundary |
|---|---|---|
| 1. Axillary surgery depends on initial burden, treatment phase and radiation | parked: question.topic.breast-cancer.converted-node-targeted-staging.v1; parked: question.topic.breast-cancer.initial-cno-response-slnb.v1; pass-preserved: question.topic.breast-cancer.initial-fixed-nodes-alnd.v1; revised: question.topic.breast-cancer.upfront-one-positive-no-alnd.v2; revised: question.topic.breast-cancer.post-nst-micrometastasis-alnd.v2; revised: question.topic.breast-cancer.mastectomy-rni-omit-alnd.v2; parked: question.topic.breast-cancer.mastectomy-no-rni-alnd.v1 | Substantive invasive-cancer axillary decisions were absent; DCIS sentinel rows are not equivalent coverage. |
| 2. Final margins and the correct invasive versus pure-DCIS framework | pass-preserved: question.topic.breast-cancer.dcis-positive-shave.v1; pass-preserved: question.topic.breast-cancer.invasive-with-dcis-margin.v1 | Existing three width-recognition siblings duplicate one rule; the retained F01 final-negative boundary and new final-positive boundary are meaningful contrasts. |
| 3. Tumor biology selects sequence and residual invasive disease changes adjuvant planning | revised: question.topic.breast-cancer.her2-neoadjuvant-sequence.v2; pass-preserved: question.topic.breast-cancer.residual-her2-adjuvant.v1 | Noninflammatory subtype-driven sequencing and response-adapted adjuvant therapy were missing; the inflammatory sequence is a different construct. |
| 4. Post-NST residual field, not enhancement alone, determines local surgery | parked: question.topic.breast-cancer.map-nonenhancing-field.v1; revised: question.topic.breast-cancer.diffuse-malignant-residual.v2 | Retain B2B10/B2B24/B2B08; improve easy siblings and do not change the frozen first node to repair its rehearsed companion. |
| 5. Additional-focus verification and specimen/marker provenance | parked: question.topic.breast-cancer.verify-mri-focus.v1; pass-preserved: question.topic.breast-cancer.benign-sample-discordance.v1; pass-preserved: question.topic.breast-cancer.marker-target-reconciliation.v1 | Retain B37; use a different noninflammatory adequacy context and repair N4 marker-key disclosure. |
| 6. Inflammatory phenotype: representative tissue and systemic-first local-treatment sequence | parked: question.topic.breast-cancer.skin-versus-parenchymal-tissue.v1; pass-preserved: question.topic.breast-cancer.inflammatory-initial-sequence.v1 | Many cosmetic recognition pairs; retain exact B37/B37-context and B2B08 while consolidating repetition. |
| 7. DCIS: breast operation and credible invasion/mapping concerns determine axillary staging |  | F10 remains accepted REVISE, not basicAccepted or PASS. N4 intra-op quality park remains. A genuinely harder additional staging dilemma is not manufactured. |
| 8. Paget: represent the skin target and evaluate the underlying breast | parked: question.topic.breast-cancer.nipple-representative-skin.v1 | Representative-biopsy rewrite supplied. Two attempted extent/resection drafts were removed after cue/difficulty checks; the operation gap remains explicit. |
| 9. Current recurrent-tumor evidence versus historical primary biology | revised: question.topic.breast-cancer.current-recurrence-receptor-specimen.v2 | New coverage; no germline interpretation or evolving metastatic regimen ranking. |
| 10. Radiation after conservation and radiation-dependent surgical de-escalation | revised: question.topic.breast-cancer.mastectomy-rni-omit-alnd.v2; parked: question.topic.breast-cancer.mastectomy-no-rni-alnd.v1 | Partially covered. Universal close-margin/RT-omission rules are withheld; no exact RT regimen or delay is invented. |
| 11. Anatomic extent, regional versus distant disease and stage-to-goal distinctions | pass-preserved: question.topic.breast-cancer.initial-fixed-nodes-alnd.v1; pass-preserved: question.topic.breast-cancer.inflammatory-initial-sequence.v1 | Applied extent boundaries covered; no standalone exact TNM/prognostic staging table item authored. Third-party AJCC tables embedded in NCI were not copied or used as a corpus. |
| 12. Surveillance versus a new diagnostic question after treatment |  | Source-survey gap remains unfilled: no hard supported competing-symptom case or exact first-surveillance interval was authored. |
| 13. Reconstruction, axillary anatomy and treatment morbidity |  | Not authored. A permitted technical source and a consequential decision with credible competitors are still needed; no ICU/ED setting proposal is required. |

The parked cN0 staging, Paget diagnostic, additional-focus and post-NST sampling/technical problems remain coverage gaps. Retained historical PASS variants still supply useful existing coverage, but they are not relabelled new gap variants.

## Source verification, atomic claims and rights

[The source ledger](sources-question-topic-breast-cancer-20261111.json) now has **14 full source records and 32 atomic claims**, with active question and park mappings. Original access dates and last-check dates are retained. Two additional sources were read through permitted public routes: ASCO metastatic-biomarker guidance for preanalytic bone-tissue limitations and ASBrS APBI guidance for node-positive eligibility. ASBrS February 2026 axillary, BCS and NCI treatment statements were rechecked. No proprietary text, question bank, AJCC staging table, source prose, figure or full article is stored.

ASCO copyright is reserved. The PMC article was used only for targeted society-guideline factual verification; PMC hosting is not an open-license grant. ASBrS terms were rechecked and no source document was downloaded into this repository. The authoring applications and patient records are independently constructed. NCI facts retain attribution and links. Source authority and licensing remain separate.

- **claim.breast-cancer.r2.clip-retrieval-not-universal**: Current ASBrS guidance recognizes selected post-NST, clinically node-negative patients with initially proven nodal disease who can have acceptable sentinel staging with at least three negative sentinel nodes even when clipping or clipped-node retrieval was not performed. Limitation: Single current society resource. This does not establish a universal missing-clip rescue operation or let a normal scan replace pathology; the exact technical situation still needs clinical assessment. Last checked 2026-11-11; needs_clinician_review. [ASBrS axillary management resource guide, February 2026](https://www.breastsurgeons.org/docs/statements/asbrs-management-of-the-axilla-2026-02-24.pdf)

- **claim.breast-cancer.r2.decalcified-receptor-caution**: A negative receptor result from decalcified breast-cancer bone tissue needs preanalytic scrutiny; an available nondecalcified metastatic tumor sample can provide more suitable material for repeat predictive assays. Limitation: Decalcification does not invalidate every result. Assay validation and the actual process matter; no exact minimum tumor-cell count or processing-time threshold is invented. Last checked 2026-11-11; needs_clinician_review. [ASCO metastatic breast cancer biomarker guideline, 2015](https://pmc.ncbi.nlm.nih.gov/articles/PMC5478102/), [Tests for Breast Cancer Biomarkers — NCI](https://www.cancer.gov/types/breast/diagnosis/breast-cancer-biomarker-tests)

- **claim.breast-cancer.r2.partial-breast-node-positive**: Routine partial-breast-only irradiation is not the recommended substitute for whole-breast treatment in an invasive breast cancer with pathologically positive nodes. Limitation: Single directly verified current society source. No claim that every positive node requires ALND or regional nodal irradiation; the whole clinical population still matters. Last checked 2026-11-11; needs_clinician_review. [ASBrS accelerated partial breast irradiation resource guide, July 2025](https://www.breastsurgeons.org/docs/statements/asbrs-accelerated-partial-breast-irradiation.pdf)

- **claim.breast-cancer.r2.her2-complete-preoperative-regimen**: For substantial node-positive HER2-positive cancer selected for neoadjuvant treatment, chemotherapy is combined with HER2-directed therapy; ideally the systemic regimen is completed before surgery. Limitation: The NCI overview includes chemotherapy-free dual-blockade trial arms; their existence does not establish that splitting chemotherapy until after surgery is the preferred routine sequence. No dose or cycle count is authored. Last checked 2026-11-11; needs_clinician_review. [Breast Cancer Treatment (PDQ), health professional version — NCI](https://www.cancer.gov/types/breast/hp/breast-treatment-pdq), [ASBrS breast conserving surgery resource guide, February 2026](https://www.breastsurgeons.org/docs/statements/asbrs-breast-conserving-surgery-2026-02-24.pdf)

- **claim.breast-cancer.r2.regional-treatment-morbidity**: In selected upfront-surgery patients with limited positive sentinel nodes, a radiation-supported omission strategy avoids adding the morbidity of completion dissection to an applicable radiation plan. Limitation: Patient goals and exact radiation field matter; this is not a universal radiation-versus-surgery ranking or a post-NST residual-disease omission rule. Last checked 2026-11-11; needs_clinician_review. [ASBrS axillary management resource guide, February 2026](https://www.breastsurgeons.org/docs/statements/asbrs-management-of-the-axilla-2026-02-24.pdf), [Breast Cancer Treatment (PDQ), health professional version — NCI](https://www.cancer.gov/types/breast/hp/breast-treatment-pdq)

<details><summary>Complete source records</summary>

```json
[
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.nci-tnm-2025",
    "title": "TNM Staging for Breast Cancer — NCI",
    "completeCitation": "National Cancer Institute. TNM Staging for Breast Cancer. Posted August 6, 2025. Accessed November 11, 2026.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "National Cancer Institute"
    ],
    "publicationYear": 2025,
    "officialUrl": "https://www.cancer.gov/types/breast/stages/tnm-staging-system",
    "doi": null,
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI original explanatory text free of copyright unless otherwise marked; credited illustration excluded",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "NCI Reuse of Information policy checked 2026-11-11: https://www.cancer.gov/policies/copyright-reuse. Credit National Cancer Institute and link the original title. Original factual synthesis only; third-party graphics, AJCC reprinted staging tables and PDQ branding excluded. No source excerpts retained.",
    "authorityAssessment": "Government explanatory text, distinct from the third-party staging tables embedded in the professional PDQ. Targeted pathological nodal-deposit size definitions support interpretation of constructed 0.9-mm and 4-mm observations; no staging table is copied or adapted.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.nodal-deposit-size"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.nci-biomarkers-2025",
    "title": "Tests for Breast Cancer Biomarkers — NCI",
    "completeCitation": "National Cancer Institute. Tests for Breast Cancer Biomarkers. Posted December 2, 2025. Accessed November 11, 2026.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "National Cancer Institute"
    ],
    "publicationYear": 2025,
    "officialUrl": "https://www.cancer.gov/types/breast/diagnosis/breast-cancer-biomarker-tests",
    "doi": null,
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI text free of copyright unless otherwise marked; third-party illustration excluded",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "NCI Reuse of Information policy checked 2026-11-11: https://www.cancer.gov/policies/copyright-reuse. Credit National Cancer Institute and link the original title. Original factual synthesis only; third-party graphics, AJCC reprinted staging tables and PDQ branding excluded. No source excerpts retained.",
    "authorityAssessment": "Government biomarker overview; directly notes that recurrent disease may require new tissue testing because hormone-receptor status changes. Supports selection of current tumor tissue, not an exact advanced-cancer regimen.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.recurrent-biomarkers",
      "claim.breast-cancer.receptor-treatment-boundary",
      "claim.breast-cancer.r2.decalcified-receptor-caution"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.asbrs-axilla-2026",
    "title": "ASBrS axillary management resource guide, February 2026",
    "completeCitation": "Miller ME, AlHilli Z, Beck A; American Society of Breast Surgeons. Axillary Management for Patients With In-Situ and Invasive Breast Cancer: A Concise Overview. Resource Guide. Approved February 24, 2026.",
    "organizationOrJournal": "American Society of Breast Surgeons",
    "authors": [
      "Megan E. Miller",
      "Zahraa AlHilli",
      "Anna Beck",
      "ASBrS Critical Writing Editing and Research Committee"
    ],
    "publicationYear": 2026,
    "officialUrl": "https://www.breastsurgeons.org/docs/statements/asbrs-management-of-the-axilla-2026-02-24.pdf",
    "doi": null,
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASBrS 2026; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "ASBrS terms checked 2026-11-11 at https://www.breastsurgeons.org/about/terms. Copyright reserved; no affirmative AI/corpus license claimed. Targeted factual verification of professional-society guidance only, as permitted by the brief. No source prose, tables, figures, algorithms or downloaded source files are retained. Terms inspected contained no express AI/automated-use prohibition.",
    "authorityAssessment": "Current US society resource guide; expert synthesis, explicitly not a formal systematic guideline. Targeted sections A, B and C. Distinguishes upfront surgery, post-NST, inflammatory disease and radiation-dependent omission. Several evolving recommendations have only this adequate current source in this packet.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.dcis-axilla",
      "claim.breast-cancer.upfront-limited-nodes",
      "claim.breast-cancer.mastectomy-rni",
      "claim.breast-cancer.nst-negative-staging",
      "claim.breast-cancer.nst-residual-nodes",
      "claim.breast-cancer.nst-initial-cno",
      "claim.breast-cancer.high-burden-axilla",
      "claim.breast-cancer.ibc-sequence",
      "claim.breast-cancer.r2.clip-retrieval-not-universal",
      "claim.breast-cancer.r2.regional-treatment-morbidity"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.asbrs-bcs-2026",
    "title": "ASBrS breast conserving surgery resource guide, February 2026",
    "completeCitation": "Obeng-Gyasi S, Joseph KAP; American Society of Breast Surgeons. Breast Conserving Surgery. Resource Guide. Approved February 24, 2026.",
    "organizationOrJournal": "American Society of Breast Surgeons",
    "authors": [
      "Samilia Obeng-Gyasi",
      "Kathie-Ann P. Joseph",
      "ASBrS Critical Writing Editing and Research Committee"
    ],
    "publicationYear": 2026,
    "officialUrl": "https://www.breastsurgeons.org/docs/statements/asbrs-breast-conserving-surgery-2026-02-24.pdf",
    "doi": null,
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASBrS 2026; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "ASBrS terms checked 2026-11-11 at https://www.breastsurgeons.org/about/terms. Copyright reserved; no affirmative AI/corpus license claimed. Targeted factual verification of professional-society guidance only, as permitted by the brief. No source prose, tables, figures, algorithms or downloaded source files are retained. Terms inspected contained no express AI/automated-use prohibition.",
    "authorityAssessment": "Current US society expert resource. Targeted checks: localization, specimen imaging, post-NST distribution, diffuse malignant calcifications, inflammatory contraindication, prior radiation as relative constraint. Its reference-list errors are not treated as verified source identities.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.her2-sequence",
      "claim.breast-cancer.response-localization",
      "claim.breast-cancer.diffuse-calcifications",
      "claim.breast-cancer.specimen-target",
      "claim.breast-cancer.paget-extent",
      "claim.breast-cancer.paget-treatment",
      "claim.breast-cancer.ibc-sequence",
      "claim.breast-cancer.r2.her2-complete-preoperative-regimen"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.asbrs-margins-2024",
    "title": "ASBrS breast conservation margins resource guide, June 2024",
    "completeCitation": "Beck AC, Wilke LG; American Society of Breast Surgeons. Breast Cancer Breast Conservation Surgery Margins. Resource Guide. Approved June 26, 2024.",
    "organizationOrJournal": "American Society of Breast Surgeons",
    "authors": [
      "Anna C. Beck",
      "Lee G. Wilke",
      "ASBrS Research Committee"
    ],
    "publicationYear": 2024,
    "officialUrl": "https://www.breastsurgeons.org/docs/statements/asbrs-rg-margins.pdf",
    "doi": null,
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASBrS 2024; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "ASBrS terms checked 2026-11-11 at https://www.breastsurgeons.org/about/terms. Copyright reserved; no affirmative AI/corpus license claimed. Targeted factual verification of professional-society guidance only, as permitted by the brief. No source prose, tables, figures, algorithms or downloaded source files are retained. Terms inspected contained no express AI/automated-use prohibition.",
    "authorityAssessment": "US society resource. Targeted specimen orientation, positive radial margins, invasive cancer with DCIS and pure-DCIS rules. Does not justify an automatic decision for every negative DCIS margin below 2 mm; that teaching extension is withheld.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.dcis-margin",
      "claim.breast-cancer.radial-positive-margin",
      "claim.breast-cancer.specimen-provenance",
      "claim.breast-cancer.invasive-margin",
      "claim.breast-cancer.specimen-target"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.ontario-dcis-2024",
    "title": "Ontario Health DCIS clinical practice guideline, 2024",
    "completeCitation": "Brackstone M, Durocher-Allen L, Califaretti N, Eisen A, Knowles S, Salim A, Plexman T, Koch CA. Management of Ductal Carcinoma In Situ: An Ontario Health (Cancer Care Ontario) Clinical Practice Guideline. Current Oncology. 2024;31(12):7738-7753. doi:10.3390/curroncol31120569.",
    "organizationOrJournal": "Ontario Health (Cancer Care Ontario) / Current Oncology",
    "authors": [
      "Muriel Brackstone",
      "Lisa Durocher-Allen",
      "Nadia Califaretti",
      "Andrea Eisen",
      "Sarah Knowles",
      "Abeer Salim",
      "Taude Plexman",
      "C. Anne Koch"
    ],
    "publicationYear": 2024,
    "officialUrl": "https://www.mdpi.com/1718-7729/31/12/569",
    "doi": "10.3390/curroncol31120569",
    "sourceClass": "peer_reviewed_guideline",
    "licenseLabel": "CC BY 4.0, copyright 2024 the authors",
    "reuseStatus": "cc_by_4_0",
    "reuseNotes": "Article-level CC BY 4.0 and MDPI terms of use checked 2026-11-11. Attribute Brackstone et al., title, journal and DOI. Independent short factual synthesis; no reproduced or adapted source expression/figures/tables. PMC access returned a browser challenge; the openly accessible publisher article was used without bypassing it.",
    "authorityAssessment": "Independent Ontario guideline developed with systematic evidence review and GRADE. Recommendations 2-5 support margin and radiation decisions. Very-low-certainty comparisons and individualized close-margin management are retained as limitations.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.dcis-margin",
      "claim.breast-cancer.radial-positive-margin"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.nci-treatment-2025",
    "title": "Breast Cancer Treatment (PDQ), health professional version — NCI",
    "completeCitation": "PDQ Adult Treatment Editorial Board. Breast Cancer Treatment (PDQ), Health Professional Version. Bethesda, MD: National Cancer Institute. Updated April 25, 2025. Accessed November 11, 2026. PMID:26389406.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "PDQ Adult Treatment Editorial Board"
    ],
    "publicationYear": 2025,
    "officialUrl": "https://www.cancer.gov/types/breast/hp/breast-treatment-pdq",
    "doi": null,
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI text free of copyright unless otherwise marked; third-party material excluded",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "NCI Reuse of Information policy checked 2026-11-11: https://www.cancer.gov/policies/copyright-reuse. Credit National Cancer Institute and link the original title. Original factual synthesis only; third-party graphics, AJCC reprinted staging tables and PDQ branding excluded. No source excerpts retained.",
    "authorityAssessment": "Government evidence summary rather than a formal practice guideline. Targeted US invasive margins, Z0011 population, subtype-directed systemic treatment, KATHERINE residual-invasive population and surveillance. Date retained as actually displayed; not described as a 2026 guideline.",
    "pmid": "26389406",
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.invasive-margin",
      "claim.breast-cancer.upfront-limited-nodes",
      "claim.breast-cancer.her2-sequence",
      "claim.breast-cancer.residual-her2",
      "claim.breast-cancer.surveillance",
      "claim.breast-cancer.extended-neratinib-phase",
      "claim.breast-cancer.r2.her2-complete-preoperative-regimen",
      "claim.breast-cancer.r2.regional-treatment-morbidity"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.nci-paget-2025",
    "title": "Paget Disease of the Breast — NCI",
    "completeCitation": "National Cancer Institute. Paget Disease of the Breast. Updated December 2, 2025. Accessed November 11, 2026.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "National Cancer Institute"
    ],
    "publicationYear": 2025,
    "officialUrl": "https://www.cancer.gov/types/breast/breast-cancer-types/paget-disease-breast",
    "doi": null,
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI text free of copyright unless otherwise marked; credited illustration excluded",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "NCI Reuse of Information policy checked 2026-11-11: https://www.cancer.gov/policies/copyright-reuse. Credit National Cancer Institute and link the original title. Original factual synthesis only; third-party graphics, AJCC reprinted staging tables and PDQ branding excluded. No source excerpts retained.",
    "authorityAssessment": "Government patient-facing summary supports separate skin diagnosis, underlying breast evaluation and treatment by underlying cancer. Does not establish every surgical-biopsy ranking; specimen-target application is additionally mapped to government assessment guidance.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.paget-biopsy",
      "claim.breast-cancer.paget-extent",
      "claim.breast-cancer.paget-treatment"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.nci-inflammatory-diagnosis-2025",
    "title": "Inflammatory Breast Cancer — NCI",
    "completeCitation": "National Cancer Institute. Inflammatory Breast Cancer. Public government information page. Accessed November 11, 2026; publication year not established from the retrieved page.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "National Cancer Institute"
    ],
    "publicationYear": null,
    "officialUrl": "https://www.cancer.gov/types/breast/breast-cancer-types/inflammatory",
    "doi": null,
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI text free of copyright unless otherwise marked",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "NCI Reuse of Information policy checked 2026-11-11: https://www.cancer.gov/policies/copyright-reuse. Credit National Cancer Institute and link the original title. Original factual synthesis only; third-party graphics, AJCC reprinted staging tables and PDQ branding excluded. No source excerpts retained.",
    "authorityAssessment": "Government overview for rapid diffuse skin presentation, tissue diagnosis, biomarker testing and distant staging. No proposed IBC scoring system, race variable or diagnostic-time cutoff is imported.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.ibc-tissue"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.nci-inflammatory-treatment",
    "title": "Inflammatory Breast Cancer Treatment — NCI",
    "completeCitation": "National Cancer Institute. Inflammatory Breast Cancer Treatment. Public government treatment page. Accessed November 11, 2026; publication year not established from the retrieved page.",
    "organizationOrJournal": "National Cancer Institute",
    "authors": [
      "National Cancer Institute"
    ],
    "publicationYear": null,
    "officialUrl": "https://www.cancer.gov/types/breast/treatment/inflammatory-breast-cancer",
    "doi": null,
    "sourceClass": "government_guidance",
    "licenseLabel": "NCI text free of copyright unless otherwise marked",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "NCI Reuse of Information policy checked 2026-11-11: https://www.cancer.gov/policies/copyright-reuse. Credit National Cancer Institute and link the original title. Original factual synthesis only; third-party graphics, AJCC reprinted staging tables and PDQ branding excluded. No source excerpts retained.",
    "authorityAssessment": "Government treatment overview supports preoperative systemic treatment, modified radical mastectomy and postoperative radiation for nonmetastatic inflammatory cancer. No reconstruction interval or drug regimen is inferred.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.ibc-sequence"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.nhs-assessment-2026",
    "title": "Clinical guidance for breast cancer screening assessment — GOV.UK",
    "completeCitation": "NHS England. Clinical guidance for breast cancer screening assessment. GOV.UK, NHS Breast Screening Programme guidance. Accessed November 11, 2026; use the displayed update history for version context.",
    "organizationOrJournal": "NHS England / GOV.UK",
    "authors": [
      "NHS England"
    ],
    "publicationYear": null,
    "officialUrl": "https://www.gov.uk/government/publications/breast-screening-clinical-guidelines-for-screening-management/clinical-guidance-for-breast-cancer-screening-assessment",
    "doi": null,
    "sourceClass": "government_guidance",
    "licenseLabel": "Open Government Licence v3.0 unless otherwise stated",
    "reuseStatus": "public_domain_conditions_apply",
    "reuseNotes": "GOV.UK footer OGL v3.0 checked. UK Crown copyright under OGL, not US public domain; schema enum is the closest existing government-content category. Attribute NHS England, link original page and OGL. Underlying facts synthesized independently; no source tables or algorithms retained.",
    "authorityAssessment": "Government screening-assessment guidance; clinical extrapolation to symptomatic or post-treatment concordance is explicitly limited. Targeted multi-focus tissue verification and imaging/pathology concordance, not a universal MRI mandate.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.verify-additional-focus",
      "claim.breast-cancer.paget-biopsy",
      "claim.breast-cancer.ibc-tissue"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.kadcyla-label-2026",
    "title": "KADCYLA prescribing information, NLM DailyMed April 2026 version",
    "completeCitation": "Genentech, Inc. KADCYLA (ado-trastuzumab emtansine), US prescribing information. NLM DailyMed set 23f3c1f4-0fc8-4804-a9e3-04cf25dd302e, version 35, effective April 1, 2026. Section 1.2. Accessed November 11, 2026.",
    "organizationOrJournal": "Genentech / FDA labeling distributed by National Library of Medicine DailyMed",
    "authors": [
      "Genentech, Inc."
    ],
    "publicationYear": 2026,
    "officialUrl": "https://dailymed.nlm.nih.gov/dailymed/fda/fdaDrugXsl.cfm?setid=23f3c1f4-0fc8-4804-a9e3-04cf25dd302e",
    "doi": null,
    "sourceClass": "government_guidance",
    "licenseLabel": "Manufacturer labeling on government service; no blanket public-domain or reproduction license assumed",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Targeted verification of the official regulatory indication only; no label prose, boxed-warning text or prescribing tables retained. Government hosting is not treated as a copyright grant. This source is a cross-check with NCI, not a new dosing authority for gameplay.",
    "authorityAssessment": "Current official US drug indication supports oncology consideration after residual invasive disease following taxane/trastuzumab-based NST. Does not establish that every patient is medically eligible or that DCIS-only residual disease qualifies.",
    "pmid": null,
    "accessedOn": "2026-11-11",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.residual-her2"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.asco-metastatic-biomarkers-2015",
    "title": "ASCO metastatic breast cancer biomarker guideline, 2015",
    "completeCitation": "Van Poznak C, Somerfield MR, Bast RC Jr, Cristofanilli M, Goetz MP, Gonzalez-Angulo AM, Hicks DG, Hill EG, Liu MC, Lucas W, Mayer IA, Mennel RG, Symmans WF, Hayes DF, Harris LN. Use of Biomarkers to Guide Decisions on Systemic Therapy for Women With Metastatic Breast Cancer: American Society of Clinical Oncology Clinical Practice Guideline. J Clin Oncol. 2015;33(24):2695-2704. doi:10.1200/JCO.2015.61.1459. PMID:26195705.",
    "organizationOrJournal": "American Society of Clinical Oncology / Journal of Clinical Oncology",
    "authors": [
      "Catherine Van Poznak",
      "Mark R. Somerfield",
      "Robert C. Bast Jr",
      "Massimo Cristofanilli",
      "Matthew P. Goetz",
      "Ana M. Gonzalez-Angulo",
      "David G. Hicks",
      "Elizabeth G. Hill",
      "Minetta C. Liu",
      "Wanda Lucas",
      "Ingrid A. Mayer",
      "Robert G. Mennel",
      "William F. Symmans",
      "Daniel F. Hayes",
      "Lyndsay N. Harris"
    ],
    "publicationYear": 2015,
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5478102/",
    "doi": "10.1200/JCO.2015.61.1459",
    "pmid": "26195705",
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASCO 2015; no reusable open license claimed",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "Article copyright and PMC copyright notice checked. Targeted professional-guideline verification of Clinical Question 1, particularly processing of bone samples; PMC access does not grant reuse rights. No source text, figures, tables or full article retained; no ASCO publisher scraping or bulk corpus ingestion.",
    "authorityAssessment": "Formal society guideline with systematic review, older but directly supports the specific preanalytic limitation and specimen-selection principle. It does not prove which new systemic regimen improves outcomes or permit disregarding any technically valid current metastatic result.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.r2.decalcified-receptor-caution"
    ]
  },
  {
    "contentVersion": "clinical.question-topic-breast-cancer.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "source.breast-cancer.asbrs-apbi-2025",
    "title": "ASBrS accelerated partial breast irradiation resource guide, July 2025",
    "completeCitation": "American Society of Breast Surgeons Critical Writing, Editing and Review Committee. Accelerated Partial Breast Irradiation. Resource Guide. Approved July 12, 2025. Accessed November 11, 2026.",
    "organizationOrJournal": "American Society of Breast Surgeons",
    "authors": [
      "ASBrS Critical Writing, Editing and Review Committee"
    ],
    "publicationYear": 2025,
    "officialUrl": "https://www.breastsurgeons.org/docs/statements/asbrs-accelerated-partial-breast-irradiation.pdf",
    "doi": null,
    "pmid": null,
    "accessedOn": "2026-11-11",
    "sourceClass": "professional_society_guideline",
    "licenseLabel": "Copyright ASBrS 2025; all rights reserved",
    "reuseStatus": "copyrighted_targeted_verification_only",
    "reuseNotes": "ASBrS terms checked 2026-11-11 at https://www.breastsurgeons.org/about/terms. Copyright reserved; no affirmative AI/corpus license claimed. Targeted factual verification of professional-society guidance only, as permitted by the brief. No source prose, tables, figures, algorithms or downloaded source files are retained. Terms inspected contained no express AI/automated-use prohibition.",
    "authorityAssessment": "Society resource guide, not a formal systematic guideline. Targeted nodal-status recommendation and discussion of ASTRO guidance: node-positive invasive cancer is outside the routine partial-breast-only recommendation. No copied selection table, exact dose or fractionation rule.",
    "usageRole": "both",
    "evidenceClaimIds": [
      "claim.breast-cancer.r2.partial-breast-node-positive"
    ]
  }
]
```

</details>

## Timing, identities and integration

All offered testing choices, including distractors, have exact ID/label timing records using existing placeholder profiles. Accepting an existing bone report is a nontesting action; assaying current or historical blocks has a pathology estimate. The treatment-plan cases introduce no new execution service, route, fixed wait or result gate. All service requests and result gates remain null. External links retain `_blank`, `noopener noreferrer` and `no-referrer`.

The two materially broader objectives use new concept versions with previous IDs. Old FSRS identities, v1 definitions, choice order/timing records, frozen saves and the original historical PASS and manager-accepted source cases remain intact.

- All active multi-node cases have exclusively original independent PASS nodes. The exact two-node DCIS case is unchanged; six revised nodes are standalone pending independent review.
- The three isolated PASS targets preserve the reviewed presentation, demographics and complete question/node payloads. Their new case envelopes and removed companion feedback require manager composition acceptance. No new independent PASS is inferred for another version.
- Seven parks have null active variant and scored key. Original round-one definitions, IDs, choice/timing records and the full reviewed snapshot remain explicitly archived; do not withdraw existing release content based on a parked replacement.
- The recurrence specimen-validity and upfront radiation-selection objectives receive new concept versions with previous IDs. No FSRS history moves to the materially broader construct.
- No shared manifest, registry, runtime, setting, save, selector or existing source file was edited.

## Owner approvals needed

- **owner.breast-cancer.negative-dcis-below-two-mm**. Exact items: question.dcis.margin-bcs-wbrt.v3, question.dcis.margin-bcs-wbrt.v3.r2. Boundary: ASBrS 2024 margin presentation is more directive for sub-2-mm pure DCIS than the individualized Ontario discussion. Both distinguish tumor on ink from a narrower negative margin. Neither makes every such patient a mastectomy case. Question: For a future pure-DCIS case with an ink-negative radial margin below 2 mm, which patient/imaging/pathology factors should make re-excision the unique key rather than radiation with a boost discussion? Do not authorize a blanket key. The retained F01 final boundary is 2 mm, so it does not depend on this disagreement.

- **owner.breast-cancer.r2-exact-clinical-review**. Exact items: question.topic.breast-cancer.initial-fixed-nodes-alnd.v1, question.topic.breast-cancer.inflammatory-initial-sequence.v1, question.topic.breast-cancer.marker-target-reconciliation.v1, question.topic.breast-cancer.benign-sample-discordance.v1, question.topic.breast-cancer.dcis-positive-shave.v1, question.topic.breast-cancer.invasive-with-dcis-margin.v1, question.topic.breast-cancer.residual-her2-adjuvant.v1, question.topic.breast-cancer.current-recurrence-receptor-specimen.v2, question.topic.breast-cancer.mastectomy-rni-omit-alnd.v2, question.topic.breast-cancer.diffuse-malignant-residual.v2, question.topic.breast-cancer.her2-neoadjuvant-sequence.v2, question.topic.breast-cancer.upfront-one-positive-no-alnd.v2, question.topic.breast-cancer.post-nst-micrometastasis-alnd.v2. Boundary: Seven preserved editorial PASS variants still need named clinical review. Six new exact v2 versions have author checks only and require independent rereview. Their profiles, claims and two new concept meanings are not clinically approved. Question: Melissa: review the exact current variants, especially ALND versus axillary irradiation for post-NST micrometastasis under the February 2026 guidance, RNI-supported postmastectomy omission, and interpreting decalcification-related assay uncertainty before calling receptor conversion.

The original N4 intraoperative DCIS quality park, the narrower-negative-DCIS margin disagreement and the other withheld extensions remain in JSON. No owner hold was silently resolved.

## Original inventory audit and frozen history

Every assigned old row remains visible below. A parked replacement creates a hold on withdrawal of its existing predecessor, not an executed retirement. Complete original before contexts, finite profiles, question objects and hashes remain in JSON `audit`, and the complete reviewed round-one packet remains in `round1Snapshot`.

| Record | Original concept / case / node / variant | Before hash and source/export | Verdict and reasons | Current replacement disposition |
|---|---|---|---|---|
| inventory.f7c8025a0c8d1c7f | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping / case.gs028b.post-neoadjuvant-breast.a-axillary-response / node.gs028b.post-neoadjuvant-breast.a-axillary-response.1 / question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v3 | 25640ea63b0663d34c8b6eacf2ac59ca6367bf920c2c71ed4a7b25270c0a05ca; packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts:98 / POST_NEoadjuvant_BREAST | **Retire-and-replace**: Retires a low-value 'assess both regions' objective by proposal only. New axillary meaning has its own concept; response-mapping history is retained. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.83973a2df6c544b7 | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping / case.gs028b.post-neoadjuvant-breast.a-no-marker / node.gs028b.post-neoadjuvant-breast.a-no-marker.1 / question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v4 | 1b79bbd143e24a6862f295c86e07cd880c8dbef3b131ea54ef1ed388cbaf477d; packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts:98 / POST_NEoadjuvant_BREAST | **Rewrite**: Preserves the response-mapping concept but replaces the no-marker principle question with multimodality evidence requiring an action. The supplied draft records the deciding observation, both inferences, each distractor error and a decision-changing counterfactual. Original source/version and all frozen histories are retained. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.fcd1fd67366500e9 | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping / case.gs028b.post-neoadjuvant-breast.a-residual-palpable / node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1 / question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1 | fefef218947d067d7448d9f326e0ef1d94d0d435b045fb267f0e3542c317e532; packages/clinical-content/src/question-bank-batch2b-20261104-data.ts:1577 / QUESTION_BANK_BATCH2B_DEFINITIONS | **Keep**: Preserve exact independent PASS: its target/specimen/baseline-response distinction has a consequential decision and credible competing interpretation. Keep every canonical/profile field and full visible context unchanged; editorial PASS does not confer clinical approval. | historical retained reference: retained exact |
| inventory.d30ef236931a083e | concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1 / case.gs028b.post-neoadjuvant-breast.b-diffuse-residual / node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1 / question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2 | 2e47886a1d1596dae3abe1324c8199ffa6778f5b2d28a9aa3ba34116f3abd3cf; packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts:1201 / QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS | **Keep**: Preserve exact independent PASS: its target/specimen/baseline-response distinction has a consequential decision and credible competing interpretation. Keep every canonical/profile field and full visible context unchanged; editorial PASS does not confer clinical approval. | historical retained reference: retained exact |
| inventory.f944e62682cabf3c | concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection / case.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation / node.gs028b.post-neoadjuvant-breast.b-oncoplastic-conservation.1 / question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v4 | aa33b2cea4f0180fdd4544b404139a0325eb9477de3ebbdce67280ccaa8381ff; packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts:98 / POST_NEoadjuvant_BREAST | **Retire-and-replace**: Replaces a preinterpreted oncoplastic-eligibility item with a new consequential construct. Old conservation concept/history remains retained. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.727ec0c610ffdfb4 | concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection / case.gs028b.post-neoadjuvant-breast.b-radiation-declined / node.gs028b.post-neoadjuvant-breast.b-radiation-declined.1 / question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v3 | c9d55f1f237f7c381cddce24886d51ce6b4383ad631f3b096c397d66edd238e6; packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts:98 / POST_NEoadjuvant_BREAST | **Rewrite**: Same conservation-selection meaning, new exact variant. The former vague prior-radiation constraint is replaced with sourced residual-field evidence; no radiation eligibility rule is invented. The supplied draft records the deciding observation, both inferences, each distractor error and a decision-changing counterfactual. Original source/version and all frozen histories are retained. | revised: question.topic.breast-cancer.diffuse-malignant-residual.v2 |
| inventory.ba9d9c448a10651e | concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection / case.gs028b.post-neoadjuvant-breast.paired-marker-residual / node.gs028b.post-neoadjuvant-breast.paired-marker-residual.2 / question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v1 | 553307948d774f3347d1e76ca2ad63844e716840bdc64f7db01f62a697a2b6fe; packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts:98 / POST_NEoadjuvant_BREAST | **Retire-and-replace**: The exact accepted B2B24 first update already establishes breast conservation; the second node simply asks the player to choose that announced plan. Manager decision explicitly recognizes the sequence limitation. Offer a separately authored later definitive-histology margin decision; preserve the frozen B2B24 header/node and do not graft the new second node into that frozen case without composition review. | pass-preserved: question.topic.breast-cancer.invasive-with-dcis-margin.v1 |
| inventory.7ee95b4c5e965b5f | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping / case.gs028b.post-neoadjuvant-breast.paired-marker-residual / node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1 / question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2 | 2ab65c9c2d1d05b873f489225bbebcddfa10dfb43108a39f0c8d3874570fbee7; packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts:4444 / QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS | **Keep**: Preserve exact independent PASS and its constructed map asset. It requires integrating residual calcification histology and spatial endpoints. Its current legacy companion already has conservation announced and is separately proposed for replacement; no shared header or PASS fields are edited. | historical retained reference: retained exact |
| inventory.238de9e452c13324 | concept.dcis.margin-bcs-wbrt / case.gs028c.dcis.a-five-mm-request / node.gs028c.dcis.a-five-mm-request.1 / question.dcis.margin-bcs-wbrt.v4 | 994e720edba00ab9e8b88b72f770c609a69f8448a1d6bbe77466770ff250557b; packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts:6 / DCIS | **Retire-and-replace**: A repeated 2-/3-mm width recognition adds little coverage beside the final-cavity PASS. The distance is already the rule in the lead-in, wider-threshold foils are weak and one-step. Consolidate future supply into the retained final-boundary PASS or the new positive-shave application without deleting any old definition. Exact v4 repeats the patient request for 5 mm in a task that already supplies 2 mm and planned irradiation; two wider-width foils and mastectomy do not create a second inference. | historical retained reference: question.dcis.margin-bcs-wbrt.v3.r3 |
| inventory.825f4a3c889c2f4b | concept.dcis.final-cavity-shave-plan.v1 / case.gs028c.dcis.a-one-mm-individualize / node.gs028c.dcis.a-one-mm-individualize.1 / question.dcis.margin-bcs-wbrt.v3.r3 | 71ab220138a8828c222c2656bf95e6cd21a7e4dffe0ba814640e08377ac8d8c5; packages/clinical-content/src/question-flags-round2-20261104-data.ts:11 / QUESTION_FLAG_ROUND2_DEFINITIONS | **Keep**: Preserve exact independent PASS: its target/specimen/baseline-response distinction has a consequential decision and credible competing interpretation. Keep every canonical/profile field and full visible context unchanged; editorial PASS does not confer clinical approval. | historical retained reference: retained exact |
| inventory.78f6485cbd42c30e | concept.dcis.margin-bcs-wbrt / case.gs028c.dcis.a-three-mm-wbrt / node.gs028c.dcis.a-three-mm-wbrt.1 / question.dcis.margin-bcs-wbrt.v2 | 3c082a23b629e8d38e478fcd5dd3400f17e8a4ab0295c341493ff586609c04dd; packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts:6 / DCIS | **Retire-and-replace**: A repeated 2-/3-mm width recognition adds little coverage beside the final-cavity PASS. The distance is already the rule in the lead-in, wider-threshold foils are weak and one-step. Consolidate future supply into the retained final-boundary PASS or the new positive-shave application without deleting any old definition. Exact v2 adds normal healing that does not change the margin decision; both numerical widening options are variations of the same error. | historical retained reference: question.dcis.margin-bcs-wbrt.v3.r3 |
| inventory.61cafc85d6c08068 | concept.dcis.margin-bcs-wbrt / case.gs028c.dcis.a-two-mm-wbrt / node.gs028c.dcis.a-two-mm-wbrt.1 / question.dcis.margin-bcs-wbrt.v1 | d84ca6d18d5b11a4528945e1f839f4a8ae50687eeeee231cfb9fdd05597e7b89; packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts:6 / DCIS | **Rewrite**: Reuses the stable DCIS margin meaning; replaces a 2-mm recall item with a final-boundary application. No existing definition is overwritten. The supplied draft records the deciding observation, both inferences, each distractor error and a decision-changing counterfactual. Original source/version and all frozen histories are retained. | pass-preserved: question.topic.breast-cancer.dcis-positive-shave.v1 |
| inventory.9b7ceba08a624bdf | concept.dcis.sentinel-node-setting / case.gs028c.dcis.b-invasion-concern / node.gs028c.dcis.b-invasion-concern.1 / question.dcis.sentinel-node-setting.v4 | 45dd17957ac694aa650f727e4d6303cc2fb42a07114d523b69445cf966da5f7a; packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts:6 / DCIS | **Retire-and-replace**: The conventional operation-dependent DCIS staging rule is important but these variants either repeat it, announce concern for invasion, or assert an unspecified future mapping compromise. Preserve the known preoperative rule and the F10 accepted fallback; do not imply a new independent basic-purpose acceptance. Exact v4 supplies a firm imaging mass and explicitly says occult invasion is concerning, so including SLNB is a supplied risk-label application rather than an independent workup inference. | historical retained reference: question.dcis.sentinel-node-setting.v3.r4 |
| inventory.4182a81f1361e947 | concept.dcis.sentinel-node-setting / case.gs028c.dcis.b-mastectomy / node.gs028c.dcis.b-mastectomy.1 / question.dcis.sentinel-node-setting.v1 | 21d38a89186860c76202755659d1bc45e4c30a17f7b9101e112d1f9056fea13c; packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts:6 / DCIS | **Retire-and-replace**: The conventional operation-dependent DCIS staging rule is important but these variants either repeat it, announce concern for invasion, or assert an unspecified future mapping compromise. Preserve the known preoperative rule and the F10 accepted fallback; do not imply a new independent basic-purpose acceptance. Exact v1 names mastectomy and removes a delayed SPIO strategy before asking for the conventional sentinel rule; the random-sampling and ALND options add little resident discrimination. | historical retained reference: question.dcis.sentinel-node-setting.v3.r4 |
| inventory.e40ab68891af5d77 | concept.dcis.sentinel-node-mastectomy.v1 / case.gs028c.dcis.b-oncoplastic-mapping / node.gs028c.dcis.b-oncoplastic-mapping.1 / question.dcis.sentinel-node-setting.v3.r4 | 90ccd903ad4c42ddd060743d0c963329b7be31ff84eee92c1be7d9a5f8461b49; packages/clinical-content/src/question-flags-round3-20261104-data.ts:1835 / QUESTION_FLAG_ROUND3_DEFINITIONS | **Keep**: Preserve the exact manager-accepted flag repair as the current fallback. Independent review 3 still calls it easy and REVISE: specimen-name decoding is not two consequential inferences. This Keep proposal preserves the accepted history, not a PASS, clinical approval, or basicAccepted exception; manager should retain its difficulty backlog. | historical retained reference: retained exact |
| inventory.d05af376875fb4c1 | concept.dcis.sentinel-node-setting / case.gs028c.dcis.b-routine-lumpectomy / node.gs028c.dcis.b-routine-lumpectomy.1 / question.dcis.sentinel-node-setting.v2 | 194225d63f28b6d2c41df30df2a36aee8a495de2cde968bb56f04dbce60b8c43; packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts:6 / DCIS | **Retire-and-replace**: The conventional operation-dependent DCIS staging rule is important but these variants either repeat it, announce concern for invasion, or assert an unspecified future mapping compromise. Preserve the known preoperative rule and the F10 accepted fallback; do not imply a new independent basic-purpose acceptance. Exact v2 announces no invasion suspicion and feasible later mapping, then offers limited random sampling and ALND beside the routine omission key; its own scope excludes those foils. | historical retained reference: question.dcis.sentinel-node-setting.v3.r4 |
| inventory.ed73af3b25279c15 | concept.inflammatory-breast-cancer.core-biopsy-confirmation / case.inflammatory-breast-cancer.diffuse-swelling / node.inflammatory-breast-cancer.diffuse-swelling.1 / question.inflammatory-breast-cancer.core-biopsy-confirmation.v2 | b10bfde6a07748a9a50c9d87b499853b5bfdf145147c020b65ec55ec97c1825f; packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts:361 / INFLAMMATORY_BREAST_CANCER_QUESTIONS | **Retire-and-replace**: The same rapid diffuse presentation, no collection and repeated core-biopsy key create cosmetic siblings. Skin-punch-alone, screening-alone and drainage foils pre-filter the answer; the later sequence repeats a supplied stage and uses implausibly incomplete treatment courses. Replace with representative-compartment and balanced-sequence drafts while preserving exact B37 PASS versions. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.df3c372c97333ac4 | concept.inflammatory-breast-cancer.neoadjuvant-sequence / case.inflammatory-breast-cancer.diffuse-swelling / node.inflammatory-breast-cancer.diffuse-swelling.2 / question.inflammatory-breast-cancer.neoadjuvant-sequence.v2 | da49c3b9395211cd74418fb145bca67ab9c3d6b6edbd237d6dea7640eed04516; packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts:361 / INFLAMMATORY_BREAST_CANCER_QUESTIONS | **Retire-and-replace**: The same rapid diffuse presentation, no collection and repeated core-biopsy key create cosmetic siblings. Skin-punch-alone, screening-alone and drainage foils pre-filter the answer; the later sequence repeats a supplied stage and uses implausibly incomplete treatment courses. Replace with representative-compartment and balanced-sequence drafts while preserving exact B37 PASS versions. | pass-preserved: question.topic.breast-cancer.inflammatory-initial-sequence.v1 |
| inventory.d986ea5fe71563a4 | concept.inflammatory-breast-cancer.core-biopsy-confirmation / case.inflammatory-breast-cancer.peau-dorange / node.inflammatory-breast-cancer.peau-dorange.1 / question.inflammatory-breast-cancer.core-biopsy-confirmation.v3 | 3d070265f9cc9b6954d33fadcdd64cf12f7f433dfd95c6806e1ac43bc44f12a3; packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts:361 / INFLAMMATORY_BREAST_CANCER_QUESTIONS | **Retire-and-replace**: The same rapid diffuse presentation, no collection and repeated core-biopsy key create cosmetic siblings. Skin-punch-alone, screening-alone and drainage foils pre-filter the answer; the later sequence repeats a supplied stage and uses implausibly incomplete treatment courses. Replace with representative-compartment and balanced-sequence drafts while preserving exact B37 PASS versions. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.e8e80be66113e2a2 | concept.inflammatory-breast-cancer.neoadjuvant-sequence / case.inflammatory-breast-cancer.peau-dorange / node.inflammatory-breast-cancer.peau-dorange.2 / question.inflammatory-breast-cancer.neoadjuvant-sequence.v3 | c23d6425c815595e13692d82fd6b5e82aa038b6e371343aaf6f899aafe0b4e47; packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts:361 / INFLAMMATORY_BREAST_CANCER_QUESTIONS | **Retire-and-replace**: The same rapid diffuse presentation, no collection and repeated core-biopsy key create cosmetic siblings. Skin-punch-alone, screening-alone and drainage foils pre-filter the answer; the later sequence repeats a supplied stage and uses implausibly incomplete treatment courses. Replace with representative-compartment and balanced-sequence drafts while preserving exact B37 PASS versions. | pass-preserved: question.topic.breast-cancer.inflammatory-initial-sequence.v1 |
| inventory.b8c1c9e3fb0b5b6e | concept.inflammatory-breast-cancer.core-biopsy-confirmation.v2 / case.inflammatory-breast-cancer.persistent-erythema / node.inflammatory-breast-cancer.persistent-erythema.1 / question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5 | 40985ac89bdb8d1685151f06df62b606a9f3dcd65d3381705275b822beece9d9; packages/clinical-content/src/question-quality-adversarial-r4-20261102-data.ts:6636 / QUESTION_QUALITY_ADVERSARIAL_R4_DEFINITIONS | **Keep**: Preserve exact independent PASS: its target/specimen/baseline-response distinction has a consequential decision and credible competing interpretation. Keep every canonical/profile field and full visible context unchanged; editorial PASS does not confer clinical approval. | historical retained reference: retained exact |
| inventory.b5be6528feac0c43 | concept.inflammatory-breast-cancer.neoadjuvant-sequence / case.inflammatory-breast-cancer.persistent-erythema / node.inflammatory-breast-cancer.persistent-erythema.2 / question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3 | 5f66d1081d5c14bd0ae8ca5e2c6b05dba84c46aada35ba1534db428efff281ca; packages/clinical-content/src/question-quality-adversarial-20261102-data.ts:10733 / QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS | **Keep**: Preserve exact independent PASS: its target/specimen/baseline-response distinction has a consequential decision and credible competing interpretation. Keep every canonical/profile field and full visible context unchanged; editorial PASS does not confer clinical approval. | historical retained reference: retained exact |
| inventory.31e1f9173768a0ac | concept.inflammatory-breast-cancer.core-biopsy-confirmation / case.inflammatory-breast-cancer.rapid-redness / node.inflammatory-breast-cancer.rapid-redness.1 / question.inflammatory-breast-cancer.core-biopsy-confirmation.v1 | 46c4d6d20725ef401c3f950a785d58483a810a4766e3a870e4a1b9a1021704fa; packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts:361 / INFLAMMATORY_BREAST_CANCER_QUESTIONS | **Rewrite**: Stable original tissue-confirmation meaning retained. Historical nonrepresentative-sampling PASS concepts remain separate and unchanged. The supplied draft records the deciding observation, both inferences, each distractor error and a decision-changing counterfactual. Original source/version and all frozen histories are retained. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.5f59f9a6b1656f40 | concept.inflammatory-breast-cancer.neoadjuvant-sequence / case.inflammatory-breast-cancer.rapid-redness / node.inflammatory-breast-cancer.rapid-redness.2 / question.inflammatory-breast-cancer.neoadjuvant-sequence.v1 | 687e970090697590d0ad43fa10f7ac0f542fd08ae8c0a369074c5368a2179ad8; packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts:361 / INFLAMMATORY_BREAST_CANCER_QUESTIONS | **Rewrite**: Same sequence concept; repairs the original set's omitted-radiation and lumpectomy caricatures without touching the frozen B37-context variant. The supplied draft records the deciding observation, both inferences, each distractor error and a decision-changing counterfactual. Original source/version and all frozen histories are retained. | pass-preserved: question.topic.breast-cancer.inflammatory-initial-sequence.v1 |
| inventory.f46060d1c53ecc0f | concept.mammary-paget.full-thickness-biopsy / case.mammary-paget.areolar-rash / node.mammary-paget.areolar-rash.1 / question.mammary-paget.full-thickness-biopsy.v3 | 8e5dc8315bb4312e42971a4e1f6229a594ab5077b327a282ccf0b54a03af7411; packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts:294 / MAMMARY_PAGET_DISEASE_QUESTIONS | **Retire-and-replace**: All four pairs repeat the same nipple stereotype and first-line imaging key. The skin-diagnosis task mixes sampling with imaging, and the later task announces that breast imaging has not occurred. Retire duplicate future supply in favor of the specimen-provenance biopsy draft; extent/operation gaps remain visible rather than padding a weak MRI question. Exact question.mammary-paget.full-thickness-biopsy.v3 asks for the skin diagnosis yet offers breast MRI, a culture and discharge cytology. The task preselects tissue diagnosis and the same full-thickness key repeats in every sibling. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.23e7034bcf47c61d | concept.mammary-paget.underlying-breast-evaluation / case.mammary-paget.areolar-rash / node.mammary-paget.areolar-rash.2 / question.mammary-paget.underlying-breast-evaluation.v3 | 40588a9b6a2ba0e5b458b3ba9d24bb14c8d82c3098275905b9039ab2e0b5e04f; packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts:294 / MAMMARY_PAGET_DISEASE_QUESTIONS | **Retire-and-replace**: All four pairs repeat the same nipple stereotype and first-line imaging key. The skin-diagnosis task mixes sampling with imaging, and the later task announces that breast imaging has not occurred. Retire duplicate future supply in favor of the specimen-provenance biopsy draft; extent/operation gaps remain visible rather than padding a weak MRI question. Exact question.mammary-paget.underlying-breast-evaluation.v3 repeats the prior gate wording that breast imaging has not yet occurred. Repeat skin biopsy and discharge cytology assess a different target from the requested underlying-breast evaluation. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.68dd2f4c3af7e4d9 | concept.mammary-paget.full-thickness-biopsy / case.mammary-paget.crusted-nipple / node.mammary-paget.crusted-nipple.1 / question.mammary-paget.full-thickness-biopsy.v1 | a3bcf23cf07f4ad3500519b0b8da3179b5a9abe91f75742bb23f01ffcd3c11a0; packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts:294 / MAMMARY_PAGET_DISEASE_QUESTIONS | **Rewrite**: Stable Paget-biopsy meaning retained. Replaces stereotyped recognition with specimen-provenance application. The supplied draft records the deciding observation, both inferences, each distractor error and a decision-changing counterfactual. Original source/version and all frozen histories are retained. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.8b47e2385064c22b | concept.mammary-paget.underlying-breast-evaluation / case.mammary-paget.crusted-nipple / node.mammary-paget.crusted-nipple.2 / question.mammary-paget.underlying-breast-evaluation.v1 | 37e43056e40186f4f73a2bd9cc1cadedd2d3e082a8f5bd1fa9c3570508eabf4c; packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts:294 / MAMMARY_PAGET_DISEASE_QUESTIONS | **Retire-and-replace**: All four pairs repeat the same nipple stereotype and first-line imaging key. The skin-diagnosis task mixes sampling with imaging, and the later task announces that breast imaging has not occurred. Retire duplicate future supply in favor of the specimen-provenance biopsy draft; extent/operation gaps remain visible rather than padding a weak MRI question. Exact question.mammary-paget.underlying-breast-evaluation.v1 repeats the prior gate wording that breast imaging has not yet occurred. Repeat skin biopsy and discharge cytology assess a different target from the requested underlying-breast evaluation. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.194edeb0578fdc98 | concept.mammary-paget.full-thickness-biopsy / case.mammary-paget.nipple-erosion / node.mammary-paget.nipple-erosion.1 / question.mammary-paget.full-thickness-biopsy.v2 | f9d6eadf2e2f474c0af80f4fcc589d938762fb1dd34ecb68012f39a3b90190f8; packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts:294 / MAMMARY_PAGET_DISEASE_QUESTIONS | **Retire-and-replace**: All four pairs repeat the same nipple stereotype and first-line imaging key. The skin-diagnosis task mixes sampling with imaging, and the later task announces that breast imaging has not occurred. Retire duplicate future supply in favor of the specimen-provenance biopsy draft; extent/operation gaps remain visible rather than padding a weak MRI question. Exact question.mammary-paget.full-thickness-biopsy.v2 asks for the skin diagnosis yet offers breast MRI, a culture and discharge cytology. The task preselects tissue diagnosis and the same full-thickness key repeats in every sibling. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.9ba51a53c221bc88 | concept.mammary-paget.underlying-breast-evaluation / case.mammary-paget.nipple-erosion / node.mammary-paget.nipple-erosion.2 / question.mammary-paget.underlying-breast-evaluation.v2 | 94ca0ffeaea9b9714e140fa878d836801b0744ebe6b140f75b6b15be898cc702; packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts:294 / MAMMARY_PAGET_DISEASE_QUESTIONS | **Retire-and-replace**: All four pairs repeat the same nipple stereotype and first-line imaging key. The skin-diagnosis task mixes sampling with imaging, and the later task announces that breast imaging has not occurred. Retire duplicate future supply in favor of the specimen-provenance biopsy draft; extent/operation gaps remain visible rather than padding a weak MRI question. Exact question.mammary-paget.underlying-breast-evaluation.v2 repeats the prior gate wording that breast imaging has not yet occurred. Repeat skin biopsy and discharge cytology assess a different target from the requested underlying-breast evaluation. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.5951ee29c7e35669 | concept.mammary-paget.full-thickness-biopsy / case.mammary-paget.scaly-nipple / node.mammary-paget.scaly-nipple.1 / question.mammary-paget.full-thickness-biopsy.v4 | bb2210007ebb515cdb14fcbab8e5d9a88588a896f8abd67f7db5c2d880715223; packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts:294 / MAMMARY_PAGET_DISEASE_QUESTIONS | **Retire-and-replace**: All four pairs repeat the same nipple stereotype and first-line imaging key. The skin-diagnosis task mixes sampling with imaging, and the later task announces that breast imaging has not occurred. Retire duplicate future supply in favor of the specimen-provenance biopsy draft; extent/operation gaps remain visible rather than padding a weak MRI question. Exact question.mammary-paget.full-thickness-biopsy.v4 asks for the skin diagnosis yet offers breast MRI, a culture and discharge cytology. The task preselects tissue diagnosis and the same full-thickness key repeats in every sibling. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.73a13f5ee0683ae5 | concept.mammary-paget.underlying-breast-evaluation / case.mammary-paget.scaly-nipple / node.mammary-paget.scaly-nipple.2 / question.mammary-paget.underlying-breast-evaluation.v4 | 7c6082381a4f57646ee9f23e7b6b6b2a1ff01c82c88c694c8ce73f9f9ad1b63d; packages/clinical-content/src/development-batch/2026-09-17/mammary-paget-disease.ts:294 / MAMMARY_PAGET_DISEASE_QUESTIONS | **Retire-and-replace**: All four pairs repeat the same nipple stereotype and first-line imaging key. The skin-diagnosis task mixes sampling with imaging, and the later task announces that breast imaging has not occurred. Retire duplicate future supply in favor of the specimen-provenance biopsy draft; extent/operation gaps remain visible rather than padding a weak MRI question. Exact question.mammary-paget.underlying-breast-evaluation.v4 repeats the prior gate wording that breast imaging has not yet occurred. Repeat skin biopsy and discharge cytology assess a different target from the requested underlying-breast evaluation. | parked: do not withdraw the current live/retained version on the strength of this parked replacement; manager must accept another adequate replacement first. |
| inventory.1f4cff1ef311195b | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping / case.gs028b.post-neoadjuvant-breast.a-residual-palpable / node.gs028b.post-neoadjuvant-breast.a-residual-palpable.1 / question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2 | f09e8161782e6fdc6d504873a8ed882197d999c8c7040b367ca76e46e5eefd00; packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts:98 / POST_NEoadjuvant_BREAST | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v2.r1 |
| inventory.3c818c683365821e | concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection / case.gs028b.post-neoadjuvant-breast.b-diffuse-residual / node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1 / question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2 | 559f5b3453f09c4aa73bbe17130724641b06fb14b75f2790f52f3ae42d767228; packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts:98 / POST_NEoadjuvant_BREAST | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2 |
| inventory.87fadb8ff2b1fa95 | concept.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection / case.gs028b.post-neoadjuvant-breast.b-diffuse-residual / node.gs028b.post-neoadjuvant-breast.b-diffuse-residual.1 / question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r1 | 1d772bd845f044397a7ec19ad4733eed69528568c00d098fc4e4a0a29eb681f3; packages/clinical-content/src/question-bank-batch2b-20261104-data.ts:1276 / QUESTION_BANK_BATCH2B_DEFINITIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.breast-cancer-after-neoadjuvant-therapy.breast-conservation-selection.v2.r2 |
| inventory.3e57ec0fd235f48f | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping / case.gs028b.post-neoadjuvant-breast.paired-marker-residual / node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1 / question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1 | ab50c717d27db96f0348bd65f86c07dfa39407989e97526c2afcf4350472e104; packages/clinical-content/src/development-batch/2026-09-29-pre-endoscopy/post-neoadjuvant-breast.ts:98 / POST_NEoadjuvant_BREAST | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2 |
| inventory.9a6153529e7d9f8d | concept.breast-cancer-after-neoadjuvant-therapy.response-mapping / case.gs028b.post-neoadjuvant-breast.paired-marker-residual / node.gs028b.post-neoadjuvant-breast.paired-marker-residual.1 / question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r1 | aa4eda414509b7e0b5307255146ce2f3fe63c80869b91eb3212b27805ba5d809; packages/clinical-content/src/question-bank-batch2b-20261104-data.ts:3635 / QUESTION_BANK_BATCH2B_DEFINITIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.breast-cancer-after-neoadjuvant-therapy.response-mapping.v1.r2 |
| inventory.661cc23c2826a8f6 | concept.dcis.margin-bcs-wbrt / case.gs028c.dcis.a-one-mm-individualize / node.gs028c.dcis.a-one-mm-individualize.1 / question.dcis.margin-bcs-wbrt.v3 | e27260f4dc799f981836aa3e06453e9ad542674850d450eefb7e4955545e003d; packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts:6 / DCIS | **Retire-and-replace**: Historical exact draft remains preserved. Its old close-margin label/review task is superseded by the exact final-cavity PASS; the general negative-sub-2-mm teaching remains a source/clinical boundary, not a new automatic key. | historical retained reference: question.dcis.margin-bcs-wbrt.v3.r3 |
| inventory.26171d7824bbfef9 | concept.dcis.margin-bcs-wbrt / case.gs028c.dcis.a-one-mm-individualize / node.gs028c.dcis.a-one-mm-individualize.1 / question.dcis.margin-bcs-wbrt.v3.r2 | 4b1d0aa99fd540c27ddc8d98e255b2f23e91f1d67f6502f26b701f726b94aa3c; packages/clinical-content/src/question-flags-20261104-data.ts:11 / QUESTION_FLAG_DEFINITIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its old close-margin label/review task is superseded by the exact final-cavity PASS; the general negative-sub-2-mm teaching remains a source/clinical boundary, not a new automatic key. | historical retained reference: question.dcis.margin-bcs-wbrt.v3.r3 |
| inventory.3cf435398d9eaf29 | concept.dcis.sentinel-node-setting / case.gs028c.dcis.b-oncoplastic-mapping / node.gs028c.dcis.b-oncoplastic-mapping.1 / question.dcis.sentinel-node-setting.v3 | 3751528fa87f274ae805d3bcb1ac34c3df71cb484710aedffc5d89da69f12360; packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/dcis.ts:6 / DCIS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.dcis.sentinel-node-setting.v3.r4 |
| inventory.962420a72809f8b6 | concept.dcis.sentinel-node-mastectomy.v1 / case.gs028c.dcis.b-oncoplastic-mapping / node.gs028c.dcis.b-oncoplastic-mapping.1 / question.dcis.sentinel-node-setting.v3.r2 | 242763f928b5e7e492c7a362e7c4cbb0fcd5673cc677586f9ea3ef3b27f50cd0; packages/clinical-content/src/question-flags-20261104-data.ts:1228 / QUESTION_FLAG_DEFINITIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.dcis.sentinel-node-setting.v3.r4 |
| inventory.e43c0d720ed294d1 | concept.dcis.sentinel-node-mastectomy.v1 / case.gs028c.dcis.b-oncoplastic-mapping / node.gs028c.dcis.b-oncoplastic-mapping.1 / question.dcis.sentinel-node-setting.v3.r3 | 21759aa540d6b3849d418d33d31b37fe87af8712c5e2d4bd788919eeac5cd99d; packages/clinical-content/src/question-flags-round2-20261104-data.ts:1954 / QUESTION_FLAG_ROUND2_DEFINITIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.dcis.sentinel-node-setting.v3.r4 |
| inventory.06c91bae8b10d514 | concept.inflammatory-breast-cancer.core-biopsy-confirmation / case.inflammatory-breast-cancer.persistent-erythema / node.inflammatory-breast-cancer.persistent-erythema.1 / question.inflammatory-breast-cancer.core-biopsy-confirmation.v4 | 1ca996bbf145d3570047c1897b93784cdb392700671714d753c6586f03ff4618; packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts:361 / INFLAMMATORY_BREAST_CANCER_QUESTIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5 |
| inventory.47de3649006952e5 | concept.inflammatory-breast-cancer.core-biopsy-confirmation / case.inflammatory-breast-cancer.persistent-erythema / node.inflammatory-breast-cancer.persistent-erythema.1 / question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r2 | e6d066cc38f9615c16f04db5c654cc14cc9a8926b7b84757741df79e7e87e424; packages/clinical-content/src/question-quality-batch1-20261102-data.ts:5500 / QUESTION_QUALITY_BATCH1_DEFINITIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5 |
| inventory.c0752947e5f5d9e2 | concept.inflammatory-breast-cancer.core-biopsy-confirmation / case.inflammatory-breast-cancer.persistent-erythema / node.inflammatory-breast-cancer.persistent-erythema.1 / question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r3 | 069a01e953c557f08db8047533ee18e3aef17013570b343c19e664e77a3c3124; packages/clinical-content/src/question-quality-adversarial-20261102-data.ts:10521 / QUESTION_QUALITY_ADVERSARIAL_DEFINITIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5 |
| inventory.719130e7f4099649 | concept.inflammatory-breast-cancer.core-biopsy-confirmation / case.inflammatory-breast-cancer.persistent-erythema / node.inflammatory-breast-cancer.persistent-erythema.1 / question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r4 | 94da8d55ad822ecd108ba16ab5aa5c27bc1f9229e6b6bc59b801a3f86660eb0b; packages/clinical-content/src/question-quality-adversarial-r3-20261102-data.ts:7326 / QUESTION_QUALITY_ADVERSARIAL_R3_DEFINITIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.inflammatory-breast-cancer.core-biopsy-confirmation.v4.r5 |
| inventory.707ff368c4c91e05 | concept.inflammatory-breast-cancer.neoadjuvant-sequence / case.inflammatory-breast-cancer.persistent-erythema / node.inflammatory-breast-cancer.persistent-erythema.2 / question.inflammatory-breast-cancer.neoadjuvant-sequence.v4 | 1f81d3f21550e5417ad42b922a56a6b74ed50689ea046f42a9dde678d3a65771; packages/clinical-content/src/development-batch/2026-09-17/inflammatory-breast-cancer.ts:361 / INFLAMMATORY_BREAST_CANCER_QUESTIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3 |
| inventory.107fcc8ab32199a8 | concept.inflammatory-breast-cancer.neoadjuvant-sequence / case.inflammatory-breast-cancer.persistent-erythema / node.inflammatory-breast-cancer.persistent-erythema.2 / question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r2 | c58297c418caa6795cc06e8e9aa91e38a05409333d99935441487f8497ccaae5; packages/clinical-content/src/question-quality-batch1-20261102-data.ts:5595 / QUESTION_QUALITY_BATCH1_DEFINITIONS | **Retire-and-replace**: Historical exact draft remains preserved. Its newer exact live sibling supplies the reviewed repair; another revival of this earlier cue pattern adds no objective. Before data and every distinct source/catalog serialization remain indexed. | historical retained reference: question.inflammatory-breast-cancer.neoadjuvant-sequence.v4.r3 |
| inventory.9e04457e3e6a62f1 | concept.dcis.sentinel-node-mastectomy.v1 / case.n4.dcis-gland-removal-and-sentinel-sequence.v1 / node.n4.dcis-gland-removal-and-sentinel-sequence.v1 / question.n4.dcis-gland-removal-and-sentinel-sequence.v1 | c05bc4dd19bc88815c0ae5802305ec5d5b60b25e8439d45ef4a662166dde411d; packages/clinical-content/src/question-new-n4-20261110.ts:40 / QUESTION_NEW_N4_CATALOG_QUESTIONS | **Retire-and-replace**: Historical exact draft remains preserved. Carry forward quality park review.n4.dcis-gland-removal-and-sentinel-sequence.v1: the axillary plan was determined before surgery, and no new intraoperative finding changes it. Consolidate only to an explicitly preoperative reviewed staging context; do not reinstate this parked intra-op version. | historical retained reference: question.dcis.sentinel-node-setting.v3.r4 |
| inventory.02be90363ef5bc68 | concept.n4r2.lumpectomy-target-marker-reconciliation / case.n4.lumpectomy-marker-identity-and-target.v1 / node.n4.lumpectomy-marker-identity-and-target.v1 / question.n4.lumpectomy-marker-identity-and-target.v1 | 30136d37fb5612e3ef4f35c4c0b9b4872a5ac794293f22f1206df95e8e4bfd19; packages/clinical-content/src/question-new-n4-round2-20261110.ts:33 / QUESTION_NEW_N4_ROUND2_QUESTIONS | **Rewrite**: Preserves the N4r2 target-reconciliation concept. The original's current-localization sentence revealed the missed target; this new exact version requires longitudinal interpretation. The supplied draft records the deciding observation, both inferences, each distractor error and a decision-changing counterfactual. Original source/version and all frozen histories are retained. | pass-preserved: question.topic.breast-cancer.marker-target-reconciliation.v1 |

## Validation

Working directory for both commands: `C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content`. Only the authorized focused test file and clinical-content typecheck were run.

`npm.cmd test -- --pool=threads src/question-topic-breast-cancer-20261111.test.ts` - exit **0**. Exact output:

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-breast-cancer-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  14 passed (14)
   Start at  17:05:04
   Duration  5.11s (transform 2.97s, setup 0ms, import 4.95s, tests 38ms, environment 0ms)

```

`npm.cmd run typecheck` - exit **1**. Exact output:

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

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

The only typecheck diagnostic is the concurrent pancreas module at `(997,48)`, where `clinicalRationale` may be undefined. There are no owned breast-cancer errors. That file remains untouched. Both owned JSON files parsed successfully: **2/2 PASS**, exit 0. Tests verify all 20 response dispositions, seven exact PASS payloads and patient fields, all archived v1 objects, absence of parked nodes, the exclusively PASS multi-part case, runtime schema/identity consistency, shuffled options, evidence mappings and timing for all testing choices. Tests confer neither independent editorial PASS on revisions nor clinical approval.

## Final handoff

```text
Topic breast-cancer, round 2
Files changed packages/clinical-content/src/question-topic-breast-cancer-20261111.ts
  packages/clinical-content/src/question-topic-breast-cancer-20261111.test.ts
  docs/research/question-topic-breast-cancer-20261111.json
  docs/research/question-topic-breast-cancer-20261111.md
  docs/research/sources-question-topic-breast-cancer-20261111.json
Counts reviewed 20: pass-preserved 7, revised 6, parked 7
Count basis Thirteen active nodes / twelve cases / thirteen concepts; eleven meanings reused from round one and two new concept versions. Original 50-row inventory audit retained separately.
Held/unkeyed Seven returned attempts parked with null active variant/key; original holds and predecessor-withdrawal holds preserved.
Research Fourteen sources / thirty-two atomic claims; two added professional-guideline sources and five new claims, with rights and authority separate.
Packet docs/research/question-topic-breast-cancer-20261111.md; matching topic JSON and sources-question-topic-breast-cancer-20261111.json.
Identity preservation Seven PASS questions/full target nodes/patient fields exact; all 20 v1 definitions retained. Three mixed PASS cases split; exact two-PASS DCIS case unchanged.
Owner approvals needed Melissa exact clinical review remains pending; six v2 revisions need independent editorial rereview and all clinical artifacts remain needs_clinician_review.
Integration Manager accepts split envelopes and current exact definitions/timings; no shared manifest/registry/runtime changes.
Validation Focused 14/14 tests PASS (exit 0); package typecheck exit 1 from unrelated pancreas topic (997,48) TS2322 only; JSON 2/2 PASS. Exact outputs above and in JSON.
Open work Manager independent rereview/composition; Melissa clinical sign-off; pancreas lane owner resolves type error. No commit/push/deploy/install/agents/external messages.
```

The bounded revision response is complete and remains local and uncommitted. No revised or parked item inherits an independent PASS.
