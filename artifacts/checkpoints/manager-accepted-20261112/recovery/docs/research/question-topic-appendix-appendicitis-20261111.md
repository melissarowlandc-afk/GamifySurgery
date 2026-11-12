# Appendix-appendicitis topic program

## Assignment

Wave 1, manager dispatch dated November 11, 2026. Topic title Appendix ? appendicitis and appendiceal lesions. Priority high because a common emergency merits its own diagnosis-to-treatment lane.

Appendicitis diagnosis, imaging, operative/nonoperative selection, complicated appendicitis and appendiceal neoplasms.

Diverticulitis belongs to colon-diverticular-lower-bleeding. A primary pregnancy or urinary-pathway decision belongs to adult-urology-gynecology.

The baseline is the live shared tree under manifest question-ship.2026-11-10.v9, with 145 acceptance rows and 1,151 cases, 1,462 nodes and 610 registered concepts. This topic has two live concepts, eight live nodes and eight retained exact variants. All 16 scoped input hashes matched the manager snapshot.

The complete filtered assignment follows. The JSON preserves every primary-topic inventory, concept, case, node and variant row, the linked drop proposal, empty supplied hold ledgers, exact review references and source hashes.

```json
{
  "topicSlug": "appendix-appendicitis",
  "wave": 1,
  "taxonomy": {
    "slug": "appendix-appendicitis",
    "title": "Appendix — appendicitis and appendiceal lesions",
    "priority": "high",
    "scopeIn": "Appendicitis diagnosis, imaging, operative/nonoperative selection, complicated appendicitis and appendiceal neoplasms.",
    "scopeOut": "Diverticulitis belongs to colon-diverticular-lower-bleeding. A primary pregnancy or urinary-pathway decision belongs to adult-urology-gynecology.",
    "priorityReason": "A common emergency merits its own narrow diagnosis-to-treatment lane.",
    "researchAgenda": [
      "Complicated appendicitis and interval decisions",
      "Appendiceal neoplasm after pathology",
      "Comparable operative and nonoperative alternatives"
    ],
    "counts": {
      "liveConcepts": 2,
      "liveNodes": 8,
      "liveCases": 8,
      "liveVariants": 8,
      "liveAcceptedNodes": 0,
      "liveOriginalNodes": 8,
      "registeredConcepts": 2,
      "registeredWithoutLiveNodes": 0,
      "drafts": 8,
      "draftVariants": 8,
      "draftConcepts": 6,
      "explicitOwnerHeldVersions": 0,
      "unassembledDraftVariants": 0,
      "unkeyedParkedSlots": 0,
      "withheldTeachingPoints": 0,
      "liveClinicalConcepts": 2
    },
    "coverageSignal": "thin",
    "coverageReason": "At most four distinct live clinical concept identities cover this scope. Variants repeat those identities.",
    "testingWeightBasis": "Owner-directed editorial estimate of general-surgery testing relevance. No exam percentages or official blueprint weights are asserted.",
    "workerLane": [
      "packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.ts",
      "packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.test.ts",
      "docs/research/question-topic-appendix-appendicitis-20261111.json",
      "docs/research/question-topic-appendix-appendicitis-20261111.md",
      "docs/research/sources-question-topic-appendix-appendicitis-20261111.json"
    ],
    "wave": 1
  },
  "baseline": {
    "programId": "question-topic-program.2026-11-11.v1",
    "programPath": "docs/research/question-topic-program-20261111.json",
    "generatedAt": "2026-11-11T15:41:40.423Z",
    "capturedAt": "2026-11-11T15:28:05.732Z",
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
    },
    "programSha256": "a1c585199633d243bc8d7e2f166916e74253b6c4a1b1eeceb09efba871baf9e4"
  },
  "inventory": [
    {
      "recordId": "inventory.aec842138ef4f218",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.stable-adult-ct",
      "caseId": "case.gs028c.appendicitis.a-atypical-older-adult",
      "nodeIds": [
        "node.gs028c.appendicitis.a-atypical-older-adult.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v2"
      ],
      "chiefComplaint": "New abdominal pain",
      "taskTextShort": "Which next imaging study best evaluates suspected appendicitis and alternative acute abdominal diagnoses in this stable adult?",
      "taskText": "Which next imaging study best evaluates suspected appendicitis and alternative acute abdominal diagnoses in this stable adult?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
        "line": 8,
        "export": "ALL_FAMILIES",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
        "claim.gs028c.appendicitis.ct-after-nondiagnostic-us"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.a-atypical-older-adult.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.7db83c6db2bc35c3",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.stable-adult-ct",
      "caseId": "case.gs028c.appendicitis.a-competing-diagnoses",
      "nodeIds": [
        "node.gs028c.appendicitis.a-competing-diagnoses.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v4"
      ],
      "chiefComplaint": "Lower abdominal pain",
      "taskTextShort": "Which next imaging study best evaluates both appendicitis and the competing acute diagnoses in this patient?",
      "taskText": "Which next imaging study best evaluates both appendicitis and the competing acute diagnoses in this patient?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
        "line": 8,
        "export": "ALL_FAMILIES",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
        "claim.gs028c.appendicitis.ct-after-nondiagnostic-us"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.a-competing-diagnoses.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.77b6a7027acff8ce",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.stable-adult-ct",
      "caseId": "case.gs028c.appendicitis.a-equivocal-exam",
      "nodeIds": [
        "node.gs028c.appendicitis.a-equivocal-exam.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v3"
      ],
      "chiefComplaint": "Pain moved right",
      "taskTextShort": "Which next imaging study should evaluate this stable adult for suspected appendicitis and competing acute diagnoses?",
      "taskText": "Which next imaging study should evaluate this stable adult for suspected appendicitis and competing acute diagnoses?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
        "line": 8,
        "export": "ALL_FAMILIES",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
        "claim.gs028c.appendicitis.ct-after-nondiagnostic-us"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.a-equivocal-exam.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.fde00f3201bc47d2",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.stable-adult-ct",
      "caseId": "case.gs028c.appendicitis.a-nondiagnostic-ultrasound",
      "nodeIds": [
        "node.gs028c.appendicitis.a-nondiagnostic-ultrasound.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v1"
      ],
      "chiefComplaint": "Right lower pain",
      "taskTextShort": "Which next imaging study should the receiving acute-care team use to evaluate this patient's suspected appendicitis?",
      "taskText": "Which next imaging study should the receiving acute-care team use to evaluate this patient's suspected appendicitis?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
        "line": 8,
        "export": "ALL_FAMILIES",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
        "claim.gs028c.appendicitis.ct-after-nondiagnostic-us"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.a-nondiagnostic-ultrasound.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.14164bfd62e37818",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.appendicolith-operative-pathway",
      "caseId": "case.gs028c.appendicitis.b-asks-for-antibiotics",
      "nodeIds": [
        "node.gs028c.appendicitis.b-asks-for-antibiotics.1"
      ],
      "variantIds": [
        "question.appendicitis.appendicolith-operative-pathway.v2"
      ],
      "chiefComplaint": "Can I avoid surgery?",
      "taskTextShort": "Which treatment plan is most appropriate for this stable adult with appendicitis and an appendicolith?",
      "taskText": "Which treatment plan is most appropriate for this stable adult with appendicitis and an appendicolith?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
        "line": 8,
        "export": "ALL_FAMILIES",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
        "claim.gs028c.appendicitis.appendicolith-risk",
        "claim.gs028c.appendicitis.appendicolith-operative-pathway"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.b-asks-for-antibiotics.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.00050117719fe89e",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.appendicolith-operative-pathway",
      "caseId": "case.gs028c.appendicitis.b-ct-confirmed-appendicolith",
      "nodeIds": [
        "node.gs028c.appendicitis.b-ct-confirmed-appendicolith.1"
      ],
      "variantIds": [
        "question.appendicitis.appendicolith-operative-pathway.v1"
      ],
      "chiefComplaint": "Appendix CT result",
      "taskTextShort": "Which appendicitis treatment recommendation best accounts for this patient's appendicolith?",
      "taskText": "Which appendicitis treatment recommendation best accounts for this patient's appendicolith?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
        "line": 8,
        "export": "ALL_FAMILIES",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
        "claim.gs028c.appendicitis.appendicolith-risk",
        "claim.gs028c.appendicitis.appendicolith-operative-pathway"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.b-ct-confirmed-appendicolith.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.46eca681a5657da1",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.appendicolith-operative-pathway",
      "caseId": "case.gs028c.appendicitis.b-no-perforation-but-stone",
      "nodeIds": [
        "node.gs028c.appendicitis.b-no-perforation-but-stone.1"
      ],
      "variantIds": [
        "question.appendicitis.appendicolith-operative-pathway.v3"
      ],
      "chiefComplaint": "Appendicitis treatment choice",
      "taskTextShort": "Which hospital treatment pathway should be recommended for this patient's appendicitis with an appendicolith?",
      "taskText": "Which hospital treatment pathway should be recommended for this patient's appendicitis with an appendicolith?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
        "line": 8,
        "export": "ALL_FAMILIES",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
        "claim.gs028c.appendicitis.appendicolith-risk",
        "claim.gs028c.appendicitis.appendicolith-operative-pathway"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.b-no-perforation-but-stone.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.c98fa6b2a1093e17",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.appendicolith-operative-pathway",
      "caseId": "case.gs028c.appendicitis.b-prior-antibiotic-preference",
      "nodeIds": [
        "node.gs028c.appendicitis.b-prior-antibiotic-preference.1"
      ],
      "variantIds": [
        "question.appendicitis.appendicolith-operative-pathway.v4"
      ],
      "chiefComplaint": "Review appendicitis plan",
      "taskTextShort": "How should this patient's appendicolith change the treatment plan for acute appendicitis?",
      "taskText": "How should this patient's appendicolith change the treatment plan for acute appendicitis?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
        "line": 8,
        "export": "ALL_FAMILIES",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts",
          "line": 8,
          "export": "ALL_FAMILIES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 1847,
          "export": "URGENT_FAMILIES",
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
        "claim.gs028c.appendicitis.appendicolith-risk",
        "claim.gs028c.appendicitis.appendicolith-operative-pathway"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.b-prior-antibiotic-preference.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.159fb8efb704d450",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.stable-adult-ct",
      "caseId": "case.gs028c.appendicitis.a-competing-diagnoses",
      "nodeIds": [
        "node.gs028c.appendicitis.a-competing-diagnoses.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v4.r1"
      ],
      "chiefComplaint": "Right lower-abdominal pain",
      "taskTextShort": "Which imaging request should be made next for {patientName}?",
      "taskText": "Which imaging request should be made next for {patientName}?",
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
        "line": 2201,
        "export": "QUESTION_BANK_BATCH2B_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
          "line": 2201,
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
        "claim.gs028c.appendicitis.ct-after-nondiagnostic-us",
        "claim.qbp2b.b2b14.application"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.a-competing-diagnoses.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.039efde9d6406671",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.ct-request-with-urinary-mimic.v1",
      "caseId": "case.gs028c.appendicitis.a-competing-diagnoses",
      "nodeIds": [
        "node.gs028c.appendicitis.a-competing-diagnoses.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v4.r2"
      ],
      "chiefComplaint": "Acute right-sided pain",
      "taskTextShort": "Which CT request should be made for {patientName}?",
      "taskText": "Which CT request should be made for {patientName}?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
        "line": 2245,
        "export": "QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
          "line": 2245,
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
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1523,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_SOURCE_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028c.appendicitis.ct-after-nondiagnostic-us",
        "claim.qbp2b.r2.b2b14.application",
        "claim.qbp2b.r2.acute-abdominal-ct-protocol"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028c.appendicitis.a-competing-diagnoses.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.77a3e7166020ce63",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n3.appendicitis-response-versus-structural-risk",
      "caseId": "case.n3.appendicitis-response-versus-structural-risk.v1",
      "nodeIds": [
        "node.n3.appendicitis-response-versus-structural-risk.v1"
      ],
      "variantIds": [
        "question.n3.appendicitis-response-versus-structural-risk.v1"
      ],
      "chiefComplaint": "Appendicitis plan review",
      "taskTextShort": "Which treatment pathway best fits {patientName}'s findings and stated priority?",
      "taskText": "Which treatment pathway best fits {patientName}'s findings and stated priority?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
        "line": 28,
        "export": "QUESTION_NEW_N3_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
          "line": 28,
          "export": "QUESTION_NEW_N3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
          "line": 33,
          "export": "QUESTION_NEW_N3_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n3.66761d174d8b",
        "claim.n3.4f1b3447a42b"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n3.appendicitis-response-versus-structural-risk.v1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.01cebe62173eb37c",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n3.appendicitis-response-versus-structural-risk",
      "caseId": "case.n3.appendicitis-response-versus-structural-risk.v1",
      "nodeIds": [
        "node.n3.appendicitis-response-versus-structural-risk.v1"
      ],
      "variantIds": [
        "question.n3.appendicitis-response-versus-structural-risk.v2"
      ],
      "chiefComplaint": "Appendicitis plan review",
      "taskTextShort": "Which treatment pathway should {patientName} be offered as the preferred plan?",
      "taskText": "Which treatment pathway should {patientName} be offered as the preferred plan?",
      "status": "draft parked",
      "retentionState": "retained drop proposal",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [
        "review.n3.appendicitis-response-versus-structural-risk.v2"
      ],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
        "line": 33,
        "export": "QUESTION_NEW_N3_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
          "line": 33,
          "export": "QUESTION_NEW_N3_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
          "line": 39,
          "export": "QUESTION_NEW_N3_ROUND2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n3.66761d174d8b",
        "claim.n3.4f1b3447a42b"
      ],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n3.appendicitis-response-versus-structural-risk.v1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.87d2d8f029e0fd4b",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.classic-pattern-urgent-disposition",
      "caseId": "case.pilot.appendicitis-classic-transfer",
      "nodeIds": [
        "node.case.pilot.appendicitis-classic-transfer.1"
      ],
      "variantIds": [
        "variant.appendicitis.classic-disposition.b"
      ],
      "chiefComplaint": "Worsening abdominal pain now in the right lower quadrant",
      "taskTextShort": "An otherwise healthy adult develops central abdominal discomfort followed by steadily worsening right-lower-quadrant pain, anorexia, and localized tenderness. Choose the next step from this outpatient clinic.",
      "taskText": "An otherwise healthy adult develops central abdominal discomfort followed by steadily worsening right-lower-quadrant pain, anorexia, and localized tenderness. Choose the next step from this outpatient clinic.",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
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
      "sourceEvidenceClaimIds": [],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.case.pilot.appendicitis-classic-transfer.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.f6a91b1684ea0b16",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.incomplete-pattern-recognition",
      "caseId": "case.pilot.appendicitis-incomplete-multistep",
      "nodeIds": [
        "node.case.pilot.appendicitis-incomplete-multistep.1"
      ],
      "variantIds": [
        "variant.appendicitis.incomplete-recognition.a"
      ],
      "chiefComplaint": "Worsening focal right-lower-quadrant pain",
      "taskTextShort": "An adult has steadily worsening focal right-lower-quadrant pain and tenderness but no clear migration and no measured fever. Which diagnosis must remain an important urgent concern?",
      "taskText": "An adult has steadily worsening focal right-lower-quadrant pain and tenderness but no clear migration and no measured fever. Which diagnosis must remain an important urgent concern?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
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
      "sourceEvidenceClaimIds": [],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.case.pilot.appendicitis-incomplete-multistep.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.e64a213d31294e69",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.no-delay-for-unavailable-test",
      "caseId": "case.pilot.appendicitis-incomplete-multistep",
      "nodeIds": [
        "node.case.pilot.appendicitis-incomplete-multistep.2"
      ],
      "variantIds": [
        "variant.appendicitis.no-delay.a"
      ],
      "chiefComplaint": "Worsening focal right-lower-quadrant pain",
      "taskTextShort": "The clinic is concerned about appendicitis after history and examination, but has no CT or ultrasound. Plain X-ray is available. What is the best next step?",
      "taskText": "The clinic is concerned about appendicitis after history and examination, but has no CT or ultrasound. Plain X-ray is available. What is the best next step?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
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
      "sourceEvidenceClaimIds": [],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.case.pilot.appendicitis-incomplete-multistep.2",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    },
    {
      "recordId": "inventory.b27b6e5a35516a63",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.appendicitis.no-delay-for-unavailable-test",
      "caseId": "case.pilot.appendicitis-no-onsite-imaging",
      "nodeIds": [
        "node.case.pilot.appendicitis-no-onsite-imaging.1"
      ],
      "variantIds": [
        "variant.appendicitis.no-delay.b"
      ],
      "chiefComplaint": "Concerning right-lower-quadrant pain without onsite CT",
      "taskTextShort": "After recognizing a concerning but incomplete appendicitis pattern, you learn that appropriate imaging cannot be performed in this clinic today. Select the disposition.",
      "taskText": "After recognizing a concerning but incomplete appendicitis pattern, you learn that appropriate imaging cannot be performed in this clinic today. Select the disposition.",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/pilot-content.ts",
        "line": 114,
        "export": "PILOT_CLINICAL_RELEASE",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
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
      "sourceEvidenceClaimIds": [],
      "casePrimaryTopicSlug": "appendix-appendicitis",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.case.pilot.appendicitis-no-onsite-imaging.1",
          "primaryTopicSlug": "appendix-appendicitis"
        }
      ]
    }
  ],
  "concepts": [
    {
      "conceptId": "concept.appendicitis.appendicolith-operative-pathway",
      "displayName": "Appendicolith and appendicitis treatment",
      "learningObjective": "Recognize an appendicolith as a risk modifier that favors operative hospital care over a routine antibiotics-only pathway while preserving shared decision-making.",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.14164bfd62e37818",
        "inventory.00050117719fe89e",
        "inventory.46eca681a5657da1",
        "inventory.c98fa6b2a1093e17"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 239,
          "export": "URGENT_FAMILIES",
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
      "conceptId": "concept.appendicitis.classic-pattern-urgent-disposition",
      "displayName": "Urgent disposition for a classic appendicitis pattern",
      "learningObjective": "Select prompt emergency-department evaluation for a stable outpatient with a classic concerning appendicitis presentation.",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.87d2d8f029e0fd4b"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/pilot-data/hernia-appendicitis-content.ts",
          "line": 306,
          "export": "HERNIA_APPENDICITIS_CONCEPTS",
          "locator": "exact identity literal"
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
      "conceptId": "concept.appendicitis.ct-request-with-urinary-mimic.v1",
      "displayName": "Choose an acute abdominal CT protocol despite urinary clues",
      "learningObjective": "Integrate the pain/examination trajectory with haematuria before selecting an abdominal inflammatory, stone or excretory-tract CT request.",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.039efde9d6406671"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
          "line": 2288,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_CONCEPT_VERSIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts",
          "line": 10,
          "export": "QUESTION_BANK_BATCH2B_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    },
    {
      "conceptId": "concept.appendicitis.incomplete-pattern-recognition",
      "displayName": "Recognition of an incomplete appendicitis pattern",
      "learningObjective": "Maintain suspicion for appendicitis when progressive focal right-lower-quadrant findings are present despite an incomplete classic pattern.",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.f6a91b1684ea0b16"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/pilot-data/hernia-appendicitis-content.ts",
          "line": 392,
          "export": "HERNIA_APPENDICITIS_CONCEPTS",
          "locator": "exact identity literal"
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
      "conceptId": "concept.appendicitis.no-delay-for-unavailable-test",
      "displayName": "Do not delay suspected appendicitis for unavailable testing",
      "learningObjective": "Choose emergency-department transfer rather than delaying a concerning appendicitis presentation for unavailable CT or substituting plain X-ray.",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.e64a213d31294e69",
        "inventory.b27b6e5a35516a63"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/pilot-data/hernia-appendicitis-content.ts",
          "line": 491,
          "export": "HERNIA_APPENDICITIS_CONCEPTS",
          "locator": "exact identity literal"
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
      "conceptId": "concept.appendicitis.stable-adult-ct",
      "displayName": "CT for uncertain adult appendicitis",
      "learningObjective": "Select CT for a stable nonpregnant adult with persistent appendicitis concern after nondiagnostic ultrasound when timely MRI is unavailable.",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.aec842138ef4f218",
        "inventory.7db83c6db2bc35c3",
        "inventory.77b6a7027acff8ce",
        "inventory.fde00f3201bc47d2",
        "inventory.159fb8efb704d450"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/urgent-families.ts",
          "line": 55,
          "export": "URGENT_FAMILIES",
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
      "conceptId": "concept.n3.appendicitis-response-versus-structural-risk",
      "displayName": "Appendicitis response and treatment choice",
      "learningObjective": "Distinguish early improvement on antibiotics from a structural risk modifier when choosing definitive care for uncomplicated appendicitis.",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": false,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.77a3e7166020ce63",
        "inventory.01cebe62173eb37c"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n3-20261105.ts",
          "line": 18,
          "export": "QUESTION_NEW_N3_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n3-round2-20261105.ts",
          "line": 53,
          "export": "QUESTION_NEW_N3_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        }
      ],
      "assignmentBasis": "Organ/decision-family assignment reviewed against the topic scope.",
      "registryOnly": false
    }
  ],
  "caseAssignments": [
    {
      "caseId": "case.gs028c.appendicitis.a-atypical-older-adult",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "appendix-appendicitis"
      ],
      "inventoryRecordIds": [
        "inventory.aec842138ef4f218"
      ],
      "nodeIds": [
        "node.gs028c.appendicitis.a-atypical-older-adult.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.appendicitis.a-competing-diagnoses",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "appendix-appendicitis"
      ],
      "inventoryRecordIds": [
        "inventory.7db83c6db2bc35c3",
        "inventory.159fb8efb704d450",
        "inventory.039efde9d6406671"
      ],
      "nodeIds": [
        "node.gs028c.appendicitis.a-competing-diagnoses.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v4",
        "question.appendicitis.stable-adult-ct.v4.r1",
        "question.appendicitis.stable-adult-ct.v4.r2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.appendicitis.a-equivocal-exam",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "appendix-appendicitis"
      ],
      "inventoryRecordIds": [
        "inventory.77b6a7027acff8ce"
      ],
      "nodeIds": [
        "node.gs028c.appendicitis.a-equivocal-exam.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.appendicitis.a-nondiagnostic-ultrasound",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "appendix-appendicitis"
      ],
      "inventoryRecordIds": [
        "inventory.fde00f3201bc47d2"
      ],
      "nodeIds": [
        "node.gs028c.appendicitis.a-nondiagnostic-ultrasound.1"
      ],
      "variantIds": [
        "question.appendicitis.stable-adult-ct.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.appendicitis.b-asks-for-antibiotics",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "appendix-appendicitis"
      ],
      "inventoryRecordIds": [
        "inventory.14164bfd62e37818"
      ],
      "nodeIds": [
        "node.gs028c.appendicitis.b-asks-for-antibiotics.1"
      ],
      "variantIds": [
        "question.appendicitis.appendicolith-operative-pathway.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.appendicitis.b-ct-confirmed-appendicolith",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "appendix-appendicitis"
      ],
      "inventoryRecordIds": [
        "inventory.00050117719fe89e"
      ],
      "nodeIds": [
        "node.gs028c.appendicitis.b-ct-confirmed-appendicolith.1"
      ],
      "variantIds": [
        "question.appendicitis.appendicolith-operative-pathway.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.appendicitis.b-no-perforation-but-stone",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "appendix-appendicitis"
      ],
      "inventoryRecordIds": [
        "inventory.46eca681a5657da1"
      ],
      "nodeIds": [
        "node.gs028c.appendicitis.b-no-perforation-but-stone.1"
      ],
      "variantIds": [
        "question.appendicitis.appendicolith-operative-pathway.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028c.appendicitis.b-prior-antibiotic-preference",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "appendix-appendicitis"
      ],
      "inventoryRecordIds": [
        "inventory.c98fa6b2a1093e17"
      ],
      "nodeIds": [
        "node.gs028c.appendicitis.b-prior-antibiotic-preference.1"
      ],
      "variantIds": [
        "question.appendicitis.appendicolith-operative-pathway.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n3.appendicitis-response-versus-structural-risk.v1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.77a3e7166020ce63",
        "inventory.01cebe62173eb37c"
      ],
      "nodeIds": [
        "node.n3.appendicitis-response-versus-structural-risk.v1"
      ],
      "variantIds": [
        "question.n3.appendicitis-response-versus-structural-risk.v1",
        "question.n3.appendicitis-response-versus-structural-risk.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.pilot.appendicitis-classic-transfer",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.87d2d8f029e0fd4b"
      ],
      "nodeIds": [
        "node.case.pilot.appendicitis-classic-transfer.1"
      ],
      "variantIds": [
        "variant.appendicitis.classic-disposition.b"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.pilot.appendicitis-incomplete-multistep",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.f6a91b1684ea0b16",
        "inventory.e64a213d31294e69"
      ],
      "nodeIds": [
        "node.case.pilot.appendicitis-incomplete-multistep.1",
        "node.case.pilot.appendicitis-incomplete-multistep.2"
      ],
      "variantIds": [
        "variant.appendicitis.incomplete-recognition.a",
        "variant.appendicitis.no-delay.a"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.pilot.appendicitis-no-onsite-imaging",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.b27b6e5a35516a63"
      ],
      "nodeIds": [
        "node.case.pilot.appendicitis-no-onsite-imaging.1"
      ],
      "variantIds": [
        "variant.appendicitis.no-delay.b"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    }
  ],
  "nodeAssignments": [
    {
      "nodeId": "node.case.pilot.appendicitis-classic-transfer.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.classic-pattern-urgent-disposition"
      ],
      "inventoryRecordIds": [
        "inventory.87d2d8f029e0fd4b"
      ]
    },
    {
      "nodeId": "node.case.pilot.appendicitis-incomplete-multistep.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.incomplete-pattern-recognition"
      ],
      "inventoryRecordIds": [
        "inventory.f6a91b1684ea0b16"
      ]
    },
    {
      "nodeId": "node.case.pilot.appendicitis-incomplete-multistep.2",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.no-delay-for-unavailable-test"
      ],
      "inventoryRecordIds": [
        "inventory.e64a213d31294e69"
      ]
    },
    {
      "nodeId": "node.case.pilot.appendicitis-no-onsite-imaging.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.no-delay-for-unavailable-test"
      ],
      "inventoryRecordIds": [
        "inventory.b27b6e5a35516a63"
      ]
    },
    {
      "nodeId": "node.gs028c.appendicitis.a-atypical-older-adult.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.stable-adult-ct"
      ],
      "inventoryRecordIds": [
        "inventory.aec842138ef4f218"
      ]
    },
    {
      "nodeId": "node.gs028c.appendicitis.a-competing-diagnoses.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.stable-adult-ct",
        "concept.appendicitis.ct-request-with-urinary-mimic.v1"
      ],
      "inventoryRecordIds": [
        "inventory.7db83c6db2bc35c3",
        "inventory.159fb8efb704d450",
        "inventory.039efde9d6406671"
      ]
    },
    {
      "nodeId": "node.gs028c.appendicitis.a-equivocal-exam.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.stable-adult-ct"
      ],
      "inventoryRecordIds": [
        "inventory.77b6a7027acff8ce"
      ]
    },
    {
      "nodeId": "node.gs028c.appendicitis.a-nondiagnostic-ultrasound.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.stable-adult-ct"
      ],
      "inventoryRecordIds": [
        "inventory.fde00f3201bc47d2"
      ]
    },
    {
      "nodeId": "node.gs028c.appendicitis.b-asks-for-antibiotics.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.appendicolith-operative-pathway"
      ],
      "inventoryRecordIds": [
        "inventory.14164bfd62e37818"
      ]
    },
    {
      "nodeId": "node.gs028c.appendicitis.b-ct-confirmed-appendicolith.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.appendicolith-operative-pathway"
      ],
      "inventoryRecordIds": [
        "inventory.00050117719fe89e"
      ]
    },
    {
      "nodeId": "node.gs028c.appendicitis.b-no-perforation-but-stone.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.appendicolith-operative-pathway"
      ],
      "inventoryRecordIds": [
        "inventory.46eca681a5657da1"
      ]
    },
    {
      "nodeId": "node.gs028c.appendicitis.b-prior-antibiotic-preference.1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.appendicolith-operative-pathway"
      ],
      "inventoryRecordIds": [
        "inventory.c98fa6b2a1093e17"
      ]
    },
    {
      "nodeId": "node.n3.appendicitis-response-versus-structural-risk.v1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n3.appendicitis-response-versus-structural-risk"
      ],
      "inventoryRecordIds": [
        "inventory.77a3e7166020ce63",
        "inventory.01cebe62173eb37c"
      ]
    }
  ],
  "variantAssignments": [
    {
      "variantId": "question.appendicitis.appendicolith-operative-pathway.v1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.appendicolith-operative-pathway"
      ],
      "inventoryRecordIds": [
        "inventory.00050117719fe89e"
      ]
    },
    {
      "variantId": "question.appendicitis.appendicolith-operative-pathway.v2",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.appendicolith-operative-pathway"
      ],
      "inventoryRecordIds": [
        "inventory.14164bfd62e37818"
      ]
    },
    {
      "variantId": "question.appendicitis.appendicolith-operative-pathway.v3",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.appendicolith-operative-pathway"
      ],
      "inventoryRecordIds": [
        "inventory.46eca681a5657da1"
      ]
    },
    {
      "variantId": "question.appendicitis.appendicolith-operative-pathway.v4",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.appendicolith-operative-pathway"
      ],
      "inventoryRecordIds": [
        "inventory.c98fa6b2a1093e17"
      ]
    },
    {
      "variantId": "question.appendicitis.stable-adult-ct.v1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.stable-adult-ct"
      ],
      "inventoryRecordIds": [
        "inventory.fde00f3201bc47d2"
      ]
    },
    {
      "variantId": "question.appendicitis.stable-adult-ct.v2",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.stable-adult-ct"
      ],
      "inventoryRecordIds": [
        "inventory.aec842138ef4f218"
      ]
    },
    {
      "variantId": "question.appendicitis.stable-adult-ct.v3",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.stable-adult-ct"
      ],
      "inventoryRecordIds": [
        "inventory.77b6a7027acff8ce"
      ]
    },
    {
      "variantId": "question.appendicitis.stable-adult-ct.v4",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.appendicitis.stable-adult-ct"
      ],
      "inventoryRecordIds": [
        "inventory.7db83c6db2bc35c3"
      ]
    },
    {
      "variantId": "question.appendicitis.stable-adult-ct.v4.r1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.stable-adult-ct"
      ],
      "inventoryRecordIds": [
        "inventory.159fb8efb704d450"
      ]
    },
    {
      "variantId": "question.appendicitis.stable-adult-ct.v4.r2",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.ct-request-with-urinary-mimic.v1"
      ],
      "inventoryRecordIds": [
        "inventory.039efde9d6406671"
      ]
    },
    {
      "variantId": "question.n3.appendicitis-response-versus-structural-risk.v1",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n3.appendicitis-response-versus-structural-risk"
      ],
      "inventoryRecordIds": [
        "inventory.77a3e7166020ce63"
      ]
    },
    {
      "variantId": "question.n3.appendicitis-response-versus-structural-risk.v2",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n3.appendicitis-response-versus-structural-risk"
      ],
      "inventoryRecordIds": [
        "inventory.01cebe62173eb37c"
      ]
    },
    {
      "variantId": "variant.appendicitis.classic-disposition.b",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.classic-pattern-urgent-disposition"
      ],
      "inventoryRecordIds": [
        "inventory.87d2d8f029e0fd4b"
      ]
    },
    {
      "variantId": "variant.appendicitis.incomplete-recognition.a",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.incomplete-pattern-recognition"
      ],
      "inventoryRecordIds": [
        "inventory.f6a91b1684ea0b16"
      ]
    },
    {
      "variantId": "variant.appendicitis.no-delay.a",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.no-delay-for-unavailable-test"
      ],
      "inventoryRecordIds": [
        "inventory.e64a213d31294e69"
      ]
    },
    {
      "variantId": "variant.appendicitis.no-delay.b",
      "primaryTopicSlug": "appendix-appendicitis",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.appendicitis.no-delay-for-unavailable-test"
      ],
      "inventoryRecordIds": [
        "inventory.b27b6e5a35516a63"
      ]
    }
  ],
  "identityReuseNotes": [],
  "recordedHolds": [
    {
      "id": "review.n3.appendicitis-response-versus-structural-risk.v2",
      "kind": "retained_drop_proposal",
      "recordFile": "docs/research/question-new-n3-round4-20261110.json",
      "reason": "The appendicolith operative-pathway objective already has four live variants. Short-term symptom improvement does not create a different supported treatment boundary; retain that coverage instead of another recall sibling.",
      "match": {
        "variantId": "question.n3.appendicitis-response-versus-structural-risk.v2",
        "caseId": "case.n3.appendicitis-response-versus-structural-risk.v1"
      },
      "inventoryRecordIds": [
        "inventory.01cebe62173eb37c"
      ]
    }
  ],
  "unkeyedDraftSlots": [],
  "withheldTeachingPoints": [],
  "frozenReferences": {
    "independentPass": [],
    "clinicalApprovals": [],
    "reviewInProgressFreeze": [],
    "basis": "All 16 assigned records have editorialAcceptance=null. Topic has zero live accepted nodes and no supplied exact independent PASS or named clinical approval. Two B2B14 reviews are REVISE. The N3 v2 drop proposal is retained verbatim in recordedHolds.",
    "reviewDecisions": [
      {
        "file": "docs/research/question-bank-batch2b-review-20261104.json",
        "fileSha256": "ecdd8f84da56362bf9f644c8baec95ca90b00b560b27b00cd10df76fcd5ae76a",
        "exactRecord": {
          "id": "B2B14",
          "title": "Choose a cross-sectional study after a limited focal examination",
          "verdict": "REVISE",
          "difficulty": "easy",
          "twoStep": false,
          "cues": [
            {
              "phrase": "Ultrasound does not trace the appendix because of overlying bowel",
              "why": "The failed modality is explicitly identified, making repetition of the same focused examination an obvious foil."
            },
            {
              "phrase": "a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness",
              "why": "This supplies a benign interpretation and site mismatch that specifically neutralize the pelvic-ultrasound option."
            }
          ],
          "fairness": [
            "CT is a defensible next modality in this nonpregnant adult with ongoing concern. If the task is a literal imaging request, contrast/protocol details are not specified; the current answer can only be judged at modality level.",
            "Importance: high. Realism: ultrasound can precede CT, but persistent focal pain and rising inflammatory markers require a clearly acute assessment pathway rather than a leisurely clinic return.",
            "The migratory pain plus a nondiagnostic ultrasound is too familiar for a moderate PGY-2/3 item."
          ],
          "suggestions": [
            "Compare three credible imaging requests or protocols for a supported clinical constraint, rather than CT against a visibly unsuccessful scan and a dismissed ovarian finding.",
            "Retain pregnancy and stability information where needed; do not add invented contrast contraindications.",
            "Clarify urgency and whether the learner chooses modality or the complete request."
          ]
        }
      },
      {
        "file": "docs/research/question-bank-batch2b-review2-20261104.json",
        "fileSha256": "80f5622d0d646d912243569003af5f734c02d1468a19d0a74656ab5122ad741f",
        "exactRecord": {
          "id": "B2B14",
          "title": "Choose the CT request when urinary findings compete with an acute abdomen",
          "verdict": "REVISE",
          "difficulty": "easy",
          "twoStep": false,
          "cues": [],
          "fairness": [
            "Contrast-enhanced abdominopelvic CT is a defensible best offered request for this inflammatory acute-abdominal presentation. Haematuria creates a plausible renal-colic temptation, but delayed CT urography is a weak acute-care competitor.",
            "Too easy for PGY-2/3: classic migratory pain, focal guarding and rising inflammatory markers make the intended protocol routine. Recognizing appendicitis and recalling its usual CT request is not a substantial second inference.",
            "Importance: high. Realism: the hospital setting, pregnancy assessment and contrast-related observations are coherent. These safety facts are not independently exploitable wording cues and should not be removed simply to make the item harder."
          ],
          "suggestions": [
            "Keep the concrete CT-protocol task, but use a supported case where the urinary/inflammatory interpretation or a genuine acquisition constraint changes the protocol choice.",
            "Replace excretory-phase urography with a credible same-stage request. Do not introduce unsupported contrast contraindications or numeric thresholds."
          ]
        }
      }
    ]
  },
  "activeManagerHandoff": "docs/handoffs/CURRENT_THREAD_HANDOFF.md ? QUESTION TOPIC PROGRAM PLANNING (2026-11-11), wave 1 topic milestone",
  "ownerDirection": "I feel like they are still a little confusing and we may be missing some of the concepts that are most tested and testable. ... look up everything they can about that topic and decide what concepts on that are the most testable. Then look at all the questions that fit in that topic category and critically analyze if it is a good question based on the rules and feedback you have gotten from me on what is a good and what is a bad question. Then the worker also looks for gaps on that topic that it can fill in with more questions. Remember to try to create multiple part questions when possible. ... The goal of this is to increase the number of questions, fill gaps, test the testable stuff, and to make the current existing questions better and more accurate. Also remember that the questions need to be difficult."
}
```

<!-- APPENDIX-SALVAGE-BEGIN -->

## Current skipped-PASS salvage, November 11, 2026

**Five skipped PASS nodes are now five standalone cases, all marked `salvage`.** The targeted review queue is exactly these five new compositions. Three already accepted cases, their questions, complete nodes, timing entries and packet proposals remain unchanged. No question, choice or concept identity changed; no new clinical claim or source was introduced.

Authority: [acceptance batch 1](question-topic-acceptance-batch1-20261111.md), its [dispositions JSON](question-topic-acceptance-batch1-dispositions-20261111.json), and the two exact independent-review files listed below. The original assignment above remains the wave 1 snapshot. Current progress and validation are in this salvage section; the earlier review response below is historical.

| Status | New case ID | Exact node ID | Exact question ID |
|---|---|---|---|
| **salvage** | case.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1 | node.topic.appendix-appendicitis.persistent-pain-exploration.v1 | question.topic.appendix-appendicitis.persistent-pain-exploration.v1 |
| **salvage** | case.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1 | node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2 | question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2 |
| **salvage** | case.topic.appendix-appendicitis.salvage-postoperative-abscess-drainage.v1 | node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2 | question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2 |
| **salvage** | case.topic.appendix-appendicitis.salvage-post-source-control-antibiotics.v1 | node.topic.appendix-appendicitis.post-source-control-antibiotics.v2 | question.topic.appendix-appendicitis.post-source-control-antibiotics.v2 |
| **salvage** | case.topic.appendix-appendicitis.salvage-post-abscess-interval-appendectomy.v1 | node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 | question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 |

The fresh authoring preview contains ten single-node cases: five salvage cases, three unchanged accepted cases and two previously returned draft cases outside this review queue. The returned archive-review question is preserved with its original full three-node context in the pre-salvage exports and JSON snapshot, and is excluded from fresh supply. No attempt was made to relabel its basic record-retrieval task as a difficult clinical companion.

All five question records, tasks, updates, options, keys, explanations, distractor feedback, exhibits, shuffle flags and service/result-gate fields are exact copies of their prior PASS versions. The only node-level adaptation is four neutral final-answer disposition records across the two former nonfinal nodes: exploration and drainage. The schema requires one for each wrong final answer. Each repeats the corresponding passed rationale verbatim and models no clinical outcome. Original complete runtime nodes and cases remain exact in the retained snapshots.

## Salvage authority and accepted freezes

```json
[
  {
    "file": "docs/research/question-topic-acceptance-batch1-20261111.md",
    "sha256": "7c9b238011bcbc8cd918d7b562f4e01958e5353ac2afcee8b635a3f3f89e58b8"
  },
  {
    "file": "docs/research/question-topic-acceptance-batch1-dispositions-20261111.json",
    "sha256": "bff524ce7158c1326304b9aa15ffdfab3e20cdc922c4aa62d6093c12636babb4"
  },
  {
    "file": "docs/research/question-topic-acceptance-batch1-packet-20261111.json",
    "sha256": "393f6b367bf23a198efebcd7baaa87f62c6549f9f97cb73574b62c8f7ceba887"
  },
  {
    "file": "docs/research/question-topic-appendix-appendicitis-review-20261111.json",
    "sha256": "79df70da3b285676c6d00f141b6c6f63d9fdb41bca6fa4e461f79fd78df75445"
  },
  {
    "file": "docs/research/question-topic-appendix-appendicitis-review2-20261111.json",
    "sha256": "6bad000ffdf0374452d73406b9590067b489857e0b567d263706e2c473b98941"
  }
]
```

| Accepted case left untouched | Accepted node | Question SHA-256 |
|---|---|---|
| case.topic.appendix-appendicitis.peritoneal-mucin.v2 | node.topic.appendix-appendicitis.peritoneal-mucin-referral.v2 | 42791d2018bade9022a725139e21639d8257ca2468c38be8bc41665a32d84916 |
| case.topic.appendix-appendicitis.goblet-cell-pathology.v1 | node.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1 | db760a1bc3ed5c12c70b60faebddf2a96f298ada6ae31b06c122d5e9f23788e8 |
| case.topic.appendix-appendicitis.net-staging.v2 | node.topic.appendix-appendicitis.net-regional-resection.v2 | 9ec215ae2e7bb068e116eed4b6d65d3bb7aee60dcda2fe8a7420ad8897bc71bc |

The focused test compares full accepted cases with the dispatch snapshot and compares question/raw-node hashes with the manager acceptance receipt. These accepted items are absent from `salvage.reviewQueue`. Their optional review suggestions were not applied.

## Standalone before/after packets for targeted re-review

Review **only the five cases below**. The previous independent PASS applies to the scored content in its former context. The new case/header combinations require targeted re-review and remain `needs_clinician_review`; this worker grants neither independent PASS nor clinical approval.

### salvage: case.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1

Exact node `node.topic.appendix-appendicitis.persistent-pain-exploration.v1`; question `question.topic.appendix-appendicitis.persistent-pain-exploration.v1`; concept `concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1`.

Acceptance skip reason: Four-to-one live rewrite exceeds the existing duplicate-target guard; parked pending manager scope decision.

Previous independent evidence: [question-topic-appendix-appendicitis-review-20261111.json](question-topic-appendix-appendicitis-review-20261111.json), exact verdict **PASS**.

#### Exact former visible context

```json
{
  "caseId": "case.topic.appendix-appendicitis.persistent-pain.v2",
  "caseSha256": "e6b6306db6274e0b76234aea05f3a70c09f48e945a3c5c6cdb8383b3f69f0e80",
  "chiefComplaint": "Persistent right-sided pain",
  "presentation": "{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable.",
  "patientDisplayName": "Nora Bennett",
  "demographics": {
    "ageYears": 46,
    "sexLabel": "Female"
  },
  "finiteProfiles": [
    {
      "id": "profile.topic.appendix-appendicitis.persistent-pain.v1",
      "prototypeDemographics": {
        "ageYears": 46,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Persistent right-sided pain",
      "presentation": "{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable."
    }
  ],
  "currentNodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
  "previousScoredNodesAndAllFeedback": [],
  "sourceRuntimeNodeSha256": "cf579f059eb3c77a2254662ce62bc3da5667daad5c0245b6e14b42e860124909",
  "sourceQuestionSha256": "23550ef630645030f5ebe54b8f7bee73b9a3e560c334a5f7953605f059e24b83"
}
```

The complete former case and current node are retained in JSON at `salvage.items[].before`; all seven pre-salvage cases, ten questions and timing rows remain at `salvage.snapshot` and in `APPENDIX_TOPIC_PRE_SALVAGE_ARTIFACTS`. The original thirteen-node v1 snapshot and frozen PASS contexts are also unchanged.

#### New standalone after

Patient: **Nora Bennett**, 46-year-old female. Chief complaint: **Persistent right-sided pain**.

{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable.

Finite clinic profile (new case/profile identity; clinical review pending):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Persistent right-sided pain",
    "presentation": "{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable."
  }
]
```

Complete task, unchanged: **Which hospital evaluation should be recommended now for {patientName}'s worsening right-sided abdominal findings?**

**key shown first for review only.** Runtime choices shuffle.

- KEY: Proceed to diagnostic abdominal laparoscopy (choice.topic.appendix-appendicitis.persistent-pain-exploration.laparoscopy.v1)

  Exact passed rationale: Progressive focal pain with new involuntary guarding keeps an operative abdominal cause consequential despite the adequate negative CT. Exploration can establish and treat the cause.

- Distractor: Repeat contrast-enhanced abdominal and pelvic CT (choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1)

  Exact passed rationale: A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration.

- Distractor: Continue serial abdominal examinations in hospital (choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1)

  Exact passed rationale: Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration.

Exact passed explanation: The CT was adequate, so its negative result initially supported observation. The subsequent focal progression and involuntary guarding require a fresh decision. WSES guidance supports exploration for persistent or progressive pain after negative imaging.

Prior scored tasks, updates and answer feedback in this new case: **none**. Result gate: `null`; no executable service requests are installed.

#### Minimal-context and sequence audit

```json
{
  "header": "The original independently reviewed acute-clinic header is unchanged. Its adequate IV CT, serial focal progression, involuntary guarding and stable circulation remain necessary. Only the future tumor companion and its later feedback are absent.",
  "interpret": "The reassuring initial acquisition must be weighed against new objective examination findings; no clinical discriminator moved into the header or task.",
  "absence": "There is no previous scored task or feedback. Removing the later tumor node cannot supply this answer."
}
```

#### Concrete author gate, unchanged clinical objective

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Read the acquisition as adequate and the later guarding as genuine progression after an initially reasonable observation period.",
  "apply": "Choose exploratory evaluation after the clinical course has outgrown reliance on the initial scan.",
  "closestError": "Continue observation because the appendix was described as normal on CT.",
  "decidingObservation": "New involuntary guarding and increasingly focal tenderness during observation.",
  "consequence": "An evolving operative abdominal process remains untreated.",
  "deletionTest": "The acquisition sentence distinguishes repeat imaging from exploration. Deleting the interval deterioration makes observation defensible. Pregnancy status and circulation delimit the acute pathway. Removed the classic migratory-pain and hematuria shortcuts from B2B14.",
  "counterfactual": "Replace new guarding with steady pain resolution and a soft repeat examination. Continued hospital observation becomes the best offered plan.",
  "counterfactualChoiceId": "observation",
  "cueAttack": "All offered actions are credible hospital evaluations and the key has intermediate length. The task asks for evaluation without naming exploration, missed appendicitis or a missing action. The necessary deterioration is clinical evidence. A prior scan and its adequacy preserve a real competing observation strategy.",
  "stageCategory": "Current hospital evaluation after completed imaging and observation. Three concrete diagnostic strategies.",
  "difficulty": "Predicted moderate for PGY-2/3. The intended error is over-reliance on an adequate negative CT when the serial examination changes. Independent review must judge the strength of this competition.",
  "oneBestAnswer": "The documented worsening after observation distinguishes exploration from simply repeating the same adequate scan or extending the same observation strategy.",
  "sequenceCheck": "Standalone salvage: one exact previously passed node with no preceding scored task, result gate or answer feedback. The clinic header supplies only patient identity and the existing episode; all deciding observations remain in the preserved presentation/update.",
  "repairRecord": "Manager-directed skipped-PASS salvage. Copied every scored field and the exact question, removed companions, and added only existing episode context. Former nonfinal nodes receive required neutral final-answer dispositions with verbatim choice rationale. The new visible case requires independent review; no PASS is inferred.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1",
      "temptation": "Treat the earlier scan as an imaging problem that another identical study will settle.",
      "rankingRationale": "A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration.",
      "counterfactual": "An incomplete outside acquisition with an unexamined symptomatic region would favor obtaining appropriate cross-sectional imaging before exploration.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.persistent-pain-negative-imaging"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1",
      "temptation": "Give the reassuring CT more weight than the interval examination.",
      "rankingRationale": "Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration.",
      "counterfactual": "A clearly improving examination without new guarding would support continued monitored observation.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.persistent-pain-negative-imaging"
      ]
    }
  ]
}
```

The interpretation, closest competitor, deciding observation and decision-changing counterfactual above are reused from the passed item. This salvage changes neither the scored rule nor the qualifying clinical evidence. The updated sequence check removes all preceding task/feedback dependencies.

#### Exactness, completion and integration

```json
{
  "sourceQuestionSha256": "23550ef630645030f5ebe54b8f7bee73b9a3e560c334a5f7953605f059e24b83",
  "salvageQuestionSha256": "23550ef630645030f5ebe54b8f7bee73b9a3e560c334a5f7953605f059e24b83",
  "sourceScoredNodeSha256": "e9b35c01237a35fdee0d7a9ad3521ed2bb0f8120c383d6c07e009ebf7e8e5cf9",
  "salvageScoredNodeSha256": "e9b35c01237a35fdee0d7a9ad3521ed2bb0f8120c383d6c07e009ebf7e8e5cf9",
  "scoredProjectionPolicy": {
    "excludedFields": [
      "terminalDispositions"
    ],
    "reason": "Standalone final-answer completion metadata only. All task, option, feedback, update, exhibit, source, shuffle, result-gate and identity fields compare exactly. Full original runtime-node hashes are retained separately."
  },
  "sourceRuntimeNodeSha256": "cf579f059eb3c77a2254662ce62bc3da5667daad5c0245b6e14b42e860124909",
  "salvageRuntimeNodeSha256": "a82427c531882bb67e29ebc04e061023103f6ae7a0579c0a6946bc3c6ffcad03",
  "caseCompletion": {
    "addedDispositions": 2,
    "kind": "no_terminal_outcome",
    "clinicalRationale": "Verbatim corresponding existing choice rationale; no new clinical statement or simulated outcome."
  },
  "salvageCaseSha256": "859ed684ec1717eeb185da93e34e67cb5b8ea132dec195c79e61998c45c61e70",
  "exactAfterSha256": "d72ba481e84a8fc56a2560f7f5be69d259e6c20ca7bdef8b89308851766bffc8"
}
```

Required new neutral ending metadata (verbatim existing choice rationales):

```json
[
  {
    "answerChoiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1",
    "kind": "no_terminal_outcome",
    "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
    "clinicalRationale": "A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration.",
    "sourceLabels": [
      "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
      "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
      "NIDDK treatment for appendicitis"
    ]
  },
  {
    "answerChoiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1",
    "kind": "no_terminal_outcome",
    "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
    "clinicalRationale": "Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration.",
    "sourceLabels": [
      "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
      "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
      "NIDDK treatment for appendicitis"
    ]
  }
]
```

Integration disposition: Standalone composition ready for re-review. Existing four-to-one live rewrite policy remains unresolved and unchanged; manager must choose a supported integration binding.

#### Evidence and testing metadata

Claims: `claim.appendix-appendicitis.persistent-pain-negative-imaging`. Full claims, original source dates, authority and reuse assessments are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json). No fresh source retrieval or verification is implied. The header reuses existing fictional patient/episode observations.

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.persistent-pain-negative-imaging"
        ]
      },
      {
        "fields": [
          "answerChoices[id=repeat-ct].label",
          "answerChoices[id=repeat-ct].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.persistent-pain-negative-imaging"
        ]
      },
      {
        "fields": [
          "answerChoices[id=laparoscopy].label",
          "answerChoices[id=laparoscopy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.persistent-pain-negative-imaging"
        ]
      },
      {
        "fields": [
          "answerChoices[id=observation].label",
          "answerChoices[id=observation].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.persistent-pain-negative-imaging"
        ]
      },
      {
        "fields": [
          "decisionNodes[id=node.topic.appendix-appendicitis.persistent-pain-exploration.v1].terminalDispositions[].clinicalRationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.persistent-pain-negative-imaging"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "First node has no earlier feedback or future pathology. Its explanation discusses the escalation decision and supplies no later oncologic operation."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1",
    "nodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1",
          "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.laparoscopy.v1",
          "choiceLabel": "Proceed to diagnostic abdominal laparoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1",
          "choiceLabel": "Continue serial abdominal examinations in hospital",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  "originalTimingRetained": {
    "caseId": "case.topic.appendix-appendicitis.persistent-pain.v2",
    "nodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1",
          "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.laparoscopy.v1",
          "choiceLabel": "Proceed to diagnostic abdominal laparoscopy",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1",
          "choiceLabel": "Continue serial abdominal examinations in hospital",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1",
    "nodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1",
        "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.laparoscopy.v1",
        "choiceLabel": "Proceed to diagnostic abdominal laparoscopy"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1",
        "choiceLabel": "Continue serial abdominal examinations in hospital"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

### salvage: case.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1

Exact node `node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2`; question `question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2`; concept `concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1`.

Acceptance skip reason: Four-to-one live rewrite exceeds the existing duplicate-target guard; parked pending manager scope decision.

Previous independent evidence: [question-topic-appendix-appendicitis-review2-20261111.json](question-topic-appendix-appendicitis-review2-20261111.json), exact verdict **PASS**.

#### Exact former visible context

```json
{
  "caseId": "case.topic.appendix-appendicitis.persistent-pain.v2",
  "caseSha256": "e6b6306db6274e0b76234aea05f3a70c09f48e945a3c5c6cdb8383b3f69f0e80",
  "chiefComplaint": "Persistent right-sided pain",
  "presentation": "{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable.",
  "patientDisplayName": "Nora Bennett",
  "demographics": {
    "ageYears": 46,
    "sexLabel": "Female"
  },
  "finiteProfiles": [
    {
      "id": "profile.topic.appendix-appendicitis.persistent-pain.v1",
      "prototypeDemographics": {
        "ageYears": 46,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Persistent right-sided pain",
      "presentation": "{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable."
    }
  ],
  "currentNodeId": "node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
  "previousScoredNodesAndAllFeedback": [
    {
      "id": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
      "questionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
      "primaryConceptId": "concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1",
      "stem": "Which hospital evaluation should be recommended now for {patientName}'s worsening right-sided abdominal findings?",
      "answerChoices": [
        {
          "id": "choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1",
          "label": "Repeat contrast-enhanced abdominal and pelvic CT",
          "isCorrect": false,
          "rationale": "A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.persistent-pain-exploration.laparoscopy.v1",
          "label": "Proceed to diagnostic abdominal laparoscopy",
          "isCorrect": true,
          "rationale": "Progressive focal pain with new involuntary guarding keeps an operative abdominal cause consequential despite the adequate negative CT. Exploration can establish and treat the cause.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1",
          "label": "Continue serial abdominal examinations in hospital",
          "isCorrect": false,
          "rationale": "Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "The CT was adequate, so its negative result initially supported observation. The subsequent focal progression and involuntary guarding require a fresh decision. WSES guidance supports exploration for persistent or progressive pain after negative imaging.",
      "sourceLabels": [
        "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
        "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
        "NIDDK treatment for appendicitis"
      ],
      "resultGateAfter": null,
      "terminalDispositions": []
    }
  ],
  "sourceRuntimeNodeSha256": "a3b1a0ec85e43d556773f8fc4c9aa128ffd8892fd30b5cf451780684491b4bf9",
  "sourceQuestionSha256": "a5d923187494df963d434a180fc53dd2861ae69b3de48ca4e9f3d06123408817"
}
```

The complete former case and current node are retained in JSON at `salvage.items[].before`; all seven pre-salvage cases, ten questions and timing rows remain at `salvage.snapshot` and in `APPENDIX_TOPIC_PRE_SALVAGE_ARTIFACTS`. The original thirteen-node v1 snapshot and frozen PASS contexts are also unchanged.

#### New standalone after

Patient: **Nora Bennett**, 46-year-old female. Chief complaint: **Pathology review**.

{patientName}, a 46-year-old woman, attends the clinic to review her hospital records after appendectomy.

Finite clinic profile (new case/profile identity; clinical review pending):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pathology review",
    "presentation": "{patientName}, a 46-year-old woman, attends the clinic to review her hospital records after appendectomy."
  }
]
```

Current update, unchanged: At clinic follow-up, {patientName}'s hospital record documents an intact appendectomy. The outside review examined one tip block containing low-grade mucinous lining. Expert permanent review of the entire specimen maps a separate proximal focus of irregular malignant glands infiltrating mesoappendiceal fat. The base margin is clear. Chest, abdominal and pelvic staging shows no distant lesions or deposits on serosal surfaces. Colonoscopy shows no separate colonic lesion. She has recovered and is fit for surgery.

Complete task, unchanged: **Which next management plan should be recommended for {patientName}'s appendiceal tumor after the complete specimen review?**

**key shown first for review only.** Runtime choices shuffle.

- KEY: Right hemicolectomy with regional nodes (choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.right-colectomy.v2)

  Exact passed rationale: The complete specimen establishes invasive glandular disease beyond the nonrepresentative tip block. With no represented distant or serosal disease, regional resection and nodal assessment are appropriate even though the appendectomy margin is clear.

- Distractor: Surveillance after the appendectomy (choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.surveillance.v2)

  Exact passed rationale: The tip block does not represent the whole lesion. The separately mapped infiltrative focus changes the tumor classification and creates a regional nodal indication despite local margin clearance.

- Distractor: Cytoreduction with intraperitoneal chemotherapy (choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.cytoreduction.v2)

  Exact passed rationale: Mesoappendiceal invasion is not the same finding as tumor deposits distributed on peritoneal surfaces. The current complete-specimen and staging record supports the regional pathway; cytoreduction and intraperitoneal treatment require a different disease distribution and specialist assessment.

Exact passed explanation: A benign-appearing or low-grade sampled region cannot classify unsampled parts of a heterogeneous appendix. The full specimen demonstrates infiltrative glandular disease. A clear base addresses the local margin; it does not address regional nodes. Mesoappendiceal invasion without demonstrated serosal dissemination supports right hemicolectomy rather than the peritoneal-disease pathway.

Prior scored tasks, updates and answer feedback in this new case: **none**. Result gate: `null`; no executable service requests are installed.

#### Minimal-context and sequence audit

```json
{
  "header": "The new header supplies only Nora's existing age/sex, clinic chart-review setting and intervening appendectomy. The full passed update supplies the tip sample, complete specimen, margin, staging and fitness.",
  "interpret": "The resident must still reconcile the limited sample with the separate invasive focus and then select the regional treatment field. No pathology interpretation or treatment rule was added to the header.",
  "absence": "Exploration, the earlier negative CT and its feedback are omitted because the passed update independently documents appendectomy and all current deciding evidence."
}
```

#### Concrete author gate, unchanged clinical objective

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Reconcile a low-grade tip block with a separately mapped infiltrative proximal focus in the complete specimen; classify by the demonstrated invasive component.",
  "apply": "Separate local margin clearance and direct mesoappendiceal invasion from regional nodal risk and from serosal dissemination, then recommend regional resection.",
  "closestError": "Choose surveillance by treating the limited tip block and clear base as a complete characterization of the lesion.",
  "decidingObservation": "The complete permanent specimen contains malignant glands infiltrating mesoappendiceal fat in tissue not represented by the reassuring tip block.",
  "consequence": "Leaving the regional nodal basin unassessed for an invasive primary, or escalating direct local invasion into an unsupported peritoneal treatment pathway.",
  "deletionTest": "Without the separate invasive focus, the whole-lesion conclusion and regional recommendation are unsupported. The margin distinguishes local clearance from nodal treatment. Staging distribution separates regional surgery from cytoreduction. The recovery and fitness observations delimit elective further resection.",
  "counterfactual": "Replace the mapped invasive focus with noninfiltrative low-grade lining throughout an intact margin-negative specimen without extra-appendiceal involvement. Surveillance after appendectomy becomes the best offered plan.",
  "counterfactualChoiceId": "surveillance",
  "cueAttack": "Removed the named adenocarcinoma interpretation, the key-only Oncologic adjective and the already-addressed cecal-cuff foil. The sample conflict is necessary evidence, not merely an omitted diagnosis label. All choices are specific next management plans and the neutral task accommodates observation.",
  "stageCategory": "Next management plan after complete pathology and staging, including surveillance and two distinct resection fields.",
  "difficulty": "Predicted moderate for PGY-2/3: the error is sampling-based anchoring and conflating a negative local margin with absence of regional risk. This is a fair moderate revision, not a claim of measured hard difficulty.",
  "oneBestAnswer": "The represented complete specimen and localized distribution support regional surgery under ASCRS recommendation 13. The competing noninfiltrative and disseminated pathways require different findings, not a different interpretation of the supplied margin.",
  "sequenceCheck": "Standalone salvage: one exact previously passed node with no preceding scored task, result gate or answer feedback. The clinic header supplies only patient identity and the existing episode; all deciding observations remain in the preserved presentation/update.",
  "repairRecord": "Manager-directed skipped-PASS salvage. Copied every scored field and the exact question, removed companions, and added only existing episode context. Former nonfinal nodes receive required neutral final-answer dispositions with verbatim choice rationale. The new visible case requires independent review; no PASS is inferred.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.surveillance.v2",
      "temptation": "Anchor on the limited low-grade tip sample and equate a clear margin with definitive treatment.",
      "rankingRationale": "The tip block does not represent the whole lesion. The separately mapped infiltrative focus changes the tumor classification and creates a regional nodal indication despite local margin clearance.",
      "counterfactual": "If the complete intact specimen instead showed only noninfiltrative LAMN with clear margins and no perforation or extra-appendiceal involvement, further regional resection would not be indicated.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.complete-specimen-assessment",
        "claim.appendix-appendicitis.lamn-versus-invasive",
        "claim.appendix-appendicitis.adenocarcinoma-colectomy",
        "claim.appendix-appendicitis.lamn-complete-resection"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.cytoreduction.v2",
      "temptation": "Treat mucinous histology or extension into mesoappendiceal fat as proof of a disseminated serosal process.",
      "rankingRationale": "Mesoappendiceal invasion is not the same finding as tumor deposits distributed on peritoneal surfaces. The current complete-specimen and staging record supports the regional pathway; cytoreduction and intraperitoneal treatment require a different disease distribution and specialist assessment.",
      "counterfactual": "If separate serosal deposits containing mucinous tumor were demonstrated, specialist assessment for cytoreduction and intraperitoneal treatment would replace routine regional resection as the governing pathway.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.adenocarcinoma-colectomy",
        "claim.appendix-appendicitis.peritoneal-mucin-treatment"
      ]
    }
  ]
}
```

The interpretation, closest competitor, deciding observation and decision-changing counterfactual above are reused from the passed item. This salvage changes neither the scored rule nor the qualifying clinical evidence. The updated sequence check removes all preceding task/feedback dependencies.

#### Exactness, completion and integration

```json
{
  "sourceQuestionSha256": "a5d923187494df963d434a180fc53dd2861ae69b3de48ca4e9f3d06123408817",
  "salvageQuestionSha256": "a5d923187494df963d434a180fc53dd2861ae69b3de48ca4e9f3d06123408817",
  "sourceScoredNodeSha256": "84cd3bf4df4a0ed24f56786f7669d96f2bbe7150c3ea0090c5fb96d9ff0bb329",
  "salvageScoredNodeSha256": "84cd3bf4df4a0ed24f56786f7669d96f2bbe7150c3ea0090c5fb96d9ff0bb329",
  "scoredProjectionPolicy": {
    "excludedFields": [
      "terminalDispositions"
    ],
    "reason": "Standalone final-answer completion metadata only. All task, option, feedback, update, exhibit, source, shuffle, result-gate and identity fields compare exactly. Full original runtime-node hashes are retained separately."
  },
  "sourceRuntimeNodeSha256": "a3b1a0ec85e43d556773f8fc4c9aa128ffd8892fd30b5cf451780684491b4bf9",
  "salvageRuntimeNodeSha256": "a3b1a0ec85e43d556773f8fc4c9aa128ffd8892fd30b5cf451780684491b4bf9",
  "caseCompletion": {
    "addedDispositions": 0,
    "kind": "no_terminal_outcome",
    "clinicalRationale": "Verbatim corresponding existing choice rationale; no new clinical statement or simulated outcome."
  },
  "salvageCaseSha256": "1717a95314bef31aedfc4c82762b3906fa7defea917cee4cfb804690015c25dc",
  "exactAfterSha256": "1c9c34032bc7f6403947e120ad3b7e47173792f19343098f67dcd60c76547a30"
}
```

Integration disposition: Standalone original new-gap objective; it has no direct legacy replacement inventory and is no longer a companion in the blocked persistent-pain case.

#### Evidence and testing metadata

Claims: `claim.appendix-appendicitis.complete-specimen-assessment`, `claim.appendix-appendicitis.lamn-versus-invasive`, `claim.appendix-appendicitis.adenocarcinoma-colectomy`, `claim.appendix-appendicitis.lamn-complete-resection`, `claim.appendix-appendicitis.peritoneal-mucin-treatment`. Full claims, original source dates, authority and reuse assessments are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json). No fresh source retrieval or verification is implied. The header reuses existing fictional patient/episode observations.

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.lamn-complete-resection",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ]
      },
      {
        "fields": [
          "answerChoices[id=surveillance].label",
          "answerChoices[id=surveillance].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.lamn-complete-resection"
        ]
      },
      {
        "fields": [
          "answerChoices[id=right-colectomy].label",
          "answerChoices[id=right-colectomy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy"
        ]
      },
      {
        "fields": [
          "answerChoices[id=cytoreduction].label",
          "answerChoices[id=cytoreduction].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ]
      },
      {
        "fields": [
          "decisionNodes[id=node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2].terminalDispositions[].clinicalRationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.lamn-complete-resection",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The passed preceding exploration question, header, profile and explanation remain byte-identical. They disclose no tumor finding or resection rule. Only this later update and question are versioned."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1",
    "nodeId": "node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  "originalTimingRetained": {
    "caseId": "case.topic.appendix-appendicitis.persistent-pain.v2",
    "nodeId": "node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1",
    "nodeId": "node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.surveillance.v2",
        "choiceLabel": "Surveillance after the appendectomy"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.right-colectomy.v2",
        "choiceLabel": "Right hemicolectomy with regional nodes"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.cytoreduction.v2",
        "choiceLabel": "Cytoreduction with intraperitoneal chemotherapy"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

### salvage: case.topic.appendix-appendicitis.salvage-postoperative-abscess-drainage.v1

Exact node `node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2`; question `question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2`; concept `concept.appendix-appendicitis.localized-postoperative-abscess-drainage.v1`.

Acceptance skip reason: Case contains scored nodes outside the manager PASS list.

Previous independent evidence: [question-topic-appendix-appendicitis-review2-20261111.json](question-topic-appendix-appendicitis-review2-20261111.json), exact verdict **PASS**.

#### Exact former visible context

```json
{
  "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
  "caseSha256": "5f825afdbe10bddefd2e82a00a3b30825c9192cc49381068e4346fef3f94421a",
  "chiefComplaint": "Pain after appendectomy",
  "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode.",
  "patientDisplayName": "Maya Collins",
  "demographics": {
    "ageYears": 35,
    "sexLabel": "Female"
  },
  "finiteProfiles": [
    {
      "id": "profile.topic.appendix-appendicitis.postoperative-source-control.v2",
      "prototypeDemographics": {
        "ageYears": 35,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Pain after appendectomy",
      "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode."
    }
  ],
  "currentNodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
  "previousScoredNodesAndAllFeedback": [
    {
      "id": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
      "questionVariantId": "question.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
      "primaryConceptId": "concept.appendix-appendicitis.postoperative-deep-infection-imaging.v2",
      "currentUpdate": "During this same episode, the hospital performed abdominal and pelvic CT. The transferred report says no collection is seen on the supplied images. Its image manifest lists a scout and precontrast axial images. The scanner log records both precontrast and intravenous-contrast acquisitions covering the abdomen and pelvis; the source archive contains the complete postcontrast dataset, available for current radiologist review. Symptoms and examination have not changed since that acquisition. Creatinine is within its reporting interval and no iodinated-contrast reaction occurred.",
      "stem": "Which imaging action should the acute-care team recommend next for {patientName}'s renewed postoperative symptoms on this acquisition and transfer record?",
      "answerChoices": [
        {
          "id": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.repeat-ct.v2",
          "label": "Repeat contrast-enhanced abdominal and pelvic CT",
          "isCorrect": false,
          "rationale": "A repeat acquisition could be necessary for inadequate source images or a changed clinical state. Here the complete current contrast acquisition already exists and is available for review, while the reassuring report covers only the transferred subset.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.archive-review.v2",
          "label": "Review the archived contrast-enhanced abdominal and pelvic CT",
          "isCorrect": true,
          "rationale": "The renewed illness still requires source localization, but the negative subset report cannot settle it. The acquisition log and actual archive establish that the needed current contrast images exist; reviewing them addresses the unresolved question without duplicating acquisition.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.mri.v2",
          "label": "Obtain contrast-enhanced abdominal and pelvic MRI",
          "isCorrect": false,
          "rationale": "MRI is a real cross-sectional alternative, but the supplied record already contains the current contrast CT acquisition for the clinical question. Changing modalities does not first resolve the evidentiary error in accepting a subset report. No universal CT-versus-MRI ranking is claimed.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "A reassuring interpretation applies to the supplied images, not to a different dataset still in the archive. Renewed fever and pain after recovery require source localization. The record establishes that complete current contrast CT images were acquired and remain available; review those images before repeating or replacing that acquisition. This conclusion depends on unchanged clinical status and adequate source images, not on the mere absence of exported files.",
      "sourceLabels": [
        "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
        "SAGES guideline for the diagnosis and treatment of appendicitis",
        "Intra-abdominal infections survival guide, Global Alliance 2024",
        "WSES global intra-abdominal infection guidelines, 2017"
      ],
      "resultGateAfter": null,
      "terminalDispositions": []
    }
  ],
  "sourceRuntimeNodeSha256": "8637d166baa7f814200c931130e48bb5f1edb53e0cbf0679235dca7e1f9cd7c2",
  "sourceQuestionSha256": "faa4d02aaa7928d9c12dad972ad59fa603e52ad83c9b6d7ef904b86efc35c1ad"
}
```

The complete former case and current node are retained in JSON at `salvage.items[].before`; all seven pre-salvage cases, ten questions and timing rows remain at `salvage.snapshot` and in `APPENDIX_TOPIC_PRE_SALVAGE_ARTIFACTS`. The original thirteen-node v1 snapshot and frozen PASS contexts are also unchanged.

#### New standalone after

Patient: **Maya Collins**, 35-year-old female. Chief complaint: **Postoperative care review**.

{patientName}, a 35-year-old woman, attends the clinic with hospital records after laparoscopic appendectomy for a perforated appendix.

Finite clinic profile (new case/profile identity; clinical review pending):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.salvage-postoperative-abscess-drainage.v1",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Postoperative care review",
    "presentation": "{patientName}, a 35-year-old woman, attends the clinic with hospital records after laparoscopic appendectomy for a perforated appendix."
  }
]
```

Current update, unchanged: Review of the archived intravenous-contrast CT shows a 5.5-cm rim-enhancing pelvic collection containing gas, adjacent to the bladder and rectum. The interventional radiologist reviews the access-plane images: posterior to the collection are pelvic fat and overlying soft tissue; bowel and major vessels lie anterior or lateral to that plane. There is no diffuse intraperitoneal fluid. No enteric contrast was administered. Fever and focal pain persist during active intravenous antibiotic treatment. {patientName} remains alert with stable blood pressure and no diffuse rigidity.

Complete task, unchanged: **Which treatment plan should be recommended now for {patientName}'s continuing postoperative illness?**

**key shown first for review only.** Runtime choices shuffle.

- KEY: Add image-guided pelvic catheter drainage (choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v2)

  Exact passed rationale: Persistent illness and an organized collection support evacuation. The radiologist-supplied geometry permits an image-guided approach while antibiotics continue. Clinical response and drainage findings must still be assessed; this is not proof that every leak has been excluded.

- Distractor: Continue antibiotics with serial abdominal examination (choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2)

  Exact passed rationale: Stable circulation does not establish resolution of an organized source. Persistent fever and pain with the represented collection favor evacuation while the existing antibiotics continue.

- Distractor: Add operative exploration with pelvic drainage (choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2)

  Exact passed rationale: Operation is appropriate for generalized contamination, uncontrolled leakage or anatomy that prevents effective less invasive control. The current observations demonstrate a localized target with assessed access anatomy and no generalized peritonitis. The IV-only study does not establish that a bowel leak is impossible.

Exact passed explanation: Persistent fever and pain with an organized localized collection support evacuation despite stable circulation. The assessed geometry and absence of generalized peritonitis favor image-guided drainage with continued antibiotics. The CT was acquired with intravenous contrast only: no claim of a negative enteric-contrast leak study is made. An uncontrolled bowel source or clinical deterioration would require renewed assessment and may require operation.

Prior scored tasks, updates and answer feedback in this new case: **none**. Result gate: `null`; no executable service requests are installed.

#### Minimal-context and sequence audit

```json
{
  "header": "Maya's existing age/sex, hospital-record review and laparoscopic appendectomy for a perforated appendix provide the episode. Archive-transfer logistics and the returned imaging question are absent.",
  "interpret": "The exact passed update still supplies persistent illness, active antibiotics, IV-only CT findings, access-plane anatomy and current physiology. The header adds neither drainability nor a source-control route.",
  "absence": "There is no earlier retrieval task or feedback. The preserved CT update is sufficient to make the treatment decision independently."
}
```

#### Concrete author gate, unchanged clinical objective

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Infer an ongoing organized source from persistence during active therapy, then interpret the collection location and interventional radiologist's observed access-plane relationships.",
  "apply": "Select image-guided evacuation with shared antibiotics for this localized accessible target, while preserving reassessment for an uncontrolled source rather than claiming that all bowel leakage was excluded.",
  "closestError": "Continue antibiotics because blood pressure is stable; the other close error is treating gas as sufficient proof that operation is required.",
  "decidingObservation": "Persistent fever and pain accompany a single organized collection whose reviewed posterior plane contains soft tissue and fat while bowel and major vessels lie elsewhere.",
  "consequence": "Delayed evacuation of an ongoing source, or unnecessary immediate operative exploration for a target amenable to an image-guided approach.",
  "deletionTest": "Removing persistent illness makes continued medical care more plausible. Removing the assessed geometry makes the percutaneous route underspecified. Generalized-peritonitis observations constrain operation. The constructed 5.5-cm measurement describes this collection and does not install a universal drainage cutoff.",
  "counterfactual": "Replace stable circulation and absence of diffuse rigidity with deterioration and generalized involuntary rigidity. Add operative exploration with pelvic drainage becomes the best offered plan for prompt control of generalized contamination.",
  "counterfactualChoiceId": "operative-exploration",
  "cueAttack": "The neutral treatment task no longer announces source control. Active antibiotics are shared background care, and every option specifies a treatment policy. The observer and anatomy are identified without calling a route safe or declaring the lesion drainable. Both procedural options carry the same existing placeholder timing profile.",
  "stageCategory": "Current treatment of continuing postoperative illness after anatomy and antibiotic response are observed; active antibiotics continue in every option.",
  "difficulty": "Predicted moderate to hard for PGY-2/3 from balancing persistent illness, stable circulation, postoperative gas and actual access anatomy. Difficulty comes from selecting a route, not from concealing safety information or inventing a leak-negative acquisition.",
  "oneBestAnswer": "The localized target, assessed anatomy and persistent illness support image-guided drainage under the recorded WSES and Global Alliance sources. An IV-only scan is not used as an enteric-contrast exclusion of leakage. Continued assessment is required and the key makes no size-only or all-leak-excluded claim.",
  "sequenceCheck": "Standalone salvage: one exact previously passed node with no preceding scored task, result gate or answer feedback. The clinic header supplies only patient identity and the existing episode; all deciding observations remain in the preserved presentation/update.",
  "repairRecord": "Manager-directed skipped-PASS salvage. Copied every scored field and the exact question, removed companions, and added only existing episode context. Former nonfinal nodes receive required neutral final-answer dispositions with verbatim choice rationale. The new visible case requires independent review; no PASS is inferred.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2",
      "temptation": "Use stable physiology to justify waiting despite an ongoing organized source and persistent symptoms.",
      "rankingRationale": "Stable circulation does not establish resolution of an organized source. Persistent fever and pain with the represented collection favor evacuation while the existing antibiotics continue.",
      "counterfactual": "A small resolving collection with sustained clinical improvement and no appropriate drainage access could support continued medical management and observation.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.localized-abscess-drainage"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2",
      "temptation": "Treat gas in a postoperative collection as proof of generalized ongoing leakage requiring immediate operative exploration.",
      "rankingRationale": "Operation is appropriate for generalized contamination, uncontrolled leakage or anatomy that prevents effective less invasive control. The current observations demonstrate a localized target with assessed access anatomy and no generalized peritonitis. The IV-only study does not establish that a bowel leak is impossible.",
      "counterfactual": "Replace stable localized findings with diffuse involuntary rigidity and circulatory deterioration. Prompt operative source control becomes the best offered plan.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.localized-abscess-drainage",
        "claim.appendix-appendicitis.diffuse-leak-exploration",
        "claim.appendix-appendicitis.ct-series-scope"
      ]
    }
  ]
}
```

The interpretation, closest competitor, deciding observation and decision-changing counterfactual above are reused from the passed item. This salvage changes neither the scored rule nor the qualifying clinical evidence. The updated sequence check removes all preceding task/feedback dependencies.

#### Exactness, completion and integration

```json
{
  "sourceQuestionSha256": "faa4d02aaa7928d9c12dad972ad59fa603e52ad83c9b6d7ef904b86efc35c1ad",
  "salvageQuestionSha256": "faa4d02aaa7928d9c12dad972ad59fa603e52ad83c9b6d7ef904b86efc35c1ad",
  "sourceScoredNodeSha256": "b15bd90b0a725d4cf75a7cabadb733434ec89cb253d36bcbe8a2626c864b3e7e",
  "salvageScoredNodeSha256": "b15bd90b0a725d4cf75a7cabadb733434ec89cb253d36bcbe8a2626c864b3e7e",
  "scoredProjectionPolicy": {
    "excludedFields": [
      "terminalDispositions"
    ],
    "reason": "Standalone final-answer completion metadata only. All task, option, feedback, update, exhibit, source, shuffle, result-gate and identity fields compare exactly. Full original runtime-node hashes are retained separately."
  },
  "sourceRuntimeNodeSha256": "8637d166baa7f814200c931130e48bb5f1edb53e0cbf0679235dca7e1f9cd7c2",
  "salvageRuntimeNodeSha256": "56c4f7de67978ea45d69b29a10abf24689eceeeda28791a27588cd63284cd393",
  "caseCompletion": {
    "addedDispositions": 2,
    "kind": "no_terminal_outcome",
    "clinicalRationale": "Verbatim corresponding existing choice rationale; no new clinical statement or simulated outcome."
  },
  "salvageCaseSha256": "a6f6ad8bed6f6b5eb439645b3647df91c3308950f291a5b4172615385b28c502",
  "exactAfterSha256": "6e7e50ab1dbedf6f065583194b14f6a1144d7e6779c3059c0cea672518244d49"
}
```

Required new neutral ending metadata (verbatim existing choice rationales):

```json
[
  {
    "answerChoiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2",
    "kind": "no_terminal_outcome",
    "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
    "clinicalRationale": "Stable circulation does not establish resolution of an organized source. Persistent fever and pain with the represented collection favor evacuation while the existing antibiotics continue.",
    "sourceLabels": [
      "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
      "SAGES guideline for the diagnosis and treatment of appendicitis",
      "Intra-abdominal infections survival guide, Global Alliance 2024",
      "WSES global intra-abdominal infection guidelines, 2017"
    ]
  },
  {
    "answerChoiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2",
    "kind": "no_terminal_outcome",
    "consequenceNarrative": "The selected plan is reviewed with feedback. The draft simulates no clinical outcome.",
    "clinicalRationale": "Operation is appropriate for generalized contamination, uncontrolled leakage or anatomy that prevents effective less invasive control. The current observations demonstrate a localized target with assessed access anatomy and no generalized peritonitis. The IV-only study does not establish that a bowel leak is impossible.",
    "sourceLabels": [
      "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
      "SAGES guideline for the diagnosis and treatment of appendicitis",
      "Intra-abdominal infections survival guide, Global Alliance 2024",
      "WSES global intra-abdominal infection guidelines, 2017"
    ]
  }
]
```

Integration disposition: Standalone composition ready for re-review and later manager admission; no shared-file binding changed.

#### Evidence and testing metadata

Claims: `claim.appendix-appendicitis.localized-abscess-drainage`, `claim.appendix-appendicitis.diffuse-leak-exploration`, `claim.appendix-appendicitis.ct-series-scope`. Full claims, original source dates, authority and reuse assessments are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json). No fresh source retrieval or verification is implied. The header reuses existing fictional patient/episode observations.

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-postoperative-abscess-drainage.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage",
          "claim.appendix-appendicitis.diffuse-leak-exploration",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      },
      {
        "fields": [
          "answerChoices[id=antibiotics].label",
          "answerChoices[id=antibiotics].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage"
        ]
      },
      {
        "fields": [
          "answerChoices[id=operative-exploration].label",
          "answerChoices[id=operative-exploration].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage",
          "claim.appendix-appendicitis.diffuse-leak-exploration",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      },
      {
        "fields": [
          "answerChoices[id=catheter-drainage].label",
          "answerChoices[id=catheter-drainage].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      },
      {
        "fields": [
          "decisionNodes[id=node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2].terminalDispositions[].clinicalRationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage",
          "claim.appendix-appendicitis.diffuse-leak-exploration",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The preceding revised node only establishes which acquired images need review. This update introduces collection anatomy and active-treatment response. Later recovery and antibiotic endpoint are absent from this explanation."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.salvage-postoperative-abscess-drainage.v1",
    "nodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2",
          "choiceLabel": "Continue antibiotics with serial abdominal examination",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2",
          "choiceLabel": "Add operative exploration with pelvic drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v2",
          "choiceLabel": "Add image-guided pelvic catheter drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        }
      ]
    }
  },
  "originalTimingRetained": {
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "nodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2",
          "choiceLabel": "Continue antibiotics with serial abdominal examination",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2",
          "choiceLabel": "Add operative exploration with pelvic drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v2",
          "choiceLabel": "Add image-guided pelvic catheter drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        }
      ]
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-postoperative-abscess-drainage.v1",
    "nodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2",
        "choiceLabel": "Continue antibiotics with serial abdominal examination"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2",
        "choiceLabel": "Add operative exploration with pelvic drainage"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v2",
        "choiceLabel": "Add image-guided pelvic catheter drainage"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

### salvage: case.topic.appendix-appendicitis.salvage-post-source-control-antibiotics.v1

Exact node `node.topic.appendix-appendicitis.post-source-control-antibiotics.v2`; question `question.topic.appendix-appendicitis.post-source-control-antibiotics.v2`; concept `concept.appendix-appendicitis.recovered-after-source-control-antibiotics.v1`.

Acceptance skip reason: Case contains scored nodes outside the manager PASS list.

Previous independent evidence: [question-topic-appendix-appendicitis-review2-20261111.json](question-topic-appendix-appendicitis-review2-20261111.json), exact verdict **PASS**.

#### Exact former visible context

```json
{
  "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
  "caseSha256": "5f825afdbe10bddefd2e82a00a3b30825c9192cc49381068e4346fef3f94421a",
  "chiefComplaint": "Pain after appendectomy",
  "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode.",
  "patientDisplayName": "Maya Collins",
  "demographics": {
    "ageYears": 35,
    "sexLabel": "Female"
  },
  "finiteProfiles": [
    {
      "id": "profile.topic.appendix-appendicitis.postoperative-source-control.v2",
      "prototypeDemographics": {
        "ageYears": 35,
        "sexLabel": "Female"
      },
      "chiefComplaint": "Pain after appendectomy",
      "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode."
    }
  ],
  "currentNodeId": "node.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
  "previousScoredNodesAndAllFeedback": [
    {
      "id": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
      "questionVariantId": "question.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
      "primaryConceptId": "concept.appendix-appendicitis.postoperative-deep-infection-imaging.v2",
      "currentUpdate": "During this same episode, the hospital performed abdominal and pelvic CT. The transferred report says no collection is seen on the supplied images. Its image manifest lists a scout and precontrast axial images. The scanner log records both precontrast and intravenous-contrast acquisitions covering the abdomen and pelvis; the source archive contains the complete postcontrast dataset, available for current radiologist review. Symptoms and examination have not changed since that acquisition. Creatinine is within its reporting interval and no iodinated-contrast reaction occurred.",
      "stem": "Which imaging action should the acute-care team recommend next for {patientName}'s renewed postoperative symptoms on this acquisition and transfer record?",
      "answerChoices": [
        {
          "id": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.repeat-ct.v2",
          "label": "Repeat contrast-enhanced abdominal and pelvic CT",
          "isCorrect": false,
          "rationale": "A repeat acquisition could be necessary for inadequate source images or a changed clinical state. Here the complete current contrast acquisition already exists and is available for review, while the reassuring report covers only the transferred subset.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.archive-review.v2",
          "label": "Review the archived contrast-enhanced abdominal and pelvic CT",
          "isCorrect": true,
          "rationale": "The renewed illness still requires source localization, but the negative subset report cannot settle it. The acquisition log and actual archive establish that the needed current contrast images exist; reviewing them addresses the unresolved question without duplicating acquisition.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.mri.v2",
          "label": "Obtain contrast-enhanced abdominal and pelvic MRI",
          "isCorrect": false,
          "rationale": "MRI is a real cross-sectional alternative, but the supplied record already contains the current contrast CT acquisition for the clinical question. Changing modalities does not first resolve the evidentiary error in accepting a subset report. No universal CT-versus-MRI ranking is claimed.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "A reassuring interpretation applies to the supplied images, not to a different dataset still in the archive. Renewed fever and pain after recovery require source localization. The record establishes that complete current contrast CT images were acquired and remain available; review those images before repeating or replacing that acquisition. This conclusion depends on unchanged clinical status and adequate source images, not on the mere absence of exported files.",
      "sourceLabels": [
        "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
        "SAGES guideline for the diagnosis and treatment of appendicitis",
        "Intra-abdominal infections survival guide, Global Alliance 2024",
        "WSES global intra-abdominal infection guidelines, 2017"
      ],
      "resultGateAfter": null,
      "terminalDispositions": []
    },
    {
      "id": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
      "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
      "primaryConceptId": "concept.appendix-appendicitis.localized-postoperative-abscess-drainage.v1",
      "currentUpdate": "Review of the archived intravenous-contrast CT shows a 5.5-cm rim-enhancing pelvic collection containing gas, adjacent to the bladder and rectum. The interventional radiologist reviews the access-plane images: posterior to the collection are pelvic fat and overlying soft tissue; bowel and major vessels lie anterior or lateral to that plane. There is no diffuse intraperitoneal fluid. No enteric contrast was administered. Fever and focal pain persist during active intravenous antibiotic treatment. {patientName} remains alert with stable blood pressure and no diffuse rigidity.",
      "stem": "Which treatment plan should be recommended now for {patientName}'s continuing postoperative illness?",
      "answerChoices": [
        {
          "id": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2",
          "label": "Continue antibiotics with serial abdominal examination",
          "isCorrect": false,
          "rationale": "Stable circulation does not establish resolution of an organized source. Persistent fever and pain with the represented collection favor evacuation while the existing antibiotics continue.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2",
          "label": "Add operative exploration with pelvic drainage",
          "isCorrect": false,
          "rationale": "Operation is appropriate for generalized contamination, uncontrolled leakage or anatomy that prevents effective less invasive control. The current observations demonstrate a localized target with assessed access anatomy and no generalized peritonitis. The IV-only study does not establish that a bowel leak is impossible.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v2",
          "label": "Add image-guided pelvic catheter drainage",
          "isCorrect": true,
          "rationale": "Persistent illness and an organized collection support evacuation. The radiologist-supplied geometry permits an image-guided approach while antibiotics continue. Clinical response and drainage findings must still be assessed; this is not proof that every leak has been excluded.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "Persistent fever and pain with an organized localized collection support evacuation despite stable circulation. The assessed geometry and absence of generalized peritonitis favor image-guided drainage with continued antibiotics. The CT was acquired with intravenous contrast only: no claim of a negative enteric-contrast leak study is made. An uncontrolled bowel source or clinical deterioration would require renewed assessment and may require operation.",
      "sourceLabels": [
        "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
        "SAGES guideline for the diagnosis and treatment of appendicitis",
        "Intra-abdominal infections survival guide, Global Alliance 2024",
        "WSES global intra-abdominal infection guidelines, 2017"
      ],
      "resultGateAfter": null,
      "terminalDispositions": []
    }
  ],
  "sourceRuntimeNodeSha256": "e905b9e9b651421cd55f98e0e9e635343875db1bca53a4b907f4f9d7ac81f586",
  "sourceQuestionSha256": "a9bd45f43abb62f75525fa3b56e4435244bba51129f371149e055312578f9508"
}
```

The complete former case and current node are retained in JSON at `salvage.items[].before`; all seven pre-salvage cases, ten questions and timing rows remain at `salvage.snapshot` and in `APPENDIX_TOPIC_PRE_SALVAGE_ARTIFACTS`. The original thirteen-node v1 snapshot and frozen PASS contexts are also unchanged.

#### New standalone after

Patient: **Maya Collins**, 35-year-old female. Chief complaint: **Recovery review**.

{patientName}, a 35-year-old woman, attends the clinic with hospital records of a pelvic collection after appendectomy for a perforated appendix.

Finite clinic profile (new case/profile identity; clinical review pending):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.salvage-post-source-control-antibiotics.v1",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Recovery review",
    "presentation": "{patientName}, a 35-year-old woman, attends the clinic with hospital records of a pelvic collection after appendectomy for a perforated appendix."
  }
]
```

Current update, unchanged: At later clinic review, catheter drainage has evacuated the collection, and the treating team has documented source control without ongoing bowel leakage. {patientName} has received four days of active antibiotics after drainage. She is afebrile, eating, walking and free of abdominal pain. Her leukocyte count has fallen substantially and remains slightly above the laboratory reference interval. She is immunocompetent.

Complete task, unchanged: **Which antibiotic plan should be recommended now for {patientName} at this later review?**

**key shown first for review only.** Runtime choices shuffle.

- KEY: Stop antibiotic treatment (choice.topic.appendix-appendicitis.post-source-control-antibiotics.stop-course.v2)

  Exact passed rationale: Adequate source control, four days of active therapy and clinical recovery support stopping treatment. An isolated falling mildly elevated leukocyte count does not establish a need for extension.

- Distractor: Continue treatment until the leukocyte count normalizes (choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v2)

  Exact passed rationale: Waiting for every inflammatory laboratory value to normalize can prolong therapy after adequate source control and clinical recovery. Fixed short-course evidence supports ending the completed course in this represented patient.

- Distractor: Continue treatment pending repeat abdominal and pelvic CT (choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v2)

  Exact passed rationale: Clinical recovery after adequate drainage supports ending the completed course. New or persistent illness would establish a separate indication for CT assessment of residual infection while treatment is reassessed.

Exact passed explanation: The relevant endpoint combines adequate source control, a completed active short course and clinical recovery. The fixed-course evidence does not require normalization of every inflammatory value. A recurrence of illness would trigger reassessment of the source and treatment plan.

Prior scored tasks, updates and answer feedback in this new case: **none**. Result gate: `null`; no executable service requests are installed.

#### Minimal-context and sequence audit

```json
{
  "header": "Maya's existing age/sex, clinic review, appendectomy and preceding pelvic collection establish what collection the update refers to. No historical fever is restated as current illness. The current stable acuity follows the already documented recovery.",
  "interpret": "The preserved update still requires interpreting the falling mildly elevated count against documented source control and recovery before deciding the endpoint. No completion or stop conclusion was added.",
  "absence": "The previous abscess-imaging and drainage questions and all their feedback are absent. Actual drainage, elapsed active therapy and current response remain explicit in the passed update."
}
```

#### Concrete author gate, unchanged clinical objective

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Distinguish a falling mildly elevated leukocyte count from persistent infection by using the afebrile pain-free functional recovery after documented source control.",
  "apply": "Apply the supported short-course endpoint to the actual days received and recovery rather than declaring the course complete before asking the learner to decide.",
  "closestError": "Continue antibiotics until the leukocyte count enters the laboratory reference interval.",
  "decidingObservation": "Documented source control and four days of active therapy with afebrile, pain-free recovery despite a mildly abnormal falling leukocyte count.",
  "consequence": "Unnecessary antimicrobial exposure and investigation.",
  "deletionTest": "Deleting source-control adequacy or clinical recovery invalidates the stop recommendation. The mildly abnormal falling count creates the closest competing endpoint. Four days is the constructed completed course with direct support from Global Alliance statement 8, not a newly authored mandatory minimum.",
  "counterfactual": "Replace recovery with renewed deep pain and fever. Continuing active treatment while obtaining CT to assess a residual source becomes the best offered plan, with duration determined after reassessment.",
  "counterfactualChoiceId": "imaging-clearance",
  "cueAttack": "The presentation states only what was received and observed. The task does not call the course completed and the key is a plain stopping action. Laboratory normalization and repeat CT remain credible competing endpoints with rationale kept after the answer. The CT-containing choice retains exact test timing metadata.",
  "stageCategory": "Antibiotic management at later recovery review after documented source control and an observed active-treatment interval.",
  "difficulty": "Predicted moderate for PGY-2/3 from treating incomplete laboratory normalization as treatment failure despite source control and recovery.",
  "oneBestAnswer": "The represented completed-course scenario fits fixed short-course evidence. Minimum duration, resistant pathogens, immunosuppression and unresolved source-control scenarios require separate decisions.",
  "sequenceCheck": "Standalone salvage: one exact previously passed node with no preceding scored task, result gate or answer feedback. The clinic header supplies only patient identity and the existing episode; all deciding observations remain in the preserved presentation/update.",
  "repairRecord": "Manager-directed skipped-PASS salvage. Copied every scored field and the exact question, removed companions, and added only existing episode context. Former nonfinal nodes receive required neutral final-answer dispositions with verbatim choice rationale. The new visible case requires independent review; no PASS is inferred.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v2",
      "temptation": "Use a mildly abnormal leukocyte count as proof of ongoing infection despite recovery.",
      "rankingRationale": "Waiting for every inflammatory laboratory value to normalize can prolong therapy after adequate source control and clinical recovery. Fixed short-course evidence supports ending the completed course in this represented patient.",
      "counterfactual": "Renewed fever, pain or organ dysfunction would require a fresh source-control assessment and a supported active-treatment plan.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.completed-short-course"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v2",
      "temptation": "Require another source-imaging assessment despite documented source control and clinical recovery.",
      "rankingRationale": "Clinical recovery after adequate drainage supports ending the completed course. New or persistent illness would establish a separate indication for CT assessment of residual infection while treatment is reassessed.",
      "counterfactual": "Recurrent deep pain and fever would support CT assessment for a residual or new source while therapy is reassessed.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.completed-short-course",
        "claim.appendix-appendicitis.postoperative-ct"
      ]
    }
  ]
}
```

The interpretation, closest competitor, deciding observation and decision-changing counterfactual above are reused from the passed item. This salvage changes neither the scored rule nor the qualifying clinical evidence. The updated sequence check removes all preceding task/feedback dependencies.

#### Exactness, completion and integration

```json
{
  "sourceQuestionSha256": "a9bd45f43abb62f75525fa3b56e4435244bba51129f371149e055312578f9508",
  "salvageQuestionSha256": "a9bd45f43abb62f75525fa3b56e4435244bba51129f371149e055312578f9508",
  "sourceScoredNodeSha256": "889642bdafaccb3a77d2bddf8109de6f8dc3c2fe215450efd74319aa1bdb19ac",
  "salvageScoredNodeSha256": "889642bdafaccb3a77d2bddf8109de6f8dc3c2fe215450efd74319aa1bdb19ac",
  "scoredProjectionPolicy": {
    "excludedFields": [
      "terminalDispositions"
    ],
    "reason": "Standalone final-answer completion metadata only. All task, option, feedback, update, exhibit, source, shuffle, result-gate and identity fields compare exactly. Full original runtime-node hashes are retained separately."
  },
  "sourceRuntimeNodeSha256": "e905b9e9b651421cd55f98e0e9e635343875db1bca53a4b907f4f9d7ac81f586",
  "salvageRuntimeNodeSha256": "e905b9e9b651421cd55f98e0e9e635343875db1bca53a4b907f4f9d7ac81f586",
  "caseCompletion": {
    "addedDispositions": 0,
    "kind": "no_terminal_outcome",
    "clinicalRationale": "Verbatim corresponding existing choice rationale; no new clinical statement or simulated outcome."
  },
  "salvageCaseSha256": "e5bba9491e99ef33acb472e03e15c710645fa8cef8cafc53fcfd484d08a489ff",
  "exactAfterSha256": "ea02868748b315213f66b76cf9267c9ef171d25204ef4ff1db51c775cbe43cbd"
}
```

Integration disposition: Standalone composition ready for re-review and later manager admission; no shared-file binding changed.

#### Evidence and testing metadata

Claims: `claim.appendix-appendicitis.completed-short-course`, `claim.appendix-appendicitis.postoperative-ct`. Full claims, original source dates, authority and reuse assessments are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json). No fresh source retrieval or verification is implied. The header reuses existing fictional patient/episode observations.

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-post-source-control-antibiotics.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.completed-short-course",
          "claim.appendix-appendicitis.postoperative-ct"
        ]
      },
      {
        "fields": [
          "answerChoices[id=wbc-normalization].label",
          "answerChoices[id=wbc-normalization].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.completed-short-course"
        ]
      },
      {
        "fields": [
          "answerChoices[id=stop-course].label",
          "answerChoices[id=stop-course].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.completed-short-course"
        ]
      },
      {
        "fields": [
          "answerChoices[id=imaging-clearance].label",
          "answerChoices[id=imaging-clearance].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.completed-short-course",
          "claim.appendix-appendicitis.postoperative-ct"
        ]
      },
      {
        "fields": [
          "decisionNodes[id=node.topic.appendix-appendicitis.post-source-control-antibiotics.v2].terminalDispositions[].clinicalRationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.completed-short-course",
          "claim.appendix-appendicitis.postoperative-ct"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The later update explicitly supersedes the original febrile state. Earlier revised drainage feedback gives neither a duration nor a stopping rule. Source control is documented here rather than assumed from a planned procedure."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.salvage-post-source-control-antibiotics.v1",
    "nodeId": "node.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v2",
          "choiceLabel": "Continue treatment until the leukocyte count normalizes",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.stop-course.v2",
          "choiceLabel": "Stop antibiotic treatment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v2",
          "choiceLabel": "Continue treatment pending repeat abdominal and pelvic CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  "originalTimingRetained": {
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "nodeId": "node.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v2",
          "choiceLabel": "Continue treatment until the leukocyte count normalizes",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.stop-course.v2",
          "choiceLabel": "Stop antibiotic treatment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v2",
          "choiceLabel": "Continue treatment pending repeat abdominal and pelvic CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-post-source-control-antibiotics.v1",
    "nodeId": "node.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v2",
        "choiceLabel": "Continue treatment until the leukocyte count normalizes"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.stop-course.v2",
        "choiceLabel": "Stop antibiotic treatment"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v2",
        "choiceLabel": "Continue treatment pending repeat abdominal and pelvic CT"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

### salvage: case.topic.appendix-appendicitis.salvage-post-abscess-interval-appendectomy.v1

Exact node `node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1`; question `question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1`; concept `concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1`.

Acceptance skip reason: Not in active source; exact PASS survives only in a retained reviewed context containing unaccepted companions.

Previous independent evidence: [question-topic-appendix-appendicitis-review-20261111.json](question-topic-appendix-appendicitis-review-20261111.json), exact verdict **PASS**.

#### Exact former visible context

```json
{
  "caseId": "case.topic.appendix-appendicitis.post-abscess-lesion.v1",
  "caseSha256": "98a6639eda35a27d4d668232211e4b013f9f3e3c41c22df9729f5fe5e9026626",
  "chiefComplaint": "Abscess follow-up",
  "presentation": "{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. His pain and fever have resolved. Interval abdominal and pelvic CT shows collapse of the collection but persistent nodularity at the appendiceal-cecal junction. Residual inflammatory thickening obscures the appendiceal base and the nodule's organ of origin. He has never undergone colonoscopy.",
  "patientDisplayName": "Owen Mercer",
  "demographics": {
    "ageYears": 62,
    "sexLabel": "Male"
  },
  "finiteProfiles": [
    {
      "id": "profile.topic.appendix-appendicitis.post-abscess-lesion.v1",
      "prototypeDemographics": {
        "ageYears": 62,
        "sexLabel": "Male"
      },
      "chiefComplaint": "Abscess follow-up",
      "presentation": "{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. His pain and fever have resolved. Interval abdominal and pelvic CT shows collapse of the collection but persistent nodularity at the appendiceal-cecal junction. Residual inflammatory thickening obscures the appendiceal base and the nodule's organ of origin. He has never undergone colonoscopy."
    }
  ],
  "currentNodeId": "node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
  "previousScoredNodesAndAllFeedback": [
    {
      "id": "node.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
      "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
      "primaryConceptId": "concept.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
      "stem": "Which investigation should be completed before planning resection of {patientName}'s persistent right-lower-quadrant lesion?",
      "answerChoices": [
        {
          "id": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.core-biopsy.v1",
          "label": "CT-guided core biopsy of the appendiceal nodule",
          "isCorrect": false,
          "rationale": "A needle sample targets the appendiceal lesion but supplies limited tissue and leaves synchronous colonic disease unexamined. Current guidance supports colonoscopy in this preoperative setting.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.repeat-ct.v1",
          "label": "Contrast-enhanced abdominal and pelvic CT",
          "isCorrect": false,
          "rationale": "The available interval CT has already mapped a resolved collection and a persistent focal lesion. With infection clinically resolved, repeating that acquisition leaves the required colonic assessment outstanding.",
          "serviceRequest": null
        },
        {
          "id": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.colonoscopy.v1",
          "label": "Colonoscopy with examination of the cecum",
          "isCorrect": true,
          "rationale": "The older post-abscess patient with a persistent appendiceal abnormality warrants evaluation for neoplasia. Colonoscopy assesses synchronous colonic lesions that can alter resection planning.",
          "serviceRequest": null
        }
      ],
      "shuffleAnswers": true,
      "explanation": "Resolution of an appendiceal abscess leaves an underlying-neoplasm question in this older adult with a persistent nodule. Colonoscopy examines the colon for synchronous disease relevant to resection planning.",
      "sourceLabels": [
        "Diagnosis and treatment of acute appendicitis, 2020 WSES update",
        "SAGES guideline for the diagnosis and treatment of appendicitis",
        "ASCRS clinical practice guidelines for appendiceal neoplasms, 2025",
        "Intra-abdominal infections survival guide, Global Alliance 2024",
        "WSES global intra-abdominal infection guidelines, 2017"
      ],
      "resultGateAfter": null,
      "terminalDispositions": []
    }
  ],
  "sourceRuntimeNodeSha256": "0b478f66605a9033715b1b6fcd38e0341fba8c25973c37febb1a34ea8f0c36dd",
  "sourceQuestionSha256": "9362ccfb178d9f0d1a684c314a618be62c6486ba75155011836e70c45ae56d55"
}
```

The complete former case and current node are retained in JSON at `salvage.items[].before`; all seven pre-salvage cases, ten questions and timing rows remain at `salvage.snapshot` and in `APPENDIX_TOPIC_PRE_SALVAGE_ARTIFACTS`. The original thirteen-node v1 snapshot and frozen PASS contexts are also unchanged.

#### New standalone after

Patient: **Owen Mercer**, 62-year-old male. Chief complaint: **Abscess follow-up**.

{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. Pain and fever have resolved, but interval CT showed persistent nodularity near the cecum after the collection collapsed.

Finite clinic profile (new case/profile identity; clinical review pending):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.salvage-post-abscess-interval-appendectomy.v1",
    "prototypeDemographics": {
      "ageYears": 62,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Abscess follow-up",
    "presentation": "{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. Pain and fever have resolved, but interval CT showed persistent nodularity near the cecum after the collection collapsed."
  }
]
```

Current update, unchanged: At follow-up, {patientName}'s colonoscopy has reached the cecum and shows normal mucosa, including the appendiceal orifice. After the surrounding inflammation clears, repeat CT traces the residual mural nodule to the retrocecal appendiceal tip. A normal segment separates it from the cecum, and the base is free. No peritoneal or distant lesions are seen. He is fit for surgery.

Complete task, unchanged: **Which definitive plan should be recommended for {patientName}'s right-lower-quadrant lesion after this interval reassessment?**

**key shown first for review only.** Runtime choices shuffle.

- KEY: Perform interval appendectomy with intact retrieval (choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.interval-appendectomy.v1)

  Exact passed rationale: Persistent suspicious appendiceal imaging after an abscess in this fit older patient supports interval appendectomy. The free base and absence of established invasive cancer support obtaining an intact specimen before deciding on a larger oncologic operation.

- Distractor: Continue surveillance with interval abdominal CT (choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.surveillance.v1)

  Exact passed rationale: Normal cecal mucosa does not resolve the persistent appendiceal mural abnormality. In this older post-abscess patient with suspicious imaging, current conditional guidance favors interval appendectomy for tissue evaluation.

- Distractor: Perform oncologic right hemicolectomy with nodes (choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.right-colectomy.v1)

  Exact passed rationale: Right hemicolectomy fits an established invasive localized carcinoma. This record supplies a suspicious localized appendix lesion with a free base and definitive histology pending.

Exact passed explanation: The colonoscopy evaluated the colonic lumen. The persistent appendiceal mural lesion still requires its own tissue assessment. In this fit older post-abscess patient, interval appendectomy with intact retrieval is the favored proposed plan. Definitive histology governs any subsequent oncologic extension.

Prior scored tasks, updates and answer feedback in this new case: **none**. Result gate: `null`; no executable service requests are installed.

#### Minimal-context and sequence audit

```json
{
  "header": "Owen's existing age/sex, treated abscess, resolved symptoms and persistent interval nodule are retained. The never-colonoscopy sentence and unaccepted colonic-evaluation task/feedback are omitted. The passed update preserves the actual complete colonoscopy and later CT.",
  "interpret": "Normal mucosa must still be distinguished from a mural appendiceal lesion, then the new tip/base anatomy must guide the resection field. The header supplies no recommendation.",
  "absence": "The retained old two-part case remains exact as history. This new single-node case does not inherit its whole-sequence PASS and requires context-specific re-review."
}
```

#### Concrete author gate, unchanged clinical objective

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Use the interval CT to resolve the lesion's appendiceal origin and free base, while limiting the normal colonoscopy result to the sampled colonic lumen.",
  "apply": "Choose interval organ resection for definitive pathology, with the free base limiting the presently justified extent.",
  "closestError": "Treat normal colonoscopy plus symptom resolution as permission to leave the persistent nodule under routine imaging surveillance.",
  "decidingObservation": "New interval localization to the retrocecal appendiceal tip with a free base, paired with normal cecal mucosa and definitive appendiceal histology pending.",
  "consequence": "Occult appendiceal neoplasia can remain uncharacterized, or an unnecessarily large resection can be undertaken.",
  "deletionTest": "Deleting the update restores uncertain organ origin and an obscured base, so the specific limited operation cannot be justified from the earlier record. The repeat CT supplies the appendiceal compartment and actual clearance anatomy. Normal colonic mucosa is valid evidence about its sampled region. Deleting the persistent lesion would return the contested routine-interval policy.",
  "counterfactual": "Replace the unresolved lesion with permanent evidence of invasive localized appendiceal adenocarcinoma. Right hemicolectomy becomes the best offered plan.",
  "counterfactualChoiceId": "right-colectomy",
  "cueAttack": "All choices are specific definitive management plans. The CT surveillance option has the same exact testing metadata as every offered CT. The key has comparable length to both alternatives. Normal colonoscopy is retained as meaningful evidence that can tempt a scope error.",
  "stageCategory": "Definitive elective plan after infection resolution and colonic assessment.",
  "difficulty": "Predicted moderate to hard for PGY-2/3 from confusing sampled mucosa with appendiceal pathology and choosing either under-treatment or premature oncologic extent.",
  "oneBestAnswer": "The suspicious residual lesion, older age and fitness support interval appendectomy, while definitive invasive histology remains pending.",
  "sequenceCheck": "Standalone salvage: one exact previously passed node with no preceding scored task, result gate or answer feedback. The clinic header supplies only patient identity and the existing episode; all deciding observations remain in the preserved presentation/update.",
  "repairRecord": "Manager-directed skipped-PASS salvage. Copied every scored field and the exact question, removed companions, and added only existing episode context. Former nonfinal nodes receive required neutral final-answer dispositions with verbatim choice rationale. The new visible case requires independent review; no PASS is inferred.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.surveillance.v1",
      "temptation": "Combine symptom resolution and normal colonoscopy into a complete exclusion of underlying neoplasia.",
      "rankingRationale": "Normal cecal mucosa does not resolve the persistent appendiceal mural abnormality. In this older post-abscess patient with suspicious imaging, current conditional guidance favors interval appendectomy for tissue evaluation.",
      "counterfactual": "Prohibitive operative risk could favor a surveillance strategy after explicit multidisciplinary assessment of the residual uncertainty.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.interval-tissue-evaluation",
        "claim.appendix-appendicitis.post-abscess-neoplasm"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.right-colectomy.v1",
      "temptation": "Treat every suspicious appendiceal lesion as an already proven invasive cancer.",
      "rankingRationale": "Right hemicolectomy fits an established invasive localized carcinoma. This record supplies a suspicious localized appendix lesion with a free base and definitive histology pending.",
      "counterfactual": "Permanent tissue showing invasive localized adenocarcinoma would favor this oncologic extent.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.intact-abnormal-appendix",
        "claim.appendix-appendicitis.adenocarcinoma-colectomy"
      ]
    }
  ]
}
```

The interpretation, closest competitor, deciding observation and decision-changing counterfactual above are reused from the passed item. This salvage changes neither the scored rule nor the qualifying clinical evidence. The updated sequence check removes all preceding task/feedback dependencies.

#### Exactness, completion and integration

```json
{
  "sourceQuestionSha256": "9362ccfb178d9f0d1a684c314a618be62c6486ba75155011836e70c45ae56d55",
  "salvageQuestionSha256": "9362ccfb178d9f0d1a684c314a618be62c6486ba75155011836e70c45ae56d55",
  "sourceScoredNodeSha256": "841ff01c102c78fd0db14475dcac9ad6ad4465e0737e228010efa74b1dcec520",
  "salvageScoredNodeSha256": "841ff01c102c78fd0db14475dcac9ad6ad4465e0737e228010efa74b1dcec520",
  "scoredProjectionPolicy": {
    "excludedFields": [
      "terminalDispositions"
    ],
    "reason": "Standalone final-answer completion metadata only. All task, option, feedback, update, exhibit, source, shuffle, result-gate and identity fields compare exactly. Full original runtime-node hashes are retained separately."
  },
  "sourceRuntimeNodeSha256": "0b478f66605a9033715b1b6fcd38e0341fba8c25973c37febb1a34ea8f0c36dd",
  "salvageRuntimeNodeSha256": "0b478f66605a9033715b1b6fcd38e0341fba8c25973c37febb1a34ea8f0c36dd",
  "caseCompletion": {
    "addedDispositions": 0,
    "kind": "no_terminal_outcome",
    "clinicalRationale": "Verbatim corresponding existing choice rationale; no new clinical statement or simulated outcome."
  },
  "salvageCaseSha256": "de7317e7089f0c3b76555f04f634eb363290691d744353aa9b5c0d6555071050",
  "exactAfterSha256": "59d769ace44b536a8223b8ededad99e5034ce73004b7fa0564ba2aa45d2dd659"
}
```

Integration disposition: Standalone composition ready for re-review and later manager admission; no shared-file binding changed.

#### Evidence and testing metadata

Claims: `claim.appendix-appendicitis.interval-tissue-evaluation`, `claim.appendix-appendicitis.intact-abnormal-appendix`, `claim.appendix-appendicitis.adenocarcinoma-colectomy`, `claim.appendix-appendicitis.post-abscess-neoplasm`. Full claims, original source dates, authority and reuse assessments are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json). No fresh source retrieval or verification is implied. The header reuses existing fictional patient/episode observations.

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-post-abscess-interval-appendectomy.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.interval-tissue-evaluation",
          "claim.appendix-appendicitis.intact-abnormal-appendix",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.post-abscess-neoplasm"
        ]
      },
      {
        "fields": [
          "answerChoices[id=surveillance].label",
          "answerChoices[id=surveillance].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.interval-tissue-evaluation",
          "claim.appendix-appendicitis.post-abscess-neoplasm"
        ]
      },
      {
        "fields": [
          "answerChoices[id=interval-appendectomy].label",
          "answerChoices[id=interval-appendectomy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.interval-tissue-evaluation",
          "claim.appendix-appendicitis.intact-abnormal-appendix"
        ]
      },
      {
        "fields": [
          "answerChoices[id=right-colectomy].label",
          "answerChoices[id=right-colectomy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.intact-abnormal-appendix",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy"
        ]
      },
      {
        "fields": [
          "decisionNodes[id=node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1].terminalDispositions[].clinicalRationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.interval-tissue-evaluation",
          "claim.appendix-appendicitis.intact-abnormal-appendix",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.post-abscess-neoplasm"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The preceding explanation establishes the purpose of colonoscopy only. It supplies no interval operation. The earlier CT leaves origin and base anatomy unresolved, while this update adds actual organ localization and clearance anatomy alongside the normal mucosal result."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.salvage-post-abscess-interval-appendectomy.v1",
    "nodeId": "node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.surveillance.v1",
          "choiceLabel": "Continue surveillance with interval abdominal CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.interval-appendectomy.v1",
          "choiceLabel": "Perform interval appendectomy with intact retrieval",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.right-colectomy.v1",
          "choiceLabel": "Perform oncologic right hemicolectomy with nodes",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  "originalTimingRetained": {
    "caseId": "case.topic.appendix-appendicitis.post-abscess-lesion.v1",
    "nodeId": "node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.surveillance.v1",
          "choiceLabel": "Continue surveillance with interval abdominal CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.interval-appendectomy.v1",
          "choiceLabel": "Perform interval appendectomy with intact retrieval",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.right-colectomy.v1",
          "choiceLabel": "Perform oncologic right hemicolectomy with nodes",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.salvage-post-abscess-interval-appendectomy.v1",
    "nodeId": "node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.surveillance.v1",
        "choiceLabel": "Continue surveillance with interval abdominal CT"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.interval-appendectomy.v1",
        "choiceLabel": "Perform interval appendectomy with intact retrieval"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.right-colectomy.v1",
        "choiceLabel": "Perform oncologic right hemicolectomy with nodes"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

## Remaining manager integration decision

The original persistent-pain case declared replacement of four live CT cases. Splitting its two PASS nodes removes their shared-case dependency, and the adenocarcinoma node remains its original new-gap objective with no direct replacement inventory. The exploration node still carries the existing four-to-one live rewrite hold. This task does not change a legacy mapping, infer retirement, waive the duplicate-target guard or modify the resolver/projector. The manager must choose the supported binding before admitting that exploration case.

```json
{
  "scope": "Five new standalone case identities with unchanged question, node, choice and concept IDs. All original complete cases and timing rows remain in reviewed/pre-salvage exports and packet snapshots.",
  "rewriteHold": "Persistent-pain-exploration still carries the declared four-to-one legacy rewrite hold from batch 1. No mapping, retirement, resolver or projector changed. The adenocarcinoma objective was already a new-gap item with no direct replacement inventory; splitting it removes the shared-case dependency without changing its identity.",
  "clinicalApproval": "Every new case/profile remains needs_clinician_review. Historical PASS is not independent approval of the new visible context.",
  "selector": "Every salvage case has one scored node and no companion eligibility requirement. No selector or FSRS edits.",
  "sharedFiles": "Manager owns manifest admission, safe source/order/timing registry binding and any live rewrite decision after targeted re-review."
}
```

All original complete cases and timing/order records remain available for frozen encounters. Each salvage case has one concept and no companion eligibility condition. Existing concept IDs and FSRS history are preserved. Shared manifest, source/order/timing registry and release integration remain manager-owned. No default release was changed by this worker.

## Sources, identity and recorded shared-tree drift

```json
{
  "networkRetrievalPerformed": false,
  "newSources": 0,
  "newClaims": 0,
  "basis": "Only existing age/sex, clinic framing, hospital episode and already represented lesion history were reused from the frozen records. Every deciding observation, task, option and explanation is exact. Original source access and last-checked dates are unchanged.",
  "sourceLedger": "docs/research/sources-question-topic-appendix-appendicitis-20261111.json"
}
```

No source record, evidence statement, license assessment or source access/last-checked date changed. Safe source-link metadata remains `target="_blank"`, `rel="noopener noreferrer"`, `referrerPolicy="no-referrer"`. Exact timing classifications and choice IDs/labels are unchanged; new rows bind them to new case IDs. No fixed diagnostic wait prose or gameplay web/AI call was added.

The original wave-1 input hashes remain historical. Manager acceptance changed three assembly files before this dispatch, and those files advanced again during salvage. The fixed clinical input files and the acceptance authority records remain checked. The three manager-owned assembly files are deliberately excluded from a brittle whole-file freeze; their observed hashes and changes are recorded, and no worker edit was made to them.

```json
{
  "driftFromWave1": [
    {
      "file": "packages/clinical-content/src/index.ts",
      "previousSha256": "9b9217631c612cf22b5237808d4eedf0b065472d165190bfbcec2b691921ae5b",
      "currentSha256": "0fad854518fa1babd8fd7c6e91627df094a21ad9edf338397f7432b0d3f3e878",
      "disposition": "Observed manager batch-1 integration drift; read-only and preserved."
    },
    {
      "file": "packages/clinical-content/src/question-ship-manifest.ts",
      "previousSha256": "cc05d21e43357d1f80f6500a3c53868acf06aa2f43461b1012ba28971daf7e8a",
      "currentSha256": "c2cfc4290ab8ae067c92d24126eacd478bdb661cb3039b816ba9e3196338b0fd",
      "disposition": "Observed manager batch-1 integration drift; read-only and preserved."
    },
    {
      "file": "packages/clinical-content/src/synthetic-content.ts",
      "previousSha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
      "currentSha256": "1ce574bdf797a34ee99505ac3ad7c03cd7f09d93d8301edfd42bff1b9947a221",
      "disposition": "Observed manager batch-1 integration drift; read-only and preserved."
    }
  ],
  "concurrentIntegrationDrift": [
    {
      "file": "packages/clinical-content/src/index.ts",
      "dispatchSha256": "0fad854518fa1babd8fd7c6e91627df094a21ad9edf338397f7432b0d3f3e878",
      "observedSha256": "aa69ce2b91e00459f137b467567878d2986c0eaa00055488c43b3a9aadd3c68e",
      "disposition": "Concurrent manager assembly change during salvage; no worker edit."
    },
    {
      "file": "packages/clinical-content/src/question-ship-manifest.ts",
      "dispatchSha256": "c2cfc4290ab8ae067c92d24126eacd478bdb661cb3039b816ba9e3196338b0fd",
      "observedSha256": "b470422f55280d0a7b0fe318f0254b83be6864f57f4faa7609f32fbc2103475a",
      "disposition": "Concurrent manager assembly change during salvage; no worker edit."
    },
    {
      "file": "packages/clinical-content/src/synthetic-content.ts",
      "dispatchSha256": "1ce574bdf797a34ee99505ac3ad7c03cd7f09d93d8301edfd42bff1b9947a221",
      "observedSha256": "9c51a1e0d1fdfb4c0d28b70cb9de3695dacf0eeb87ea0b7485b6e5f154d6e56b",
      "disposition": "Concurrent manager assembly change during salvage; no worker edit."
    }
  ],
  "unexpectedDrift": []
}
```

## Owner approvals needed

Melissa Rowland retains exact clinical approval of the new case/profile contexts. This salvage introduces no new unresolved clinical comparison. The previously recorded LAMN margin, NET next-study, initial abscess, younger routine-interval and intermediate NET holds remain unchanged in the owned JSON and historical packet. Independent editorial re-review and manager admission are still needed for these five new compositions.

## Salvage validation and bounded handoff

Commands run from `C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content`. All focused and typecheck attempts, repairs and out-of-lane diagnostics are retained below. Automated checks validate structure and preservation, not clinical acceptance.

### salvage initial focused test

Command: `npm.cmd test -- --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts`. Exit code 1.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content

 ? src/question-topic-appendix-appendicitis-20261111.test.ts (39 tests | 2 failed) 76ms
     ? validates ten single-node fresh-preview cases and ten independent concept identities through the existing release representation 7ms
     ? preserves the post-acceptance dispatch inputs and records the three manager assembly changes 4ms

??????? Failed Tests 2 ???????

 FAIL  src/question-topic-appendix-appendicitis-20261111.test.ts > appendix topic explicit-import authoring sidecar > validates ten single-node fresh-preview cases and ten independent concept identities through the existing release representation
AssertionError: expected [Function] to not throw an error but '[\n  {\n    "code": "custom",\n    "m?' was thrown

- Expected:
undefined

+ Received:
"[
  {
    \"code\": \"custom\",
    \"message\": \"Every wrong final answer must have exactly one explicit terminal disposition.\",
    \"path\": [
      \"cases\",
      0,
      \"decisionNodes\",
      0,
      \"terminalDispositions\"
    ]
  },
  {
    \"code\": \"custom\",
    \"message\": \"Every wrong final answer must have exactly one explicit terminal disposition.\",
    \"path\": [
      \"cases\",
      7,
      \"decisionNodes\",
      0,
      \"terminalDispositions\"
    ]
  }
]"

 ? src/question-topic-appendix-appendicitis-20261111.test.ts:111:65
    109| describe("appendix topic explicit-import authoring sidecar", () => {
    110|   it("validates ten single-node fresh-preview cases and ten independen?
    111|     expect(() => validateSyntheticClinicalRelease(preview)).not.toThro?
       |                                                                 ^
    112|     expect(cases).toHaveLength(10);
    113|     expect(questions).toHaveLength(10);

????????????????????????[1/2]?

 FAIL  src/question-topic-appendix-appendicitis-20261111.test.ts > appendix topic explicit-import authoring sidecar > preserves the post-acceptance dispatch inputs and records the three manager assembly changes
AssertionError: packages/clinical-content/src/index.ts: expected 'aa69ce2b91e00459f137b467567878d2986c0?' to be '0fad854518fa1babd8fd7c6e91627df094a21?' // Object.is equality

Expected: "0fad854518fa1babd8fd7c6e91627df094a21ad9edf338397f7432b0d3f3e878"
Received: "aa69ce2b91e00459f137b467567878d2986c0eaa00055488c43b3a9aadd3c68e"

 ? src/question-topic-appendix-appendicitis-20261111.test.ts:160:66


????????????????????????[2/2]?


 Test Files  1 failed (1)
      Tests  2 failed | 37 passed (39)
   Start at  14:30:37
   Duration  540ms (transform 230ms, setup 0ms, import 352ms, tests 76ms, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts
```

### salvage initial package typecheck

Command: `npm.cmd run typecheck`. Exit code 1.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-program-batch2-accepted-data-20261111.ts(3796,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(3835,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(3873,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(3934,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(3973,5): error TS2353: Object literal may only specify known properties, and '"shuffleAnswers"' does not exist in type 'QuestionVariant'.
src/question-program-batch2-accepted-data-20261111.ts(7999,5): error TS2322: Type '"applied_science"' is not assignable to type '"anatomy" | "definition" | "disposition" | "epidemiology" | "evaluation" | "management" | "presentation" | "safety_boundary"'.
src/question-ship-case-replacements.ts(63,21): error TS7053: Element implicitly has an 'any' type because expression of type 'string' can't be used to index type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: "synthetic_unapproved_prototype"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: "anatomy" | ... 5 more ... | "workup"; }[]; cases: { ...; }[]; }; }'.
  No index signature with a parameter of type 'string' was found on type '{ catalog: { id: string; schemaVersion: 1; publicationStatus: "synthetic_unapproved_prototype"; disclaimer: string; concepts: { id: string; displayName: string; learningObjective: string; earliestFacilityStage: number; conceptType: "anatomy" | ... 5 more ... | "workup"; }[]; cases: { ...; }[]; }; }'.
src/question-ship-case-replacements.ts(63,60): error TS7006: Parameter 'clinicalCase' implicitly has an 'any' type.
src/question-ship-case-replacements.ts(70,63): error TS18048: 'source' is possibly 'undefined'.
src/question-ship-case-replacements.ts(70,98): error TS18048: 'source' is possibly 'undefined'.
src/question-ship-case-replacements.ts(72,32): error TS18048: 'source' is possibly 'undefined'.
src/question-ship-case-replacements.ts(74,28): error TS2345: Argument of type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; } | undefined' is not assignable to parameter of type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.
  Type 'undefined' is not assignable to type '{ id: string; pediatricProfile?: { version: "pediatric-patient-profile.v1"; requiresParent: true; clinicalScope: "outpatient"; } | undefined; displayName: string; patientPresentationVariantId: string; ... 18 more ...; learningSummary: string; }'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(193,56): error TS7006: Parameter 'check' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(196,37): error TS7006: Parameter 'check' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(201,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(216,66): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(217,42): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(219,44): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,26): error TS2551: Property 'COLON_TOPIC_ITEMS' does not exist on type 'typeof import("C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111")'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,53): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,80): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(260,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(297,49): error TS7006: Parameter 'gate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,57): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,84): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1737,19): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1742,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,60): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,86): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1760,7): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1761,16): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1762,22): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1764,16): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1769,60): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1771,20): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1772,22): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,60): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,14): error TS7006: Parameter 'candidate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,52): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1775,15): error TS7006: Parameter 'candidate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1776,21): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1778,7): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,59): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,82): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,36): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,42): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1843,38): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,41): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,64): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1853,53): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,78): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,105): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1862,19): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1866,40): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1869,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,40): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,67): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,92): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1919,34): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,47): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,74): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,99): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1944,26): error TS7006: Parameter 'choice' implicitly has an 'any' type.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

### salvage focused test after terminal metadata repair

Command: `npm.cmd test -- --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts`. Exit code 0.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  14:34:05
   Duration  670ms (transform 249ms, setup 0ms, import 458ms, tests 82ms, environment 0ms)

```

### salvage typecheck after terminal metadata repair

Command: `npm.cmd run typecheck`. Exit code 1.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-appendix-appendicitis-20261111.test.ts(404,28): error TS2339: Property 'clinicalRationale' does not exist on type '{ answerChoiceId: string; kind: "no_terminal_outcome"; consequenceNarrative: string; clinicalRationale: string; sourceLabels: string[]; } | { answerChoiceId: string; kind: "terminal_outcome"; outcome: { ...; }; }'.
  Property 'clinicalRationale' does not exist on type '{ answerChoiceId: string; kind: "terminal_outcome"; outcome: { id: string; severity: "major" | "minor"; narrative: string; causalFraming: "expected_consequence" | "possible_consequence"; clinicalRationale: string; sourceLabels: string[]; }; }'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(193,56): error TS7006: Parameter 'check' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(196,37): error TS7006: Parameter 'check' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(201,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(216,66): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(217,42): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(219,44): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,26): error TS2551: Property 'COLON_TOPIC_ITEMS' does not exist on type 'typeof import("C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111")'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,53): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,80): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(260,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(297,49): error TS7006: Parameter 'gate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,57): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,84): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1737,19): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1742,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,60): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,86): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1760,7): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1761,16): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1762,22): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1764,16): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1769,60): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1771,20): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1772,22): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,60): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,14): error TS7006: Parameter 'candidate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,52): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1775,15): error TS7006: Parameter 'candidate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1776,21): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1778,7): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,59): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,82): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,36): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,42): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1843,38): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,41): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,64): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1853,53): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,78): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,105): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1862,19): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1866,40): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1869,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,40): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,67): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,92): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1919,34): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,47): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,74): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,99): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1944,26): error TS7006: Parameter 'choice' implicitly has an 'any' type.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

### salvage final focused test

Command: `npm.cmd test -- --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts`. Exit code 0.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  39 passed (39)
   Start at  14:36:23
   Duration  656ms (transform 278ms, setup 0ms, import 438ms, tests 80ms, environment 0ms)

```

### salvage final package typecheck

Command: `npm.cmd run typecheck`. Exit code 1.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(193,56): error TS7006: Parameter 'check' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(196,37): error TS7006: Parameter 'check' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(201,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(216,66): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(217,42): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(219,44): error TS7006: Parameter 'row' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,26): error TS2551: Property 'COLON_TOPIC_ITEMS' does not exist on type 'typeof import("C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content/src/question-topic-colon-diverticular-lower-bleeding-20261111")'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,53): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(247,80): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(260,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.test.ts(297,49): error TS7006: Parameter 'gate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,57): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1736,84): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1737,19): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1742,38): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,60): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1755,86): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1760,7): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1761,16): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1762,22): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1764,16): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1769,60): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1771,20): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1772,22): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,33): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1773,60): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,14): error TS7006: Parameter 'candidate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1774,52): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1775,15): error TS7006: Parameter 'candidate' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1776,21): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1778,7): error TS18046: 'node' is of type 'unknown'.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,59): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1788,82): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,36): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1812,42): error TS7006: Parameter 'index' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1843,38): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,41): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1847,64): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1853,53): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,78): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1861,105): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1862,19): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1866,40): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1869,36): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,40): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,67): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1898,92): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1919,34): error TS7006: Parameter 'choice' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,47): error TS2552: Cannot find name 'COLON_TOPIC_ITEMS'. Did you mean 'COLON_TOPIC_CLAIMS'?
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,74): error TS7006: Parameter 'item' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1929,99): error TS7006: Parameter 'node' implicitly has an 'any' type.
src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(1944,26): error TS7006: Parameter 'choice' implicitly has an 'any' type.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

Repair record:

```json
{
  "findings": [
    "Former first/middle nodes require explicit wrong-final-answer terminal dispositions in a one-node case. Repair will add only neutral completion metadata and preserve all scored fields.",
    "The manager changed shared assembly inputs again during this worker turn. Fixed clinical inputs remain frozen; shared assembly changes are recorded and remain outside worker ownership.",
    "Initial package typecheck reports only concurrent batch2 acceptance, case-replacement and colon-topic errors. No appendix diagnostic is reported.",
    "Focused test now passes 39/39. Typecheck identified a test-only union-narrowing error at appendix test line 404; repaired with an explicit no_terminal_outcome discriminator before reading clinicalRationale. Remaining diagnostics are concurrent colon-topic files."
  ],
  "terminalRepair": "Added two no_terminal_outcome dispositions each to exploration and drainage, the former nonfinal nodes. Each clinicalRationale is the verbatim passed choice rationale. No scored wording, options, explanation, current update or claim changed; original runtime nodes remain exact in retained snapshots.",
  "localHelperRepair": {
    "initialExitCode": 1,
    "diagnostic": "SyntaxError: Unexpected token case at [eval1]:59 during the first TS insertion helper. Nested template quoting failed before any file write.",
    "repair": "Used plain string concatenation in the generated TypeScript. The insertion helper then completed successfully."
  },
  "latest": {
    "focusedExitCode": 0,
    "testsPassed": 39,
    "testsFailed": 0,
    "typecheckExitCode": 1,
    "typecheckDiagnosticCount": 53,
    "typecheckLimitation": "All final diagnostics are in question-topic-colon-diverticular-lower-bleeding-20261111.ts and its test. No appendix diagnostics. The shared files are outside this worker lane and were preserved.",
    "jsonParse": "both owned JSON outputs pass",
    "newClinicalClaims": 0,
    "acceptedCasesPreserved": 3,
    "salvageScoredNodesPreserved": 5,
    "finalDispositionRecordsAdded": 4
  }
}
```

Final close checks: five standalone review sections and five queue entries; all five question/scored-field hashes exact; all three accepted cases exact; original complete compositions retained; both JSON files parse; no fixed clinical-input or authority drift. Only the five owned files were written.

<!-- APPENDIX-SALVAGE-FINAL-CHECKS -->

```text
Topic appendix-appendicitis
Status salvage
Files changed
  packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.ts
  packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.test.ts
  docs/research/question-topic-appendix-appendicitis-20261111.json
  docs/research/question-topic-appendix-appendicitis-20261111.md
  docs/research/sources-question-topic-appendix-appendicitis-20261111.json
Inventory Five skipped exact PASS receipts; three accepted topic cases frozen
Counts audited 5, scored items kept 5, rewritten questions 0, retired 0, new questions 0
Count basis Five new one-node case compositions; zero new concept identities or clinical claims
Case/node pairs
  case.topic.appendix-appendicitis.salvage-persistent-pain-exploration.v1 -> node.topic.appendix-appendicitis.persistent-pain-exploration.v1
  case.topic.appendix-appendicitis.salvage-invasive-adenocarcinoma-resection.v1 -> node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2
  case.topic.appendix-appendicitis.salvage-postoperative-abscess-drainage.v1 -> node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2
  case.topic.appendix-appendicitis.salvage-post-source-control-antibiotics.v1 -> node.topic.appendix-appendicitis.post-source-control-antibiotics.v2
  case.topic.appendix-appendicitis.salvage-post-abscess-interval-appendectomy.v1 -> node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1
Held/unkeyed Existing clinical holds unchanged; exploration retains the manager-owned four-to-one live rewrite decision
Research Existing permitted ledger reused; no network retrieval or new fact
Packet docs/research/question-topic-appendix-appendicitis-20261111.md; docs/research/question-topic-appendix-appendicitis-20261111.json; docs/research/sources-question-topic-appendix-appendicitis-20261111.json
Identity preservation Exact tasks/options/feedback and question records; old full cases/nodes/timings retained; accepted three untouched
Owner approvals needed Exact clinical case/profile review remains Melissa's responsibility
Integration Review only salvage.reviewQueue; manager owns manifest/timing/order bindings and live rewrite policy
Validation Focused exit 0, 39 passed / 0 failed; typecheck exit 1 on 53 out-of-lane colon-topic diagnostics; no appendix diagnostics; JSON parses pass
Open work Independent reviewer rechecks only the five salvage.reviewQueue cases. Manager retains admission, the exploration item's four-to-one rewrite decision and rerunning the package typecheck after the colon worker fixes its own module/test errors. No shared-file edits or clinical acceptance by this worker.
```

<!-- APPENDIX-SALVAGE-END -->

<!-- APPENDIX-REVIEW-ROUND-1-BEGIN -->

## Historical independent review response, November 11, 2026

This is the preserved first review-response record. The current salvage section above supersedes it for case composition, current review scope and validation. The original assignment and wave 1 audit/history remain preserved.

**13 reviewed: 3 pass-preserved, 8 revised, 2 parked.** Every returned item received one response. No new gap question was added this round. Seven revisions preserve their concept ID; the postoperative acquired-versus-reviewed CT objective receives a new concept version. All clinical content remains `needs_clinician_review`; independent editorial PASS and passing software checks confer no clinical approval.

Review input: [independent review](question-topic-appendix-appendicitis-review-20261111.json), SHA-256 `79df70da3b285676c6d00f141b6c6f63d9fdb41bca6fa4e461f79fd78df75445`. Original full definitions, cases, questions, timings, author checks and proposal hashes are preserved at `independentReviewRound1.snapshot` and in the module's reviewed exports.

| Reviewed exact variant | Status | Current exact variant | Fresh preview |
|---|---|---|---|
| question.topic.appendix-appendicitis.persistent-pain-exploration.v1 | **pass-preserved** | question.topic.appendix-appendicitis.persistent-pain-exploration.v1 | Yes |
| question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v1 | **revised** | question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2 | Yes |
| question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1 | **revised** | question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2 | Yes |
| question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 | **pass-preserved** | question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 | No; retained review context or parked |
| question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1 | **revised** | question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2 | Yes |
| question.topic.appendix-appendicitis.lamn-microscopic-margin.v1 | **parked** | Unkeyed planning slot | No; retained review context or parked |
| question.topic.appendix-appendicitis.peritoneal-mucin-referral.v1 | **revised** | question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2 | Yes |
| question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1 | **pass-preserved** | question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1 | Yes |
| question.topic.appendix-appendicitis.net-receptor-staging.v1 | **parked** | Unkeyed planning slot | No; retained review context or parked |
| question.topic.appendix-appendicitis.net-regional-resection.v1 | **revised** | question.topic.appendix-appendicitis.net-regional-resection.v2 | Yes |
| question.topic.appendix-appendicitis.postoperative-infection-imaging.v1 | **revised** | question.topic.appendix-appendicitis.postoperative-infection-imaging.v2 | Yes |
| question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1 | **revised** | question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2 | Yes |
| question.topic.appendix-appendicitis.post-source-control-antibiotics.v1 | **revised** | question.topic.appendix-appendicitis.post-source-control-antibiotics.v2 | Yes |

Fresh explicit-import preview: **10 nodes / 7 cases / 2 multi-part cases**. Eleven nonparked proposals include the passed interval-appendectomy follow-up retained only with its original preceding question. The mixed-verdict original post-abscess pair is excluded from fresh supply; its revised first question has a separate header and case. The current persistent-pain pair preserves the passed first node and its entire visible header/profile/prior context, while the changed future follow-up is a new composition requiring review. No whole-sequence PASS transfers.

All 16 original scoped source hashes are checked in the focused test. The default release and shared registries remain read-only. No commit, push, deployment, dependency installation or agent work occurred.

## Current coverage and remaining gaps

| Rank | Original testable concept group | Current disposition of proposed nodes |
|---|---|---|
| 1 | Persistent pain after imaging | pass-preserved: question.topic.appendix-appendicitis.persistent-pain-exploration.v1 |
| 2 | Operative versus antibiotics-first selection | No new scored question; original gap/hold reasoning retained below |
| 3 | Initial abscess or phlegmon treatment | No new scored question; original gap/hold reasoning retained below |
| 4 | Post-abscess neoplasm workup and tissue | revised: question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2; pass-preserved: question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 |
| 5 | Postoperative infection localization | revised: question.topic.appendix-appendicitis.postoperative-infection-imaging.v2 |
| 6 | Postoperative source-control route | revised: question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2 |
| 7 | Antibiotic endpoint after source control | revised: question.topic.appendix-appendicitis.post-source-control-antibiotics.v2 |
| 8 | Intact resection of an appendiceal lesion | revised: question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2 |
| 9 | LAMN microscopic margin and residual disease | parked: question.topic.appendix-appendicitis.lamn-microscopic-margin.v1 |
| 10 | Invasive appendiceal adenocarcinoma | revised: question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2 |
| 11 | Goblet cell adenocarcinoma | pass-preserved: question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1 |
| 12 | Appendiceal NET staging | parked: question.topic.appendix-appendicitis.net-receptor-staging.v1 |
| 13 | Appendiceal NET regional resection | revised: question.topic.appendix-appendicitis.net-regional-resection.v2 |
| 14 | Mucinous peritoneal disease | revised: question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2 |
| 15 | Routine interval surgery in younger adults | No new scored question; original gap/hold reasoning retained below |
| 16 | Intermediate-size appendiceal NET | No new scored question; original gap/hold reasoning retained below |
| 17 | Antibiotics after uncomplicated appendectomy | No new scored question; original gap/hold reasoning retained below |
| 18 | Appendicitis imaging during pregnancy | No new scored question; original gap/hold reasoning retained below |

The generic postoperative imaging rule is no longer claimed as a difficult new question. Its replacement explicitly tests evidence scope and receives a changed concept identity. The source supports contrast CT localization; retrieval versus repeat follows the constructed acquisition/transfer record, without claiming a new empirical procedure hierarchy. The original initial-abscess, younger routine-interval and intermediate-size NET policy holds remain unkeyed.

## Current before/after packet and review dispositions

Every before below is the exact reviewed v1 candidate, not an inferred reconstruction. Complete original legacy before-versions remain in the historical packet and JSON `beforeVersions`. Passed entries retain their original proposal objects exactly, including hashes. New v2 entries include a full reviewed-case before reference, complete current context, manual author gate and exact timing/order mapping. Predicted difficulty is qualitative.

### Progressive focal findings after negative CT ? pass-preserved

Reviewed: `question.topic.appendix-appendicitis.persistent-pain-exploration.v1`; original concept `concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1`. Current: `question.topic.appendix-appendicitis.persistent-pain-exploration.v1`; current concept `concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1`. Revision attempts: 0.

#### Exact reviewed before

Patient: Nora Bennett; demographics {"ageYears":46,"sexLabel":"Female"}. Chief complaint: **Persistent right-sided pain**.

{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.persistent-pain.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Persistent right-sided pain",
    "presentation": "{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable."
  }
]
```

Complete task: **Which hospital evaluation should be recommended now for {patientName}'s worsening right-sided abdominal findings?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Proceed to diagnostic abdominal laparoscopy (choice.topic.appendix-appendicitis.persistent-pain-exploration.laparoscopy.v1)

  Rationale: Progressive focal pain with new involuntary guarding keeps an operative abdominal cause consequential despite the adequate negative CT. Exploration can establish and treat the cause.

- Distractor ? Repeat contrast-enhanced abdominal and pelvic CT (choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1)

  Rationale: A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration.

- Distractor ? Continue serial abdominal examinations in hospital (choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1)

  Rationale: Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration.

Explanation: The CT was adequate, so its negative result initially supported observation. The subsequent focal progression and involuntary guarding require a fresh decision. WSES guidance supports exploration for persistent or progressive pain after negative imaging.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Reviewed full-case/current-node SHA-256: `babdd0c70249d1eaaa4512742eb0ceffebefc1568a4efb01dbace9b7e257cdce`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### After: exact PASS preserved

The before above is the unchanged after. The complete original case, current node, earlier feedback, finite profile, question and timing row are preserved in `APPENDIX_TOPIC_FROZEN_PASS_CONTEXTS`. The unchanged proposal and exact hash remain canonical.

```json
{
  "caseId": "case.topic.appendix-appendicitis.persistent-pain.v1",
  "nodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
  "exactAfterSha256": "babdd0c70249d1eaaa4512742eb0ceffebefc1568a4efb01dbace9b7e257cdce",
  "fullCaseSha256": "fd0045beb08558173ac4efdb341085af211e28da80886d4410df385ea160b950",
  "questionSha256": "23550ef630645030f5ebe54b8f7bee73b9a3e560c334a5f7953605f059e24b83",
  "scope": "Original full case retained; any current recomposition is a separate candidate and does not acquire whole-sequence PASS."
}
```

#### Response to every independent note

clarityIssues: no notes.

cues: no notes.

- fairness[0]: Diagnostic laparoscopy is the defensible best offered action: the resident must reconcile a reassuring initial scan with subsequent involuntary guarding and change the management plan. Repeat imaging and continued observation represent credible overreliance on the earlier result.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

- fairness[1]: The progression and guarding are necessary clinical discriminators, not a wording shortcut. Options have comparable specificity; no key-only overlap, convergence, rhetorical absolute or teaching sentence identifies the answer without clinical interpretation.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

- fairness[2]: The first node is self-contained. Its explanation does not disclose the later tumor or oncologic operation.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

- fairness[3]: Review scope: all 13 proposed executable nodes were reviewed, comprising one rewritten and 12 new items. Retired/replacement proposals and held/withheld records were noted but not graded. Judgments use the candidate visible fields and their sequence, not author self-assessments. This is an offline editorial review with no new source verification or clinical approval; PASS does not change needs_clinician_review. Difficulty and high-yield judgments are qualitative, not measured exam frequencies. Runtime rendering and wait previews are outside this text-only review.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

suggestions: no notes.

### Resection after invasive appendiceal adenocarcinoma ? revised

Reviewed: `question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v1`; original concept `concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1`. Current: `question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2`; current concept `concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1`. Revision attempts: 1.

#### Exact reviewed before

Patient: Nora Bennett; demographics {"ageYears":46,"sexLabel":"Female"}. Chief complaint: **Persistent right-sided pain**.

{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.persistent-pain.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Persistent right-sided pain",
    "presentation": "{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable."
  }
]
```

Current update: At later clinic follow-up, {patientName}'s hospital record shows that laparoscopy led to an intact appendectomy. Permanent review of the whole specimen identifies adenocarcinoma with infiltrative glands extending into mesoappendiceal fat. The appendiceal base margin is clear. Staging CT shows no distant or peritoneal disease, and colonoscopy shows no separate colonic lesion. She has recovered and is fit for further surgery.

Complete task: **Which further surgical plan should be recommended for {patientName}'s appendiceal tumor after this appendectomy?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Oncologic right hemicolectomy with regional nodes (choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.right-colectomy.v1)

  Rationale: The infiltrative adenocarcinoma and localized staging support an oncologic right colectomy for regional nodal assessment despite a clear appendectomy margin.

- Distractor ? Limited cecal re-excision around the staple line (choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.cecal-cuff.v1)

  Rationale: A cecal cuff addresses local clearance. This specimen already has a clear base margin, while the invasive diagnosis creates a regional nodal question.

- Distractor ? Complete surgical treatment with the appendectomy (choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.completed-resection.v1)

  Rationale: Clear appendectomy margins establish local removal. The invasive histology still supports regional nodal-basin resection in this fit patient with localized disease.

Explanation: Infiltrative glands extending into mesoappendiceal fat establish an invasive epithelial tumor. A clear base margin addresses local clearance. For this localized adenocarcinoma, the next surgical issue is the regional nodal basin, supporting oncologic right hemicolectomy.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "task": "Which hospital evaluation should be recommended now for {patientName}'s worsening right-sided abdominal findings?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The CT was adequate, so its negative result initially supported observation. The subsequent focal progression and involuntary guarding require a fresh decision. WSES guidance supports exploration for persistent or progressive pain after negative imaging.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Repeat contrast-enhanced abdominal and pelvic CT",
        "rationale": "A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration."
      },
      {
        "label": "Proceed to diagnostic abdominal laparoscopy",
        "rationale": "Progressive focal pain with new involuntary guarding keeps an operative abdominal cause consequential despite the adequate negative CT. Exploration can establish and treat the cause."
      },
      {
        "label": "Continue serial abdominal examinations in hospital",
        "rationale": "Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration."
      }
    ]
  }
]
```

Reviewed full-case/current-node SHA-256: `7568bceea6a5ab1542f0c3f7e44d338af1411cd9624b0381ca7779ddb792d406`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### Proposed v2 after

Patient: Nora Bennett; demographics {"ageYears":46,"sexLabel":"Female"}. Chief complaint: **Persistent right-sided pain**.

{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.persistent-pain.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Persistent right-sided pain",
    "presentation": "{patientName}, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable."
  }
]
```

Current update: At clinic follow-up, {patientName}'s hospital record documents an intact appendectomy. The outside review examined one tip block containing low-grade mucinous lining. Expert permanent review of the entire specimen maps a separate proximal focus of irregular malignant glands infiltrating mesoappendiceal fat. The base margin is clear. Chest, abdominal and pelvic staging shows no distant lesions or deposits on serosal surfaces. Colonoscopy shows no separate colonic lesion. She has recovered and is fit for surgery.

Complete task: **Which next management plan should be recommended for {patientName}'s appendiceal tumor after the complete specimen review?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Right hemicolectomy with regional nodes (choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.right-colectomy.v2)

  Rationale: The complete specimen establishes invasive glandular disease beyond the nonrepresentative tip block. With no represented distant or serosal disease, regional resection and nodal assessment are appropriate even though the appendectomy margin is clear.

- Distractor ? Surveillance after the appendectomy (choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.surveillance.v2)

  Rationale: The tip block does not represent the whole lesion. The separately mapped infiltrative focus changes the tumor classification and creates a regional nodal indication despite local margin clearance.

- Distractor ? Cytoreduction with intraperitoneal chemotherapy (choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.cytoreduction.v2)

  Rationale: Mesoappendiceal invasion is not the same finding as tumor deposits distributed on peritoneal surfaces. The current complete-specimen and staging record supports the regional pathway; cytoreduction and intraperitoneal treatment require a different disease distribution and specialist assessment.

Explanation: A benign-appearing or low-grade sampled region cannot classify unsampled parts of a heterogeneous appendix. The full specimen demonstrates infiltrative glandular disease. A clear base addresses the local margin; it does not address regional nodes. Mesoappendiceal invasion without demonstrated serosal dissemination supports right hemicolectomy rather than the peritoneal-disease pathway.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "task": "Which hospital evaluation should be recommended now for {patientName}'s worsening right-sided abdominal findings?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The CT was adequate, so its negative result initially supported observation. The subsequent focal progression and involuntary guarding require a fresh decision. WSES guidance supports exploration for persistent or progressive pain after negative imaging.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Repeat contrast-enhanced abdominal and pelvic CT",
        "rationale": "A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration."
      },
      {
        "label": "Proceed to diagnostic abdominal laparoscopy",
        "rationale": "Progressive focal pain with new involuntary guarding keeps an operative abdominal cause consequential despite the adequate negative CT. Exploration can establish and treat the cause."
      },
      {
        "label": "Continue serial abdominal examinations in hospital",
        "rationale": "Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration."
      }
    ]
  }
]
```

Current full-case/current-node SHA-256: `36a9d306af9635ab9459dbcae4be15e862925ea33aa8ed85776e87fca20dff5c`.

#### Concrete manual author gate

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Reconcile a low-grade tip block with a separately mapped infiltrative proximal focus in the complete specimen; classify by the demonstrated invasive component.",
  "apply": "Separate local margin clearance and direct mesoappendiceal invasion from regional nodal risk and from serosal dissemination, then recommend regional resection.",
  "closestError": "Choose surveillance by treating the limited tip block and clear base as a complete characterization of the lesion.",
  "decidingObservation": "The complete permanent specimen contains malignant glands infiltrating mesoappendiceal fat in tissue not represented by the reassuring tip block.",
  "consequence": "Leaving the regional nodal basin unassessed for an invasive primary, or escalating direct local invasion into an unsupported peritoneal treatment pathway.",
  "deletionTest": "Without the separate invasive focus, the whole-lesion conclusion and regional recommendation are unsupported. The margin distinguishes local clearance from nodal treatment. Staging distribution separates regional surgery from cytoreduction. The recovery and fitness observations delimit elective further resection.",
  "counterfactual": "Replace the mapped invasive focus with noninfiltrative low-grade lining throughout an intact margin-negative specimen without extra-appendiceal involvement. Surveillance after appendectomy becomes the best offered plan.",
  "counterfactualChoiceId": "surveillance",
  "cueAttack": "Removed the named adenocarcinoma interpretation, the key-only Oncologic adjective and the already-addressed cecal-cuff foil. The sample conflict is necessary evidence, not merely an omitted diagnosis label. All choices are specific next management plans and the neutral task accommodates observation.",
  "stageCategory": "Next management plan after complete pathology and staging, including surveillance and two distinct resection fields.",
  "difficulty": "Predicted moderate for PGY-2/3: the error is sampling-based anchoring and conflating a negative local margin with absence of regional risk. This is a fair moderate revision, not a claim of measured hard difficulty.",
  "oneBestAnswer": "The represented complete specimen and localized distribution support regional surgery under ASCRS recommendation 13. The competing noninfiltrative and disseminated pathways require different findings, not a different interpretation of the supplied margin.",
  "sequenceCheck": "The passed preceding exploration question, header, profile and explanation remain byte-identical. They disclose no tumor finding or resection rule. Only this later update and question are versioned.",
  "repairRecord": "One response to the independent REVISE: replaced diagnosis-to-Oncologic matching with a real limited-versus-complete specimen conflict, used a neutral task and replaced the weak local-clearance competitor. Re-solved the noninfiltrative and disseminated counterfactuals.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.surveillance.v2",
      "temptation": "Anchor on the limited low-grade tip sample and equate a clear margin with definitive treatment.",
      "rankingRationale": "The tip block does not represent the whole lesion. The separately mapped infiltrative focus changes the tumor classification and creates a regional nodal indication despite local margin clearance.",
      "counterfactual": "If the complete intact specimen instead showed only noninfiltrative LAMN with clear margins and no perforation or extra-appendiceal involvement, further regional resection would not be indicated.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.complete-specimen-assessment",
        "claim.appendix-appendicitis.lamn-versus-invasive",
        "claim.appendix-appendicitis.adenocarcinoma-colectomy",
        "claim.appendix-appendicitis.lamn-complete-resection"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.cytoreduction.v2",
      "temptation": "Treat mucinous histology or extension into mesoappendiceal fat as proof of a disseminated serosal process.",
      "rankingRationale": "Mesoappendiceal invasion is not the same finding as tumor deposits distributed on peritoneal surfaces. The current complete-specimen and staging record supports the regional pathway; cytoreduction and intraperitoneal treatment require a different disease distribution and specialist assessment.",
      "counterfactual": "If separate serosal deposits containing mucinous tumor were demonstrated, specialist assessment for cytoreduction and intraperitoneal treatment would replace routine regional resection as the governing pathway.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.adenocarcinoma-colectomy",
        "claim.appendix-appendicitis.peritoneal-mucin-treatment"
      ]
    }
  ]
}
```

#### Atomic statements and timing/order proposals

Claims: `claim.appendix-appendicitis.complete-specimen-assessment`, `claim.appendix-appendicitis.lamn-versus-invasive`, `claim.appendix-appendicitis.adenocarcinoma-colectomy`, `claim.appendix-appendicitis.lamn-complete-resection`, `claim.appendix-appendicitis.peritoneal-mucin-treatment`. Exact independent statements and full source records are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json).

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.persistent-pain.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.lamn-complete-resection",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ]
      },
      {
        "fields": [
          "answerChoices[id=surveillance].label",
          "answerChoices[id=surveillance].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.lamn-complete-resection"
        ]
      },
      {
        "fields": [
          "answerChoices[id=right-colectomy].label",
          "answerChoices[id=right-colectomy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy"
        ]
      },
      {
        "fields": [
          "answerChoices[id=cytoreduction].label",
          "answerChoices[id=cytoreduction].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The passed preceding exploration question, header, profile and explanation remain byte-identical. They disclose no tumor finding or resection rule. Only this later update and question are versioned."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.persistent-pain.v2",
    "nodeId": "node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.persistent-pain.v2",
    "nodeId": "node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.surveillance.v2",
        "choiceLabel": "Surveillance after the appendectomy"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.right-colectomy.v2",
        "choiceLabel": "Right hemicolectomy with regional nodes"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.cytoreduction.v2",
        "choiceLabel": "Cytoreduction with intraperitoneal chemotherapy"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

#### Response to every independent note

- clarityIssues[0]: The task asks for a 'further surgical plan', but 'Complete surgical treatment with the appendectomy' means no further surgery. The intended meaning is recoverable, but the wording makes the no-operation option an awkward fit.

  Disposition: addressed_in_v2_pending_independent_review. The task now asks for next management and accommodates surveillance. No further-operation presupposition remains.

- cues[0]: adenocarcinoma with infiltrative glands extending into mesoappendiceal fat ? The named cancer plus the uniquely 'Oncologic' option supplies a broad cancer-to-cancer-treatment match. The diagnostic interpretation is already supplied; the added microscopic description does not create another consequential step.

  Disposition: addressed_in_v2_pending_independent_review. Removed named adenocarcinoma and the unique Oncologic adjective. Preserved the base margin but replaced the cuff option. A limited tip sample and a separate infiltrative full-specimen focus create a consequential sample-scope conflict.

- cues[1]: The appendiceal base margin is clear ? Against 'Limited cecal re-excision around the staple line', this repeats the local-clearance distinction so explicitly that the cuff option has little competitive value. Preserve the necessary margin finding, but improve the option set.

  Disposition: addressed_in_v2_pending_independent_review. Removed named adenocarcinoma and the unique Oncologic adjective. Preserved the base margin but replaced the cuff option. A limited tip sample and a separate infiltrative full-specimen focus create a consequential sample-scope conflict.

- fairness[0]: Right hemicolectomy with regional nodal assessment is the defensible offered answer for this fit patient with localized invasive disease. No confident clinical inaccuracy identified offline.

  Disposition: addressed_in_v2_pending_independent_review. Retained the supported localized invasive regional-resection pathway. Complete permanent pathology outranks a nonrepresentative tip block; direct mesoappendiceal invasion differs from serosal dissemination. All three options now correspond to supported distinct pathology/distribution states. The passed first node is untouched.

- fairness[1]: The case follows coherently from exploration to appendectomy and permanent pathology, and the update supplies enough context for standalone entry. Earlier feedback does not give away this answer.

  Disposition: addressed_in_v2_pending_independent_review. Retained the supported localized invasive regional-resection pathway. Complete permanent pathology outranks a nonrepresentative tip block; direct mesoappendiceal invasion differs from serosal dissemination. All three options now correspond to supported distinct pathology/distribution states. The passed first node is untouched.

- fairness[2]: The tested concept is important, but the displayed task mainly recalls the operation for an explicitly named invasive cancer. Staging, margin and fitness are already interpreted rather than competing evidence the resident must resolve.

  Disposition: addressed_in_v2_pending_independent_review. Retained the supported localized invasive regional-resection pathway. Complete permanent pathology outranks a nonrepresentative tip block; direct mesoappendiceal invasion differs from serosal dissemination. All three options now correspond to supported distinct pathology/distribution states. The passed first node is untouched.

- suggestions[0]: Use a neutral next-management task that accommodates both further resection and surveillance.

  Disposition: addressed_in_v2_pending_independent_review. Neutral management task, true limited-versus-complete specimen distinction, and surveillance versus regional versus surface-disease treatment fields. Counterfactual noninfiltrative complete pathology changes the key to surveillance.

- suggestions[1]: Build the decision around a supported specimen or staging distinction that changes the operation. Require interpretation of that distinction and then selection of extent; do not merely remove the diagnosis label while keeping an otherwise identical recall item.

  Disposition: addressed_in_v2_pending_independent_review. Neutral management task, true limited-versus-complete specimen distinction, and surveillance versus regional versus surface-disease treatment fields. Counterfactual noninfiltrative complete pathology changes the key to surveillance.

- suggestions[2]: Replace the already-addressed local-clearance distractor with a credible competing plan resolved by the displayed findings.

  Disposition: addressed_in_v2_pending_independent_review. Neutral management task, true limited-versus-complete specimen distinction, and surveillance versus regional versus surface-disease treatment fields. Counterfactual noninfiltrative complete pathology changes the key to surveillance.

### Colonic evaluation after appendiceal abscess ? revised

Reviewed: `question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1`; original concept `concept.appendix-appendicitis.post-abscess-colonic-evaluation.v1`. Current: `question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2`; current concept `concept.appendix-appendicitis.post-abscess-colonic-evaluation.v1`. Revision attempts: 1.

#### Exact reviewed before

Patient: Owen Mercer; demographics {"ageYears":62,"sexLabel":"Male"}. Chief complaint: **Abscess follow-up**.

{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. His pain and fever have resolved. Interval abdominal and pelvic CT shows collapse of the collection but persistent nodularity at the appendiceal-cecal junction. Residual inflammatory thickening obscures the appendiceal base and the nodule's organ of origin. He has never undergone colonoscopy.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.post-abscess-lesion.v1",
    "prototypeDemographics": {
      "ageYears": 62,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Abscess follow-up",
    "presentation": "{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. His pain and fever have resolved. Interval abdominal and pelvic CT shows collapse of the collection but persistent nodularity at the appendiceal-cecal junction. Residual inflammatory thickening obscures the appendiceal base and the nodule's organ of origin. He has never undergone colonoscopy."
  }
]
```

Complete task: **Which investigation should be completed before planning resection of {patientName}'s persistent right-lower-quadrant lesion?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Colonoscopy with examination of the cecum (choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.colonoscopy.v1)

  Rationale: The older post-abscess patient with a persistent appendiceal abnormality warrants evaluation for neoplasia. Colonoscopy assesses synchronous colonic lesions that can alter resection planning.

- Distractor ? CT-guided core biopsy of the appendiceal nodule (choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.core-biopsy.v1)

  Rationale: A needle sample targets the appendiceal lesion but supplies limited tissue and leaves synchronous colonic disease unexamined. Current guidance supports colonoscopy in this preoperative setting.

- Distractor ? Contrast-enhanced abdominal and pelvic CT (choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.repeat-ct.v1)

  Rationale: The available interval CT has already mapped a resolved collection and a persistent focal lesion. With infection clinically resolved, repeating that acquisition leaves the required colonic assessment outstanding.

Explanation: Resolution of an appendiceal abscess leaves an underlying-neoplasm question in this older adult with a persistent nodule. Colonoscopy examines the colon for synchronous disease relevant to resection planning.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Reviewed full-case/current-node SHA-256: `c40125b4c0872d6e3a7ae9cee9177dea149d62bbd14582ad2b971a4338fb3fe2`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### Proposed v2 after

Patient: Owen Mercer; demographics {"ageYears":62,"sexLabel":"Male"}. Chief complaint: **Abscess follow-up**.

{patientName}, a 62-year-old man, attends the clinic after antibiotics and drainage of a right-lower-quadrant abscess attributed to appendicitis. Pain and fever have resolved. Interval CT shows collapse of the collection and persistent nodularity at the appendiceal-cecal junction; inflammatory thickening still obscures the base and organ of origin. An earlier luminal report describes normal mucosa in the visualized colon. Its final photographed landmark is the descending colon, and biopsy labels identify rectum and sigmoid.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "prototypeDemographics": {
      "ageYears": 62,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Abscess follow-up",
    "presentation": "{patientName}, a 62-year-old man, attends the clinic after antibiotics and drainage of a right-lower-quadrant abscess attributed to appendicitis. Pain and fever have resolved. Interval CT shows collapse of the collection and persistent nodularity at the appendiceal-cecal junction; inflammatory thickening still obscures the base and organ of origin. An earlier luminal report describes normal mucosa in the visualized colon. Its final photographed landmark is the descending colon, and biopsy labels identify rectum and sigmoid."
  }
]
```

Complete task: **Which investigation should be recommended now before definitive resection planning for {patientName}'s persistent junctional lesion?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Colonoscopy with targeted mucosal sampling (choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.colonoscopy.v2)

  Rationale: The images and specimen labels from the earlier luminal study do not represent the cecum. Complete luminal evaluation can identify and sample a cecal primary and assess synchronous colonic lesions before planning an appendiceal or colonic resection. It cannot dismiss an extramural appendiceal lesion when mucosa is normal.

- Distractor ? Repeat contrast CT after inflammatory resolution (choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.interval-ct.v2)

  Rationale: Later CT can define the appendiceal base and extraluminal origin more clearly as inflammation subsides. It does not substitute for examination and sampling of a possible cecal mucosal lesion or the unexamined proximal colon.

- Distractor ? CT-guided core sampling of the junctional mass (choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.core-biopsy.v2)

  Rationale: A core from the extra-luminal junctional target would not provide a complete colonic mucosal examination. The origin is still uncertain and the current unexamined cecal compartment matters for the planned operation. The guideline supports colonoscopy for suspected appendiceal neoplasia; this is not a universal prohibition on image-guided biopsy.

Explanation: The previous report covers the visualized colon, not the cecum: its images and biopsy labels stop distally. A persistent appendiceal-cecal junction lesion therefore still requires complete colonic mucosal assessment, including the possibility of a cecal primary and synchronous lesions. Normal mucosa would not exclude an appendiceal mural lesion. Later CT after inflammatory resolution still has a separate role in localizing the appendix and its base.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Current full-case/current-node SHA-256: `afd3c469929a4e36939f85d3c0ac5484f44c555c853101b2ac9a472aa109e9a4`.

#### Concrete manual author gate

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Use the actual photographed landmarks and biopsy labels to limit the scope of the earlier normal luminal report; it does not represent the cecal mucosa at the junctional lesion.",
  "apply": "Choose complete luminal examination and targeted sampling before fixing the operative field, while retaining later CT for the separate extraluminal localization question.",
  "closestError": "Accept the broad normal-report summary and wait for another CT to settle a possible cecal primary without examining the relevant mucosa.",
  "decidingObservation": "The prior luminal study ends in the descending colon and its biopsies are labelled rectum and sigmoid; the persistent lesion is at the cecal-appendiceal junction.",
  "consequence": "A cecal primary or synchronous colonic lesion can be missed and the wrong resection field planned.",
  "deletionTest": "The limited examination record creates the misleading negative and earns the site-scope inference. Persistent junctional tissue after clinical recovery creates the neoplasm question. Residual inflammation explains why interval CT retains a later role; this is not an identical already-completed-study foil.",
  "counterfactual": "Replace the limited prior record with an adequate complete colonoscopy documenting normal cecal mucosa and no synchronous lesion, while inflammation still obscures the appendix on CT. Repeat contrast CT after inflammatory resolution becomes the best offered next investigation.",
  "counterfactualChoiceId": "interval-ct",
  "cueAttack": "Removed the sentence naming an unperformed colonoscopy. The earlier record is supplied as raw anatomic scope rather than a statement that the required test is missing. The core target stays junctional rather than assumed appendiceal, and the CT option explicitly refers to a later changed inflammatory state.",
  "stageCategory": "Current pre-resection investigation; all alternatives are named tissue or imaging investigations with exact test timing metadata.",
  "difficulty": "Predicted moderate for PGY-2/3 from trusting the summary of an examination of the wrong site and allowing inflammation-based imaging follow-up to replace mucosal assessment. The retained scope details are clinically necessary, not optional difficulty padding.",
  "oneBestAnswer": "The cecum remains unrepresented and a colonic primary changes resection planning. Complete colonoscopy is guideline-supported for the persistent suspected appendiceal lesion. CT and core biopsy are not claimed intrinsically invalid; they answer different residual questions under the supplied record.",
  "sequenceCheck": "This revision uses a new standalone case and header. The entire original post-abscess pair, including the old first question and feedback, is retained unchanged solely as the frozen visible context for the PASS follow-up; that mixed-verdict pair is excluded from fresh preview.",
  "repairRecord": "One response to the independent REVISE: corrected target localization, gave the competing CT explicit interval timing, replaced the named missing-test cue with a scope-of-examination conflict, and separated mucosal diagnosis from later extraluminal localization.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.interval-ct.v2",
      "temptation": "Treat a reassuring summary from a partial luminal examination as completion of the colonic assessment, then defer evaluation to later cross-sectional imaging.",
      "rankingRationale": "Later CT can define the appendiceal base and extraluminal origin more clearly as inflammation subsides. It does not substitute for examination and sampling of a possible cecal mucosal lesion or the unexamined proximal colon.",
      "counterfactual": "After an adequate complete colonoscopy shows normal cecal mucosa and no synchronous lesion, persistent inflammation obscuring the appendix can make later contrast CT the appropriate offered next investigation.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.colonoscopy-neoplasm",
        "claim.appendix-appendicitis.interval-tissue-evaluation"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.core-biopsy.v2",
      "temptation": "Seek tissue by the route visible on CT without checking whether the prior negative examination actually sampled the competing primary site.",
      "rankingRationale": "A core from the extra-luminal junctional target would not provide a complete colonic mucosal examination. The origin is still uncertain and the current unexamined cecal compartment matters for the planned operation. The guideline supports colonoscopy for suspected appendiceal neoplasia; this is not a universal prohibition on image-guided biopsy.",
      "counterfactual": "If complete luminal assessment were adequate and normal, and an unresectable solid extra-luminal target needed tissue to guide nonsurgical treatment, image-guided core sampling could become appropriate.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.colonoscopy-neoplasm",
        "claim.appendix-appendicitis.complete-specimen-assessment"
      ]
    }
  ]
}
```

#### Atomic statements and timing/order proposals

Claims: `claim.appendix-appendicitis.colonoscopy-neoplasm`, `claim.appendix-appendicitis.post-abscess-neoplasm`, `claim.appendix-appendicitis.interval-tissue-evaluation`, `claim.appendix-appendicitis.complete-specimen-assessment`. Exact independent statements and full source records are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json).

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.colonoscopy-neoplasm",
          "claim.appendix-appendicitis.post-abscess-neoplasm",
          "claim.appendix-appendicitis.interval-tissue-evaluation",
          "claim.appendix-appendicitis.complete-specimen-assessment"
        ]
      },
      {
        "fields": [
          "answerChoices[id=interval-ct].label",
          "answerChoices[id=interval-ct].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.colonoscopy-neoplasm",
          "claim.appendix-appendicitis.interval-tissue-evaluation"
        ]
      },
      {
        "fields": [
          "answerChoices[id=colonoscopy].label",
          "answerChoices[id=colonoscopy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.colonoscopy-neoplasm",
          "claim.appendix-appendicitis.post-abscess-neoplasm"
        ]
      },
      {
        "fields": [
          "answerChoices[id=core-biopsy].label",
          "answerChoices[id=core-biopsy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.colonoscopy-neoplasm",
          "claim.appendix-appendicitis.complete-specimen-assessment"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "This revision uses a new standalone case and header. The entire original post-abscess pair, including the old first question and feedback, is retained unchanged solely as the frozen visible context for the PASS follow-up; that mixed-verdict pair is excluded from fresh preview."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "nodeId": "node.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.interval-ct.v2",
          "choiceLabel": "Repeat contrast CT after inflammatory resolution",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.colonoscopy.v2",
          "choiceLabel": "Colonoscopy with targeted mucosal sampling",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.core-biopsy.v2",
          "choiceLabel": "CT-guided core sampling of the junctional mass",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "nodeId": "node.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.interval-ct.v2",
        "choiceLabel": "Repeat contrast CT after inflammatory resolution"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.colonoscopy.v2",
        "choiceLabel": "Colonoscopy with targeted mucosal sampling"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.core-biopsy.v2",
        "choiceLabel": "CT-guided core sampling of the junctional mass"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

#### Response to every independent note

- clarityIssues[0]: The initial CT leaves the organ of origin unresolved, yet the biopsy option calls the target an 'appendiceal nodule'. That option assumes a localization the presentation explicitly withholds.

  Disposition: addressed_in_v2_pending_independent_review. The biopsy target is consistently junctional, not assumed appendiceal. The CT option explicitly means a later repeat after inflammation resolves; it is not a duplicate of the completed study.

- clarityIssues[1]: The repeat CT option specifies neither a later interval nor a different acquisition. Its role is unclear when inflammatory thickening is the stated limitation.

  Disposition: addressed_in_v2_pending_independent_review. The biopsy target is consistently junctional, not assumed appendiceal. The CT option explicitly means a later repeat after inflammation resolves; it is not a duplicate of the completed study.

- cues[0]: He has never undergone colonoscopy ? The final sentence names the omitted test and exactly matches the keyed procedure. A nonmedical test-taker can choose the conspicuously missing investigation.

  Disposition: addressed_in_v2_pending_independent_review. Removed the named missing-colonoscopy sentence. Raw distal landmarks and biopsy labels limit the prior normal report. The later changed-state CT has a legitimate role, with its limitation explained after the answer.

- cues[1]: Interval abdominal and pelvic CT shows ? An apparently identical CT is offered as a distractor after the stem announces it has already been completed. The key becomes the routine unperformed test rather than the product of two consequential inferences.

  Disposition: addressed_in_v2_pending_independent_review. Removed the named missing-colonoscopy sentence. Raw distal landmarks and biopsy labels limit the prior normal report. The later changed-state CT has a legitimate role, with its limitation explained after the answer.

- fairness[0]: Colonoscopy is a defensible next investigation for this older patient with a persistent junctional lesion. No confident clinical inaccuracy in that selection identified offline.

  Disposition: addressed_in_v2_pending_independent_review. The cecal primary and synchronous-disease questions are both addressed. Normal mucosa cannot dismiss an appendiceal mural lesion. Later CT remains useful for appendiceal base/origin assessment. The fork is standalone and the entire old pair is retained for the passed follow-up.

- fairness[1]: The explanation emphasizes synchronous disease but does not fully address the more immediate uncertainty about a cecal primary at the junction.

  Disposition: addressed_in_v2_pending_independent_review. The cecal primary and synchronous-disease questions are both addressed. Normal mucosa cannot dismiss an appendiceal mural lesion. Later CT remains useful for appendiceal base/origin assessment. The fork is standalone and the entire old pair is retained for the passed follow-up.

- fairness[2]: The explanation should not suggest that CT has exhausted its role: the record still has an obscured base, and the next case part appropriately uses later CT after inflammatory resolution. Those stages can coexist, but their timing should be explicit.

  Disposition: addressed_in_v2_pending_independent_review. The cecal primary and synchronous-disease questions are both addressed. Normal mucosa cannot dismiss an appendiceal mural lesion. Later CT remains useful for appendiceal base/origin assessment. The fork is standalone and the entire old pair is retained for the passed follow-up.

- fairness[3]: This first node stands alone and does not disclose which resection the later findings will justify.

  Disposition: addressed_in_v2_pending_independent_review. The cecal primary and synchronous-disease questions are both addressed. Normal mucosa cannot dismiss an appendiceal mural lesion. Later CT remains useful for appendiceal base/origin assessment. The fork is standalone and the entire old pair is retained for the passed follow-up.

- suggestions[0]: Give prior colonic evaluation history neutrally only as needed; avoid ending with a named missing action.

  Disposition: addressed_in_v2_pending_independent_review. A wrong-site negative report must be interpreted before selecting complete luminal evaluation. Named current investigations have exact timing metadata. An adequate normal cecal examination changes the next offered investigation to later CT.

- suggestions[1]: Compare credible investigations at the same current stage, including precise timing if interval imaging remains an option. Do not use an unchanged completed study as a disposable foil.

  Disposition: addressed_in_v2_pending_independent_review. A wrong-site negative report must be interpreted before selecting complete luminal evaluation. Named current investigations have exact timing metadata. An adequate normal cecal examination changes the next offered investigation to later CT.

- suggestions[2]: Keep the lesion's origin uncertain consistently and explain what luminal evaluation can and cannot establish before the later appendiceal assessment.

  Disposition: addressed_in_v2_pending_independent_review. A wrong-site negative report must be interpreted before selecting complete luminal evaluation. Named current investigations have exact timing metadata. An adequate normal cecal examination changes the next offered investigation to later CT.

### Persistent appendiceal lesion despite normal colonoscopy ? pass-preserved

Reviewed: `question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1`; original concept `concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1`. Current: `question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1`; current concept `concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1`. Revision attempts: 0.

#### Exact reviewed before

Patient: Owen Mercer; demographics {"ageYears":62,"sexLabel":"Male"}. Chief complaint: **Abscess follow-up**.

{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. His pain and fever have resolved. Interval abdominal and pelvic CT shows collapse of the collection but persistent nodularity at the appendiceal-cecal junction. Residual inflammatory thickening obscures the appendiceal base and the nodule's organ of origin. He has never undergone colonoscopy.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.post-abscess-lesion.v1",
    "prototypeDemographics": {
      "ageYears": 62,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Abscess follow-up",
    "presentation": "{patientName}, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. His pain and fever have resolved. Interval abdominal and pelvic CT shows collapse of the collection but persistent nodularity at the appendiceal-cecal junction. Residual inflammatory thickening obscures the appendiceal base and the nodule's organ of origin. He has never undergone colonoscopy."
  }
]
```

Current update: At follow-up, {patientName}'s colonoscopy has reached the cecum and shows normal mucosa, including the appendiceal orifice. After the surrounding inflammation clears, repeat CT traces the residual mural nodule to the retrocecal appendiceal tip. A normal segment separates it from the cecum, and the base is free. No peritoneal or distant lesions are seen. He is fit for surgery.

Complete task: **Which definitive plan should be recommended for {patientName}'s right-lower-quadrant lesion after this interval reassessment?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Perform interval appendectomy with intact retrieval (choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.interval-appendectomy.v1)

  Rationale: Persistent suspicious appendiceal imaging after an abscess in this fit older patient supports interval appendectomy. The free base and absence of established invasive cancer support obtaining an intact specimen before deciding on a larger oncologic operation.

- Distractor ? Continue surveillance with interval abdominal CT (choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.surveillance.v1)

  Rationale: Normal cecal mucosa does not resolve the persistent appendiceal mural abnormality. In this older post-abscess patient with suspicious imaging, current conditional guidance favors interval appendectomy for tissue evaluation.

- Distractor ? Perform oncologic right hemicolectomy with nodes (choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.right-colectomy.v1)

  Rationale: Right hemicolectomy fits an established invasive localized carcinoma. This record supplies a suspicious localized appendix lesion with a free base and definitive histology pending.

Explanation: The colonoscopy evaluated the colonic lumen. The persistent appendiceal mural lesion still requires its own tissue assessment. In this fit older post-abscess patient, interval appendectomy with intact retrieval is the favored proposed plan. Definitive histology governs any subsequent oncologic extension.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
    "task": "Which investigation should be completed before planning resection of {patientName}'s persistent right-lower-quadrant lesion?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "Resolution of an appendiceal abscess leaves an underlying-neoplasm question in this older adult with a persistent nodule. Colonoscopy examines the colon for synchronous disease relevant to resection planning.",
    "allPossibleChoiceFeedback": [
      {
        "label": "CT-guided core biopsy of the appendiceal nodule",
        "rationale": "A needle sample targets the appendiceal lesion but supplies limited tissue and leaves synchronous colonic disease unexamined. Current guidance supports colonoscopy in this preoperative setting."
      },
      {
        "label": "Contrast-enhanced abdominal and pelvic CT",
        "rationale": "The available interval CT has already mapped a resolved collection and a persistent focal lesion. With infection clinically resolved, repeating that acquisition leaves the required colonic assessment outstanding."
      },
      {
        "label": "Colonoscopy with examination of the cecum",
        "rationale": "The older post-abscess patient with a persistent appendiceal abnormality warrants evaluation for neoplasia. Colonoscopy assesses synchronous colonic lesions that can alter resection planning."
      }
    ]
  }
]
```

Reviewed full-case/current-node SHA-256: `ede98c8eb47dfe0942aef603f39e40761591092564cbbe837267a14311e6db73`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### After: exact PASS preserved

The before above is the unchanged after. The complete original case, current node, earlier feedback, finite profile, question and timing row are preserved in `APPENDIX_TOPIC_FROZEN_PASS_CONTEXTS`. The unchanged proposal and exact hash remain canonical.

```json
{
  "caseId": "case.topic.appendix-appendicitis.post-abscess-lesion.v1",
  "nodeId": "node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
  "exactAfterSha256": "ede98c8eb47dfe0942aef603f39e40761591092564cbbe837267a14311e6db73",
  "fullCaseSha256": "98a6639eda35a27d4d668232211e4b013f9f3e3c41c22df9729f5fe5e9026626",
  "questionSha256": "9362ccfb178d9f0d1a684c314a618be62c6486ba75155011836e70c45ae56d55",
  "scope": "Full old two-part context retained; excluded from fresh preview because changing its returned first node would change passed visible context."
}
```

#### Response to every independent note

clarityIssues: no notes.

cues: no notes.

- fairness[0]: The resident must interpret normal luminal findings as insufficient to dismiss a persistent appendiceal mural lesion, then choose limited intact excision rather than surveillance or an unproven oncologic extension. Both distinctions affect the proposed care.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

- fairness[1]: The later CT adds consequential localization and base-clearance information that the initial presentation lacked. This supports the extent decision rather than simply repeating an earlier conclusion.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

- fairness[2]: The record supports interval appendectomy as the best offered plan in this fit older patient with persistent suspicious imaging. This is not a blanket recommendation for every patient after an abscess; the explanation appropriately limits the application.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

- fairness[3]: The sequence is coherent, and the update independently supplies the colonoscopy and repeat-imaging results. Earlier feedback establishes a neoplasm workup but does not name the keyed operation. No decisive nonmedical wording shortcut identified.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

suggestions: no notes.

### Initial resection of a distended intact appendix ? revised

Reviewed: `question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1`; original concept `concept.appendix-appendicitis.incidental-lesion-intact-resection.v1`. Current: `question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2`; current concept `concept.appendix-appendicitis.incidental-lesion-intact-resection.v1`. Revision attempts: 1.

#### Exact reviewed before

Patient: Leah Foster; demographics {"ageYears":54,"sexLabel":"Female"}. Chief complaint: **Operative findings review**.

{patientName}, a 54-year-old woman, attends the clinic to review a proposed operative plan after diagnostic laparoscopy for persistent abdominal symptoms. The hospital record describes a smooth, distended appendiceal body and tip. The base has a narrow segment of normal-appearing tissue, and the appendix separates from the cecum. Its wall is intact, and inspection shows no peritoneal mucin or implants. Definitive pathology is pending.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.incidental-mucinous-lesion.v1",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Operative findings review",
    "presentation": "{patientName}, a 54-year-old woman, attends the clinic to review a proposed operative plan after diagnostic laparoscopy for persistent abdominal symptoms. The hospital record describes a smooth, distended appendiceal body and tip. The base has a narrow segment of normal-appearing tissue, and the appendix separates from the cecum. Its wall is intact, and inspection shows no peritoneal mucin or implants. Definitive pathology is pending."
  }
]
```

Complete task: **Which initial resection should be recommended for {patientName}'s appendiceal lesion on these operative findings?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Appendectomy (choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.appendectomy.v1)

  Rationale: The free normal-appearing base permits limited intact removal. Avoiding rupture preserves the represented localized disease state while permanent pathology determines any further operation.

- Distractor ? Right hemicolectomy (choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.right-colectomy.v1)

  Rationale: This extent is appropriate for an established invasive localized carcinoma. The observed dilated appendix with a free base still requires definitive whole-specimen classification.

- Distractor ? Partial cecectomy (choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.cecal-cuff.v1)

  Rationale: A cecal cuff can obtain clearance when the appendiceal base is involved. The record describes a separable appendix with a normal base segment available for intact removal.

Explanation: The involved segment and the free base determine the initial resection field. Intact appendectomy can provide definitive whole-specimen assessment here. Avoiding rupture matters when the dilation represents a mucinous lesion, and permanent histology guides any oncologic extension.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Reviewed full-case/current-node SHA-256: `41fd48059e8678dba2c037dd311762f5cd860a61be42da0f0e88952725213f01`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### Proposed v2 after

Patient: Leah Foster; demographics {"ageYears":54,"sexLabel":"Female"}. Chief complaint: **Operative findings review**.

{patientName}, a 54-year-old woman, attends the clinic to plan resection after diagnostic laparoscopy left her appendix in situ. No tissue was sampled. The operative images show a distended appendiceal body with continuous wall thickening across its base onto a small adjacent patch of cecum. The remaining cecum and ileocecal valve are separate from that patch, and no surface deposits or free mucin were seen. Every proposed resection would use intact handling and protected retrieval.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.incidental-mucinous-lesion.v2",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Operative findings review",
    "presentation": "{patientName}, a 54-year-old woman, attends the clinic to plan resection after diagnostic laparoscopy left her appendix in situ. No tissue was sampled. The operative images show a distended appendiceal body with continuous wall thickening across its base onto a small adjacent patch of cecum. The remaining cecum and ileocecal valve are separate from that patch, and no surface deposits or free mucin were seen. Every proposed resection would use intact handling and protected retrieval."
  }
]
```

Complete task: **Which initial resection extent should be recommended for {patientName}'s unresected appendiceal lesion?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Partial cecectomy including the appendiceal base (choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.cecal-cuff.v2)

  Rationale: The gross abnormality crosses the base into a limited adjacent cecal segment, while the ileocecal valve and remaining cecum are separate. A partial cecectomy can encompass that field for complete permanent assessment. Unknown final histology does not itself establish a regional nodal indication.

- Distractor ? Appendectomy through the appendiceal base (choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.appendectomy.v2)

  Rationale: The described wall abnormality continues beyond the base into the adjacent cecal wall. Dividing at the base would leave a grossly abnormal segment, so this is not a margin-negative appendix-only situation.

- Distractor ? Right hemicolectomy with regional nodes (choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.right-colectomy.v2)

  Rationale: A large or distended abnormal appendix raises concern but does not establish invasive histology. The limited gross base extension can be encompassed locally; the complete permanent specimen is needed before deciding whether regional nodal resection is indicated.

Explanation: First map the gross abnormality: an appendix-only division would leave affected cecal wall. The observed extension is limited and separate from the remaining cecum and ileocecal valve, so partial cecectomy can include it for permanent assessment. No specimen has yet established invasive biology requiring a regional nodal operation. All offered resections share intact handling and protected retrieval; the scored difference is the resection field.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Current full-case/current-node SHA-256: `86e995cd5dac4354ee0709151436c1bf24f4422e874bba00ae7517c076d25293`.

#### Concrete manual author gate

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Recognize that the continuous abnormal wall crosses the appendiceal transection plane, rather than treating a distended appendix as an appendix-only field.",
  "apply": "Obtain gross clearance with limited adjacent cecal resection while deferring the distinct regional-node indication to complete permanent pathology.",
  "closestError": "Escalate uncertain biology and any cecal extension into right hemicolectomy before the complete specimen establishes an invasive primary.",
  "decidingObservation": "Only the small contiguous cecal patch is involved grossly; the remainder and ileocecal valve are separate, and no tissue has yet classified the lesion.",
  "consequence": "Either leave gross abnormal wall by dividing at the base or perform an unsupported regional resection before definitive pathology.",
  "deletionTest": "Without the observed cecal extension, appendectomy becomes appropriate. Without its limited boundary, the partial-resection recommendation is underspecified. The no-sample chronology limits the conclusion about biology. All three options share safe handling, so retrieval wording cannot select the key.",
  "counterfactual": "Replace the continuous base-to-cecum abnormality with a normal appendiceal base and a normal tissue segment separating the lesion from the cecum. Appendectomy through the base becomes the best offered extent.",
  "counterfactualChoiceId": "appendectomy",
  "cueAttack": "Removed pathology-pending ambiguity and the paired repeated free-base cues. The key now requires interpreting positive gross extension and the boundary of evidence for an oncologic operation. Every option names a resection field; no option advertises uniquely careful retrieval.",
  "stageCategory": "Prospective initial resection of an appendix still in situ, with intact handling and protected retrieval common to every option.",
  "difficulty": "Predicted moderate for PGY-2/3: distinguish gross margin requirements from unknown biologic and nodal requirements. This remains a fair moderate anatomic decision rather than an unsupported hard oncology exception.",
  "oneBestAnswer": "ASCRS recommendation 2 directly supports appendectomy or partial cecectomy according to gross base involvement and full-specimen assessment before regional resection. The observation confines gross disease to a locally resectable patch; it does not claim a tumor-size rule.",
  "sequenceCheck": "The original microscopic-margin follow-up is parked and is not attached to this changed operation. This standalone version ends at the initial operation; later histology is not previewed.",
  "repairRecord": "One response to the independent REVISE: made the unresected state and absence of tissue explicit, chose extent as the single objective, shared retrieval care across options and replaced repeated free-base observations with consequential base-to-cecum extension.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.appendectomy.v2",
      "temptation": "Apply the usual appendix-only extent before mapping where the gross abnormality actually ends.",
      "rankingRationale": "The described wall abnormality continues beyond the base into the adjacent cecal wall. Dividing at the base would leave a grossly abnormal segment, so this is not a margin-negative appendix-only situation.",
      "counterfactual": "If a normal segment separated the lesion from a free base and cecum, intact appendectomy could achieve the initial gross margin.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.intact-abnormal-appendix"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.right-colectomy.v2",
      "temptation": "Translate cecal involvement and uncertain biology directly into a regional cancer operation.",
      "rankingRationale": "A large or distended abnormal appendix raises concern but does not establish invasive histology. The limited gross base extension can be encompassed locally; the complete permanent specimen is needed before deciding whether regional nodal resection is indicated.",
      "counterfactual": "A complete specimen demonstrating invasive adenocarcinoma without metastatic spread would support right hemicolectomy with regional nodes.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.intact-abnormal-appendix",
        "claim.appendix-appendicitis.complete-specimen-assessment",
        "claim.appendix-appendicitis.adenocarcinoma-colectomy"
      ]
    }
  ]
}
```

#### Atomic statements and timing/order proposals

Claims: `claim.appendix-appendicitis.intact-abnormal-appendix`, `claim.appendix-appendicitis.complete-specimen-assessment`, `claim.appendix-appendicitis.adenocarcinoma-colectomy`. Exact independent statements and full source records are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json).

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.incidental-mucinous-lesion.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.intact-abnormal-appendix",
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy"
        ]
      },
      {
        "fields": [
          "answerChoices[id=appendectomy].label",
          "answerChoices[id=appendectomy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.intact-abnormal-appendix"
        ]
      },
      {
        "fields": [
          "answerChoices[id=cecal-cuff].label",
          "answerChoices[id=cecal-cuff].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.intact-abnormal-appendix",
          "claim.appendix-appendicitis.complete-specimen-assessment"
        ]
      },
      {
        "fields": [
          "answerChoices[id=right-colectomy].label",
          "answerChoices[id=right-colectomy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.intact-abnormal-appendix",
          "claim.appendix-appendicitis.complete-specimen-assessment",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The original microscopic-margin follow-up is parked and is not attached to this changed operation. This standalone version ends at the initial operation; later histology is not previewed."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.incidental-mucinous-lesion.v2",
    "nodeId": "node.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.incidental-mucinous-lesion.v2",
    "nodeId": "node.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.appendectomy.v2",
        "choiceLabel": "Appendectomy through the appendiceal base"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.cecal-cuff.v2",
        "choiceLabel": "Partial cecectomy including the appendiceal base"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.right-colectomy.v2",
        "choiceLabel": "Right hemicolectomy with regional nodes"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

#### Response to every independent note

- clarityIssues[0]: The patient is reviewing a proposed operation after diagnostic laparoscopy, yet 'Definitive pathology is pending' appears before any tissue acquisition is described. It is unclear whether the appendix remains in situ, a biopsy was obtained, or the question retrospectively asks what should have been done.

  Disposition: addressed_in_v2_pending_independent_review. The appendix remains in situ after diagnostic laparoscopy and no tissue has been sampled. All options share intact handling/protected retrieval; the single scored objective is initial resection extent.

- clarityIssues[1]: The task tests resection extent, while much of the explanation teaches intact retrieval and rupture avoidance, which none of the option labels distinguishes.

  Disposition: addressed_in_v2_pending_independent_review. The appendix remains in situ after diagnostic laparoscopy and no tissue has been sampled. All options share intact handling/protected retrieval; the single scored objective is initial resection extent.

- cues[0]: a narrow segment of normal-appearing tissue, and the appendix separates from the cecum ? The two adjacent descriptions strongly signal a limited appendix-only field against partial cecectomy and hemicolectomy. They are relevant anatomy, but the offered choices turn them into a simple smallest-resection match with little competing reasoning.

  Disposition: addressed_in_v2_pending_independent_review. Replaced adjacent repeated free-base observations with continuous abnormal wall across the base onto a limited cecal patch. The learner must distinguish gross margin needs from an unestablished regional nodal indication.

- fairness[0]: Appendectomy with intact removal is a defensible initial extent for the described separable lesion with a normal base and no evident peritoneal disease. No confident clinical inaccuracy identified offline.

  Disposition: addressed_in_v2_pending_independent_review. ASCRS recommendation 2 supports local extent according to gross base involvement and complete permanent assessment before regional surgery. The changed anatomy changes the key to partial cecectomy; its boundary and the absence of tissue classification are explicit. The disputed margin follow-up is parked, so no incompatible continuation is asserted.

- fairness[1]: This is mainly one extent-of-resection rule. The lesion's exact biology remains unknown, but that uncertainty does not create a strong alternative among the displayed operations.

  Disposition: addressed_in_v2_pending_independent_review. ASCRS recommendation 2 supports local extent according to gross base involvement and complete permanent assessment before regional surgery. The changed anatomy changes the key to partial cecectomy; its boundary and the absence of tissue classification are explicit. The disputed margin follow-up is parked, so no incompatible continuation is asserted.

- fairness[2]: The subsequent whole-specimen LAMN result is a plausible continuation once appendectomy is explicitly established. The initial chronology should be repaired before the pair is used.

  Disposition: addressed_in_v2_pending_independent_review. ASCRS recommendation 2 supports local extent according to gross base involvement and complete permanent assessment before regional surgery. The changed anatomy changes the key to partial cecectomy; its boundary and the absence of tissue classification are explicit. The disputed margin follow-up is parked, so no incompatible continuation is asserted.

- suggestions[0]: State whether this is a retrospective decision at the index laparoscopy or a prospective plan for an unresected lesion; do not describe pathology as pending without specifying the sampled tissue.

  Disposition: addressed_in_v2_pending_independent_review. Prospective unresected-lesion chronology; extent-only options; consequential base-to-cecum extension. The free-base counterfactual changes the best extent to appendectomy. Classified as a fair moderate revision, not a hard-score claim.

- suggestions[1]: Choose whether the objective is operative extent or safe specimen retrieval and align every option with that objective.

  Disposition: addressed_in_v2_pending_independent_review. Prospective unresected-lesion chronology; extent-only options; consequential base-to-cecum extension. The free-base counterfactual changes the best extent to appendectomy. Classified as a fair moderate revision, not a hard-score claim.

- suggestions[2]: Introduce a supported, genuinely consequential anatomic or specimen-assessment distinction that makes a close competing operation plausible, rather than adding more statements that the base is free.

  Disposition: addressed_in_v2_pending_independent_review. Prospective unresected-lesion chronology; extent-only options; consequential base-to-cecum extension. The free-base counterfactual changes the best extent to appendectomy. Classified as a fair moderate revision, not a hard-score claim.

### Microscopic LAMN margin after grossly complete resection ? parked

Reviewed: `question.topic.appendix-appendicitis.lamn-microscopic-margin.v1`; original concept `concept.appendix-appendicitis.lamn-microscopic-margin.v1`. Current: `null (unkeyed)`; current concept `null (historical identity retained)`. Revision attempts: 1.

#### Exact reviewed before

Patient: Leah Foster; demographics {"ageYears":54,"sexLabel":"Female"}. Chief complaint: **Operative findings review**.

{patientName}, a 54-year-old woman, attends the clinic to review a proposed operative plan after diagnostic laparoscopy for persistent abdominal symptoms. The hospital record describes a smooth, distended appendiceal body and tip. The base has a narrow segment of normal-appearing tissue, and the appendix separates from the cecum. Its wall is intact, and inspection shows no peritoneal mucin or implants. Definitive pathology is pending.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.incidental-mucinous-lesion.v1",
    "prototypeDemographics": {
      "ageYears": 54,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Operative findings review",
    "presentation": "{patientName}, a 54-year-old woman, attends the clinic to review a proposed operative plan after diagnostic laparoscopy for persistent abdominal symptoms. The hospital record describes a smooth, distended appendiceal body and tip. The base has a narrow segment of normal-appearing tissue, and the appendix separates from the cecum. Its wall is intact, and inspection shows no peritoneal mucin or implants. Definitive pathology is pending."
  }
]
```

Current update: At later follow-up, {patientName}'s intact appendix has undergone expert permanent review. The complete specimen shows a low-grade appendiceal mucinous neoplasm with no infiltrative invasion. Low-grade mucinous epithelium reaches the microscopic base margin. The surgeon documented removal of all gross disease, an intact wall and no peritoneal mucin. Postoperative imaging shows no residual mass.

Complete task: **Which additional-resection plan should be recommended for {patientName} after this permanent pathology review?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Observe after the completed appendiceal resection (choice.topic.appendix-appendicitis.lamn-microscopic-margin.observation.v1)

  Rationale: For a macroscopically complete, nonperforated LAMN with no peritoneal disease, limited data support observation despite microscopic margin involvement.

- Distractor ? Re-excise the cecal staple line with a cecal cuff (choice.topic.appendix-appendicitis.lamn-microscopic-margin.cecal-cuff.v1)

  Rationale: Local re-excision treats a residual-clearance problem. The represented lesion is completely removed macroscopically and nonperforated. Limited ASCRS-reviewed data support observation for microscopic margin involvement in this specific LAMN setting.

- Distractor ? Perform right hemicolectomy with regional nodes (choice.topic.appendix-appendicitis.lamn-microscopic-margin.right-colectomy.v1)

  Rationale: An invasive localized adenocarcinoma would support nodal-basin resection. The fully examined specimen shows noninfiltrative low-grade mucinous disease.

Explanation: The margin result must be interpreted with the tumor's noninfiltrative biology, gross completeness and intact wall. The ASCRS 2025 guideline reviews limited data supporting observation after complete nonperforated LAMN removal despite a microscopic positive margin. Surveillance planning remains a separate clinician decision.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1",
    "task": "Which initial resection should be recommended for {patientName}'s appendiceal lesion on these operative findings?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The involved segment and the free base determine the initial resection field. Intact appendectomy can provide definitive whole-specimen assessment here. Avoiding rupture matters when the dilation represents a mucinous lesion, and permanent histology guides any oncologic extension.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Right hemicolectomy",
        "rationale": "This extent is appropriate for an established invasive localized carcinoma. The observed dilated appendix with a free base still requires definitive whole-specimen classification."
      },
      {
        "label": "Appendectomy",
        "rationale": "The free normal-appearing base permits limited intact removal. Avoiding rupture preserves the represented localized disease state while permanent pathology determines any further operation."
      },
      {
        "label": "Partial cecectomy",
        "rationale": "A cecal cuff can obtain clearance when the appendiceal base is involved. The record describes a separable appendix with a normal base segment available for intact removal."
      }
    ]
  }
]
```

Reviewed full-case/current-node SHA-256: `f38ec80fb65b5ae0e9f4542b29e6c0395d54fd5c83abbb25da77b7c4c48d3ddb`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### After: parked, no scored version

The permitted guideline reviews limited data against routine additional treatment, but the exact viable-epithelium margin comparison does not establish observation as uniquely preferable to local cecal re-excision. The reviewer explicitly requests Melissa's judgment. No fair single best key is asserted.

The corrected planning task and named competing actions below are unkeyed. The old historical key is excluded from fresh preview and is not being endorsed.

```json
{
  "id": "hold.appendix-appendicitis.review1-lamn-microscopic-margin",
  "status": "parked",
  "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.lamn-microscopic-margin.v1",
  "questionVariantId": null,
  "conceptId": null,
  "retainedHistoricalConceptId": "concept.appendix-appendicitis.lamn-microscopic-margin.v1",
  "reason": "The permitted guideline reviews limited data against routine additional treatment, but the exact viable-epithelium margin comparison does not establish observation as uniquely preferable to local cecal re-excision. The reviewer explicitly requests Melissa's judgment. No fair single best key is asserted.",
  "unkeyedPlanningTask": "Which next management plan should be recommended after the complete nonperforated LAMN specimen shows viable low-grade mucinous epithelium at the microscopic base margin?",
  "unkeyedActions": [
    "No further resection; follow-up planned separately",
    "Local cecal margin re-excision",
    "Right hemicolectomy with regional nodes"
  ],
  "clinicalDecisionNeeded": "Should observation be the uniquely preferred reoperation decision over local cecal re-excision for these exact facts? State the evidence and limits that settle that comparison, or keep it unscored.",
  "reviewedVersionRetainedIn": "independentReviewRound1.snapshot.proposals"
}
```

#### Response to every independent note

- clarityIssues[0]: 'additional-resection plan' is awkward when the intended answer is observation. Ask for the next management plan.

  Disposition: scored_item_parked. The future unkeyed task asks whether to reoperate, and no-further-resection explicitly retains separately planned follow-up. The awkward scored task and undefined observation are not reissued.

- clarityIssues[1]: 'Observe' leaves follow-up intensity unspecified, although the explanation properly says surveillance planning is a separate decision. Clarify that the tested choice is whether to reoperate, not whether to provide follow-up.

  Disposition: scored_item_parked. The future unkeyed task asks whether to reoperate, and no-further-resection explicitly retains separately planned follow-up. The awkward scored task and undefined observation are not reissued.

cues: no notes.

- fairness[0]: There is a worthwhile two-step distinction: interpret microscopic margin involvement in a noninfiltrative, nonperforated lesion with gross clearance, then decide whether further surgery is justified. The positive-margin finding provides real tension with observation.

  Disposition: scored_item_parked. The unresolved observation-versus-cecal-cuff comparison is acknowledged. Evidence against routine right colectomy does not settle local re-excision. No additional exclusions or consensus claim were invented; the item is removed from single-best-answer use pending Melissa.

- fairness[1]: Observation is plausible, and formal right hemicolectomy appears disproportionate to the supplied findings. However, the displayed explanation cites limited supporting data without establishing why limited cecal re-excision is not also a defensible choice for viable mucinous epithelium at the margin. Evidence against routine right colectomy does not by itself settle observation versus local re-excision.

  Disposition: scored_item_parked. The unresolved observation-versus-cecal-cuff comparison is acknowledged. Evidence against routine right colectomy does not settle local re-excision. No additional exclusions or consensus claim were invented; the item is removed from single-best-answer use pending Melissa.

- fairness[2]: This is an unresolved single-best-answer concern, not a confident declaration that observation is clinically incorrect. Offline review cannot independently establish the current strength or scope of the claimed guidance. Obtain Melissa's explicit judgment on the exact observation-versus-cuff comparison before acceptance.

  Disposition: scored_item_parked. The unresolved observation-versus-cecal-cuff comparison is acknowledged. Evidence against routine right colectomy does not settle local re-excision. No additional exclusions or consensus claim were invented; the item is removed from single-best-answer use pending Melissa.

- fairness[3]: Broad LAMN management is relevant to residents; this precise limited-evidence margin exception is a less secure commonly tested target, hence highYield=false for this exact node rather than for the disease generally.

  Disposition: scored_item_parked. The unresolved observation-versus-cecal-cuff comparison is acknowledged. Evidence against routine right colectomy does not settle local re-excision. No additional exclusions or consensus claim were invented; the item is removed from single-best-answer use pending Melissa.

- fairness[4]: The update is self-contained and coherently advances to permanent pathology. Earlier feedback about a cuff when the base is involved could make a learner consider re-excision; that is legitimate tension requiring a clear explanation, not answer leakage.

  Disposition: scored_item_parked. The unresolved observation-versus-cecal-cuff comparison is acknowledged. Evidence against routine right colectomy does not settle local re-excision. No additional exclusions or consensus claim were invented; the item is removed from single-best-answer use pending Melissa.

- suggestions[0]: Resolve the exact margin-management comparison with the named clinician and supporting evidence; keep this version needs_clinician_review and do not treat author confidence as consensus.

  Disposition: scored_item_parked. Parked with an explicit clinician question and the named competing actions. No keyed v2 or new scored concept is created. Original data, key, limitation and review remain historical only.

- suggestions[1]: If local re-excision remains a reasonable alternative under the represented facts, change the scored decision or remove the item from single-best-answer use rather than inventing additional exclusions.

  Disposition: scored_item_parked. Parked with an explicit clinician question and the named competing actions. No keyed v2 or new scored concept is created. Original data, key, limitation and review remain historical only.

- suggestions[2]: If retained, explicitly explain why the microscopic epithelial margin in this complete nonperforated specimen does or does not justify local re-excision, while preserving the evidence limitation.

  Disposition: scored_item_parked. Parked with an explicit clinician question and the named competing actions. No keyed v2 or new scored concept is created. Original data, key, limitation and review remain historical only.

### Referral for cellular mucinous peritoneal disease ? revised

Reviewed: `question.topic.appendix-appendicitis.peritoneal-mucin-referral.v1`; original concept `concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1`. Current: `question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2`; current concept `concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1`. Revision attempts: 1.

#### Exact reviewed before

Patient: Marcus Reed; demographics {"ageYears":57,"sexLabel":"Male"}. Chief complaint: **Increasing abdominal girth**.

{patientName}, a 57-year-old man, attends the clinic after appendectomy pathology identified a low-grade mucinous neoplasm with a wall defect. His abdominal girth has continued to increase. CT shows mucinous-appearing material across the pelvis and upper abdomen with scalloping of the liver surface. A peritoneal implant biopsy contains low-grade mucinous epithelium. He remains active, without bowel obstruction or solid-organ metastases.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.peritoneal-mucin.v1",
    "prototypeDemographics": {
      "ageYears": 57,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Increasing abdominal girth",
    "presentation": "{patientName}, a 57-year-old man, attends the clinic after appendectomy pathology identified a low-grade mucinous neoplasm with a wall defect. His abdominal girth has continued to increase. CT shows mucinous-appearing material across the pelvis and upper abdomen with scalloping of the liver surface. A peritoneal implant biopsy contains low-grade mucinous epithelium. He remains active, without bowel obstruction or solid-organ metastases."
  }
]
```

Complete task: **Which treatment referral should be recommended now for {patientName}'s appendiceal mucinous disease?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Peritoneal surgery for cytoreduction and HIPEC review (choice.topic.appendix-appendicitis.peritoneal-mucin-referral.peritoneal-service.v1)

  Rationale: Cellular low-grade mucin outside the appendix and broad peritoneal distribution support assessment for cytoreduction and intraperitoneal treatment. Specialist review determines resectability and the appropriate treatment components.

- Distractor ? Medical oncology for initial systemic chemotherapy (choice.topic.appendix-appendicitis.peritoneal-mucin-referral.medical-oncology.v1)

  Rationale: Systemic treatment can be important in high-grade, unresectable or selected metastatic epithelial disease. This fit patient has low-grade mucinous peritoneal disease, for which a peritoneal-surface surgical assessment addresses the represented treatment field.

- Distractor ? Colorectal surgery for completion right hemicolectomy (choice.topic.appendix-appendicitis.peritoneal-mucin-referral.colorectal-service.v1)

  Rationale: A right colectomy addresses a regional bowel and nodal field. The represented low-grade mucinous disease occupies multiple peritoneal regions, which require a peritoneal-surface treatment assessment.

Explanation: The implant contains neoplastic epithelium and the imaging maps disease across the peritoneum. This fit patient needs a peritoneal-surface surgical assessment for cytoreduction and possible HIPEC. The final treatment depends on resectability, distribution and specialist review.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Reviewed full-case/current-node SHA-256: `1349c44e06163fc9bc90a14ca36b41bbfa0459fcd9e92dbaff4d5be385fe0374`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### Proposed v2 after

Patient: Marcus Reed; demographics {"ageYears":57,"sexLabel":"Male"}. Chief complaint: **Pathology review**.

{patientName}, a 57-year-old man, attends the clinic after appendectomy and separate removal of two small nodules seen during the operation. The complete appendix specimen has a clear base margin and low-grade mucinous lining without infiltrative glands. The pelvic nodule contains fibrous tissue without mucinous epithelium. The separately labelled nodule from beneath the right diaphragm contains mucin with strips of low-grade mucinous epithelium. Postoperative staging shows no solid-organ lesions or residual bulky mass. He remains active without bowel obstruction.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.peritoneal-mucin.v2",
    "prototypeDemographics": {
      "ageYears": 57,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Pathology review",
    "presentation": "{patientName}, a 57-year-old man, attends the clinic after appendectomy and separate removal of two small nodules seen during the operation. The complete appendix specimen has a clear base margin and low-grade mucinous lining without infiltrative glands. The pelvic nodule contains fibrous tissue without mucinous epithelium. The separately labelled nodule from beneath the right diaphragm contains mucin with strips of low-grade mucinous epithelium. Postoperative staging shows no solid-organ lesions or residual bulky mass. He remains active without bowel obstruction."
  }
]
```

Complete task: **Which management pathway should be recommended for {patientName} after review of the separately labelled surgical specimens?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Multidisciplinary review for cytoreduction and intraperitoneal therapy (choice.topic.appendix-appendicitis.peritoneal-mucin-referral.cytoreduction.v2)

  Rationale: Low-grade mucinous epithelium in the separately labelled diaphragmatic nodule demonstrates cellular disease outside the appendix. This requires experienced-center assessment for cytoreduction with or without intraperitoneal treatment. Histology, extent and operative feasibility determine the final plan; the biopsy does not guarantee eligibility.

- Distractor ? Multidisciplinary review for follow-up without resection (choice.topic.appendix-appendicitis.peritoneal-mucin-referral.follow-up.v2)

  Rationale: Margin-negative noninfiltrative disease confined to an intact appendix could support this pathway. The separate diaphragmatic nodule contains mucinous epithelium, so the appendix margin and negative pelvic nodule cannot establish confinement.

- Distractor ? Multidisciplinary review for right hemicolectomy and nodes (choice.topic.appendix-appendicitis.peritoneal-mucin-referral.regional-resection.v2)

  Rationale: The whole appendix does not show destructive glandular invasion requiring the localized adenocarcinoma nodal pathway. The demonstrated tumor is in a separate surface deposit; a regional colectomy does not by itself address that distribution.

Explanation: The specimens represent different sites. A negative pelvic nodule and a clear appendiceal margin do not negate low-grade mucinous epithelium in the diaphragmatic nodule. That finding changes the disease field beyond the appendix. Experienced-center assessment for cytoreduction and possible intraperitoneal therapy is appropriate; this is not a promise of HIPEC or evidence that every deposit has been sampled. Regional colectomy is not a substitute for evaluating the demonstrated surface disease.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Current full-case/current-node SHA-256: `01a743a9fc169a8f6ff79f6b6f763f4443911cca5a826193037653c5eb0aced6`.

#### Concrete manual author gate

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Map permanent histology to the actual specimen sites: a clear primary margin and a benign pelvic nodule cannot establish whole-patient confinement when a separately sampled diaphragmatic nodule contains mucinous epithelium.",
  "apply": "Choose the surface-disease treatment assessment rather than localized-primary surveillance or a regional nodal operation. Leave eligibility and intraperitoneal treatment selection to specialist assessment.",
  "closestError": "Accept the summary based on the primary specimen and the benign pelvic biopsy, then stop at follow-up despite the positive distant surface specimen.",
  "decidingObservation": "Low-grade mucinous epithelial strips are present within mucin in the separately labelled nodule from beneath the right diaphragm.",
  "consequence": "Cellular disease outside the appendix is excluded from treatment planning, or a regional bowel operation is substituted for the actual disease field.",
  "deletionTest": "Without the positive separately sited specimen, the complete intact margin-negative noninfiltrative appendix and benign pelvic nodule support the follow-up pathway. The benign pelvic sample creates real sampling tension; it cannot be extrapolated to the other nodule. Staging and preserved function delimit elective specialist assessment without claiming automatic resectability.",
  "counterfactual": "Change the diaphragmatic nodule result to benign tissue without mucinous epithelium, matching the pelvic nodule. With the complete intact margin-negative appendix as the only involved specimen, multidisciplinary review for follow-up without further resection becomes the best offered plan.",
  "counterfactualChoiceId": "follow-up",
  "cueAttack": "Removed the named peritoneal implant-to-Peritoneal surgery match and the uniquely cautious key. Every option is an equally committed multidisciplinary treatment-pathway review. Raw site-specific pathology, rather than a supplied disease-category label, changes the field and the action.",
  "stageCategory": "Multidisciplinary management-pathway assessment after separately labelled permanent specimens and staging, with no option promising immediate treatment.",
  "difficulty": "Predicted moderate for PGY-2/3 from accepting a reassuring primary-specimen summary and a negative sample at the wrong site. This is a site-and-tissue interpretation followed by a different treatment field, not basic specialty-name recognition.",
  "oneBestAnswer": "The positive sampled surface deposit requires assessment for the disease distribution it demonstrates. ASCRS recommendations 13-15 support the distinction from routine regional colectomy and individualized cytoreduction/HIPEC decisions; a single guideline remains the direct management source.",
  "sequenceCheck": "This remains standalone. No prior feedback labels the involved compartment or names the treatment pathway. The whole-appendix and two nodule results are current and explicitly attributed.",
  "repairRecord": "One response to the independent REVISE: used a consequential specimen-site conflict, removed the specialty-name match, and compared equally cautious pathway assessments. The counterfactual changes the positive tissue observation and changes the best plan.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.follow-up.v2",
      "temptation": "Generalize the clear appendix margin and benign pelvic specimen to every sampled site.",
      "rankingRationale": "Margin-negative noninfiltrative disease confined to an intact appendix could support this pathway. The separate diaphragmatic nodule contains mucinous epithelium, so the appendix margin and negative pelvic nodule cannot establish confinement.",
      "counterfactual": "If expert review found the diaphragmatic nodule benign without mucinous epithelium, as in the pelvic nodule, and the intact margin-negative appendix were the only involved specimen, follow-up without further resection would be the best offered pathway.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.lamn-complete-resection",
        "claim.appendix-appendicitis.cellular-deposit-assessment",
        "claim.appendix-appendicitis.peritoneal-mucin-treatment"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.regional-resection.v2",
      "temptation": "React to any tumor outside the appendix by enlarging the bowel and nodal resection field.",
      "rankingRationale": "The whole appendix does not show destructive glandular invasion requiring the localized adenocarcinoma nodal pathway. The demonstrated tumor is in a separate surface deposit; a regional colectomy does not by itself address that distribution.",
      "counterfactual": "If the appendix instead contained invasive adenocarcinoma and both separately sampled nodules were benign, the regional right-hemicolectomy pathway would become appropriate.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.lamn-versus-invasive",
        "claim.appendix-appendicitis.adenocarcinoma-colectomy",
        "claim.appendix-appendicitis.cellular-deposit-assessment",
        "claim.appendix-appendicitis.peritoneal-mucin-treatment"
      ]
    }
  ]
}
```

#### Atomic statements and timing/order proposals

Claims: `claim.appendix-appendicitis.lamn-complete-resection`, `claim.appendix-appendicitis.lamn-versus-invasive`, `claim.appendix-appendicitis.adenocarcinoma-colectomy`, `claim.appendix-appendicitis.cellular-deposit-assessment`, `claim.appendix-appendicitis.peritoneal-mucin-treatment`. Exact independent statements and full source records are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json).

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.peritoneal-mucin.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.lamn-complete-resection",
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.cellular-deposit-assessment",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ]
      },
      {
        "fields": [
          "answerChoices[id=follow-up].label",
          "answerChoices[id=follow-up].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.lamn-complete-resection",
          "claim.appendix-appendicitis.cellular-deposit-assessment",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ]
      },
      {
        "fields": [
          "answerChoices[id=regional-resection].label",
          "answerChoices[id=regional-resection].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.lamn-versus-invasive",
          "claim.appendix-appendicitis.adenocarcinoma-colectomy",
          "claim.appendix-appendicitis.cellular-deposit-assessment",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ]
      },
      {
        "fields": [
          "answerChoices[id=cytoreduction].label",
          "answerChoices[id=cytoreduction].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.cellular-deposit-assessment",
          "claim.appendix-appendicitis.peritoneal-mucin-treatment"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "This remains standalone. No prior feedback labels the involved compartment or names the treatment pathway. The whole-appendix and two nodule results are current and explicitly attributed."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.peritoneal-mucin.v2",
    "nodeId": "node.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.peritoneal-mucin.v2",
    "nodeId": "node.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.follow-up.v2",
        "choiceLabel": "Multidisciplinary review for follow-up without resection"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.regional-resection.v2",
        "choiceLabel": "Multidisciplinary review for right hemicolectomy and nodes"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.peritoneal-mucin-referral.cytoreduction.v2",
        "choiceLabel": "Multidisciplinary review for cytoreduction and intraperitoneal therapy"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

#### Response to every independent note

clarityIssues: no notes.

- cues[0]: A peritoneal implant biopsy ? The named involved compartment directly matches 'Peritoneal surgery'. Together with disease spanning pelvis and upper abdomen, this lets a nonmedical reader favor the only option explicitly naming the full affected compartment.

  Disposition: addressed_in_v2_pending_independent_review. Removed the Peritoneal implant-to-Peritoneal surgery wording match. All alternatives are equally cautious multidisciplinary pathway assessments. No option uniquely promises review while competitors commit to immediate therapy.

- cues[1]: cytoreduction and HIPEC review ? The key offers assessment before committing to treatment; competitors commit to 'initial systemic chemotherapy' or 'completion right hemicolectomy'. The only cautious review option is structurally advantaged.

  Disposition: addressed_in_v2_pending_independent_review. Removed the Peritoneal implant-to-Peritoneal surgery wording match. All alternatives are equally cautious multidisciplinary pathway assessments. No option uniquely promises review while competitors commit to immediate therapy.

- fairness[0]: Specialist peritoneal-surface assessment is the defensible offered referral. The explanation appropriately makes cytoreduction/HIPEC contingent on specialist assessment rather than promising that every patient is a candidate.

  Disposition: addressed_in_v2_pending_independent_review. A clear primary margin and a negative pelvic nodule do not override a positive nodule from beneath the diaphragm. The site-specific positive tissue establishes a different disease field. Specialist selection for cytoreduction with or without intraperitoneal treatment is retained; neither resectability nor mandatory HIPEC is promised.

- fairness[1]: The low-grade neoplasm, cellular implant and broad distribution already establish the relevant disease category. Selecting the named specialty is mainly recognition and referral matching, not two consequential inferences.

  Disposition: addressed_in_v2_pending_independent_review. A clear primary margin and a negative pelvic nodule do not override a positive nodule from beneath the diaphragm. The site-specific positive tissue establishes a different disease field. Specialist selection for cytoreduction with or without intraperitoneal treatment is retained; neither resectability nor mandatory HIPEC is promised.

- fairness[2]: This standalone item supplies sufficient patient and disease context. No confident clinical inaccuracy identified offline.

  Disposition: addressed_in_v2_pending_independent_review. A clear primary margin and a negative pelvic nodule do not override a positive nodule from beneath the diaphragm. The site-specific positive tissue establishes a different disease field. Specialist selection for cytoreduction with or without intraperitoneal treatment is retained; neither resectability nor mandatory HIPEC is promised.

- suggestions[0]: Compare plans at the same level of commitment: equally specific assessments or equally specific treatments, rather than one review against two immediate treatments.

  Disposition: addressed_in_v2_pending_independent_review. A real tissue-site conflict replaces supplied disease-category recognition. Changing the positive nodule to benign confines demonstrated disease to the primary and changes the offered pathway to follow-up. This is a fair moderate specimen-to-treatment-field revision.

- suggestions[1]: Build a real management fork using supported distribution, resectability or histologic findings whose interpretation changes the plan. Do not make the intended specialty the only option that addresses the named disease compartment.

  Disposition: addressed_in_v2_pending_independent_review. A real tissue-site conflict replaces supplied disease-category recognition. Changing the positive nodule to benign confines demonstrated disease to the primary and changes the offered pathway to follow-up. This is a fair moderate specimen-to-treatment-field revision.

- suggestions[2]: If retained as basic referral recognition, obtain explicit acceptance of that educational purpose instead of calling it difficult resident reasoning.

  Disposition: addressed_in_v2_pending_independent_review. A real tissue-site conflict replaces supplied disease-category recognition. Changing the positive nodule to benign confines demonstrated disease to the primary and changes the offered pathway to follow-up. This is a fair moderate specimen-to-treatment-field revision.

### Goblet cell tumor despite historical carcinoid terminology ? pass-preserved

Reviewed: `question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1`; original concept `concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1`. Current: `question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1`; current concept `concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1`. Revision attempts: 0.

#### Exact reviewed before

Patient: Elena Brooks; demographics {"ageYears":49,"sexLabel":"Female"}. Chief complaint: **Appendectomy pathology review**.

{patientName}, a 49-year-old woman, attends the clinic after appendectomy. The outside report called a 1.4-cm lesion a goblet cell carcinoid. Expert permanent review of the complete specimen describes infiltrative clusters of mucin-filled goblet cells in the appendiceal wall, with focal synaptophysin staining. The base margin is clear. CT shows no peritoneal or distant lesions, colonoscopy shows no separate colonic lesion, and she is fit for surgery.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.goblet-cell-pathology.v1",
    "prototypeDemographics": {
      "ageYears": 49,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Appendectomy pathology review",
    "presentation": "{patientName}, a 49-year-old woman, attends the clinic after appendectomy. The outside report called a 1.4-cm lesion a goblet cell carcinoid. Expert permanent review of the complete specimen describes infiltrative clusters of mucin-filled goblet cells in the appendiceal wall, with focal synaptophysin staining. The base margin is clear. CT shows no peritoneal or distant lesions, colonoscopy shows no separate colonic lesion, and she is fit for surgery."
  }
]
```

Complete task: **Which further surgical plan should be recommended for {patientName}'s appendiceal tumor after expert pathology review?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Perform right hemicolectomy with regional nodes (choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.right-colectomy.v1)

  Rationale: The definitive infiltrative goblet cell adenocarcinoma diagnosis governs the plan. Current ASCRS guidance includes this tumor in the localized appendiceal adenocarcinoma recommendation for oncologic right colectomy.

- Distractor ? Complete surgical treatment with the appendectomy (choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.completed-resection.v1)

  Rationale: A small favorable well-differentiated NET can have a limited surgical field. Expert review has established infiltrative goblet cell adenocarcinoma, which follows the adenocarcinoma pathway.

- Distractor ? Re-excise the appendiceal base with a cecal cuff (choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.cecal-cuff.v1)

  Rationale: The clear base margin already addresses local clearance. A cecal cuff would leave the regional nodal question created by the adenocarcinoma diagnosis unresolved.

Explanation: The expert permanent diagnosis supersedes the historical carcinoid terminology. Goblet cell adenocarcinoma follows an adenocarcinoma treatment pathway despite focal neuroendocrine staining. With localized staging and fitness for surgery, oncologic right hemicolectomy addresses the regional nodes.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Reviewed full-case/current-node SHA-256: `be6d7bef737da99cfa09b9ac5b9a6ef42bc59a37ed1394ddd158cabb5a6ce0ab`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### After: exact PASS preserved

The before above is the unchanged after. The complete original case, current node, earlier feedback, finite profile, question and timing row are preserved in `APPENDIX_TOPIC_FROZEN_PASS_CONTEXTS`. The unchanged proposal and exact hash remain canonical.

```json
{
  "caseId": "case.topic.appendix-appendicitis.goblet-cell-pathology.v1",
  "nodeId": "node.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
  "exactAfterSha256": "be6d7bef737da99cfa09b9ac5b9a6ef42bc59a37ed1394ddd158cabb5a6ce0ab",
  "fullCaseSha256": "c163c65478a47651c6c6a73ee0d2d0415f6b417a5412aaeb8623101fa4678205",
  "questionSha256": "db760a1bc3ed5c12c70b60faebddf2a96f298ada6ae31b06c122d5e9f23788e8",
  "scope": "Original full case retained; any current recomposition is a separate candidate and does not acquire whole-sequence PASS."
}
```

#### Response to every independent note

clarityIssues: no notes.

cues: no notes.

- fairness[0]: The resident must reconcile the historical carcinoid label and focal neuroendocrine staining with infiltrative mucin-filled goblet-cell morphology, then choose the adenocarcinoma surgical pathway rather than applying a small-NET treatment rule. The 1.4-cm size creates a credible competing interpretation rather than arbitrary extra data.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

- fairness[1]: Right hemicolectomy is a defensible offered plan for localized goblet cell adenocarcinoma under the guideline-based approach described. No confident clinical inaccuracy identified offline; exact-version clinical approval remains separate.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

- fairness[2]: The cecal-cuff option is weaker because the base is clear, but appendectomy completion remains a meaningful near-miss under the historical terminology. No decisive nonmedical cue, convergence or option-length shortcut identified.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

- fairness[3]: The complete pathology review, staging, colonoscopy and surgical fitness make this standalone node understandable without another case part.

  Disposition: preserved_exactly. Preserved the complete reviewed case, exact question, node, earlier feedback, profile and timing. Editorial PASS is not clinical approval.

suggestions: no notes.

### Functional staging of a well-differentiated appendiceal NET ? parked

Reviewed: `question.topic.appendix-appendicitis.net-receptor-staging.v1`; original concept `concept.appendix-appendicitis.net-indeterminate-metastases-staging.v1`. Current: `null (unkeyed)`; current concept `null (historical identity retained)`. Revision attempts: 1.

#### Exact reviewed before

Patient: Isaac Palmer; demographics {"ageYears":41,"sexLabel":"Male"}. Chief complaint: **Appendiceal tumor review**.

{patientName}, a 41-year-old man, attends the clinic after appendectomy identified a 2.6-cm well-differentiated grade-1 neuroendocrine tumor. The base margin is clear. Staging CT describes two small liver lesions that remain indeterminate on its acquired phases. The chest has no suspicious lesion. He is fit for further surgery.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.net-staging.v1",
    "prototypeDemographics": {
      "ageYears": 41,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Appendiceal tumor review",
    "presentation": "{patientName}, a 41-year-old man, attends the clinic after appendectomy identified a 2.6-cm well-differentiated grade-1 neuroendocrine tumor. The base margin is clear. Staging CT describes two small liver lesions that remain indeterminate on its acquired phases. The chest has no suspicious lesion. He is fit for further surgery."
  }
]
```

Complete task: **Which functional imaging study should next complete {patientName}'s appendiceal tumor staging?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? 68Ga-DOTATATE PET/CT (choice.topic.appendix-appendicitis.net-receptor-staging.dotatate.v1)

  Rationale: The well-differentiated NET and unresolved possible metastatic lesions create a receptor-imaging indication. Ga-DOTA PET/CT can add staging information and has higher sensitivity than older receptor scintigraphy.

- Distractor ? 18F-FDG PET/CT (choice.topic.appendix-appendicitis.net-receptor-staging.fdg.v1)

  Rationale: The supplied tumor is well differentiated. Current ASCRS guidance favors somatostatin-receptor PET/CT over FDG PET/CT for detecting disease in this setting.

- Distractor ? 111In-pentetreotide scintigraphy (choice.topic.appendix-appendicitis.net-receptor-staging.pentetreotide.v1)

  Rationale: Older somatostatin-receptor scintigraphy targets a relevant pathway but has largely been replaced by more sensitive Ga-DOTA PET/CT when the latter is available.

Explanation: The lesion is a well-differentiated NET and the CT leaves possible metastatic disease unresolved. Somatostatin-receptor PET/CT can clarify staging in this situation. ASCRS describes Ga-DOTA PET/CT as more sensitive than older receptor scintigraphy for well-differentiated NET assessment.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Reviewed full-case/current-node SHA-256: `54085a4df70cad46a8b646ed9c27c6603bf43118a1b37e25d98c494f451c3716`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### After: parked, no scored version

The tracer choice remains basic recall when functional imaging is prespecified. A broader next-investigation comparison needs a directly supported hierarchy versus dedicated liver MRI; the verified guideline supports NET-specific imaging without resolving that exact sequence. No accepted basic-purpose exception exists.

The corrected planning task and named competing actions below are unkeyed. The old historical key is excluded from fresh preview and is not being endorsed.

```json
{
  "id": "hold.appendix-appendicitis.review1-net-next-investigation",
  "status": "parked",
  "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.net-receptor-staging.v1",
  "questionVariantId": null,
  "conceptId": null,
  "retainedHistoricalConceptId": "concept.appendix-appendicitis.net-indeterminate-metastases-staging.v1",
  "reason": "The tracer choice remains basic recall when functional imaging is prespecified. A broader next-investigation comparison needs a directly supported hierarchy versus dedicated liver MRI; the verified guideline supports NET-specific imaging without resolving that exact sequence. No accepted basic-purpose exception exists.",
  "unkeyedPlanningTask": "Which investigation should be added to staging for the appendiceal NET with liver lesions indeterminate on the acquired CT phases?",
  "unkeyedActions": [
    "Dedicated contrast liver MRI",
    "68Ga-DOTATATE PET/CT"
  ],
  "clinicalDecisionNeeded": "Define the exact acquisition limitation and staging goal that make one next investigation preferable, with direct support. Otherwise retain this as an unkeyed planning slot rather than imply either study completes staging.",
  "reviewedVersionRetainedIn": "independentReviewRound1.snapshot.proposals"
}
```

#### Response to every independent note

- clarityIssues[0]: 'should next complete' suggests that the chosen functional study will necessarily resolve two small indeterminate liver lesions. The explanation more appropriately says it 'can clarify' staging.

  Disposition: scored_item_parked. The unkeyed planning wording says add to staging, never complete it. The separately revised operative item explicitly attributes cyst morphology to dedicated precontrast and postcontrast liver MRI.

cues: no notes.

- fairness[0]: 68Ga-DOTATATE PET/CT is a defensible best choice among these functional studies for the stated well-differentiated NET. The tracer labels are parallel and do not reveal the answer through ordinary word matching.

  Disposition: scored_item_parked. DOTATATE remains reasonable among the old functional choices, but deleting indeterminate liver findings still leaves that tracer preference. Current verified guidance does not rank dedicated liver MRI against receptor imaging as the uniquely correct next study. Negative receptor uptake is not credited with proving cysts.

- fairness[1]: The stem supplies the diagnosis and grade, while the task preselects functional imaging. The remaining decision is primarily recall of the appropriate tracer. Removing the liver findings would still leave the same preferred tracer among these options; the lesions do not earn a second consequential inference.

  Disposition: scored_item_parked. DOTATATE remains reasonable among the old functional choices, but deleting indeterminate liver findings still leaves that tracer preference. Current verified guidance does not rank dedicated liver MRI against receptor imaging as the uniquely correct next study. Negative receptor uptake is not credited with proving cysts.

- fairness[2]: A neutral next-investigation task would need to account for dedicated anatomic liver characterization as a credible alternative. This review does not assert that such imaging must precede receptor imaging in this patient.

  Disposition: scored_item_parked. DOTATATE remains reasonable among the old functional choices, but deleting indeterminate liver findings still leaves that tracer preference. Current verified guidance does not rank dedicated liver MRI against receptor imaging as the uniquely correct next study. Negative receptor uptake is not credited with proving cysts.

- fairness[3]: The following update says 'completed liver characterization shows simple cysts' without identifying which study did that work. It is plausible that additional imaging occurred, but the sequence should not imply that a negative receptor study by itself proves simple cysts.

  Disposition: scored_item_parked. DOTATATE remains reasonable among the old functional choices, but deleting indeterminate liver findings still leaves that tracer preference. Current verified guidance does not rank dedicated liver MRI against receptor imaging as the uniquely correct next study. Negative receptor uptake is not credited with proving cysts.

- suggestions[0]: Use 'add to staging' rather than a promise to complete it, unless the returned studies genuinely establish the necessary findings.

  Disposition: scored_item_parked. Parked rather than manufacture a hierarchy or seek a basic-purpose exception. Future planning compares named dedicated liver MRI and receptor PET without a key; acceptance needs a supported exact purpose and sequencing context.

- suggestions[1]: For a difficult item, compare clinically credible next investigations using actual acquisition limitations and a supported purpose for the next study; reverify the ranking rather than simply deleting 'functional'.

  Disposition: scored_item_parked. Parked rather than manufacture a hierarchy or seek a basic-purpose exception. Future planning compares named dedicated liver MRI and receptor PET without a key; acceptance needs a supported exact purpose and sequencing context.

- suggestions[2]: Alternatively, explicitly seek acceptance as a focused tracer-selection item. In the later update identify the study or studies that established benign liver morphology.

  Disposition: scored_item_parked. Parked rather than manufacture a hierarchy or seek a basic-purpose exception. Future planning compares named dedicated liver MRI and receptor PET without a key; acceptance needs a supported exact purpose and sequencing context.

### Regional resection for a 2.6-cm appendiceal NET ? revised

Reviewed: `question.topic.appendix-appendicitis.net-regional-resection.v1`; original concept `concept.appendix-appendicitis.large-net-regional-resection.v1`. Current: `question.topic.appendix-appendicitis.net-regional-resection.v2`; current concept `concept.appendix-appendicitis.large-net-regional-resection.v1`. Revision attempts: 1.

#### Exact reviewed before

Patient: Isaac Palmer; demographics {"ageYears":41,"sexLabel":"Male"}. Chief complaint: **Appendiceal tumor review**.

{patientName}, a 41-year-old man, attends the clinic after appendectomy identified a 2.6-cm well-differentiated grade-1 neuroendocrine tumor. The base margin is clear. Staging CT describes two small liver lesions that remain indeterminate on its acquired phases. The chest has no suspicious lesion. He is fit for further surgery.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.net-staging.v1",
    "prototypeDemographics": {
      "ageYears": 41,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Appendiceal tumor review",
    "presentation": "{patientName}, a 41-year-old man, attends the clinic after appendectomy identified a 2.6-cm well-differentiated grade-1 neuroendocrine tumor. The base margin is clear. Staging CT describes two small liver lesions that remain indeterminate on its acquired phases. The chest has no suspicious lesion. He is fit for further surgery."
  }
]
```

Current update: At later follow-up, {patientName}'s completed liver characterization shows simple cysts, and the multidisciplinary staging review finds no distant disease. The permanent appendix specimen confirms a 2.6-cm well-differentiated NET with a clear base margin. The appendectomy included the mesoappendix, and he remains fit for surgery.

Complete task: **Which further surgical plan should be recommended for {patientName}'s localized 2.6-cm appendiceal NET?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Perform right hemicolectomy with regional nodes (choice.topic.appendix-appendicitis.net-regional-resection.right-colectomy.v1)

  Rationale: For a fit patient with a nonmetastatic appendiceal NET larger than 2 cm, ASCRS guidance supports right hemicolectomy to address the regional nodal basin despite the clear appendectomy margin.

- Distractor ? Complete surgical treatment with the appendectomy (choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v1)

  Rationale: A clear local margin and mesoappendix removal establish the appendectomy field. The tumor exceeds the directly supported 2-cm size boundary for recommending regional right hemicolectomy.

- Distractor ? Re-excise the appendiceal base with a cecal cuff (choice.topic.appendix-appendicitis.net-regional-resection.cecal-cuff.v1)

  Rationale: A cecal cuff addresses local clearance. This tumor has a clear base margin, while its size makes the regional nodal field consequential.

Explanation: Completed staging establishes a localized surgical problem. The clear base margin addresses local clearance, while the 2.6-cm tumor exceeds the ASCRS greater-than-2-cm boundary for right hemicolectomy with regional nodal assessment.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.net-receptor-staging.v1",
    "task": "Which functional imaging study should next complete {patientName}'s appendiceal tumor staging?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The lesion is a well-differentiated NET and the CT leaves possible metastatic disease unresolved. Somatostatin-receptor PET/CT can clarify staging in this situation. ASCRS describes Ga-DOTA PET/CT as more sensitive than older receptor scintigraphy for well-differentiated NET assessment.",
    "allPossibleChoiceFeedback": [
      {
        "label": "18F-FDG PET/CT",
        "rationale": "The supplied tumor is well differentiated. Current ASCRS guidance favors somatostatin-receptor PET/CT over FDG PET/CT for detecting disease in this setting."
      },
      {
        "label": "68Ga-DOTATATE PET/CT",
        "rationale": "The well-differentiated NET and unresolved possible metastatic lesions create a receptor-imaging indication. Ga-DOTA PET/CT can add staging information and has higher sensitivity than older receptor scintigraphy."
      },
      {
        "label": "111In-pentetreotide scintigraphy",
        "rationale": "Older somatostatin-receptor scintigraphy targets a relevant pathway but has largely been replaced by more sensitive Ga-DOTA PET/CT when the latter is available."
      }
    ]
  }
]
```

Reviewed full-case/current-node SHA-256: `288580d5e747a790d2be4ea2d47b7cdc0e663f3f6ffb2c608f088585a0dbb81e`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### Proposed v2 after

Patient: Isaac Palmer; demographics {"ageYears":41,"sexLabel":"Male"}. Chief complaint: **Appendiceal tumor review**.

{patientName}, a 41-year-old man, attends the clinic after appendectomy found a neuroendocrine tumor. The initial staging CT described two liver lesions as indeterminate on the acquired phases. He returns with the complete appendix pathology and the subsequent dedicated liver study for management planning.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.net-staging.v2",
    "prototypeDemographics": {
      "ageYears": 41,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Appendiceal tumor review",
    "presentation": "{patientName}, a 41-year-old man, attends the clinic after appendectomy found a neuroendocrine tumor. The initial staging CT described two liver lesions as indeterminate on the acquired phases. He returns with the complete appendix pathology and the subsequent dedicated liver study for management planning."
  }
]
```

Current update: Dedicated liver MRI obtained after the staging CT resolves both previously indeterminate lesions. Each has uniform low T1 and high T2 signal, a smooth thin wall, and no mural nodule or enhancement on the acquired precontrast and postcontrast series. The remainder of liver MRI and chest, abdominal and pelvic staging shows no additional lesions. The whole appendix specimen contains a 2.6-cm well-differentiated grade-1 neuroendocrine tumor with a clear base margin; the mesoappendix was removed. {patientName} has recovered and remains fit for surgery.

Complete task: **Which next management plan should be recommended for {patientName}'s appendiceal tumor after these acquired staging results?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Proceed with right hemicolectomy and regional nodes (choice.topic.appendix-appendicitis.net-regional-resection.right-colectomy.v2)

  Rationale: The acquired MRI observations characterize the represented liver lesions as simple cysts rather than leaving them indeterminate for staging. In this fit patient, the whole-specimen tumor size supports regional resection despite a clear appendectomy margin.

- Distractor ? Finish resection with appendectomy and follow-up (choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v2)

  Rationale: The liver findings have benign cyst morphology, but the completely measured primary is larger than the guideline boundary for appendix-only treatment. A clear base does not address regional nodal risk.

- Distractor ? Obtain liver core biopsy before further resection (choice.topic.appendix-appendicitis.net-regional-resection.liver-biopsy.v2)

  Rationale: These are resolved fluid-signal, nonenhancing lesions without internal solid tissue on adequate MRI, not persistent indeterminate targets. Biopsy would add an unsupported staging step. This conclusion comes from morphology, not a negative receptor scan.

Explanation: The earlier CT uncertainty must be updated using the actual MRI: simple fluid signal, a thin wall and no enhancing internal tissue characterize the represented lesions as cysts. This is different from inferring cysts from absent receptor uptake. The whole-specimen primary exceeds the directly sourced greater-than-2-cm NET boundary, so regional nodal resection remains indicated despite a clear base margin. A smaller favorable tumor or unresolved liver staging would change this decision.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Current full-case/current-node SHA-256: `e8abeedcd7ed64aa7f0b106468278fce59614b2567214a91e69e00f512e00500`.

#### Concrete manual author gate

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Use adequate precontrast, fluid-sensitive and postcontrast MRI morphology to resolve the two actual CT targets as simple cysts rather than assuming that absent receptor activity proves benignity.",
  "apply": "With those staging targets resolved, apply the complete primary specimen and regional nodal indication rather than treating local margin clearance as completion of all surgery.",
  "closestError": "Defer the operative plan for liver biopsy because the earlier CT used the word indeterminate, without incorporating the later morphology.",
  "decidingObservation": "Both actual CT targets are resolved on dedicated MRI as homogeneous fluid-signal lesions without enhancing internal tissue; the complete primary measures 2.6 cm.",
  "consequence": "An unnecessary invasive staging step delays the regional plan, or appendix-only treatment leaves the regional basin unaddressed.",
  "deletionTest": "Without the dedicated MRI, the prior CT uncertainty remains and immediate regional planning is underspecified. Without the full primary measurement, the regional indication is not established. The clear margin distinguishes local from regional treatment. Grade and mesoappendix information make the small-favorable counterfactual coherent.",
  "counterfactual": "Replace the whole-specimen primary measurement with a subcentimeter tumor lacking unfavorable features, preserving complete appendectomy with mesoappendix and benign MRI. Finish resection with appendectomy and follow-up becomes the best offered plan.",
  "counterfactualChoiceId": "completed-resection",
  "cueAttack": "The neutral task no longer repeats localized diagnosis or size. The weak cecal-cuff competitor is replaced by a staging-first plan driven by the prior actual uncertainty. All options are current post-staging management policies: finish, proceed regionally, or defer for targeted tissue. The key is neither uniquely cautious nor the only investigation with a preview.",
  "stageCategory": "Current operative planning after acquired staging: finish treatment, proceed with regional resection, or defer for additional targeted staging.",
  "difficulty": "Predicted moderate for PGY-2/3 from carrying an obsolete indeterminate-stage conclusion forward or confusing low grade and a negative local margin with a small favorable primary. The disputed 1-2-cm boundary is not used.",
  "oneBestAnswer": "Adequate diagnostic cyst morphology resolves the represented staging concern; ASCRS recommendation 7 directly supports regional surgery for this greater-than-2-cm nonmetastatic primary. MRI does not claim to exclude every microscopic metastasis, and no biopsy is universally ranked against receptor imaging.",
  "sequenceCheck": "The tracer-selection question is parked. The current version is a standalone clinic record with the earlier CT uncertainty in the header and the actual dedicated liver MRI in this update; no receptor result is invented or credited with cyst diagnosis.",
  "repairRecord": "One response to the independent REVISE: named the modality and acquisitions, replaced the handed-down staging conclusion with supported MRI observations, neutralized the task and replaced a margin-nullified cuff with a real staging competitor. Re-solved both the smaller-primary and unresolved-liver boundaries.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v2",
      "temptation": "Equate a low grade, clear margin and benign liver findings with a small favorable NET that needs no further resection.",
      "rankingRationale": "The liver findings have benign cyst morphology, but the completely measured primary is larger than the guideline boundary for appendix-only treatment. A clear base does not address regional nodal risk.",
      "counterfactual": "If the fully measured tumor were smaller than 1 cm without unfavorable features and had been removed with its mesoappendix, ending resection at appendectomy would be the best offered plan.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.hepatic-cyst-mri",
        "claim.appendix-appendicitis.net-resection",
        "claim.appendix-appendicitis.small-favorable-net-resection"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.liver-biopsy.v2",
      "temptation": "Carry the earlier CT uncertainty forward despite the newly acquired diagnostic morphology.",
      "rankingRationale": "These are resolved fluid-signal, nonenhancing lesions without internal solid tissue on adequate MRI, not persistent indeterminate targets. Biopsy would add an unsupported staging step. This conclusion comes from morphology, not a negative receptor scan.",
      "counterfactual": "If an enhancing solid component remained unresolved on dedicated imaging and multidisciplinary review selected tissue confirmation to determine treatment intent, liver sampling before further resection could be appropriate.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.hepatic-cyst-mri",
        "claim.appendix-appendicitis.net-functional-staging"
      ]
    }
  ]
}
```

#### Atomic statements and timing/order proposals

Claims: `claim.appendix-appendicitis.hepatic-cyst-mri`, `claim.appendix-appendicitis.net-resection`, `claim.appendix-appendicitis.small-favorable-net-resection`, `claim.appendix-appendicitis.net-functional-staging`. Exact independent statements and full source records are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json).

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.net-staging.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.hepatic-cyst-mri",
          "claim.appendix-appendicitis.net-resection",
          "claim.appendix-appendicitis.small-favorable-net-resection",
          "claim.appendix-appendicitis.net-functional-staging"
        ]
      },
      {
        "fields": [
          "answerChoices[id=completed-resection].label",
          "answerChoices[id=completed-resection].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.hepatic-cyst-mri",
          "claim.appendix-appendicitis.net-resection",
          "claim.appendix-appendicitis.small-favorable-net-resection"
        ]
      },
      {
        "fields": [
          "answerChoices[id=right-colectomy].label",
          "answerChoices[id=right-colectomy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.hepatic-cyst-mri",
          "claim.appendix-appendicitis.net-resection"
        ]
      },
      {
        "fields": [
          "answerChoices[id=liver-biopsy].label",
          "answerChoices[id=liver-biopsy].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.hepatic-cyst-mri",
          "claim.appendix-appendicitis.net-functional-staging"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The tracer-selection question is parked. The current version is a standalone clinic record with the earlier CT uncertainty in the header and the actual dedicated liver MRI in this update; no receptor result is invented or credited with cyst diagnosis."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.net-staging.v2",
    "nodeId": "node.topic.appendix-appendicitis.net-regional-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v2",
          "choiceLabel": "Finish resection with appendectomy and follow-up",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.right-colectomy.v2",
          "choiceLabel": "Proceed with right hemicolectomy and regional nodes",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.liver-biopsy.v2",
          "choiceLabel": "Obtain liver core biopsy before further resection",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.net-staging.v2",
    "nodeId": "node.topic.appendix-appendicitis.net-regional-resection.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v2",
        "choiceLabel": "Finish resection with appendectomy and follow-up"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.right-colectomy.v2",
        "choiceLabel": "Proceed with right hemicolectomy and regional nodes"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.net-regional-resection.liver-biopsy.v2",
        "choiceLabel": "Obtain liver core biopsy before further resection"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

#### Response to every independent note

- clarityIssues[0]: The follow-up does not identify how the indeterminate liver findings became simple cysts. It is otherwise self-contained and explicitly states the completed staging conclusion.

  Disposition: addressed_in_v2_pending_independent_review. Actual dedicated MRI sequences and contrast observations establish how the CT targets were resolved. The task neutrally accommodates finishing, proceeding or deferring the management plan.

- clarityIssues[1]: 'further surgical plan' is an awkward lead-in for the option that means no further operation.

  Disposition: addressed_in_v2_pending_independent_review. Actual dedicated MRI sequences and contrast observations establish how the CT targets were resolved. The task neutrally accommodates finishing, proceeding or deferring the management plan.

- cues[0]: localized 2.6-cm appendiceal NET ? The task repeats exactly the diagnosis, staging conclusion and measurement needed for the size-rule answer. It highlights the discriminator rather than asking the learner to interpret the acquired findings.

  Disposition: addressed_in_v2_pending_independent_review. Removed the localized-size diagnosis from the task. Preserved the base margin but replaced the weak cuff foil with targeted liver sampling before further resection. The prior CT uncertainty now competes with actual new morphology.

- cues[1]: with a clear base margin ? This explicitly weakens 'Re-excise the appendiceal base with a cecal cuff'. The key is then distinguished from stopping largely by recalling the size boundary. Retain margin status but choose a stronger competitor.

  Disposition: addressed_in_v2_pending_independent_review. Removed the localized-size diagnosis from the task. Preserved the base margin but replaced the weak cuff foil with targeted liver sampling before further resection. The prior CT uncertainty now competes with actual new morphology.

- fairness[0]: Right hemicolectomy with regional nodes is the defensible offered guideline-based answer for the represented fit patient with a localized 2.6-cm tumor. No confident clinical inaccuracy identified offline.

  Disposition: addressed_in_v2_pending_independent_review. The primary remains 2.6 cm; the disputed 1-2-cm group is not used. Raw MRI supports cyst morphology, independently of any receptor result. Whole-specimen size and regional nodes remain distinct from local margin clearance. The prior tracer question is parked.

- fairness[1]: The acquired exclusion of metastases is clinically useful, but it is handed to the learner as a conclusion. Neither interpreting raw liver findings nor resolving a management tradeoff is required. This is a high-yield threshold-recall item rather than two-step reasoning.

  Disposition: addressed_in_v2_pending_independent_review. The primary remains 2.6 cm; the disputed 1-2-cm group is not used. Raw MRI supports cyst morphology, independently of any receptor result. Whole-specimen size and regional nodes remain distinct from local margin clearance. The prior tracer question is parked.

- fairness[2]: Prior receptor-imaging feedback does not give away the resection threshold. The chronology is plausible, subject to specifying the liver characterization rather than implying receptor imaging alone established cysts.

  Disposition: addressed_in_v2_pending_independent_review. The primary remains 2.6 cm; the disputed 1-2-cm group is not used. Raw MRI supports cyst morphology, independently of any receptor result. Whole-specimen size and regional nodes remain distinct from local margin clearance. The prior tracer question is parked.

- suggestions[0]: Use a neutral next-management task without repeating the keyed size and localized diagnosis.

  Disposition: addressed_in_v2_pending_independent_review. Named modality/acquisitions, interpreted staging targets, neutral management task and a credible staging-first competitor. A small favorable primary changes the offered plan to completion at appendectomy; unresolved solid liver tissue would reopen staging.

- suggestions[1]: Require a supported interpretation of specimen or staging evidence that changes what operation is appropriate, with a credible alternative at that same decision stage.

  Disposition: addressed_in_v2_pending_independent_review. Named modality/acquisitions, interpreted staging targets, neutral management task and a credible staging-first competitor. A small favorable primary changes the offered plan to completion at appendectomy; unresolved solid liver tissue would reopen staging.

- suggestions[2]: Do not manufacture difficulty by moving into a disputed intermediate-size category without resolving its evidence and clinician-review requirements.

  Disposition: addressed_in_v2_pending_independent_review. Named modality/acquisitions, interpreted staging targets, neutral management task and a credible staging-first competitor. A small favorable primary changes the offered plan to completion at appendectomy; unresolved solid liver tissue would reopen staging.

### Imaging renewed symptoms after perforated appendicitis ? revised

Reviewed: `question.topic.appendix-appendicitis.postoperative-infection-imaging.v1`; original concept `concept.appendix-appendicitis.postoperative-deep-infection-imaging.v1`. Current: `question.topic.appendix-appendicitis.postoperative-infection-imaging.v2`; current concept `concept.appendix-appendicitis.postoperative-deep-infection-imaging.v2`. Revision attempts: 1.

#### Exact reviewed before

Patient: Maya Collins; demographics {"ageYears":35,"sexLabel":"Female"}. Chief complaint: **Pain after appendectomy**.

{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.postoperative-source-control.v1",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pain after appendectomy",
    "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded."
  }
]
```

Complete task: **Which investigation should the acute-care team obtain next for {patientName}'s renewed symptoms after appendectomy?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Contrast-enhanced abdominal and pelvic CT (choice.topic.appendix-appendicitis.postoperative-infection-imaging.abdominal-ct.v1)

  Rationale: The recovery-then-deterioration pattern raises a deep intra-abdominal source question. Intravenous contrast-enhanced CT maps collections and their relation to bowel for subsequent source-control planning.

- Distractor ? Targeted ultrasound of the abdominal port sites (choice.topic.appendix-appendicitis.postoperative-infection-imaging.port-ultrasound.v1)

  Rationale: A focused superficial study could assess a localized port-site collection. The represented fever and deep pelvic symptoms require examination of the intra-abdominal field.

- Distractor ? Upright and supine abdominal radiographs (choice.topic.appendix-appendicitis.postoperative-infection-imaging.radiographs.v1)

  Rationale: Radiographs can depict a bowel-gas pattern but provide limited characterization of an intra-abdominal infectious source. The renewed fever and deep pain make source mapping consequential.

Explanation: The return of fever and deep pelvic pain after initial recovery raises concern for a postoperative intra-abdominal source. CT with intravenous contrast maps the source and the anatomy needed for a treatment plan. A focused port study and plain films examine narrower targets.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Reviewed full-case/current-node SHA-256: `313a6e9219eb4cd56d9c15d6420172d15d5cd44f1cd9a55b21b4d16080e440c1`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### Proposed v2 after

Patient: Maya Collins; demographics {"ageYears":35,"sexLabel":"Female"}. Chief complaint: **Pain after appendectomy**.

{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.postoperative-source-control.v2",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pain after appendectomy",
    "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode."
  }
]
```

Current update: During this same episode, the hospital performed abdominal and pelvic CT. The transferred report says no collection is seen on the supplied images. Its image manifest lists a scout and precontrast axial images. The scanner log records both precontrast and intravenous-contrast acquisitions covering the abdomen and pelvis; the source archive contains the complete postcontrast dataset, available for current radiologist review. Symptoms and examination have not changed since that acquisition. Creatinine is within its reporting interval and no iodinated-contrast reaction occurred.

Complete task: **Which imaging action should the acute-care team recommend next for {patientName}'s renewed postoperative symptoms on this acquisition and transfer record?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Review the archived contrast-enhanced abdominal and pelvic CT (choice.topic.appendix-appendicitis.postoperative-infection-imaging.archive-review.v2)

  Rationale: The renewed illness still requires source localization, but the negative subset report cannot settle it. The acquisition log and actual archive establish that the needed current contrast images exist; reviewing them addresses the unresolved question without duplicating acquisition.

- Distractor ? Repeat contrast-enhanced abdominal and pelvic CT (choice.topic.appendix-appendicitis.postoperative-infection-imaging.repeat-ct.v2)

  Rationale: A repeat acquisition could be necessary for inadequate source images or a changed clinical state. Here the complete current contrast acquisition already exists and is available for review, while the reassuring report covers only the transferred subset.

- Distractor ? Obtain contrast-enhanced abdominal and pelvic MRI (choice.topic.appendix-appendicitis.postoperative-infection-imaging.mri.v2)

  Rationale: MRI is a real cross-sectional alternative, but the supplied record already contains the current contrast CT acquisition for the clinical question. Changing modalities does not first resolve the evidentiary error in accepting a subset report. No universal CT-versus-MRI ranking is claimed.

Explanation: A reassuring interpretation applies to the supplied images, not to a different dataset still in the archive. Renewed fever and pain after recovery require source localization. The record establishes that complete current contrast CT images were acquired and remain available; review those images before repeating or replacing that acquisition. This conclusion depends on unchanged clinical status and adequate source images, not on the mere absence of exported files.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[]
```

Current full-case/current-node SHA-256: `975d4267ff1320bf23fb02929c419e610806687c8bd5bdf6c85bc8e549802b23`.

#### Concrete manual author gate

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Read the negative report as a statement about the transferred precontrast subset, then use the administration log, coverage and actual archive to establish what was acquired.",
  "apply": "Address the unresolved postoperative source question by reviewing the existing current contrast dataset rather than assuming it must be reacquired or replaced.",
  "closestError": "Repeat contrast CT because missing postcontrast files in the transfer package are mistaken for an unperformed acquisition.",
  "decidingObservation": "The scanner log and source archive confirm a complete abdominal and pelvic postcontrast acquisition from the same unchanged clinical episode, available for current radiologist review.",
  "consequence": "Unnecessary duplicate contrast acquisition and delayed interpretation, or false reassurance from a report with narrower image scope.",
  "deletionTest": "Deleting the acquisition log or archive availability makes retrieval versus repeat underspecified. Deleting unchanged clinical status removes the reason to rely on the same episode. Deleting renewed illness removes the source-localization need. No superficial wound finding is supplied to dismiss a mismatched ultrasound option.",
  "counterfactual": "Change the scanner and administration records to show that the postcontrast acquisition was never performed and only the supplied noncontrast images exist. Repeat contrast-enhanced abdominal and pelvic CT becomes the best offered action.",
  "counterfactualChoiceId": "repeat-ct",
  "cueAttack": "All options address the same abdominal and pelvic field with contrast-based cross-sectional assessment. There is no superficial ultrasound or plain-film foil. Safety facts do not uniquely license the key: the repeat CT is feasible too. The necessary acquisition record earns the retrieval decision and explicitly distinguishes acquired images from unperformed testing.",
  "stageCategory": "Current imaging action for the same postoperative source question: review an available acquired dataset, repeat acquisition, or acquire an alternative modality.",
  "difficulty": "Predicted moderate for PGY-2/3 from overrepeating a study after incomplete transfer or trusting a negative subset report. This is an explicitly changed evidence-scope construct and a fair moderate fallback, not a claim that generic postoperative CT selection became hard.",
  "oneBestAnswer": "The full current dataset and review access are explicit constructed records, not inferred from missing files. The clinical source supports contrast CT localization; the retrieval ranking follows these records and is not presented as a new guideline rule or a universal modality hierarchy.",
  "sequenceCheck": "The current header contains renewed postoperative illness but no source anatomy. This review identifies no collection, access route or antibiotic endpoint; the next node supplies the actual reviewed findings.",
  "repairRecord": "One response to the independent REVISE: replaced superficial-site and radiograph foils with credible imaging actions, made acquired-versus-transferred evidence consequential, and removed port-site negatives and contrast-permission matching. Versioned the materially changed concept and re-solved the unperformed-acquisition counterfactual.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.repeat-ct.v2",
      "temptation": "Treat incomplete transfer as proof that the required acquisition was never performed.",
      "rankingRationale": "A repeat acquisition could be necessary for inadequate source images or a changed clinical state. Here the complete current contrast acquisition already exists and is available for review, while the reassuring report covers only the transferred subset.",
      "counterfactual": "If the scanner and administration records instead showed that no contrast acquisition had occurred, with only the supplied noncontrast images available, a new contrast CT would become the best offered action.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.postoperative-ct",
        "claim.appendix-appendicitis.ct-series-scope"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.mri.v2",
      "temptation": "Escalate to another modality because the outside report and symptoms disagree, without checking the actual acquired images.",
      "rankingRationale": "MRI is a real cross-sectional alternative, but the supplied record already contains the current contrast CT acquisition for the clinical question. Changing modalities does not first resolve the evidentiary error in accepting a subset report. No universal CT-versus-MRI ranking is claimed.",
      "counterfactual": "If CT were genuinely unavailable or nondiagnostic and a clinically appropriate MRI pathway were selected after reviewing the acquisition limitations, MRI could be the appropriate alternative.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.postoperative-ct",
        "claim.appendix-appendicitis.ct-series-scope"
      ]
    }
  ]
}
```

#### Atomic statements and timing/order proposals

Claims: `claim.appendix-appendicitis.postoperative-ct`, `claim.appendix-appendicitis.ct-series-scope`. Exact independent statements and full source records are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json).

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.postoperative-ct",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      },
      {
        "fields": [
          "answerChoices[id=repeat-ct].label",
          "answerChoices[id=repeat-ct].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.postoperative-ct",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      },
      {
        "fields": [
          "answerChoices[id=archive-review].label",
          "answerChoices[id=archive-review].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.postoperative-ct",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      },
      {
        "fields": [
          "answerChoices[id=mri].label",
          "answerChoices[id=mri].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.postoperative-ct",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The current header contains renewed postoperative illness but no source anatomy. This review identifies no collection, access route or antibiotic endpoint; the next node supplies the actual reviewed findings."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "nodeId": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.repeat-ct.v2",
          "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.archive-review.v2",
          "choiceLabel": "Review the archived contrast-enhanced abdominal and pelvic CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.general_diagnostic"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.mri.v2",
          "choiceLabel": "Obtain contrast-enhanced abdominal and pelvic MRI",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.mri"
          }
        }
      ]
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "nodeId": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.repeat-ct.v2",
        "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.archive-review.v2",
        "choiceLabel": "Review the archived contrast-enhanced abdominal and pelvic CT"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.mri.v2",
        "choiceLabel": "Obtain contrast-enhanced abdominal and pelvic MRI"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

#### Response to every independent note

clarityIssues: no notes.

- cues[0]: deep pelvic pain ? This contrasts directly with the narrow superficial target in 'Targeted ultrasound of the abdominal port sites'. A reader can reject that option on location alone.

  Disposition: addressed_in_v2_pending_independent_review. Removed dry-port and superficial-site foils. All options evaluate the actual abdominal/pelvic field with contrast-based imaging. The contrast safety observation does not uniquely license the key; repeat contrast CT is feasible too.

- cues[1]: The port incisions are dry ? The stem adds an option-specific reassuring finding at the very site named in the weak ultrasound distractor, further removing its plausibility.

  Disposition: addressed_in_v2_pending_independent_review. Removed dry-port and superficial-site foils. All options evaluate the actual abdominal/pelvic field with contrast-based imaging. The contrast safety observation does not uniquely license the key; repeat contrast CT is feasible too.

- cues[2]: renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded ? Only the keyed choice requests contrast. These eligibility details are legitimate safety context, but alongside two weak competitors they prominently rehearse permission for the key instead of supporting a difficult choice.

  Disposition: addressed_in_v2_pending_independent_review. Removed dry-port and superficial-site foils. All options evaluate the actual abdominal/pelvic field with contrast-based imaging. The contrast safety observation does not uniquely license the key; repeat contrast CT is feasible too.

- fairness[0]: Contrast-enhanced abdominal and pelvic CT is the defensible best offered investigation for renewed fever and deep pain after initial recovery from perforated appendicitis. No confident clinical inaccuracy identified offline.

  Disposition: addressed_in_v2_pending_independent_review. A supported imaging question remains, but the scored meaning is now evidence scope. A negative subset report cannot establish what the acquired postcontrast dataset shows. Retrieval versus repeat follows the constructed log, not an unsupported universal guideline rule. The source and the narrow logical limitation are explicit.

- fairness[1]: Inferring a postoperative intra-abdominal complication and choosing CT is conceptually sequential, but neither step competes meaningfully with these distractors for the target resident audience. The nominal diagnosis-then-test chain does not establish two consequential steps.

  Disposition: addressed_in_v2_pending_independent_review. A supported imaging question remains, but the scored meaning is now evidence scope. A negative subset report cannot establish what the acquired postcontrast dataset shows. Retrieval versus repeat follows the constructed log, not an unsupported universal guideline rule. The source and the narrow logical limitation are explicit.

- fairness[2]: The first node is self-contained. Its explanation prepares the general source-localization context without specifying the later drainage route.

  Disposition: addressed_in_v2_pending_independent_review. A supported imaging question remains, but the scored meaning is now evidence scope. A negative subset report cannot establish what the acquired postcontrast dataset shows. Retrieval versus repeat follows the constructed log, not an unsupported universal guideline rule. The source and the narrow logical limitation are explicit.

- suggestions[0]: Replace the anatomically mismatched superficial ultrasound option with an investigation a resident could reasonably consider for the actual postoperative problem.

  Disposition: addressed_in_v2_pending_independent_review. Credible review/repeat/alternative cross-sectional actions replace mismatched tests. A real acquired-versus-transferred distinction changes the answer. The unperformed-acquisition counterfactual favors new CT. This materially changed construct has a new concept version and is only predicted moderate.

- suggestions[1]: Make acquisition adequacy, a real competing postoperative mechanism or a supported sequencing issue consequential to the test choice. Do not merely add more clinical details to a generic CT-recognition task.

  Disposition: addressed_in_v2_pending_independent_review. Credible review/repeat/alternative cross-sectional actions replace mismatched tests. A real acquired-versus-transferred distinction changes the answer. The unperformed-acquisition counterfactual favors new CT. This materially changed construct has a new concept version and is only predicted moderate.

- suggestions[2]: Retain necessary contrast safety information while avoiding a sequence of negatives written solely to eliminate alternatives.

  Disposition: addressed_in_v2_pending_independent_review. Credible review/repeat/alternative cross-sectional actions replace mismatched tests. A real acquired-versus-transferred distinction changes the answer. The unperformed-acquisition counterfactual favors new CT. This materially changed construct has a new concept version and is only predicted moderate.

### Source control for a localized postoperative pelvic collection ? revised

Reviewed: `question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1`; original concept `concept.appendix-appendicitis.localized-postoperative-abscess-drainage.v1`. Current: `question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2`; current concept `concept.appendix-appendicitis.localized-postoperative-abscess-drainage.v1`. Revision attempts: 1.

#### Exact reviewed before

Patient: Maya Collins; demographics {"ageYears":35,"sexLabel":"Female"}. Chief complaint: **Pain after appendectomy**.

{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.postoperative-source-control.v1",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pain after appendectomy",
    "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded."
  }
]
```

Current update: The receiving hospital's CT shows a 5.5-cm rim-enhancing pelvic collection containing gas. It abuts the bladder and rectum, with a posterior catheter path clear of bowel. No enteric contrast leak or diffuse intraperitoneal fluid is seen. Fever and focal pain persist after intravenous antibiotics. {patientName} remains alert with stable blood pressure and no diffuse rigidity.

Complete task: **Which source-control plan should be recommended now for {patientName}'s postoperative pelvic collection?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Perform image-guided pelvic catheter drainage (choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v1)

  Rationale: Persistent infection and an organized localized collection call for source control. The safe posterior route and absence of generalized peritonitis support image-guided catheter drainage with ongoing antimicrobial care.

- Distractor ? Continue intravenous antibiotics with serial examination (choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v1)

  Rationale: Antibiotics can suffice for selected small or resolving collections. Persistent infection with this organized accessible collection supports evacuation as part of source control.

- Distractor ? Perform operative exploration with pelvic drainage (choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v1)

  Rationale: Exploration can control generalized contamination, an ongoing enteric leak or a collection inaccessible to percutaneous treatment. The supplied single localized collection has a safe catheter route and stable physiology.

Explanation: The organized collection and persistent fever indicate a residual source needing control. Stable physiology, localization and a safe catheter route support image-guided drainage with antimicrobial therapy. Generalized contamination or an uncontrolled enteric leak would change the source-control operation.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v1",
    "task": "Which investigation should the acute-care team obtain next for {patientName}'s renewed symptoms after appendectomy?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The return of fever and deep pelvic pain after initial recovery raises concern for a postoperative intra-abdominal source. CT with intravenous contrast maps the source and the anatomy needed for a treatment plan. A focused port study and plain films examine narrower targets.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Targeted ultrasound of the abdominal port sites",
        "rationale": "A focused superficial study could assess a localized port-site collection. The represented fever and deep pelvic symptoms require examination of the intra-abdominal field."
      },
      {
        "label": "Contrast-enhanced abdominal and pelvic CT",
        "rationale": "The recovery-then-deterioration pattern raises a deep intra-abdominal source question. Intravenous contrast-enhanced CT maps collections and their relation to bowel for subsequent source-control planning."
      },
      {
        "label": "Upright and supine abdominal radiographs",
        "rationale": "Radiographs can depict a bowel-gas pattern but provide limited characterization of an intra-abdominal infectious source. The renewed fever and deep pain make source mapping consequential."
      }
    ]
  }
]
```

Reviewed full-case/current-node SHA-256: `67f15573ab110407412887f7440e343ff34bd0a7029a0a924bbcdd492a72571d`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### Proposed v2 after

Patient: Maya Collins; demographics {"ageYears":35,"sexLabel":"Female"}. Chief complaint: **Pain after appendectomy**.

{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.postoperative-source-control.v2",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pain after appendectomy",
    "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode."
  }
]
```

Current update: Review of the archived intravenous-contrast CT shows a 5.5-cm rim-enhancing pelvic collection containing gas, adjacent to the bladder and rectum. The interventional radiologist reviews the access-plane images: posterior to the collection are pelvic fat and overlying soft tissue; bowel and major vessels lie anterior or lateral to that plane. There is no diffuse intraperitoneal fluid. No enteric contrast was administered. Fever and focal pain persist during active intravenous antibiotic treatment. {patientName} remains alert with stable blood pressure and no diffuse rigidity.

Complete task: **Which treatment plan should be recommended now for {patientName}'s continuing postoperative illness?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Add image-guided pelvic catheter drainage (choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v2)

  Rationale: Persistent illness and an organized collection support evacuation. The radiologist-supplied geometry permits an image-guided approach while antibiotics continue. Clinical response and drainage findings must still be assessed; this is not proof that every leak has been excluded.

- Distractor ? Continue antibiotics with serial abdominal examination (choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2)

  Rationale: Stable circulation does not establish resolution of an organized source. Persistent fever and pain with the represented collection favor evacuation while the existing antibiotics continue.

- Distractor ? Add operative exploration with pelvic drainage (choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2)

  Rationale: Operation is appropriate for generalized contamination, uncontrolled leakage or anatomy that prevents effective less invasive control. The current observations demonstrate a localized target with assessed access anatomy and no generalized peritonitis. The IV-only study does not establish that a bowel leak is impossible.

Explanation: Persistent fever and pain with an organized localized collection support evacuation despite stable circulation. The assessed geometry and absence of generalized peritonitis favor image-guided drainage with continued antibiotics. The CT was acquired with intravenous contrast only: no claim of a negative enteric-contrast leak study is made. An uncontrolled bowel source or clinical deterioration would require renewed assessment and may require operation.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
    "task": "Which imaging action should the acute-care team recommend next for {patientName}'s renewed postoperative symptoms on this acquisition and transfer record?",
    "currentUpdate": "During this same episode, the hospital performed abdominal and pelvic CT. The transferred report says no collection is seen on the supplied images. Its image manifest lists a scout and precontrast axial images. The scanner log records both precontrast and intravenous-contrast acquisitions covering the abdomen and pelvis; the source archive contains the complete postcontrast dataset, available for current radiologist review. Symptoms and examination have not changed since that acquisition. Creatinine is within its reporting interval and no iodinated-contrast reaction occurred.",
    "exhibit": null,
    "explanation": "A reassuring interpretation applies to the supplied images, not to a different dataset still in the archive. Renewed fever and pain after recovery require source localization. The record establishes that complete current contrast CT images were acquired and remain available; review those images before repeating or replacing that acquisition. This conclusion depends on unchanged clinical status and adequate source images, not on the mere absence of exported files.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Repeat contrast-enhanced abdominal and pelvic CT",
        "rationale": "A repeat acquisition could be necessary for inadequate source images or a changed clinical state. Here the complete current contrast acquisition already exists and is available for review, while the reassuring report covers only the transferred subset."
      },
      {
        "label": "Review the archived contrast-enhanced abdominal and pelvic CT",
        "rationale": "The renewed illness still requires source localization, but the negative subset report cannot settle it. The acquisition log and actual archive establish that the needed current contrast images exist; reviewing them addresses the unresolved question without duplicating acquisition."
      },
      {
        "label": "Obtain contrast-enhanced abdominal and pelvic MRI",
        "rationale": "MRI is a real cross-sectional alternative, but the supplied record already contains the current contrast CT acquisition for the clinical question. Changing modalities does not first resolve the evidentiary error in accepting a subset report. No universal CT-versus-MRI ranking is claimed."
      }
    ]
  }
]
```

Current full-case/current-node SHA-256: `3d17a75a08300bbaa25a0620a07da0ce721ab19c21a01ce079907c6cb7309750`.

#### Concrete manual author gate

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Infer an ongoing organized source from persistence during active therapy, then interpret the collection location and interventional radiologist's observed access-plane relationships.",
  "apply": "Select image-guided evacuation with shared antibiotics for this localized accessible target, while preserving reassessment for an uncontrolled source rather than claiming that all bowel leakage was excluded.",
  "closestError": "Continue antibiotics because blood pressure is stable; the other close error is treating gas as sufficient proof that operation is required.",
  "decidingObservation": "Persistent fever and pain accompany a single organized collection whose reviewed posterior plane contains soft tissue and fat while bowel and major vessels lie elsewhere.",
  "consequence": "Delayed evacuation of an ongoing source, or unnecessary immediate operative exploration for a target amenable to an image-guided approach.",
  "deletionTest": "Removing persistent illness makes continued medical care more plausible. Removing the assessed geometry makes the percutaneous route underspecified. Generalized-peritonitis observations constrain operation. The constructed 5.5-cm measurement describes this collection and does not install a universal drainage cutoff.",
  "counterfactual": "Replace stable circulation and absence of diffuse rigidity with deterioration and generalized involuntary rigidity. Add operative exploration with pelvic drainage becomes the best offered plan for prompt control of generalized contamination.",
  "counterfactualChoiceId": "operative-exploration",
  "cueAttack": "The neutral treatment task no longer announces source control. Active antibiotics are shared background care, and every option specifies a treatment policy. The observer and anatomy are identified without calling a route safe or declaring the lesion drainable. Both procedural options carry the same existing placeholder timing profile.",
  "stageCategory": "Current treatment of continuing postoperative illness after anatomy and antibiotic response are observed; active antibiotics continue in every option.",
  "difficulty": "Predicted moderate to hard for PGY-2/3 from balancing persistent illness, stable circulation, postoperative gas and actual access anatomy. Difficulty comes from selecting a route, not from concealing safety information or inventing a leak-negative acquisition.",
  "oneBestAnswer": "The localized target, assessed anatomy and persistent illness support image-guided drainage under the recorded WSES and Global Alliance sources. An IV-only scan is not used as an enteric-contrast exclusion of leakage. Continued assessment is required and the key makes no size-only or all-leak-excluded claim.",
  "sequenceCheck": "The preceding revised node only establishes which acquired images need review. This update introduces collection anatomy and active-treatment response. Later recovery and antibiotic endpoint are absent from this explanation.",
  "repairRecord": "One response to the independent REVISE: removed the unsupported no-enteric-leak observation, specified IV-only acquisition, neutralized the task, replaced the declared catheter path with attributed anatomy, and retained the real antibiotics-versus-evacuation and image-guided-versus-operative comparisons.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2",
      "temptation": "Use stable physiology to justify waiting despite an ongoing organized source and persistent symptoms.",
      "rankingRationale": "Stable circulation does not establish resolution of an organized source. Persistent fever and pain with the represented collection favor evacuation while the existing antibiotics continue.",
      "counterfactual": "A small resolving collection with sustained clinical improvement and no appropriate drainage access could support continued medical management and observation.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.localized-abscess-drainage"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2",
      "temptation": "Treat gas in a postoperative collection as proof of generalized ongoing leakage requiring immediate operative exploration.",
      "rankingRationale": "Operation is appropriate for generalized contamination, uncontrolled leakage or anatomy that prevents effective less invasive control. The current observations demonstrate a localized target with assessed access anatomy and no generalized peritonitis. The IV-only study does not establish that a bowel leak is impossible.",
      "counterfactual": "Replace stable localized findings with diffuse involuntary rigidity and circulatory deterioration. Prompt operative source control becomes the best offered plan.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.localized-abscess-drainage",
        "claim.appendix-appendicitis.diffuse-leak-exploration",
        "claim.appendix-appendicitis.ct-series-scope"
      ]
    }
  ]
}
```

#### Atomic statements and timing/order proposals

Claims: `claim.appendix-appendicitis.localized-abscess-drainage`, `claim.appendix-appendicitis.diffuse-leak-exploration`, `claim.appendix-appendicitis.ct-series-scope`. Exact independent statements and full source records are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json).

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage",
          "claim.appendix-appendicitis.diffuse-leak-exploration",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      },
      {
        "fields": [
          "answerChoices[id=antibiotics].label",
          "answerChoices[id=antibiotics].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage"
        ]
      },
      {
        "fields": [
          "answerChoices[id=operative-exploration].label",
          "answerChoices[id=operative-exploration].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage",
          "claim.appendix-appendicitis.diffuse-leak-exploration",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      },
      {
        "fields": [
          "answerChoices[id=catheter-drainage].label",
          "answerChoices[id=catheter-drainage].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.localized-abscess-drainage",
          "claim.appendix-appendicitis.ct-series-scope"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The preceding revised node only establishes which acquired images need review. This update introduces collection anatomy and active-treatment response. Later recovery and antibiotic endpoint are absent from this explanation."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "nodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2",
          "choiceLabel": "Continue antibiotics with serial abdominal examination",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2",
          "choiceLabel": "Add operative exploration with pelvic drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v2",
          "choiceLabel": "Add image-guided pelvic catheter drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.clinical_procedure"
          }
        }
      ]
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "nodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v2",
        "choiceLabel": "Continue antibiotics with serial abdominal examination"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v2",
        "choiceLabel": "Add operative exploration with pelvic drainage"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v2",
        "choiceLabel": "Add image-guided pelvic catheter drainage"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

#### Response to every independent note

- clarityIssues[0]: 'No enteric contrast leak' is reported without saying that enteric contrast was administered or reached the relevant bowel. The earlier imaging task names intravenous contrast only. The reader cannot tell what this negative observation establishes.

  Disposition: addressed_in_v2_pending_independent_review. Specified IV-only acquisition and removed the no-enteric-contrast-leak claim. No absent extravasation is treated as proof of no bowel leak.

- cues[0]: Which source-control plan ? The task already announces the treatment objective that the resident should infer. 'Continue intravenous antibiotics with serial examination' is then a conspicuous nonprocedural outlier rather than a full competitor for a neutral next-treatment decision.

  Disposition: addressed_in_v2_pending_independent_review. The task asks for current treatment without naming source control. Antibiotics are shared background care. The interventional radiologist supplies observed plane anatomy rather than a predeclared safe catheter route.

- cues[1]: a posterior catheter path clear of bowel ? This prelabels the anatomic finding as a catheter route and overlaps with the keyed 'pelvic catheter drainage'. Access information is necessary; the concern is its preinterpretation and the lack of a remaining credible route tradeoff, not the presence of anatomy itself.

  Disposition: addressed_in_v2_pending_independent_review. The task asks for current treatment without naming source control. Antibiotics are shared background care. The interventional radiologist supplies observed plane anatomy rather than a predeclared safe catheter route.

- fairness[0]: The resident can make two useful inferences: the persistent illness and organized gas-containing collection require evacuation, and the localized accessible collection with stable physiology favors image-guided drainage over operative exploration. The clinical construct is worthwhile.

  Disposition: addressed_in_v2_pending_independent_review. Persistent illness and organized localization still support evacuation, then geometry and physiology support an image-guided route. An ongoing source is not exhaustively excluded by IV CT. Deterioration/generalized rigidity changes the best option to operation. Current findings remain self-contained and earlier review feedback supplies no route.

- fairness[1]: Image-guided drainage with ongoing antimicrobial care is a defensible best offered plan. No confident clinical inaccuracy in that choice identified offline.

  Disposition: addressed_in_v2_pending_independent_review. Persistent illness and organized localization still support evacuation, then geometry and physiology support an image-guided route. An ongoing source is not exhaustively excluded by IV CT. Deterioration/generalized rigidity changes the best option to operation. Current findings remain self-contained and earlier review feedback supplies no route.

- fairness[2]: Absence of demonstrated contrast extravasation is not equivalent to proof that no bowel leak exists. The explanation should preserve that limitation; the current localized findings can still favor drainage without claiming an exhaustive leak exclusion.

  Disposition: addressed_in_v2_pending_independent_review. Persistent illness and organized localization still support evacuation, then geometry and physiology support an image-guided route. An ongoing source is not exhaustively excluded by IV CT. Deterioration/generalized rigidity changes the best option to operation. Current findings remain self-contained and earlier review feedback supplies no route.

- fairness[3]: The update coherently follows postoperative imaging and is sufficiently detailed for standalone entry. Prior feedback does not disclose the drainage route.

  Disposition: addressed_in_v2_pending_independent_review. Persistent illness and organized localization still support evacuation, then geometry and physiology support an image-guided route. An ongoing source is not exhaustively excluded by IV CT. Deterioration/generalized rigidity changes the best option to operation. Current findings remain self-contained and earlier review feedback supplies no route.

- suggestions[0]: Ask for the next treatment plan without naming source control in the task.

  Disposition: addressed_in_v2_pending_independent_review. Neutral treatment plan, actual IV acquisition, attributed neutral anatomy and re-solved antibiotics/image-guided/operative competition. Both offered procedures retain the same existing placeholder timing profile.

- suggestions[1]: Specify the actual acquisition and relevant contrast opacification if using absence of extravasation as a discriminator, or use only the demonstrated findings without overstating leak exclusion.

  Disposition: addressed_in_v2_pending_independent_review. Neutral treatment plan, actual IV acquisition, attributed neutral anatomy and re-solved antibiotics/image-guided/operative competition. Both offered procedures retain the same existing placeholder timing profile.

- suggestions[2]: Keep necessary access anatomy in neutral observed terms, identify who assessed it, and preserve meaningful competition between treatment strategies. Do not remove safety information merely to make the item harder.

  Disposition: addressed_in_v2_pending_independent_review. Neutral treatment plan, actual IV acquisition, attributed neutral anatomy and re-solved antibiotics/image-guided/operative competition. Both offered procedures retain the same existing placeholder timing profile.

### Antibiotic endpoint despite residual mild leukocytosis ? revised

Reviewed: `question.topic.appendix-appendicitis.post-source-control-antibiotics.v1`; original concept `concept.appendix-appendicitis.recovered-after-source-control-antibiotics.v1`. Current: `question.topic.appendix-appendicitis.post-source-control-antibiotics.v2`; current concept `concept.appendix-appendicitis.recovered-after-source-control-antibiotics.v1`. Revision attempts: 1.

#### Exact reviewed before

Patient: Maya Collins; demographics {"ageYears":35,"sexLabel":"Female"}. Chief complaint: **Pain after appendectomy**.

{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.postoperative-source-control.v1",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pain after appendectomy",
    "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded."
  }
]
```

Current update: At later clinic review, catheter drainage has evacuated the collection, and the treating team has documented source control without ongoing bowel leakage. {patientName} has completed four days of an active antibiotic course after drainage. She is afebrile, eating, walking and free of abdominal pain. Her leukocyte count has fallen substantially and remains slightly above the laboratory reference interval. She is immunocompetent.

Complete task: **Which antibiotic plan should be recommended now for {patientName} after this completed course and source control?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? End antibiotic treatment after the completed course (choice.topic.appendix-appendicitis.post-source-control-antibiotics.stop-course.v1)

  Rationale: Adequate source control and complete clinical recovery support ending the completed short course. An isolated falling mildly elevated leukocyte count does not establish a need for extension.

- Distractor ? Continue treatment until the leukocyte count normalizes (choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v1)

  Rationale: Waiting for every inflammatory laboratory value to normalize can prolong therapy after adequate source control and clinical recovery. Fixed short-course evidence supports ending the completed course in this represented patient.

- Distractor ? Continue treatment pending repeat abdominal and pelvic CT (choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v1)

  Rationale: Clinical recovery after adequate drainage supports ending the completed course. New or persistent illness would establish a separate indication for CT assessment of residual infection while treatment is reassessed.

Explanation: The relevant endpoint combines adequate source control, a completed active short course and clinical recovery. The fixed-course evidence does not require normalization of every inflammatory value. A recurrence of illness would trigger reassessment of the source and treatment plan.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v1",
    "task": "Which investigation should the acute-care team obtain next for {patientName}'s renewed symptoms after appendectomy?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The return of fever and deep pelvic pain after initial recovery raises concern for a postoperative intra-abdominal source. CT with intravenous contrast maps the source and the anatomy needed for a treatment plan. A focused port study and plain films examine narrower targets.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Targeted ultrasound of the abdominal port sites",
        "rationale": "A focused superficial study could assess a localized port-site collection. The represented fever and deep pelvic symptoms require examination of the intra-abdominal field."
      },
      {
        "label": "Contrast-enhanced abdominal and pelvic CT",
        "rationale": "The recovery-then-deterioration pattern raises a deep intra-abdominal source question. Intravenous contrast-enhanced CT maps collections and their relation to bowel for subsequent source-control planning."
      },
      {
        "label": "Upright and supine abdominal radiographs",
        "rationale": "Radiographs can depict a bowel-gas pattern but provide limited characterization of an intra-abdominal infectious source. The renewed fever and deep pain make source mapping consequential."
      }
    ]
  },
  {
    "nodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v1",
    "task": "Which source-control plan should be recommended now for {patientName}'s postoperative pelvic collection?",
    "currentUpdate": "The receiving hospital's CT shows a 5.5-cm rim-enhancing pelvic collection containing gas. It abuts the bladder and rectum, with a posterior catheter path clear of bowel. No enteric contrast leak or diffuse intraperitoneal fluid is seen. Fever and focal pain persist after intravenous antibiotics. {patientName} remains alert with stable blood pressure and no diffuse rigidity.",
    "exhibit": null,
    "explanation": "The organized collection and persistent fever indicate a residual source needing control. Stable physiology, localization and a safe catheter route support image-guided drainage with antimicrobial therapy. Generalized contamination or an uncontrolled enteric leak would change the source-control operation.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Continue intravenous antibiotics with serial examination",
        "rationale": "Antibiotics can suffice for selected small or resolving collections. Persistent infection with this organized accessible collection supports evacuation as part of source control."
      },
      {
        "label": "Perform operative exploration with pelvic drainage",
        "rationale": "Exploration can control generalized contamination, an ongoing enteric leak or a collection inaccessible to percutaneous treatment. The supplied single localized collection has a safe catheter route and stable physiology."
      },
      {
        "label": "Perform image-guided pelvic catheter drainage",
        "rationale": "Persistent infection and an organized localized collection call for source control. The safe posterior route and absence of generalized peritonitis support image-guided catheter drainage with ongoing antimicrobial care."
      }
    ]
  }
]
```

Reviewed full-case/current-node SHA-256: `79cc8291ec52d8ab4f67a8a0d6b78dcc26979f182359de9215a9626a0789f971`. Full reviewed materialized case and question are stored at `independentReviewRound1.snapshot.cases` / `.questions`.

#### Proposed v2 after

Patient: Maya Collins; demographics {"ageYears":35,"sexLabel":"Female"}. Chief complaint: **Pain after appendectomy**.

{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode.

Finite profiles (the legacy field name does not imply clinical approval):

```json
[
  {
    "id": "profile.topic.appendix-appendicitis.postoperative-source-control.v2",
    "prototypeDemographics": {
      "ageYears": 35,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pain after appendectomy",
    "presentation": "{patientName}, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever and lower abdominal pain. Her abdomen is tender without diffuse rigidity and her circulation is stable. The acute-care team is reviewing records from the current episode."
  }
]
```

Current update: At later clinic review, catheter drainage has evacuated the collection, and the treating team has documented source control without ongoing bowel leakage. {patientName} has received four days of active antibiotics after drainage. She is afebrile, eating, walking and free of abdominal pain. Her leukocyte count has fallen substantially and remains slightly above the laboratory reference interval. She is immunocompetent.

Complete task: **Which antibiotic plan should be recommended now for {patientName} at this later review?**

**key shown first for review only.** Runtime answer shuffling: true.

- KEY ? Stop antibiotic treatment (choice.topic.appendix-appendicitis.post-source-control-antibiotics.stop-course.v2)

  Rationale: Adequate source control, four days of active therapy and clinical recovery support stopping treatment. An isolated falling mildly elevated leukocyte count does not establish a need for extension.

- Distractor ? Continue treatment until the leukocyte count normalizes (choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v2)

  Rationale: Waiting for every inflammatory laboratory value to normalize can prolong therapy after adequate source control and clinical recovery. Fixed short-course evidence supports ending the completed course in this represented patient.

- Distractor ? Continue treatment pending repeat abdominal and pelvic CT (choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v2)

  Rationale: Clinical recovery after adequate drainage supports ending the completed course. New or persistent illness would establish a separate indication for CT assessment of residual infection while treatment is reassessed.

Explanation: The relevant endpoint combines adequate source control, a completed active short course and clinical recovery. The fixed-course evidence does not require normalization of every inflammatory value. A recurrence of illness would trigger reassessment of the source and treatment plan.

Earlier visible tasks, updates, exhibits and all possible feedback:

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
    "task": "Which imaging action should the acute-care team recommend next for {patientName}'s renewed postoperative symptoms on this acquisition and transfer record?",
    "currentUpdate": "During this same episode, the hospital performed abdominal and pelvic CT. The transferred report says no collection is seen on the supplied images. Its image manifest lists a scout and precontrast axial images. The scanner log records both precontrast and intravenous-contrast acquisitions covering the abdomen and pelvis; the source archive contains the complete postcontrast dataset, available for current radiologist review. Symptoms and examination have not changed since that acquisition. Creatinine is within its reporting interval and no iodinated-contrast reaction occurred.",
    "exhibit": null,
    "explanation": "A reassuring interpretation applies to the supplied images, not to a different dataset still in the archive. Renewed fever and pain after recovery require source localization. The record establishes that complete current contrast CT images were acquired and remain available; review those images before repeating or replacing that acquisition. This conclusion depends on unchanged clinical status and adequate source images, not on the mere absence of exported files.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Repeat contrast-enhanced abdominal and pelvic CT",
        "rationale": "A repeat acquisition could be necessary for inadequate source images or a changed clinical state. Here the complete current contrast acquisition already exists and is available for review, while the reassuring report covers only the transferred subset."
      },
      {
        "label": "Review the archived contrast-enhanced abdominal and pelvic CT",
        "rationale": "The renewed illness still requires source localization, but the negative subset report cannot settle it. The acquisition log and actual archive establish that the needed current contrast images exist; reviewing them addresses the unresolved question without duplicating acquisition."
      },
      {
        "label": "Obtain contrast-enhanced abdominal and pelvic MRI",
        "rationale": "MRI is a real cross-sectional alternative, but the supplied record already contains the current contrast CT acquisition for the clinical question. Changing modalities does not first resolve the evidentiary error in accepting a subset report. No universal CT-versus-MRI ranking is claimed."
      }
    ]
  },
  {
    "nodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "task": "Which treatment plan should be recommended now for {patientName}'s continuing postoperative illness?",
    "currentUpdate": "Review of the archived intravenous-contrast CT shows a 5.5-cm rim-enhancing pelvic collection containing gas, adjacent to the bladder and rectum. The interventional radiologist reviews the access-plane images: posterior to the collection are pelvic fat and overlying soft tissue; bowel and major vessels lie anterior or lateral to that plane. There is no diffuse intraperitoneal fluid. No enteric contrast was administered. Fever and focal pain persist during active intravenous antibiotic treatment. {patientName} remains alert with stable blood pressure and no diffuse rigidity.",
    "exhibit": null,
    "explanation": "Persistent fever and pain with an organized localized collection support evacuation despite stable circulation. The assessed geometry and absence of generalized peritonitis favor image-guided drainage with continued antibiotics. The CT was acquired with intravenous contrast only: no claim of a negative enteric-contrast leak study is made. An uncontrolled bowel source or clinical deterioration would require renewed assessment and may require operation.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Continue antibiotics with serial abdominal examination",
        "rationale": "Stable circulation does not establish resolution of an organized source. Persistent fever and pain with the represented collection favor evacuation while the existing antibiotics continue."
      },
      {
        "label": "Add operative exploration with pelvic drainage",
        "rationale": "Operation is appropriate for generalized contamination, uncontrolled leakage or anatomy that prevents effective less invasive control. The current observations demonstrate a localized target with assessed access anatomy and no generalized peritonitis. The IV-only study does not establish that a bowel leak is impossible."
      },
      {
        "label": "Add image-guided pelvic catheter drainage",
        "rationale": "Persistent illness and an organized collection support evacuation. The radiologist-supplied geometry permits an image-guided approach while antibiotics continue. Clinical response and drainage findings must still be assessed; this is not proof that every leak has been excluded."
      }
    ]
  }
]
```

Current full-case/current-node SHA-256: `539e809e7f2e2df2f5ed40d06a6653f83489f6dccd7d58cbc4f23dec12b9d291`.

#### Concrete manual author gate

```json
{
  "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
  "reviewStatus": "needs_clinician_review",
  "aiAssistedDrafting": true,
  "lastClinicianReview": null,
  "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
  "reviewerRole": "author_self_check",
  "status": "author_checked_pending_independent_and_clinician_review",
  "pipelinePassed": false,
  "interpret": "Distinguish a falling mildly elevated leukocyte count from persistent infection by using the afebrile pain-free functional recovery after documented source control.",
  "apply": "Apply the supported short-course endpoint to the actual days received and recovery rather than declaring the course complete before asking the learner to decide.",
  "closestError": "Continue antibiotics until the leukocyte count enters the laboratory reference interval.",
  "decidingObservation": "Documented source control and four days of active therapy with afebrile, pain-free recovery despite a mildly abnormal falling leukocyte count.",
  "consequence": "Unnecessary antimicrobial exposure and investigation.",
  "deletionTest": "Deleting source-control adequacy or clinical recovery invalidates the stop recommendation. The mildly abnormal falling count creates the closest competing endpoint. Four days is the constructed completed course with direct support from Global Alliance statement 8, not a newly authored mandatory minimum.",
  "counterfactual": "Replace recovery with renewed deep pain and fever. Continuing active treatment while obtaining CT to assess a residual source becomes the best offered plan, with duration determined after reassessment.",
  "counterfactualChoiceId": "imaging-clearance",
  "cueAttack": "The presentation states only what was received and observed. The task does not call the course completed and the key is a plain stopping action. Laboratory normalization and repeat CT remain credible competing endpoints with rationale kept after the answer. The CT-containing choice retains exact test timing metadata.",
  "stageCategory": "Antibiotic management at later recovery review after documented source control and an observed active-treatment interval.",
  "difficulty": "Predicted moderate for PGY-2/3 from treating incomplete laboratory normalization as treatment failure despite source control and recovery.",
  "oneBestAnswer": "The represented completed-course scenario fits fixed short-course evidence. Minimum duration, resistant pathogens, immunosuppression and unresolved source-control scenarios require separate decisions.",
  "sequenceCheck": "The later update explicitly supersedes the original febrile state. Earlier revised drainage feedback gives neither a duration nor a stopping rule. Source control is documented here rather than assumed from a planned procedure.",
  "repairRecord": "One response to the independent REVISE: changed completed to received in the pre-answer update, removed the completion conclusion from the task and key, preserved all recovery and residual leukocytosis evidence, and rechecked Global Alliance 2024 statement 8 for the exact four-day scenario.",
  "distractorChecks": [
    {
      "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v2",
      "temptation": "Use a mildly abnormal leukocyte count as proof of ongoing infection despite recovery.",
      "rankingRationale": "Waiting for every inflammatory laboratory value to normalize can prolong therapy after adequate source control and clinical recovery. Fixed short-course evidence supports ending the completed course in this represented patient.",
      "counterfactual": "Renewed fever, pain or organ dysfunction would require a fresh source-control assessment and a supported active-treatment plan.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.completed-short-course"
      ]
    },
    {
      "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v2",
      "temptation": "Require another source-imaging assessment despite documented source control and clinical recovery.",
      "rankingRationale": "Clinical recovery after adequate drainage supports ending the completed course. New or persistent illness would establish a separate indication for CT assessment of residual infection while treatment is reassessed.",
      "counterfactual": "Recurrent deep pain and fever would support CT assessment for a residual or new source while therapy is reassessed.",
      "evidenceClaimIds": [
        "claim.appendix-appendicitis.completed-short-course",
        "claim.appendix-appendicitis.postoperative-ct"
      ]
    }
  ]
}
```

#### Atomic statements and timing/order proposals

Claims: `claim.appendix-appendicitis.completed-short-course`, `claim.appendix-appendicitis.postoperative-ct`. Exact independent statements and full source records are in [the source ledger](sources-question-topic-appendix-appendicitis-20261111.json).

```json
{
  "statementMappings": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "constructedObservations": {
      "fields": [
        "prototypeDemographics",
        "presentation",
        "currentUpdate",
        "exhibit"
      ],
      "basis": "Fictional finite patient observations, acquisition records and course. Measurements describe the case, with no claimed epidemiologic frequency or newly invented clinical cutoff. General relationships used to interpret them are mapped to the atomic claims below."
    },
    "clinicalAssertions": [
      {
        "fields": [
          "learningObjective",
          "stem",
          "explanation",
          "learningSummary"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.completed-short-course",
          "claim.appendix-appendicitis.postoperative-ct"
        ]
      },
      {
        "fields": [
          "answerChoices[id=wbc-normalization].label",
          "answerChoices[id=wbc-normalization].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.completed-short-course"
        ]
      },
      {
        "fields": [
          "answerChoices[id=stop-course].label",
          "answerChoices[id=stop-course].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.completed-short-course"
        ]
      },
      {
        "fields": [
          "answerChoices[id=imaging-clearance].label",
          "answerChoices[id=imaging-clearance].rationale"
        ],
        "evidenceClaimIds": [
          "claim.appendix-appendicitis.completed-short-course",
          "claim.appendix-appendicitis.postoperative-ct"
        ]
      }
    ],
    "reviewedCaseFields": [
      "chiefComplaint",
      "presentation",
      "approvedInstantiationProfiles[0].presentation"
    ],
    "sequenceScope": "The later update explicitly supersedes the original febrile state. Earlier revised drainage feedback gives neither a duration nor a stopping rule. Source control is documented here rather than assumed from a planned procedure."
  },
  "timingProposal": {
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "nodeId": "node.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v2",
          "choiceLabel": "Continue treatment until the leukocyte count normalizes",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.stop-course.v2",
          "choiceLabel": "Stop antibiotic treatment",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v2",
          "choiceLabel": "Continue treatment pending repeat abdominal and pelvic CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        }
      ]
    }
  },
  "orderProposal": {
    "contentVersion": "clinical.question-topic-appendix-appendicitis.2026-11-11.v2",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v2",
    "nodeId": "node.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "executionScope": "outside_hospital_plan_review",
    "serviceRequest": null,
    "resultGateAfter": null,
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v2",
        "choiceLabel": "Continue treatment until the leukocyte count normalizes"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.stop-course.v2",
        "choiceLabel": "Stop antibiotic treatment"
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v2",
        "choiceLabel": "Continue treatment pending repeat abdominal and pelvic CT"
      }
    ],
    "integrationDependency": "Manager must admit exact-label timing entries with accepted versions. Procedural estimates use existing placeholder profiles and do not create executable services."
  }
}
```

#### Response to every independent note

clarityIssues: no notes.

- cues[0]: after this completed course and source control ? The task calls the course completed before asking whether to continue it, and the key repeats 'after the completed course'. A nonmedical reader can match completion to ending treatment without weighing the leukocyte count or clinical recovery.

  Disposition: addressed_in_v2_pending_independent_review. Received four days replaces completed four days before the answer. The task omits completed course and the key is Stop antibiotic treatment. Completion wording appears only in post-answer reasoning.

- fairness[0]: Ending therapy is a defensible offered plan given documented source control, four days of active treatment and clinical recovery. The isolated improving mild leukocytosis creates a real competing reason someone might unnecessarily extend therapy.

  Disposition: addressed_in_v2_pending_independent_review. Kept documented source control, active four-day treatment, immunocompetence, full clinical recovery and mildly elevated falling leukocyte count. Rechecked the exact four-day scenario against Global Alliance 2024 statement 8. Later review supersedes the febrile presentation and earlier revised feedback contains no duration rule.

- fairness[1]: The clinical reasoning has two consequential components: assess whether the residual laboratory abnormality indicates ongoing illness in this recovered patient, then apply an appropriate antibiotic endpoint after source control. The current wording supplies a shortcut around those components.

  Disposition: addressed_in_v2_pending_independent_review. Kept documented source control, active four-day treatment, immunocompetence, full clinical recovery and mildly elevated falling leukocyte count. Rechecked the exact four-day scenario against Global Alliance 2024 statement 8. Later review supersedes the febrile presentation and earlier revised feedback contains no duration rule.

- fairness[2]: No confident clinical inaccuracy identified offline. This review does not newly verify the exact duration claim; its supporting evidence and exact-version clinical approval remain required.

  Disposition: addressed_in_v2_pending_independent_review. Kept documented source control, active four-day treatment, immunocompetence, full clinical recovery and mildly elevated falling leukocyte count. Rechecked the exact four-day scenario against Global Alliance 2024 statement 8. Later review supersedes the febrile presentation and earlier revised feedback contains no duration rule.

- fairness[3]: The later-review framing clearly supersedes the initial febrile presentation. The update is self-contained, and earlier drainage feedback does not disclose the antibiotic duration or stopping rule.

  Disposition: addressed_in_v2_pending_independent_review. Kept documented source control, active four-day treatment, immunocompetence, full clinical recovery and mildly elevated falling leukocyte count. Rechecked the exact four-day scenario against Global Alliance 2024 statement 8. Later review supersedes the febrile presentation and earlier revised feedback contains no duration rule.

- suggestions[0]: State neutrally that the patient has received four days of active antibiotics after drainage; do not call the course completed before the decision.

  Disposition: addressed_in_v2_pending_independent_review. Applied the exact requested wording repairs without adding unused clinical details. Re-solved recurrence to favor CT/reassessment while active treatment is reconsidered. All new clinical versions remain needs_clinician_review.

- suggestions[1]: Use 'Which antibiotic plan should be recommended now?' and a plain stopping option without repeating a completion conclusion.

  Disposition: addressed_in_v2_pending_independent_review. Applied the exact requested wording repairs without adding unused clinical details. Re-solved recurrence to favor CT/reassessment while active treatment is reconsidered. All new clinical versions remain needs_clinician_review.

- suggestions[2]: Preserve the recovery trajectory, source-control facts and residual leukocytosis; these are the useful competing evidence. Recheck the exact text for cue removal without expanding the vignette.

  Disposition: addressed_in_v2_pending_independent_review. Applied the exact requested wording repairs without adding unused clinical details. Re-solved recurrence to favor CT/reassessment while active treatment is reconsidered. All new clinical versions remain needs_clinician_review.

## Identity preservation and composition constraints

```json
[
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "originalConceptId": "concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1",
    "currentConceptId": "concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v2",
    "originalConceptId": "concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1",
    "currentConceptId": "concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v2",
    "originalConceptId": "concept.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
    "currentConceptId": "concept.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
    "originalConceptId": "concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1",
    "currentConceptId": "concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v2",
    "originalConceptId": "concept.appendix-appendicitis.incidental-lesion-intact-resection.v1",
    "currentConceptId": "concept.appendix-appendicitis.incidental-lesion-intact-resection.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.lamn-microscopic-margin.v1",
    "currentQuestionVariantId": null,
    "originalConceptId": "concept.appendix-appendicitis.lamn-microscopic-margin.v1",
    "currentConceptId": null,
    "decision": "unkeyed_hold",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v2",
    "originalConceptId": "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
    "currentConceptId": "concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
    "originalConceptId": "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
    "currentConceptId": "concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.net-receptor-staging.v1",
    "currentQuestionVariantId": null,
    "originalConceptId": "concept.appendix-appendicitis.net-indeterminate-metastases-staging.v1",
    "currentConceptId": null,
    "decision": "unkeyed_hold",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v2",
    "originalConceptId": "concept.appendix-appendicitis.large-net-regional-resection.v1",
    "currentConceptId": "concept.appendix-appendicitis.large-net-regional-resection.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.postoperative-infection-imaging.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.postoperative-infection-imaging.v2",
    "originalConceptId": "concept.appendix-appendicitis.postoperative-deep-infection-imaging.v1",
    "currentConceptId": "concept.appendix-appendicitis.postoperative-deep-infection-imaging.v2",
    "decision": "materially_changed_new_concept_version",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v2",
    "originalConceptId": "concept.appendix-appendicitis.localized-postoperative-abscess-drainage.v1",
    "currentConceptId": "concept.appendix-appendicitis.localized-postoperative-abscess-drainage.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  },
  {
    "reviewedQuestionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v1",
    "currentQuestionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v2",
    "originalConceptId": "concept.appendix-appendicitis.recovered-after-source-control-antibiotics.v1",
    "currentConceptId": "concept.appendix-appendicitis.recovered-after-source-control-antibiotics.v1",
    "decision": "preserve_same_concept",
    "fsrsHistoryTransferred": false
  }
]
```

All original reviewed definitions, materialized cases, questions and timing rows compare exactly with the captured snapshot. All old live/retained definitions and FSRS history remain in their original files. The revised first post-abscess node cannot replace the earlier context of the PASS second node under that PASS. The manager owns any new composition review. The persistent-pain first node and standalone goblet-cell case remain exact; current future-case changes do not grant new independent acceptance. Two current multi-part cases remain subject to every-concept unseen-or-due selection.

## Evidence, rights and source limitations

There are seven source records and twenty-nine atomic claims. The original twenty-five claim statements are preserved; four narrow additions cover full-specimen scope, site-specific positive tissue, MRI cyst morphology and acquired-versus-reviewed CT scope. Most tumor management decisions retain one directly verified ASCRS guideline. The new radiology review supports morphology only and is not independent confirmation of the NET surgical boundary. WSES/Global Alliance publications overlap in authors and evidence.

The publisher confirms Chenin et al. (2022), *Cystic liver lesions: a pictorial review*, CC BY 4.0. Attribution, DOI, license link and changed fictional application are recorded in the ledger. Only independently synthesized facts are used; no source text, tables, figures, algorithms or images are reproduced. The official older ACG route returned 402 and a separate PMC guideline route returned a browser-check page; neither supplied evidence. Restricted JAMA, IDSA and Sage Publishing routes remain excluded as previously recorded.

```json
{
  "checkedOn": "2026-11-11",
  "checks": [
    {
      "sourceId": "source.appendix-appendicitis.ascrs-2025",
      "scope": "Targeted specimen completeness, colonic evaluation, gross base extent, NET regional resection and site-specific surface disease. Recommendations 1-2, 4-5, 7, 11-16; no source expression stored."
    },
    {
      "sourceId": "source.appendix-appendicitis.chenin-2022-cysts",
      "scope": "Publisher full text and article-level CC BY 4.0 verified; narrow MRI cyst morphology facts only."
    },
    {
      "sourceId": "source.appendix-appendicitis.alliance-2024",
      "scope": "Contrast CT localization and statement 8 exact four-day endpoint rechecked."
    }
  ],
  "limitations": [
    "NET receptor imaging versus dedicated liver MRI is not a resolved next-study hierarchy.",
    "Observation versus local cecal re-excision for viable LAMN epithelium at a microscopic margin remains a clinician decision.",
    "No new verification of proprietary, paywalled or AI-restricted sources.",
    "Acquired-series retrieval is a logical application of explicit fictional records, not a new clinical trial or guideline ranking."
  ]
}
```

The module exports safe source-link metadata with `target="_blank"`, `rel="noopener noreferrer"` and `referrerPolicy="no-referrer"`. Every offered testing path, including archive diagnostic review and distractors, has an exact-label existing placeholder timing profile. No diagnostic wait duration is written into question prose. Proposed estimates do not execute gameplay services.

## Owner approvals needed

All eleven nonparked exact proposal versions still require Melissa Rowland's clinical approval. Eight new v2 questions additionally require new independent editorial review and manager acceptance. These specific unresolved comparisons remain:

- **owner.appendix-appendicitis.lamn-margin**: Observation after complete nonperforated LAMN resection versus Local cecal margin re-excision. ASCRS 2025 reviews limited data supporting observation for microscopic margin involvement. The case supplies whole-specimen noninfiltrative pathology, complete gross removal, an intact wall and no peritoneal or residual mass.

  Clinical decision: Should this exact viable-epithelium microscopic-margin comparison be scored with no further resection preferred over local cecal re-excision? Supply the reason the cuff is inferior, or keep the item unscored. Follow-up intensity is a separate decision.

- **owner.appendix-appendicitis.initial-abscess-choice**: Antibiotics with image-guided drainage versus Early laparoscopic appendectomy and drainage. Verified guidance supports selected use of both approaches and conditions recommendations on expertise, anatomy and inflammatory burden. A universal comparative key is withheld.

  Clinical decision: Which exact stable primary-abscess presentation should distinguish antibiotics with drainage from early laparoscopic appendectomy, given the competing conditional guidance?

- **owner.appendix-appendicitis.young-routine-interval**: Routine interval appendectomy versus Observation after successful nonoperative treatment. WSES 2020 and SAGES 2024 give different routine policies. The newer WSES full recommendation remains unverified under permitted access.

  Clinical decision: After permitted verification of updated guidance, which exact younger-adult post-abscess setting should favor routine interval surgery over observation?

- **owner.appendix-appendicitis.intermediate-net**: Completion right hemicolectomy versus Observation after appendectomy. ASCRS describes controversy in the 1-2-cm group and consideration of pathology, patient factors and multidisciplinary review.

  Clinical decision: Which exact 1-2-cm appendiceal NET pathology and patient context should favor completion right hemicolectomy over observation?

- **owner.appendix-appendicitis.net-next-investigation**: Dedicated contrast liver MRI versus 68Ga-DOTATATE PET/CT. ASCRS supports receptor imaging for a larger NET or indeterminate metastatic findings without uniquely ranking it as the next investigation against dedicated liver MRI. A pure tracer-selection question lacks the required second consequential inference and has no accepted basic purpose.

  Clinical decision: Which exact acquired-study limitation and staging goal, supported by permitted evidence, makes one next investigation uniquely preferable? Otherwise keep this slot unkeyed.

## Validation and handoff

The commands below run from `C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content`. Software checks validate authored structures, frozen versions and mappings; they do not approve clinical facts or declare the revisions PASS.

### review round 1 focused test

Command: `npm.cmd test -- --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts`. Exit code 0.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  27 passed (27)
   Start at  12:21:18
   Duration  400ms (transform 159ms, setup 0ms, import 264ms, tests 57ms, environment 0ms)

```

### review round 1 package typecheck initial

Command: `npm.cmd run typecheck`. Exit code 1.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-vascular-aorta-20261111.ts(483,1): error TS1005: ']' expected.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

Concurrent out-of-lane parser failure: vascular-aorta topic worker file. No repair made outside ownership.

### review round 1 package typecheck after concurrent parser repair

Command: `npm.cmd run typecheck`. Exit code 1.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-trauma-thoracic-20261111.ts(137,9): error TS2339: Property 'id' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(137,28): error TS2339: Property 'displayName' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(137,62): error TS2339: Property 'learningObjective' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(138,18): error TS2339: Property 'conceptType' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(138,56): error TS2339: Property 'earliestFacilityStage' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(174,18): error TS2339: Property 'counts' does not exist on type '{ schemaVersion: number; topicSlug: string; contentVersion: string; reviewStatus: string; aiAssistedDrafting: boolean; lastClinicianReview: null; assignment: { topicSlug: string; title: string; ... 16 more ...; release: { ...; }; }; ... 14 more ...; validation: never[]; }'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

The earlier vascular-aorta parser error is no longer present. This run reports six concurrent out-of-lane trauma-thoracic diagnostics at lines 137, 138 and 174; no topic-worker file outside appendix ownership was edited.

Both owned JSON files parse. All sixteen scoped input hashes remain unchanged. Exact reviewed full cases, questions, definitions and timing rows compare unchanged; all three PASS proposal objects remain exact. The local Markdown generator initially failed before writing because of backtick escaping; the corrected generator completed successfully.

### review round 1 final package typecheck during concurrent topic writes

Command: `npm.cmd run typecheck`. Exit code 1.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-trauma-thoracic-20261111.test.ts(32,36): error TS2339: Property 'inventoryRecordId' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(33,36): error TS2339: Property 'inventoryRecordId' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(35,39): error TS2339: Property 'verdict' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(36,39): error TS2339: Property 'verdict' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(38,76): error TS2339: Property 'inventoryRecordId' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(39,20): error TS2339: Property 'variantIds' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(40,20): error TS2339: Property 'sourceLocation' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(41,20): error TS2339: Property 'sourceLocation' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(42,20): error TS2339: Property 'beforeQuestionSha256s' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(43,20): error TS2339: Property 'reasons' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(44,20): error TS2339: Property 'contextAudit' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(47,30): error TS2339: Property 'replacementQuestionVariantIds' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(59,30): error TS2339: Property 'frozenPassApprovalReferences' does not exist on type '{ topicSlug: string; title: string; wave: number; taxonomy: { slug: string; title: string; priority: string; scopeIn: string; scopeOut: string; priorityReason: string; researchAgenda: string[]; counts: { ...; }; ... 4 more ...; wave: number; }; ... 14 more ...; release: { ...; }; }'.
src/question-topic-trauma-thoracic-20261111.test.ts(60,30): error TS2339: Property 'frozenPassApprovalReferences' does not exist on type '{ topicSlug: string; title: string; wave: number; taxonomy: { slug: string; title: string; priority: string; scopeIn: string; scopeOut: string; priorityReason: string; researchAgenda: string[]; counts: { ...; }; ... 4 more ...; wave: number; }; ... 14 more ...; release: { ...; }; }'.
src/question-topic-trauma-thoracic-20261111.test.ts(61,41): error TS2339: Property 'frozenPassApprovalReferences' does not exist on type '{ topicSlug: string; title: string; wave: number; taxonomy: { slug: string; title: string; priority: string; scopeIn: string; scopeOut: string; priorityReason: string; researchAgenda: string[]; counts: { ...; }; ... 4 more ...; wave: number; }; ... 14 more ...; release: { ...; }; }'.
src/question-topic-trauma-thoracic-20261111.test.ts(108,42): error TS2339: Property 'conceptMeaning' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(109,42): error TS2339: Property 'conceptMeaning' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(110,19): error TS2339: Property 'identityHistory' does not exist on type '{ schemaVersion: number; topicSlug: string; contentVersion: string; reviewStatus: string; aiAssistedDrafting: boolean; lastClinicianReview: null; assignment: { topicSlug: string; title: string; ... 16 more ...; release: { ...; }; }; ... 14 more ...; validation: never[]; }'.
src/question-topic-trauma-thoracic-20261111.test.ts(137,54): error TS2339: Property 'evidenceClaimId' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(139,18): error TS2339: Property 'questionVariantIds' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(144,59): error TS2339: Property 'questionVariantId' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(145,31): error TS2339: Property 'field' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(146,64): error TS2339: Property 'field' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(147,32): error TS2339: Property 'evidenceClaimIds' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(147,61): error TS2339: Property 'evidenceClaimIds' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(147,84): error TS7006: Parameter 'id' implicitly has an 'any' type.
src/question-topic-trauma-thoracic-20261111.test.ts(181,47): error TS2339: Property 'serviceRequest' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(181,76): error TS2339: Property 'execution' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(196,19): error TS2339: Property 'unkeyedDraftSlots' does not exist on type '{ schemaVersion: number; topicSlug: string; contentVersion: string; reviewStatus: string; aiAssistedDrafting: boolean; lastClinicianReview: null; assignment: { topicSlug: string; title: string; ... 16 more ...; release: { ...; }; }; ... 14 more ...; validation: never[]; }'.
src/question-topic-trauma-thoracic-20261111.test.ts(198,19): error TS2339: Property 'key' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(198,48): error TS2339: Property 'questionVariantId' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(199,45): error TS2339: Property 'evidenceClaimId' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(200,79): error TS2339: Property 'evidenceClaimId' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.test.ts(224,19): error TS2339: Property 'runtimePins' does not exist on type '{ schemaVersion: number; topicSlug: string; contentVersion: string; reviewStatus: string; aiAssistedDrafting: boolean; lastClinicianReview: null; assignment: { topicSlug: string; title: string; ... 16 more ...; release: { ...; }; }; ... 14 more ...; validation: never[]; }'.
src/question-topic-trauma-thoracic-20261111.test.ts(225,58): error TS2339: Property 'runtimePins' does not exist on type '{ schemaVersion: number; topicSlug: string; contentVersion: string; reviewStatus: string; aiAssistedDrafting: boolean; lastClinicianReview: null; assignment: { topicSlug: string; title: string; ... 16 more ...; release: { ...; }; }; ... 14 more ...; validation: never[]; }'.
src/question-topic-trauma-thoracic-20261111.test.ts(225,75): error TS7006: Parameter 'pin' implicitly has an 'any' type.
src/question-topic-trauma-thoracic-20261111.ts(137,9): error TS2339: Property 'id' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(137,28): error TS2339: Property 'displayName' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(137,62): error TS2339: Property 'learningObjective' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(138,18): error TS2339: Property 'conceptType' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(138,56): error TS2339: Property 'earliestFacilityStage' does not exist on type 'never'.
src/question-topic-trauma-thoracic-20261111.ts(174,18): error TS2339: Property 'counts' does not exist on type '{ schemaVersion: number; topicSlug: string; contentVersion: string; reviewStatus: string; aiAssistedDrafting: boolean; lastClinicianReview: null; assignment: { topicSlug: string; title: string; ... 16 more ...; release: { ...; }; }; ... 14 more ...; validation: never[]; }'.
npm error Lifecycle script `typecheck` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c tsc --noEmit -p tsconfig.json
```

Final run reports 42 diagnostics, all in concurrent question-topic-trauma-thoracic-20261111.ts and its test file. The test file advanced during this worker's packet work. No appendix diagnostics are reported and no out-of-lane file was edited.

Final close checks: both owned JSON files parse; all three complete PASS contexts and proposal objects remain exact; no drift in sixteen scoped inputs; only the five owned files were written.

<!-- APPENDIX-REVIEW-FINAL-VALIDATION -->

Current next action: Manager reviews the eight v2 items and new compositions, obtains Melissa's exact clinical decisions, and reruns the package typecheck after the concurrent trauma-thoracic worker repairs its own errors. No further authoring or shared-file integration is authorized in this bounded handoff.

Topic appendix-appendicitis. Files changed: the five owned topic files named in the dispatch. Original inventory: 16 exact variants, 16 visible contexts and 42 finite profiles; historical verdicts 0 kept, 1 rewritten, 15 retirement/replacement proposals. Current review: 13 reviewed, 3 pass-preserved, 8 revised, 2 parked; no new gap questions this round. Seven same-meaning concepts reused and one new concept version. Three original unkeyed holds plus two newly parked planning slots remain. Packet paths: this Markdown, `question-topic-appendix-appendicitis-20261111.json` and `sources-question-topic-appendix-appendicitis-20261111.json`. Manager owns composition/acceptance and Melissa owns the listed clinical decisions. Local draft only; no shipping or backup action occurred.

## Final bounded handoff

```text
Topic appendix-appendicitis
Files changed
  packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.ts
  packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.test.ts
  docs/research/question-topic-appendix-appendicitis-20261111.json
  docs/research/question-topic-appendix-appendicitis-20261111.md
  docs/research/sources-question-topic-appendix-appendicitis-20261111.json
Inventory 16 exact original variants / 16 visible contexts / 42 profiles; no scoped drift
Counts audited 16, kept 0, rewritten 1, retired-and-replaced proposed 15; original new-gap variants 12
Review counts 13 reviewed, 3 pass-preserved, 8 revised, 2 parked; new gap questions this round 0
Count basis Historical audit and current review are separate; 7 same-meaning revisions, 1 new concept version
Held/unkeyed
  hold.appendix-appendicitis.initial-abscess-choice
  hold.appendix-appendicitis.young-routine-interval
  hold.appendix-appendicitis.intermediate-net
  hold.appendix-appendicitis.review1-lamn-microscopic-margin
  hold.appendix-appendicitis.review1-net-next-investigation
Research 18 ranked groups; 7 sources / 29 claims; single-guideline tumor-management limitations retained
Packet docs/research/question-topic-appendix-appendicitis-20261111.md; docs/research/question-topic-appendix-appendicitis-20261111.json; docs/research/sources-question-topic-appendix-appendicitis-20261111.json
Identity preservation All three full PASS contexts and original variants/timings retained; no FSRS transfer
Owner approvals needed Melissa: LAMN observation versus cuff; NET next-study purpose/ranking; three carried policy holds; all current exact clinical versions
Integration Post-abscess PASS context-only; v2 first node forked; new persistent-pain composition requires review; two current paired cases remain selection-constrained
Validation Focused command exit 0, 27 passed / 0 failed; final package typecheck exit 1 on 42 concurrent trauma-thoracic module/test diagnostics; exact output above; both JSON parses pass
Open work Manager reviews the eight v2 items and new compositions, obtains Melissa's exact clinical decisions, and reruns the package typecheck after the concurrent trauma-thoracic worker repairs its own errors. No further authoring or shared-file integration is authorized in this bounded handoff.
```

<!-- APPENDIX-REVIEW-ROUND-1-END -->

## Historical wave 1 packet

The remainder records the original pre-review research, full audit, proposals and validation. Original thirteen-node supply numbers are historical. Current scored supply, dispositions and validation are above.

### Scope, progress and next action

- Read assignment, complete v15 standard, root instructions and scoped current tree.
- Audited all sixteen exact variants, sixteen visible case/node contexts, forty-two finite profiles and canonical fields.
- Ranked eighteen concept groups and mapped coverage and gaps.
- Drafted thirteen nodes across seven cases with twenty-five atomic claims, six evidence/cross-check sources and concrete manual author gates.
- Focused file passes all 25 tests and the clinical-content package typecheck exits 0 after final source edits.

Manager reviews the scoped diff and packet, commissions independent review, resolves clinical holds with Melissa, then decides exact admission and retirement. This authoring sidecar is locally complete.

All proposed questions, concepts, claims, explanations, presentations and finite profiles remain `needs_clinician_review`. Melissa Rowland is the named clinical sign-off. Author self-checks have a separate role from independent review and clinical approval.

Counts audited 16, kept 0, rewritten 1, retired-and-replaced proposed 15, new 12. The sidecar contains 13 nodes across seven cases, including five multi-part cases.

Unique exact variants and matching case/node/variant rows. One retained B2B14 draft is rewritten into a changed construct. Twelve new gap variants yield thirteen proposed nodes. Fifteen retirement-and-replacement decisions are proposals. The original eight live nodes remain in their current files. New concepts and preserved histories are counted separately.

### Ranked testable concepts and gap matrix

| Rank | Decision and relevance | Existing exact coverage | Proposed coverage or gap | Atomic claims |
|---|---|---|---|---|
| 1 | Persistent pain after imaging. Choose further evaluation when adequate negative imaging and the serial examination diverge. Common diagnostic escalation decision. Current modality-only supply is repetitive. | question.appendicitis.stable-adult-ct.v2, question.appendicitis.stable-adult-ct.v4, question.appendicitis.stable-adult-ct.v3, question.appendicitis.stable-adult-ct.v1, question.appendicitis.stable-adult-ct.v4.r1, question.appendicitis.stable-adult-ct.v4.r2 | question.topic.appendix-appendicitis.persistent-pain-exploration.v1 | claim.appendix-appendicitis.persistent-pain-negative-imaging, claim.appendix-appendicitis.ct-after-nondiagnostic-us |
| 2 | Operative versus antibiotics-first selection. Interpret disease extent, appendicolith, priorities and response before ranking contemporaneous treatment paths. Core treatment decision. Six assigned versions repeat one modifier. A difficult fair comparison still needs a concrete clinician-supported tradeoff. | question.appendicitis.appendicolith-operative-pathway.v2, question.appendicitis.appendicolith-operative-pathway.v1, question.appendicitis.appendicolith-operative-pathway.v3, question.appendicitis.appendicolith-operative-pathway.v4, question.n3.appendicitis-response-versus-structural-risk.v1, question.n3.appendicitis-response-versus-structural-risk.v2 | redundant_existing_coverage_and_future_repair_gap | claim.appendix-appendicitis.appendicolith-nom-risk |
| 3 | Initial abscess or phlegmon treatment. Compare initial antibiotics with drainage against early laparoscopy under the actual anatomy and expertise. High practical importance. Competing supported approaches need a fully specified patient and clinical resolution. | Uncovered | held_or_remaining_gap | claim.appendix-appendicitis.initial-abscess-selection |
| 4 | Post-abscess neoplasm workup and tissue. Separate infection recovery from a persistent lesion, then choose investigation and justified resection. High-value follow-up gap with two distinct sequential decisions. | Uncovered | question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1, question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 | claim.appendix-appendicitis.post-abscess-neoplasm, claim.appendix-appendicitis.colonoscopy-neoplasm, claim.appendix-appendicitis.interval-tissue-evaluation |
| 5 | Postoperative infection localization. Interpret recovery followed by deterioration and choose the correct anatomic imaging target. Common postoperative decision that changes source-control planning. | Uncovered | question.topic.appendix-appendicitis.postoperative-infection-imaging.v1 | claim.appendix-appendicitis.postoperative-ct |
| 6 | Postoperative source-control route. Integrate response, collection anatomy, catheter path and peritonitis before choosing drainage or exploration. Consequential management gap with real procedural competitors. | Uncovered | question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1 | claim.appendix-appendicitis.localized-abscess-drainage, claim.appendix-appendicitis.diffuse-leak-exploration |
| 7 | Antibiotic endpoint after source control. Distinguish isolated laboratory lag from persistent infection after a completed active course. Practical stewardship and failure-recognition decision. The question supplies a completed course. | Uncovered | question.topic.appendix-appendicitis.post-source-control-antibiotics.v1 | claim.appendix-appendicitis.completed-short-course |
| 8 | Intact resection of an appendiceal lesion. Use base anatomy and represented disease extent to select initial surgery while preserving the specimen. Relevant operative anatomy and tumor-spillage boundary. | Uncovered | question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1 | claim.appendix-appendicitis.intact-abnormal-appendix |
| 9 | LAMN microscopic margin and residual disease. Interpret microscopic involvement within the full pathology and operative-clearance record. A difficult practical exception that can prevent unnecessary bowel surgery. Evidence is limited. | Uncovered | question.topic.appendix-appendicitis.lamn-microscopic-margin.v1 | claim.appendix-appendicitis.lamn-margin, claim.appendix-appendicitis.lamn-versus-invasive |
| 10 | Invasive appendiceal adenocarcinoma. Integrate invasive pathology, local clearance and completed staging to choose regional surgery. Surgical-oncology consequence of unexpected appendectomy pathology. | Uncovered | question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v1 | claim.appendix-appendicitis.lamn-versus-invasive, claim.appendix-appendicitis.adenocarcinoma-colectomy, claim.appendix-appendicitis.lamn-complete-resection |
| 11 | Goblet cell adenocarcinoma. Reconcile historical carcinoid terminology with expert epithelial classification before selecting surgery. Consequential identity-to-treatment distinction obscured by tumor size or one stain. | Uncovered | question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1 | claim.appendix-appendicitis.goblet-cell-identity, claim.appendix-appendicitis.adenocarcinoma-colectomy, claim.appendix-appendicitis.small-favorable-net-resection |
| 12 | Appendiceal NET staging. Interpret differentiation and unresolved liver findings before choosing functional staging. Staging determines the subsequent treatment field. The comparison includes current and older receptor imaging. | Uncovered | question.topic.appendix-appendicitis.net-receptor-staging.v1 | claim.appendix-appendicitis.net-functional-staging |
| 13 | Appendiceal NET regional resection. Distinguish local clearance from regional treatment after completed staging. Pathology-driven operative extent. The 1-2-cm boundary is separately held. | Uncovered | question.topic.appendix-appendicitis.net-regional-resection.v1 | claim.appendix-appendicitis.net-resection, claim.appendix-appendicitis.small-favorable-net-resection |
| 14 | Mucinous peritoneal disease. Use implant cellularity, tumor biology and distribution to select a treatment service. A different treatment field from local appendectomy or regional colectomy. | Uncovered | question.topic.appendix-appendicitis.peritoneal-mucin-referral.v1 | claim.appendix-appendicitis.peritoneal-mucin-treatment |
| 15 | Routine interval surgery in younger adults. Decide whether an asymptomatic younger adult after successful nonoperative care needs routine interval surgery. Important source disagreement, withheld pending current-guidance verification and Melissa's decision. | Uncovered | held_or_remaining_gap | claim.appendix-appendicitis.young-interval-disagreement |
| 16 | Intermediate-size appendiceal NET. Assess pathology and patient factors before choosing further surgery for a 1-2-cm tumor. Potentially testable but controversial. A mandatory single-feature colectomy rule is withheld. | Uncovered | held_or_remaining_gap | claim.appendix-appendicitis.intermediate-net-boundary |
| 17 | Antibiotics after uncomplicated appendectomy. Interpret operative disease classification before deciding whether postoperative therapeutic antibiotics are indicated. Common remaining gap. A consequential classification or response competitor is needed for the harder author gate. | Uncovered | held_or_remaining_gap | claim.appendix-appendicitis.uncomplicated-postoperative-antibiotics |
| 18 | Appendicitis imaging during pregnancy. Choose a population-appropriate imaging sequence while preserving urgent clinical findings. Appendix-owned diagnostic scope with a gynecology boundary. Further current verification and a harder comparison are needed. | Uncovered | held_or_remaining_gap | claim.appendix-appendicitis.pregnancy-imaging-sequence |

#### 1. Persistent pain after imaging

- Choose further evaluation when adequate negative imaging and the serial examination diverge.
- Raw evidence New involuntary guarding and increasingly focal tenderness during observation.
- Closest error Continue observation because the appendix was described as normal on CT.
- Consequence An evolving operative abdominal process remains untreated.
- Existing concepts concept.appendicitis.stable-adult-ct, concept.appendicitis.ct-request-with-urinary-mimic.v1
- Assigned records inventory.aec842138ef4f218, inventory.7db83c6db2bc35c3, inventory.77b6a7027acff8ce, inventory.fde00f3201bc47d2, inventory.159fb8efb704d450, inventory.039efde9d6406671
- Evidence claim.appendix-appendicitis.persistent-pain-negative-imaging, claim.appendix-appendicitis.ct-after-nondiagnostic-us
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 2. Operative versus antibiotics-first selection

- Interpret disease extent, appendicolith, priorities and response before ranking contemporaneous treatment paths.
- Raw evidence Imaging-confirmed disease extent and appendicolith, observed symptom response, operative fitness, follow-up access and explicitly stated patient priorities.
- Closest error Convert the appendicolith risk modifier into an absolute antibiotics prohibition, or rank two preference-sensitive strategies without a patient-specific discriminator.
- Consequence Counseling can misrepresent nonoperative risk or produce an unsupported treatment ranking.
- Existing concepts concept.appendicitis.appendicolith-operative-pathway, concept.n3.appendicitis-response-versus-structural-risk
- Assigned records inventory.14164bfd62e37818, inventory.00050117719fe89e, inventory.46eca681a5657da1, inventory.c98fa6b2a1093e17, inventory.77a3e7166020ce63, inventory.01cebe62173eb37c
- Evidence claim.appendix-appendicitis.appendicolith-nom-risk
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 3. Initial abscess or phlegmon treatment

- Compare initial antibiotics with drainage against early laparoscopy under the actual anatomy and expertise.
- Raw evidence A discrete collection or phlegmon, cecal and adjacent bowel inflammation, actual hemodynamics, response to antibiotics, catheter access anatomy and the operating team's expertise.
- Closest error Apply a universal surgery-first or antibiotics-first rule despite the represented anatomic and expertise constraints.
- Consequence The plan can cause avoidable extended bowel resection or leave infection inadequately controlled.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.initial-abscess-selection
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 4. Post-abscess neoplasm workup and tissue

- Separate infection recovery from a persistent lesion, then choose investigation and justified resection.
- Raw evidence Persistent appendiceal-cecal nodularity of uncertain origin after abscess resolution in a 62-year-old who has never had colonoscopy.
- Closest error Biopsy the apparent appendiceal target while bypassing colonic evaluation.
- Consequence A synchronous colonic lesion can be missed while an incomplete operative field is planned.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.post-abscess-neoplasm, claim.appendix-appendicitis.colonoscopy-neoplasm, claim.appendix-appendicitis.interval-tissue-evaluation
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 5. Postoperative infection localization

- Interpret recovery followed by deterioration and choose the correct anatomic imaging target.
- Raw evidence New fever and deep pelvic pain after eating had resumed.
- Closest error Request abdominal radiographs for distension and assume the rest of the postoperative course is expected ileus.
- Consequence A deep collection or ongoing source remains uncharacterized and source control is delayed.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.postoperative-ct
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 6. Postoperative source-control route

- Integrate response, collection anatomy, catheter path and peritonitis before choosing drainage or exploration.
- Raw evidence Persistent infection, a single organized collection with a bowel-free catheter route and no represented ongoing leak or generalized peritonitis.
- Closest error Continue antibiotics because the patient is stable, or operate because postoperative gas is interpreted as proof of uncontrolled bowel leakage.
- Consequence Delayed source control or an unnecessarily invasive operation.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.localized-abscess-drainage, claim.appendix-appendicitis.diffuse-leak-exploration
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 7. Antibiotic endpoint after source control

- Distinguish isolated laboratory lag from persistent infection after a completed active course.
- Raw evidence Adequate source control, completed active treatment and afebrile pain-free functional recovery.
- Closest error Continue antibiotics until the leukocyte count enters the laboratory reference interval.
- Consequence Unnecessary antimicrobial exposure and investigation.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.completed-short-course
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 8. Intact resection of an appendiceal lesion

- Use base anatomy and represented disease extent to select initial surgery while preserving the specimen.
- Raw evidence A normal-appearing base segment and separability from the cecum, with intact wall and no peritoneal disease.
- Closest error Remove a cecal cuff simply because the appendix is dilated.
- Consequence Unnecessary bowel resection or rupture with loss of the localized operative state.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.intact-abnormal-appendix
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 9. LAMN microscopic margin and residual disease

- Interpret microscopic involvement within the full pathology and operative-clearance record.
- Raw evidence Microscopic low-grade epithelium at the margin within a macroscopically complete, nonperforated LAMN resection.
- Closest error Schedule cecal re-excision for every positive microscopic appendectomy margin.
- Consequence An additional bowel operation can be performed without a supported residual-disease indication.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.lamn-margin, claim.appendix-appendicitis.lamn-versus-invasive
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 10. Invasive appendiceal adenocarcinoma

- Integrate invasive pathology, local clearance and completed staging to choose regional surgery.
- Raw evidence Permanent whole-specimen invasive glands into mesoappendiceal fat, paired with absence of disseminated disease on completed staging.
- Closest error Treat the margin-negative appendectomy as complete oncologic surgery.
- Consequence Regional nodal disease remains unstaged and the recommended oncologic field remains unresected.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.lamn-versus-invasive, claim.appendix-appendicitis.adenocarcinoma-colectomy, claim.appendix-appendicitis.lamn-complete-resection
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 11. Goblet cell adenocarcinoma

- Reconcile historical carcinoid terminology with expert epithelial classification before selecting surgery.
- Raw evidence Complete permanent sampling shows infiltrative mucin-filled goblet-cell clusters, with focal synaptophysin expression.
- Closest error Apply small-NET surgical rules because the original report used carcinoid.
- Consequence A clinically distinct invasive epithelial cancer receives an inadequate regional surgical plan.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.goblet-cell-identity, claim.appendix-appendicitis.adenocarcinoma-colectomy, claim.appendix-appendicitis.small-favorable-net-resection
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 12. Appendiceal NET staging

- Interpret differentiation and unresolved liver findings before choosing functional staging.
- Raw evidence Grade-1 well-differentiated NET with possible liver involvement unresolved by the acquired CT phases.
- Closest error Choose FDG PET/CT because the patient has cancer, or choose older receptor scintigraphy without comparing its current role.
- Consequence The residual metastatic question can be staged with a less appropriate functional technique before further surgery.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.net-functional-staging
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 13. Appendiceal NET regional resection

- Distinguish local clearance from regional treatment after completed staging.
- Raw evidence A confirmed 2.6-cm NET with no distant disease in a fit patient.
- Closest error End surgery because the base margin is clear and the mesoappendix was included.
- Consequence The regional nodal basin receives neither the recommended resection nor its staging assessment.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.net-resection, claim.appendix-appendicitis.small-favorable-net-resection
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 14. Mucinous peritoneal disease

- Use implant cellularity, tumor biology and distribution to select a treatment service.
- Raw evidence Low-grade epithelium in a peritoneal implant together with disease spanning the pelvis and upper abdomen.
- Closest error Recommend a standard completion right colectomy for every appendiceal neoplasm.
- Consequence A regional operation can leave the consequential peritoneal disease unaddressed.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.peritoneal-mucin-treatment
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 15. Routine interval surgery in younger adults

- Decide whether an asymptomatic younger adult after successful nonoperative care needs routine interval surgery.
- Raw evidence Successful prior abscess treatment, present absence of symptoms, interval imaging, age and the exact current guideline population and recommendation.
- Closest error Present one society's routine policy as a settled universal rule for every asymptomatic younger adult.
- Consequence A disputed operation or surveillance policy can be taught as a mandatory pathway.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.young-interval-disagreement
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 16. Intermediate-size appendiceal NET

- Assess pathology and patient factors before choosing further surgery for a 1-2-cm tumor.
- Raw evidence Permanent tumor size within 1-2 cm, grade, location, margin, mesoappendiceal and lymphovascular findings, comorbidity and patient priorities.
- Closest error Turn one intermediate-size adverse histologic feature into an automatic right-colectomy rule.
- Consequence A patient can receive an unsupported larger resection or inadequate individualized risk assessment.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.intermediate-net-boundary
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 17. Antibiotics after uncomplicated appendectomy

- Interpret operative disease classification before deciding whether postoperative therapeutic antibiotics are indicated.
- Raw evidence Operative wall integrity, any actual perforation, abscess or purulent contamination, source-control completeness and the postoperative clinical trajectory.
- Closest error Use a pathology label or isolated inflammatory laboratory result as a substitute for operative disease classification and response.
- Consequence Antibiotic indication can be mismatched to the actual source-control and disease state.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.uncomplicated-postoperative-antibiotics
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

#### 18. Appendicitis imaging during pregnancy

- Choose a population-appropriate imaging sequence while preserving urgent clinical findings.
- Raw evidence Confirmed pregnancy, actual ultrasound visualization and sampled region, continuing focal findings, physiology and the available population-appropriate imaging route.
- Closest error Treat a nonvisualized appendix as a completed negative study or delay further assessment despite continued concern.
- Consequence The patient's appendicitis evaluation can be delayed or based on an unsupported acquisition interpretation.
- Existing concepts Empty
- Assigned records Empty
- Evidence claim.appendix-appendicitis.pregnancy-imaging-sequence
- Qualitative editorial estimate of general-surgery resident testing relevance. No exam-frequency or blueprint-weight assertion.

Operative base anatomy and tissue provenance are included in the drafted decisions. Further embryologic variation, vascular anatomy and closure-technique questions remain research candidates. Their exact facts and consequential competing actions require targeted verification before authoring.

### Complete exact-version audit

| Record and exact variant | Concept and case/node | Before hash and location | Verdict | Reasons and replacement |
|---|---|---|---|---|
| inventory.aec842138ef4f218<br>question.appendicitis.stable-adult-ct.v2 | concept.appendicitis.stable-adult-ct<br>case.gs028c.appendicitis.a-atypical-older-adult<br>node.gs028c.appendicitis.a-atypical-older-adult.1 | 4ff0e22bc535e7865e16506a8aacafee4921d6beda3abc2facb8837ba4120420<br>packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts<br>ALL_FAMILIES | **Retire-and-replace** | CT selection repeats with an older age and bowel-gas limitation. Unavailable MRI eliminates the comprehensive competitor, and plain films add little resident discrimination. Four profiles preserve the same shortcut.<br>Proposed replacement question.topic.appendix-appendicitis.persistent-pain-exploration.v1 |
| inventory.7db83c6db2bc35c3<br>question.appendicitis.stable-adult-ct.v4 | concept.appendicitis.stable-adult-ct<br>case.gs028c.appendicitis.a-competing-diagnoses<br>node.gs028c.appendicitis.a-competing-diagnoses.1 | 4cc7741a472b7d5fe41f3fbf47dde2b57488cc2df8ffd9402376c6990b27b2e8<br>packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts<br>ALL_FAMILIES | **Retire-and-replace** | The presentation supplies the differential and inconclusive-ultrasound interpretation, then removes MRI. The task repeats appendicitis and competing acute diagnoses. This is another availability-based CT match, with no accepted basic-role reference.<br>Proposed replacement question.topic.appendix-appendicitis.persistent-pain-exploration.v1 |
| inventory.77b6a7027acff8ce<br>question.appendicitis.stable-adult-ct.v3 | concept.appendicitis.stable-adult-ct<br>case.gs028c.appendicitis.a-equivocal-exam<br>node.gs028c.appendicitis.a-equivocal-exam.1 | 15c9d2ee32ee3b1bd7c3432ba4e725d13097dfdcab02c789e9862b4a1db17970<br>packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts<br>ALL_FAMILIES | **Retire-and-replace** | Migration, a supplied concerning examination, nondiagnostic ultrasound and unavailable MRI preselect CT. Repeat ultrasound and plain films provide weak competition. Stable physiology supplies necessary context but does not earn a separate consequential inference.<br>Proposed replacement question.topic.appendix-appendicitis.persistent-pain-exploration.v1 |
| inventory.fde00f3201bc47d2<br>question.appendicitis.stable-adult-ct.v1 | concept.appendicitis.stable-adult-ct<br>case.gs028c.appendicitis.a-nondiagnostic-ultrasound<br>node.gs028c.appendicitis.a-nondiagnostic-ultrasound.1 | 4f4208c8b1e4fa4fcffa300d4dc5d0960b96cb80c6935d4a132ae327ba659ce2<br>packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts<br>ALL_FAMILIES | **Retire-and-replace** | MRI unavailability directly ranks the options, while the same prior ultrasound is offered again without an adequacy or acquisition change. Four profiles repeat the pattern. Preserve the important imaging concept and propose replacing this low-discrimination supply slot.<br>Proposed replacement question.topic.appendix-appendicitis.persistent-pain-exploration.v1 |
| inventory.14164bfd62e37818<br>question.appendicitis.appendicolith-operative-pathway.v2 | concept.appendicitis.appendicolith-operative-pathway<br>case.gs028c.appendicitis.b-asks-for-antibiotics<br>node.gs028c.appendicitis.b-asks-for-antibiotics.1 | c7c5acf17a502beb7a10fa35bd20f500abbe29b995d9cafc6bb506fc37a18714<br>packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts<br>ALL_FAMILIES | **Retire-and-replace** | The key uniquely includes shared discussion. Equating antibiotics, prohibiting discussion and deferring until recurrence are weak alternatives. The appendicolith is named in the presentation and task. A treatment-risk recall item fails the requested resident difficulty.<br>Proposed replacement question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1 |
| inventory.00050117719fe89e<br>question.appendicitis.appendicolith-operative-pathway.v1 | concept.appendicitis.appendicolith-operative-pathway<br>case.gs028c.appendicitis.b-ct-confirmed-appendicolith<br>node.gs028c.appendicitis.b-ct-confirmed-appendicolith.1 | d4db23a47e09509e5220eeee128115742b17224e02247eeb97d48866904bad41<br>packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts<br>ALL_FAMILIES | **Retire-and-replace** | The appendicolith is interpreted before the answer and repeated in the task. Four variants score essentially the same preference. Hospital antibiotics, outpatient antibiotics and interval surgery have unequal care-phase framing. Replace a redundant slot with a supported post-abscess tissue decision.<br>Proposed replacement question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 |
| inventory.46eca681a5657da1<br>question.appendicitis.appendicolith-operative-pathway.v3 | concept.appendicitis.appendicolith-operative-pathway<br>case.gs028c.appendicitis.b-no-perforation-but-stone<br>node.gs028c.appendicitis.b-no-perforation-but-stone.1 | f0fa68e7b2cc7fb5c29d3bf249cde7975106c5f8da7f54ab4c06c6a1574baf92<br>packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts<br>ALL_FAMILIES | **Retire-and-replace** | Absence of perforation and abscess creates no distinct objective from the other appendicolith versions. The task names the modifier and hospital pathway. The alternatives repeat inpatient/outpatient antibiotics and interval surgery. No exact accepted basic-purpose exception is supplied.<br>Proposed replacement question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1 |
| inventory.c98fa6b2a1093e17<br>question.appendicitis.appendicolith-operative-pathway.v4 | concept.appendicitis.appendicolith-operative-pathway<br>case.gs028c.appendicitis.b-prior-antibiotic-preference<br>node.gs028c.appendicitis.b-prior-antibiotic-preference.1 | b52cb6096ca750d77657b7a6c4173503ca8efac9d9deb8d92b823203ab55212d<br>packages/clinical-content/src/development-batch/2026-10-02-pre-endoscopy/families.ts<br>ALL_FAMILIES | **Retire-and-replace** | A newly named appendicolith is the only substantive change. Declaring antibiotics impossible and deferring for weeks reveal the intended middle position. Prior preference is a cue without a supported patient-specific tradeoff that can change the key.<br>Proposed replacement question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1 |
| inventory.159fb8efb704d450<br>question.appendicitis.stable-adult-ct.v4.r1 | concept.appendicitis.stable-adult-ct<br>case.gs028c.appendicitis.a-competing-diagnoses<br>node.gs028c.appendicitis.a-competing-diagnoses.1 | 350382943fd5ca40ff15ecd0f3e3b95e5fff60228b2ec7e48c378efcd0cbb62c<br>packages/clinical-content/src/question-bank-batch2b-20261104-data.ts<br>QUESTION_BANK_BATCH2B_DEFINITIONS | **Retire-and-replace** | Independent B2B14 review 1 returned REVISE for failed-ultrasound and benign-cyst exclusions. Both Male finite profiles also retain an ovarian cyst without a documented constrained anatomy exception. Preserve the exact old version and replace its draft objective with progression after adequate imaging.<br>Proposed replacement question.topic.appendix-appendicitis.persistent-pain-exploration.v1 |
| inventory.039efde9d6406671<br>question.appendicitis.stable-adult-ct.v4.r2 | concept.appendicitis.ct-request-with-urinary-mimic.v1<br>case.gs028c.appendicitis.a-competing-diagnoses<br>node.gs028c.appendicitis.a-competing-diagnoses.1 | 61641e839b89d93fdc07fd117ea4ce67ea43814b254acad11ecd3addcc485667<br>packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts<br>QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS | **Rewrite** | Independent B2B14 review 2 returned REVISE. It judged the classic migratory inflammatory pattern easy and delayed excretory urography weak. The topic draft changes meaning to escalation after adequate negative CT and a worsening serial examination. A new concept preserves the older protocol identity and history.<br>Proposed replacement question.topic.appendix-appendicitis.persistent-pain-exploration.v1 |
| inventory.77a3e7166020ce63<br>question.n3.appendicitis-response-versus-structural-risk.v1 | concept.n3.appendicitis-response-versus-structural-risk<br>case.n3.appendicitis-response-versus-structural-risk.v1<br>node.n3.appendicitis-response-versus-structural-risk.v1 | 2705e357a2c5e7a46bbff43e1747b1cec7f990d68b2081e0b71f18d54fc0ea76<br>packages/clinical-content/src/question-new-n3-20261105.ts<br>QUESTION_NEW_N3_QUESTIONS | **Retire-and-replace** | The preference for reducing unplanned later procedures previews the operative key. An appendicolith plus early improvement adds another version of the same risk rule. Routine interval surgery remains a weak acute-stage competitor.<br>Proposed replacement question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 |
| inventory.01cebe62173eb37c<br>question.n3.appendicitis-response-versus-structural-risk.v2 | concept.n3.appendicitis-response-versus-structural-risk<br>case.n3.appendicitis-response-versus-structural-risk.v1<br>node.n3.appendicitis-response-versus-structural-risk.v1 | 21184b7445bb8d87723a6600026eb436b52d4ca1b45dbf8d861717aedd0f04ec<br>packages/clinical-content/src/question-new-n3-round2-20261105.ts<br>QUESTION_NEW_N3_ROUND2_QUESTIONS | **Retire-and-replace** | Carry review.n3.appendicitis-response-versus-structural-risk.v2 as a retained drop proposal. The recorded rationale identifies four live appendicolith variants and no distinct supported boundary. The calcified focus is legitimate evidence, but initial improvement adds no substantial separate decision.<br>Proposed replacement question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 |
| inventory.87d2d8f029e0fd4b<br>variant.appendicitis.classic-disposition.b | concept.appendicitis.classic-pattern-urgent-disposition<br>case.pilot.appendicitis-classic-transfer<br>node.case.pilot.appendicitis-classic-transfer.1 | 07a782355e2c965ce94b78b23028aaec0daea1aef24c44566bf5384d77b299bb<br>packages/clinical-content/src/pilot-content.ts<br>PILOT_CLINICAL_RELEASE | **Retire-and-replace** | The complaint has nine words. The unnamed presentation repeats the complaint and adds unused BMI, and the task repeats the same syndrome. Transfer versus delayed follow-up or completed clinic treatment is a basic safety comparison with no exact accepted onboarding exception.<br>Proposed replacement question.topic.appendix-appendicitis.persistent-pain-exploration.v1 |
| inventory.f6a91b1684ea0b16<br>variant.appendicitis.incomplete-recognition.a | concept.appendicitis.incomplete-pattern-recognition<br>case.pilot.appendicitis-incomplete-multistep<br>node.case.pilot.appendicitis-incomplete-multistep.1 | 0a0337854fc58938b135e7cf8df7522afef515d3f20e1efbb77ab5230249df21<br>packages/clinical-content/src/pilot-content.ts<br>PILOT_CLINICAL_RELEASE | **Retire-and-replace** | This is one diagnosis association, with constipation, cystitis and gastroenteritis weak competitors to progressive focal tenderness. The unnamed canonical presentation repeats findings and adds unused BMI. Recognition feedback also supplies the concern used by the next node.<br>Proposed replacement question.topic.appendix-appendicitis.postoperative-infection-imaging.v1 |
| inventory.e64a213d31294e69<br>variant.appendicitis.no-delay.a | concept.appendicitis.no-delay-for-unavailable-test<br>case.pilot.appendicitis-incomplete-multistep<br>node.case.pilot.appendicitis-incomplete-multistep.2 | 2f6464f76f1560d854fb813e2f9d50466f80392045818c5cc44d9e33a2297fe8<br>packages/clinical-content/src/pilot-content.ts<br>PILOT_CLINICAL_RELEASE | **Retire-and-replace** | The preceding explanation already names appendicitis. This task then states both appropriate modalities are unavailable and compares transfer with a substitute X-ray, nonurgent CT and discharge because of the limitation. Availability and caricature options supply the answer.<br>Proposed replacement question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1 |
| inventory.b27b6e5a35516a63<br>variant.appendicitis.no-delay.b | concept.appendicitis.no-delay-for-unavailable-test<br>case.pilot.appendicitis-no-onsite-imaging<br>node.case.pilot.appendicitis-no-onsite-imaging.1 | b8469b91eb0080446ce08554f0d852f56c3f2f2f337c079019b892c7df66f6bc<br>packages/clinical-content/src/pilot-content.ts<br>PILOT_CLINICAL_RELEASE | **Retire-and-replace** | The long complaint names absent CT. The unnamed presentation and task both announce the facility limit and concern. Transfer competes with later-week CT, X-ray substitution and ending evaluation. This duplicates the earlier no-delay node without a distinct consequential decision.<br>Proposed replacement question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1 |

The clinical purpose and source relationship can remain important while a supply version receives a retirement proposal. The initial-CT and appendicolith relationships remain ranked repair gaps. The manager's retirement decision includes whether to retain those core supply versions while difficult direct replacements are authored.

#### Exact old visible versions

Names expand the captured patientName placeholder for readability. JSON retains the original strings and exact hashes. Review displays show the recorded key first.

##### inventory.aec842138ef4f218

question.appendicitis.stable-adult-ct.v2. case.gs028c.appendicitis.a-atypical-older-adult. node.gs028c.appendicitis.a-atypical-older-adult.1. Status live original. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":58,"sexLabel":"Female"}. Complaint New abdominal pain.

{patientName}, a 58-year-old woman, comes to the clinic with new lower-abdominal pain and maximal tenderness on the right. Hemodynamics are normal, pregnancy is not possible, and ultrasound was nondiagnostic because of overlying bowel gas. The local hospital cannot provide prompt MRI.

Current update Empty

Exhibit Empty

Task Which next imaging study best evaluates suspected appendicitis and alternative acute abdominal diagnoses in this stable adult?

**key shown first for review only.**

- **KEY** Abdominopelvic CT ? Option-specific rationale field absent in the captured node.
- Abdominal ultrasound ? CT is the appropriate definitive study when appendicitis remains possible after inconclusive ultrasound and timely MRI is unavailable in a stable nonpregnant adult.
- Abdominal and pelvic MRI ? CT is the appropriate definitive study when appendicitis remains possible after inconclusive ultrasound and timely MRI is unavailable in a stable nonpregnant adult.
- Plain abdominal radiographs ? CT is the appropriate definitive study when appendicitis remains possible after inconclusive ultrasound and timely MRI is unavailable in a stable nonpregnant adult.

Explanation CT is the appropriate definitive study when appendicitis remains possible after inconclusive ultrasound and timely MRI is unavailable in a stable nonpregnant adult.

Node SHA-256 `4ff0e22bc535e7865e16506a8aacafee4921d6beda3abc2facb8837ba4120420`. Visible-context SHA-256 `729fa9f768e8434f6d71847a53317eca2b362261e737b6375a617b86be76a643`.

Finite profiles inspected

- `profile.gs028c.appendicitis.a-atypical-older-adult.female.58` ? {"ageYears":58,"sexLabel":"Female"}. {patientName}, a 58-year-old woman, comes to the clinic with new lower-abdominal pain and maximal tenderness on the right. Hemodynamics are normal, pregnancy is not possible, and ultrasound was nondiagnostic because of overlying bowel gas. The local hospital cannot provide prompt MRI.
- `profile.gs028c.appendicitis.a-atypical-older-adult.male.58` ? {"ageYears":58,"sexLabel":"Male"}. {patientName}, a 58-year-old man, comes to the clinic with new lower-abdominal pain and maximal tenderness on the right. Hemodynamics are normal, pregnancy is not possible, and ultrasound was nondiagnostic because of overlying bowel gas. The local hospital cannot provide prompt MRI.
- `profile.gs028c.appendicitis.a-atypical-older-adult.female.71` ? {"ageYears":71,"sexLabel":"Female"}. {patientName}, a 71-year-old woman, comes to the clinic with new lower-abdominal pain and maximal tenderness on the right. Hemodynamics are normal, pregnancy is not possible, and ultrasound was nondiagnostic because of overlying bowel gas. The local hospital cannot provide prompt MRI.
- `profile.gs028c.appendicitis.a-atypical-older-adult.male.71` ? {"ageYears":71,"sexLabel":"Male"}. {patientName}, a 71-year-old man, comes to the clinic with new lower-abdominal pain and maximal tenderness on the right. Hemodynamics are normal, pregnancy is not possible, and ultrasound was nondiagnostic because of overlying bowel gas. The local hospital cannot provide prompt MRI.

##### inventory.7db83c6db2bc35c3

question.appendicitis.stable-adult-ct.v4. case.gs028c.appendicitis.a-competing-diagnoses. node.gs028c.appendicitis.a-competing-diagnoses.1. Status live original. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":44,"sexLabel":"Female"}. Complaint Lower abdominal pain.

{patientName}, a 44-year-old woman, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable.

Current update Empty

Exhibit Empty

Task Which next imaging study best evaluates both appendicitis and the competing acute diagnoses in this patient?

**key shown first for review only.**

- **KEY** Abdominopelvic CT ? Option-specific rationale field absent in the captured node.
- Plain abdominal radiographs ? For stable nonpregnant adults with persistent concern after inconclusive ultrasound, CT supplies definitive acute evaluation when prompt MRI is unavailable.
- Focused abdominal ultrasound ? For stable nonpregnant adults with persistent concern after inconclusive ultrasound, CT supplies definitive acute evaluation when prompt MRI is unavailable.
- Abdominal and pelvic MRI ? For stable nonpregnant adults with persistent concern after inconclusive ultrasound, CT supplies definitive acute evaluation when prompt MRI is unavailable.

Explanation For stable nonpregnant adults with persistent concern after inconclusive ultrasound, CT supplies definitive acute evaluation when prompt MRI is unavailable.

Node SHA-256 `4cc7741a472b7d5fe41f3fbf47dde2b57488cc2df8ffd9402376c6990b27b2e8`. Visible-context SHA-256 `088db93dfa349905750e7bb396b5eca9c6fb2567593d0f7a0bd8a63113e1b0fd`.

Finite profiles inspected

- `profile.gs028c.appendicitis.a-competing-diagnoses.female.44` ? {"ageYears":44,"sexLabel":"Female"}. {patientName}, a 44-year-old woman, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable.
- `profile.gs028c.appendicitis.a-competing-diagnoses.male.44` ? {"ageYears":44,"sexLabel":"Male"}. {patientName}, a 44-year-old man, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable.
- `profile.gs028c.appendicitis.a-competing-diagnoses.female.63` ? {"ageYears":63,"sexLabel":"Female"}. {patientName}, a 63-year-old woman, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable.
- `profile.gs028c.appendicitis.a-competing-diagnoses.male.63` ? {"ageYears":63,"sexLabel":"Male"}. {patientName}, a 63-year-old man, presents to the clinic with right-sided lower-abdominal pain and mild leukocytosis. The examination could reflect appendicitis or another intra-abdominal process. The patient is stable and nonpregnant, ultrasound is inconclusive, and timely MRI is unavailable.

##### inventory.77b6a7027acff8ce

question.appendicitis.stable-adult-ct.v3. case.gs028c.appendicitis.a-equivocal-exam. node.gs028c.appendicitis.a-equivocal-exam.1. Status live original. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":27,"sexLabel":"Female"}. Complaint Pain moved right.

{patientName}, a 27-year-old woman, presents to the clinic with central abdominal pain that migrated to the right lower quadrant. Examination is concerning but not diagnostic, ultrasound is nondiagnostic, pregnancy testing is negative, and MRI is not promptly available. The patient is stable without diffuse peritonitis.

Current update Empty

Exhibit Empty

Task Which next imaging study should evaluate this stable adult for suspected appendicitis and competing acute diagnoses?

**key shown first for review only.**

- **KEY** Abdominopelvic CT ? Option-specific rationale field absent in the captured node.
- Graded-compression ultrasound ? Migration and focal tenderness keep appendicitis in the differential. After nondiagnostic ultrasound, CT is the available definitive study for this stable nonpregnant adult.
- Plain abdominal radiographs ? Migration and focal tenderness keep appendicitis in the differential. After nondiagnostic ultrasound, CT is the available definitive study for this stable nonpregnant adult.
- Abdominal and pelvic MRI ? Migration and focal tenderness keep appendicitis in the differential. After nondiagnostic ultrasound, CT is the available definitive study for this stable nonpregnant adult.

Explanation Migration and focal tenderness keep appendicitis in the differential. After nondiagnostic ultrasound, CT is the available definitive study for this stable nonpregnant adult.

Node SHA-256 `15c9d2ee32ee3b1bd7c3432ba4e725d13097dfdcab02c789e9862b4a1db17970`. Visible-context SHA-256 `7102161ba786a0ec07d987b8cc0ed29a1a591c47fa7143c6e75f6727bc5ef828`.

Finite profiles inspected

- `profile.gs028c.appendicitis.a-equivocal-exam.female.27` ? {"ageYears":27,"sexLabel":"Female"}. {patientName}, a 27-year-old woman, presents to the clinic with central abdominal pain that migrated to the right lower quadrant. Examination is concerning but not diagnostic, ultrasound is nondiagnostic, pregnancy testing is negative, and MRI is not promptly available. The patient is stable without diffuse peritonitis.
- `profile.gs028c.appendicitis.a-equivocal-exam.male.27` ? {"ageYears":27,"sexLabel":"Male"}. {patientName}, a 27-year-old man, presents to the clinic with central abdominal pain that migrated to the right lower quadrant. Examination is concerning but not diagnostic, ultrasound is nondiagnostic, pregnancy testing is negative, and MRI is not promptly available. The patient is stable without diffuse peritonitis.
- `profile.gs028c.appendicitis.a-equivocal-exam.female.39` ? {"ageYears":39,"sexLabel":"Female"}. {patientName}, a 39-year-old woman, presents to the clinic with central abdominal pain that migrated to the right lower quadrant. Examination is concerning but not diagnostic, ultrasound is nondiagnostic, pregnancy testing is negative, and MRI is not promptly available. The patient is stable without diffuse peritonitis.
- `profile.gs028c.appendicitis.a-equivocal-exam.male.39` ? {"ageYears":39,"sexLabel":"Male"}. {patientName}, a 39-year-old man, presents to the clinic with central abdominal pain that migrated to the right lower quadrant. Examination is concerning but not diagnostic, ultrasound is nondiagnostic, pregnancy testing is negative, and MRI is not promptly available. The patient is stable without diffuse peritonitis.

##### inventory.fde00f3201bc47d2

question.appendicitis.stable-adult-ct.v1. case.gs028c.appendicitis.a-nondiagnostic-ultrasound. node.gs028c.appendicitis.a-nondiagnostic-ultrasound.1. Status live original. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":32,"sexLabel":"Female"}. Complaint Right lower pain.

{patientName}, a 32-year-old woman, presents to the clinic with focal right-lower-quadrant pain, anorexia, and localized tenderness. Vital signs are stable. Pregnancy testing is negative, ultrasound did not visualize the appendix or an alternative cause, and timely MRI is unavailable.

Current update Empty

Exhibit Empty

Task Which next imaging study should the receiving acute-care team use to evaluate this patient's suspected appendicitis?

**key shown first for review only.**

- **KEY** Abdominopelvic CT ? Option-specific rationale field absent in the captured node.
- Right-lower-quadrant ultrasound ? Persistent uncertainty after nondiagnostic ultrasound in a stable nonpregnant adult warrants definitive cross-sectional imaging; with timely MRI unavailable, select CT of the abdomen and pelvis.
- Abdominal and pelvic MRI ? Persistent uncertainty after nondiagnostic ultrasound in a stable nonpregnant adult warrants definitive cross-sectional imaging; with timely MRI unavailable, select CT of the abdomen and pelvis.
- Plain abdominal radiographs ? Persistent uncertainty after nondiagnostic ultrasound in a stable nonpregnant adult warrants definitive cross-sectional imaging; with timely MRI unavailable, select CT of the abdomen and pelvis.

Explanation Persistent uncertainty after nondiagnostic ultrasound in a stable nonpregnant adult warrants definitive cross-sectional imaging; with timely MRI unavailable, select CT of the abdomen and pelvis.

Node SHA-256 `4f4208c8b1e4fa4fcffa300d4dc5d0960b96cb80c6935d4a132ae327ba659ce2`. Visible-context SHA-256 `e52625d76795c6b9b71be666f7d8cfc45239b96ead62d0d3668cc07093bbd7d2`.

Finite profiles inspected

- `profile.gs028c.appendicitis.a-nondiagnostic-ultrasound.female.32` ? {"ageYears":32,"sexLabel":"Female"}. {patientName}, a 32-year-old woman, presents to the clinic with focal right-lower-quadrant pain, anorexia, and localized tenderness. Vital signs are stable. Pregnancy testing is negative, ultrasound did not visualize the appendix or an alternative cause, and timely MRI is unavailable.
- `profile.gs028c.appendicitis.a-nondiagnostic-ultrasound.male.32` ? {"ageYears":32,"sexLabel":"Male"}. {patientName}, a 32-year-old man, presents to the clinic with focal right-lower-quadrant pain, anorexia, and localized tenderness. Vital signs are stable. Pregnancy testing is negative, ultrasound did not visualize the appendix or an alternative cause, and timely MRI is unavailable.
- `profile.gs028c.appendicitis.a-nondiagnostic-ultrasound.female.46` ? {"ageYears":46,"sexLabel":"Female"}. {patientName}, a 46-year-old woman, presents to the clinic with focal right-lower-quadrant pain, anorexia, and localized tenderness. Vital signs are stable. Pregnancy testing is negative, ultrasound did not visualize the appendix or an alternative cause, and timely MRI is unavailable.
- `profile.gs028c.appendicitis.a-nondiagnostic-ultrasound.male.46` ? {"ageYears":46,"sexLabel":"Male"}. {patientName}, a 46-year-old man, presents to the clinic with focal right-lower-quadrant pain, anorexia, and localized tenderness. Vital signs are stable. Pregnancy testing is negative, ultrasound did not visualize the appendix or an alternative cause, and timely MRI is unavailable.

##### inventory.14164bfd62e37818

question.appendicitis.appendicolith-operative-pathway.v2. case.gs028c.appendicitis.b-asks-for-antibiotics. node.gs028c.appendicitis.b-asks-for-antibiotics.1. Status live original. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":36,"sexLabel":"Female"}. Complaint Can I avoid surgery?.

{patientName}, a 36-year-old woman, arrives at the clinic with a same-day outside CT confirming uncomplicated appendicitis containing an appendicolith. The patient is an operative candidate and asks whether antibiotics have the same expected course as appendectomy.

Current update Empty

Exhibit Empty

Task Which treatment plan is most appropriate for this stable adult with appendicitis and an appendicolith?

**key shown first for review only.**

- **KEY** Appendectomy after shared discussion ? Option-specific rationale field absent in the captured node.
- Recommend antibiotics as equivalent treatment ? Explain that antibiotics-first care remains a preference-sensitive option in selected cases, but an appendicolith increases adverse-course and later-operation risk, so operative hospital care is favored.
- Prohibit any antibiotics-first discussion ? Explain that antibiotics-first care remains a preference-sensitive option in selected cases, but an appendicolith increases adverse-course and later-operation risk, so operative hospital care is favored.
- Defer treatment until symptoms recur ? Explain that antibiotics-first care remains a preference-sensitive option in selected cases, but an appendicolith increases adverse-course and later-operation risk, so operative hospital care is favored.

Explanation Explain that antibiotics-first care remains a preference-sensitive option in selected cases, but an appendicolith increases adverse-course and later-operation risk, so operative hospital care is favored.

Node SHA-256 `c7c5acf17a502beb7a10fa35bd20f500abbe29b995d9cafc6bb506fc37a18714`. Visible-context SHA-256 `89f12a779c5b1518e187177288ee4427b5af1806d232ba0cada4b211a74b7e48`.

Finite profiles inspected

- `profile.gs028c.appendicitis.b-asks-for-antibiotics.female.36` ? {"ageYears":36,"sexLabel":"Female"}. {patientName}, a 36-year-old woman, arrives at the clinic with a same-day outside CT confirming uncomplicated appendicitis containing an appendicolith. The patient is an operative candidate and asks whether antibiotics have the same expected course as appendectomy.
- `profile.gs028c.appendicitis.b-asks-for-antibiotics.male.36` ? {"ageYears":36,"sexLabel":"Male"}. {patientName}, a 36-year-old man, arrives at the clinic with a same-day outside CT confirming uncomplicated appendicitis containing an appendicolith. The patient is an operative candidate and asks whether antibiotics have the same expected course as appendectomy.
- `profile.gs028c.appendicitis.b-asks-for-antibiotics.female.52` ? {"ageYears":52,"sexLabel":"Female"}. {patientName}, a 52-year-old woman, arrives at the clinic with a same-day outside CT confirming uncomplicated appendicitis containing an appendicolith. The patient is an operative candidate and asks whether antibiotics have the same expected course as appendectomy.
- `profile.gs028c.appendicitis.b-asks-for-antibiotics.male.52` ? {"ageYears":52,"sexLabel":"Male"}. {patientName}, a 52-year-old man, arrives at the clinic with a same-day outside CT confirming uncomplicated appendicitis containing an appendicolith. The patient is an operative candidate and asks whether antibiotics have the same expected course as appendectomy.

##### inventory.00050117719fe89e

question.appendicitis.appendicolith-operative-pathway.v1. case.gs028c.appendicitis.b-ct-confirmed-appendicolith. node.gs028c.appendicitis.b-ct-confirmed-appendicolith.1. Status live original. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":29,"sexLabel":"Female"}. Complaint Appendix CT result.

{patientName}, a 29-year-old woman, brings a same-day outside CT report to the clinic confirming uncomplicated acute appendicitis with an appendicolith. There is no abscess or perforation, and the patient is fit for surgery.

Current update Empty

Exhibit Empty

Task Which appendicitis treatment recommendation best accounts for this patient's appendicolith?

**key shown first for review only.**

- **KEY** Hospital appendectomy pathway ? Option-specific rationale field absent in the captured node.
- Use hospital antibiotics-first care ? An appendicolith predicts a less favorable antibiotics-first course. For this fit adult, favor appendectomy while explaining that treatment choices still involve patient-specific shared decision-making.
- Use outpatient antibiotics-first care ? An appendicolith predicts a less favorable antibiotics-first course. For this fit adult, favor appendectomy while explaining that treatment choices still involve patient-specific shared decision-making.
- Plan interval appendectomy after antibiotics ? An appendicolith predicts a less favorable antibiotics-first course. For this fit adult, favor appendectomy while explaining that treatment choices still involve patient-specific shared decision-making.

Explanation An appendicolith predicts a less favorable antibiotics-first course. For this fit adult, favor appendectomy while explaining that treatment choices still involve patient-specific shared decision-making.

Node SHA-256 `d4db23a47e09509e5220eeee128115742b17224e02247eeb97d48866904bad41`. Visible-context SHA-256 `cdd9516b27563ea49a1cd7ce50403c184a884799a6763a4e273f8d08e351873b`.

Finite profiles inspected

- `profile.gs028c.appendicitis.b-ct-confirmed-appendicolith.female.29` ? {"ageYears":29,"sexLabel":"Female"}. {patientName}, a 29-year-old woman, brings a same-day outside CT report to the clinic confirming uncomplicated acute appendicitis with an appendicolith. There is no abscess or perforation, and the patient is fit for surgery.
- `profile.gs028c.appendicitis.b-ct-confirmed-appendicolith.male.29` ? {"ageYears":29,"sexLabel":"Male"}. {patientName}, a 29-year-old man, brings a same-day outside CT report to the clinic confirming uncomplicated acute appendicitis with an appendicolith. There is no abscess or perforation, and the patient is fit for surgery.
- `profile.gs028c.appendicitis.b-ct-confirmed-appendicolith.female.41` ? {"ageYears":41,"sexLabel":"Female"}. {patientName}, a 41-year-old woman, brings a same-day outside CT report to the clinic confirming uncomplicated acute appendicitis with an appendicolith. There is no abscess or perforation, and the patient is fit for surgery.
- `profile.gs028c.appendicitis.b-ct-confirmed-appendicolith.male.41` ? {"ageYears":41,"sexLabel":"Male"}. {patientName}, a 41-year-old man, brings a same-day outside CT report to the clinic confirming uncomplicated acute appendicitis with an appendicolith. There is no abscess or perforation, and the patient is fit for surgery.

##### inventory.46eca681a5657da1

question.appendicitis.appendicolith-operative-pathway.v3. case.gs028c.appendicitis.b-no-perforation-but-stone. node.gs028c.appendicitis.b-no-perforation-but-stone.1. Status live original. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":48,"sexLabel":"Female"}. Complaint Appendicitis treatment choice.

{patientName}, a 48-year-old woman, presents to the clinic with a same-day outside CT showing uncomplicated appendicitis. The radiologist specifically notes an appendicolith but no perforation, abscess, or diffuse peritonitis. The patient has no major operative contraindication.

Current update Empty

Exhibit Empty

Task Which hospital treatment pathway should be recommended for this patient's appendicitis with an appendicolith?

**key shown first for review only.**

- **KEY** Surgical evaluation for appendectomy ? Option-specific rationale field absent in the captured node.
- Use outpatient antibiotics-first care ? Do not equate uncomplicated imaging with low risk for every nonoperative pathway. The appendicolith shifts counseling toward operative hospital care.
- Use hospital antibiotics-first care ? Do not equate uncomplicated imaging with low risk for every nonoperative pathway. The appendicolith shifts counseling toward operative hospital care.
- Plan interval appendectomy after antibiotics ? Do not equate uncomplicated imaging with low risk for every nonoperative pathway. The appendicolith shifts counseling toward operative hospital care.

Explanation Do not equate uncomplicated imaging with low risk for every nonoperative pathway. The appendicolith shifts counseling toward operative hospital care.

Node SHA-256 `f0fa68e7b2cc7fb5c29d3bf249cde7975106c5f8da7f54ab4c06c6a1574baf92`. Visible-context SHA-256 `c1425fcdd2e18f7e1ee1c5967e66bf182b805da444423e3ee1f0adaa5a685f80`.

Finite profiles inspected

- `profile.gs028c.appendicitis.b-no-perforation-but-stone.female.48` ? {"ageYears":48,"sexLabel":"Female"}. {patientName}, a 48-year-old woman, presents to the clinic with a same-day outside CT showing uncomplicated appendicitis. The radiologist specifically notes an appendicolith but no perforation, abscess, or diffuse peritonitis. The patient has no major operative contraindication.
- `profile.gs028c.appendicitis.b-no-perforation-but-stone.male.48` ? {"ageYears":48,"sexLabel":"Male"}. {patientName}, a 48-year-old man, presents to the clinic with a same-day outside CT showing uncomplicated appendicitis. The radiologist specifically notes an appendicolith but no perforation, abscess, or diffuse peritonitis. The patient has no major operative contraindication.
- `profile.gs028c.appendicitis.b-no-perforation-but-stone.female.61` ? {"ageYears":61,"sexLabel":"Female"}. {patientName}, a 61-year-old woman, presents to the clinic with a same-day outside CT showing uncomplicated appendicitis. The radiologist specifically notes an appendicolith but no perforation, abscess, or diffuse peritonitis. The patient has no major operative contraindication.
- `profile.gs028c.appendicitis.b-no-perforation-but-stone.male.61` ? {"ageYears":61,"sexLabel":"Male"}. {patientName}, a 61-year-old man, presents to the clinic with a same-day outside CT showing uncomplicated appendicitis. The radiologist specifically notes an appendicolith but no perforation, abscess, or diffuse peritonitis. The patient has no major operative contraindication.

##### inventory.c98fa6b2a1093e17

question.appendicitis.appendicolith-operative-pathway.v4. case.gs028c.appendicitis.b-prior-antibiotic-preference. node.gs028c.appendicitis.b-prior-antibiotic-preference.1. Status live original. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":33,"sexLabel":"Female"}. Complaint Review appendicitis plan.

{patientName}, a 33-year-old woman, comes to the clinic after initially preferring antibiotics for uncomplicated appendicitis. Final review of the same-day outside CT now identifies an appendicolith. The patient remains stable, is fit for surgery, and has not begun a definitive pathway.

Current update Empty

Exhibit Empty

Task How should this patient's appendicolith change the treatment plan for acute appendicitis?

**key shown first for review only.**

- **KEY** Recommend operative hospital management ? Option-specific rationale field absent in the captured node.
- Continue unchanged antibiotics-only planning ? Update the shared decision with the appendicolith-specific risk. Appendectomy is favored for this fit adult, without overstating the finding as an absolute ban on antibiotics.
- Declare antibiotics medically impossible ? Update the shared decision with the appendicolith-specific risk. Appendectomy is favored for this fit adult, without overstating the finding as an absolute ban on antibiotics.
- Defer the decision for several weeks ? Update the shared decision with the appendicolith-specific risk. Appendectomy is favored for this fit adult, without overstating the finding as an absolute ban on antibiotics.

Explanation Update the shared decision with the appendicolith-specific risk. Appendectomy is favored for this fit adult, without overstating the finding as an absolute ban on antibiotics.

Node SHA-256 `b52cb6096ca750d77657b7a6c4173503ca8efac9d9deb8d92b823203ab55212d`. Visible-context SHA-256 `12832bf5e56227c335d0b0e352c4cb2bf83089f4181d9917558db65dbd38bce4`.

Finite profiles inspected

- `profile.gs028c.appendicitis.b-prior-antibiotic-preference.female.33` ? {"ageYears":33,"sexLabel":"Female"}. {patientName}, a 33-year-old woman, comes to the clinic after initially preferring antibiotics for uncomplicated appendicitis. Final review of the same-day outside CT now identifies an appendicolith. The patient remains stable, is fit for surgery, and has not begun a definitive pathway.
- `profile.gs028c.appendicitis.b-prior-antibiotic-preference.male.33` ? {"ageYears":33,"sexLabel":"Male"}. {patientName}, a 33-year-old man, comes to the clinic after initially preferring antibiotics for uncomplicated appendicitis. Final review of the same-day outside CT now identifies an appendicolith. The patient remains stable, is fit for surgery, and has not begun a definitive pathway.
- `profile.gs028c.appendicitis.b-prior-antibiotic-preference.female.57` ? {"ageYears":57,"sexLabel":"Female"}. {patientName}, a 57-year-old woman, comes to the clinic after initially preferring antibiotics for uncomplicated appendicitis. Final review of the same-day outside CT now identifies an appendicolith. The patient remains stable, is fit for surgery, and has not begun a definitive pathway.
- `profile.gs028c.appendicitis.b-prior-antibiotic-preference.male.57` ? {"ageYears":57,"sexLabel":"Male"}. {patientName}, a 57-year-old man, comes to the clinic after initially preferring antibiotics for uncomplicated appendicitis. Final review of the same-day outside CT now identifies an appendicolith. The patient remains stable, is fit for surgery, and has not begun a definitive pathway.

##### inventory.159fb8efb704d450

question.appendicitis.stable-adult-ct.v4.r1. case.gs028c.appendicitis.a-competing-diagnoses. node.gs028c.appendicitis.a-competing-diagnoses.1. Status draft parked. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":44,"sexLabel":"Female"}. Complaint Right lower-abdominal pain.

{patientName}, a 44-year-old woman, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.

Current update Empty

Exhibit Empty

Task Which imaging request should be made next for {patientName}?

**key shown first for review only.**

- **KEY** Abdominopelvic computed tomography ? Persistent uncertainty after the nonvisualized appendix and noncorresponding simple cyst warrants a broader definitive study in this nonpregnant adult.
- Repeat focused appendiceal ultrasound ? Repeat focused imaging can be useful when conditions or technique change; repeating the same limited target is less helpful than surveying the competing intra-abdominal causes in this record.
- Transvaginal pelvic ultrasonography ? A focused adnexal study is a credible response to pelvic pain, but the incidental simple cyst does not account for the evolving location and inflammatory record.

Explanation Persistent uncertainty after the nonvisualized appendix and noncorresponding simple cyst warrants a broader definitive study in this nonpregnant adult. Repeat focused imaging can be useful when conditions or technique change; repeating the same limited target is less helpful than surveying the competing intra-abdominal causes in this record. A focused adnexal study is a credible response to pelvic pain, but the incidental simple cyst does not account for the evolving location and inflammatory record.

Node SHA-256 `350382943fd5ca40ff15ecd0f3e3b95e5fff60228b2ec7e48c378efcd0cbb62c`. Visible-context SHA-256 `399ab0438be3612721d4e162d2dd9a89c0dae0aa8916959845b69419cb208cd7`.

Finite profiles inspected

- `profile.gs028c.appendicitis.a-competing-diagnoses.female.44` ? {"ageYears":44,"sexLabel":"Female"}. {patientName}, a 44-year-old woman, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.
- `profile.gs028c.appendicitis.a-competing-diagnoses.male.44` ? {"ageYears":44,"sexLabel":"Male"}. {patientName}, a 44-year-old man, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.
- `profile.gs028c.appendicitis.a-competing-diagnoses.female.63` ? {"ageYears":63,"sexLabel":"Female"}. {patientName}, a 63-year-old woman, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.
- `profile.gs028c.appendicitis.a-competing-diagnoses.male.63` ? {"ageYears":63,"sexLabel":"Male"}. {patientName}, a 63-year-old man, has pain that began around the umbilicus and is now felt in the right lower abdomen and flank. An outside pregnancy test is negative. Ultrasound does not trace the appendix because of overlying bowel; it shows a small simple ovarian cyst, but no lesion corresponding to the maximal tenderness. Inflammatory markers have risen on the repeat panel. Circulation is stable.

##### inventory.039efde9d6406671

question.appendicitis.stable-adult-ct.v4.r2. case.gs028c.appendicitis.a-competing-diagnoses. node.gs028c.appendicitis.a-competing-diagnoses.1. Status draft parked. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient {patientName}. Demographics {"ageYears":44,"sexLabel":"Female"}. Complaint Acute right-sided pain.

{patientName}, a 44-year-old woman, is assessed in hospital for pain that started centrally and is now constant in the right lower abdomen and flank. Palpation produces focal right-lower-quadrant guarding. Urinalysis contains red cells, and inflammatory markers are rising. The pregnancy test is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.

Current update Empty

Exhibit Empty

Task Which CT request should be made for {patientName}?

**key shown first for review only.**

- **KEY** Contrast-enhanced abdominopelvic CT ? The acute abdominal pattern needs a broad appendiceal/alternative-pathology assessment; microscopic haematuria does not by itself turn the task into a stone-only or excretory-tract study.
- Noncontrast renal-colic CT protocol ? This is a credible response to flank pain and haematuria, but it prioritizes the urinary-stone pathway over the combined acute abdominal findings.
- Delayed excretory-phase CT urography ? This is used for selected urinary-tract questions; the current concern is an acute inflammatory abdominal process, not an isolated haematuria workup.

Explanation The acute abdominal pattern needs a broad appendiceal/alternative-pathology assessment; microscopic haematuria does not by itself turn the task into a stone-only or excretory-tract study. This is a credible response to flank pain and haematuria, but it prioritizes the urinary-stone pathway over the combined acute abdominal findings. This is used for selected urinary-tract questions; the current concern is an acute inflammatory abdominal process, not an isolated haematuria workup.

Node SHA-256 `61641e839b89d93fdc07fd117ea4ce67ea43814b254acad11ecd3addcc485667`. Visible-context SHA-256 `d0e9cd5d2e3bf2c295300bcb439d8706d7b89a5175213ffe82c84089b324ae47`.

Finite profiles inspected

- `profile.gs028c.appendicitis.a-competing-diagnoses.female.44` ? {"ageYears":44,"sexLabel":"Female"}. {patientName}, a 44-year-old woman, is assessed in hospital for pain that started centrally and is now constant in the right lower abdomen and flank. Palpation produces focal right-lower-quadrant guarding. Urinalysis contains red cells, and inflammatory markers are rising. The pregnancy test is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.
- `profile.gs028c.appendicitis.a-competing-diagnoses.male.44` ? {"ageYears":44,"sexLabel":"Male"}. {patientName}, a 44-year-old man, is assessed in hospital for pain that started centrally and is now constant in the right lower abdomen and flank. Palpation produces focal right-lower-quadrant guarding. Urinalysis contains red cells, and inflammatory markers are rising. The pregnancy test is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.
- `profile.gs028c.appendicitis.a-competing-diagnoses.female.63` ? {"ageYears":63,"sexLabel":"Female"}. {patientName}, a 63-year-old woman, is assessed in hospital for pain that started centrally and is now constant in the right lower abdomen and flank. Palpation produces focal right-lower-quadrant guarding. Urinalysis contains red cells, and inflammatory markers are rising. The pregnancy test is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.
- `profile.gs028c.appendicitis.a-competing-diagnoses.male.63` ? {"ageYears":63,"sexLabel":"Male"}. {patientName}, a 63-year-old man, is assessed in hospital for pain that started centrally and is now constant in the right lower abdomen and flank. Palpation produces focal right-lower-quadrant guarding. Urinalysis contains red cells, and inflammatory markers are rising. The pregnancy test is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.

##### inventory.77a3e7166020ce63

question.n3.appendicitis-response-versus-structural-risk.v1. case.n3.appendicitis-response-versus-structural-risk.v1. node.n3.appendicitis-response-versus-structural-risk.v1. Status draft parked. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient Grace Nolan. Demographics {"ageYears":34,"sexLabel":"Female"}. Complaint Appendicitis plan review.

Grace Nolan, a 34-year-old woman, is reviewed in the clinic after an emergency department began antibiotics for appendicitis. She feels better and wants to return to work. She would prefer an operation if it meaningfully reduces her chance of needing an unplanned procedure later.

Current update Empty

Exhibit {"kind":"keyValue","caption":"Original constructed teaching record; fictional patient observations","items":[{"label":"CT narrative","value":"Enlarged inflamed appendix contains a dense calcified intraluminal focus. No perforation, abscess or diffuse fluid."},{"label":"Current course","value":"Less pain and tolerating fluids after antibiotics; mild localized tenderness remains."},{"label":"Operative context","value":"Otherwise fit adult, no major anesthesia contraindication."},{"label":"Preference discussion","value":"She prioritizes avoiding recurrent treatment failure over avoiding an initial operation."}]}

Task Which treatment pathway best fits Grace Nolan's findings and stated priority?

**key shown first for review only.**

- **KEY** Hospital evaluation for appendectomy during this episode ? The appendicolith modifies nonoperative failure risk despite early improvement; her priorities support operative evaluation.
- Complete an antibiotics-first pathway with follow-up ? Antibiotics can be discussed, but early improvement does not erase the represented structural risk modifier or her preference.
- Schedule an interval appendectomy after routine observation ? Routine delay does not resolve the current decision for a fit patient who favors definitive care in this represented episode.

Explanation The CT description includes an appendicolith. It raises the chance of complications or later appendectomy with antibiotics compared with presentations without one. Early symptom improvement is a different observation. For this fit patient and her stated preference, hospital evaluation for appendectomy is favored; nonoperative care is not declared universally prohibited.

Node SHA-256 `2705e357a2c5e7a46bbff43e1747b1cec7f990d68b2081e0b71f18d54fc0ea76`. Visible-context SHA-256 `4654ce62908dd5a464b687b200107ea6eea68d262e4ff605b7bb592d2520c8bd`.

Finite profiles inspected

- `profile.n3.appendicitis-response-versus-structural-risk.v1` ? {"ageYears":34,"sexLabel":"Female"}. Grace Nolan, a 34-year-old woman, is reviewed in the clinic after an emergency department began antibiotics for appendicitis. She feels better and wants to return to work. She would prefer an operation if it meaningfully reduces her chance of needing an unplanned procedure later.

##### inventory.01cebe62173eb37c

question.n3.appendicitis-response-versus-structural-risk.v2. case.n3.appendicitis-response-versus-structural-risk.v1. node.n3.appendicitis-response-versus-structural-risk.v1. Status draft parked. Declared review states ["needs_clinician_review"]. Acceptance/freeze reference null.

Patient Rosa Medina. Demographics {"ageYears":38,"sexLabel":"Female"}. Complaint Appendicitis plan review.

Rosa Medina, a 38-year-old woman, attends the acute surgical clinic the morning after CT-confirmed appendicitis was treated with antibiotics. She can drink and her pain score fell from 7 to 3. She and the team are choosing the remainder of treatment during this episode.

Current update Empty

Exhibit {"kind":"keyValue","caption":"Original constructed teaching record; fictional patient observations","items":[{"label":"CT narrative","value":"Appendix enlarged with periappendiceal fat stranding. A discrete calcified focus lies within the appendiceal lumen on consecutive slices; no organized collection or free gas."},{"label":"Current findings","value":"Temperature 37.2 C, pulse 80/min; localized right-lower-quadrant tenderness without rigidity."},{"label":"Clinical background","value":"Independent adult with no major cardiopulmonary disease; pregnancy test negative."},{"label":"Discussion","value":"She can complete medical treatment or undergo an operation and asks which plan the current findings favor."}]}

Task Which treatment pathway should Rosa Medina be offered as the preferred plan?

**key shown first for review only.**

- **KEY** Proceed to laparoscopic appendectomy as primary treatment ? The intraluminal calcified focus represents an appendicolith. Initial symptom improvement does not remove its association with complications or later appendectomy during an antibiotics pathway; operative treatment is favored in this fit adult.
- Complete an antibiotics-first course with recurrence surveillance ? This overweights early improvement and treats the episode as the lower-risk antibiotics scenario without the CT modifier.
- Complete antibiotics and plan an interval appendectomy ? The supplied episode has no abscess or other represented reason to replace current operative treatment with a routine delayed operation.

Explanation The CT describes an appendicolith without naming it. That finding changes the antibiotics-versus-operation discussion even when symptoms improve initially. For this fit adult, hospital appendectomy during the present episode is the favored offered pathway. The record supplies an acute surgical-clinic pathway; no unverified failure probability or routine interval is stated.

Node SHA-256 `21184b7445bb8d87723a6600026eb436b52d4ca1b45dbf8d861717aedd0f04ec`. Visible-context SHA-256 `f5a544606c3b2f1972117191ed8c4feab8b463c76ef7788645959c140ea30f92`.

Finite profiles inspected

- `profile.n3.appendicitis-response-versus-structural-risk.v2` ? {"ageYears":38,"sexLabel":"Female"}. Rosa Medina, a 38-year-old woman, attends the acute surgical clinic the morning after CT-confirmed appendicitis was treated with antibiotics. She can drink and her pain score fell from 7 to 3. She and the team are choosing the remainder of treatment during this episode.

##### inventory.87d2d8f029e0fd4b

variant.appendicitis.classic-disposition.b. case.pilot.appendicitis-classic-transfer. node.case.pilot.appendicitis-classic-transfer.1. Status draft parked. Declared review states []. Acceptance/freeze reference null.

Patient Pilot Preview Patient. Demographics {"ageYears":71,"sexLabel":"Female"}. Complaint Worsening abdominal pain now in the right lower quadrant.

A 71-year-old woman with BMI 34.8 has worsening abdominal pain that migrated to the right lower quadrant. Findings: Pain began near the umbilicus and migrated to the right lower quadrant, Progressive right-lower-quadrant tenderness, Symptoms worsened over several hours, Alert mental status, and Anorexia.

Current update Empty

Exhibit Empty

Task An otherwise healthy adult develops central abdominal discomfort followed by steadily worsening right-lower-quadrant pain, anorexia, and localized tenderness. Choose the next step from this outpatient clinic.

**key shown first for review only.**

- **KEY** Send for urgent emergency-department assessment ? Option-specific rationale field absent in the captured node.
- Discharge for a planned next-day clinic visit ? Routine delay is inappropriate when the current history and examination are concerning.
- Treat empirically and complete care as an outpatient ? Definitive treatment selection requires emergency or surgical-capable evaluation outside this pilot clinic.

Explanation A classic concerning presentation should be transferred promptly even when physiology is stable. Level 0 tests the disposition rather than definitive treatment.

Node SHA-256 `07a782355e2c965ce94b78b23028aaec0daea1aef24c44566bf5384d77b299bb`. Visible-context SHA-256 `831f3416d310a9accf3a258f5f15a05de404999eaf94faf9381a40caef2193c6`.

Canonical presentation is the captured view. The source defines no finite instantiation profiles for this version.

##### inventory.f6a91b1684ea0b16

variant.appendicitis.incomplete-recognition.a. case.pilot.appendicitis-incomplete-multistep. node.case.pilot.appendicitis-incomplete-multistep.1. Status draft parked. Declared review states []. Acceptance/freeze reference null.

Patient Pilot Preview Patient. Demographics {"ageYears":24,"sexLabel":"Male"}. Complaint Worsening focal right-lower-quadrant pain.

A 24-year-old man with BMI 32.8 has progressively worsening focal right-lower-quadrant pain. Findings: Progressively worsening abdominal pain, Focal right-lower-quadrant tenderness, Focal tenderness persists on repeat examination, Alert mental status, and Pain did not clearly migrate.

Current update Empty

Exhibit Empty

Task An adult has steadily worsening focal right-lower-quadrant pain and tenderness but no clear migration and no measured fever. Which diagnosis must remain an important urgent concern?

**key shown first for review only.**

- **KEY** Suspected acute appendicitis ? Option-specific rationale field absent in the captured node.
- Uncomplicated gastroenteritis ? Option-specific rationale field absent in the captured node.
- Simple cystitis ? Option-specific rationale field absent in the captured node.
- Routine constipation ? Option-specific rationale field absent in the captured node.

Explanation Appendicitis need not include every classic feature. Progressive focal pain and tenderness keep appendicitis as an important urgent concern even while other acute causes remain in the differential.

Node SHA-256 `0a0337854fc58938b135e7cf8df7522afef515d3f20e1efbb77ab5230249df21`. Visible-context SHA-256 `f8e7f1e4424223b6f50d26bfaa4540ea43effe582ac38d4456cc74269011b1fd`.

Canonical presentation is the captured view. The source defines no finite instantiation profiles for this version.

##### inventory.e64a213d31294e69

variant.appendicitis.no-delay.a. case.pilot.appendicitis-incomplete-multistep. node.case.pilot.appendicitis-incomplete-multistep.2. Status draft parked. Declared review states []. Acceptance/freeze reference null.

Patient Pilot Preview Patient. Demographics {"ageYears":24,"sexLabel":"Male"}. Complaint Worsening focal right-lower-quadrant pain.

A 24-year-old man with BMI 32.8 has progressively worsening focal right-lower-quadrant pain. Findings: Progressively worsening abdominal pain, Focal right-lower-quadrant tenderness, Focal tenderness persists on repeat examination, Alert mental status, and Pain did not clearly migrate.

Current update Empty

Exhibit Empty

Task The clinic is concerned about appendicitis after history and examination, but has no CT or ultrasound. Plain X-ray is available. What is the best next step?

**key shown first for review only.**

- **KEY** Prompt emergency-department transfer ? Option-specific rationale field absent in the captured node.
- Substitute a plain abdominal X-ray ? Plain radiography is not an appropriate substitute for appendicitis imaging.
- Wait for a nonurgent outpatient CT appointment ? A concerning acute presentation should not be delayed for future outpatient imaging.
- Discharge because CT is unavailable ? Lack of onsite imaging does not remove the clinical concern or the need for a capable evaluation setting.

Explanation The clinic should not replace appropriate appendicitis evaluation with plain X-ray or delay care for unavailable CT. Transfer to an emergency-capable setting.

Node SHA-256 `2f6464f76f1560d854fb813e2f9d50466f80392045818c5cc44d9e33a2297fe8`. Visible-context SHA-256 `5485f84feb05bd9e75ea39e6f9449577c0647cd8c89a8e8929d9223d68bff162`.

Earlier visible sequence

- node.case.pilot.appendicitis-incomplete-multistep.1 ? An adult has steadily worsening focal right-lower-quadrant pain and tenderness but no clear migration and no measured fever. Which diagnosis must remain an important urgent concern?
  Feedback Appendicitis need not include every classic feature. Progressive focal pain and tenderness keep appendicitis as an important urgent concern even while other acute causes remain in the differential.

Canonical presentation is the captured view. The source defines no finite instantiation profiles for this version.

##### inventory.b27b6e5a35516a63

variant.appendicitis.no-delay.b. case.pilot.appendicitis-no-onsite-imaging. node.case.pilot.appendicitis-no-onsite-imaging.1. Status draft parked. Declared review states []. Acceptance/freeze reference null.

Patient Pilot Preview Patient. Demographics {"ageYears":38,"sexLabel":"Female"}. Complaint Concerning right-lower-quadrant pain without onsite CT.

A 38-year-old woman with BMI 28.2 has progressively worsening right-lower-quadrant pain, and appropriate appendicitis imaging is unavailable onsite. Findings: Progressively worsening right-lower-quadrant pain, Focal right-lower-quadrant tenderness, Appropriate appendicitis imaging is unavailable in the clinic, Alert mental status, and Incomplete classic symptom migration.

Current update Empty

Exhibit Empty

Task After recognizing a concerning but incomplete appendicitis pattern, you learn that appropriate imaging cannot be performed in this clinic today. Select the disposition.

**key shown first for review only.**

- **KEY** Transfer now for urgent emergency evaluation ? Option-specific rationale field absent in the captured node.
- Use the clinic X-ray machine instead ? Availability does not make plain radiography an appropriate appendicitis substitute.
- Arrange CT later in the week and observe at home ? Delayed outpatient imaging is inconsistent with the current level of concern.
- End the evaluation with routine return precautions only ? Routine discharge does not provide the prompt surgical-capable assessment required by this presentation.

Explanation Facility limits change where evaluation occurs, not whether the concern matters. Prompt emergency-department transfer is the appropriate endpoint.

Node SHA-256 `b8469b91eb0080446ce08554f0d852f56c3f2f2f337c079019b892c7df66f6bc`. Visible-context SHA-256 `9b330364a1d2c29d2410a41127b2847f45aac76d2fa5ff59fef1d7c02dec9ba3`.

Canonical presentation is the captured view. The source defines no finite instantiation profiles for this version.

### Proposed before-and-after review packet

**key shown first for review only.** Runtime answers shuffle. Every new gap item has an explicit empty before field. Retirement mappings refer to the complete old versions above. Each later node includes acquired context and all possible earlier feedback in the JSON packet.

#### question.topic.appendix-appendicitis.persistent-pain-exploration.v1

Case `case.topic.appendix-appendicitis.persistent-pain.v1`. Node `node.topic.appendix-appendicitis.persistent-pain-exploration.v1`. Concept `concept.appendix-appendicitis.persistent-pain-after-negative-imaging.v1`.

Before inventory.039efde9d6406671 / question.appendicitis.stable-adult-ct.v4.r2.

Retirement/replacement inputs inventory.aec842138ef4f218, inventory.7db83c6db2bc35c3, inventory.77b6a7027acff8ce, inventory.fde00f3201bc47d2, inventory.159fb8efb704d450, inventory.039efde9d6406671, inventory.87d2d8f029e0fd4b.

Nora Bennett, 46, Female. Complaint **Persistent right-sided pain**.

Nora Bennett, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable.

Current update Empty

Exhibit Empty

**Which hospital evaluation should be recommended now for Nora Bennett's worsening right-sided abdominal findings?**

**key shown first for review only.**

- **KEY** Proceed to diagnostic abdominal laparoscopy

  Progressive focal pain with new involuntary guarding keeps an operative abdominal cause consequential despite the adequate negative CT. Exploration can establish and treat the cause.
- Repeat contrast-enhanced abdominal and pelvic CT

  A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration.
- Continue serial abdominal examinations in hospital

  Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration.

The CT was adequate, so its negative result initially supported observation. The subsequent focal progression and involuntary guarding require a fresh decision. WSES guidance supports exploration for persistent or progressive pain after negative imaging.

Exact after hash `babdd0c70249d1eaaa4512742eb0ceffebefc1568a4efb01dbace9b7e257cdce`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Read the acquisition as adequate and the later guarding as genuine progression after an initially reasonable observation period.
- Apply Choose exploratory evaluation after the clinical course has outgrown reliance on the initial scan.
- Closest error Continue observation because the appendix was described as normal on CT.
- Deciding observation New involuntary guarding and increasingly focal tenderness during observation.
- Consequence An evolving operative abdominal process remains untreated.
- Deletion test The acquisition sentence distinguishes repeat imaging from exploration. Deleting the interval deterioration makes observation defensible. Pregnancy status and circulation delimit the acute pathway. Removed the classic migratory-pain and hematuria shortcuts from B2B14.
- Counterfactual Replace new guarding with steady pain resolution and a soft repeat examination. Continued hospital observation becomes the best offered plan. Changed choice observation.
- Cue attack All offered actions are credible hospital evaluations and the key has intermediate length. The task asks for evaluation without naming exploration, missed appendicitis or a missing action. The necessary deterioration is clinical evidence. A prior scan and its adequacy preserve a real competing observation strategy.
- Stage and category Current hospital evaluation after completed imaging and observation. Three concrete diagnostic strategies.
- Difficulty Predicted moderate for PGY-2/3. The intended error is over-reliance on an adequate negative CT when the serial examination changes. Independent review must judge the strength of this competition.
- One best answer The documented worsening after observation distinguishes exploration from simply repeating the same adequate scan or extending the same observation strategy.
- Sequence First node has no earlier feedback or future pathology. Its explanation discusses the escalation decision and supplies no later oncologic operation.
- Repair and repeat check The protocol-matching draft was replaced by a new escalation construct. A second manual pass retained scan adequacy and clinical chronology, and removed an extra fever sentence that added no decision information.

Distractor attacks

- choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1 ? Temptation Treat the earlier scan as an imaging problem that another identical study will settle. Ranking A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration. Counterfactual An incomplete outside acquisition with an unexamined symptomatic region would favor obtaining appropriate cross-sectional imaging before exploration.
- choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1 ? Temptation Give the reassuring CT more weight than the interval examination. Ranking Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration. Counterfactual A clearly improving examination without new guarding would support continued monitored observation.

Evidence claim.appendix-appendicitis.persistent-pain-negative-imaging.

Identity The returned B2B14 task selected a CT protocol. This version scores escalation after adequate negative imaging and clinical progression. It requires a new concept identity and preserves the older protocol construct and history.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.persistent-pain.v1",
  "nodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.persistent-pain-exploration.v1",
  "classification": {
    "kind": "test_choices",
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.repeat-ct.v1",
        "choiceLabel": "Repeat contrast-enhanced abdominal and pelvic CT",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.laparoscopy.v1",
        "choiceLabel": "Proceed to diagnostic abdominal laparoscopy",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.persistent-pain-exploration.observation.v1",
        "choiceLabel": "Continue serial abdominal examinations in hospital",
        "timing": {
          "kind": "no_test"
        }
      }
    ]
  }
}
```

#### question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v1

Case `case.topic.appendix-appendicitis.persistent-pain.v1`. Node `node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v1`. Concept `concept.appendix-appendicitis.invasive-adenocarcinoma-nodal-resection.v1`.

Before Empty (new gap question).

Retirement/replacement inputs Empty.

Nora Bennett, 46, Female. Complaint **Persistent right-sided pain**.

Nora Bennett, a 46-year-old woman, is assessed in the acute surgical clinic after an abdominal CT reported an air-filled appendix and no acute cause of her pain. The acquisition covered the abdomen and pelvis with intravenous contrast. During hospital observation, tenderness became more focal on the right and involuntary guarding developed. Pregnancy testing is negative and her circulation remains stable.

Current update At later clinic follow-up, Nora Bennett's hospital record shows that laparoscopy led to an intact appendectomy. Permanent review of the whole specimen identifies adenocarcinoma with infiltrative glands extending into mesoappendiceal fat. The appendiceal base margin is clear. Staging CT shows no distant or peritoneal disease, and colonoscopy shows no separate colonic lesion. She has recovered and is fit for further surgery.

Exhibit Empty

**Which further surgical plan should be recommended for Nora Bennett's appendiceal tumor after this appendectomy?**

**key shown first for review only.**

- **KEY** Oncologic right hemicolectomy with regional nodes

  The infiltrative adenocarcinoma and localized staging support an oncologic right colectomy for regional nodal assessment despite a clear appendectomy margin.
- Limited cecal re-excision around the staple line

  A cecal cuff addresses local clearance. This specimen already has a clear base margin, while the invasive diagnosis creates a regional nodal question.
- Complete surgical treatment with the appendectomy

  Clear appendectomy margins establish local removal. The invasive histology still supports regional nodal-basin resection in this fit patient with localized disease.

Infiltrative glands extending into mesoappendiceal fat establish an invasive epithelial tumor. A clear base margin addresses local clearance. For this localized adenocarcinoma, the next surgical issue is the regional nodal basin, supporting oncologic right hemicolectomy.

Exact after hash `7568bceea6a5ab1542f0c3f7e44d338af1411cd9624b0381ca7779ddb792d406`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Distinguish destructive invasive pathology from noninfiltrative mucinous disease and interpret a clear base margin as a local result.
- Apply Use localized staging and invasive histology to select regional oncologic resection.
- Closest error Treat the margin-negative appendectomy as complete oncologic surgery.
- Deciding observation Permanent whole-specimen invasive glands into mesoappendiceal fat, paired with absence of disseminated disease on completed staging.
- Consequence Regional nodal disease remains unstaged and the recommended oncologic field remains unresected.
- Deletion test Deleting permanent invasive histology makes the correct extent indeterminate. Removing completed staging creates a competing disseminated-disease pathway. The clear margin earns its place by making limited local completion appear attractive.
- Counterfactual Replace infiltrative carcinoma with margin-negative nonperforated LAMN confined to the appendix. Completed appendectomy becomes sufficient surgical treatment. Changed choice completed-resection.
- Cue attack Three surgical-extent plans answer the same task. The key contains no unique qualifier about safety or discussion. A clear margin supplies a credible reason to stop, while the invasive pattern must change that conclusion.
- Stage and category Definitive surgical extent after permanent pathology and staging.
- Difficulty Predicted moderate for PGY-2/3 from confusing local margin clearance with adequate oncologic regional surgery.
- One best answer The fully characterized invasive localized tumor supports right hemicolectomy. The specimen has already supplied local-margin clearance.
- Sequence The first node explains escalation after imaging and never mentions a malignancy or colectomy. All pathology and staging appear only in this later update.
- Repair and repeat check Replaced an isolated histology-label question with a consequential completion-operation task. Re-solved after moving staging and whole-specimen provenance into the current update.

Distractor attacks

- choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.cecal-cuff.v1 ? Temptation Equate completion cancer surgery with taking a wider local margin. Ranking A cecal cuff addresses local clearance. This specimen already has a clear base margin, while the invasive diagnosis creates a regional nodal question. Counterfactual An incidental lesion involving the appendiceal base without established invasive cancer could call for a limited cecal resection to obtain a grossly clear margin.
- choice.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.completed-resection.v1 ? Temptation Apply the limited-resection approach for localized low-grade mucinous neoplasia to an invasive carcinoma. Ranking Clear appendectomy margins establish local removal. The invasive histology still supports regional nodal-basin resection in this fit patient with localized disease. Counterfactual A margin-negative, nonperforated LAMN confined to the appendix would make completed appendectomy sufficient surgical treatment.

Evidence claim.appendix-appendicitis.lamn-versus-invasive, claim.appendix-appendicitis.adenocarcinoma-colectomy, claim.appendix-appendicitis.intact-abnormal-appendix, claim.appendix-appendicitis.lamn-complete-resection.

Identity New gap objective. The two legacy live concepts concern imaging and antibiotics-versus-operation selection, and contain no postoperative cancer-resection objective.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.persistent-pain.v1",
  "nodeId": "node.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.invasive-adenocarcinoma-resection.v1",
  "classification": {
    "kind": "no_test"
  }
}
```

Earlier visible context and possible feedback

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.persistent-pain-exploration.v1",
    "task": "Which hospital evaluation should be recommended now for {patientName}'s worsening right-sided abdominal findings?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The CT was adequate, so its negative result initially supported observation. The subsequent focal progression and involuntary guarding require a fresh decision. WSES guidance supports exploration for persistent or progressive pain after negative imaging.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Repeat contrast-enhanced abdominal and pelvic CT",
        "rationale": "A repeat scan can help when the original acquisition was inadequate or a new localization problem develops. Here, adequate imaging has been followed by a progressively abnormal serial examination, supporting exploration."
      },
      {
        "label": "Proceed to diagnostic abdominal laparoscopy",
        "rationale": "Progressive focal pain with new involuntary guarding keeps an operative abdominal cause consequential despite the adequate negative CT. Exploration can establish and treat the cause."
      },
      {
        "label": "Continue serial abdominal examinations in hospital",
        "rationale": "Observation was a reasonable response to the initial negative scan. The newly progressive focal findings change the balance toward exploration."
      }
    ]
  }
]
```

#### question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1

Case `case.topic.appendix-appendicitis.post-abscess-lesion.v1`. Node `node.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1`. Concept `concept.appendix-appendicitis.post-abscess-colonic-evaluation.v1`.

Before Empty (new gap question).

Retirement/replacement inputs inventory.b27b6e5a35516a63.

Owen Mercer, 62, Male. Complaint **Abscess follow-up**.

Owen Mercer, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. His pain and fever have resolved. Interval abdominal and pelvic CT shows collapse of the collection but persistent nodularity at the appendiceal-cecal junction. Residual inflammatory thickening obscures the appendiceal base and the nodule's organ of origin. He has never undergone colonoscopy.

Current update Empty

Exhibit Empty

**Which investigation should be completed before planning resection of Owen Mercer's persistent right-lower-quadrant lesion?**

**key shown first for review only.**

- **KEY** Colonoscopy with examination of the cecum

  The older post-abscess patient with a persistent appendiceal abnormality warrants evaluation for neoplasia. Colonoscopy assesses synchronous colonic lesions that can alter resection planning.
- CT-guided core biopsy of the appendiceal nodule

  A needle sample targets the appendiceal lesion but supplies limited tissue and leaves synchronous colonic disease unexamined. Current guidance supports colonoscopy in this preoperative setting.
- Contrast-enhanced abdominal and pelvic CT

  The available interval CT has already mapped a resolved collection and a persistent focal lesion. With infection clinically resolved, repeating that acquisition leaves the required colonic assessment outstanding.

Resolution of an appendiceal abscess leaves an underlying-neoplasm question in this older adult with a persistent nodule. Colonoscopy examines the colon for synchronous disease relevant to resection planning.

Exact after hash `c40125b4c0872d6e3a7ae9cee9177dea149d62bbd14582ad2b971a4338fb3fe2`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Separate resolution of infection from the persistent focal structural finding and the older patient's neoplasm concern.
- Apply Choose the preoperative investigation that examines potentially synchronous colonic disease.
- Closest error Biopsy the apparent appendiceal target while bypassing colonic evaluation.
- Deciding observation Persistent appendiceal-cecal nodularity of uncertain origin after abscess resolution in a 62-year-old who has never had colonoscopy.
- Consequence A synchronous colonic lesion can be missed while an incomplete operative field is planned.
- Deletion test The collapsed collection and resolved symptoms distinguish this workup from acute drainage. Nodularity of uncertain organ origin and the patient's age give the residual finding importance. Colonoscopy history establishes the acquisition need. Base anatomy remains obscured until the later reassessment.
- Counterfactual Replace symptom resolution with renewed fever and focal pain after drainage. Repeat CT to assess residual infection becomes the best offered investigation before elective colonic assessment. Changed choice repeat-ct.
- Cue attack The task asks for an investigation without stating colon screening. All choices are named diagnostic procedures. The key is shorter than both distractors. The nodule gives biopsy a real temptation, while prior abscess resolution and age must be integrated.
- Stage and category Investigation before elective resection planning.
- Difficulty Predicted moderate for PGY-2/3 from choosing tissue targeting or repeated abscess imaging before colonic evaluation. The counterfactual changes the actual clinical trajectory and re-ranks the offered CT.
- One best answer Suspected appendiceal neoplasia and absent prior colonic examination support colonoscopy before formal resection planning.
- Sequence First node supplies no later colonoscopy result. Feedback limits itself to the reason for colonic assessment and avoids the next operation's name.
- Repair and repeat check Removed an unnecessary tumor-marker result, a generic cancer-referral option and an inadequately competitive FDG study. The second pass uses a repeat-CT alternative with a concrete recurrent-infection counterfactual.

Distractor attacks

- choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.core-biopsy.v1 ? Temptation Seek a tumor label by the most direct apparent target before considering the adjacent colon. Ranking A needle sample targets the appendiceal lesion but supplies limited tissue and leaves synchronous colonic disease unexamined. Current guidance supports colonoscopy in this preoperative setting. Counterfactual An unresectable extra-appendiceal mass whose histology will determine systemic therapy may require image-guided tissue sampling after specialist planning.
- choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.repeat-ct.v1 ? Temptation Continue following the prior abscess by imaging while leaving the colon unexamined. Ranking The available interval CT has already mapped a resolved collection and a persistent focal lesion. With infection clinically resolved, repeating that acquisition leaves the required colonic assessment outstanding. Counterfactual Renewed fever and focal pain after drainage would favor repeat CT to assess a residual infectious source before elective colonic workup.

Evidence claim.appendix-appendicitis.post-abscess-neoplasm, claim.appendix-appendicitis.colonoscopy-neoplasm, claim.appendix-appendicitis.intact-abnormal-appendix, claim.appendix-appendicitis.postoperative-ct.

Identity New gap objective after nonoperative treatment of complicated appendicitis.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.post-abscess-lesion.v1",
  "nodeId": "node.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
  "classification": {
    "kind": "test_choices",
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.core-biopsy.v1",
        "choiceLabel": "CT-guided core biopsy of the appendiceal nodule",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.biopsy"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.repeat-ct.v1",
        "choiceLabel": "Contrast-enhanced abdominal and pelvic CT",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-colonic-evaluation.colonoscopy.v1",
        "choiceLabel": "Colonoscopy with examination of the cecum",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.lower_endoscopy"
        }
      }
    ]
  }
}
```

#### question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1

Case `case.topic.appendix-appendicitis.post-abscess-lesion.v1`. Node `node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1`. Concept `concept.appendix-appendicitis.suspicious-post-abscess-interval-resection.v1`.

Before Empty (new gap question).

Retirement/replacement inputs inventory.00050117719fe89e, inventory.77a3e7166020ce63, inventory.01cebe62173eb37c.

Owen Mercer, 62, Male. Complaint **Abscess follow-up**.

Owen Mercer, a 62-year-old man, attends the clinic after antibiotics and catheter drainage of an appendiceal abscess. His pain and fever have resolved. Interval abdominal and pelvic CT shows collapse of the collection but persistent nodularity at the appendiceal-cecal junction. Residual inflammatory thickening obscures the appendiceal base and the nodule's organ of origin. He has never undergone colonoscopy.

Current update At follow-up, Owen Mercer's colonoscopy has reached the cecum and shows normal mucosa, including the appendiceal orifice. After the surrounding inflammation clears, repeat CT traces the residual mural nodule to the retrocecal appendiceal tip. A normal segment separates it from the cecum, and the base is free. No peritoneal or distant lesions are seen. He is fit for surgery.

Exhibit Empty

**Which definitive plan should be recommended for Owen Mercer's right-lower-quadrant lesion after this interval reassessment?**

**key shown first for review only.**

- **KEY** Perform interval appendectomy with intact retrieval

  Persistent suspicious appendiceal imaging after an abscess in this fit older patient supports interval appendectomy. The free base and absence of established invasive cancer support obtaining an intact specimen before deciding on a larger oncologic operation.
- Continue surveillance with interval abdominal CT

  Normal cecal mucosa does not resolve the persistent appendiceal mural abnormality. In this older post-abscess patient with suspicious imaging, current conditional guidance favors interval appendectomy for tissue evaluation.
- Perform oncologic right hemicolectomy with nodes

  Right hemicolectomy fits an established invasive localized carcinoma. This record supplies a suspicious localized appendix lesion with a free base and definitive histology pending.

The colonoscopy evaluated the colonic lumen. The persistent appendiceal mural lesion still requires its own tissue assessment. In this fit older post-abscess patient, interval appendectomy with intact retrieval is the favored proposed plan. Definitive histology governs any subsequent oncologic extension.

Exact after hash `ede98c8eb47dfe0942aef603f39e40761591092564cbbe837267a14311e6db73`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Use the interval CT to resolve the lesion's appendiceal origin and free base, while limiting the normal colonoscopy result to the sampled colonic lumen.
- Apply Choose interval organ resection for definitive pathology, with the free base limiting the presently justified extent.
- Closest error Treat normal colonoscopy plus symptom resolution as permission to leave the persistent nodule under routine imaging surveillance.
- Deciding observation New interval localization to the retrocecal appendiceal tip with a free base, paired with normal cecal mucosa and definitive appendiceal histology pending.
- Consequence Occult appendiceal neoplasia can remain uncharacterized, or an unnecessarily large resection can be undertaken.
- Deletion test Deleting the update restores uncertain organ origin and an obscured base, so the specific limited operation cannot be justified from the earlier record. The repeat CT supplies the appendiceal compartment and actual clearance anatomy. Normal colonic mucosa is valid evidence about its sampled region. Deleting the persistent lesion would return the contested routine-interval policy.
- Counterfactual Replace the unresolved lesion with permanent evidence of invasive localized appendiceal adenocarcinoma. Right hemicolectomy becomes the best offered plan. Changed choice right-colectomy.
- Cue attack All choices are specific definitive management plans. The CT surveillance option has the same exact testing metadata as every offered CT. The key has comparable length to both alternatives. Normal colonoscopy is retained as meaningful evidence that can tempt a scope error.
- Stage and category Definitive elective plan after infection resolution and colonic assessment.
- Difficulty Predicted moderate to hard for PGY-2/3 from confusing sampled mucosa with appendiceal pathology and choosing either under-treatment or premature oncologic extent.
- One best answer The suspicious residual lesion, older age and fitness support interval appendectomy, while definitive invasive histology remains pending.
- Sequence The preceding explanation establishes the purpose of colonoscopy only. It supplies no interval operation. The earlier CT leaves origin and base anatomy unresolved, while this update adds actual organ localization and clearance anatomy alongside the normal mucosal result.
- Repair and repeat check The sequence deletion attack found that an initially supplied free base weakened the later update. Moved organ localization and base clearance into the acquired interval CT. Removed the normal-colonoscopy result from the task so the update earns that evidence. Re-solved all three plans without a blanket age cutoff or fixed interval.

Distractor attacks

- choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.surveillance.v1 ? Temptation Combine symptom resolution and normal colonoscopy into a complete exclusion of underlying neoplasia. Ranking Normal cecal mucosa does not resolve the persistent appendiceal mural abnormality. In this older post-abscess patient with suspicious imaging, current conditional guidance favors interval appendectomy for tissue evaluation. Counterfactual Prohibitive operative risk could favor a surveillance strategy after explicit multidisciplinary assessment of the residual uncertainty.
- choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.right-colectomy.v1 ? Temptation Treat every suspicious appendiceal lesion as an already proven invasive cancer. Ranking Right hemicolectomy fits an established invasive localized carcinoma. This record supplies a suspicious localized appendix lesion with a free base and definitive histology pending. Counterfactual Permanent tissue showing invasive localized adenocarcinoma would favor this oncologic extent.

Evidence claim.appendix-appendicitis.interval-tissue-evaluation, claim.appendix-appendicitis.intact-abnormal-appendix, claim.appendix-appendicitis.adenocarcinoma-colectomy, claim.appendix-appendicitis.post-abscess-neoplasm.

Identity New gap objective. The held general younger-adult interval policy remains separate from this older patient with persistent suspicious imaging.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.post-abscess-lesion.v1",
  "nodeId": "node.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1",
  "classification": {
    "kind": "test_choices",
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.surveillance.v1",
        "choiceLabel": "Continue surveillance with interval abdominal CT",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.interval-appendectomy.v1",
        "choiceLabel": "Perform interval appendectomy with intact retrieval",
        "timing": {
          "kind": "no_test"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-abscess-interval-appendectomy.right-colectomy.v1",
        "choiceLabel": "Perform oncologic right hemicolectomy with nodes",
        "timing": {
          "kind": "no_test"
        }
      }
    ]
  }
}
```

Earlier visible context and possible feedback

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.post-abscess-colonic-evaluation.v1",
    "task": "Which investigation should be completed before planning resection of {patientName}'s persistent right-lower-quadrant lesion?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "Resolution of an appendiceal abscess leaves an underlying-neoplasm question in this older adult with a persistent nodule. Colonoscopy examines the colon for synchronous disease relevant to resection planning.",
    "allPossibleChoiceFeedback": [
      {
        "label": "CT-guided core biopsy of the appendiceal nodule",
        "rationale": "A needle sample targets the appendiceal lesion but supplies limited tissue and leaves synchronous colonic disease unexamined. Current guidance supports colonoscopy in this preoperative setting."
      },
      {
        "label": "Contrast-enhanced abdominal and pelvic CT",
        "rationale": "The available interval CT has already mapped a resolved collection and a persistent focal lesion. With infection clinically resolved, repeating that acquisition leaves the required colonic assessment outstanding."
      },
      {
        "label": "Colonoscopy with examination of the cecum",
        "rationale": "The older post-abscess patient with a persistent appendiceal abnormality warrants evaluation for neoplasia. Colonoscopy assesses synchronous colonic lesions that can alter resection planning."
      }
    ]
  }
]
```

#### question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1

Case `case.topic.appendix-appendicitis.incidental-mucinous-lesion.v1`. Node `node.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1`. Concept `concept.appendix-appendicitis.incidental-lesion-intact-resection.v1`.

Before Empty (new gap question).

Retirement/replacement inputs inventory.46eca681a5657da1.

Leah Foster, 54, Female. Complaint **Operative findings review**.

Leah Foster, a 54-year-old woman, attends the clinic to review a proposed operative plan after diagnostic laparoscopy for persistent abdominal symptoms. The hospital record describes a smooth, distended appendiceal body and tip. The base has a narrow segment of normal-appearing tissue, and the appendix separates from the cecum. Its wall is intact, and inspection shows no peritoneal mucin or implants. Definitive pathology is pending.

Current update Empty

Exhibit Empty

**Which initial resection should be recommended for Leah Foster's appendiceal lesion on these operative findings?**

**key shown first for review only.**

- **KEY** Appendectomy

  The free normal-appearing base permits limited intact removal. Avoiding rupture preserves the represented localized disease state while permanent pathology determines any further operation.
- Right hemicolectomy

  This extent is appropriate for an established invasive localized carcinoma. The observed dilated appendix with a free base still requires definitive whole-specimen classification.
- Partial cecectomy

  A cecal cuff can obtain clearance when the appendiceal base is involved. The record describes a separable appendix with a normal base segment available for intact removal.

The involved segment and the free base determine the initial resection field. Intact appendectomy can provide definitive whole-specimen assessment here. Avoiding rupture matters when the dilation represents a mucinous lesion, and permanent histology guides any oncologic extension.

Exact after hash `41fd48059e8678dba2c037dd311762f5cd860a61be42da0f0e88952725213f01`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Identify a potentially mucinous appendiceal lesion whose base is physically free and whose disease appears localized.
- Apply Choose an intact limited specimen operation while reserving cancer-specific extent for definitive pathology.
- Closest error Remove a cecal cuff simply because the appendix is dilated.
- Deciding observation A normal-appearing base segment and separability from the cecum, with intact wall and no peritoneal disease.
- Consequence Unnecessary bowel resection or rupture with loss of the localized operative state.
- Deletion test The base anatomy changes appendectomy versus partial cecectomy. The wall and peritoneal observations distinguish a localized intact-resection problem. The pending permanent diagnosis prevents treating suspected tumor as proven invasive carcinoma.
- Counterfactual Move gross involvement into the appendiceal base while keeping disease localized. A partial cecal resection becomes the best offered limited-clearance operation. Changed choice cecal-cuff.
- Cue attack Three concise named operations compare extent at the same stage. Removed normal-base wording from the keyed label so the answer requires interpreting the base anatomy. Removed a pre-answer instruction to avoid rupture and retained the operative observations that make intact removal relevant.
- Stage and category Initial operative resection extent for an incidentally abnormal appendix.
- Difficulty Predicted moderate for PGY-2/3 from confusing possible tumor type with current anatomic extent or escalating before permanent pathology.
- One best answer The supplied normal base permits an intact appendectomy, while permanent histologic classification is pending.
- Sequence First node reveals no final grade or margin result. Feedback explains initial extent without teaching how to manage a microscopic positive LAMN margin.
- Repair and repeat check Replaced a remove-versus-ignore safety item with three plausible resection extents. A second cue pass removed normal-base wording from the key and used concise parallel operation names. Re-solved the involved-base counterfactual.

Distractor attacks

- choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.right-colectomy.v1 ? Temptation Use a possible mucinous neoplasm to justify immediate oncologic colectomy. Ranking This extent is appropriate for an established invasive localized carcinoma. The observed dilated appendix with a free base still requires definitive whole-specimen classification. Counterfactual Established invasive adenocarcinoma confined to the regional field would support oncologic right colectomy.
- choice.topic.appendix-appendicitis.incidental-lesion-intact-resection.cecal-cuff.v1 ? Temptation Take extra cecum to compensate for uncertainty about the lesion's histology. Ranking A cecal cuff can obtain clearance when the appendiceal base is involved. The record describes a separable appendix with a normal base segment available for intact removal. Counterfactual Gross involvement at the base, with otherwise localized disease, could justify limited cecal resection for clearance.

Evidence claim.appendix-appendicitis.intact-abnormal-appendix, claim.appendix-appendicitis.adenocarcinoma-colectomy.

Identity New anatomy-to-operative-extent objective in the assigned appendiceal-lesion scope.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.incidental-mucinous-lesion.v1",
  "nodeId": "node.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1",
  "classification": {
    "kind": "no_test"
  }
}
```

#### question.topic.appendix-appendicitis.lamn-microscopic-margin.v1

Case `case.topic.appendix-appendicitis.incidental-mucinous-lesion.v1`. Node `node.topic.appendix-appendicitis.lamn-microscopic-margin.v1`. Concept `concept.appendix-appendicitis.lamn-microscopic-margin.v1`.

Before Empty (new gap question).

Retirement/replacement inputs Empty.

Leah Foster, 54, Female. Complaint **Operative findings review**.

Leah Foster, a 54-year-old woman, attends the clinic to review a proposed operative plan after diagnostic laparoscopy for persistent abdominal symptoms. The hospital record describes a smooth, distended appendiceal body and tip. The base has a narrow segment of normal-appearing tissue, and the appendix separates from the cecum. Its wall is intact, and inspection shows no peritoneal mucin or implants. Definitive pathology is pending.

Current update At later follow-up, Leah Foster's intact appendix has undergone expert permanent review. The complete specimen shows a low-grade appendiceal mucinous neoplasm with no infiltrative invasion. Low-grade mucinous epithelium reaches the microscopic base margin. The surgeon documented removal of all gross disease, an intact wall and no peritoneal mucin. Postoperative imaging shows no residual mass.

Exhibit Empty

**Which additional-resection plan should be recommended for Leah Foster after this permanent pathology review?**

**key shown first for review only.**

- **KEY** Observe after the completed appendiceal resection

  For a macroscopically complete, nonperforated LAMN with no peritoneal disease, limited data support observation despite microscopic margin involvement.
- Re-excise the cecal staple line with a cecal cuff

  Local re-excision treats a residual-clearance problem. The represented lesion is completely removed macroscopically and nonperforated. Limited ASCRS-reviewed data support observation for microscopic margin involvement in this specific LAMN setting.
- Perform right hemicolectomy with regional nodes

  An invasive localized adenocarcinoma would support nodal-basin resection. The fully examined specimen shows noninfiltrative low-grade mucinous disease.

The margin result must be interpreted with the tumor's noninfiltrative biology, gross completeness and intact wall. The ASCRS 2025 guideline reviews limited data supporting observation after complete nonperforated LAMN removal despite a microscopic positive margin. Surveillance planning remains a separate clinician decision.

Exact after hash `f38ec80fb65b5ae0e9f4542b29e6c0395d54fd5c83abbb25da77b7c4c48d3ddb`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Integrate the microscopic margin with complete permanent sampling, noninfiltrative LAMN and absence of rupture or gross residual disease.
- Apply Use the specific LAMN margin evidence to choose observation over reflex local or regional resection.
- Closest error Schedule cecal re-excision for every positive microscopic appendectomy margin.
- Deciding observation Microscopic low-grade epithelium at the margin within a macroscopically complete, nonperforated LAMN resection.
- Consequence An additional bowel operation can be performed without a supported residual-disease indication.
- Deletion test Removing gross completeness makes local re-excision plausible. Removing full permanent review or intact-wall documentation erases the narrow evidence boundary. Postoperative imaging supplies the residual-mass assessment.
- Counterfactual Replace microscopic-only involvement with a documented gross residual base lesion. Local cecal re-excision becomes the best offered clearance plan, subject to its definitive histology. Changed choice cecal-cuff.
- Cue attack Three specific additional-resection policies are offered. The key is the shortest and uses the same action form. The full specimen and intact-wall findings are necessary eligibility evidence. The task avoids stating an indolent-tumor rule before the answer.
- Stage and category Need for further resection after complete operative and permanent pathology review.
- Difficulty Predicted hard for PGY-2/3 because the familiar positive-margin rule competes with a narrow LAMN-specific exception supported by limited data.
- One best answer Observation is the supported proposed key within the exact nonperforated, grossly complete LAMN boundary. Melissa must confirm the clinical ranking against local re-excision.
- Sequence The earlier node addresses initial anatomic resection. Its feedback never mentions microscopic margins or the observation policy tested here. The new expert report is essential.
- Repair and repeat check Removed a generic reassurance phrase from the presentation. Added whole-specimen provenance and the surgeon's gross-completeness record, then repeated the counterfactual against residual base disease.

Distractor attacks

- choice.topic.appendix-appendicitis.lamn-microscopic-margin.cecal-cuff.v1 ? Temptation Apply a general positive-margin rule without considering LAMN biology and gross completeness. Ranking Local re-excision treats a residual-clearance problem. The represented lesion is completely removed macroscopically and nonperforated. Limited ASCRS-reviewed data support observation for microscopic margin involvement in this specific LAMN setting. Counterfactual Documented gross residual appendiceal-base lesion would create a local clearance indication for further resection.
- choice.topic.appendix-appendicitis.lamn-microscopic-margin.right-colectomy.v1 ? Temptation Treat any appendiceal neoplasm with a positive microscopic margin as invasive cancer. Ranking An invasive localized adenocarcinoma would support nodal-basin resection. The fully examined specimen shows noninfiltrative low-grade mucinous disease. Counterfactual Expert permanent review identifying invasive localized adenocarcinoma would support right hemicolectomy.

Evidence claim.appendix-appendicitis.lamn-margin, claim.appendix-appendicitis.lamn-versus-invasive, claim.appendix-appendicitis.adenocarcinoma-colectomy, claim.appendix-appendicitis.intact-abnormal-appendix.

Identity New pathology-and-clearance objective. It must retain a separate identity from invasive adenocarcinoma completion colectomy.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.incidental-mucinous-lesion.v1",
  "nodeId": "node.topic.appendix-appendicitis.lamn-microscopic-margin.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.lamn-microscopic-margin.v1",
  "classification": {
    "kind": "no_test"
  }
}
```

Earlier visible context and possible feedback

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.incidental-lesion-intact-resection.v1",
    "task": "Which initial resection should be recommended for {patientName}'s appendiceal lesion on these operative findings?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The involved segment and the free base determine the initial resection field. Intact appendectomy can provide definitive whole-specimen assessment here. Avoiding rupture matters when the dilation represents a mucinous lesion, and permanent histology guides any oncologic extension.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Right hemicolectomy",
        "rationale": "This extent is appropriate for an established invasive localized carcinoma. The observed dilated appendix with a free base still requires definitive whole-specimen classification."
      },
      {
        "label": "Appendectomy",
        "rationale": "The free normal-appearing base permits limited intact removal. Avoiding rupture preserves the represented localized disease state while permanent pathology determines any further operation."
      },
      {
        "label": "Partial cecectomy",
        "rationale": "A cecal cuff can obtain clearance when the appendiceal base is involved. The record describes a separable appendix with a normal base segment available for intact removal."
      }
    ]
  }
]
```

#### question.topic.appendix-appendicitis.peritoneal-mucin-referral.v1

Case `case.topic.appendix-appendicitis.peritoneal-mucin.v1`. Node `node.topic.appendix-appendicitis.peritoneal-mucin-referral.v1`. Concept `concept.appendix-appendicitis.low-grade-peritoneal-disease-referral.v1`.

Before Empty (new gap question).

Retirement/replacement inputs Empty.

Marcus Reed, 57, Male. Complaint **Increasing abdominal girth**.

Marcus Reed, a 57-year-old man, attends the clinic after appendectomy pathology identified a low-grade mucinous neoplasm with a wall defect. His abdominal girth has continued to increase. CT shows mucinous-appearing material across the pelvis and upper abdomen with scalloping of the liver surface. A peritoneal implant biopsy contains low-grade mucinous epithelium. He remains active, without bowel obstruction or solid-organ metastases.

Current update Empty

Exhibit Empty

**Which treatment referral should be recommended now for Marcus Reed's appendiceal mucinous disease?**

**key shown first for review only.**

- **KEY** Peritoneal surgery for cytoreduction and HIPEC review

  Cellular low-grade mucin outside the appendix and broad peritoneal distribution support assessment for cytoreduction and intraperitoneal treatment. Specialist review determines resectability and the appropriate treatment components.
- Medical oncology for initial systemic chemotherapy

  Systemic treatment can be important in high-grade, unresectable or selected metastatic epithelial disease. This fit patient has low-grade mucinous peritoneal disease, for which a peritoneal-surface surgical assessment addresses the represented treatment field.
- Colorectal surgery for completion right hemicolectomy

  A right colectomy addresses a regional bowel and nodal field. The represented low-grade mucinous disease occupies multiple peritoneal regions, which require a peritoneal-surface treatment assessment.

The implant contains neoplastic epithelium and the imaging maps disease across the peritoneum. This fit patient needs a peritoneal-surface surgical assessment for cytoreduction and possible HIPEC. The final treatment depends on resectability, distribution and specialist review.

Exact after hash `1349c44e06163fc9bc90a14ca36b41bbfa0459fcd9e92dbaff4d5be385fe0374`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Use sampled epithelial cells to establish cellular peritoneal disease and the scan to map its distribution beyond a regional bowel field.
- Apply Select the service that evaluates cytoreduction and intraperitoneal therapy for low-grade peritoneal disease.
- Closest error Recommend a standard completion right colectomy for every appendiceal neoplasm.
- Deciding observation Low-grade epithelium in a peritoneal implant together with disease spanning the pelvis and upper abdomen.
- Consequence A regional operation can leave the consequential peritoneal disease unaddressed.
- Deletion test The implant biopsy distinguishes cellular disease from an uncharacterized fluid finding. Distribution determines the treatment field. Activity, obstruction status and solid-organ staging delimit a planned specialist treatment discussion.
- Counterfactual Replace the peritoneal findings with localized invasive appendiceal adenocarcinoma and completed negative distant staging. The colorectal referral for right hemicolectomy becomes appropriate. Changed choice colorectal-service.
- Cue attack All options are named service referrals for a specified treatment. Each has a comparable service-plus-plan structure. The task avoids a request for a peritoneal procedure. Raw imaging and sampled histology must jointly determine the field and biology.
- Stage and category Definitive oncology treatment referral after tissue and cross-sectional characterization.
- Difficulty Predicted moderate to hard for PGY-2/3 from choosing between regional colectomy, systemic treatment and a peritoneal-surface operation.
- One best answer The supplied low-grade cellular peritoneal disease and fitness support specialist cytoreduction/HIPEC assessment. Actual operability remains for that assessment.
- Sequence Standalone case. No preceding margin or colectomy explanation is visible and no later node is rehearsed.
- Repair and repeat check Replaced a single diagnostic-label question with a service-and-treatment-field decision. Added actual implant provenance so presumed mucin on imaging does not carry the diagnosis by itself.

Distractor attacks

- choice.topic.appendix-appendicitis.peritoneal-mucin-referral.medical-oncology.v1 ? Temptation Treat all dissemination as a reason to begin systemic chemotherapy. Ranking Systemic treatment can be important in high-grade, unresectable or selected metastatic epithelial disease. This fit patient has low-grade mucinous peritoneal disease, for which a peritoneal-surface surgical assessment addresses the represented treatment field. Counterfactual High-grade unresectable disease or solid-organ metastases could favor a systemic-treatment pathway after multidisciplinary assessment.
- choice.topic.appendix-appendicitis.peritoneal-mucin-referral.colorectal-service.v1 ? Temptation Transfer the localized appendiceal-cancer completion operation to disseminated mucinous disease. Ranking A right colectomy addresses a regional bowel and nodal field. The represented low-grade mucinous disease occupies multiple peritoneal regions, which require a peritoneal-surface treatment assessment. Counterfactual Nonmetastatic invasive appendiceal adenocarcinoma would support referral for oncologic right colectomy.

Evidence claim.appendix-appendicitis.peritoneal-mucin-treatment, claim.appendix-appendicitis.adenocarcinoma-colectomy.

Identity New treatment-field objective. It is separate from local LAMN margin management and regional invasive-cancer resection.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.peritoneal-mucin.v1",
  "nodeId": "node.topic.appendix-appendicitis.peritoneal-mucin-referral.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.peritoneal-mucin-referral.v1",
  "classification": {
    "kind": "no_test"
  }
}
```

#### question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1

Case `case.topic.appendix-appendicitis.goblet-cell-pathology.v1`. Node `node.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1`. Concept `concept.appendix-appendicitis.goblet-cell-adenocarcinoma-resection.v1`.

Before Empty (new gap question).

Retirement/replacement inputs Empty.

Elena Brooks, 49, Female. Complaint **Appendectomy pathology review**.

Elena Brooks, a 49-year-old woman, attends the clinic after appendectomy. The outside report called a 1.4-cm lesion a goblet cell carcinoid. Expert permanent review of the complete specimen describes infiltrative clusters of mucin-filled goblet cells in the appendiceal wall, with focal synaptophysin staining. The base margin is clear. CT shows no peritoneal or distant lesions, colonoscopy shows no separate colonic lesion, and she is fit for surgery.

Current update Empty

Exhibit Empty

**Which further surgical plan should be recommended for Elena Brooks's appendiceal tumor after expert pathology review?**

**key shown first for review only.**

- **KEY** Perform right hemicolectomy with regional nodes

  The definitive infiltrative goblet cell adenocarcinoma diagnosis governs the plan. Current ASCRS guidance includes this tumor in the localized appendiceal adenocarcinoma recommendation for oncologic right colectomy.
- Complete surgical treatment with the appendectomy

  A small favorable well-differentiated NET can have a limited surgical field. Expert review has established infiltrative goblet cell adenocarcinoma, which follows the adenocarcinoma pathway.
- Re-excise the appendiceal base with a cecal cuff

  The clear base margin already addresses local clearance. A cecal cuff would leave the regional nodal question created by the adenocarcinoma diagnosis unresolved.

The expert permanent diagnosis supersedes the historical carcinoid terminology. Goblet cell adenocarcinoma follows an adenocarcinoma treatment pathway despite focal neuroendocrine staining. With localized staging and fitness for surgery, oncologic right hemicolectomy addresses the regional nodes.

Exact after hash `be6d7bef737da99cfa09b9ac5b9a6ef42bc59a37ed1394ddd158cabb5a6ce0ab`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Recognize an infiltrative goblet-cell epithelial tumor on the complete permanent specimen despite historical carcinoid terminology and focal neuroendocrine staining.
- Apply Choose the localized adenocarcinoma resection pathway despite the small size and clear local margin.
- Closest error Apply small-NET surgical rules because the original report used carcinoid.
- Deciding observation Complete permanent sampling shows infiltrative mucin-filled goblet-cell clusters, with focal synaptophysin expression.
- Consequence A clinically distinct invasive epithelial cancer receives an inadequate regional surgical plan.
- Deletion test Historical terminology, size and staining each establish the competing NET interpretation. Definitive review resolves it. Staging and fitness delimit the completion-operation recommendation. The clear margin distinguishes local from nodal completion.
- Counterfactual Replace expert review with a completely removed 0.7-cm grade-1 well-differentiated NET without unfavorable features. Complete treatment with appendectomy becomes the appropriate offered surgical plan. Changed choice completed-resection.
- Cue attack Three specific surgical-extent choices share the same task. The current report supplies morphology while withholding the updated tumor label, so the historical carcinoid wording requires reinterpretation. The key carries no unique counseling or caution qualifier.
- Stage and category Completion surgical extent after definitive pathology and staging.
- Difficulty Predicted moderate to hard for PGY-2/3 because a familiar small-carcinoid rule competes with updated tumor identity.
- One best answer The infiltrative goblet-cell epithelial morphology and localized stage favor the adenocarcinoma nodal-resection pathway.
- Sequence Standalone case. The learner has no earlier NET or colectomy explanation in the visible encounter.
- Repair and repeat check Removed an immunostain-only classification task. A second pass also removed the explicit updated diagnosis from the presentation, retaining complete permanent morphology and the concrete surgical consequence. Re-solved the small favorable NET counterfactual.

Distractor attacks

- choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.completed-resection.v1 ? Temptation Anchor on the old carcinoid label, small measured size and focal neuroendocrine stain. Ranking A small favorable well-differentiated NET can have a limited surgical field. Expert review has established infiltrative goblet cell adenocarcinoma, which follows the adenocarcinoma pathway. Counterfactual A completely removed subcentimeter well-differentiated NET without unfavorable features would support completed appendectomy.
- choice.topic.appendix-appendicitis.goblet-cell-oncologic-resection.cecal-cuff.v1 ? Temptation Treat further surgery as a local-margin operation after a small appendiceal tumor. Ranking The clear base margin already addresses local clearance. A cecal cuff would leave the regional nodal question created by the adenocarcinoma diagnosis unresolved. Counterfactual Gross localized base involvement of an unclassified appendiceal lesion could require limited cecal resection for clearance.

Evidence claim.appendix-appendicitis.goblet-cell-identity, claim.appendix-appendicitis.adenocarcinoma-colectomy, claim.appendix-appendicitis.intact-abnormal-appendix, claim.appendix-appendicitis.small-favorable-net-resection.

Identity New histologic-identity-to-treatment objective. It preserves a distinct construct from well-differentiated appendiceal NET size decisions.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.goblet-cell-pathology.v1",
  "nodeId": "node.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.goblet-cell-oncologic-resection.v1",
  "classification": {
    "kind": "no_test"
  }
}
```

#### question.topic.appendix-appendicitis.net-receptor-staging.v1

Case `case.topic.appendix-appendicitis.net-staging.v1`. Node `node.topic.appendix-appendicitis.net-receptor-staging.v1`. Concept `concept.appendix-appendicitis.net-indeterminate-metastases-staging.v1`.

Before Empty (new gap question).

Retirement/replacement inputs Empty.

Isaac Palmer, 41, Male. Complaint **Appendiceal tumor review**.

Isaac Palmer, a 41-year-old man, attends the clinic after appendectomy identified a 2.6-cm well-differentiated grade-1 neuroendocrine tumor. The base margin is clear. Staging CT describes two small liver lesions that remain indeterminate on its acquired phases. The chest has no suspicious lesion. He is fit for further surgery.

Current update Empty

Exhibit Empty

**Which functional imaging study should next complete Isaac Palmer's appendiceal tumor staging?**

**key shown first for review only.**

- **KEY** 68Ga-DOTATATE PET/CT

  The well-differentiated NET and unresolved possible metastatic lesions create a receptor-imaging indication. Ga-DOTA PET/CT can add staging information and has higher sensitivity than older receptor scintigraphy.
- 18F-FDG PET/CT

  The supplied tumor is well differentiated. Current ASCRS guidance favors somatostatin-receptor PET/CT over FDG PET/CT for detecting disease in this setting.
- 111In-pentetreotide scintigraphy

  Older somatostatin-receptor scintigraphy targets a relevant pathway but has largely been replaced by more sensitive Ga-DOTA PET/CT when the latter is available.

The lesion is a well-differentiated NET and the CT leaves possible metastatic disease unresolved. Somatostatin-receptor PET/CT can clarify staging in this situation. ASCRS describes Ga-DOTA PET/CT as more sensitive than older receptor scintigraphy for well-differentiated NET assessment.

Exact after hash `54085a4df70cad46a8b646ed9c27c6603bf43118a1b37e25d98c494f451c3716`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Identify well-differentiated NET biology and distinguish an indeterminate liver result from either established metastasis or adequate negative staging.
- Apply Choose the current receptor-targeted functional imaging method to resolve the staging question.
- Closest error Choose FDG PET/CT because the patient has cancer, or choose older receptor scintigraphy without comparing its current role.
- Deciding observation Grade-1 well-differentiated NET with possible liver involvement unresolved by the acquired CT phases.
- Consequence The residual metastatic question can be staged with a less appropriate functional technique before further surgery.
- Deletion test Grade and differentiation determine the biologic target. Indeterminate liver lesions establish the need for additional staging. Tumor size keeps the case inside the guideline's explicit higher-risk imaging scope. Clear base margin preserves a competing assumption of completed local surgery.
- Counterfactual Make receptor PET/CT unavailable while preserving the well-differentiated tumor and staging uncertainty. Older somatostatin-receptor scintigraphy becomes the relevant offered alternative after specialist review. Changed choice pentetreotide.
- Cue attack All three options are functional nuclear studies with complete test estimates. The task says functional imaging without naming a receptor. The key is neither longest nor the sole specific modality. The grade and unresolved liver findings earn the inference.
- Stage and category Functional staging study after cross-sectional imaging.
- Difficulty Predicted moderate for PGY-2/3 from confusing generic FDG staging with receptor-targeted NET staging and comparing current with older receptor imaging.
- One best answer In the ordinary available-modality comparison, Ga-DOTA PET/CT best matches well-differentiated NET staging. The resource counterfactual changes that comparison explicitly.
- Sequence First node has no receptor study result or surgical recommendation in the visible context. Its feedback avoids the right-colectomy size rule tested later.
- Repair and repeat check Removed a generic PET-versus-no-imaging choice. Used three real functional studies, retained the actual CT uncertainty and removed a pre-answer receptor-availability sentence.

Distractor attacks

- choice.topic.appendix-appendicitis.net-receptor-staging.fdg.v1 ? Temptation Apply a general metabolically active cancer-staging strategy to every appendiceal malignancy. Ranking The supplied tumor is well differentiated. Current ASCRS guidance favors somatostatin-receptor PET/CT over FDG PET/CT for detecting disease in this setting. Counterfactual A different, poorly differentiated or high-grade cancer biology can create an FDG-staging question. Exact use in that setting needs its own supported item.
- choice.topic.appendix-appendicitis.net-receptor-staging.pentetreotide.v1 ? Temptation Choose the familiar older receptor study without comparing its current role with PET-based receptor imaging. Ranking Older somatostatin-receptor scintigraphy targets a relevant pathway but has largely been replaced by more sensitive Ga-DOTA PET/CT when the latter is available. Counterfactual Receptor PET/CT unavailability could support specialist use of the older receptor study. That resource-constrained ranking is outside the present unconstrained comparison.

Evidence claim.appendix-appendicitis.net-functional-staging.

Identity New staging objective distinct from the subsequent resection-extent decision.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.net-staging.v1",
  "nodeId": "node.topic.appendix-appendicitis.net-receptor-staging.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.net-receptor-staging.v1",
  "classification": {
    "kind": "test_choices",
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.net-receptor-staging.fdg.v1",
        "choiceLabel": "18F-FDG PET/CT",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.pet_ct"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.net-receptor-staging.dotatate.v1",
        "choiceLabel": "68Ga-DOTATATE PET/CT",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.pet_ct"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.net-receptor-staging.pentetreotide.v1",
        "choiceLabel": "111In-pentetreotide scintigraphy",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.nuclear_imaging"
        }
      }
    ]
  }
}
```

#### question.topic.appendix-appendicitis.net-regional-resection.v1

Case `case.topic.appendix-appendicitis.net-staging.v1`. Node `node.topic.appendix-appendicitis.net-regional-resection.v1`. Concept `concept.appendix-appendicitis.large-net-regional-resection.v1`.

Before Empty (new gap question).

Retirement/replacement inputs Empty.

Isaac Palmer, 41, Male. Complaint **Appendiceal tumor review**.

Isaac Palmer, a 41-year-old man, attends the clinic after appendectomy identified a 2.6-cm well-differentiated grade-1 neuroendocrine tumor. The base margin is clear. Staging CT describes two small liver lesions that remain indeterminate on its acquired phases. The chest has no suspicious lesion. He is fit for further surgery.

Current update At later follow-up, Isaac Palmer's completed liver characterization shows simple cysts, and the multidisciplinary staging review finds no distant disease. The permanent appendix specimen confirms a 2.6-cm well-differentiated NET with a clear base margin. The appendectomy included the mesoappendix, and he remains fit for surgery.

Exhibit Empty

**Which further surgical plan should be recommended for Isaac Palmer's localized 2.6-cm appendiceal NET?**

**key shown first for review only.**

- **KEY** Perform right hemicolectomy with regional nodes

  For a fit patient with a nonmetastatic appendiceal NET larger than 2 cm, ASCRS guidance supports right hemicolectomy to address the regional nodal basin despite the clear appendectomy margin.
- Complete surgical treatment with the appendectomy

  A clear local margin and mesoappendix removal establish the appendectomy field. The tumor exceeds the directly supported 2-cm size boundary for recommending regional right hemicolectomy.
- Re-excise the appendiceal base with a cecal cuff

  A cecal cuff addresses local clearance. This tumor has a clear base margin, while its size makes the regional nodal field consequential.

Completed staging establishes a localized surgical problem. The clear base margin addresses local clearance, while the 2.6-cm tumor exceeds the ASCRS greater-than-2-cm boundary for right hemicolectomy with regional nodal assessment.

Exact after hash `288580d5e747a790d2be4ea2d47b7cdc0e663f3f6ffb2c608f088585a0dbb81e`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Read completed staging as localized disease and a clear base margin as evidence about the local appendectomy field.
- Apply Apply the directly sourced greater-than-2-cm boundary to the regional nodal operation.
- Closest error End surgery because the base margin is clear and the mesoappendix was included.
- Deciding observation A confirmed 2.6-cm NET with no distant disease in a fit patient.
- Consequence The regional nodal basin receives neither the recommended resection nor its staging assessment.
- Deletion test Without completed staging, the definitive treatment field remains unresolved. Without tumor size, the recommendation enters the controversial intermediate range. The clear margin and mesoappendix record make completed appendectomy a credible competing plan.
- Counterfactual Change the primary to a completely removed 0.7-cm well-differentiated NET with no unfavorable features. Completed appendectomy becomes the best offered surgical plan. Changed choice completed-resection.
- Cue attack Three specific surgical extents are compared. The question supplies the known diagnosis because operative extent is scored. No option is a generic discussion plan. The key has comparable length and no unique caution language. Clinical size recall remains part of the inference.
- Stage and category Regional surgical extent after permanent pathology and completed staging.
- Difficulty Predicted moderate for PGY-2/3 from confusing local clearance with regional oncologic adequacy. Independent review should scrutinize whether the size rule is sufficiently discriminating.
- One best answer The directly supported size boundary and localized staging support right hemicolectomy. The intermediate-size controversy is outside the supplied measurements.
- Sequence The preceding functional-imaging feedback discusses receptor staging only. This update supplies the actual completed staging result needed to choose the operative field.
- Repair and repeat check Replaced a size-threshold label question with a local-versus-regional completion plan. Kept the exact sourced boundary and added the completed local-field record for the closest error.

Distractor attacks

- choice.topic.appendix-appendicitis.net-regional-resection.completed-resection.v1 ? Temptation Equate a margin-negative appendectomy with adequate regional treatment regardless of tumor size. Ranking A clear local margin and mesoappendix removal establish the appendectomy field. The tumor exceeds the directly supported 2-cm size boundary for recommending regional right hemicolectomy. Counterfactual A completely removed subcentimeter NET without unfavorable features can be adequately treated by appendectomy including the mesoappendix.
- choice.topic.appendix-appendicitis.net-regional-resection.cecal-cuff.v1 ? Temptation Treat completion surgery as a wider local-margin operation. Ranking A cecal cuff addresses local clearance. This tumor has a clear base margin, while its size makes the regional nodal field consequential. Counterfactual A different localized lesion involving the base could call for a cecal cuff to obtain initial gross clearance. A margin-positive appendiceal NET requires its own oncologic review.

Evidence claim.appendix-appendicitis.net-resection, claim.appendix-appendicitis.intact-abnormal-appendix, claim.appendix-appendicitis.small-favorable-net-resection.

Identity New regional-resection objective. The separate functional-staging concept retains its own identity and scheduling history.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.net-staging.v1",
  "nodeId": "node.topic.appendix-appendicitis.net-regional-resection.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.net-regional-resection.v1",
  "classification": {
    "kind": "no_test"
  }
}
```

Earlier visible context and possible feedback

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.net-receptor-staging.v1",
    "task": "Which functional imaging study should next complete {patientName}'s appendiceal tumor staging?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The lesion is a well-differentiated NET and the CT leaves possible metastatic disease unresolved. Somatostatin-receptor PET/CT can clarify staging in this situation. ASCRS describes Ga-DOTA PET/CT as more sensitive than older receptor scintigraphy for well-differentiated NET assessment.",
    "allPossibleChoiceFeedback": [
      {
        "label": "18F-FDG PET/CT",
        "rationale": "The supplied tumor is well differentiated. Current ASCRS guidance favors somatostatin-receptor PET/CT over FDG PET/CT for detecting disease in this setting."
      },
      {
        "label": "68Ga-DOTATATE PET/CT",
        "rationale": "The well-differentiated NET and unresolved possible metastatic lesions create a receptor-imaging indication. Ga-DOTA PET/CT can add staging information and has higher sensitivity than older receptor scintigraphy."
      },
      {
        "label": "111In-pentetreotide scintigraphy",
        "rationale": "Older somatostatin-receptor scintigraphy targets a relevant pathway but has largely been replaced by more sensitive Ga-DOTA PET/CT when the latter is available."
      }
    ]
  }
]
```

#### question.topic.appendix-appendicitis.postoperative-infection-imaging.v1

Case `case.topic.appendix-appendicitis.postoperative-source-control.v1`. Node `node.topic.appendix-appendicitis.postoperative-infection-imaging.v1`. Concept `concept.appendix-appendicitis.postoperative-deep-infection-imaging.v1`.

Before Empty (new gap question).

Retirement/replacement inputs inventory.f6a91b1684ea0b16.

Maya Collins, 35, Female. Complaint **Pain after appendectomy**.

Maya Collins, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.

Current update Empty

Exhibit Empty

**Which investigation should the acute-care team obtain next for Maya Collins's renewed symptoms after appendectomy?**

**key shown first for review only.**

- **KEY** Contrast-enhanced abdominal and pelvic CT

  The recovery-then-deterioration pattern raises a deep intra-abdominal source question. Intravenous contrast-enhanced CT maps collections and their relation to bowel for subsequent source-control planning.
- Targeted ultrasound of the abdominal port sites

  A focused superficial study could assess a localized port-site collection. The represented fever and deep pelvic symptoms require examination of the intra-abdominal field.
- Upright and supine abdominal radiographs

  Radiographs can depict a bowel-gas pattern but provide limited characterization of an intra-abdominal infectious source. The renewed fever and deep pain make source mapping consequential.

The return of fever and deep pelvic pain after initial recovery raises concern for a postoperative intra-abdominal source. CT with intravenous contrast maps the source and the anatomy needed for a treatment plan. A focused port study and plain films examine narrower targets.

Exact after hash `313a6e9219eb4cd56d9c15d6420172d15d5cd44f1cd9a55b21b4d16080e440c1`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Read renewed fever after initial recovery and deep pelvic symptoms as a source-localization problem despite distension and reassuring incisions.
- Apply Choose contrast-enhanced cross-sectional assessment of the entire relevant postoperative field.
- Closest error Request abdominal radiographs for distension and assume the rest of the postoperative course is expected ileus.
- Deciding observation New fever and deep pelvic pain after eating had resumed.
- Consequence A deep collection or ongoing source remains uncharacterized and source control is delayed.
- Deletion test Recovery followed by deterioration changes the interpretation of distension. Symptom depth and incision observations distinguish the imaging target. Stability, pregnancy status and contrast history delimit this CT comparison.
- Counterfactual Replace the deep inflammatory course with an isolated tender erythematous port-site mass and otherwise reassuring abdominal recovery. Targeted port-site ultrasound becomes the appropriate offered investigation. Changed choice port-ultrasound.
- Cue attack All three choices are real investigations and carry test estimates. The task avoids naming an abscess or CT. The negative incision observation localizes the clinical question, while the distension provides the credible radiograph temptation. The key is shorter than the port-site option.
- Stage and category Current investigation of renewed postoperative symptoms.
- Difficulty Predicted moderate for PGY-2/3 from mistaking the renewed inflammatory course for uncomplicated ileus or a superficial wound problem.
- One best answer Stable physiology permits cross-sectional localization, and the represented deep inflammatory problem calls for abdominal and pelvic source mapping.
- Sequence First node includes no collection measurement, drainage route or antibiotic endpoint. Those findings are revealed only in later updates.
- Repair and repeat check Replaced an abscess-diagnosis giveaway with a trajectory-and-target imaging task. Removed a sentence announcing the missing CT and supplied contrast-related context without a numeric cutoff.

Distractor attacks

- choice.topic.appendix-appendicitis.postoperative-infection-imaging.port-ultrasound.v1 ? Temptation Attribute postoperative infection to the incision and choose the most accessible target. Ranking A focused superficial study could assess a localized port-site collection. The represented fever and deep pelvic symptoms require examination of the intra-abdominal field. Counterfactual A focal swollen erythematous port-site mass with otherwise reassuring recovery could make a targeted superficial study appropriate.
- choice.topic.appendix-appendicitis.postoperative-infection-imaging.radiographs.v1 ? Temptation Treat the distension as a bowel-gas question while underweighting the inflammatory trajectory. Ranking Radiographs can depict a bowel-gas pattern but provide limited characterization of an intra-abdominal infectious source. The renewed fever and deep pain make source mapping consequential. Counterfactual A distinct supported bowel-obstruction or foreign-body question could call for radiographs. The present source-control investigation has a different target.

Evidence claim.appendix-appendicitis.postoperative-ct.

Identity New postoperative source-localization objective, distinct from the legacy initial adult appendicitis modality decision.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v1",
  "nodeId": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.postoperative-infection-imaging.v1",
  "classification": {
    "kind": "test_choices",
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.port-ultrasound.v1",
        "choiceLabel": "Targeted ultrasound of the abdominal port sites",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.ultrasound"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.abdominal-ct.v1",
        "choiceLabel": "Contrast-enhanced abdominal and pelvic CT",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-infection-imaging.radiographs.v1",
        "choiceLabel": "Upright and supine abdominal radiographs",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.radiography"
        }
      }
    ]
  }
}
```

#### question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1

Case `case.topic.appendix-appendicitis.postoperative-source-control.v1`. Node `node.topic.appendix-appendicitis.postoperative-abscess-drainage.v1`. Concept `concept.appendix-appendicitis.localized-postoperative-abscess-drainage.v1`.

Before Empty (new gap question).

Retirement/replacement inputs inventory.14164bfd62e37818, inventory.c98fa6b2a1093e17, inventory.e64a213d31294e69.

Maya Collins, 35, Female. Complaint **Pain after appendectomy**.

Maya Collins, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.

Current update The receiving hospital's CT shows a 5.5-cm rim-enhancing pelvic collection containing gas. It abuts the bladder and rectum, with a posterior catheter path clear of bowel. No enteric contrast leak or diffuse intraperitoneal fluid is seen. Fever and focal pain persist after intravenous antibiotics. Maya Collins remains alert with stable blood pressure and no diffuse rigidity.

Exhibit Empty

**Which source-control plan should be recommended now for Maya Collins's postoperative pelvic collection?**

**key shown first for review only.**

- **KEY** Perform image-guided pelvic catheter drainage

  Persistent infection and an organized localized collection call for source control. The safe posterior route and absence of generalized peritonitis support image-guided catheter drainage with ongoing antimicrobial care.
- Continue intravenous antibiotics with serial examination

  Antibiotics can suffice for selected small or resolving collections. Persistent infection with this organized accessible collection supports evacuation as part of source control.
- Perform operative exploration with pelvic drainage

  Exploration can control generalized contamination, an ongoing enteric leak or a collection inaccessible to percutaneous treatment. The supplied single localized collection has a safe catheter route and stable physiology.

The organized collection and persistent fever indicate a residual source needing control. Stable physiology, localization and a safe catheter route support image-guided drainage with antimicrobial therapy. Generalized contamination or an uncontrolled enteric leak would change the source-control operation.

Exact after hash `67f15573ab110407412887f7440e343ff34bd0a7029a0a924bbcdd492a72571d`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Integrate an organized gas-containing collection and persistent symptoms as incomplete source control, then assess localization and the actual catheter path.
- Apply Choose image-guided drainage for the accessible localized source while continuing shared antimicrobial care.
- Closest error Continue antibiotics because the patient is stable, or operate because postoperative gas is interpreted as proof of uncontrolled bowel leakage.
- Deciding observation Persistent infection, a single organized collection with a bowel-free catheter route and no represented ongoing leak or generalized peritonitis.
- Consequence Delayed source control or an unnecessarily invasive operation.
- Deletion test Deleting persistent symptoms makes continued medical care more plausible. Deleting route anatomy makes the drainage recommendation underspecified. Generalized-peritonitis and leak observations constrain the choice against operative source control. The 5.5-cm value is a constructed case observation and supplies no universal drainage cutoff.
- Counterfactual Add diffuse rigidity and active enteric leakage on CT. Operative exploration with control of the leak becomes the best offered source-control plan. Changed choice operative-exploration.
- Cue attack All three options are concrete source-control policies. The key has intermediate length. The catheter path is necessary procedural anatomy, and is described without saying the procedure is available or will avoid delay. Every offered test/procedural choice has an explicit timing classification.
- Stage and category Source-control route after cross-sectional anatomy and observed antibiotic response.
- Difficulty Predicted moderate to hard for PGY-2/3 from balancing persistent infection against stability, postoperative gas and actual source-control access.
- One best answer For this localized accessible collection with persistent illness, catheter drainage is the favored proposed route. There is no claimed size-only rule or universal rank across all postoperative abscesses.
- Sequence The prior node explains source localization only. It supplies neither the drain route nor a general percutaneous-drainage recommendation. This update adds the decisive anatomy and response.
- Repair and repeat check Removed a sentence declaring the collection drainable and replaced it with the posterior path anatomy. Re-solved the operative-leak and resolving-collection counterfactuals.

Distractor attacks

- choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v1 ? Temptation Treat stable physiology as evidence that antimicrobial treatment has controlled the source. Ranking Antibiotics can suffice for selected small or resolving collections. Persistent infection with this organized accessible collection supports evacuation as part of source control. Counterfactual A small collection shrinking with complete clinical improvement and no safe access route could support continued medical management.
- choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v1 ? Temptation Treat every postoperative gas-containing collection as a failure requiring a return to the operating room. Ranking Exploration can control generalized contamination, an ongoing enteric leak or a collection inaccessible to percutaneous treatment. The supplied single localized collection has a safe catheter route and stable physiology. Counterfactual Diffuse rigidity and active enteric leakage would favor prompt operative source control.

Evidence claim.appendix-appendicitis.localized-abscess-drainage, claim.appendix-appendicitis.diffuse-leak-exploration.

Identity New postoperative treatment-route objective. It is separate from disputed initial treatment of a primary appendiceal phlegmon or abscess.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v1",
  "nodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.postoperative-abscess-drainage.v1",
  "classification": {
    "kind": "test_choices",
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.antibiotics.v1",
        "choiceLabel": "Continue intravenous antibiotics with serial examination",
        "timing": {
          "kind": "no_test"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.operative-exploration.v1",
        "choiceLabel": "Perform operative exploration with pelvic drainage",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.postoperative-abscess-drainage.catheter-drainage.v1",
        "choiceLabel": "Perform image-guided pelvic catheter drainage",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.clinical_procedure"
        }
      }
    ]
  }
}
```

Earlier visible context and possible feedback

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v1",
    "task": "Which investigation should the acute-care team obtain next for {patientName}'s renewed symptoms after appendectomy?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The return of fever and deep pelvic pain after initial recovery raises concern for a postoperative intra-abdominal source. CT with intravenous contrast maps the source and the anatomy needed for a treatment plan. A focused port study and plain films examine narrower targets.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Targeted ultrasound of the abdominal port sites",
        "rationale": "A focused superficial study could assess a localized port-site collection. The represented fever and deep pelvic symptoms require examination of the intra-abdominal field."
      },
      {
        "label": "Contrast-enhanced abdominal and pelvic CT",
        "rationale": "The recovery-then-deterioration pattern raises a deep intra-abdominal source question. Intravenous contrast-enhanced CT maps collections and their relation to bowel for subsequent source-control planning."
      },
      {
        "label": "Upright and supine abdominal radiographs",
        "rationale": "Radiographs can depict a bowel-gas pattern but provide limited characterization of an intra-abdominal infectious source. The renewed fever and deep pain make source mapping consequential."
      }
    ]
  }
]
```

#### question.topic.appendix-appendicitis.post-source-control-antibiotics.v1

Case `case.topic.appendix-appendicitis.postoperative-source-control.v1`. Node `node.topic.appendix-appendicitis.post-source-control-antibiotics.v1`. Concept `concept.appendix-appendicitis.recovered-after-source-control-antibiotics.v1`.

Before Empty (new gap question).

Retirement/replacement inputs Empty.

Maya Collins, 35, Female. Complaint **Pain after appendectomy**.

Maya Collins, a 35-year-old woman, returns to the clinic after laparoscopic appendectomy for a perforated appendix. She initially resumed eating, then developed fever, deep pelvic pain and abdominal distension. She is passing stool. The port incisions are dry, the abdomen is tender without diffuse rigidity, and her circulation is stable. Pregnancy testing is negative, renal function is within its reporting interval and no prior iodinated-contrast reaction is recorded.

Current update At later clinic review, catheter drainage has evacuated the collection, and the treating team has documented source control without ongoing bowel leakage. Maya Collins has completed four days of an active antibiotic course after drainage. She is afebrile, eating, walking and free of abdominal pain. Her leukocyte count has fallen substantially and remains slightly above the laboratory reference interval. She is immunocompetent.

Exhibit Empty

**Which antibiotic plan should be recommended now for Maya Collins after this completed course and source control?**

**key shown first for review only.**

- **KEY** End antibiotic treatment after the completed course

  Adequate source control and complete clinical recovery support ending the completed short course. An isolated falling mildly elevated leukocyte count does not establish a need for extension.
- Continue treatment until the leukocyte count normalizes

  Waiting for every inflammatory laboratory value to normalize can prolong therapy after adequate source control and clinical recovery. Fixed short-course evidence supports ending the completed course in this represented patient.
- Continue treatment pending repeat abdominal and pelvic CT

  Clinical recovery after adequate drainage supports ending the completed course. New or persistent illness would establish a separate indication for CT assessment of residual infection while treatment is reassessed.

The relevant endpoint combines adequate source control, a completed active short course and clinical recovery. The fixed-course evidence does not require normalization of every inflammatory value. A recurrence of illness would trigger reassessment of the source and treatment plan.

Exact after hash `79cc8291ec52d8ab4f67a8a0d6b78dcc26979f182359de9215a9626a0789f971`. Clinical review state `needs_clinician_review`.

Manual author gate

- Interpret Separate a falling mildly abnormal leukocyte count from clinical evidence of persistent infection after adequate drainage.
- Apply End the completed active course instead of extending to a laboratory or radiographic endpoint.
- Closest error Continue antibiotics until the leukocyte count enters the laboratory reference interval.
- Deciding observation Adequate source control, completed active treatment and afebrile pain-free functional recovery.
- Consequence Unnecessary antimicrobial exposure and investigation.
- Deletion test Deleting source-control adequacy or clinical recovery invalidates the stop recommendation. The mildly abnormal falling count creates the closest competing endpoint. Four days is the constructed completed course with direct support from Global Alliance statement 8, not a newly authored mandatory minimum.
- Counterfactual Replace recovery with renewed deep pain and fever. Continuing active treatment while obtaining CT to assess a residual source becomes the best offered plan, with duration determined after reassessment. Changed choice imaging-clearance.
- Cue attack All labels specify antibiotic endpoints. The key and alternatives have comparable length. Every CT-containing plan has a CT estimate. No specific regimen is chosen because the active regimen is common background care. Removed a negative-culture result that would have provided an extra stopping cue.
- Stage and category Antibiotic management after a completed active course and documented source control.
- Difficulty Predicted moderate for PGY-2/3 from treating incomplete laboratory normalization as treatment failure despite source control and recovery.
- One best answer The represented completed-course scenario fits fixed short-course evidence. Minimum duration, resistant pathogens, immunosuppression and unresolved source-control scenarios require separate decisions.
- Sequence Prior feedback establishes the reason for drainage, while this node adds actual evacuation, clinical response and a completed antibiotic course. Earlier feedback states no antibiotic endpoint or duration.
- Repair and repeat check Replaced a duration-recall question with a source-control-and-recovery endpoint. Removed a new drug regimen and retained the observed completed course. The counterfactual was re-solved for recurrent illness.

Distractor attacks

- choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v1 ? Temptation Use a mildly abnormal leukocyte count as proof of ongoing infection despite recovery. Ranking Waiting for every inflammatory laboratory value to normalize can prolong therapy after adequate source control and clinical recovery. Fixed short-course evidence supports ending the completed course in this represented patient. Counterfactual Renewed fever, pain or organ dysfunction would require a fresh source-control assessment and a supported active-treatment plan.
- choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v1 ? Temptation Require another source-imaging assessment despite documented source control and clinical recovery. Ranking Clinical recovery after adequate drainage supports ending the completed course. New or persistent illness would establish a separate indication for CT assessment of residual infection while treatment is reassessed. Counterfactual Recurrent deep pain and fever would support CT assessment for a residual or new source while therapy is reassessed.

Evidence claim.appendix-appendicitis.completed-short-course, claim.appendix-appendicitis.postoperative-ct.

Identity New source-control-and-response endpoint objective. It does not install a fixed duration in diagnostic wait metadata or author a minimum appendicitis antibiotic duration.

Exact timing proposal

```json
{
  "caseId": "case.topic.appendix-appendicitis.postoperative-source-control.v1",
  "nodeId": "node.topic.appendix-appendicitis.post-source-control-antibiotics.v1",
  "questionVariantId": "question.topic.appendix-appendicitis.post-source-control-antibiotics.v1",
  "classification": {
    "kind": "test_choices",
    "choices": [
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.wbc-normalization.v1",
        "choiceLabel": "Continue treatment until the leukocyte count normalizes",
        "timing": {
          "kind": "no_test"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.stop-course.v1",
        "choiceLabel": "End antibiotic treatment after the completed course",
        "timing": {
          "kind": "no_test"
        }
      },
      {
        "choiceId": "choice.topic.appendix-appendicitis.post-source-control-antibiotics.imaging-clearance.v1",
        "choiceLabel": "Continue treatment pending repeat abdominal and pelvic CT",
        "timing": {
          "kind": "test",
          "timingProfileId": "timing.test.ct"
        }
      }
    ]
  }
}
```

Earlier visible context and possible feedback

```json
[
  {
    "nodeId": "node.topic.appendix-appendicitis.postoperative-infection-imaging.v1",
    "task": "Which investigation should the acute-care team obtain next for {patientName}'s renewed symptoms after appendectomy?",
    "currentUpdate": null,
    "exhibit": null,
    "explanation": "The return of fever and deep pelvic pain after initial recovery raises concern for a postoperative intra-abdominal source. CT with intravenous contrast maps the source and the anatomy needed for a treatment plan. A focused port study and plain films examine narrower targets.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Targeted ultrasound of the abdominal port sites",
        "rationale": "A focused superficial study could assess a localized port-site collection. The represented fever and deep pelvic symptoms require examination of the intra-abdominal field."
      },
      {
        "label": "Contrast-enhanced abdominal and pelvic CT",
        "rationale": "The recovery-then-deterioration pattern raises a deep intra-abdominal source question. Intravenous contrast-enhanced CT maps collections and their relation to bowel for subsequent source-control planning."
      },
      {
        "label": "Upright and supine abdominal radiographs",
        "rationale": "Radiographs can depict a bowel-gas pattern but provide limited characterization of an intra-abdominal infectious source. The renewed fever and deep pain make source mapping consequential."
      }
    ]
  },
  {
    "nodeId": "node.topic.appendix-appendicitis.postoperative-abscess-drainage.v1",
    "task": "Which source-control plan should be recommended now for {patientName}'s postoperative pelvic collection?",
    "currentUpdate": "The receiving hospital's CT shows a 5.5-cm rim-enhancing pelvic collection containing gas. It abuts the bladder and rectum, with a posterior catheter path clear of bowel. No enteric contrast leak or diffuse intraperitoneal fluid is seen. Fever and focal pain persist after intravenous antibiotics. {patientName} remains alert with stable blood pressure and no diffuse rigidity.",
    "exhibit": null,
    "explanation": "The organized collection and persistent fever indicate a residual source needing control. Stable physiology, localization and a safe catheter route support image-guided drainage with antimicrobial therapy. Generalized contamination or an uncontrolled enteric leak would change the source-control operation.",
    "allPossibleChoiceFeedback": [
      {
        "label": "Continue intravenous antibiotics with serial examination",
        "rationale": "Antibiotics can suffice for selected small or resolving collections. Persistent infection with this organized accessible collection supports evacuation as part of source control."
      },
      {
        "label": "Perform operative exploration with pelvic drainage",
        "rationale": "Exploration can control generalized contamination, an ongoing enteric leak or a collection inaccessible to percutaneous treatment. The supplied single localized collection has a safe catheter route and stable physiology."
      },
      {
        "label": "Perform image-guided pelvic catheter drainage",
        "rationale": "Persistent infection and an organized localized collection call for source control. The safe posterior route and absence of generalized peritonitis support image-guided catheter drainage with ongoing antimicrobial care."
      }
    ]
  }
]
```

### Stable identities, review freezes and preserved histories

- concept.appendicitis.appendicolith-operative-pathway ? Registered in the default release. Audit records inventory.14164bfd62e37818, inventory.00050117719fe89e, inventory.46eca681a5657da1, inventory.c98fa6b2a1093e17. Preserve exact old definitions and history. All supply changes are manager proposals.
- concept.appendicitis.classic-pattern-urgent-disposition ? Retained identity. Audit records inventory.87d2d8f029e0fd4b. Preserve exact old definitions and history. All supply changes are manager proposals.
- concept.appendicitis.ct-request-with-urinary-mimic.v1 ? Retained identity. Audit records inventory.039efde9d6406671. Preserve exact old definitions and history. All supply changes are manager proposals.
- concept.appendicitis.incomplete-pattern-recognition ? Retained identity. Audit records inventory.f6a91b1684ea0b16. Preserve exact old definitions and history. All supply changes are manager proposals.
- concept.appendicitis.no-delay-for-unavailable-test ? Retained identity. Audit records inventory.e64a213d31294e69, inventory.b27b6e5a35516a63. Preserve exact old definitions and history. All supply changes are manager proposals.
- concept.appendicitis.stable-adult-ct ? Registered in the default release. Audit records inventory.aec842138ef4f218, inventory.7db83c6db2bc35c3, inventory.77b6a7027acff8ce, inventory.fde00f3201bc47d2, inventory.159fb8efb704d450. Preserve exact old definitions and history. All supply changes are manager proposals.
- concept.n3.appendicitis-response-versus-structural-risk ? Retained identity. Audit records inventory.77a3e7166020ce63, inventory.01cebe62173eb37c. Preserve exact old definitions and history. All supply changes are manager proposals.

The changed B2B14 meaning receives a new identity. Preserve all old IDs, exact questions, timing/order records, frozen encounters and scheduling histories. Manager decides supply retirement and admission.

The only changed-meaning predecessor is `concept.appendicitis.ct-request-with-urinary-mimic.v1`. Its new progression-after-imaging construct receives a separate topic identity. Twelve other concepts cover new gap objectives. Same-meaning reuse count is zero. Supplied exact independent PASS and clinical approvals are empty. B2B14 reviews 1 and 2 are REVISE and retain original decision files and file hashes in the assignment. The N3 v2 drop proposal remains recorded.

### Atomic evidence, sources and rights

The companion source ledger contains all 25 atomic claims, six full source records, bidirectional source/claim/question maps, field mappings, access findings and safe links. Bibliographic copies of one publication share one evidence role. The cases and factual statements are independently written. Source expression and exhibits are excluded.

#### claim.appendix-appendicitis.initial-abscess-selection

Initial nonoperative treatment and laparoscopic surgery both have guideline support for selected appendiceal abscess presentations.

Category management. Certainty conflicting. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.wses-2020, source.appendix-appendicitis.sages-2024.

WSES recommendations 6.1-6.2 condition the approach on expertise and setting. SAGES KQ3 conditionally favors surgery while identifying a discrete abscess and significant cecal inflammation as reasons to consider initial nonoperative care. A universal comparative key is withheld.

#### claim.appendix-appendicitis.young-interval-disagreement

The verified guidelines differ on routine interval appendectomy after successful nonoperative treatment in an asymptomatic younger adult.

Category management. Certainty conflicting. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.wses-2020, source.appendix-appendicitis.sages-2024.

WSES 2020 recommendation 6.3 advises against routine interval appendectomy in patients younger than 40, reserving it for recurrence. SAGES 2024 KQ8 conditionally favors interval appendectomy in adults. The newer WSES full recommendation needs permitted verification. No general younger-adult item is keyed.

#### claim.appendix-appendicitis.intermediate-net-boundary

Management of appendiceal NETs measuring 1-2 cm requires a more individualized assessment than the larger-tumor resection rule.

Category management. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline describes controversy and consideration of pathology, patient factors and multidisciplinary review. A mandatory colectomy rule based on one intermediate-size adverse feature is withheld.

#### claim.appendix-appendicitis.uncomplicated-postoperative-antibiotics

Definitively treated uncomplicated appendicitis generally requires no postoperative therapeutic antibiotic course.

Category management. Certainty high. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.wses-2020, source.appendix-appendicitis.wses-iai-2017.

Supports a ranked future gap. The directly verified guidelines share authors and evidence. A sufficiently discriminating new operative-classification question remains to be authored, with the newer guideline checked before exact duration rules are used.

#### claim.appendix-appendicitis.pregnancy-imaging-sequence

MRI can follow inconclusive ultrasound when appendicitis remains suspected during pregnancy.

Category evaluation. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.wses-2020.

One directly verified guideline, recommendation 1.13.2, supports the relationship. This is a ranked scope gap with no keyed new pregnancy item. Current population-specific guidance and a consequential close alternative require further permitted verification.

#### claim.appendix-appendicitis.lamn-complete-resection

Appendectomy is sufficient surgical treatment for a margin-negative LAMN with an intact wall and no peritoneal involvement.

Category management. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline, recommendation 12. Used for counterfactuals and the boundary against invasive carcinoma. Surveillance details remain outside the scored task.

#### claim.appendix-appendicitis.small-favorable-net-resection

A subcentimeter appendiceal NET without unfavorable features can be treated by appendectomy that includes the mesoappendix.

Category management. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline, recommendation 7. Used as a counterfactual boundary. This packet supplies no universal rule for 1-2-cm tumors or a surveillance schedule.

#### claim.appendix-appendicitis.persistent-pain-negative-imaging

Progressive or persistent right-sided abdominal pain after negative imaging can warrant exploratory laparoscopy for appendicitis or another cause.

Category management. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.wses-2020, source.appendix-appendicitis.niddk-2021.

WSES recommendation 1.12 directly supports exploration after a progressive clinical course. NIDDK corroborates surgery for ongoing symptoms only at a general level. An adequate negative examination initially supports observation. The 2025 WSES exact update was unavailable for permitted full-text verification.

#### claim.appendix-appendicitis.ct-after-nondiagnostic-us

CT can resolve persistent diagnostic uncertainty after nondiagnostic ultrasound in a stable nonpregnant adult with suspected appendicitis.

Category evaluation. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.wses-2020, source.appendix-appendicitis.sages-2024.

Used to audit the old modality questions. MRI is also definitive. The legacy availability sentence does much of their discriminating work.

#### claim.appendix-appendicitis.appendicolith-nom-risk

An appendicolith makes an antibiotics-first appendicitis course less favorable and strengthens the case for appendectomy.

Category safety_boundary. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.wses-2020, source.appendix-appendicitis.sages-2024.

A treatment-risk modifier within shared clinical decisions. No universal prohibition, exact failure probability or uniquely required treatment for every patient is asserted. Used for the legacy audit.

#### claim.appendix-appendicitis.post-abscess-neoplasm

An older adult recovering from an appendiceal abscess warrants evaluation for an underlying appendiceal or colonic neoplasm.

Category evaluation. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025, source.appendix-appendicitis.wses-2020, source.appendix-appendicitis.sages-2024.

The drafted patient is 62 with a persistent focal appendiceal abnormality. No age threshold or mandatory policy for all younger adults is keyed. The publications differ on routine interval appendectomy.

#### claim.appendix-appendicitis.colonoscopy-neoplasm

Suspected appendiceal neoplasia calls for colonoscopy to assess synchronous colonic disease before formal resection planning.

Category evaluation. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025, source.appendix-appendicitis.wses-2020.

ASCRS recommendation 1 is the direct current guideline. WSES independently supports colonic screening in the post-abscess older-adult context. Neither establishes colonoscopy as a complete histologic examination of the appendix.

#### claim.appendix-appendicitis.interval-tissue-evaluation

Interval appendectomy is favored after complicated appendicitis in an older adult with persistent imaging suspicion for appendiceal neoplasia.

Category management. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025, source.appendix-appendicitis.sages-2024.

Conditional guidance. The case has resolved infection, a focal residual nodule and a free appendiceal base. Normal cecal mucosa does not supply histology of that mural nodule. Exact timing and a universal younger-adult rule are withheld.

#### claim.appendix-appendicitis.intact-abnormal-appendix

An abnormal appendix encountered incidentally can be removed intact with a grossly clear base, preserving definitive specimen assessment before deciding on oncologic colectomy.

Category management. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline, recommendation 2. The base and extent govern resection. Suspected mucinous lesions require avoidance of rupture. No automatic operation is specified for extensive peritoneal disease.

#### claim.appendix-appendicitis.lamn-margin

A microscopic positive margin in an otherwise completely removed, nonperforated LAMN does not automatically require further resection.

Category management. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline. The underlying data are limited. This proposal requires exact pathology, absence of gross residual disease, no perforation and no peritoneal mucin. Melissa must review observation against local re-excision. Surveillance intensity is left open.

#### claim.appendix-appendicitis.lamn-versus-invasive

Infiltrative malignant glands distinguish appendiceal adenocarcinoma from a noninfiltrative low-grade mucinous neoplasm.

Category definition. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline. A fully evaluated permanent specimen is supplied in the draft. A small biopsy or uncertain frozen section would not establish the same extent.

#### claim.appendix-appendicitis.adenocarcinoma-colectomy

Nonmetastatic appendiceal adenocarcinoma generally warrants oncologic right hemicolectomy with regional nodal assessment.

Category management. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline, recommendation 13. The draft has invasion into mesoappendiceal fat, adequate staging and a fit patient. The recommendation is not generalized to isolated LAMN or disseminated peritoneal disease.

#### claim.appendix-appendicitis.goblet-cell-identity

Infiltrative appendiceal goblet-cell epithelial tumors follow an adenocarcinoma treatment pathway despite possible focal neuroendocrine-marker expression.

Category management. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline. The exact diagnosis is confirmed on expert permanent review. A stain result by itself is insufficient to reclassify the tumor.

#### claim.appendix-appendicitis.net-functional-staging

Somatostatin-receptor PET/CT can clarify staging of a well-differentiated appendiceal NET when cross-sectional imaging leaves possible metastases unresolved.

Category evaluation. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline, recommendation 5. Ga-DOTA PET/CT is favored over older receptor scintigraphy for sensitivity and over FDG PET/CT in well-differentiated NETs. Exact comparative performance estimates are excluded.

#### claim.appendix-appendicitis.net-resection

For a nonmetastatic appendiceal NET larger than 2 cm, right hemicolectomy addresses the regional nodal basin even after a margin-negative appendectomy.

Category management. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline, recommendation 7. The exact greater-than-2-cm threshold is directly stated there. Management of tumors measuring 1-2 cm is withheld as a disputed boundary.

#### claim.appendix-appendicitis.peritoneal-mucin-treatment

Selected patients with appendiceal mucinous neoplasia and peritoneal dissemination merit peritoneal-surface surgical assessment for cytoreduction and intraperitoneal treatment.

Category management. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.ascrs-2025.

One directly verified current specialty guideline, recommendations 13-15. Right colectomy does not by itself address diffuse peritoneal disease. Systemic chemotherapy has limited activity in low-grade disease. Referral does not assert that every patient is operable or requires one HIPEC regimen.

#### claim.appendix-appendicitis.postoperative-ct

Intravenous contrast-enhanced CT helps localize an intra-abdominal infectious source and plan source control in a stable postoperative adult.

Category evaluation. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.alliance-2024, source.appendix-appendicitis.wses-iai-2017.

The publications overlap in authorship and underlying evidence. Clinical recovery followed by renewed deep abdominal symptoms is constructed patient data. CT is compared with focused superficial ultrasound and abdominal radiographs, not with an equally comprehensive appropriate alternative.

#### claim.appendix-appendicitis.localized-abscess-drainage

A localized postoperative abscess without generalized peritonitis can be treated with image-guided catheter drainage and antibiotics when the collection has a safe access route.

Category management. Certainty low. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.wses-iai-2017, source.appendix-appendicitis.alliance-2024.

WSES statement 30 and Global Alliance source-control guidance directly support this pathway. Their evidence overlaps. No abscess-size cutoff or universal superiority over operative drainage is claimed. The case supplies a single accessible collection and persistent infection despite antibiotics.

#### claim.appendix-appendicitis.diffuse-leak-exploration

Generalized postoperative peritonitis or uncontrolled enteric leakage requires prompt operative source control.

Category management. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.wses-iai-2017, source.appendix-appendicitis.alliance-2024.

Used as the decision-changing counterfactual to localized percutaneous drainage. Operation and route depend on physiology and anatomy. Resuscitation and antibiotics are shared background care.

#### claim.appendix-appendicitis.completed-short-course

After adequate source control and clinical recovery, a completed short antibiotic course need not be extended until every inflammatory laboratory result normalizes.

Category management. Certainty moderate. Checked 2026-11-11. State needs_clinician_review. Sources source.appendix-appendicitis.alliance-2024, source.appendix-appendicitis.sages-2024, source.appendix-appendicitis.wses-2020.

The patient has already completed four days after drainage. Global Alliance statement 8 directly supports this completed-course scenario and compares fixed treatment with physiologic-normalization endpoints. This item does not ask for a minimum duration or override a shorter current appendicitis protocol. Exact new WSES duration requires a permitted full-text check. Persistent illness would change the task to renewed source assessment.

#### source.appendix-appendicitis.wses-2020

Di Saverio S, Podda M, De Simone B, et al. Diagnosis and treatment of acute appendicitis: 2020 update of the WSES Jerusalem guidelines. World J Emerg Surg. 2020;15:27. doi:10.1186/s13017-020-00306-3.

Authority GRADE-based international surgical guidance. Older edition, used with newer permitted guidance where available. Recommendations 1.12, 6.3-6.4 and 7.1-7.2 were checked directly.

Rights CC BY 4.0. Article-level CC BY 4.0 checked in Rights and permissions. Independently synthesized factual applications with attribution. No source prose, tables, figures or algorithms reproduced. A 2025 edition published in 2026 was identified. Exact updated recommendations require a permitted full-text check.

Access 2026-11-11. Class professional_society_guideline. Intended use both.

<a href="https://link.springer.com/article/10.1186/s13017-020-00306-3" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Diagnosis and treatment of acute appendicitis, 2020 WSES update</a>

#### source.appendix-appendicitis.sages-2024

Kumar SS, Collings AT, Lamm R, et al. SAGES guideline for the diagnosis and treatment of appendicitis. Surg Endosc. 2024;38:2974-2994. doi:10.1007/s00464-024-10813-y.

Authority Multidisciplinary GRADE surgical guideline. Operative and interval recommendations are conditional, with low or very-low certainty. The general interval policy differs from WSES 2020.

Rights Copyright SAGES. Targeted factual verification only.. Public society guideline used for targeted verification of KQ1-3 and KQ6-8. No protected expression reproduced. The legal page returned 403 on direct open, with copyright/privacy information available in search. No affirmative AI-use permission is claimed. No known AI-use prohibition was found for this society page. Sage Publishing is a different publisher and its restricted material was excluded.

Access 2026-11-11. Class professional_society_guideline. Intended use both.

<a href="https://www.sages.org/publications/guidelines/guideline-for-the-diagnosis-and-treatment-of-appendicitis/" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">SAGES guideline for the diagnosis and treatment of appendicitis</a>

#### source.appendix-appendicitis.ascrs-2025

Gaertner WB, Brown SR, Deutsch M, Jafari MD, Krane MK, Simianu VV, Valente MA, Lightner AL, Feingold DL, Paquette IM. The American Society of Colon and Rectal Surgeons Clinical Practice Guidelines for the Management of Appendiceal Neoplasms. Dis Colon Rectum. 2025;68(7):815-834. doi:10.1097/DCR.0000000000003796.

Authority Current specialty GRADE guideline, literature search through February 2025. Several recommendations rest on observational data. Many exact tumor-management decisions have this single directly verified publication in this packet.

Rights Copyright ASCRS 2025. Targeted factual verification only.. Read the public society guideline and publicly linked guideline PDF for targeted factual checks. The former free-resource URL now points to another location. No authentication or paywall bypass was used. ASCRS Access to and Use of Works Policy checked. No content, table, algorithm, image or source excerpt is retained. The published guideline is a factual cross-check, with independently written claims and fictional cases.

Access 2026-11-11. Class professional_society_guideline. Intended use both.

<a href="https://www.ascrsu.com/ascrs/view/ASCRS-Evidence-Based-Guidelines-and-Expert-Consensus/3982016/all/Management_of_Appendiceal_Neoplasms__2025_?q=management+practice" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">ASCRS clinical practice guidelines for appendiceal neoplasms, 2025</a>

#### source.appendix-appendicitis.alliance-2024

Sartelli M, Barie P, Agnoletti V, et al. Intra-abdominal infections survival guide: a position statement by the Global Alliance For Infections In Surgery. World J Emerg Surg. 2024;19:22. doi:10.1186/s13017-024-00552-9.

Authority Contemporary multidisciplinary consensus on intra-abdominal infection, with graded statements. Statements 2-3 and 8-9 support source-control assessment and short-course treatment. It shares some authors and evidence with WSES publications, so corroboration is partly overlapping.

Rights CC BY 4.0. Article license and Springer Nature TDM reservation policy checked. The policy permits CC BY use with attribution. Factual synthesis and constructed applications are original. No source text or exhibits are reproduced.

Access 2026-11-11. Class peer_reviewed_guideline. Intended use both.

<a href="https://link.springer.com/article/10.1186/s13017-024-00552-9" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Intra-abdominal infections survival guide, Global Alliance 2024</a>

#### source.appendix-appendicitis.wses-iai-2017

Sartelli M, Chichom-Mefire A, Labricciosa FM, et al. The management of intra-abdominal infections from a global perspective: 2017 WSES guidelines for management of intra-abdominal infections. World J Emerg Surg. 2017;12:29. doi:10.1186/s13017-017-0141-6.

Authority Surgical consensus with graded recommendations. The postoperative-abscess recommendation is low certainty. Substantial authorship and evidence overlap with Global Alliance 2024 limits independence.

Rights CC BY 4.0. Article-level license verified. Original atomic factual synthesis with attribution. Statement 30 was checked for localized postoperative abscess and statement 31 for generalized postoperative peritonitis. Older guidance is cross-checked against Global Alliance 2024.

Access 2026-11-11. Class professional_society_guideline. Intended use both.

<a href="https://link.springer.com/article/10.1186/s13017-017-0141-6" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">WSES global intra-abdominal infection guidelines, 2017</a>

#### source.appendix-appendicitis.niddk-2021

National Institute of Diabetes and Digestive and Kidney Diseases. Treatment for Appendicitis. National Institutes of Health. Reviewed July 2021. Accessed November 11, 2026.

Authority Government patient guidance provides broad treatment context. It does not establish operative extent, imaging protocols, size cutoffs or exact antibiotic duration.

Rights US government health-information page. Third-party material excluded.. Used for a narrow general treatment cross-check. Independently written factual statements only. Images and external linked material are excluded.

Access 2026-11-11. Class government_guidance. Intended use cross_check.

<a href="https://www.niddk.nih.gov/health-information/digestive-diseases/appendicitis/treatment" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">NIDDK treatment for appendicitis</a>

#### Access limitations and excluded routes

- Diagnosis and Treatment of Acute Appendicitis: 2025 Edition of the WSES Jerusalem Guidelines ? Full-text request redirected to an abstract. Footer reserves mining, AI training and similar rights. Currentness metadata only. Exact updated treatment rules are withheld.
- IDSA 2024 complicated intra-abdominal-infection guideline ? Publication disclaimer restricts reproduction, retrieval-system storage, text/data mining and AI training without permission or an applicable license. Excluded after rights check.
- Surgical Infection Society 2024 intra-abdominal-infection update ? Sage Publishing requires a license for generative-AI use. Full text excluded. This publisher is distinct from the SAGES society website.
- German S2k guideline on LAMN, 2025 ? Repository search metadata displayed CC BY. The opened landing page rendered template placeholders and usable article text was unavailable. It contributes no corroborating claim.
- Proprietary textbooks, commercial question banks, UpToDate, AccessSurgery, SCORE modules and recalled examination questions ? Excluded by repository policy. These products were never used as the topic corpus.

CC BY sources are attributed to their authors and publications. The article-specific license is CC BY 4.0. The original factual synthesis and constructed applications are identified here as AI-assisted drafts.

### Timing, orders and integration dependencies

- Hospital-plan and record review in the existing clinic representation. All serviceRequest and resultGateAfter values are null. Timings use existing presentation-only placeholder profiles.
- Five multi-part cases supply eleven paired-only objectives. Existing eligibility requires all case concepts to be unseen or due and can enter at any position. Future-due companions can block selection. Two objectives have standalone coverage. Current updates carry the relevant acquired context. Selector and FSRS changes require manager-owned work.
- All assigned case owners are appendix-appendicitis. Drafted nodes stay within that scope. Future primary pregnancy, urinary, IBD or generalized shock decisions need their topic owner through the manager.
- Replacing the eight current live topic nodes with all thirteen proposals would add five fresh nodes. Core initial CT and appendicolith relationships still need difficult direct replacements. The manager's retirement decision includes whether to retain that core supply while direct replacements are authored.
- Authoring-only earliest facility stage 3, educational tier 1, independent case acuity and no new capability contract. Manager decides final admission. Facility gates are independent of difficulty.

- Explicit manager-reviewed admission after independent review
- Concept registry and exact ship-manifest proposals
- All thirteen exact-label timing entries
- Safe source links and versioned source/claim admission
- Case and finite-profile composition review

Timing exports bind exact choice IDs and labels, including all testing distractors and mixed procedural plans. Safe source-link exports use target _blank, rel noopener noreferrer and referrerPolicy no-referrer. Future tests and procedures remain planned hospital actions. All original frozen mappings remain in their source files.

### Owner approvals needed

#### owner.appendix-appendicitis.lamn-margin

Affected question.topic.appendix-appendicitis.lamn-microscopic-margin.v1. Competing actions Observation after complete nonperforated LAMN resection / Local cecal margin re-excision.

ASCRS 2025 reviews limited data supporting observation for microscopic margin involvement. The case supplies whole-specimen noninfiltrative pathology, complete gross removal, an intact wall and no peritoneal or residual mass.

For this exact microscopic-margin-only LAMN record, do you approve observation as the preferred additional-resection plan over cecal re-excision?

#### owner.appendix-appendicitis.initial-abscess-choice

Affected hold.appendix-appendicitis.initial-abscess-choice. Competing actions Antibiotics with image-guided drainage / Early laparoscopic appendectomy and drainage.

Verified guidance supports selected use of both approaches and conditions recommendations on expertise, anatomy and inflammatory burden. A universal comparative key is withheld.

Which exact stable primary-abscess presentation should distinguish antibiotics with drainage from early laparoscopic appendectomy, given the competing conditional guidance?

#### owner.appendix-appendicitis.young-routine-interval

Affected hold.appendix-appendicitis.young-routine-interval. Competing actions Routine interval appendectomy / Observation after successful nonoperative treatment.

WSES 2020 and SAGES 2024 give different routine policies. The newer WSES full recommendation remains unverified under permitted access.

After permitted verification of updated guidance, which exact younger-adult post-abscess setting should favor routine interval surgery over observation?

#### owner.appendix-appendicitis.intermediate-net

Affected hold.appendix-appendicitis.intermediate-net. Competing actions Completion right hemicolectomy / Observation after appendectomy.

ASCRS describes controversy in the 1-2-cm group and consideration of pathology, patient factors and multidisciplinary review.

Which exact 1-2-cm appendiceal NET pathology and patient context should favor completion right hemicolectomy over observation?

Melissa's exact-version clinical review applies to every new or revised node and its evidence, explanation and finite profile. Three new unkeyed holds retain null concept/question identities. The original program supplied zero unkeyed slots and zero withheld teaching points for this topic.

### Decisions and discoveries

- The final sequence ablation moved appendiceal origin and base clearance into the acquired interval CT, giving the later operative decision consequential new evidence.

- Use the existing QuestionVariant, SyntheticClinicalCase, TestedConcept and timing representations in a self-contained explicit-import sidecar.
- Give changed B2B14 meaning a new identity and preserve every exact older reference.
- Propose replacement of duplicate or unaccepted-basic supply slots, carrying the initial CT and appendicolith relationships as high-priority remaining direct-repair gaps.
- Prefer five natural multi-part sequences. Keep peritoneal referral and goblet-cell resection standalone.
- Use one coherent fixed age/sex profile per new case with patientName materialization and no race/ethnicity selection field.
- Keep hospital actions as plan/record review and use placeholder estimates without new execution contracts.
- Difficulty predictions are qualitative author judgments. Independent review and Melissa's exact-version clinical review remain pending.

- Current default release matches manifest v9 with 1151 cases, 1462 nodes and 610 registered concepts. Scoped input hashes match the manager snapshot.
- Eight live original nodes score two concepts. Eight retained variants cover six retained concept identities.
- B2B14 reviews 1 and 2 are REVISE. The N3 v2 retained drop proposal cites four live appendicolith variants.
- The r1 retained draft has ovarian-cyst wording in two Male finite profiles without a recorded constrained anatomy exception.
- ASCRS 2025 provides current appendiceal-neoplasm guidance, with one verified publication for many exact decisions.
- The newer WSES 2025 edition published in 2026 was identified, but its accessible route redirected to an abstract with reserved mining/AI rights. Exact updated full-text treatment rules are withheld.
- IDSA 2024 and Sage Publishing routes have explicit mining/AI restrictions and supply no new evidence claims.

### Validation

Initial focused run passed 24 and failed 1. The interval-resection node omitted its postoperative-neoplasm claim from the question-level union. The claim union and bidirectional mappings were repaired without weakening the test. Subsequent focused runs passed all 25.

#### focused test initial

Working directory `C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content`. Exit code 1.

```powershell
npm.cmd test -- --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts
```

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content

 ? src/question-topic-appendix-appendicitis-20261111.test.ts (25 tests | 1 failed) 78ms
     ? binds question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 to its exact packet, evidence, concrete author gate and randomized node 5ms

??????? Failed Tests 1 ???????

 FAIL  src/question-topic-appendix-appendicitis-20261111.test.ts > appendix topic explicit-import authoring sidecar > binds question.topic.appendix-appendicitis.post-abscess-interval-appendectomy.v1 to its exact packet, evidence, concrete author gate and randomized node
AssertionError: expected false to be true // Object.is equality

- Expected
+ Received

- true
+ false

 ? src/question-topic-appendix-appendicitis-20261111.test.ts:178:95
    176|       expect(changedChoice.isCorrect).toBe(false);
    177|       for (const choice of definition.choices) {
    178|         expect(choice.claimIds.every(id => question.supportingEvidence?
       |                                                                                               ^
    179|         expect(choice.temptation.length).toBeGreaterThan(25);
    180|         expect(choice.counterfactual.length).toBeGreaterThan(45);

????????????????????????[1/1]?


 Test Files  1 failed (1)
      Tests  1 failed | 24 passed (25)
   Start at  11:27:11
   Duration  548ms (transform 226ms, setup 0ms, import 359ms, tests 78ms, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts
```

#### typecheck initial

Working directory `C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content`. Exit code 0.

```powershell
npm.cmd run typecheck
```

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

#### focused test after mapping repair

Working directory `C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content`. Exit code 0.

```powershell
npm.cmd test -- --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts
```

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  11:27:54
   Duration  467ms (transform 185ms, setup 0ms, import 297ms, tests 63ms, environment 0ms)
```

#### typecheck after mapping repair

Working directory `C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content`. Exit code 0.

```powershell
npm.cmd run typecheck
```

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

#### focused test after final cue repair

Working directory `C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content`. Exit code 0.

```powershell
npm.cmd test -- --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts
```

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  11:31:54
   Duration  502ms (transform 185ms, setup 0ms, import 327ms, tests 68ms, environment 0ms)
```

#### typecheck after final cue repair

Working directory `C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content`. Exit code 0.

```powershell
npm.cmd run typecheck
```

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

#### focused test after final sequence repair

Working directory C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content. Exit code 0.

```powershell
npm.cmd test -- --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts
```

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-appendix-appendicitis-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  25 passed (25)
   Start at  11:42:41
   Duration  530ms (transform 203ms, setup 0ms, import 327ms, tests 112ms, environment 0ms)
```

#### typecheck after final sequence repair

Working directory C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content. Exit code 0.

```powershell
npm.cmd run typecheck
```

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json
```

Supplementary import check initially exited 1 because static imports linked extensionless clinical modules before source-loader initialization. A dynamic-import rerun exited 0 and reconciled 16 scoped input hashes, both JSON artifacts, all Markdown identities and the 1,151 / 1,462 / 610 current release census.

#### Owned JSON parsing

Working directory repository root. Exit code 0.

```powershell
node -e "const fs=require('node:fs'); for (const file of ['docs/research/question-topic-appendix-appendicitis-20261111.json','docs/research/sources-question-topic-appendix-appendicitis-20261111.json']) { JSON.parse(fs.readFileSync(file,'utf8')); console.log('PASS '+file); }"
```

```text
PASS docs/research/question-topic-appendix-appendicitis-20261111.json
PASS docs/research/sources-question-topic-appendix-appendicitis-20261111.json
```

Independent review and Melissa Rowland's clinical approval remain pending. Assembled-release advisory lint and cross-topic integration belong to the manager. The focused checks validate structure, identity preservation and mappings.

### Final worker handoff

```text
Topic appendix-appendicitis
Files changed packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.ts
  packages/clinical-content/src/question-topic-appendix-appendicitis-20261111.test.ts
  docs/research/question-topic-appendix-appendicitis-20261111.json
  docs/research/question-topic-appendix-appendicitis-20261111.md
  docs/research/sources-question-topic-appendix-appendicitis-20261111.json
Inventory manifest v9, 145 rows, 1151 cases / 1462 nodes / 610 concepts, zero scoped input drift
Counts audited 16, kept 0, rewritten 1, retired-and-replaced proposed 15, new 12
Count basis 16 exact variants and visible case/node contexts, 42 finite profiles, 13 proposed nodes, 12 new-gap concepts and one changed-meaning identity
Held/unkeyed three new holds, zero supplied unkeyed holds, one carried N3 retained drop proposal
Research 18 ranked concept groups, 25 claims, six sources, current WSES full-text and single-publication limitations recorded
Packet docs/research/question-topic-appendix-appendicitis-20261111.md and .json, sources-question-topic-appendix-appendicitis-20261111.json
Identity preservation seven old mapped concepts and all exact definitions/history retained, zero supplied PASS or named clinical approval references
Owner approvals needed LAMN microscopic margin, primary abscess selection, younger-adult interval policy, intermediate-size NET policy, and exact review of all new clinical versions
Integration stage-3 draft assumption, exact timing/source/concept admission, five paired-only cases, core initial-CT and appendicolith direct-repair gaps
Validation final focused file 25/25, typecheck exit 0, both JSON files parse, earlier missing-claim mapping repaired
Open work manager diff review, independent review, clinical decisions, exact acceptance/integration and GitHub checkpoint backup reminder
```

Local five-file worker checkpoint. The manager coordinates review, acceptance and the GitHub backup reminder. Owner direction "push to GitHub" authorizes the separate scoped backup workflow.
