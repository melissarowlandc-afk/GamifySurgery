# Biliary injury and malignancy — independent-review response

**Current response: 4 pass-preserved · 8 revised · 7 parked.** The active sidecar contains twelve self-contained single-node clinic cases. Four question/raw-node/header versions retain exact independent PASS; eight revisions need independent re-review. Every active version and clinical claim remains **needs_clinician_review**.

Only the five owned files were edited. This response makes no shared manifest, registry, runtime, save, source-bank or release change. The original thirty-nine-row program audit is retained separately from these nineteen review dispositions.

## Assignment — complete original program rows

Topic biliary-injury-malignancy; wave 10; Biliary — injury, leak, cysts and malignancy.
Scope in: Bile-duct injury and postoperative leak, anatomy-directed repair/referral, congenital duct cysts, gallbladder neoplasia and extrahepatic cholangiocarcinoma.
Scope out: Stone clearance and cholecystitis belong to gallbladder-duct-stones. Intrahepatic tumors belong to liver-malignancy.
Priority: medium. Anatomical localization and tissue/stage boundaries support focused advanced HPB decisions.
Original assignment: 39 primary inventory rows /39 exact variants; 13 registered identities, 32 live node rows, seven retained drafts, no supplied topic holds or unkeyed slots. Two secondary anesthesia-history rows remain context only. The complete original records and frozen clinical/PASS references follow.

```json
{
  "slug": "biliary-injury-malignancy",
  "title": "Biliary — injury, leak, cysts and malignancy",
  "wave": 10,
  "taxonomy": {
    "slug": "biliary-injury-malignancy",
    "title": "Biliary — injury, leak, cysts and malignancy",
    "priority": "medium",
    "scopeIn": "Bile-duct injury and postoperative leak, anatomy-directed repair/referral, congenital duct cysts, gallbladder neoplasia and extrahepatic cholangiocarcinoma.",
    "scopeOut": "Stone clearance and cholecystitis belong to gallbladder-duct-stones. Intrahepatic tumors belong to liver-malignancy.",
    "priorityReason": "Anatomical localization and tissue/stage boundaries support focused advanced HPB decisions.",
    "researchAgenda": [
      "Injury recognition and repair/referral timing",
      "Gallbladder cancer depth and additional resection",
      "Duct level, resectability and tissue-acquisition boundaries"
    ],
    "counts": {
      "liveConcepts": 10,
      "liveNodes": 32,
      "liveCases": 25,
      "liveVariants": 32,
      "liveAcceptedNodes": 2,
      "liveOriginalNodes": 30,
      "registeredConcepts": 13,
      "registeredWithoutLiveNodes": 3,
      "drafts": 7,
      "draftVariants": 7,
      "draftConcepts": 5,
      "explicitOwnerHeldVersions": 0,
      "unassembledDraftVariants": 1,
      "unkeyedParkedSlots": 0,
      "withheldTeachingPoints": 0,
      "liveClinicalConcepts": 10
    },
    "coverageSignal": "partial",
    "coverageReason": "Live identities cover part of this scope. The research agenda flags breadth to check, and the topic worker must judge redundancy and question quality.",
    "testingWeightBasis": "Owner-directed editorial estimate of general-surgery testing relevance. No exam percentages or official blueprint weights are asserted.",
    "workerLane": [
      "packages/clinical-content/src/question-topic-biliary-injury-malignancy-20261111.ts",
      "packages/clinical-content/src/question-topic-biliary-injury-malignancy-20261111.test.ts",
      "docs/research/question-topic-biliary-injury-malignancy-20261111.json",
      "docs/research/question-topic-biliary-injury-malignancy-20261111.md",
      "docs/research/sources-question-topic-biliary-injury-malignancy-20261111.json"
    ],
    "wave": 10
  },
  "boundaryTaxonomy": [
    {
      "slug": "liver-malignancy",
      "title": "Liver — primary tumors and metastases",
      "priority": "high",
      "scopeIn": "HCC, intrahepatic cholangiocarcinoma, liver metastases, staging, liver reserve, resectability and liver-directed versus transplant-referral decisions.",
      "scopeOut": "Extrahepatic duct and gallbladder cancer belong to biliary-injury-malignancy. General graft selection and rejection belong to transplant-immunosuppression.",
      "priorityReason": "Oncologic anatomy and functional reserve create consequential competing treatment choices.",
      "researchAgenda": [
        "Metastatic liver disease resectability",
        "HCC therapy beyond simple eligibility recognition",
        "Future liver remnant and combined oncologic constraints"
      ],
      "counts": {
        "liveConcepts": 3,
        "liveNodes": 17,
        "liveCases": 16,
        "liveVariants": 15,
        "liveAcceptedNodes": 1,
        "liveOriginalNodes": 16,
        "registeredConcepts": 3,
        "registeredWithoutLiveNodes": 0,
        "drafts": 1,
        "draftVariants": 1,
        "draftConcepts": 1,
        "explicitOwnerHeldVersions": 0,
        "unassembledDraftVariants": 0,
        "unkeyedParkedSlots": 0,
        "withheldTeachingPoints": 0,
        "liveClinicalConcepts": 3
      },
      "coverageSignal": "thin",
      "coverageReason": "At most four distinct live clinical concept identities cover this scope. Variants repeat those identities.",
      "testingWeightBasis": "Owner-directed editorial estimate of general-surgery testing relevance. No exam percentages or official blueprint weights are asserted.",
      "workerLane": [
        "packages/clinical-content/src/question-topic-liver-malignancy-20261111.ts",
        "packages/clinical-content/src/question-topic-liver-malignancy-20261111.test.ts",
        "docs/research/question-topic-liver-malignancy-20261111.json",
        "docs/research/question-topic-liver-malignancy-20261111.md",
        "docs/research/sources-question-topic-liver-malignancy-20261111.json"
      ],
      "wave": 2
    },
    {
      "slug": "gallbladder-duct-stones",
      "title": "Biliary — gallstones, cholecystitis and duct stones",
      "priority": "high",
      "scopeIn": "Gallstone symptoms, acute cholecystitis/cholangitis, duct-stone probability and clearance, intraoperative anatomy, cholangiography and safe bailout.",
      "scopeOut": "Pancreatitis severity and pancreatitis-driven cholecystectomy timing belong to pancreas-acute-pancreatitis. Injury/leak, congenital duct lesions and cancer belong to biliary-injury-malignancy.",
      "priorityReason": "Very common operative care combines imaging, anatomy, source control and sequencing.",
      "researchAgenda": [
        "Cholangitis severity and drainage planning",
        "Critical-view and bailout interpretation",
        "Competing gallbladder and duct source decisions"
      ],
      "counts": {
        "liveConcepts": 13,
        "liveNodes": 39,
        "liveCases": 29,
        "liveVariants": 39,
        "liveAcceptedNodes": 5,
        "liveOriginalNodes": 34,
        "registeredConcepts": 13,
        "registeredWithoutLiveNodes": 0,
        "drafts": 21,
        "draftVariants": 21,
        "draftConcepts": 10,
        "explicitOwnerHeldVersions": 0,
        "unassembledDraftVariants": 3,
        "unkeyedParkedSlots": 0,
        "withheldTeachingPoints": 0,
        "liveClinicalConcepts": 13
      },
      "coverageSignal": "partial",
      "coverageReason": "Live identities cover part of this scope. The research agenda flags breadth to check, and the topic worker must judge redundancy and question quality.",
      "testingWeightBasis": "Owner-directed editorial estimate of general-surgery testing relevance. No exam percentages or official blueprint weights are asserted.",
      "workerLane": [
        "packages/clinical-content/src/question-topic-gallbladder-duct-stones-20261111.ts",
        "packages/clinical-content/src/question-topic-gallbladder-duct-stones-20261111.test.ts",
        "docs/research/question-topic-gallbladder-duct-stones-20261111.json",
        "docs/research/question-topic-gallbladder-duct-stones-20261111.md",
        "docs/research/sources-question-topic-gallbladder-duct-stones-20261111.json"
      ],
      "wave": 6
    }
  ],
  "snapshotCapturedAt": "2026-11-11T15:28:05.732Z",
  "programId": "question-topic-program.2026-11-11.v1",
  "baseline": {
    "id": "clinical.synthetic.prototype.v1",
    "manifestId": "question-ship.2026-11-10.v9",
    "manifestFile": "packages/clinical-content/src/question-ship-manifest.ts",
    "assemblyFile": "packages/clinical-content/src/synthetic-content.ts",
    "assemblyExport": "SYNTHETIC_CLINICAL_RELEASE",
    "catalogRegistryMeaning": "610 registered concept identities include 156 with no live node. Active coverage uses the 454 primaryConceptId identities actually scored in default-release nodes."
  },
  "programSha256": "a1c585199633d243bc8d7e2f166916e74253b6c4a1b1eeceb09efba871baf9e4",
  "startingCounts": {
    "liveConcepts": 10,
    "liveNodes": 32,
    "liveCases": 25,
    "liveVariants": 32,
    "liveAcceptedNodes": 2,
    "liveOriginalNodes": 30,
    "registeredConcepts": 13,
    "registeredWithoutLiveNodes": 3,
    "drafts": 7,
    "draftVariants": 7,
    "draftConcepts": 5,
    "explicitOwnerHeldVersions": 0,
    "unassembledDraftVariants": 1,
    "unkeyedParkedSlots": 0,
    "withheldTeachingPoints": 0,
    "liveClinicalConcepts": 10
  },
  "managerHandoff": "docs/handoffs/CURRENT_THREAD_HANDOFF.md",
  "managerMilestone": "Wave 10 topic program; research, full audit, self-contained authoring sidecar; manager owns independent review and integration",
  "inventory": [
    {
      "recordId": "inventory.e68aea67c9a08de2",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.choledochal-cyst.type-iva-combined-duct-dilation",
      "caseId": "case.choledochal-cyst.type-iva.2a",
      "nodeIds": [
        "node.choledochal-cyst.type-iva.2a"
      ],
      "variantIds": [
        "question.choledochal-cyst.type-iva.2a.v1"
      ],
      "chiefComplaint": "Bile duct imaging review",
      "taskTextShort": "Which Todani subtype fits?",
      "taskText": "Which Todani subtype fits?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 59,
        "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
          "line": 59,
          "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
          "line": 57,
          "export": "EARLY_GAME_CLINIC_BATCH_CASES",
          "locator": "exact identity literal"
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
        "claim.bile-duct-cyst.type-iva-anatomy"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.choledochal-cyst.type-iva.2a",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.f67864a9fd946206",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.choledochal-cyst.type-iva-combined-duct-dilation",
      "caseId": "case.choledochal-cyst.type-iva.2b",
      "nodeIds": [
        "node.choledochal-cyst.type-iva.2b"
      ],
      "variantIds": [
        "question.choledochal-cyst.type-iva.2b.v1"
      ],
      "chiefComplaint": "Bile duct imaging review",
      "taskTextShort": "Which classification is appropriate?",
      "taskText": "Which classification is appropriate?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 59,
        "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
          "line": 59,
          "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
          "line": 60,
          "export": "EARLY_GAME_CLINIC_BATCH_CASES",
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
        "claim.bile-duct-cyst.type-iva-anatomy"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.choledochal-cyst.type-iva.2b",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.5f92b5b6600b885d",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.choledochal-cyst.type-iva-combined-duct-dilation",
      "caseId": "case.choledochal-cyst.type-iva.2c",
      "nodeIds": [
        "node.choledochal-cyst.type-iva.2c"
      ],
      "variantIds": [
        "question.choledochal-cyst.type-iva.2c.v1"
      ],
      "chiefComplaint": "Bile duct imaging review",
      "taskTextShort": "Which anatomic distribution should the clinic team expect on the reviewed imaging?",
      "taskText": "Which anatomic distribution should the clinic team expect on the reviewed imaging?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 59,
        "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
          "line": 59,
          "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
          "line": 57,
          "export": "EARLY_GAME_CLINIC_BATCH_CASES",
          "locator": "exact identity literal"
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
        "claim.bile-duct-cyst.type-iva-anatomy"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.choledochal-cyst.type-iva.2c",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.9df3d834318a09d6",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.choledochal-cyst.type-iva-combined-duct-dilation",
      "caseId": "case.choledochal-cyst.type-iva.2d",
      "nodeIds": [
        "node.choledochal-cyst.type-iva.2d"
      ],
      "variantIds": [
        "question.choledochal-cyst.type-iva.2d.v1"
      ],
      "chiefComplaint": "Bile duct imaging review",
      "taskTextShort": "Which statement correctly identifies Type IVA?",
      "taskText": "Which statement correctly identifies Type IVA?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
        "line": 59,
        "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
          "line": 59,
          "export": "EARLY_GAME_CLINIC_BATCH_QUESTION_VARIANTS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
          "line": 60,
          "export": "EARLY_GAME_CLINIC_BATCH_CASES",
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
        "claim.bile-duct-cyst.type-iva-anatomy"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.choledochal-cyst.type-iva.2d",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.5d4036e8aa3221ac",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.distal-cholangiocarcinoma.resection-selection",
      "caseId": "case.distal-cholangiocarcinoma.active-location",
      "nodeIds": [
        "node.distal-cholangiocarcinoma.management-c.v1"
      ],
      "variantIds": [
        "question.distal-cholangiocarcinoma.management-c.v1"
      ],
      "chiefComplaint": "Bile-duct cancer consultation",
      "taskTextShort": "Which tumor location explains this hospital HPB surgery referral for a Whipple procedure?",
      "taskText": "Which tumor location explains this hospital HPB surgery referral for a Whipple procedure?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
        "line": 59,
        "export": "ROW_111_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
          "line": 59,
          "export": "ROW_111_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
          "line": 292,
          "export": "ROW_111_CASES",
          "locator": "exact identity literal"
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
        "claim.distal-cholangiocarcinoma.distal-whipple-referral",
        "claim.distal-cholangiocarcinoma.constrained-pathway-boundaries"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.distal-cholangiocarcinoma.management-c.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.306e2bcb207cf236",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.distal-cholangiocarcinoma.resection-selection",
      "caseId": "case.distal-cholangiocarcinoma.active-treatment",
      "nodeIds": [
        "node.distal-cholangiocarcinoma.management-b.v1"
      ],
      "variantIds": [
        "question.distal-cholangiocarcinoma.management-b.v1"
      ],
      "chiefComplaint": "Bile-duct cancer consultation",
      "taskTextShort": "Refer to hospital HPB surgery for which operation?",
      "taskText": "Refer to hospital HPB surgery for which operation?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
        "line": 58,
        "export": "ROW_111_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
          "line": 58,
          "export": "ROW_111_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
          "line": 291,
          "export": "ROW_111_CASES",
          "locator": "exact identity literal"
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
        "claim.distal-cholangiocarcinoma.distal-whipple-referral",
        "claim.distal-cholangiocarcinoma.constrained-pathway-boundaries"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.distal-cholangiocarcinoma.management-b.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.6629a371de8ad80e",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gallbladder-polyp.initial-management-category",
      "caseId": "case.gallbladder-polyp.12mm-wall-thickening",
      "nodeIds": [
        "node.gallbladder-polyp.12mm-wall-thickening.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.12mm-wall-thickening.v1"
      ],
      "chiefComplaint": "Gallbladder polyp review",
      "taskTextShort": "Which initial management category fits this report?",
      "taskText": "Which initial management category fits this report?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
        "line": 66,
        "export": "ROW_119_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 66,
          "export": "ROW_119_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 261,
          "export": "ROW_119_CASES",
          "locator": "exact identity literal"
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
        "claim.gallbladder-polyp.european-sru-car-threshold-disagreement",
        "claim.gallbladder-polyp.approved-concordant-management-categories"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gallbladder-polyp.12mm-wall-thickening.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.5a62203634e72327",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gallbladder-polyp.initial-management-category",
      "caseId": "case.gallbladder-polyp.16mm",
      "nodeIds": [
        "node.gallbladder-polyp.16mm.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.16mm.v1"
      ],
      "chiefComplaint": "Gallbladder polyp review",
      "taskTextShort": "Which initial management category fits this report?",
      "taskText": "Which initial management category fits this report?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
        "line": 65,
        "export": "ROW_119_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 65,
          "export": "ROW_119_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 242,
          "export": "ROW_119_CASES",
          "locator": "exact identity literal"
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
        "claim.gallbladder-polyp.european-sru-car-threshold-disagreement",
        "claim.gallbladder-polyp.approved-concordant-management-categories"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gallbladder-polyp.16mm.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.e221144e777e9a41",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gallbladder-polyp.initial-management-category",
      "caseId": "case.gallbladder-polyp.4mm-thin-stalk",
      "nodeIds": [
        "node.gallbladder-polyp.4mm-thin-stalk.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.4mm-thin-stalk.v1"
      ],
      "chiefComplaint": "Gallbladder polyp review",
      "taskTextShort": "Which initial management category fits this report?",
      "taskText": "Which initial management category fits this report?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
        "line": 68,
        "export": "ROW_119_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 68,
          "export": "ROW_119_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 295,
          "export": "ROW_119_CASES",
          "locator": "exact identity literal"
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
        "claim.gallbladder-polyp.european-sru-car-threshold-disagreement",
        "claim.gallbladder-polyp.approved-concordant-management-categories"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gallbladder-polyp.4mm-thin-stalk.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.16559f31bdb1bf7f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gallbladder-polyp.initial-management-category",
      "caseId": "case.gallbladder-polyp.8mm-thick-stalk",
      "nodeIds": [
        "node.gallbladder-polyp.8mm-thick-stalk.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.8mm-thick-stalk.v1"
      ],
      "chiefComplaint": "Gallbladder polyp review",
      "taskTextShort": "Which initial management category fits this report?",
      "taskText": "Which initial management category fits this report?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
        "line": 67,
        "export": "ROW_119_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 67,
          "export": "ROW_119_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 276,
          "export": "ROW_119_CASES",
          "locator": "exact identity literal"
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
        "claim.gallbladder-polyp.european-sru-car-threshold-disagreement",
        "claim.gallbladder-polyp.approved-concordant-management-categories"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gallbladder-polyp.8mm-thick-stalk.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.6946d69e1ddcb98b",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gallbladder-polyp.initial-management-category",
      "caseId": "case.gallbladder-polyp.select-surgical-profile",
      "nodeIds": [
        "node.gallbladder-polyp.select-surgical-profile.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.select-surgical-profile.v1"
      ],
      "chiefComplaint": "Gallbladder polyp review",
      "taskTextShort": "Which report profile warrants cholecystectomy evaluation now?",
      "taskText": "Which report profile warrants cholecystectomy evaluation now?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
        "line": 69,
        "export": "ROW_119_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 69,
          "export": "ROW_119_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 310,
          "export": "ROW_119_CASES",
          "locator": "exact identity literal"
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
        "claim.gallbladder-polyp.european-sru-car-threshold-disagreement",
        "claim.gallbladder-polyp.approved-concordant-management-categories"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gallbladder-polyp.select-surgical-profile.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.257e12d8f7d64120",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gallbladder-polyp.initial-management-category",
      "caseId": "case.gallbladder-polyp.select-surveillance-profile",
      "nodeIds": [
        "node.gallbladder-polyp.select-surveillance-profile.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.select-surveillance-profile.v1"
      ],
      "chiefComplaint": "Gallbladder polyp review",
      "taskTextShort": "Which report profile warrants ultrasound surveillance?",
      "taskText": "Which report profile warrants ultrasound surveillance?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
        "line": 70,
        "export": "ROW_119_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 70,
          "export": "ROW_119_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 329,
          "export": "ROW_119_CASES",
          "locator": "exact identity literal"
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
        "claim.gallbladder-polyp.european-sru-car-threshold-disagreement",
        "claim.gallbladder-polyp.approved-concordant-management-categories"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gallbladder-polyp.select-surveillance-profile.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.680cf2572fc17ed0",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [
        "anesthesia-analgesia-pharmacology"
      ],
      "secondaryTags": [],
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
      "nodeIds": [
        "node.gs028e.mis-principles.c3-phrenic-pathway.1"
      ],
      "variantIds": [
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6"
      ],
      "chiefComplaint": "Postoperative bile leak",
      "taskTextShort": "Which endoscopic intervention should be planned for {patientName}?",
      "taskText": "Which endoscopic intervention should be planned for {patientName}?",
      "status": "live accepted",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": {
        "acceptanceId": "B2B01",
        "sourceView": "batch2b-round2",
        "decisionFile": "docs/research/question-bank-batch2b-manager-decision-20261105.md"
      },
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
        "line": 12,
        "export": "QUESTION_BANK_BATCH2B_ROUND2_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
          "line": 12,
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
        "claim.early.bile-leak.minor-leak-ercp-stent",
        "claim.early.bile-leak.ce-mrcp-anatomic-localization",
        "claim.qbp2b.r2.b2b01.application",
        "claim.qbp2b.r2.leak-anticoagulation",
        "claim.qbp2b.r2.bile-leak-plastic-versus-metal"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": true,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.28aa36e6bf42b7f7",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028g.incidental-gallbladder.t1a-depth",
      "caseId": "case.gs028g.incidental-gallbladder.c1-not-in-situ",
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.c1-not-in-situ.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.t1a-depth.v3"
      ],
      "chiefComplaint": "Pathology explanation",
      "taskTextShort": "Which T category describes this shallow but invasive gallbladder carcinoma?",
      "taskText": "Which T category describes this shallow but invasive gallbladder carcinoma?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
        "line": 90,
        "export": "INCIDENTAL_GB_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 4,
          "export": "GS028_20261007_LEVEL3_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 37,
          "export": "GS028_20261007_LEVEL3_CASES",
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
        "claim.gs028g.incidental-gallbladder.t1a-depth",
        "claim.gs028g.incidental-gallbladder.t1a-depth.fact2",
        "claim.gs028g.incidental-gallbladder.t1a-depth.fact3"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028g.incidental-gallbladder.c1-not-in-situ.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.4ded7f802bcde1d4",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028g.incidental-gallbladder.t1a-depth",
      "caseId": "case.gs028g.incidental-gallbladder.c1-wall-layer-review",
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.c1-wall-layer-review.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.t1a-depth.v4"
      ],
      "chiefComplaint": "Cancer report review",
      "taskTextShort": "Which local T category follows from these specific gallbladder wall-layer findings?",
      "taskText": "Which local T category follows from these specific gallbladder wall-layer findings?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
        "line": 90,
        "export": "INCIDENTAL_GB_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 4,
          "export": "GS028_20261007_LEVEL3_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 37,
          "export": "GS028_20261007_LEVEL3_CASES",
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
        "claim.gs028g.incidental-gallbladder.t1a-depth",
        "claim.gs028g.incidental-gallbladder.t1a-depth.fact2",
        "claim.gs028g.incidental-gallbladder.t1a-depth.fact3"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028g.incidental-gallbladder.c1-wall-layer-review.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.0a5943063faf45a2",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028g.incidental-gallbladder.completely-resected-t1a",
      "caseId": "case.gs028g.incidental-gallbladder.c2-muscle-not-involved",
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.c2-muscle-not-involved.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.completely-resected-t1a.v4"
      ],
      "chiefComplaint": "Surgical planning review",
      "taskTextShort": "What is the appropriate surgical implication of these fully confirmed T1a findings?",
      "taskText": "What is the appropriate surgical implication of these fully confirmed T1a findings?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
        "line": 90,
        "export": "INCIDENTAL_GB_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 4,
          "export": "GS028_20261007_LEVEL3_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 37,
          "export": "GS028_20261007_LEVEL3_CASES",
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
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a",
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a.fact2",
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a.fact3"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028g.incidental-gallbladder.c2-muscle-not-involved.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.da1b615d34979a13",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028g.incidental-gallbladder.completely-resected-t1a",
      "caseId": "case.gs028g.incidental-gallbladder.c2-patient-choice-review",
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.c2-patient-choice-review.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.completely-resected-t1a.v3"
      ],
      "chiefComplaint": "Second opinion visit",
      "taskTextShort": "Which response best corrects a blanket radical-surgery recommendation for this confirmed T1a case?",
      "taskText": "Which response best corrects a blanket radical-surgery recommendation for this confirmed T1a case?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
        "line": 90,
        "export": "INCIDENTAL_GB_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 4,
          "export": "GS028_20261007_LEVEL3_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 37,
          "export": "GS028_20261007_LEVEL3_CASES",
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
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a",
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a.fact2",
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a.fact3"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028g.incidental-gallbladder.c2-patient-choice-review.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.22699f4b4a856bb7",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028g.incidental-gallbladder.completely-resected-t1a",
      "caseId": "case.gs028g.incidental-gallbladder.paired-deeper-sections",
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.paired-deeper-sections.2"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.completely-resected-t1a.v2"
      ],
      "chiefComplaint": "Report clarification",
      "taskTextShort": "What should these confirmed complete-resection findings change about the surgical discussion?",
      "taskText": "What should these confirmed complete-resection findings change about the surgical discussion?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
        "line": 90,
        "export": "INCIDENTAL_GB_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 4,
          "export": "GS028_20261007_LEVEL3_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 37,
          "export": "GS028_20261007_LEVEL3_CASES",
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
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a",
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a.fact2",
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a.fact3"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028g.incidental-gallbladder.paired-deeper-sections.2",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.4c7c59d082ab663d",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028g.incidental-gallbladder.t1a-depth",
      "caseId": "case.gs028g.incidental-gallbladder.paired-deeper-sections",
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.paired-deeper-sections.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.t1a-depth.v2"
      ],
      "chiefComplaint": "Report clarification",
      "taskTextShort": "What is the correct T category after invasive lamina-propria involvement is confirmed without muscle invasion?",
      "taskText": "What is the correct T category after invasive lamina-propria involvement is confirmed without muscle invasion?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
        "line": 90,
        "export": "INCIDENTAL_GB_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 4,
          "export": "GS028_20261007_LEVEL3_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 37,
          "export": "GS028_20261007_LEVEL3_CASES",
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
        "claim.gs028g.incidental-gallbladder.t1a-depth",
        "claim.gs028g.incidental-gallbladder.t1a-depth.fact2",
        "claim.gs028g.incidental-gallbladder.t1a-depth.fact3"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028g.incidental-gallbladder.paired-deeper-sections.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.8c42a2a9987cac65",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028g.incidental-gallbladder.completely-resected-t1a",
      "caseId": "case.gs028g.incidental-gallbladder.paired-lamina-only",
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.paired-lamina-only.2"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.completely-resected-t1a.v1"
      ],
      "chiefComplaint": "Pathology questions",
      "taskTextShort": "Which surgical plan fits completely resected margin-negative incidental T1a gallbladder cancer?",
      "taskText": "Which surgical plan fits completely resected margin-negative incidental T1a gallbladder cancer?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
        "line": 90,
        "export": "INCIDENTAL_GB_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 4,
          "export": "GS028_20261007_LEVEL3_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 37,
          "export": "GS028_20261007_LEVEL3_CASES",
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
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a",
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a.fact2",
        "claim.gs028g.incidental-gallbladder.completely-resected-t1a.fact3"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028g.incidental-gallbladder.paired-lamina-only.2",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.4a8ca03fdd38795f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.gs028g.incidental-gallbladder.t1a-depth",
      "caseId": "case.gs028g.incidental-gallbladder.paired-lamina-only",
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.paired-lamina-only.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.t1a-depth.v1"
      ],
      "chiefComplaint": "Pathology questions",
      "taskTextShort": "Which pathologic T category fits invasive gallbladder carcinoma confined to the lamina propria?",
      "taskText": "Which pathologic T category fits invasive gallbladder carcinoma confined to the lamina propria?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
        "line": 90,
        "export": "INCIDENTAL_GB_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 4,
          "export": "GS028_20261007_LEVEL3_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 37,
          "export": "GS028_20261007_LEVEL3_CASES",
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
        "claim.gs028g.incidental-gallbladder.t1a-depth",
        "claim.gs028g.incidental-gallbladder.t1a-depth.fact2",
        "claim.gs028g.incidental-gallbladder.t1a-depth.fact3"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028g.incidental-gallbladder.paired-lamina-only.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.8da6f7d6a149110d",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.distal-cholangiocarcinoma.resection-selection",
      "caseId": "case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection",
      "nodeIds": [
        "node.distal-cholangiocarcinoma.management-a.v1"
      ],
      "variantIds": [
        "question.distal-cholangiocarcinoma.management-a.v1"
      ],
      "chiefComplaint": "Painless jaundice",
      "taskTextShort": "Refer to hospital HPB surgery for which operation?",
      "taskText": "Refer to hospital HPB surgery for which operation?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
        "line": 57,
        "export": "ROW_111_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
          "line": 57,
          "export": "ROW_111_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/level-two-runtime.ts",
          "line": 254,
          "export": "LEVEL_TWO_RUNTIME_CASES",
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
        "claim.distal-cholangiocarcinoma.distal-whipple-referral",
        "claim.distal-cholangiocarcinoma.constrained-pathway-boundaries"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.distal-cholangiocarcinoma.management-a.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.532f7117dc95b02a",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.distal-cholangiocarcinoma.operable-tissue-evaluation",
      "caseId": "case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection",
      "nodeIds": [
        "node.distal-cholangiocarcinoma.workup-a.v1"
      ],
      "variantIds": [
        "question.distal-cholangiocarcinoma.workup-a.v1"
      ],
      "chiefComplaint": "Painless jaundice",
      "taskTextShort": "Which tissue-evaluation plan best fits this completed-imaging profile?",
      "taskText": "Which tissue-evaluation plan best fits this completed-imaging profile?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
        "line": 55,
        "export": "ROW_111_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
          "line": 55,
          "export": "ROW_111_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/level-two-runtime.ts",
          "line": 254,
          "export": "LEVEL_TWO_RUNTIME_CASES",
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
        "claim.distal-cholangiocarcinoma.operable-tissue-evaluation",
        "claim.distal-cholangiocarcinoma.constrained-pathway-boundaries"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.distal-cholangiocarcinoma.workup-a.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.7c6a21372d3d6a56",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n2r2.bile-leak-nonrepresented-duct-mapping",
      "caseId": "case.n2.bile-leak-duct-continuity-boundary.v1",
      "nodeIds": [
        "node.n2.bile-leak-duct-continuity-boundary.v1"
      ],
      "variantIds": [
        "question.n2.bile-leak-duct-continuity-boundary.v2"
      ],
      "chiefComplaint": "Persistent drain output",
      "taskTextShort": "Which next investigation should guide {patientName}'s persistent postoperative drainage?",
      "taskText": "Which next investigation should guide {patientName}'s persistent postoperative drainage?",
      "status": "live accepted",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": {
        "acceptanceId": "review.n2.bile-leak-duct-continuity-boundary.v2",
        "sourceView": "catalog",
        "decisionFile": "docs/research/question-new-manager-decision-20261105.md"
      },
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
        "line": 28,
        "export": "QUESTION_NEW_N2_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
          "line": 28,
          "export": "QUESTION_NEW_N2_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
          "line": 43,
          "export": "QUESTION_NEW_N2_ROUND3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
          "line": 36,
          "export": "QUESTION_NEW_N2_ROUND2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
          "line": 50,
          "export": "QUESTION_NEW_N2_ROUND3_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/pilot-content.ts",
          "line": 114,
          "export": "PILOT_CLINICAL_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 2,
      "sourceEvidenceClaimIds": [
        "claim.n2.695145c8addb",
        "claim.n2.0d75556834ce"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n2.bile-leak-duct-continuity-boundary.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.4c95e6229d175141",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.bile-leak.hepatobiliary-contrast-mrcp",
      "caseId": "case.post-cholecystectomy-bile-leak.delayed-recovery",
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.delayed-recovery.1"
      ],
      "variantIds": [
        "question.bile-leak.hepatobiliary-contrast-mrcp.v3"
      ],
      "chiefComplaint": "Slow surgical recovery",
      "taskTextShort": "Which test should be ordered next to localize {patientName}'s suspected leak and assess duct continuity?",
      "taskText": "Which test should be ordered next to localize {patientName}'s suspected leak and assess duct continuity?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
        "line": 16,
        "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 36,
          "export": "EARLY_LEVELS_20260913_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 43,
          "export": "EARLY_LEVELS_20260913_CASES",
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
        "claim.early.bile-leak.ce-mrcp-anatomic-localization"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.post-cholecystectomy-bile-leak.delayed-recovery.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.3f15d225b677a625",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.bile-leak.minor-leak-ercp-stent",
      "caseId": "case.post-cholecystectomy-bile-leak.delayed-recovery",
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.delayed-recovery.2"
      ],
      "variantIds": [
        "question.bile-leak.minor-leak-ercp-stent.v3"
      ],
      "chiefComplaint": "Slow surgical recovery",
      "taskTextShort": "Which treatment referral is appropriate for {patientName}'s persistent minor leak with preserved duct continuity?",
      "taskText": "Which treatment referral is appropriate for {patientName}'s persistent minor leak with preserved duct continuity?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
        "line": 16,
        "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 36,
          "export": "EARLY_LEVELS_20260913_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 43,
          "export": "EARLY_LEVELS_20260913_CASES",
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
        "claim.early.bile-leak.minor-leak-ercp-stent"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.post-cholecystectomy-bile-leak.delayed-recovery.2",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.87efcbf69c0ed3b3",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.bile-leak.hepatobiliary-contrast-mrcp",
      "caseId": "case.post-cholecystectomy-bile-leak.drain-output",
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.drain-output.1"
      ],
      "variantIds": [
        "question.bile-leak.hepatobiliary-contrast-mrcp.v1"
      ],
      "chiefComplaint": "Bilious drain output",
      "taskTextShort": "Which test should be ordered next to localize {patientName}'s suspected leak and assess duct continuity?",
      "taskText": "Which test should be ordered next to localize {patientName}'s suspected leak and assess duct continuity?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
        "line": 16,
        "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 36,
          "export": "EARLY_LEVELS_20260913_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 43,
          "export": "EARLY_LEVELS_20260913_CASES",
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
        "claim.early.bile-leak.ce-mrcp-anatomic-localization"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.post-cholecystectomy-bile-leak.drain-output.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.a14e0c155c07b00f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.bile-leak.minor-leak-ercp-stent",
      "caseId": "case.post-cholecystectomy-bile-leak.drain-output",
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.drain-output.2"
      ],
      "variantIds": [
        "question.bile-leak.minor-leak-ercp-stent.v1"
      ],
      "chiefComplaint": "Bilious drain output",
      "taskTextShort": "Which treatment referral is appropriate for {patientName}'s persistent minor leak with preserved duct continuity?",
      "taskText": "Which treatment referral is appropriate for {patientName}'s persistent minor leak with preserved duct continuity?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
        "line": 16,
        "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 36,
          "export": "EARLY_LEVELS_20260913_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 43,
          "export": "EARLY_LEVELS_20260913_CASES",
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
        "claim.early.bile-leak.minor-leak-ercp-stent"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.post-cholecystectomy-bile-leak.drain-output.2",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.5fe51fbe2ff4f868",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.bile-leak.hepatobiliary-contrast-mrcp",
      "caseId": "case.post-cholecystectomy-bile-leak.outside-followup",
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.outside-followup.1"
      ],
      "variantIds": [
        "question.bile-leak.hepatobiliary-contrast-mrcp.v4"
      ],
      "chiefComplaint": "Drain follow-up",
      "taskTextShort": "Which test should be ordered next to localize {patientName}'s suspected leak and assess duct continuity?",
      "taskText": "Which test should be ordered next to localize {patientName}'s suspected leak and assess duct continuity?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
        "line": 16,
        "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 36,
          "export": "EARLY_LEVELS_20260913_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 43,
          "export": "EARLY_LEVELS_20260913_CASES",
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
        "claim.early.bile-leak.ce-mrcp-anatomic-localization"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.post-cholecystectomy-bile-leak.outside-followup.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.4ebfdad274f79b1b",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.bile-leak.minor-leak-ercp-stent",
      "caseId": "case.post-cholecystectomy-bile-leak.outside-followup",
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.outside-followup.2"
      ],
      "variantIds": [
        "question.bile-leak.minor-leak-ercp-stent.v4"
      ],
      "chiefComplaint": "Drain follow-up",
      "taskTextShort": "Which treatment referral is appropriate for {patientName}'s persistent minor leak with preserved duct continuity?",
      "taskText": "Which treatment referral is appropriate for {patientName}'s persistent minor leak with preserved duct continuity?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
        "line": 16,
        "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 36,
          "export": "EARLY_LEVELS_20260913_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 43,
          "export": "EARLY_LEVELS_20260913_CASES",
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
        "claim.early.bile-leak.minor-leak-ercp-stent"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.post-cholecystectomy-bile-leak.outside-followup.2",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.e1dc228f52ae3bbc",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.bile-leak.hepatobiliary-contrast-mrcp",
      "caseId": "case.post-cholecystectomy-bile-leak.painful-recovery",
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.painful-recovery.1"
      ],
      "variantIds": [
        "question.bile-leak.hepatobiliary-contrast-mrcp.v2"
      ],
      "chiefComplaint": "Persistent abdominal pain",
      "taskTextShort": "Which test should be ordered next to localize {patientName}'s suspected leak and assess duct continuity?",
      "taskText": "Which test should be ordered next to localize {patientName}'s suspected leak and assess duct continuity?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
        "line": 16,
        "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 36,
          "export": "EARLY_LEVELS_20260913_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 43,
          "export": "EARLY_LEVELS_20260913_CASES",
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
        "claim.early.bile-leak.ce-mrcp-anatomic-localization"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.post-cholecystectomy-bile-leak.painful-recovery.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.1d88b1381ced424f",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.bile-leak.minor-leak-ercp-stent",
      "caseId": "case.post-cholecystectomy-bile-leak.painful-recovery",
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.painful-recovery.2"
      ],
      "variantIds": [
        "question.bile-leak.minor-leak-ercp-stent.v2"
      ],
      "chiefComplaint": "Persistent abdominal pain",
      "taskTextShort": "Which treatment referral is appropriate for {patientName}'s persistent minor leak with preserved duct continuity?",
      "taskText": "Which treatment referral is appropriate for {patientName}'s persistent minor leak with preserved duct continuity?",
      "status": "live original",
      "retentionState": "default release",
      "live": true,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
        "line": 16,
        "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 36,
          "export": "EARLY_LEVELS_20260913_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 16,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 43,
          "export": "EARLY_LEVELS_20260913_CASES",
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
        "claim.early.bile-leak.minor-leak-ercp-stent"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.post-cholecystectomy-bile-leak.painful-recovery.2",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.94d038c4bfefef55",
      "inventoryKind": "unassembled authored variant",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "conceptId": "concept.distal-cholangiocarcinoma.operable-tissue-evaluation",
      "caseId": null,
      "additionalCaseIds": [],
      "nodeIds": [],
      "variantIds": [
        "question.distal-cholangiocarcinoma.workup-b.v1"
      ],
      "chiefComplaint": null,
      "taskTextShort": "Which tissue-evaluation plan best fits this completed-imaging profile?",
      "taskText": "Which tissue-evaluation plan best fits this completed-imaging profile?",
      "status": "draft parked",
      "retentionState": "unassembled source-only definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "clinically_approved"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
        "line": 56,
        "export": "ROW_111_QUESTION_VARIANTS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
          "line": 56,
          "export": "ROW_111_QUESTION_VARIANTS",
          "locator": "exact identity literal"
        }
      ],
      "caseMaterializerLocations": [],
      "distinctRetainedNodeSerializations": null,
      "sourceEvidenceClaimIds": [
        "claim.distal-cholangiocarcinoma.operable-tissue-evaluation",
        "claim.distal-cholangiocarcinoma.constrained-pathway-boundaries"
      ],
      "bindingLimitation": "This source-only variant has no case/node binding in the scanned exports. Null fields preserve that absence.",
      "casePrimaryTopicSlug": null,
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": []
    },
    {
      "recordId": "inventory.71aa6bbba1fc3610",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [
        "anesthesia-analgesia-pharmacology"
      ],
      "secondaryTags": [],
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
      "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
      "nodeIds": [
        "node.gs028e.mis-principles.c3-phrenic-pathway.1"
      ],
      "variantIds": [
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3"
      ],
      "chiefComplaint": "Postoperative record review",
      "taskTextShort": "Which additional imaging request would best establish the duct anatomy for {patientName}'s treatment planning at that stage?",
      "taskText": "Which additional imaging request would best establish the duct anatomy for {patientName}'s treatment planning at that stage?",
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
        "line": 214,
        "export": "QUESTION_FLAG_ROUND2_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-round2-20261104-data.ts",
          "line": 214,
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
        "claim.gs028e.laparoscopy.diaphragm-phrenic-shoulder-pain",
        "claim.gs028e.laparoscopy.shoulder-pain-reassurance-boundary",
        "claim.early.bile-leak.ce-mrcp-anatomic-localization"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": true,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.4b8cf5326c26a50e",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [
        "anesthesia-analgesia-pharmacology"
      ],
      "secondaryTags": [],
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
      "nodeIds": [
        "node.gs028e.mis-principles.c3-phrenic-pathway.1"
      ],
      "variantIds": [
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4"
      ],
      "chiefComplaint": "Postoperative drainage review",
      "taskTextShort": "Which procedure should be requested next for {patientName}?",
      "taskText": "Which procedure should be requested next for {patientName}?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-flags-round3-20261104-data.ts",
        "line": 11,
        "export": "QUESTION_FLAG_ROUND3_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-round3-20261104-data.ts",
          "line": 11,
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
          "file": "packages/clinical-content/src/index.ts",
          "line": null,
          "export": "QUESTION_BANK_BATCH2A_ROUND2_RELEASE",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/synthetic-content.ts",
          "line": 1466,
          "export": "QUESTION_BANK_BATCH2A_ROUND2_RELEASE",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.early.bile-leak.ce-mrcp-anatomic-localization",
        "claim.early.bile-leak.minor-leak-ercp-stent"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": true,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.b8679a61f2cfdc20",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [
        "anesthesia-analgesia-pharmacology"
      ],
      "secondaryTags": [],
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
      "nodeIds": [
        "node.gs028e.mis-principles.c3-phrenic-pathway.1"
      ],
      "variantIds": [
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5"
      ],
      "chiefComplaint": "Postoperative drainage review",
      "taskTextShort": "Which intervention should the hepatobiliary team discuss for {patientName}?",
      "taskText": "Which intervention should the hepatobiliary team discuss for {patientName}?",
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
        "line": 12,
        "export": "QUESTION_BANK_BATCH2B_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
          "line": 12,
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
        "claim.early.bile-leak.ce-mrcp-anatomic-localization",
        "claim.early.bile-leak.minor-leak-ercp-stent",
        "claim.qbp2b.b2b01.application"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": true,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.dbb3f35cdf84e6d8",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n1.gallbladder-muscle-invasion-referral",
      "caseId": "case.n1.incidental-t1b.v1",
      "nodeIds": [
        "node.n1.incidental-t1b.v1"
      ],
      "variantIds": [
        "question.n1.incidental-t1b.v1"
      ],
      "chiefComplaint": "Gallbladder pathology review",
      "taskTextShort": "Which next plan should be arranged for {patientName}'s incidental gallbladder carcinoma?",
      "taskText": "Which next plan should be arranged for {patientName}'s incidental gallbladder carcinoma?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
        "line": 36,
        "export": "QUESTION_NEW_N1_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
          "line": 36,
          "export": "QUESTION_NEW_N1_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
          "line": 46,
          "export": "QUESTION_NEW_N1_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n1.0edd7f3d0ae9",
        "claim.n1.2682ba46b469",
        "claim.n1.49bbc47617f1"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n1.incidental-t1b.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.1c6c49bd8d00de6e",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n1.gallbladder-muscle-invasion-referral",
      "caseId": "case.n1.incidental-t1b.v1",
      "nodeIds": [
        "node.n1.incidental-t1b.v1"
      ],
      "variantIds": [
        "question.n1.incidental-t1b.v2"
      ],
      "chiefComplaint": "Gallbladder pathology review",
      "taskTextShort": "Which postoperative cancer-planning sequence best fits {patientName}'s revised pathology?",
      "taskText": "Which postoperative cancer-planning sequence best fits {patientName}'s revised pathology?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
        "line": 27,
        "export": "QUESTION_NEW_N1_ROUND2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
          "line": 27,
          "export": "QUESTION_NEW_N1_ROUND2_QUESTIONS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
          "line": 34,
          "export": "QUESTION_NEW_N1_ROUND3_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
          "line": 35,
          "export": "QUESTION_NEW_N1_ROUND2_CASES",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
          "line": 41,
          "export": "QUESTION_NEW_N1_ROUND3_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n1.0edd7f3d0ae9",
        "claim.n1.2682ba46b469",
        "claim.n1.49bbc47617f1"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n1.incidental-t1b.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.de0e9b9b78a3c1f2",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.n2.bile-leak-duct-continuity-boundary",
      "caseId": "case.n2.bile-leak-duct-continuity-boundary.v1",
      "nodeIds": [
        "node.n2.bile-leak-duct-continuity-boundary.v1"
      ],
      "variantIds": [
        "question.n2.bile-leak-duct-continuity-boundary.v1"
      ],
      "chiefComplaint": "Bile leak review",
      "taskTextShort": "Which finding requires HPB reassessment before {patientName}'s proposed minor-leak stent pathway is accepted?",
      "taskText": "Which finding requires HPB reassessment before {patientName}'s proposed minor-leak stent pathway is accepted?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
        "line": 30,
        "export": "QUESTION_NEW_N2_QUESTIONS",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
          "line": 30,
          "export": "QUESTION_NEW_N2_QUESTIONS",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
          "line": 37,
          "export": "QUESTION_NEW_N2_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.n2.695145c8addb",
        "claim.n2.0d75556834ce"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": false,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.n2.bile-leak-duct-continuity-boundary.v1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    }
  ],
  "concepts": [
    {
      "conceptId": "concept.bile-leak.hepatobiliary-contrast-mrcp",
      "displayName": "Hepatobiliary-contrast MRCP for bile-leak anatomy",
      "learningObjective": "Select hepatobiliary-contrast MRCP after CT to localize a stable postoperative bile leak and assess duct continuity.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.4c95e6229d175141",
        "inventory.87efcbf69c0ed3b3",
        "inventory.5fe51fbe2ff4f868",
        "inventory.e1dc228f52ae3bbc"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 13,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CONCEPTS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 12,
          "export": "EARLY_LEVELS_20260913_AUTHORING_CONCEPTS",
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
      "conceptId": "concept.bile-leak.minor-leak-ercp-stent",
      "displayName": "ERCP stent referral for a persistent minor bile leak",
      "learningObjective": "Refer a persistent minor leak with preserved duct continuity for ERCP and plastic-stent treatment.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.3f15d225b677a625",
        "inventory.a14e0c155c07b00f",
        "inventory.4ebfdad274f79b1b",
        "inventory.1d88b1381ced424f"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
          "line": 13,
          "export": "POST_CHOLECYSTECTOMY_BILE_LEAK_CONCEPTS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
          "line": 12,
          "export": "EARLY_LEVELS_20260913_AUTHORING_CONCEPTS",
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
      "conceptId": "concept.choledochal-cyst.type-iva-combined-duct-dilation",
      "displayName": "Type IVA congenital bile duct cyst anatomy",
      "learningObjective": "Identify Type IVA as the approved combined intrahepatic and extrahepatic cystic-dilatation pattern.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.e68aea67c9a08de2",
        "inventory.f67864a9fd946206",
        "inventory.5f92b5b6600b885d",
        "inventory.9df3d834318a09d6"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
          "line": 13,
          "export": "EARLY_GAME_CLINIC_BATCH_CONCEPTS",
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
      "conceptId": "concept.distal-cholangiocarcinoma.operable-tissue-evaluation",
      "displayName": "Operable distal cholangiocarcinoma tissue evaluation",
      "learningObjective": "For the approved completed-imaging distal-obstruction profile, select the constrained combined endoscopic tissue-evaluation plan without treating CA 19-9 as confirmation.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 1,
      "liveNodeOccurrences": 1,
      "inventoryRecordIds": [
        "inventory.532f7117dc95b02a",
        "inventory.94d038c4bfefef55"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
          "line": 28,
          "export": "ROW_111_CONCEPTS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/approved-data/level-two-runtime.ts",
          "line": 252,
          "export": "LEVEL_TWO_RUNTIME_CONCEPTS",
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
      "conceptId": "concept.distal-cholangiocarcinoma.resection-selection",
      "displayName": "Distal cholangiocarcinoma resection selection",
      "learningObjective": "For the approved resectable distal common-bile-duct profile, select hospital HPB referral for pancreaticoduodenectomy and distinguish the represented distal location.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 3,
      "liveNodeOccurrences": 3,
      "inventoryRecordIds": [
        "inventory.5d4036e8aa3221ac",
        "inventory.306e2bcb207cf236",
        "inventory.8da6f7d6a149110d"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
          "line": 29,
          "export": "ROW_111_CONCEPTS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/approved-data/level-two-runtime.ts",
          "line": 252,
          "export": "LEVEL_TWO_RUNTIME_CONCEPTS",
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
      "conceptId": "concept.gallbladder-polyp.initial-management-category",
      "displayName": "Initial gallbladder-polyp management category",
      "learningObjective": "Select the owner-approved initial management category for a completed incidental gallbladder-polyp ultrasound profile.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 6,
      "liveNodeOccurrences": 6,
      "inventoryRecordIds": [
        "inventory.6629a371de8ad80e",
        "inventory.5a62203634e72327",
        "inventory.e221144e777e9a41",
        "inventory.16559f31bdb1bf7f",
        "inventory.6946d69e1ddcb98b",
        "inventory.257e12d8f7d64120"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
          "line": 28,
          "export": "ROW_119_CONCEPT",
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
      "conceptId": "concept.gs028g.incidental-gallbladder.completely-resected-t1a",
      "displayName": "Completely resected incidental T1a gallbladder cancer",
      "learningObjective": "Avoid automatic radical re-resection after expert confirmation of completely removed margin-negative T1a gallbladder carcinoma.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.0a5943063faf45a2",
        "inventory.da1b615d34979a13",
        "inventory.22699f4b4a856bb7",
        "inventory.8c42a2a9987cac65"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 34,
          "export": "GS028_20261007_LEVEL3_AUTHORING_CONCEPTS",
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
      "conceptId": "concept.gs028g.incidental-gallbladder.t1a-depth",
      "displayName": "Gallbladder lamina-propria invasion",
      "learningObjective": "Identify gallbladder carcinoma confined to the lamina propria as T1a, distinguishing muscular invasion from in-situ disease.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live original",
      "liveCases": 4,
      "liveNodeOccurrences": 4,
      "inventoryRecordIds": [
        "inventory.28aa36e6bf42b7f7",
        "inventory.4ded7f802bcde1d4",
        "inventory.4c7c59d082ab663d",
        "inventory.4a8ca03fdd38795f"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
          "line": 90,
          "export": "INCIDENTAL_GB_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
          "line": 34,
          "export": "GS028_20261007_LEVEL3_AUTHORING_CONCEPTS",
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
      "conceptId": "concept.n1.gallbladder-muscle-invasion-referral",
      "displayName": "Incidental gallbladder muscle invasion",
      "learningObjective": "Recognize muscular invasion as outside the completely resected T1a observation pathway and obtain hepatobiliary surgical review.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.dbb3f35cdf84e6d8",
        "inventory.1c6c49bd8d00de6e"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
          "line": 23,
          "export": "QUESTION_NEW_N1_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
          "line": 55,
          "export": "QUESTION_NEW_N1_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
          "line": 57,
          "export": "QUESTION_NEW_N1_ROUND3_AUTHORING_CONCEPTS",
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
      "registryOnly": true
    },
    {
      "conceptId": "concept.n2.bile-leak-duct-continuity-boundary",
      "displayName": "Duct continuity before a minor-leak stent pathway",
      "learningObjective": "Recognize when demonstrated bile-duct discontinuity prevents applying the preserved-continuity minor-leak ERCP pathway without HPB reassessment.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.de0e9b9b78a3c1f2"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
          "line": 20,
          "export": "QUESTION_NEW_N2_AUTHORING_CONCEPTS",
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
      "registryOnly": true
    },
    {
      "conceptId": "concept.n2r2.bile-leak-nonrepresented-duct-mapping",
      "displayName": "Persistent bile drainage after a negative duct injection",
      "learningObjective": "Select anatomical localization when persistent bile drainage and an incompletely represented duct segment conflict with a negative main-duct injection.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live accepted",
      "liveCases": 1,
      "liveNodeOccurrences": 1,
      "inventoryRecordIds": [
        "inventory.7c6a21372d3d6a56"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
          "line": 57,
          "export": "QUESTION_NEW_N2_ROUND2_AUTHORING_CONCEPTS",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
          "line": 66,
          "export": "QUESTION_NEW_N2_ROUND3_AUTHORING_CONCEPTS",
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
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
      "displayName": "Plan imaging after a changed postlaparoscopy course",
      "learningObjective": "Interpret the postoperative course, then distinguish biliary leak detection from duct-anatomy localization in a stable CT-assessed record.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [
        "anesthesia-analgesia-pharmacology"
      ],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": false,
      "status": "draft parked",
      "liveCases": 0,
      "liveNodeOccurrences": 0,
      "inventoryRecordIds": [
        "inventory.71aa6bbba1fc3610"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-round2-20261104-data.ts",
          "line": 373,
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
      "registryOnly": true
    },
    {
      "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
      "displayName": "Apply leak anatomy to postcholecystectomy treatment",
      "learningObjective": "Interpret duct continuity and adequacy of drainage, then select a procedure for persistent minor leakage.",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [
        "anesthesia-analgesia-pharmacology"
      ],
      "registeredInDefaultRelease": true,
      "activeInDefaultRelease": true,
      "status": "live accepted",
      "liveCases": 1,
      "liveNodeOccurrences": 1,
      "inventoryRecordIds": [
        "inventory.680cf2572fc17ed0",
        "inventory.4b8cf5326c26a50e",
        "inventory.b8679a61f2cfdc20"
      ],
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-round3-20261104-data.ts",
          "line": 168,
          "export": "QUESTION_FLAG_ROUND3_CONCEPT_VERSIONS",
          "locator": "exact identity literal"
        },
        {
          "file": "packages/clinical-content/src/question-flags-round3-20261104.ts",
          "line": 8,
          "export": "QUESTION_FLAG_ROUND3_AUTHORING_CONCEPTS",
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
      "caseId": "case.choledochal-cyst.type-iva.2a",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.e68aea67c9a08de2"
      ],
      "nodeIds": [
        "node.choledochal-cyst.type-iva.2a"
      ],
      "variantIds": [
        "question.choledochal-cyst.type-iva.2a.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.choledochal-cyst.type-iva.2b",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.f67864a9fd946206"
      ],
      "nodeIds": [
        "node.choledochal-cyst.type-iva.2b"
      ],
      "variantIds": [
        "question.choledochal-cyst.type-iva.2b.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.choledochal-cyst.type-iva.2c",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.5f92b5b6600b885d"
      ],
      "nodeIds": [
        "node.choledochal-cyst.type-iva.2c"
      ],
      "variantIds": [
        "question.choledochal-cyst.type-iva.2c.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.choledochal-cyst.type-iva.2d",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.9df3d834318a09d6"
      ],
      "nodeIds": [
        "node.choledochal-cyst.type-iva.2d"
      ],
      "variantIds": [
        "question.choledochal-cyst.type-iva.2d.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.distal-cholangiocarcinoma.active-location",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.5d4036e8aa3221ac"
      ],
      "nodeIds": [
        "node.distal-cholangiocarcinoma.management-c.v1"
      ],
      "variantIds": [
        "question.distal-cholangiocarcinoma.management-c.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.distal-cholangiocarcinoma.active-treatment",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.306e2bcb207cf236"
      ],
      "nodeIds": [
        "node.distal-cholangiocarcinoma.management-b.v1"
      ],
      "variantIds": [
        "question.distal-cholangiocarcinoma.management-b.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gallbladder-polyp.12mm-wall-thickening",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.6629a371de8ad80e"
      ],
      "nodeIds": [
        "node.gallbladder-polyp.12mm-wall-thickening.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.12mm-wall-thickening.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gallbladder-polyp.16mm",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.5a62203634e72327"
      ],
      "nodeIds": [
        "node.gallbladder-polyp.16mm.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.16mm.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gallbladder-polyp.4mm-thin-stalk",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.e221144e777e9a41"
      ],
      "nodeIds": [
        "node.gallbladder-polyp.4mm-thin-stalk.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.4mm-thin-stalk.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gallbladder-polyp.8mm-thick-stalk",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.16559f31bdb1bf7f"
      ],
      "nodeIds": [
        "node.gallbladder-polyp.8mm-thick-stalk.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.8mm-thick-stalk.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gallbladder-polyp.select-surgical-profile",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.6946d69e1ddcb98b"
      ],
      "nodeIds": [
        "node.gallbladder-polyp.select-surgical-profile.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.select-surgical-profile.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gallbladder-polyp.select-surveillance-profile",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.257e12d8f7d64120"
      ],
      "nodeIds": [
        "node.gallbladder-polyp.select-surveillance-profile.v1"
      ],
      "variantIds": [
        "question.gallbladder-polyp.select-surveillance-profile.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [
        "anesthesia-analgesia-pharmacology"
      ],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.680cf2572fc17ed0",
        "inventory.f63553af67ef23df",
        "inventory.5fb76c9d6fb1bdc3",
        "inventory.71aa6bbba1fc3610",
        "inventory.4b8cf5326c26a50e",
        "inventory.b8679a61f2cfdc20"
      ],
      "nodeIds": [
        "node.gs028e.mis-principles.c3-phrenic-pathway.1"
      ],
      "variantIds": [
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6",
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2",
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r2",
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3",
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4",
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5"
      ],
      "crossTopic": true,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028g.incidental-gallbladder.c1-not-in-situ",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.28aa36e6bf42b7f7"
      ],
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.c1-not-in-situ.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.t1a-depth.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028g.incidental-gallbladder.c1-wall-layer-review",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.4ded7f802bcde1d4"
      ],
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.c1-wall-layer-review.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.t1a-depth.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028g.incidental-gallbladder.c2-muscle-not-involved",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.0a5943063faf45a2"
      ],
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.c2-muscle-not-involved.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.completely-resected-t1a.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028g.incidental-gallbladder.c2-patient-choice-review",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.da1b615d34979a13"
      ],
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.c2-patient-choice-review.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.completely-resected-t1a.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028g.incidental-gallbladder.paired-deeper-sections",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.22699f4b4a856bb7",
        "inventory.4c7c59d082ab663d"
      ],
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.paired-deeper-sections.2",
        "node.gs028g.incidental-gallbladder.paired-deeper-sections.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.completely-resected-t1a.v2",
        "question.gs028g.incidental-gallbladder.t1a-depth.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.gs028g.incidental-gallbladder.paired-lamina-only",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.8c42a2a9987cac65",
        "inventory.4a8ca03fdd38795f"
      ],
      "nodeIds": [
        "node.gs028g.incidental-gallbladder.paired-lamina-only.2",
        "node.gs028g.incidental-gallbladder.paired-lamina-only.1"
      ],
      "variantIds": [
        "question.gs028g.incidental-gallbladder.completely-resected-t1a.v1",
        "question.gs028g.incidental-gallbladder.t1a-depth.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.l2.distal-cholangiocarcinoma.deferred-eus-ercp-to-resection",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.8da6f7d6a149110d",
        "inventory.532f7117dc95b02a"
      ],
      "nodeIds": [
        "node.distal-cholangiocarcinoma.management-a.v1",
        "node.distal-cholangiocarcinoma.workup-a.v1"
      ],
      "variantIds": [
        "question.distal-cholangiocarcinoma.management-a.v1",
        "question.distal-cholangiocarcinoma.workup-a.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n1.incidental-t1b.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": false,
      "liveTopicSlugs": [],
      "inventoryRecordIds": [
        "inventory.dbb3f35cdf84e6d8",
        "inventory.1c6c49bd8d00de6e"
      ],
      "nodeIds": [
        "node.n1.incidental-t1b.v1"
      ],
      "variantIds": [
        "question.n1.incidental-t1b.v1",
        "question.n1.incidental-t1b.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.n2.bile-leak-duct-continuity-boundary.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.7c6a21372d3d6a56",
        "inventory.de0e9b9b78a3c1f2"
      ],
      "nodeIds": [
        "node.n2.bile-leak-duct-continuity-boundary.v1"
      ],
      "variantIds": [
        "question.n2.bile-leak-duct-continuity-boundary.v2",
        "question.n2.bile-leak-duct-continuity-boundary.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.post-cholecystectomy-bile-leak.delayed-recovery",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.4c95e6229d175141",
        "inventory.3f15d225b677a625"
      ],
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.delayed-recovery.1",
        "node.post-cholecystectomy-bile-leak.delayed-recovery.2"
      ],
      "variantIds": [
        "question.bile-leak.hepatobiliary-contrast-mrcp.v3",
        "question.bile-leak.minor-leak-ercp-stent.v3"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.post-cholecystectomy-bile-leak.drain-output",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.87efcbf69c0ed3b3",
        "inventory.a14e0c155c07b00f"
      ],
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.drain-output.1",
        "node.post-cholecystectomy-bile-leak.drain-output.2"
      ],
      "variantIds": [
        "question.bile-leak.hepatobiliary-contrast-mrcp.v1",
        "question.bile-leak.minor-leak-ercp-stent.v1"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.post-cholecystectomy-bile-leak.outside-followup",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.5fe51fbe2ff4f868",
        "inventory.4ebfdad274f79b1b"
      ],
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.outside-followup.1",
        "node.post-cholecystectomy-bile-leak.outside-followup.2"
      ],
      "variantIds": [
        "question.bile-leak.hepatobiliary-contrast-mrcp.v4",
        "question.bile-leak.minor-leak-ercp-stent.v4"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    },
    {
      "caseId": "case.post-cholecystectomy-bile-leak.painful-recovery",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "liveTopicSlugs": [
        "biliary-injury-malignancy"
      ],
      "inventoryRecordIds": [
        "inventory.e1dc228f52ae3bbc",
        "inventory.1d88b1381ced424f"
      ],
      "nodeIds": [
        "node.post-cholecystectomy-bile-leak.painful-recovery.1",
        "node.post-cholecystectomy-bile-leak.painful-recovery.2"
      ],
      "variantIds": [
        "question.bile-leak.hepatobiliary-contrast-mrcp.v2",
        "question.bile-leak.minor-leak-ercp-stent.v2"
      ],
      "crossTopic": false,
      "ownershipBasis": "Most live scored nodes, then alphabetical slug for a tie. Retained-only cases use all retained rows."
    }
  ],
  "nodeAssignments": [
    {
      "nodeId": "node.choledochal-cyst.type-iva.2a",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.choledochal-cyst.type-iva-combined-duct-dilation"
      ],
      "inventoryRecordIds": [
        "inventory.e68aea67c9a08de2"
      ]
    },
    {
      "nodeId": "node.choledochal-cyst.type-iva.2b",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.choledochal-cyst.type-iva-combined-duct-dilation"
      ],
      "inventoryRecordIds": [
        "inventory.f67864a9fd946206"
      ]
    },
    {
      "nodeId": "node.choledochal-cyst.type-iva.2c",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.choledochal-cyst.type-iva-combined-duct-dilation"
      ],
      "inventoryRecordIds": [
        "inventory.5f92b5b6600b885d"
      ]
    },
    {
      "nodeId": "node.choledochal-cyst.type-iva.2d",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.choledochal-cyst.type-iva-combined-duct-dilation"
      ],
      "inventoryRecordIds": [
        "inventory.9df3d834318a09d6"
      ]
    },
    {
      "nodeId": "node.distal-cholangiocarcinoma.management-a.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.distal-cholangiocarcinoma.resection-selection"
      ],
      "inventoryRecordIds": [
        "inventory.8da6f7d6a149110d"
      ]
    },
    {
      "nodeId": "node.distal-cholangiocarcinoma.management-b.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.distal-cholangiocarcinoma.resection-selection"
      ],
      "inventoryRecordIds": [
        "inventory.306e2bcb207cf236"
      ]
    },
    {
      "nodeId": "node.distal-cholangiocarcinoma.management-c.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.distal-cholangiocarcinoma.resection-selection"
      ],
      "inventoryRecordIds": [
        "inventory.5d4036e8aa3221ac"
      ]
    },
    {
      "nodeId": "node.distal-cholangiocarcinoma.workup-a.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.distal-cholangiocarcinoma.operable-tissue-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.532f7117dc95b02a"
      ]
    },
    {
      "nodeId": "node.gallbladder-polyp.12mm-wall-thickening.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.6629a371de8ad80e"
      ]
    },
    {
      "nodeId": "node.gallbladder-polyp.16mm.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.5a62203634e72327"
      ]
    },
    {
      "nodeId": "node.gallbladder-polyp.4mm-thin-stalk.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.e221144e777e9a41"
      ]
    },
    {
      "nodeId": "node.gallbladder-polyp.8mm-thick-stalk.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.16559f31bdb1bf7f"
      ]
    },
    {
      "nodeId": "node.gallbladder-polyp.select-surgical-profile.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.6946d69e1ddcb98b"
      ]
    },
    {
      "nodeId": "node.gallbladder-polyp.select-surveillance-profile.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.257e12d8f7d64120"
      ]
    },
    {
      "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [
        "anesthesia-analgesia-pharmacology"
      ],
      "live": true,
      "conceptIds": [
        "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
        "concept.postlaparoscopy.benign-referred-shoulder-pain",
        "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1"
      ],
      "inventoryRecordIds": [
        "inventory.680cf2572fc17ed0",
        "inventory.f63553af67ef23df",
        "inventory.5fb76c9d6fb1bdc3",
        "inventory.71aa6bbba1fc3610",
        "inventory.4b8cf5326c26a50e",
        "inventory.b8679a61f2cfdc20"
      ]
    },
    {
      "nodeId": "node.gs028g.incidental-gallbladder.c1-not-in-situ.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.t1a-depth"
      ],
      "inventoryRecordIds": [
        "inventory.28aa36e6bf42b7f7"
      ]
    },
    {
      "nodeId": "node.gs028g.incidental-gallbladder.c1-wall-layer-review.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.t1a-depth"
      ],
      "inventoryRecordIds": [
        "inventory.4ded7f802bcde1d4"
      ]
    },
    {
      "nodeId": "node.gs028g.incidental-gallbladder.c2-muscle-not-involved.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
      ],
      "inventoryRecordIds": [
        "inventory.0a5943063faf45a2"
      ]
    },
    {
      "nodeId": "node.gs028g.incidental-gallbladder.c2-patient-choice-review.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
      ],
      "inventoryRecordIds": [
        "inventory.da1b615d34979a13"
      ]
    },
    {
      "nodeId": "node.gs028g.incidental-gallbladder.paired-deeper-sections.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.t1a-depth"
      ],
      "inventoryRecordIds": [
        "inventory.4c7c59d082ab663d"
      ]
    },
    {
      "nodeId": "node.gs028g.incidental-gallbladder.paired-deeper-sections.2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
      ],
      "inventoryRecordIds": [
        "inventory.22699f4b4a856bb7"
      ]
    },
    {
      "nodeId": "node.gs028g.incidental-gallbladder.paired-lamina-only.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.t1a-depth"
      ],
      "inventoryRecordIds": [
        "inventory.4a8ca03fdd38795f"
      ]
    },
    {
      "nodeId": "node.gs028g.incidental-gallbladder.paired-lamina-only.2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
      ],
      "inventoryRecordIds": [
        "inventory.8c42a2a9987cac65"
      ]
    },
    {
      "nodeId": "node.n1.incidental-t1b.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1.gallbladder-muscle-invasion-referral"
      ],
      "inventoryRecordIds": [
        "inventory.dbb3f35cdf84e6d8",
        "inventory.1c6c49bd8d00de6e"
      ]
    },
    {
      "nodeId": "node.n2.bile-leak-duct-continuity-boundary.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.n2r2.bile-leak-nonrepresented-duct-mapping",
        "concept.n2.bile-leak-duct-continuity-boundary"
      ],
      "inventoryRecordIds": [
        "inventory.7c6a21372d3d6a56",
        "inventory.de0e9b9b78a3c1f2"
      ]
    },
    {
      "nodeId": "node.post-cholecystectomy-bile-leak.delayed-recovery.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.hepatobiliary-contrast-mrcp"
      ],
      "inventoryRecordIds": [
        "inventory.4c95e6229d175141"
      ]
    },
    {
      "nodeId": "node.post-cholecystectomy-bile-leak.delayed-recovery.2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.minor-leak-ercp-stent"
      ],
      "inventoryRecordIds": [
        "inventory.3f15d225b677a625"
      ]
    },
    {
      "nodeId": "node.post-cholecystectomy-bile-leak.drain-output.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.hepatobiliary-contrast-mrcp"
      ],
      "inventoryRecordIds": [
        "inventory.87efcbf69c0ed3b3"
      ]
    },
    {
      "nodeId": "node.post-cholecystectomy-bile-leak.drain-output.2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.minor-leak-ercp-stent"
      ],
      "inventoryRecordIds": [
        "inventory.a14e0c155c07b00f"
      ]
    },
    {
      "nodeId": "node.post-cholecystectomy-bile-leak.outside-followup.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.hepatobiliary-contrast-mrcp"
      ],
      "inventoryRecordIds": [
        "inventory.5fe51fbe2ff4f868"
      ]
    },
    {
      "nodeId": "node.post-cholecystectomy-bile-leak.outside-followup.2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.minor-leak-ercp-stent"
      ],
      "inventoryRecordIds": [
        "inventory.4ebfdad274f79b1b"
      ]
    },
    {
      "nodeId": "node.post-cholecystectomy-bile-leak.painful-recovery.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.hepatobiliary-contrast-mrcp"
      ],
      "inventoryRecordIds": [
        "inventory.e1dc228f52ae3bbc"
      ]
    },
    {
      "nodeId": "node.post-cholecystectomy-bile-leak.painful-recovery.2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.minor-leak-ercp-stent"
      ],
      "inventoryRecordIds": [
        "inventory.1d88b1381ced424f"
      ]
    }
  ],
  "variantAssignments": [
    {
      "variantId": "question.bile-leak.hepatobiliary-contrast-mrcp.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.hepatobiliary-contrast-mrcp"
      ],
      "inventoryRecordIds": [
        "inventory.87efcbf69c0ed3b3"
      ]
    },
    {
      "variantId": "question.bile-leak.hepatobiliary-contrast-mrcp.v2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.hepatobiliary-contrast-mrcp"
      ],
      "inventoryRecordIds": [
        "inventory.e1dc228f52ae3bbc"
      ]
    },
    {
      "variantId": "question.bile-leak.hepatobiliary-contrast-mrcp.v3",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.hepatobiliary-contrast-mrcp"
      ],
      "inventoryRecordIds": [
        "inventory.4c95e6229d175141"
      ]
    },
    {
      "variantId": "question.bile-leak.hepatobiliary-contrast-mrcp.v4",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.hepatobiliary-contrast-mrcp"
      ],
      "inventoryRecordIds": [
        "inventory.5fe51fbe2ff4f868"
      ]
    },
    {
      "variantId": "question.bile-leak.minor-leak-ercp-stent.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.minor-leak-ercp-stent"
      ],
      "inventoryRecordIds": [
        "inventory.a14e0c155c07b00f"
      ]
    },
    {
      "variantId": "question.bile-leak.minor-leak-ercp-stent.v2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.minor-leak-ercp-stent"
      ],
      "inventoryRecordIds": [
        "inventory.1d88b1381ced424f"
      ]
    },
    {
      "variantId": "question.bile-leak.minor-leak-ercp-stent.v3",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.minor-leak-ercp-stent"
      ],
      "inventoryRecordIds": [
        "inventory.3f15d225b677a625"
      ]
    },
    {
      "variantId": "question.bile-leak.minor-leak-ercp-stent.v4",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.bile-leak.minor-leak-ercp-stent"
      ],
      "inventoryRecordIds": [
        "inventory.4ebfdad274f79b1b"
      ]
    },
    {
      "variantId": "question.choledochal-cyst.type-iva.2a.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.choledochal-cyst.type-iva-combined-duct-dilation"
      ],
      "inventoryRecordIds": [
        "inventory.e68aea67c9a08de2"
      ]
    },
    {
      "variantId": "question.choledochal-cyst.type-iva.2b.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.choledochal-cyst.type-iva-combined-duct-dilation"
      ],
      "inventoryRecordIds": [
        "inventory.f67864a9fd946206"
      ]
    },
    {
      "variantId": "question.choledochal-cyst.type-iva.2c.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.choledochal-cyst.type-iva-combined-duct-dilation"
      ],
      "inventoryRecordIds": [
        "inventory.5f92b5b6600b885d"
      ]
    },
    {
      "variantId": "question.choledochal-cyst.type-iva.2d.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.choledochal-cyst.type-iva-combined-duct-dilation"
      ],
      "inventoryRecordIds": [
        "inventory.9df3d834318a09d6"
      ]
    },
    {
      "variantId": "question.distal-cholangiocarcinoma.management-a.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.distal-cholangiocarcinoma.resection-selection"
      ],
      "inventoryRecordIds": [
        "inventory.8da6f7d6a149110d"
      ]
    },
    {
      "variantId": "question.distal-cholangiocarcinoma.management-b.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.distal-cholangiocarcinoma.resection-selection"
      ],
      "inventoryRecordIds": [
        "inventory.306e2bcb207cf236"
      ]
    },
    {
      "variantId": "question.distal-cholangiocarcinoma.management-c.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.distal-cholangiocarcinoma.resection-selection"
      ],
      "inventoryRecordIds": [
        "inventory.5d4036e8aa3221ac"
      ]
    },
    {
      "variantId": "question.distal-cholangiocarcinoma.workup-a.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.distal-cholangiocarcinoma.operable-tissue-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.532f7117dc95b02a"
      ]
    },
    {
      "variantId": "question.distal-cholangiocarcinoma.workup-b.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.distal-cholangiocarcinoma.operable-tissue-evaluation"
      ],
      "inventoryRecordIds": [
        "inventory.94d038c4bfefef55"
      ]
    },
    {
      "variantId": "question.gallbladder-polyp.12mm-wall-thickening.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.6629a371de8ad80e"
      ]
    },
    {
      "variantId": "question.gallbladder-polyp.16mm.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.5a62203634e72327"
      ]
    },
    {
      "variantId": "question.gallbladder-polyp.4mm-thin-stalk.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.e221144e777e9a41"
      ]
    },
    {
      "variantId": "question.gallbladder-polyp.8mm-thick-stalk.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.16559f31bdb1bf7f"
      ]
    },
    {
      "variantId": "question.gallbladder-polyp.select-surgical-profile.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.6946d69e1ddcb98b"
      ]
    },
    {
      "variantId": "question.gallbladder-polyp.select-surveillance-profile.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gallbladder-polyp.initial-management-category"
      ],
      "inventoryRecordIds": [
        "inventory.257e12d8f7d64120"
      ]
    },
    {
      "variantId": "question.gs028g.incidental-gallbladder.completely-resected-t1a.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
      ],
      "inventoryRecordIds": [
        "inventory.8c42a2a9987cac65"
      ]
    },
    {
      "variantId": "question.gs028g.incidental-gallbladder.completely-resected-t1a.v2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
      ],
      "inventoryRecordIds": [
        "inventory.22699f4b4a856bb7"
      ]
    },
    {
      "variantId": "question.gs028g.incidental-gallbladder.completely-resected-t1a.v3",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
      ],
      "inventoryRecordIds": [
        "inventory.da1b615d34979a13"
      ]
    },
    {
      "variantId": "question.gs028g.incidental-gallbladder.completely-resected-t1a.v4",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.completely-resected-t1a"
      ],
      "inventoryRecordIds": [
        "inventory.0a5943063faf45a2"
      ]
    },
    {
      "variantId": "question.gs028g.incidental-gallbladder.t1a-depth.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.t1a-depth"
      ],
      "inventoryRecordIds": [
        "inventory.4a8ca03fdd38795f"
      ]
    },
    {
      "variantId": "question.gs028g.incidental-gallbladder.t1a-depth.v2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.t1a-depth"
      ],
      "inventoryRecordIds": [
        "inventory.4c7c59d082ab663d"
      ]
    },
    {
      "variantId": "question.gs028g.incidental-gallbladder.t1a-depth.v3",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.t1a-depth"
      ],
      "inventoryRecordIds": [
        "inventory.28aa36e6bf42b7f7"
      ]
    },
    {
      "variantId": "question.gs028g.incidental-gallbladder.t1a-depth.v4",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.gs028g.incidental-gallbladder.t1a-depth"
      ],
      "inventoryRecordIds": [
        "inventory.4ded7f802bcde1d4"
      ]
    },
    {
      "variantId": "question.n1.incidental-t1b.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1.gallbladder-muscle-invasion-referral"
      ],
      "inventoryRecordIds": [
        "inventory.dbb3f35cdf84e6d8"
      ]
    },
    {
      "variantId": "question.n1.incidental-t1b.v2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n1.gallbladder-muscle-invasion-referral"
      ],
      "inventoryRecordIds": [
        "inventory.1c6c49bd8d00de6e"
      ]
    },
    {
      "variantId": "question.n2.bile-leak-duct-continuity-boundary.v1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.n2.bile-leak-duct-continuity-boundary"
      ],
      "inventoryRecordIds": [
        "inventory.de0e9b9b78a3c1f2"
      ]
    },
    {
      "variantId": "question.n2.bile-leak-duct-continuity-boundary.v2",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.n2r2.bile-leak-nonrepresented-duct-mapping"
      ],
      "inventoryRecordIds": [
        "inventory.7c6a21372d3d6a56"
      ]
    },
    {
      "variantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1"
      ],
      "inventoryRecordIds": [
        "inventory.71aa6bbba1fc3610"
      ]
    },
    {
      "variantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2"
      ],
      "inventoryRecordIds": [
        "inventory.4b8cf5326c26a50e"
      ]
    },
    {
      "variantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": false,
      "conceptIds": [
        "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2"
      ],
      "inventoryRecordIds": [
        "inventory.b8679a61f2cfdc20"
      ]
    },
    {
      "variantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [],
      "live": true,
      "conceptIds": [
        "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2"
      ],
      "inventoryRecordIds": [
        "inventory.680cf2572fc17ed0"
      ]
    }
  ],
  "identityReuseNotes": [
    {
      "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
      "primaryTopicSlug": "biliary-injury-malignancy",
      "secondaryTopicSlugs": [
        "anesthesia-analgesia-pharmacology"
      ],
      "live": true,
      "conceptIds": [
        "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
        "concept.postlaparoscopy.benign-referred-shoulder-pain",
        "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1"
      ],
      "inventoryRecordIds": [
        "inventory.680cf2572fc17ed0",
        "inventory.f63553af67ef23df",
        "inventory.5fb76c9d6fb1bdc3",
        "inventory.71aa6bbba1fc3610",
        "inventory.4b8cf5326c26a50e",
        "inventory.b8679a61f2cfdc20"
      ]
    }
  ],
  "relatedSecondaryInventory": [
    {
      "recordId": "inventory.f63553af67ef23df",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "anesthesia-analgesia-pharmacology",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.postlaparoscopy.benign-referred-shoulder-pain",
      "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
      "nodeIds": [
        "node.gs028e.mis-principles.c3-phrenic-pathway.1"
      ],
      "variantIds": [
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2"
      ],
      "chiefComplaint": "Shoulder pain follow-up",
      "taskTextShort": "Which sensory pathway explains the diaphragm-to-shoulder referral discussed for this patient's benign symptom?",
      "taskText": "Which sensory pathway explains the diaphragm-to-shoulder referral discussed for this patient's benign symptom?",
      "status": "draft parked",
      "retentionState": "retained nonlive definition",
      "live": false,
      "declaredClinicalReviewStatuses": [
        "needs_clinician_review"
      ],
      "editorialAcceptance": null,
      "recordedHoldIds": [],
      "fileLocation": {
        "file": "packages/clinical-content/src/development-batch/2026-10-07-variety/mis-principles.ts",
        "line": 12,
        "export": "MIS_PRINCIPLES_FAMILY",
        "locator": "exported computed definition"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety/mis-principles.ts",
          "line": 12,
          "export": "MIS_PRINCIPLES_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety/variety-batch.ts",
          "line": 14,
          "export": "GS028_20261007_FAMILIES",
          "locator": "exported computed definition"
        }
      ],
      "caseMaterializerLocations": [
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety/mis-principles.ts",
          "line": 12,
          "export": "MIS_PRINCIPLES_FAMILY",
          "locator": "exported computed definition"
        },
        {
          "file": "packages/clinical-content/src/development-batch/2026-10-07-variety/variety-batch.ts",
          "line": 58,
          "export": "GS028_20261007_CASES",
          "locator": "exported computed definition"
        }
      ],
      "distinctRetainedNodeSerializations": 1,
      "sourceEvidenceClaimIds": [
        "claim.gs028e.laparoscopy.diaphragm-phrenic-shoulder-pain",
        "claim.gs028e.laparoscopy.shoulder-pain-reassurance-boundary"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": true,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    },
    {
      "recordId": "inventory.5fb76c9d6fb1bdc3",
      "inventoryKind": "materialized case/node",
      "primaryTopicSlug": "anesthesia-analgesia-pharmacology",
      "secondaryTopicSlugs": [],
      "secondaryTags": [],
      "conceptId": "concept.postlaparoscopy.benign-referred-shoulder-pain",
      "caseId": "case.gs028e.mis-principles.c3-phrenic-pathway",
      "nodeIds": [
        "node.gs028e.mis-principles.c3-phrenic-pathway.1"
      ],
      "variantIds": [
        "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r2"
      ],
      "chiefComplaint": "Shoulder ache",
      "taskTextShort": "Which nerve most likely carries the initiating afferent signal for {patientName}'s postoperative pain pattern?",
      "taskText": "Which nerve most likely carries the initiating afferent signal for {patientName}'s postoperative pain pattern?",
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
        "line": 132,
        "export": "QUESTION_FLAG_DEFINITIONS",
        "locator": "exact identity literal"
      },
      "fileLocations": [
        {
          "file": "packages/clinical-content/src/question-flags-20261104-data.ts",
          "line": 132,
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
        "claim.gs028e.laparoscopy.diaphragm-phrenic-shoulder-pain",
        "claim.gs028e.laparoscopy.shoulder-pain-reassurance-boundary"
      ],
      "casePrimaryTopicSlug": "biliary-injury-malignancy",
      "crossTopicCase": true,
      "canonicalNodeTopicAssignments": [
        {
          "nodeId": "node.gs028e.mis-principles.c3-phrenic-pathway.1",
          "primaryTopicSlug": "biliary-injury-malignancy"
        }
      ]
    }
  ],
  "recordedHolds": [],
  "unkeyedDraftSlots": [],
  "withheldTeachingPoints": [],
  "sourceHashes": [
    {
      "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
      "programSha256": "d0d467063de537b35945597e306fc3dac7eed431ed4db26cad790fd5030b2baa",
      "observedSha256": "d0d467063de537b35945597e306fc3dac7eed431ed4db26cad790fd5030b2baa"
    },
    {
      "file": "packages/clinical-content/src/pilot-content.ts",
      "programSha256": "2c0d3b7e5232eb9602640601e736aa79a0d2991be19a4258f89aa38d772ac963",
      "observedSha256": "2c0d3b7e5232eb9602640601e736aa79a0d2991be19a4258f89aa38d772ac963"
    },
    {
      "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
      "programSha256": "c04211c5e22ffca24fa89a445bc1c6758952a271fc79301523ef99352d794e89",
      "observedSha256": "c04211c5e22ffca24fa89a445bc1c6758952a271fc79301523ef99352d794e89"
    },
    {
      "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
      "programSha256": "a242c975cf3bd4bf9ba17b3c596951348f196d05da78b593e625488c2726d456",
      "observedSha256": "a242c975cf3bd4bf9ba17b3c596951348f196d05da78b593e625488c2726d456"
    },
    {
      "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104-data.ts",
      "programSha256": "32bad25a7d35431e7e8fb6c2f3868905097007c4e3512f2bb8b61430af4834df",
      "observedSha256": "32bad25a7d35431e7e8fb6c2f3868905097007c4e3512f2bb8b61430af4834df"
    },
    {
      "file": "packages/clinical-content/src/question-bank-batch2b-round2-20261104.ts",
      "programSha256": "358051fb4ad7441513e379f835cc6afd9d69a59aa2729a93fad594db55ea4dfe",
      "observedSha256": "358051fb4ad7441513e379f835cc6afd9d69a59aa2729a93fad594db55ea4dfe"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/authoring.ts",
      "programSha256": "c5258faba1591f1a49b455228ee642204d60c95789e38ab0e06cd378d8b4c2e8",
      "observedSha256": "c5258faba1591f1a49b455228ee642204d60c95789e38ab0e06cd378d8b4c2e8"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-10-07-level3/level3-batch.ts",
      "programSha256": "d19198326646857815e064a7ac5b464ab7fc5df5af21485a29dbfb45fcab52b7",
      "observedSha256": "d19198326646857815e064a7ac5b464ab7fc5df5af21485a29dbfb45fcab52b7"
    },
    {
      "file": "packages/clinical-content/src/approved-data/level-two-runtime.ts",
      "programSha256": "19779f672d643624074567e4834ed4b5ad7fe8bba9d3d0279f39eae28f23d6e5",
      "observedSha256": "19779f672d643624074567e4834ed4b5ad7fe8bba9d3d0279f39eae28f23d6e5"
    },
    {
      "file": "packages/clinical-content/src/question-new-n2-round2-20261104.ts",
      "programSha256": "90b905c378e0fa31a4f9bf003c62b0e7e5f820d069f417b61f4e5ca5c0a2493c",
      "observedSha256": "90b905c378e0fa31a4f9bf003c62b0e7e5f820d069f417b61f4e5ca5c0a2493c"
    },
    {
      "file": "packages/clinical-content/src/question-new-n2-round3-20261104.ts",
      "programSha256": "8c3e9b2f5d998b31d97414051911513ff4c5f1ed1581b1032210a37c5bf8bf25",
      "observedSha256": "8c3e9b2f5d998b31d97414051911513ff4c5f1ed1581b1032210a37c5bf8bf25"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-09-13/post-cholecystectomy-bile-leak.ts",
      "programSha256": "b9901b2ae16d49c046e5b2a028d24677e7cb11b349e61741c70b23a9b88cf818",
      "observedSha256": "b9901b2ae16d49c046e5b2a028d24677e7cb11b349e61741c70b23a9b88cf818"
    },
    {
      "file": "packages/clinical-content/src/development-batch/2026-09-13/early-levels-batch.ts",
      "programSha256": "99dbc44d73b6b030a4f6d50bcddf2236cdf797bac3fc1bde754a3bae2925e4d5",
      "observedSha256": "99dbc44d73b6b030a4f6d50bcddf2236cdf797bac3fc1bde754a3bae2925e4d5"
    },
    {
      "file": "packages/clinical-content/src/question-flags-round2-20261104-data.ts",
      "programSha256": "8b845ae0b85a328c5a5b384a7be17e885423b8372a0ddaa31a76c5b1e08deac9",
      "observedSha256": "8b845ae0b85a328c5a5b384a7be17e885423b8372a0ddaa31a76c5b1e08deac9"
    },
    {
      "file": "packages/clinical-content/src/question-flags-round2-20261104.ts",
      "programSha256": "8932e60db6762df66810ba0992766d2bc21ce9ffdc1bc0c0c8cc7c3e0322257d",
      "observedSha256": "8932e60db6762df66810ba0992766d2bc21ce9ffdc1bc0c0c8cc7c3e0322257d"
    },
    {
      "file": "packages/clinical-content/src/index.ts",
      "programSha256": "9b9217631c612cf22b5237808d4eedf0b065472d165190bfbcec2b691921ae5b",
      "observedSha256": "30d8f42e0ee1cbeb84a80985a78b1f5c263493c722b6626a2196723758ba45bd"
    },
    {
      "file": "packages/clinical-content/src/synthetic-content.ts",
      "programSha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
      "observedSha256": "8c76b4cb6c6458682b0b31023f1a214405733b2dd5b67f378d699a153e561b25"
    },
    {
      "file": "packages/clinical-content/src/question-flags-round3-20261104-data.ts",
      "programSha256": "b47081a164cdde7e0b2a9e7df35b32dfd658bb0772a75544ac2c1862cf6e9da2",
      "observedSha256": "b47081a164cdde7e0b2a9e7df35b32dfd658bb0772a75544ac2c1862cf6e9da2"
    },
    {
      "file": "packages/clinical-content/src/question-flags-round3-20261104.ts",
      "programSha256": "d32476015827e917e831564feafb40ef6ae60e85ea8d6c9fb643cf61707411e5",
      "observedSha256": "d32476015827e917e831564feafb40ef6ae60e85ea8d6c9fb643cf61707411e5"
    },
    {
      "file": "packages/clinical-content/src/question-bank-batch2b-20261104-data.ts",
      "programSha256": "5c03e84388207c06ba6e721741b7383cb78e460ab98da4ace4aef1a082795196",
      "observedSha256": "5c03e84388207c06ba6e721741b7383cb78e460ab98da4ace4aef1a082795196"
    },
    {
      "file": "packages/clinical-content/src/question-bank-batch2b-20261104.ts",
      "programSha256": "3d768de874bc821c1aa312d59c6f92b03717dec3f59555e1b61047d39733049d",
      "observedSha256": "3d768de874bc821c1aa312d59c6f92b03717dec3f59555e1b61047d39733049d"
    },
    {
      "file": "packages/clinical-content/src/question-new-n1-20261104.ts",
      "programSha256": "0d917b6501740fabdad2360dc4fdc0c7e1d142ffad2c0a38769de83382c60303",
      "observedSha256": "0d917b6501740fabdad2360dc4fdc0c7e1d142ffad2c0a38769de83382c60303"
    },
    {
      "file": "packages/clinical-content/src/question-new-n1-round2-20261104.ts",
      "programSha256": "14af52c517d802fd02c10b51e7d3a93e6d4febf40272fb3d2f154d2bc21fe093",
      "observedSha256": "14af52c517d802fd02c10b51e7d3a93e6d4febf40272fb3d2f154d2bc21fe093"
    },
    {
      "file": "packages/clinical-content/src/question-new-n1-round3-20261104.ts",
      "programSha256": "f7a6cba0ecd17c1e0d437f73268a65bdd1d6d2c7e3c058e510e4e02fd37d44d5",
      "observedSha256": "f7a6cba0ecd17c1e0d437f73268a65bdd1d6d2c7e3c058e510e4e02fd37d44d5"
    },
    {
      "file": "packages/clinical-content/src/question-new-n2-20261104.ts",
      "programSha256": "ef0f0ecadb8b46bbfdad31436d4f324d2221f064eb0f8c2545e5bfe33aec76bc",
      "observedSha256": "ef0f0ecadb8b46bbfdad31436d4f324d2221f064eb0f8c2545e5bfe33aec76bc"
    }
  ],
  "clinicalApprovals": [
    {
      "file": "packages/clinical-content/src/approved-data/early-game-clinic-batch.ts",
      "export": "ROW_066_087_109_CLINICAL_APPROVALS",
      "sha256": "32539e520dcc2934d2d7ad2809b4e81bf87b6db3fb35031d5aa46e5209f36776",
      "value": [
        {
          "id": "approval.melissa-rowland-md.owner-row-066.2026-08-31",
          "sourceRow": 66,
          "reviewer": "Melissa Rowland, MD",
          "reviewedOn": "2026-08-31",
          "contentVersion": "clinical.owner-rows-066-087-109.2026-08-31.1",
          "approvedConceptIds": [
            "concept.ipaa.pouchitis-common-post-ipaa-complication"
          ],
          "approvedPresentationVariantIds": [
            "presentation.ipaa.pouchitis.1a",
            "presentation.ipaa.pouchitis.1b",
            "presentation.ipaa.pouchitis.1c",
            "presentation.ipaa.pouchitis.1d"
          ],
          "approvedQuestionVariantIds": [
            "question.ipaa.pouchitis.1a.v1",
            "question.ipaa.pouchitis.1b.v1",
            "question.ipaa.pouchitis.1c.v1",
            "question.ipaa.pouchitis.1d.v1"
          ],
          "approvedEvidenceClaimIds": [],
          "approvedReleasePointIds": [
            "release.l0.clinic_evaluation"
          ],
          "runtimeAnswerShuffle": true,
          "decision": "approved"
        },
        {
          "id": "approval.melissa-rowland-md.owner-row-087.2026-08-31",
          "sourceRow": 87,
          "reviewer": "Melissa Rowland, MD",
          "reviewedOn": "2026-08-31",
          "contentVersion": "clinical.owner-rows-066-087-109.2026-08-31.1",
          "approvedConceptIds": [
            "concept.choledochal-cyst.type-iva-combined-duct-dilation"
          ],
          "approvedPresentationVariantIds": [
            "presentation.choledochal-cyst.type-iva.2a",
            "presentation.choledochal-cyst.type-iva.2b",
            "presentation.choledochal-cyst.type-iva.2c",
            "presentation.choledochal-cyst.type-iva.2d"
          ],
          "approvedQuestionVariantIds": [
            "question.choledochal-cyst.type-iva.2a.v1",
            "question.choledochal-cyst.type-iva.2b.v1",
            "question.choledochal-cyst.type-iva.2c.v1",
            "question.choledochal-cyst.type-iva.2d.v1"
          ],
          "approvedEvidenceClaimIds": [],
          "approvedReleasePointIds": [
            "release.l0.clinic_evaluation"
          ],
          "runtimeAnswerShuffle": true,
          "decision": "approved"
        },
        {
          "id": "approval.melissa-rowland-md.owner-row-109.2026-08-31",
          "sourceRow": 109,
          "reviewer": "Melissa Rowland, MD",
          "reviewedOn": "2026-08-31",
          "contentVersion": "clinical.owner-rows-066-087-109.2026-08-31.1",
          "approvedConceptIds": [
            "concept.anal-hsil.high-risk-hpv-association"
          ],
          "approvedPresentationVariantIds": [
            "presentation.anal-hsil.hpv.3a",
            "presentation.anal-hsil.hpv.3b",
            "presentation.anal-hsil.hpv.3c",
            "presentation.anal-hsil.hpv.3d"
          ],
          "approvedQuestionVariantIds": [
            "question.anal-hsil.hpv.3a.v1",
            "question.anal-hsil.hpv.3b.v1",
            "question.anal-hsil.hpv.3c.v1",
            "question.anal-hsil.hpv.3d.v1"
          ],
          "approvedEvidenceClaimIds": [],
          "approvedReleasePointIds": [
            "release.l0.clinic_evaluation"
          ],
          "runtimeAnswerShuffle": true,
          "decision": "approved"
        }
      ]
    },
    {
      "file": "packages/clinical-content/src/approved-data/distal-cholangiocarcinoma.ts",
      "export": "ROW_111_CLINICAL_APPROVAL",
      "sha256": "0f8630e4596854708977adc9ebb0211f2a64bf8e5038234c23fd52b39f7edb4e",
      "value": {
        "id": "approval.melissa-rowland-md.owner-row-111.2026-08-21",
        "reviewer": "Melissa Rowland, MD",
        "reviewerRole": "Surgeon",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-111.2026-08-21.1",
        "sourceProvenance": {
          "workbookFileName": "Gamify Surgery Concepts (4).xlsx",
          "sheetName": "Sheet1",
          "sourceRow": 111,
          "sourceRecordKey": "owner-concept.sheet1.row-111",
          "exactApprovalConversationDate": "2026-08-21"
        },
        "approvedConceptIds": [
          "concept.distal-cholangiocarcinoma.operable-tissue-evaluation",
          "concept.distal-cholangiocarcinoma.resection-selection"
        ],
        "approvedQuestionVariantIds": [
          "question.distal-cholangiocarcinoma.workup-a.v1",
          "question.distal-cholangiocarcinoma.workup-b.v1",
          "question.distal-cholangiocarcinoma.management-a.v1",
          "question.distal-cholangiocarcinoma.management-b.v1",
          "question.distal-cholangiocarcinoma.management-c.v1"
        ],
        "approvedReleasePointIds": [
          "release.l0.clinic_evaluation",
          "release.l2.endoscopy"
        ],
        "decision": "approved",
        "multiDecisionAssessment": {
          "status": "approved_two_decision_deferred_endoscopy_pathway",
          "rationale": "The combined pathway scores tissue evaluation and then resection selection. Only the separately approved treatment-only and reverse-location management variants are active at Level 0."
        }
      }
    },
    {
      "file": "packages/clinical-content/src/approved-data/gallbladder-polyp-management.ts",
      "export": "ROW_119_CLINICAL_APPROVAL",
      "sha256": "524f9d8d32242c6b4366f4bec3332fe10232c20f9898986fff80b0934739a388",
      "value": {
        "id": "approval.melissa-rowland-md.owner-row-119.2026-08-21",
        "reviewer": "Melissa Rowland, MD",
        "reviewerRole": "Surgeon",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-119.2026-08-21.1",
        "sourceProvenance": {
          "workbookFileName": "Gamify Surgery Concepts (4).xlsx",
          "sheetName": "Sheet1",
          "sourceRow": 119,
          "sourceRecordKey": "owner-concept.sheet1.row-119",
          "exactApprovalConversationDate": "2026-08-21"
        },
        "approvedConceptId": "concept.gallbladder-polyp.initial-management-category",
        "approvedConceptType": "management",
        "approvedPresentationVariantIds": [
          "presentation.gallbladder-polyp.16mm",
          "presentation.gallbladder-polyp.12mm-wall-thickening",
          "presentation.gallbladder-polyp.8mm-thick-stalk",
          "presentation.gallbladder-polyp.4mm-thin-stalk",
          "presentation.gallbladder-polyp.select-surgical-profile",
          "presentation.gallbladder-polyp.select-surveillance-profile"
        ],
        "approvedQuestionVariantIds": [
          "question.gallbladder-polyp.16mm.v1",
          "question.gallbladder-polyp.12mm-wall-thickening.v1",
          "question.gallbladder-polyp.8mm-thick-stalk.v1",
          "question.gallbladder-polyp.4mm-thin-stalk.v1",
          "question.gallbladder-polyp.select-surgical-profile.v1",
          "question.gallbladder-polyp.select-surveillance-profile.v1"
        ],
        "approvedEvidenceClaimIds": [
          "claim.gallbladder-polyp.european-sru-car-threshold-disagreement",
          "claim.gallbladder-polyp.approved-concordant-management-categories"
        ],
        "approvedReleasePointIds": [
          "release.l0.clinic_evaluation"
        ],
        "tutorialEligible": false,
        "decision": "approved",
        "approvedScopeDecisionId": "decision.owner-row-119.initial-management-category.2026-08-21",
        "multiDecisionAssessment": {
          "status": "single_decision_preferred",
          "rationale": "Each approved patient arrives with an ultrasound report. Ordering ultrasound, an exact surveillance schedule, and later intervention would be separate concepts."
        },
        "excludedElements": [
          "exact_surveillance_schedules",
          "older_workbook_hybrid_thresholds",
          "ethnicity_or_race_selection",
          "age_selection",
          "gallstones_or_cirrhosis_as_rules",
          "ultrasound_ordering",
          "multi_decision_encounter"
        ]
      }
    }
  ],
  "independentReviews": [
    {
      "file": "docs/research/question-bank-batch2b-review-20261104.json",
      "fileSha256": "ecdd8f84da56362bf9f644c8baec95ca90b00b560b27b00cd10df76fcd5ae76a",
      "decisions": [
        {
          "locator": "/0",
          "value": {
            "id": "B2B01",
            "title": "Select biliary decompression from the postoperative duct map",
            "verdict": "REVISE",
            "difficulty": "moderate",
            "twoStep": true,
            "cues": [],
            "fairness": [
              "Single-best-answer concern: the findings support a communicating postoperative bile leak with maintained duct continuity, but do not clearly resolve plastic stenting versus sphincterotomy. Stenting is a plausible best choice; I cannot establish its exclusive superiority from the displayed leak characterization. This is a ranking uncertainty, not a claim that stenting is incorrect.",
              "Importance: high; recognizing and managing a postoperative bile leak is practical general-surgery knowledge. Realism: hepatobiliary review is credible, but a patient bringing records while still eating and walking on the ward mixes clinic and inpatient viewpoints.",
              "F02: the original remote-nerve distractors and supplied shoulder-referral mechanism are fully removed. The replacement tests bile-leak intervention instead of referred-pain anatomy; flag-specific wording is resolved by replacement, but the new item is not fully acceptable.",
              "Review scope for this report: judgments use only each item's after Presentation, Current update, Exhibit, Task and Options; the standard and flag handoff supply the rubric and original concerns. Clinical rankings are offline reviewer judgments, not fresh source verification or Melissa Rowland's clinical approval. Difficulty is predicted, not measured.",
              "Cue interpretation throughout: a necessary raw clinical discriminator is not automatically an unfair cue. Empty cues means no independently exploitable surface cue was identified; an item can still be too easy through classic recognition or weak competitors. Difficulty and fairness comments distinguish those problems. No runtime rendering, prior feedback, source ledger, timing metadata or hidden author rationale was used to adjudicate the displayed items."
            ],
            "suggestions": [
              "Have the clinician adjudicate ERCP stent versus sphincterotomy for this exact leak pattern. Either supply a supported patient-specific discriminator or replace the overlapping intervention with a credible but distinguishable plan.",
              "Place the learner explicitly in the ongoing inpatient/hepatobiliary discussion; preserve the drainage response and duct-continuity observations.",
              "Retain the useful two steps: interpret leak anatomy, then select the appropriate access/intervention."
            ]
          },
          "sha256": "b3c39f07f9c3824cd201c8217b74c87072f92f016d0f3fe89853089f027be048"
        }
      ]
    },
    {
      "file": "docs/research/question-bank-batch2b-review2-20261104.json",
      "fileSha256": "80f5622d0d646d912243569003af5f734c02d1468a19d0a74656ab5122ad741f",
      "decisions": [
        {
          "locator": "/0",
          "value": {
            "id": "B2B01",
            "title": "Select leak diversion in a patient with a competing bleeding risk",
            "verdict": "PASS",
            "difficulty": "moderate",
            "twoStep": true,
            "cues": [],
            "fairness": [
              "The best offered intervention is plastic stenting: the resident must interpret a communicating stump leak with preserved main-duct continuity, then incorporate ongoing anticoagulation when comparing stenting with sphincterotomy. Covered metal stenting is a credible escalation error, although weaker than sphincterotomy here.",
              "Importance: high, practical postoperative complication management. Realism: the current ward setting and concurrent pulmonary embolus are coherent. The heparin record is duplicated but is decision-critical clinical information, not a nonmedical answer match.",
              "Owner flag F02: fully resolved at the wording level by replacement; the remote-nerve distractors and supplied referred-pain mechanism are absent. The replacement assesses bile-leak management, not the original anatomy objective.",
              "Scope for this entire report: all 40 packet items are covered, including 38 revisions and the two frozen PASS items. Clinical judgments use only the after Presentation, Current update, Exhibit, Task and Options; titles are identifiers, not learner cues. The standard, owner-flag handoff and first review provide review context. No author self-check, rationale, earlier/future feedback or hidden eligibility field establishes a verdict. The B2B24 image referenced by Exhibit was inspected.",
              "All clinical judgments are offline editorial assessments, not fresh source verification or Melissa Rowland's approval. Drafts remain needs_clinician_review. Difficulty is predicted for PGY-2/3, not measured. Necessary raw discriminators are not automatically unfair cues; an empty cues array does not imply that the item is difficult. Runtime waits, randomization, finite profiles and sequence leakage were outside this after-fields-only review."
            ],
            "suggestions": [
              "Preserve the duct-continuity and anticoagulation facts; the repeated heparin administration sentence can be consolidated without changing the decision."
            ]
          },
          "sha256": "b7bf52a7554e8c26c8e7b87ee19aea35e4c3d3352227011e98f7cf1109cae1d9"
        }
      ]
    },
    {
      "file": "docs/research/question-new-n2-review2-20261104.json",
      "fileSha256": "8071f59227a3deae6185238d7a3080d73803f0ac1d6a4e6e5ed51ccd20cd7d24",
      "decisions": [
        {
          "locator": "/19",
          "value": {
            "id": "review.n2.bile-leak-duct-continuity-boundary.v2",
            "title": "Duct continuity before a minor-leak stent pathway",
            "verdict": "PASS",
            "difficulty": "hard",
            "twoStep": true,
            "cues": [],
            "fairness": [
              "The learner must recognize the limits of the endoscopically filled tree, then choose an investigation that can address the separate branch and active biliary communication. A repeat injection and scintigraphic leak study are credible nearby errors with different limitations.",
              "The image exists, is legible, and agrees with its description. 'Junction not resolved' and the unrepresented branch identify genuine limits of the studies rather than prove a disconnected duct; that distinction must remain.",
              "Hepatobiliary-contrast MR cholangiography is a reasonable best offered next study. The current record does not prove a particular transection classification or make every repeat ERCP useless.",
              "Importance: high for bile-duct injury/source mapping, with specialist-level test selection making this a defensible stretch item. Realism: a drained, persistent postoperative leak can undergo planned specialist assessment; clinical stability and contrast eligibility would be checked in actual care."
            ],
            "suggestions": [
              "Retain both study panels and the distinction between unseen anatomy and proven discontinuity.",
              "Have the clinician verify the exact contrast-study indication and avoid feedback claiming the diagram proves duct transection. The present editorial PASS is not clinical sign-off."
            ]
          },
          "sha256": "c83882d56fb02397e4314039e42a74d1ee7c0de83cebca33ac12dc4379235203"
        }
      ]
    },
    {
      "file": "docs/research/question-new-n2-review3-20261104.json",
      "fileSha256": "6c85ccf58c7ad818d593af891d83c69b90abbd8f369cea81d073ed02fd36fa5a",
      "decisions": [
        {
          "locator": "/19",
          "value": {
            "id": "review.n2.bile-leak-duct-continuity-boundary.v2",
            "title": "Duct continuity before a minor-leak stent pathway",
            "verdict": "PASS",
            "difficulty": "hard",
            "twoStep": true,
            "cues": [],
            "fairness": [
              "The image was inspected and is legible. Contrast confined to the main communicating tree does not settle the unrepresented branch, and the noncontrast map leaves its junction unresolved. The learner must infer the coverage limitation and select a complementary anatomic/functional study.",
              "Hepatobiliary-contrast MR cholangiography is a defensible best offered study. Repeat retrograde injection may reproduce the same coverage limitation, while scintigraphy is less suited to the requested detailed anatomy. This ranking and feasibility merit hepatobiliary clinician review; no new source verification was performed.",
              "The labels identifying an unrepresented branch and unresolved junction describe the study limitations needed for fairness; they do not name the required contrast-enhanced examination.",
              "Importance: high for bile-duct injury recognition and referral; the precise imaging protocol is a stretch topic. Realism: ongoing drained bile with discrepant studies is plausible in a clinic-to-specialist pathway."
            ],
            "suggestions": [
              "Preserve the contrast distribution and unresolved branch, and ensure the clinical review confirms the intended next-study ranking. Do not present the schematic as a real patient image or imply that contrast excretion is guaranteed in every patient."
            ]
          },
          "sha256": "996f2170b7d463fef61529efc293bd11e43435f2bcdbd37e1617fc7e9d3b10e5"
        }
      ]
    },
    {
      "file": "docs/research/question-ship-preview-20261104.json",
      "fileSha256": "445637e568fde52083e1d54a195e2abcaf683178312b341e0d47a1b832405ead",
      "decisions": [
        {
          "locator": "/cases/21/nodes/0/acceptance",
          "value": {
            "acceptanceId": "review.n1.incidental-t1b.v2",
            "caseId": "case.n1.incidental-t1b.v1",
            "nodeId": "node.n1.incidental-t1b.v1",
            "questionVariantId": "question.n1.incidental-t1b.v2",
            "conceptId": "concept.n1.gallbladder-muscle-invasion-referral",
            "sourceView": "n1-round2",
            "decision": "docs/research/question-new-n1-review2-20261104.json"
          },
          "sha256": "cb77d7ceea9d67a55015910dd52f71adaa03d3732178b7799e18681866e3a3a9"
        },
        {
          "locator": "/cases/29/nodes/0/acceptance",
          "value": {
            "acceptanceId": "review.n2.bile-leak-duct-continuity-boundary.v2",
            "caseId": "case.n2.bile-leak-duct-continuity-boundary.v1",
            "nodeId": "node.n2.bile-leak-duct-continuity-boundary.v1",
            "questionVariantId": "question.n2.bile-leak-duct-continuity-boundary.v2",
            "conceptId": "concept.n2r2.bile-leak-nonrepresented-duct-mapping",
            "sourceView": "n2-round2",
            "decision": "docs/research/question-new-n2-review2-20261104.json"
          },
          "sha256": "d61cfc2e894fc0ed713a416d2b985c9a61b4ebd8d7cd344fe893fbfe3232bf25"
        }
      ]
    }
  ],
  "frozenReferences": [
    {
      "inventoryRecordId": "inventory.e68aea67c9a08de2",
      "questionVariantId": "question.choledochal-cyst.type-iva.2a.v1",
      "exactVersion": "clinical.owner-rows-066-087-109.2026-08-31.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-31",
        "contentVersion": "clinical.owner-rows-066-087-109.2026-08-31.1"
      },
      "questionSha256": "9ada06ebf35fcebc171ce1a0c202670a9531e3f262a2327297b413407f709be1",
      "nodeSha256": "5122e7f61d5ba2672fe9211e24f605a927cb183bbd05c514035f496dd23eecab",
      "caseSha256": "26918a31914781d4922b7269554e5817c0f20d4880fc442863a975e2a6bc60a6"
    },
    {
      "inventoryRecordId": "inventory.f67864a9fd946206",
      "questionVariantId": "question.choledochal-cyst.type-iva.2b.v1",
      "exactVersion": "clinical.owner-rows-066-087-109.2026-08-31.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-31",
        "contentVersion": "clinical.owner-rows-066-087-109.2026-08-31.1"
      },
      "questionSha256": "0e818e948578e4f8caa1b3c2ce6dc6aea0dd3b48201c173bac1ec1c9251401a2",
      "nodeSha256": "3a0fbc645da00773ad844ac383b8edba26e259277a29938e22b3ce7f062a15a2",
      "caseSha256": "29626109fb610c9fd736046bea1a5276a76788c4be9173a9c8cafae29a5c950f"
    },
    {
      "inventoryRecordId": "inventory.5f92b5b6600b885d",
      "questionVariantId": "question.choledochal-cyst.type-iva.2c.v1",
      "exactVersion": "clinical.owner-rows-066-087-109.2026-08-31.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-31",
        "contentVersion": "clinical.owner-rows-066-087-109.2026-08-31.1"
      },
      "questionSha256": "a9b53cbc13f2c67ab698070c6831c374a9c495e3718f2e37d6c063b5e6e30491",
      "nodeSha256": "eb2e6e94b14c0f6762c6bfb5964689d859be53939b5a3bd64bd0ee99b5219dc4",
      "caseSha256": "57bdeaff8d46831c16245244deaed9593a916fb5c34ed66f08680c7ad7ac053f"
    },
    {
      "inventoryRecordId": "inventory.9df3d834318a09d6",
      "questionVariantId": "question.choledochal-cyst.type-iva.2d.v1",
      "exactVersion": "clinical.owner-rows-066-087-109.2026-08-31.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-31",
        "contentVersion": "clinical.owner-rows-066-087-109.2026-08-31.1"
      },
      "questionSha256": "0d947a04447b38fa451c6e08ac6cc3456be162b8f85831c61f03dc3e546d3417",
      "nodeSha256": "54ea8d1c4eded4d4ec907ab11b21b426dec57d83d64e4aac58f8e336d9b93e23",
      "caseSha256": "51e7687ef614b38a9620302e9338cd40dc156182e62d9b8e951aebbb727b9a2a"
    },
    {
      "inventoryRecordId": "inventory.5d4036e8aa3221ac",
      "questionVariantId": "question.distal-cholangiocarcinoma.management-c.v1",
      "exactVersion": "clinical.owner-row-111.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-111.2026-08-21.1"
      },
      "questionSha256": "d249d9508b1259a5ecad374619aabfd5ce47d406215d92eb2bd5d8535e4213f6",
      "nodeSha256": "526d9e1774f0b979ea24e3c60efc9b3af07a908cca32aa23c42dab8298771bf9",
      "caseSha256": "e7d0e5946cb2c4381fcf8ba2603cd84691b6c1f066d8383ea056f562353f1af7"
    },
    {
      "inventoryRecordId": "inventory.306e2bcb207cf236",
      "questionVariantId": "question.distal-cholangiocarcinoma.management-b.v1",
      "exactVersion": "clinical.owner-row-111.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-111.2026-08-21.1"
      },
      "questionSha256": "b0cad7db42802ebf473a646c60fdc0df1c368a4678c827ece77e8c26b3c04bf0",
      "nodeSha256": "bdb8c86ce99d38b8593d0dd9ab3c5d96e57b2a7978003def029604900f56188a",
      "caseSha256": "569bc895c14bdf6fc50ea3953b34157feae6bf006ae430c57c992010f5d5ef0c"
    },
    {
      "inventoryRecordId": "inventory.6629a371de8ad80e",
      "questionVariantId": "question.gallbladder-polyp.12mm-wall-thickening.v1",
      "exactVersion": "clinical.owner-row-119.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-119.2026-08-21.1"
      },
      "questionSha256": "5b70c2f7a9e90208427608eba01d92f2347476d08eeea9bb659715ea61247a43",
      "nodeSha256": "cff0bd8131bdf3bbf24b5e4ad07a86818667cae2bcda010f2f730d1ef60d9742",
      "caseSha256": "a76ea8559a40d02f7f276dec04baa5d33827e563236fbaa385ebfce22b377794"
    },
    {
      "inventoryRecordId": "inventory.5a62203634e72327",
      "questionVariantId": "question.gallbladder-polyp.16mm.v1",
      "exactVersion": "clinical.owner-row-119.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-119.2026-08-21.1"
      },
      "questionSha256": "2523b8e03b16409503158efbad09e400a8e710c53c79748c17a02261906c2c9c",
      "nodeSha256": "2a190bd39bf887820b922fe0cb74925126bfb757fdd0f381e260554886ffd738",
      "caseSha256": "7d463660e90ca0b37c2a1551913699f332819ca4ef3cb636c383d3d9d2e9e458"
    },
    {
      "inventoryRecordId": "inventory.e221144e777e9a41",
      "questionVariantId": "question.gallbladder-polyp.4mm-thin-stalk.v1",
      "exactVersion": "clinical.owner-row-119.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-119.2026-08-21.1"
      },
      "questionSha256": "2879cda6cfe9b892990c9b8b54045062db3ed19ba7bd50101c44f9bf74c06a06",
      "nodeSha256": "2943f71d192977669623ed305c926a33774aaa7589c619a088dbec0d4763cf3c",
      "caseSha256": "d45a71fe3387fae22c2ebccaf5b7159a7bed92028f73750e641f26f3d6c0f536"
    },
    {
      "inventoryRecordId": "inventory.16559f31bdb1bf7f",
      "questionVariantId": "question.gallbladder-polyp.8mm-thick-stalk.v1",
      "exactVersion": "clinical.owner-row-119.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-119.2026-08-21.1"
      },
      "questionSha256": "22a716b727312e995afe3a5bd62f318ac101f4c3c47c42b3c199e225d67dfbae",
      "nodeSha256": "086a0c41722af1982ee3ae6e59d8ae223258086b8f08c684aa96192b3e9da79a",
      "caseSha256": "eafe18b97e8c4dd8601a4d8405916e6cfb31d0ff9056e72f5a4e1a8168feb5c5"
    },
    {
      "inventoryRecordId": "inventory.6946d69e1ddcb98b",
      "questionVariantId": "question.gallbladder-polyp.select-surgical-profile.v1",
      "exactVersion": "clinical.owner-row-119.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-119.2026-08-21.1"
      },
      "questionSha256": "bd21a6eba12e34cef926ac499e29ba49d9882abeda7b1eed606215cb8064450f",
      "nodeSha256": "16b95373d964ea902e82e5c55d372e545ce55702c7c2a96b59dc477442cfbe2a",
      "caseSha256": "d0a57858ed3804cbde389d0f84fb1f460be0195c22f0128388934d748a6400f8"
    },
    {
      "inventoryRecordId": "inventory.257e12d8f7d64120",
      "questionVariantId": "question.gallbladder-polyp.select-surveillance-profile.v1",
      "exactVersion": "clinical.owner-row-119.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-119.2026-08-21.1"
      },
      "questionSha256": "5183238d10f56775508aa8c24d33b83bb5eb41ca257bbb70057194c2f335fd56",
      "nodeSha256": "571dda551fa21825c7060f7d4df565672abb193343b0ca6bf176d1ca9ac1c532",
      "caseSha256": "83796846c54d19c3e4e539c8992fe0be6eb5cecb56cc5d2a9ed924da8dbf0285"
    },
    {
      "inventoryRecordId": "inventory.680cf2572fc17ed0",
      "questionVariantId": "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6",
      "exactVersion": "question-authoring.2026-11-04.batch2b.round2.v1",
      "kind": "independent_editorial_acceptance",
      "acceptanceId": "B2B01",
      "sourceView": "batch2b-round2",
      "decisionFile": "docs/research/question-bank-batch2b-manager-decision-20261105.md",
      "questionSha256": "aeffc8d6d7cf194b322c23ba9cf7323f90e2742216d69be8aecaaf390b71c103",
      "nodeSha256": "5681546571deb01e667fe2cd5d2483e24646e3a651e0566568e27223155f0d5d",
      "caseSha256": "f5a3670ab6ed9ff53a1b3489c40ea52419ab2ec230498fae3612c390fad9b295"
    },
    {
      "inventoryRecordId": "inventory.8da6f7d6a149110d",
      "questionVariantId": "question.distal-cholangiocarcinoma.management-a.v1",
      "exactVersion": "clinical.owner-row-111.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-111.2026-08-21.1"
      },
      "questionSha256": "a606c0e12c4cae4d65a4617deaf8d2366b65a69c8d678ff4e4761f95e728ecfc",
      "nodeSha256": "66c411fbeb39272540e59861602fc3db9d934a4573321ecf99762be5a1feb496",
      "caseSha256": "568d14b3c79fe96b6a5fa85adefaf0cd0fd5c3166cc5695be2a2ecdbfa653c31"
    },
    {
      "inventoryRecordId": "inventory.532f7117dc95b02a",
      "questionVariantId": "question.distal-cholangiocarcinoma.workup-a.v1",
      "exactVersion": "clinical.owner-row-111.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-111.2026-08-21.1"
      },
      "questionSha256": "be40e17e30a27e8a37fc77f1477a4ffd82a2b8846db4c87d926529103bb44cf3",
      "nodeSha256": "61c08a777e658c6b079d513a623d9e160afa942f6564be6dffee7c5fe4f6a317",
      "caseSha256": "568d14b3c79fe96b6a5fa85adefaf0cd0fd5c3166cc5695be2a2ecdbfa653c31"
    },
    {
      "inventoryRecordId": "inventory.7c6a21372d3d6a56",
      "questionVariantId": "question.n2.bile-leak-duct-continuity-boundary.v2",
      "exactVersion": "clinical.question-new-n2.2026-11-04.v2",
      "kind": "independent_editorial_acceptance",
      "acceptanceId": "review.n2.bile-leak-duct-continuity-boundary.v2",
      "sourceView": "catalog",
      "decisionFile": "docs/research/question-new-manager-decision-20261105.md",
      "questionSha256": "8e194d9959361af547ca2f58a62432dddaa1ebb2975d36e663c109e2433461e3",
      "nodeSha256": "a8043e81612e2b7bb7c8120916539b39bd6fece197614c11e4e9ad38e64087a5",
      "caseSha256": "3af69b867833ba382f2654448bcc2f8bd55c8fc49967282fbccca6482e51be1c"
    },
    {
      "inventoryRecordId": "inventory.94d038c4bfefef55",
      "questionVariantId": "question.distal-cholangiocarcinoma.workup-b.v1",
      "exactVersion": "clinical.owner-row-111.2026-08-21.1",
      "kind": "named_clinician_exact_version",
      "value": {
        "reviewer": "Melissa Rowland, MD",
        "reviewedOn": "2026-08-21",
        "contentVersion": "clinical.owner-row-111.2026-08-21.1"
      },
      "questionSha256": "257a4596ce1edca85821b0823165908a2129746ac7b0b8093e910479799418f7",
      "nodeSha256": "74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b",
      "caseSha256": "74234e98afe7498fb5daf1f36ac2d78acc339464f950703b8c019892f982b90b"
    }
  ]
}
```

## Current state, provenance and progress

Independent review: docs/research/question-topic-biliary-injury-malignancy-review-20261111.json. SHA256 4f6e363d678d441b88fbca9d3ae867a13bcc66992e237b3f70c49dc254dfe2d7. Its nineteen exact decisions are copied in reviewRound.reviewDecisions in the JSON packet. The reviewed v1 materialized questions, nodes, cases, concepts and timing data are retained in reviewRound.snapshot.

Original release drift remains an intake observation, not a fresh global-count assertion. Shared acceptance and other topic work may have advanced during this response. Exact original topic inputs remain guarded where unchanged; no global release epoch was rebound.

```json
{
  "planning": "question-ship.2026-11-10.v9: 145 authority rows; 1151 cases / 1462 nodes / 610 registered concepts",
  "observed": {
    "capturedAt": "2026-11-12T00:17:37.838Z",
    "manifestId": "question-ship.2026-11-11.v12",
    "manifestRows": 404,
    "cases": 1250,
    "nodes": 1514,
    "concepts": 813,
    "manifestSha256": "c891343f89e29b0009e65c4f464b5ca694f9fce0f43eb5960b7bc5542dbba7bc"
  },
  "assignedLiveAtPlanning": 32,
  "assignedLiveAtIntake": 32,
  "changedInputFiles": [
    {
      "file": "packages/clinical-content/src/index.ts",
      "programSha256": "9b9217631c612cf22b5237808d4eedf0b065472d165190bfbcec2b691921ae5b",
      "observedSha256": "30d8f42e0ee1cbeb84a80985a78b1f5c263493c722b6626a2196723758ba45bd"
    },
    {
      "file": "packages/clinical-content/src/synthetic-content.ts",
      "programSha256": "5fffcaa36446800168f2c3362cff2c357f7726a9f4cc44afdb065f804ec630dd",
      "observedSha256": "8c76b4cb6c6458682b0b31023f1a214405733b2dd5b67f378d699a153e561b25"
    }
  ],
  "interpretation": "Assigned source modules are unchanged. Shared index and assembly hashes drifted through concurrent accepted topics. Do not assert a stale global release epoch in focused tests."
}
```

- Intake: complete. Read AGENTS.md, full question-authoring.2026-11-08.v15, worker brief, taxonomy and assigned rows. Root instructions only; write ownership limited to five files.
- Research, audit and authoring: complete. Eight sources, 34 atomic claims; every assigned row reconciled; nineteen active proposals with concrete manual gates; five teaching boundaries withheld.
- Focused validation: complete_with_out_of_lane_typecheck_failure. Focused8/8, exact question/node/case materialization hashes and JSON parse pass. Initial package tsc reported pancreas(997,48) TS2322; latest run stops on a concurrent skin-topic syntax error(309,1) TS1005, preventing a complete semantic check. No out-of-lane repair.
- Closing reconciliation: complete. All39primary variants and40retained serializations accounted for. The duplicate differs only in object-key order. Closing focused regression remains8/8; five files only.
- Independent review response intake: in_progress. Captured all nineteen source candidates and exact exports, four PASS freezes and complete review notes. Plan: one supported revision per returned item; park unresolved rankings or persistent easy items; split every retained PASS from returned companions.
- One review-response authoring cycle: complete. Eight returned items revised with supported discriminators; seven single attempts parked for unresolved rankings or persistent easy difficulty. Four PASS items remain frozen. Next: rebuild self-contained export cases and validation.
- Composition and evidence closure: complete. Twelve standalone active cases: four exact PASS and eight revisions. Seven attempts parked. Three changed clinical meanings versioned without history transfer; original source audit retained.
- Review-response validation: complete_with_out_of_lane_typecheck_failure. Focused11/11 passes. One owned test typing issue was fixed. Package tsc still reports only a concurrent Colon-topic terminal-rationale error; no out-of-lane repair. Final JSON/readback and packet handoff remain.
- Review-response closing handoff: complete. Nineteen review slots reconciled: four pass-preserved, eight revised once, seven parked after one attempt. Twelve standalone active cases; no mixed or unreviewed companion blocks a PASS. All five owned files updated; no shared-file mutation.

Next action: Manager reviews actual five-file changes and commissions independent re-review of the eight revised standalone cases. Preserve the four exact PASS cases; keep seven parked attempts excluded. Re-run stable-tree package typecheck after any concurrent failures are resolved.

## Nineteen exact review dispositions

Status revised means one authored response awaiting independent review, not PASS. Parked means the attempted revision is stored for audit but absent from active question, node, case, concept, timing and order exports. No parked attempt has a scored key.

| Reviewed item | Verdict | Current status | Current/attempted version | Result and remaining boundary |
|---|---|---|---|---|
| question.topic.biliary-injury-malignancy.communicating-leak-stent.v1 | PASS | pass-preserved | question.topic.biliary-injury-malignancy.communicating-leak-stent.v1 | Exact independently passed item preserved. |
| question.topic.biliary-injury-malignancy.reaccumulating-biloma.v1 | REVISE | revised | question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2 | Revised candidate for independent re-review; no new PASS claimed. |
| question.topic.biliary-injury-malignancy.main-duct-discontinuity.v1 | REVISE | revised | question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2 | Revised candidate for independent re-review; no new PASS claimed. |
| question.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.v1 | REVISE | parked | question.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.v2 | The one revision removes the rehearsed ERCP/PTBD foils and compares actual source-control methods. Urgent abdominal lavage is supported, but the record and available claims do not fairly rank laparoscopic versus open lavage. Retaining a broad lavage-versus-diversion set remains easy. Parked without hiding the emergency or claiming an accepted basic exception. |
| question.topic.biliary-injury-malignancy.t1a-complete-resection.v1 | FAIL | revised | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 | Revised candidate for independent re-review; no new PASS claimed. |
| question.topic.biliary-injury-malignancy.revised-muscular-invasion.v1 | REVISE | parked | question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2 | Baseline and malignant invasion are now explicit, and the overlapping generic-versus-specific assessment options are removed. However, an exclusive mandatory completion-operation key for every T1b patient remains disputed in the permitted sources. A broad HPB-assessment alternative is clinically reasonable but remains an easy reassessment item. Parked. |
| question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1 | REVISE | revised | question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2 | Revised candidate for independent re-review; no new PASS claimed. |
| question.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v1 | REVISE | revised | question.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v2 | Revised candidate for independent re-review; no new PASS claimed. |
| question.topic.biliary-injury-malignancy.type-i-cyst-excision.v1 | REVISE | revised | question.topic.biliary-injury-malignancy.type-i-cyst-excision.v2 | Revised candidate for independent re-review; no new PASS claimed. |
| question.topic.biliary-injury-malignancy.distal-combined-sampling.v1 | REVISE | parked | question.topic.biliary-injury-malignancy.distal-combined-sampling.v2 | The one attempt removes the comprehensive A-plus-B versus A versus B shortcut and the decorative staging-sequence sentence. The equally complete target-based alternatives do not have an exclusive patient-specific ranking established here. The existing combined-method recommendation is not declared false, but repeating it as a uniquely comprehensive key would remain easy and specialized. Parked. |
| question.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v1 | REVISE | parked | question.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v2 | The one attempt now states exactly what EUS visualized and did not sample. The options no longer use a unique novel technique versus two Repeat labels. Direct cholangioscopy is reasonable, but current findings do not exclude a useful first EUS duct-wall sample or improved fluoroscopic acquisition. Exclusive ranking remains unresolved, so the attempt is parked without claiming that absence of a pancreatic mass makes duct-wall EUS sampling impossible. |
| question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1 | PASS | pass-preserved | question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1 | Exact independently passed item preserved. |
| question.topic.biliary-injury-malignancy.future-remnant-drainage.v1 | REVISE | revised | question.topic.biliary-injury-malignancy.future-remnant-drainage.v2 | Revised candidate for independent re-review; no new PASS claimed. |
| question.topic.biliary-injury-malignancy.benign-continuity-stenting.v1 | REVISE | revised | question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2 | Revised candidate for independent re-review; no new PASS claimed. |
| question.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v1 | REVISE | parked | question.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v2 | The one attempt clarifies the age/date anchor, intervening treatment and reported same-site extension. It replaces an unchanged failed ERCP and Permanent external drainage with real percutaneous and combined approaches. The existing evidence does not exclusively rank those feasible expert options against reconstruction for the supplied anatomy. Parked pending anatomy-specific adjudication. |
| question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1 | PASS | pass-preserved | question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1 | Exact independently passed item preserved. |
| question.topic.biliary-injury-malignancy.arterial-injury-perfusion.v1 | REVISE | parked | question.topic.biliary-injury-malignancy.arterial-injury-perfusion.v2 | The one attempt removes the announced staged-care plan, identifies the constructed chronology and observed arterial anatomy, and names a concrete surveillance plan. Preserved enhancement excludes automatic inference of current liver necrosis, but it still does not establish an exclusive surveillance-versus-selected-revascularization ranking. Parked as requested for the low-certainty arterial-repair boundary. |
| question.topic.biliary-injury-malignancy.palliative-distal-stent.v1 | REVISE | parked | question.topic.biliary-injury-malignancy.palliative-distal-stent.v2 | The one attempt gives the endoscopic options parallel labels and moves exchange burden out of the choice text. Metal-stent palliation remains a supported answer to the simple device rule, but malignancy, distal location and the drainage goal are already established; no additional consequential inference is earned. A harder strategy comparison would need a separately supported patient-specific factor. Parked for persistent easy difficulty, not because the general metal-stent principle is claimed incorrect. |
| question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1 | PASS | pass-preserved | question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1 | Exact independently passed item preserved. |

```json
{
  "reviewedItems": 19,
  "originalPass": 4,
  "originalRevise": 14,
  "originalFail": 1,
  "passPreserved": 4,
  "revised": 8,
  "parked": 7,
  "activeQuestionVariants": 12,
  "activeCases": 12,
  "multipartCases": 0,
  "newQuestionVersions": 8,
  "newMeaningVersions": 3,
  "testingChoiceTuples": 19,
  "activeTables": 7
}
```

## Exact PASS preservation and complete-case composition

The four exact PASS questions and raw nodes are returned from the frozen snapshots, including their content versions, choices, updates, exhibits, explanations and source labels. Their patient header and finite profile are unchanged. Optional PASS suggestions were not applied. Each now occupies its own self-contained case; no returned companion is retained.

The schema requires final-answer disposition records. Three PASS items were originally non-final and had empty terminal arrays. Their raw PASS exports stay byte-exact. The standalone composed cases add only no_terminal_outcome records whose two text fields equal the already reviewed distractor rationale verbatim. No new clinical wording is introduced. Only the post-encounter aggregate summary follows the remaining node. Exact mechanical receipts require manager composition acceptance.

```json
{
  "policy": "Every active case is self-contained with one scored node. No PASS is retained behind a returned or parked companion, and no unreviewed node is relabeled PASS.",
  "passCaseIds": [
    "case.topic.biliary-injury-malignancy.communicating-leak.v1",
    "case.topic.biliary-injury-malignancy.perihilar.v1",
    "case.topic.biliary-injury-malignancy.vasculobiliary.v1",
    "case.topic.biliary-injury-malignancy.palliation.v1"
  ],
  "revisedCaseIds": [
    "case.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.v2",
    "case.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.v2",
    "case.topic.biliary-injury-malignancy.r2.t1a-complete-resection.v2",
    "case.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.v2",
    "case.topic.biliary-injury-malignancy.r2.duct-wall-margin-clearance.v2",
    "case.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.v2",
    "case.topic.biliary-injury-malignancy.r2.future-remnant-drainage.v2",
    "case.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.v2"
  ],
  "reason": "Split the four preserved PASS companions from returned items. Also split the revised cancer margin sequence and other revisions to remove answer-specific prior feedback identified by review. No unsupported multipart quota is imposed.",
  "acceptanceRule": "The four raw question/node/header views are exact editorial PASS. Three standalone case compositions add mandatory final-disposition metadata using reviewed feedback verbatim; manager composition acceptance remains required. Eight revised cases need independent re-review. No clinical approval is conferred.",
  "terminalMetadataReceipts": [
    {
      "questionVariantId": "question.topic.biliary-injury-malignancy.communicating-leak-stent.v1",
      "caseId": "case.topic.biliary-injury-malignancy.communicating-leak.v1",
      "kind": "standalone_final_disposition_completion",
      "changedField": "terminalDispositions",
      "before": [],
      "after": [
        {
          "answerChoiceId": "choice.topic.biliary-injury-malignancy.communicating-leak-stent.1",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "Continued bile can suggest catheter failure, but the cavity has contracted around the catheter.",
          "clinicalRationale": "Continued bile can suggest catheter failure, but the cavity has contracted around the catheter.",
          "sourceLabels": [
            "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy",
            "Endoscopic biliary stenting: indications, choice of stents, and results"
          ]
        },
        {
          "answerChoiceId": "choice.topic.biliary-injury-malignancy.communicating-leak-stent.2",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "The observed continuity and stump source do not establish a need for major reconstruction.",
          "clinicalRationale": "The observed continuity and stump source do not establish a need for major reconstruction.",
          "sourceLabels": [
            "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy",
            "Endoscopic biliary stenting: indications, choice of stents, and results"
          ]
        }
      ],
      "rawPassNodeSha256": "fabd5a35e3b155f298ac80f43df05cac1736fa51a44d76e0b80fb442d0c82561",
      "composedNodeSha256": "e84339d2cf3377d6791221a5280919a174efd3c34f6b973283827f8ab0b1abb0",
      "wordingRule": "Every added consequenceNarrative and clinicalRationale is the exact existing reviewed distractor rationale; no new clinical wording or scored objective."
    },
    {
      "questionVariantId": "question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
      "caseId": "case.topic.biliary-injury-malignancy.perihilar.v1",
      "kind": "standalone_final_disposition_completion",
      "changedField": "terminalDispositions",
      "before": [],
      "after": [
        {
          "answerChoiceId": "choice.topic.biliary-injury-malignancy.perihilar-tissue-route.1",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "This can create a primary-lesion track outside the duct and risk compromising curative options.",
          "clinicalRationale": "This can create a primary-lesion track outside the duct and risk compromising curative options.",
          "sourceLabels": [
            "British Society of Gastroenterology guidelines for the diagnosis and management of cholangiocarcinoma",
            "Diagnostic work-up of bile duct strictures: ESGE Guideline"
          ]
        },
        {
          "answerChoiceId": "choice.topic.biliary-injury-malignancy.perihilar-tissue-route.2",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "A percutaneous primary track carries a similar dissemination concern in a potential curative pathway.",
          "clinicalRationale": "A percutaneous primary track carries a similar dissemination concern in a potential curative pathway.",
          "sourceLabels": [
            "British Society of Gastroenterology guidelines for the diagnosis and management of cholangiocarcinoma",
            "Diagnostic work-up of bile duct strictures: ESGE Guideline"
          ]
        }
      ],
      "rawPassNodeSha256": "e5b5b134962975ca1bc504666c96325d45702c78006e350775973ab0ab650851",
      "composedNodeSha256": "6600473232cb7b688429a985aa6134c14c639f198872492d2cc85e426fb8baeb",
      "wordingRule": "Every added consequenceNarrative and clinicalRationale is the exact existing reviewed distractor rationale; no new clinical wording or scored objective."
    },
    {
      "questionVariantId": "question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
      "caseId": "case.topic.biliary-injury-malignancy.vasculobiliary.v1",
      "kind": "standalone_final_disposition_completion",
      "changedField": "terminalDispositions",
      "before": [],
      "after": [
        {
          "answerChoiceId": "choice.topic.biliary-injury-malignancy.vascular-collection-imaging.1",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "This adds duct and leak information but does not replace the initial vascular and collection assessment raised by the Doppler findings.",
          "clinicalRationale": "This adds duct and leak information but does not replace the initial vascular and collection assessment raised by the Doppler findings.",
          "sourceLabels": [
            "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy"
          ]
        },
        {
          "answerChoiceId": "choice.topic.biliary-injury-malignancy.vascular-collection-imaging.2",
          "kind": "no_terminal_outcome",
          "consequenceNarrative": "This can show active leakage but provides less anatomical and vascular information for the present combined concern.",
          "clinicalRationale": "This can show active leakage but provides less anatomical and vascular information for the present combined concern.",
          "sourceLabels": [
            "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy"
          ]
        }
      ],
      "rawPassNodeSha256": "c584dd72981bc8b14485f7b31013126934a0c7c75b57968a3f86fdf72eaae4b4",
      "composedNodeSha256": "4f94fe86b3653b6f2fd134bb015001b8d36dc46511de9fc9e580082a94ea9b32",
      "wordingRule": "Every added consequenceNarrative and clinicalRationale is the exact existing reviewed distractor rationale; no new clinical wording or scored objective."
    }
  ]
}
```

### Four exact frozen versions

- question.topic.biliary-injury-malignancy.communicating-leak-stent.v1 — question SHA256 cfa09f5edc9a060fccb8889e357bd85f6981982091572feba3bce49b1375a8df; raw node fabd5a35e3b155f298ac80f43df05cac1736fa51a44d76e0b80fb442d0c82561; header e7949c135eda7752f70633e8701822ef97d3a0fc1c8deb9adeadfb54ce7fa36e.
- question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1 — question SHA256 260c21af1f5e2bb1cf89757f7cb79eeb46272dc43a5300e93907ac96d4a9438f; raw node e5b5b134962975ca1bc504666c96325d45702c78006e350775973ab0ab650851; header 9ec987ec3a916aebd9b35e5a1cba94a619476a4971b5f60362369f81e2713520.
- question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1 — question SHA256 3caf7c4776690eae7707e8288b4a52501fbea70a0572dc65ef6641685f8aa376; raw node c584dd72981bc8b14485f7b31013126934a0c7c75b57968a3f86fdf72eaae4b4; header 6bd96d6454e0b4713bd0018cd71cb5e65158132de4d49a2d376ae139b3e222ec.
- question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1 — question SHA256 58e05a46bcb1c52161934ae1c25ada247a3962c7ef0a942682c1d9fa87542969; raw node 19f20b85efecda6c78d1dc3dad947e7301702beafc1d867ec0f659be1e99aeb3; header eef4dfa6e6a9711be8702299d0df9bdba0d83fee90c1a24059ae60cc1564227f.

## Before and after — all active exact versions

**key shown first for review only.** Runtime answers remain shuffled. These displays use the normal explicit-import materialized output captured in reviewRound.after, including the actual pre-answer exhibits. All historical urgent care is an outside-hospital record reviewed in an existing clinic setting.

### question.topic.biliary-injury-malignancy.communicating-leak-stent.v1 — pass-preserved

Original verdict PASS. Revision attempts 0. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.communicating-leak.v1; node node.topic.biliary-injury-malignancy.communicating-leak-stent.v1; question question.topic.biliary-injury-malignancy.communicating-leak-stent.v1; concept concept.bile-leak.minor-leak-ercp-stent.
Complaint: Drain follow-up.
Demographics: {"ageYears":46,"sexLabel":"Female"}.
Presentation: {patientName}, a 46-year-old woman, attends clinic after cholecystectomy. The founder reviews the outside hospital record. A subhepatic drain repeatedly filled with bile while she remained afebrile with a soft abdomen. CT showed the cavity contracted around the catheter. MR cholangiography showed both hepatic ducts continuing into the common duct and duodenum, with contrast escaping from the cystic-duct stump.
Current update: none

Actual visible exhibit: none.

Task: **Which intervention should the hospital team have selected for {patientName} at this point?**

**key shown first for review only.**

- **KEY** ERCP with transpapillary plastic stenting [choice.topic.biliary-injury-malignancy.communicating-leak-stent.0]. Rationale: The main duct communicates with the duodenum and the collection is controlled. Internal diversion treats continuing leakage..
- Percutaneous exchange of the collection drain [choice.topic.biliary-injury-malignancy.communicating-leak-stent.1]. Rationale: Continued bile can suggest catheter failure, but the cavity has contracted around the catheter..
- Roux-en-Y hepaticojejunostomy reconstruction [choice.topic.biliary-injury-malignancy.communicating-leak-stent.2]. Rationale: The observed continuity and stump source do not establish a need for major reconstruction..

Explanation: Persistent bile output must be interpreted with the duct map and the drained cavity. These observations support ERCP plastic-stent diversion for a communicating stump leak. They do not establish the indication for major duct reconstruction.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.communicating-leak.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Drain follow-up",
    "presentation": "{patientName}, a 46-year-old woman, attends clinic after cholecystectomy. The founder reviews the outside hospital record. A subhepatic drain repeatedly filled with bile while she remained afebrile with a soft abdomen. CT showed the cavity contracted around the catheter. MR cholangiography showed both hepatic ducts continuing into the common duct and duodenum, with contrast escaping from the cystic-duct stump."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.communicating-leak.v1; node node.topic.biliary-injury-malignancy.communicating-leak-stent.v1; question question.topic.biliary-injury-malignancy.communicating-leak-stent.v1; concept concept.bile-leak.minor-leak-ercp-stent.
Complaint: Drain follow-up.
Demographics: {"ageYears":46,"sexLabel":"Female"}.
Presentation: {patientName}, a 46-year-old woman, attends clinic after cholecystectomy. The founder reviews the outside hospital record. A subhepatic drain repeatedly filled with bile while she remained afebrile with a soft abdomen. CT showed the cavity contracted around the catheter. MR cholangiography showed both hepatic ducts continuing into the common duct and duodenum, with contrast escaping from the cystic-duct stump.
Current update: none

Actual visible exhibit: none.

Task: **Which intervention should the hospital team have selected for {patientName} at this point?**

**key shown first for review only.**

- **KEY** ERCP with transpapillary plastic stenting [choice.topic.biliary-injury-malignancy.communicating-leak-stent.0]. Rationale: The main duct communicates with the duodenum and the collection is controlled. Internal diversion treats continuing leakage..
- Percutaneous exchange of the collection drain [choice.topic.biliary-injury-malignancy.communicating-leak-stent.1]. Rationale: Continued bile can suggest catheter failure, but the cavity has contracted around the catheter..
- Roux-en-Y hepaticojejunostomy reconstruction [choice.topic.biliary-injury-malignancy.communicating-leak-stent.2]. Rationale: The observed continuity and stump source do not establish a need for major reconstruction..

Explanation: Persistent bile output must be interpreted with the duct map and the drained cavity. These observations support ERCP plastic-stent diversion for a communicating stump leak. They do not establish the indication for major duct reconstruction.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.communicating-leak.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Drain follow-up",
    "presentation": "{patientName}, a 46-year-old woman, attends clinic after cholecystectomy. The founder reviews the outside hospital record. A subhepatic drain repeatedly filled with bile while she remained afebrile with a soft abdomen. CT showed the cavity contracted around the catheter. MR cholangiography showed both hepatic ducts continuing into the common duct and duodenum, with contrast escaping from the cystic-duct stump."
  }
]
```

Raw after node SHA256: fabd5a35e3b155f298ac80f43df05cac1736fa51a44d76e0b80fb442d0c82561. Composed node SHA256: e84339d2cf3377d6791221a5280919a174efd3c34f6b973283827f8ab0b1abb0.

Review-note response:
```json
{
  "clarity": "No exact PASS field edited.",
  "cues": "No changes to exact visible context or options.",
  "fairness": "Original review conclusion preserved; clinical sign-off remains separate.",
  "suggestions": "Optional PASS suggestions deliberately not applied because the manager froze exact wording."
}
```

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.minor-leak-stent, claim.question-topic.biliary-injury-malignancy.transection-boundary, claim.question-topic.biliary-injury-malignancy.ct-collections-vessels.
Sequence disposition: Standalone exact PASS wording; no returned companion.

### question.topic.biliary-injury-malignancy.reaccumulating-biloma.v1 — revised

Original verdict REVISE. Revision attempts 1. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.communicating-leak.v1; node node.topic.biliary-injury-malignancy.reaccumulating-biloma.v1; question question.topic.biliary-injury-malignancy.reaccumulating-biloma.v1; concept concept.topic.biliary-injury-malignancy.reaccumulating-biloma.v1.
Complaint: Drain follow-up.
Demographics: {"ageYears":46,"sexLabel":"Female"}.
Presentation: {patientName}, a 46-year-old woman, attends clinic after cholecystectomy. The founder reviews the outside hospital record. A subhepatic drain repeatedly filled with bile while she remained afebrile with a soft abdomen. CT showed the cavity contracted around the catheter. MR cholangiography showed both hepatic ducts continuing into the common duct and duodenum, with contrast escaping from the cystic-duct stump.
Current update: At a later outside-hospital reassessment after stent placement, the record shows fever and increasing right-upper-quadrant pain. CT shows a fluid pocket behind the liver; the catheter pigtail lies anterior to the pocket. A duct study shows the biliary stent draining into the duodenum without main-duct obstruction. Resuscitation and antimicrobial treatment have started.

Actual visible exhibit: none.

Task: **Which additional procedure should the hospital team prioritize for {patientName} now?**

**key shown first for review only.**

- **KEY** Image-guided drainage of the recurrent collection [choice.topic.biliary-injury-malignancy.reaccumulating-biloma.0]. Rationale: The new pocket is not entered by the collection catheter; it requires source control..
- ERCP with replacement of the biliary stent [choice.topic.biliary-injury-malignancy.reaccumulating-biloma.1]. Rationale: The record shows internal drainage into the duodenum, while the collection catheter no longer enters the pocket..
- Operative reconstruction of the common hepatic duct [choice.topic.biliary-injury-malignancy.reaccumulating-biloma.2]. Rationale: The changed local problem is a separate fluid pocket, not evidence of main-duct disruption..

Explanation: A functioning internal stent does not drain an extrabiliary collection. CT now demonstrates a pocket that the catheter no longer enters, making targeted collection drainage the immediate additional procedure. Resuscitation and infection treatment continue at the hospital.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.communicating-leak.v1",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Drain follow-up",
    "presentation": "{patientName}, a 46-year-old woman, attends clinic after cholecystectomy. The founder reviews the outside hospital record. A subhepatic drain repeatedly filled with bile while she remained afebrile with a soft abdomen. CT showed the cavity contracted around the catheter. MR cholangiography showed both hepatic ducts continuing into the common duct and duodenum, with contrast escaping from the cystic-duct stump."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.v2; node node.topic.biliary-injury-malignancy.reaccumulating-biloma.v2; question question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2; concept concept.topic.biliary-injury-malignancy.reaccumulating-biloma.v1.
Complaint: Drain follow-up.
Demographics: {"ageYears":46,"sexLabel":"Female"}.
Presentation: {patientName}, a 46-year-old woman, attends clinic after treatment of a cholecystectomy bile leak. The founder reviews the hospital reassessment after internal biliary stenting. Fever and right-upper-quadrant pain developed while the collection drain stopped returning fluid. Intravenous fluids and antibiotics had been started.
Current update: none

Actual visible exhibit:
```json
{
  "kind": "table",
  "caption": "Constructed hospital CT and procedure records",
  "columnHeaders": [
    "Reported finding"
  ],
  "rowHeaders": [
    "Fluid distribution",
    "Collection catheter",
    "Access route",
    "Examination after fluids"
  ],
  "cells": [
    [
      "One encapsulated subhepatic pocket; no free fluid elsewhere in the abdomen."
    ],
    [
      "The pigtail lies anterior to the pocket."
    ],
    [
      "An anterior percutaneous path enters the pocket without crossing bowel or pleura."
    ],
    [
      "Stable blood pressure; tenderness remains confined to the right upper quadrant, without rigidity."
    ]
  ]
}
```

Task: **Which initial procedure should the hospital team select to control {patientName}’s recurrent collection?**

**key shown first for review only.**

- **KEY** Percutaneous image-guided catheter drainage [choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.0]. Rationale: The localized accessible pocket can be drained directly. The patient has neither diffuse contamination nor an absent access window requiring operative drainage..
- Laparoscopic washout with drain placement [choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.1]. Rationale: This is a real source-control alternative, but a contained pocket with a safe percutaneous route and stable physiology supports a less invasive initial approach..
- EUS-guided transluminal collection drainage [choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.2]. Rationale: Expert endoscopic collection drainage is possible in selected cases, but the available percutaneous route is the established initial approach for this postoperative biloma..

Explanation: First identify a localized extrabiliary pocket, then assess the available drainage path and current physiology. Those findings favor percutaneous catheter drainage as the initial source-control procedure. Operative washout addresses diffuse or inadequately controlled contamination. Endoscopic biliary diversion and drainage of a collection are different procedures.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.v2",
    "prototypeDemographics": {
      "ageYears": 46,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Drain follow-up",
    "presentation": "{patientName}, a 46-year-old woman, attends clinic after treatment of a cholecystectomy bile leak. The founder reviews the hospital reassessment after internal biliary stenting. Fever and right-upper-quadrant pain developed while the collection drain stopped returning fluid. Intravenous fluids and antibiotics had been started."
  }
]
```

Raw after node SHA256: d5271012ac85edcfd0dddedf39e4ecf4fdb7fb323fd3631245cbf549bcf4dee0. Composed node SHA256: d5271012ac85edcfd0dddedf39e4ecf4fdb7fb323fd3631245cbf549bcf4dee0.

Review-note response:
```json
{
  "clarity": "The update is now a self-contained attributed CT/procedure record in a clinic chart review.",
  "cues": "Retained the displaced catheter but removed the dead biliary-stent and reconstruction foils. Access, localization and physiology distinguish two genuine source-control approaches.",
  "fairness": "Resuscitation is shared. No source-control warning sign is hidden, and no endoscopic technique is claimed universally inferior.",
  "suggestions": "Implemented the reviewer’s requested competition between actual source-control methods. Moderate difficulty is stated candidly."
}
```

Reasoning 1: Interpret the stopped catheter and CT distribution as a contained undrained collection rather than diffuse contamination.
Reasoning 2: Use the safe access window and stable, localized examination to select the initial collection-drainage route.
Closest credible error: Choose operative washout for every postoperative infected collection or conflate biliary stenting with collection drainage.
Deciding observation: Contained collection with a bowel-free percutaneous route and no diffuse peritoneal findings.
Counterfactual: Diffuse intraperitoneal fluid with rigidity, or failure of feasible catheter source control, shifts the initial plan toward operative washout.
Deletion test: Catheter location remains visible. Distribution, access route and physiology now distinguish the closest operative alternative; the old sentence ruling out biliary-stent replacement was removed because device exchange is no longer an offered competitor.

Concrete manual author gate:
```json
{
  "coverTheKeyCueAttack": "All options now control the collection. The key is not the only collection-directed label. Covered the key and compared catheter versus laparoscopic control from the actual access and distribution observations. Necessary warning signs were retained rather than obscured.",
  "decisionStageAndCategory": "One initial source-control procedure; three named drainage approaches.",
  "twoConsequentialSteps": "Interpret the stopped catheter and CT distribution as a contained undrained collection rather than diffuse contamination. Then: Use the safe access window and stable, localized examination to select the initial collection-drainage route.",
  "predictedDifficulty": "Fair moderate author prediction: localize the source, then decide whether imaging access and physiology support percutaneous or operative control. Advanced EUS is a secondary, explicitly limited alternative.",
  "oneDefensibleBestAnswer": "Percutaneous drainage is the best initial offered approach, supported by WSES and ESGE. No claim that EUS drainage is impossible or that surgery is never appropriate."
}
```

- choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.1 temptation: Treat postoperative infection as requiring abdominal washout regardless of its distribution. Counterfactual: Diffuse peritoneal fluid, peritoneal signs or inability to obtain percutaneous control would favor operative source control.
- choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.2 temptation: Generalize successful internal biliary stenting to endoscopic drainage of the extrabiliary pocket. Counterfactual: A selected inaccessible collection with a favorable gastrointestinal apposition at an expert center could prompt an EUS approach; evidence is limited.

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.r2.localized-biloma-source-control, claim.question-topic.biliary-injury-malignancy.r2.primary-biloma-endoscopy, claim.question-topic.biliary-injury-malignancy.peritonitis-source-control, claim.question-topic.biliary-injury-malignancy.ct-collections-vessels.
Sequence disposition: Standalone response candidate; earlier scored tasks and answer-specific feedback are not presented. Required history is stated in the case/exhibit.

### question.topic.biliary-injury-malignancy.main-duct-discontinuity.v1 — revised

Original verdict REVISE. Revision attempts 1. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.major-injury.v1; node node.topic.biliary-injury-malignancy.main-duct-discontinuity.v1; question question.topic.biliary-injury-malignancy.main-duct-discontinuity.v1; concept concept.n2.bile-leak-duct-continuity-boundary.
Complaint: Hospital record review.
Demographics: {"ageYears":56,"sexLabel":"Female"}.
Presentation: {patientName}, a 56-year-old woman, attends clinic after an outside admission following cholecystectomy. The founder reviews the early studies: a drained cavity filled from the proximal common hepatic duct, while a separate distal duct segment ended below it. There was no continuous channel across the gap. The initial hospital had no surgeon who performed complex biliary reconstruction.
Current update: none

Actual visible exhibit: none.

Task: **Which biliary plan should the referring hospital have arranged for {patientName} after these studies?**

**key shown first for review only.**

- **KEY** HPB-center transfer with drainage maintained [choice.topic.biliary-injury-malignancy.main-duct-discontinuity.0]. Rationale: The separated main ducts lie outside the routine communicating-leak stent pathway; drainage is maintained while specialist treatment is planned..
- Local ERCP with transpapillary plastic stenting [choice.topic.biliary-injury-malignancy.main-duct-discontinuity.1]. Rationale: A routine papillary stent cannot be assumed to bridge the observed gap..
- Local duct-to-duct surgical anastomosis [choice.topic.biliary-injury-malignancy.main-duct-discontinuity.2]. Rationale: A local repair can compound a complex injury when reconstructive expertise is absent..

Explanation: The duct map shows loss of main-duct continuity rather than a communicating side leak. That changes the pathway to specialist HPB management with drainage preserved. No universal repair date or reconstructive operation is selected here.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.major-injury.v1",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Hospital record review",
    "presentation": "{patientName}, a 56-year-old woman, attends clinic after an outside admission following cholecystectomy. The founder reviews the early studies: a drained cavity filled from the proximal common hepatic duct, while a separate distal duct segment ended below it. There was no continuous channel across the gap. The initial hospital had no surgeon who performed complex biliary reconstruction."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.v2; node node.topic.biliary-injury-malignancy.main-duct-discontinuity.v2; question question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2; concept concept.topic.biliary-injury-malignancy.main-duct-discontinuity.v2.
Complaint: Hospital record review.
Demographics: {"ageYears":56,"sexLabel":"Female"}.
Presentation: {patientName}, a 56-year-old woman, attends clinic after an outside postcholecystectomy admission. The founder reviews the record from the eighth postoperative day: rigors, jaundice and rising bilirubin developed despite drainage of the subhepatic cavity. The local hospital lacked complex biliary reconstructive expertise; HPB transfer and consultation were arranged. Fluids and antibiotics were underway when the interim drainage plan was chosen.
Current update: none

Actual visible exhibit:
```json
{
  "kind": "table",
  "caption": "Constructed attributed outside-hospital studies",
  "columnHeaders": [
    "Reported finding"
  ],
  "rowHeaders": [
    "Contrast CT after catheter drainage",
    "Hepatobiliary-contrast MR cholangiography",
    "ERCP cholangiogram and wire attempt"
  ],
  "cells": [
    [
      "The subhepatic cavity is collapsed around its catheter; no free intraperitoneal fluid."
    ],
    [
      "Both hepatic duct systems are dilated. Excreted contrast exits the proximal common hepatic duct into the drained space and does not enter the downstream duct."
    ],
    [
      "Contrast injected from the papilla fills the lower common duct to an abrupt clip-level end. The guidewire cannot pass that level."
    ]
  ]
}
```

Task: **Which interim drainage procedure should the consulting HPB team arrange for {patientName} before definitive repair?**

**key shown first for review only.**

- **KEY** Percutaneous transhepatic biliary drainage [choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.0]. Rationale: The septic proximal ducts remain obstructed despite collection drainage, and the retrograde route cannot traverse the injury. Transhepatic drainage accesses the proximal system..
- ERCP with transpapillary plastic stenting [choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.1]. Rationale: This assumes an accessible path into the obstructed proximal ducts that the attributed injection and wire attempt did not establish..
- Percutaneous exchange of the collection catheter [choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.2]. Rationale: The collection is already collapsed; changing its catheter does not decompress the dilated proximal duct system..

Explanation: The studies distinguish a controlled extrabiliary cavity from an obstructed proximal duct system. Infection persists while the papillary route cannot reach that system. Transhepatic biliary drainage is a supported interim decompression option under HPB management; no repair date or universal reconstruction is selected.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.v2",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Hospital record review",
    "presentation": "{patientName}, a 56-year-old woman, attends clinic after an outside postcholecystectomy admission. The founder reviews the record from the eighth postoperative day: rigors, jaundice and rising bilirubin developed despite drainage of the subhepatic cavity. The local hospital lacked complex biliary reconstructive expertise; HPB transfer and consultation were arranged. Fluids and antibiotics were underway when the interim drainage plan was chosen."
  }
]
```

Raw after node SHA256: 7f0c8154b694eaa5140ad6abbb33a49697003531fe8ed9a0f73e18f3b492ff64. Composed node SHA256: 7f0c8154b694eaa5140ad6abbb33a49697003531fe8ed9a0f73e18f3b492ff64.

Review-note response:
```json
{
  "clarity": "Attributed the proximal observation to hepatobiliary-contrast MR and the distal segment/wire attempt to ERCP.",
  "cues": "Moved absent local expertise and HPB transfer into shared context. Removed the supplied discontinuity conclusion and replaced transfer-versus-local choices with three interim drainage procedures.",
  "fairness": "The infection, proximal dilation, failed retrograde passage and collapsed cavity identify one best offered drainage target and route without ranking definitive repairs.",
  "suggestions": "Implemented same-stage interim care and no invented repair interval. A new concept version records the change from recognizing a referral boundary to selecting septic proximal decompression."
}
```

Reasoning 1: Use the two attributed duct studies to identify a proximal system not reached by the retrograde route.
Reasoning 2: Combine proximal obstruction and infection with a controlled collection to choose the compartment and access route for interim drainage.
Closest credible error: Treat the collection or apply routine leak stenting when the proximal infected ducts remain inaccessible.
Deciding observation: Dilated proximal ducts plus failed retrograde passage, with the collection already collapsed.
Counterfactual: If the proximal ducts communicated with the papilla and a stump side leak persisted, a transpapillary stent would be appropriate; an enlarging collection would change the compartment requiring drainage.
Deletion test: Removed the explicit “no continuous channel” interpretation. Shared HPB involvement retains the true expertise constraint without making transfer the unique answer. Each study has an acquisition/procedure attribution.

Concrete manual author gate:
```json
{
  "coverTheKeyCueAttack": "All choices are interim drainage procedures under shared specialist care. Staffing cannot solve the options. Covered the key and re-solved the collection-versus-duct and proximal-access questions from the raw MR/ERCP findings.",
  "decisionStageAndCategory": "One interim decompression procedure, with transfer, antibiotics and definitive repair outside the choice set.",
  "twoConsequentialSteps": "Use the two attributed duct studies to identify a proximal system not reached by the retrograde route. Then: Combine proximal obstruction and infection with a controlled collection to choose the compartment and access route for interim drainage.",
  "predictedDifficulty": "Predicted moderate to hard: continued infection despite a drained cavity can be mistaken for collection failure; two duct compartments and access directions must be interpreted.",
  "oneDefensibleBestAnswer": "WSES explicitly supports PTBD for septic complete obstruction when ERCP cannot restore drainage. Single-guideline, low-certainty support is recorded; the eighth postoperative day is a constructed chronology, not a new repair cutoff."
}
```

- choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.1 temptation: Apply the communicating minor-leak pathway to an unreachable proximal system. Counterfactual: A communicating main duct with a cystic-stump side leak and effective collection control would favor transpapillary diversion.
- choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.2 temptation: Treat every septic bile-leak patient by enlarging the collection drain. Counterfactual: An enlarging pocket with a displaced or blocked collection catheter would instead favor collection-drain revision.

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.r2.septic-proximal-obstruction, claim.question-topic.biliary-injury-malignancy.transection-boundary, claim.question-topic.biliary-injury-malignancy.hpb-referral, claim.question-topic.biliary-injury-malignancy.focal-collection-drainage.
Sequence disposition: Standalone response candidate; earlier scored tasks and answer-specific feedback are not presented. Required history is stated in the case/exhibit.

### question.topic.biliary-injury-malignancy.t1a-complete-resection.v1 — revised

Original verdict FAIL. Revision attempts 1. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.depth-review.v1; node node.topic.biliary-injury-malignancy.t1a-complete-resection.v1; question question.topic.biliary-injury-malignancy.t1a-complete-resection.v1; concept concept.gs028g.incidental-gallbladder.completely-resected-t1a.
Complaint: Pathology review.
Demographics: {"ageYears":43,"sexLabel":"Female"}.
Presentation: {patientName}, a 43-year-old woman, attends clinic after cholecystectomy.
Current update: none

Actual visible exhibit: none.

Task: **Which surgical plan best fits {patientName}’s current pathology and staging findings?**

**key shown first for review only.**

- **KEY** Cancer-team follow-up after cholecystectomy [choice.topic.biliary-injury-malignancy.t1a-complete-resection.0]. Rationale: The represented tumor is limited to the lamina propria with clear margins and no residual disease..
- Completion liver-bed resection with portal lymphadenectomy [choice.topic.biliary-injury-malignancy.t1a-complete-resection.1]. Rationale: This is a credible operation for deeper invasion, which the current sections do not show..
- Completion bile-duct excision with biliary reconstruction [choice.topic.biliary-injury-malignancy.t1a-complete-resection.2]. Rationale: The reported margin and depth do not establish residual duct disease..

Explanation: Interpret the tissue plane and margin findings rather than treating the word invasive as an automatic indication for radical surgery. Completely removed, margin-negative lamina-propria-limited disease generally permits cancer-team follow-up after cholecystectomy.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.depth-review.v1",
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pathology review",
    "presentation": "{patientName}, a 43-year-old woman, attends clinic after cholecystectomy."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.r2.t1a-complete-resection.v2; node node.topic.biliary-injury-malignancy.t1a-complete-resection.v2; question question.topic.biliary-injury-malignancy.t1a-complete-resection.v2; concept concept.gs028g.incidental-gallbladder.completely-resected-t1a.
Complaint: Pathology review.
Demographics: {"ageYears":43,"sexLabel":"Female"}.
Presentation: {patientName}, a 43-year-old woman, attends clinic after cholecystectomy. The founder reviews the final pathology, specimen-submission record and postoperative staging.
Current update: none

Actual visible exhibit:
```json
{
  "kind": "table",
  "caption": "Constructed pathology and staging records",
  "columnHeaders": [
    "Reported finding"
  ],
  "rowHeaders": [
    "Tumor and specimen",
    "Wall under the tumor",
    "Cystic-duct margin",
    "Hepatic-bed margin",
    "Postoperative staging"
  ],
  "cells": [
    [
      "The gallbladder and gross lesion are entirely submitted. Infiltrating malignant glands are present in the lamina propria."
    ],
    [
      "Full-thickness sections beneath the lesion include muscle; no malignant glands are identified within or beyond it."
    ],
    [
      "Free of carcinoma."
    ],
    [
      "Free of carcinoma."
    ],
    [
      "No residual mass or metastatic disease."
    ]
  ]
}
```

Task: **Which next management plan best fits {patientName}’s completed resection and current records?**

**key shown first for review only.**

- **KEY** Cancer-team surveillance after cholecystectomy [choice.topic.biliary-injury-malignancy.r2.t1a-complete-resection.0]. Rationale: The represented invasive carcinoma remains superficial to adequately sampled muscle, with complete removal and clear margins. Those findings do not establish a need for radical completion surgery..
- Completion liver-bed resection with portal lymphadenectomy [choice.topic.biliary-injury-malignancy.r2.t1a-complete-resection.1]. Rationale: This can address a deeper localized primary, but the adequately represented muscle and deeper wall here are uninvolved..
- Completion extrahepatic duct resection with reconstruction [choice.topic.biliary-injury-malignancy.r2.t1a-complete-resection.2]. Rationale: The specimen does not demonstrate residual carcinoma at the duct margin or adjacent duct wall..

Explanation: The tissue must be represented before its uninvolved status is applied. Here the gross lesion is submitted, muscle beneath it is present and uninvolved, the invasive glands remain in lamina propria, and margins are clear. That supports cancer-team surveillance after cholecystectomy rather than completion radical resection.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.r2.t1a-complete-resection.v2",
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pathology review",
    "presentation": "{patientName}, a 43-year-old woman, attends clinic after cholecystectomy. The founder reviews the final pathology, specimen-submission record and postoperative staging."
  }
]
```

Raw after node SHA256: d5adf5a5691bb13566b9f27dca7240c306e315f5e69b2afaa3af8b41fdfc2580. Composed node SHA256: d5adf5a5691bb13566b9f27dca7240c306e315f5e69b2afaa3af8b41fdfc2580.

Review-note response:
```json
{
  "clarity": "Restored an actual visible table in the candidate, including malignant tissue, represented muscle, completeness, both margins and staging; changed “Which surgical plan” to neutral next management.",
  "cues": "Surveillance is no longer a grammatical category mismatch to a surgical-only lead-in; pathological observations rather than a T1a label determine the key.",
  "fairness": "All missing baseline facts are pre-answer. The later muscular-addendum node is separately parked, so no incomplete baseline or answer-specific feedback contaminates another score.",
  "suggestions": "Implemented the requested real export repair and added a focused regression that checks the actual imported table and its deciding observations."
}
```

Reasoning 1: Interpret invasion depth from malignant glands relative to represented muscle, rather than equating “invasive” with deep wall disease.
Reasoning 2: Combine representative sampling, complete removal and clear margins to choose the postoperative management plan.
Closest credible error: Infer a radical-surgery indication from the word invasive, or infer absent muscle invasion from tissue that was never sampled.
Deciding observation: Malignant lamina-propria glands with represented uninvolved muscle and clear margins in a completely submitted lesion.
Counterfactual: Malignant glands in perimuscular tissue would support completion liver-bed/nodal surgery; an involved duct-wall margin changes the residual-site plan.
Deletion test: The exported table supplies the previously missing tumor diagnosis, depth, represented muscle, completeness, margins and staging. Removing the represented muscle or completeness would make the shallow-complete pathway uncertain.

Concrete manual author gate:
```json
{
  "coverTheKeyCueAttack": "The actual exported question and node now carry the table, rather than only a handoff claim. A neutral next-management task permits surveillance and operations at the same stage. Covered all identifiers and feedback: the required findings remain visible before choice.",
  "decisionStageAndCategory": "One postoperative next-management plan; surveillance and specific completion operations are real competing management choices.",
  "twoConsequentialSteps": "Interpret invasion depth from malignant glands relative to represented muscle, rather than equating “invasive” with deep wall disease. Then: Combine representative sampling, complete removal and clear margins to choose the postoperative management plan.",
  "predictedDifficulty": "Fair moderate version: the resident interprets represented tissue and completeness before applying the shallow-cancer pathway. No artificial hard label or accepted-basic exception is claimed.",
  "oneDefensibleBestAnswer": "Current records establish the constrained shallow, fully removed profile. NCI and AHPBA support the general management boundary. The node no longer depends on facts revealed only after answering."
}
```

- choice.topic.biliary-injury-malignancy.r2.t1a-complete-resection.1 temptation: Treat all invasive gallbladder cancers as requiring liver-bed and regional-node surgery. Counterfactual: Perimuscular invasion in a fit patient with localized disease would favor this completion plan.
- choice.topic.biliary-injury-malignancy.r2.t1a-complete-resection.2 temptation: Treat a gallbladder primary as requiring duct excision despite complete shallow removal. Counterfactual: Residual malignant involvement of the cystic-junction/common-duct wall would create a duct-clearance question.

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.gb-t1a, claim.question-topic.biliary-injury-malignancy.gb-muscle, claim.question-topic.biliary-injury-malignancy.gb-duct-margin.
Sequence disposition: Standalone response candidate; earlier scored tasks and answer-specific feedback are not presented. Required history is stated in the case/exhibit.

### question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1 — revised

Original verdict REVISE. Revision attempts 1. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.completion-resection.v1; node node.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1; question question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1; concept concept.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1.
Complaint: Cancer surgery review.
Demographics: {"ageYears":62,"sexLabel":"Male"}.
Presentation: {patientName}, a 62-year-old man, attends clinic to review an outside cholecystectomy and HPB plan. Adenocarcinoma extends through muscle into perimuscular tissue without liver invasion. The cystic-duct margin is clear. CT shows no residual mass, major vascular involvement or metastases. He remains active without limiting heart or lung disease.
Current update: none

Actual visible exhibit: none.

Task: **Which completion operation should the HPB team plan for {patientName} from the current record?**

**key shown first for review only.**

- **KEY** Liver-bed resection with portal lymphadenectomy [choice.topic.biliary-injury-malignancy.t2-margin-directed-completion.0]. Rationale: Localized perimuscular invasion supports completion liver-bed and regional nodal surgery with margin-directed extent..
- Right hepatectomy with portal lymphadenectomy [choice.topic.biliary-injury-malignancy.t2-margin-directed-completion.1]. Rationale: The current record does not show liver or vascular involvement requiring that extent..
- Liver-bed and bile-duct resection with portal lymphadenectomy [choice.topic.biliary-injury-malignancy.t2-margin-directed-completion.2]. Rationale: The common duct is not routinely removed for a clear cystic margin..

Explanation: The depth supports completion oncologic surgery, but its extent follows anatomy and margin requirements. Liver-bed resection and portal lymphadenectomy fit this record. Major hepatectomy and routine extrahepatic duct excision are not established necessities.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.completion-resection.v1",
    "prototypeDemographics": {
      "ageYears": 62,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Cancer surgery review",
    "presentation": "{patientName}, a 62-year-old man, attends clinic to review an outside cholecystectomy and HPB plan. Adenocarcinoma extends through muscle into perimuscular tissue without liver invasion. The cystic-duct margin is clear. CT shows no residual mass, major vascular involvement or metastases. He remains active without limiting heart or lung disease."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.v2; node node.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2; question question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2; concept concept.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1.
Complaint: Cancer surgery review.
Demographics: {"ageYears":62,"sexLabel":"Male"}.
Presentation: {patientName}, a 62-year-old man, attends clinic after cholecystectomy. The founder reviews pathology showing infiltrating adenocarcinoma beyond muscle in perimuscular tissue, without liver invasion. The cystic-duct margin is clear. CT shows no residual mass or metastases. He remains independently active without limiting heart or lung disease.
Current update: none

Actual visible exhibit: none.

Task: **Which next oncologic management plan should the HPB team discuss for {patientName}?**

**key shown first for review only.**

- **KEY** Completion liver-bed resection with regional lymphadenectomy [choice.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.0]. Rationale: Perimuscular invasion supports completion oncologic surgery despite no visible residual mass; the clear duct margin does not create an indication for duct removal..
- Cancer-team surveillance after cholecystectomy [choice.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.1]. Rationale: A clear margin and negative CT do not make perimuscular invasion equivalent to completely removed lamina-propria-limited disease..
- Completion extrahepatic duct resection with reconstruction [choice.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.2]. Rationale: This directs resection to an uninvolved duct rather than the gallbladder bed and regional nodes..

Explanation: A negative staging scan does not erase the microscopic depth of invasion. For this fit patient with localized perimuscular disease, completion liver-bed and regional nodal surgery is supported. The current record does not identify residual extrahepatic duct disease.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.v2",
    "prototypeDemographics": {
      "ageYears": 62,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Cancer surgery review",
    "presentation": "{patientName}, a 62-year-old man, attends clinic after cholecystectomy. The founder reviews pathology showing infiltrating adenocarcinoma beyond muscle in perimuscular tissue, without liver invasion. The cystic-duct margin is clear. CT shows no residual mass or metastases. He remains independently active without limiting heart or lung disease."
  }
]
```

Raw after node SHA256: b59fc72b3b6645d334e1c61072ee59612490dfa17b9c9721c254889012ccb312. Composed node SHA256: b59fc72b3b6645d334e1c61072ee59612490dfa17b9c9721c254889012ccb312.

Review-note response:
```json
{
  "clarity": "Retained the coherent completed postoperative record and used a neutral management lead-in.",
  "cues": "Replaced the convergence-prone three-operation matrix with independent surveillance, liver-bed/nodal completion and duct-directed completion plans. The key is not assembled from majority components.",
  "fairness": "Kept necessary invasion depth, margin, staging and fitness. The item remains two consequential decisions rather than a new label-recognition exercise.",
  "suggestions": "Added a clinically credible undertreatment error and removed the additive-option construction. Split the duct-wall follow-up into an independent case to remove preceding margin-rule teaching."
}
```

Reasoning 1: Interpret perimuscular invasion as a clinically important depth despite apparently complete initial removal and negative imaging.
Reasoning 2: Use the anatomical residual-risk target to select completion liver-bed/nodal treatment rather than surveillance or a duct-directed operation.
Closest credible error: Overvalue a negative CT and clear margin, or choose a duct-primary operation from the word biliary.
Deciding observation: Microscopic perimuscular invasion with no duct-margin involvement or metastases.
Counterfactual: Lamina-propria-limited complete removal would favor surveillance; a new residual duct-wall site would require a different clearance decision.
Deletion test: Depth changes the need for completion surgery even with negative CT. The clear duct margin prevents treating a different site. No arbitrary major-hepatectomy variant or redundant broad fitness sentence is added.

Concrete manual author gate:
```json
{
  "coverTheKeyCueAttack": "Removed the core-operation-plus-two-larger-additions matrix. The options are now independent undertreatment, appropriate completion, and wrong-target treatment plans. No majority combination of liver-bed, nodes and omission of duct resection constructs the key.",
  "decisionStageAndCategory": "One next oncologic management plan; three independent approaches at the same postoperative stage.",
  "twoConsequentialSteps": "Interpret perimuscular invasion as a clinically important depth despite apparently complete initial removal and negative imaging. Then: Use the anatomical residual-risk target to select completion liver-bed/nodal treatment rather than surveillance or a duct-directed operation.",
  "predictedDifficulty": "Predicted moderate to hard: negative imaging/clear margins compete with the microscopic depth and correct oncologic target.",
  "oneDefensibleBestAnswer": "Completion liver-bed/nodal evaluation is supported by NCI and AHPBA for localized perimuscular disease. The task does not assert a single superior liver-bed technique."
}
```

- choice.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.1 temptation: Let absence of visible residual disease replace the microscopic-depth decision. Counterfactual: Completely removed lamina-propria-limited carcinoma with represented uninvolved muscle and clear margins supports surveillance.
- choice.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.2 temptation: Generalize the operation for a bile-duct primary or involved duct margin to localized gallbladder cancer. Counterfactual: A remaining malignant common-duct wall focus would change the required clearance target.

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.gb-t2-completion, claim.question-topic.biliary-injury-malignancy.gb-t1a, claim.question-topic.biliary-injury-malignancy.gb-duct-margin.
Sequence disposition: Standalone response candidate; earlier scored tasks and answer-specific feedback are not presented. Required history is stated in the case/exhibit.

### question.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v1 — revised

Original verdict REVISE. Revision attempts 1. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.completion-resection.v1; node node.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v1; question question.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v1; concept concept.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v1.
Complaint: Cancer surgery review.
Demographics: {"ageYears":62,"sexLabel":"Male"}.
Presentation: {patientName}, a 62-year-old man, attends clinic to review an outside cholecystectomy and HPB plan. Adenocarcinoma extends through muscle into perimuscular tissue without liver invasion. The cystic-duct margin is clear. CT shows no residual mass, major vascular involvement or metastases. He remains active without limiting heart or lung disease.
Current update: The founder next reviews the completion-operation report. A frozen section at the cystic-duct junction contains adenocarcinoma extending into adjacent common hepatic duct wall. The proximal bifurcation and intrapancreatic distal duct are uninvolved. The liver-bed margin is clear.

Actual visible exhibit: none.

Task: **Which additional resection should the HPB team have considered for {patientName} to clear this site?**

**key shown first for review only.**

- **KEY** Extrahepatic bile-duct resection and hepaticojejunostomy [choice.topic.biliary-injury-malignancy.duct-wall-margin-clearance.0]. Rationale: The new residual site is common-duct wall, so duct excision and reconstruction address it..
- Right hepatectomy and hepaticojejunostomy [choice.topic.biliary-injury-malignancy.duct-wall-margin-clearance.1]. Rationale: Additional liver removal does not clear the reported extrahepatic duct-wall focus..
- Pancreaticoduodenectomy and biliary reconstruction [choice.topic.biliary-injury-malignancy.duct-wall-margin-clearance.2]. Rationale: The intrapancreatic duct is uninvolved; the residual site does not establish a pancreatic resection indication..

Explanation: An earlier clear cystic margin does not settle a new duct-wall finding. Additional resection should address the represented positive site. Here extrahepatic duct excision is the offered site-directed extension; clear proximal, distal and liver-bed boundaries distinguish the alternatives.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.completion-resection.v1",
    "prototypeDemographics": {
      "ageYears": 62,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Cancer surgery review",
    "presentation": "{patientName}, a 62-year-old man, attends clinic to review an outside cholecystectomy and HPB plan. Adenocarcinoma extends through muscle into perimuscular tissue without liver invasion. The cystic-duct margin is clear. CT shows no residual mass, major vascular involvement or metastases. He remains active without limiting heart or lung disease."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.r2.duct-wall-margin-clearance.v2; node node.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v2; question question.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v2; concept concept.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v1.
Complaint: Cancer surgery review.
Demographics: {"ageYears":62,"sexLabel":"Male"}.
Presentation: {patientName}, a 62-year-old man, attends clinic to review completion surgery after incidental gallbladder adenocarcinoma. The original cholecystectomy specimen had a negative cystic-duct cut edge. During the later operation, the surgeon submitted the remaining cystic-duct stump and separately oriented tissue from its junction with the common hepatic duct.
Current update: none

Actual visible exhibit:
```json
{
  "kind": "table",
  "caption": "Constructed specimen map from the completion operation",
  "columnHeaders": [
    "Specimen identity",
    "Reported finding"
  ],
  "rowHeaders": [
    "A",
    "B",
    "C",
    "D"
  ],
  "cells": [
    [
      "Remaining cystic-duct stump, submitted along its length",
      "No carcinoma identified."
    ],
    [
      "Common hepatic duct wall at the cystic-duct junction, separately oriented",
      "Infiltrating adenocarcinoma is present within this wall."
    ],
    [
      "Liver-bed resection margin",
      "No carcinoma identified."
    ],
    [
      "Proposed proximal and distal duct-division edges, sampled separately",
      "No carcinoma identified."
    ]
  ]
}
```

Task: **Which additional clearance procedure should the HPB team discuss for {patientName} from this specimen map?**

**key shown first for review only.**

- **KEY** Segmental extrahepatic duct resection with hepaticojejunostomy [choice.topic.biliary-injury-malignancy.r2.duct-wall-margin-clearance.0]. Rationale: The malignant focus is in remaining common-duct wall beyond the tumor-free cystic stump. Duct excision with reconstruction addresses that site between clear sampled division edges..
- Further excision of the remaining cystic-duct stump [choice.topic.biliary-injury-malignancy.r2.duct-wall-margin-clearance.1]. Rationale: This does not remove the separately represented malignant common hepatic duct wall; the stump itself is negative..
- Further resection of the gallbladder liver bed [choice.topic.biliary-injury-malignancy.r2.duct-wall-margin-clearance.2]. Rationale: This targets the wrong remaining specimen: the liver-bed margin is clear, while another oriented wall specimen contains tumor..

Explanation: A negative cut edge on the removed gallbladder is not the same specimen as the remaining common hepatic duct wall sampled at completion surgery. The new map places carcinoma beyond the negative cystic stump, in a duct-wall segment bounded by clear sampled division edges. The offered clearance procedure must remove that segment rather than repeat excision of negative stump or liver-bed tissue.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.r2.duct-wall-margin-clearance.v2",
    "prototypeDemographics": {
      "ageYears": 62,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Cancer surgery review",
    "presentation": "{patientName}, a 62-year-old man, attends clinic to review completion surgery after incidental gallbladder adenocarcinoma. The original cholecystectomy specimen had a negative cystic-duct cut edge. During the later operation, the surgeon submitted the remaining cystic-duct stump and separately oriented tissue from its junction with the common hepatic duct."
  }
]
```

Raw after node SHA256: 504d8b6bd815e656d849940cf6551590dc2f868b28e281dcf3b18c793a3cb3f9. Composed node SHA256: 504d8b6bd815e656d849940cf6551590dc2f868b28e281dcf3b18c793a3cb3f9.

Review-note response:
```json
{
  "clarity": "Identified the original removed-specimen cut edge, the remaining stump and the newly sampled common-duct wall as different specimens.",
  "cues": "Removed two large operations directed at explicitly uninvolved organs. The credible nearest competitor is stump clearance, which requires actual specimen interpretation. No earlier scored margin feedback is presented.",
  "fairness": "Retained sampled clearance boundaries; no required normal finding is concealed. A positive residual wall is not treated as a new reading of the old cut edge.",
  "suggestions": "Implemented a constructed specimen map and a distinct residual-site extent decision. Independent re-review remains required."
}
```

Reasoning 1: Distinguish the old removed-specimen cut edge from the newly sampled residual stump and common-duct wall.
Reasoning 2: Use the positive wall site and clear division-edge map to select the anatomical clearance extension.
Closest credible error: Treat a newly positive common-duct wall specimen as a contradiction of the old cystic cut edge, or trim only the negative cystic stump.
Deciding observation: A separately oriented positive common hepatic duct wall specimen beside a fully sampled negative cystic stump.
Counterfactual: If tumor were confined to the residual cystic stump and the common-duct wall were uninvolved, the extent of duct clearance would be reconsidered; a positive liver-bed edge would direct hepatic clearance.
Deletion test: Specimen identity and provenance are indispensable. Removing labels A versus B would collapse the distinction between stump trimming and wall resection. The old normal-pancreas and major-hepatectomy foils were removed.

Concrete manual author gate:
```json
{
  "coverTheKeyCueAttack": "The case is split from the earlier completion-depth score, so no prior explanation supplies the margin rule. All choices are real clearance procedures at the same site/stage scale, and the nearest stump operation remains tempting until the specimen map is interpreted.",
  "decisionStageAndCategory": "One additional surgical clearance procedure after new oriented specimens.",
  "twoConsequentialSteps": "Distinguish the old removed-specimen cut edge from the newly sampled residual stump and common-duct wall. Then: Use the positive wall site and clear division-edge map to select the anatomical clearance extension.",
  "predictedDifficulty": "Predicted moderate to hard: a negative old margin and negative remaining stump must be reconciled with a separately positive duct wall before selecting extent.",
  "oneDefensibleBestAnswer": "AHPBA supports duct resection when required for residual-site clearance. The exact extent still needs HPB review; no universal rule that every positive cystic margin requires the same resection is asserted."
}
```

- choice.topic.biliary-injury-malignancy.r2.duct-wall-margin-clearance.1 temptation: Treat every cystic-junction finding as a positive cystic-stump margin. Counterfactual: Carcinoma confined to a remaining cystic-stump specimen with uninvolved common-duct wall would require a different, potentially limited stump-clearance assessment.
- choice.topic.biliary-injury-malignancy.r2.duct-wall-margin-clearance.2 temptation: Escalate liver clearance from the original primary organ rather than the currently positive specimen. Counterfactual: A positive deep liver-bed margin with uninvolved duct specimens would favor additional liver-bed clearance.

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.gb-duct-margin, claim.question-topic.biliary-injury-malignancy.gb-t2-completion.
Sequence disposition: Standalone response candidate; no preceding scored answer or margin/drainage feedback is shown. Required history is included in the presentation and exhibit.

### question.topic.biliary-injury-malignancy.type-i-cyst-excision.v1 — revised

Original verdict REVISE. Revision attempts 1. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.type-i-cyst.v1; node node.topic.biliary-injury-malignancy.type-i-cyst-excision.v1; question question.topic.biliary-injury-malignancy.type-i-cyst-excision.v1; concept concept.topic.biliary-injury-malignancy.type-i-cyst-excision.v1.
Complaint: Biliary imaging review.
Demographics: {"ageYears":33,"sexLabel":"Female"}.
Presentation: {patientName}, a 33-year-old woman, attends clinic with an outside MRCP. It shows fusiform enlargement of the extrahepatic duct from below the hepatic confluence to the intrapancreatic duct. Intrahepatic ducts are normal, with no obstructing stone, stricture or solid nodule. An ultrasound from adolescence showed the same distribution.
Current update: none

Actual visible exhibit: none.

Task: **Which treatment should the HPB team discuss for {patientName}’s duct abnormality?**

**key shown first for review only.**

- **KEY** Extrahepatic cyst excision and hepaticojejunostomy [choice.topic.biliary-injury-malignancy.type-i-cyst-excision.0]. Rationale: Longstanding nonobstructive extrahepatic enlargement fits type I cyst anatomy; excision addresses abnormal duct tissue..
- Left hepatectomy with biliary reconstruction [choice.topic.biliary-injury-malignancy.type-i-cyst-excision.1]. Rationale: The current abnormality is extrahepatic, with no intrahepatic cystic territory that this liver resection would remove..
- Endoscopic sphincterotomy of the distal duct [choice.topic.biliary-injury-malignancy.type-i-cyst-excision.2]. Rationale: This can suit a symptomatic intraduodenal choledochocele rather than long extrahepatic cystic disease..

Explanation: Longstanding extrahepatic distribution without obstruction favors a congenital type I duct cyst. Excision with reconstruction addresses that abnormal duct. Neither hepatic resection nor a papillary procedure treats the represented long extrahepatic lesion. No exact cancer probability or surveillance interval is taught.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.type-i-cyst.v1",
    "prototypeDemographics": {
      "ageYears": 33,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Biliary imaging review",
    "presentation": "{patientName}, a 33-year-old woman, attends clinic with an outside MRCP. It shows fusiform enlargement of the extrahepatic duct from below the hepatic confluence to the intrapancreatic duct. Intrahepatic ducts are normal, with no obstructing stone, stricture or solid nodule. An ultrasound from adolescence showed the same distribution."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.v2; node node.topic.biliary-injury-malignancy.type-i-cyst-excision.v2; question question.topic.biliary-injury-malignancy.type-i-cyst-excision.v2; concept concept.topic.biliary-injury-malignancy.type-i-cyst-excision.v1.
Complaint: Biliary imaging review.
Demographics: {"ageYears":33,"sexLabel":"Female"}.
Presentation: {patientName}, a 33-year-old woman, attends clinic after a treated episode of cholangitis. She recalls childhood surgery for a congenital bile-duct cyst. The founder reviews the operative record and current MRCP; fever and jaundice have resolved, and she is independently active.
Current update: none

Actual visible exhibit:
```json
{
  "kind": "table",
  "caption": "Constructed childhood operation and current duct records",
  "columnHeaders": [
    "Reported finding"
  ],
  "rowHeaders": [
    "Childhood operation",
    "Current MRCP",
    "Cyst-enteric opening"
  ],
  "cells": [
    [
      "The enlarged duct was opened into the duodenum; the operative record states that no cyst wall was removed."
    ],
    [
      "Fusiform common-duct enlargement remains from below the hepatic confluence to the intrapancreatic duct. No mural nodule is described."
    ],
    [
      "The opening is patent, with no filling defect or anastomotic narrowing."
    ]
  ]
}
```

Task: **Which long-term biliary plan should the HPB team discuss with {patientName} after recovery?**

**key shown first for review only.**

- **KEY** Completion cyst excision with hepaticojejunostomy [choice.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.0]. Rationale: The old operation drained the cyst rather than removing it. A patent opening and symptom improvement do not remove the retained abnormal duct epithelium..
- Surveillance after the previous cyst operation [choice.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.1]. Rationale: The label previous surgery does not establish excision; the record and MRCP show retained cyst tissue that still needs definitive-treatment assessment..
- Revision of the cyst-duodenal anastomosis [choice.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.2]. Rationale: A drainage revision may address a narrowed opening but leaves cyst epithelium in place; the current opening is patent..

Explanation: Interpret what the childhood operation actually removed. It created drainage but left the cyst wall, and MRCP confirms that the abnormal duct remains. Relief of obstruction is therefore not equivalent to definitive cyst treatment. Completion excision and reconstruction warrants HPB discussion after recovery, with exact operative extent and later surveillance individualized.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.v2",
    "prototypeDemographics": {
      "ageYears": 33,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Biliary imaging review",
    "presentation": "{patientName}, a 33-year-old woman, attends clinic after a treated episode of cholangitis. She recalls childhood surgery for a congenital bile-duct cyst. The founder reviews the operative record and current MRCP; fever and jaundice have resolved, and she is independently active."
  }
]
```

Raw after node SHA256: 01b3f9e4d3dbcffd5724194d049b78d659311b47a8de70228275ef72a3a3c926. Composed node SHA256: 01b3f9e4d3dbcffd5724194d049b78d659311b47a8de70228275ef72a3a3c926.

Review-note response:
```json
{
  "clarity": "Made the prior operation and current treatment phase explicit in original constructed records.",
  "cues": "Replaced normal-liver and wrong-distal-site operations with same-stage completion, follow-up and drainage-revision decisions. Anatomy is no longer uniquely repeated by the key.",
  "fairness": "The symptomatic episode is resolved before long-term planning. A patent outlet is not claimed to abolish risk in retained cyst tissue. Detailed intrapancreatic extent is withheld.",
  "suggestions": "Added the consequential patient factor requested by review: prior drainage mistaken for excision. No tenuous new procedure ranking or risk threshold is added."
}
```

Reasoning 1: Reconcile the operation’s name and symptom relief with the actual absence of cyst-wall removal and persistent duct anatomy.
Reasoning 2: Distinguish adequate current drainage from definitive treatment of retained cyst epithelium.
Closest credible error: Treat a patent cyst-enteric drainage operation as completed excision and move directly to follow-up.
Deciding observation: No cyst wall removed at the prior operation, with persistent fusiform duct disease despite a patent outlet.
Counterfactual: Documented complete cyst excision with reconstruction would support surveillance rather than a completion-excision plan; a narrowed outlet would add a separate drainage problem.
Deletion test: The prior operative extent changes the decision. The patent outlet distinguishes a drainage revision from definitive cyst management. No ethnicity, risk percentage, intrapancreatic resection limit or treatment deadline is authored.

Concrete manual author gate:
```json
{
  "coverTheKeyCueAttack": "Removed the anatomically irrelevant left hepatectomy and simple type-III matching foil. The three plans now address the real post-operation stage: definitive completion, surveillance or drainage revision. The key no longer repeats extrahepatic wording uniquely.",
  "decisionStageAndCategory": "One long-term biliary management plan after recovery from infection.",
  "twoConsequentialSteps": "Reconcile the operation’s name and symptom relief with the actual absence of cyst-wall removal and persistent duct anatomy. Then: Distinguish adequate current drainage from definitive treatment of retained cyst epithelium.",
  "predictedDifficulty": "Fair moderate author prediction: the clinically important error is mistaking effective drainage for removal of the abnormal tissue. This is a history-and-anatomy application rather than subtype naming.",
  "oneDefensibleBestAnswer": "The 2023 specialist review supports excision rather than retained cyst drainage. Single-publication support and uncertain detailed operative extent remain explicit; no exact cancer probability is keyed."
}
```

- choice.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.1 temptation: Assume that symptom relief and a patent prior operation mean the congenital cyst was removed. Counterfactual: A documented complete excision with reconstruction would change the discussion toward surveillance of remnant biliary tissue.
- choice.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.2 temptation: Attribute the recurrent biliary history to a drainage bottleneck despite the represented patent opening. Counterfactual: A documented anastomotic obstruction would create a drainage problem requiring assessment, while the retained cyst would still need separate definitive planning.

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.cyst-i-excision, claim.question-topic.biliary-injury-malignancy.cyst-followup, claim.question-topic.biliary-injury-malignancy.cyst-i-anatomy, claim.question-topic.biliary-injury-malignancy.r2.cyst-drainage-residual-epithelium, claim.question-topic.biliary-injury-malignancy.r2.cyst-drainage-versus-excision.
Sequence disposition: Standalone response candidate; no preceding scored answer or margin/drainage feedback is shown. Required history is included in the presentation and exhibit.

### question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1 — pass-preserved

Original verdict PASS. Revision attempts 0. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.perihilar.v1; node node.topic.biliary-injury-malignancy.perihilar-tissue-route.v1; question question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1; concept concept.topic.biliary-injury-malignancy.perihilar-tissue-route.v1.
Complaint: Biliary referral review.
Demographics: {"ageYears":58,"sexLabel":"Female"}.
Presentation: {patientName}, a 58-year-old woman, attends clinic with an outside referral. CT and MRI/MRCP show irregular narrowing centered at the hepatic duct confluence, upstream dilation, and no distant lesion. The HPB center is evaluating curative pathways, including whether a transplant protocol could apply. No tissue has yet been obtained.
Current update: none

Actual visible exhibit: none.

Task: **Which primary-lesion sampling plan should the HPB team choose for {patientName}?**

**key shown first for review only.**

- **KEY** ERCP brushings with intraductal forceps biopsies [choice.topic.biliary-injury-malignancy.perihilar-tissue-route.0]. Rationale: Intraductal sampling can assess the hilar stricture without a transperitoneal primary-lesion needle track..
- EUS-guided needle biopsy of the hilar primary [choice.topic.biliary-injury-malignancy.perihilar-tissue-route.1]. Rationale: This can create a primary-lesion track outside the duct and risk compromising curative options..
- Percutaneous needle biopsy of the hilar primary [choice.topic.biliary-injury-malignancy.perihilar-tissue-route.2]. Rationale: A percutaneous primary track carries a similar dissemination concern in a potential curative pathway..

Explanation: The tissue target and intended treatment matter. A potentially curable perihilar primary should not automatically undergo transperitoneal needle biopsy. ERCP-based intraductal methods provide a supported alternative. This does not prohibit EUS sampling of every node or establish transplant eligibility.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.perihilar.v1",
    "prototypeDemographics": {
      "ageYears": 58,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Biliary referral review",
    "presentation": "{patientName}, a 58-year-old woman, attends clinic with an outside referral. CT and MRI/MRCP show irregular narrowing centered at the hepatic duct confluence, upstream dilation, and no distant lesion. The HPB center is evaluating curative pathways, including whether a transplant protocol could apply. No tissue has yet been obtained."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.perihilar.v1; node node.topic.biliary-injury-malignancy.perihilar-tissue-route.v1; question question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1; concept concept.topic.biliary-injury-malignancy.perihilar-tissue-route.v1.
Complaint: Biliary referral review.
Demographics: {"ageYears":58,"sexLabel":"Female"}.
Presentation: {patientName}, a 58-year-old woman, attends clinic with an outside referral. CT and MRI/MRCP show irregular narrowing centered at the hepatic duct confluence, upstream dilation, and no distant lesion. The HPB center is evaluating curative pathways, including whether a transplant protocol could apply. No tissue has yet been obtained.
Current update: none

Actual visible exhibit: none.

Task: **Which primary-lesion sampling plan should the HPB team choose for {patientName}?**

**key shown first for review only.**

- **KEY** ERCP brushings with intraductal forceps biopsies [choice.topic.biliary-injury-malignancy.perihilar-tissue-route.0]. Rationale: Intraductal sampling can assess the hilar stricture without a transperitoneal primary-lesion needle track..
- EUS-guided needle biopsy of the hilar primary [choice.topic.biliary-injury-malignancy.perihilar-tissue-route.1]. Rationale: This can create a primary-lesion track outside the duct and risk compromising curative options..
- Percutaneous needle biopsy of the hilar primary [choice.topic.biliary-injury-malignancy.perihilar-tissue-route.2]. Rationale: A percutaneous primary track carries a similar dissemination concern in a potential curative pathway..

Explanation: The tissue target and intended treatment matter. A potentially curable perihilar primary should not automatically undergo transperitoneal needle biopsy. ERCP-based intraductal methods provide a supported alternative. This does not prohibit EUS sampling of every node or establish transplant eligibility.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.perihilar.v1",
    "prototypeDemographics": {
      "ageYears": 58,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Biliary referral review",
    "presentation": "{patientName}, a 58-year-old woman, attends clinic with an outside referral. CT and MRI/MRCP show irregular narrowing centered at the hepatic duct confluence, upstream dilation, and no distant lesion. The HPB center is evaluating curative pathways, including whether a transplant protocol could apply. No tissue has yet been obtained."
  }
]
```

Raw after node SHA256: e5b5b134962975ca1bc504666c96325d45702c78006e350775973ab0ab650851. Composed node SHA256: 6600473232cb7b688429a985aa6134c14c639f198872492d2cc85e426fb8baeb.

Review-note response:
```json
{
  "clarity": "No exact PASS field edited.",
  "cues": "No changes to exact visible context or options.",
  "fairness": "Original review conclusion preserved; clinical sign-off remains separate.",
  "suggestions": "Optional PASS suggestions deliberately not applied because the manager froze exact wording."
}
```

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.hilar-primary-biopsy, claim.question-topic.biliary-injury-malignancy.hilar-intraductal.
Sequence disposition: Standalone exact PASS wording; no returned companion.

### question.topic.biliary-injury-malignancy.future-remnant-drainage.v1 — revised

Original verdict REVISE. Revision attempts 1. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.perihilar.v1; node node.topic.biliary-injury-malignancy.future-remnant-drainage.v1; question question.topic.biliary-injury-malignancy.future-remnant-drainage.v1; concept concept.topic.biliary-injury-malignancy.future-remnant-drainage.v1.
Complaint: Biliary referral review.
Demographics: {"ageYears":58,"sexLabel":"Female"}.
Presentation: {patientName}, a 58-year-old woman, attends clinic with an outside referral. CT and MRI/MRCP show irregular narrowing centered at the hepatic duct confluence, upstream dilation, and no distant lesion. The HPB center is evaluating curative pathways, including whether a transplant protocol could apply. No tissue has yet been obtained.
Current update: In a later HPB record, intraductal samples confirm malignancy. The team plans a right hepatectomy with caudate and extrahepatic duct resection, leaving the left liver. Both right and left ducts are dilated. Pruritus prevents sleep, and the MDT has selected preoperative drainage. There is no fever or abscess in either lobe.

Actual visible exhibit: none.

Task: **Which initial drainage territory should the HPB team choose for {patientName}?**

**key shown first for review only.**

- **KEY** The left hepatic duct system [choice.topic.biliary-injury-malignancy.future-remnant-drainage.0]. Rationale: The left liver is the future remnant, so its drainage is the initial preoperative target..
- The right hepatic duct system [choice.topic.biliary-injury-malignancy.future-remnant-drainage.1]. Rationale: The larger right-sided tree can attract drainage, but that lobe is planned for removal..
- Both hepatic duct systems [choice.topic.biliary-injury-malignancy.future-remnant-drainage.2]. Rationale: Bilateral dilation does not itself establish a need to drain both; further territories depend on response or infection..

Explanation: Drainage is already the chosen phase of care. The resection plan identifies the left liver as the future remnant, making that system the initial target. Additional territories depend on clinical response or cholangitis; this item does not choose between ERCP and percutaneous access.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.perihilar.v1",
    "prototypeDemographics": {
      "ageYears": 58,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Biliary referral review",
    "presentation": "{patientName}, a 58-year-old woman, attends clinic with an outside referral. CT and MRI/MRCP show irregular narrowing centered at the hepatic duct confluence, upstream dilation, and no distant lesion. The HPB center is evaluating curative pathways, including whether a transplant protocol could apply. No tissue has yet been obtained."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.r2.future-remnant-drainage.v2; node node.topic.biliary-injury-malignancy.future-remnant-drainage.v2; question question.topic.biliary-injury-malignancy.future-remnant-drainage.v2; concept concept.topic.biliary-injury-malignancy.future-remnant-drainage.v2.
Complaint: Biliary referral review.
Demographics: {"ageYears":58,"sexLabel":"Female"}.
Presentation: {patientName}, a 58-year-old woman, attends clinic after an outside HPB admission for confirmed perihilar cholangiocarcinoma. The founder reviews the admission before a planned right hepatectomy with caudate and extrahepatic duct resection. A left-system stent had reduced her bilirubin. She then developed fever and rigors; antibiotics and fluid treatment were started.
Current update: none

Actual visible exhibit:
```json
{
  "kind": "table",
  "caption": "Constructed current duct-drainage map",
  "columnHeaders": [
    "Drainage study",
    "Current CT/MR findings"
  ],
  "rowHeaders": [
    "Left hepatic system",
    "Right anterior sector",
    "Right posterior sector"
  ],
  "cells": [
    [
      "The left stent is in position; contrast drains through it into the duodenum.",
      "Ducts are decompressed."
    ],
    [
      "No stent enters this sector.",
      "Dilation is unchanged; no new adjacent collection."
    ],
    [
      "The sector filled with contrast during the prior ERCP but received no stent.",
      "Ducts have enlarged and contain dependent debris; new small adjacent fluid collections are present."
    ]
  ]
}
```

Task: **Which additional biliary territory should the HPB team target next for {patientName}?**

**key shown first for review only.**

- **KEY** Right posterior sectoral ducts [choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.0]. Rationale: New infection findings localize to an undrained obstructed sector. Its planned removal does not remove the current need for source control..
- Left hepatic duct system [choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.1]. Rationale: The left drain remains functional and its ducts are decompressed. Repeating treatment there does not address the newly abnormal undrained territory..
- Right anterior sectoral ducts [choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.2]. Rationale: This is undrained but does not show the new inflammatory collection pattern represented in the posterior sector..

Explanation: First determine whether the existing remnant drainage is functioning. Then localize the current infection to the contrast-filled but undrained posterior sector. Cholangitis in an obstructed residual territory can require added drainage even when that territory is planned for later resection. This does not prescribe an ERCP-versus-percutaneous access route.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.r2.future-remnant-drainage.v2",
    "prototypeDemographics": {
      "ageYears": 58,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Biliary referral review",
    "presentation": "{patientName}, a 58-year-old woman, attends clinic after an outside HPB admission for confirmed perihilar cholangiocarcinoma. The founder reviews the admission before a planned right hepatectomy with caudate and extrahepatic duct resection. A left-system stent had reduced her bilirubin. She then developed fever and rigors; antibiotics and fluid treatment were started."
  }
]
```

Raw after node SHA256: 419b8eb746f7672fc1fa4a76412d201ac0e4bebaad248c86ae140325f1406478. Composed node SHA256: 419b8eb746f7672fc1fa4a76412d201ac0e4bebaad248c86ae140325f1406478.

Review-note response:
```json
{
  "clarity": "The case states current infection, the prior drainage result and the operative plan; it no longer computes the remnant for the learner.",
  "cues": "Removed the explicit left-liver answer. All three regions are mapped, and the key now depends on new source-control findings rather than a left/right association.",
  "fairness": "Kept fever, operative plan and functioning-left-drain observations. The key changes for current infection, not because hidden eligibility data were removed.",
  "suggestions": "Implemented the requested consequential duct/drainage map. New concept version records the shift from initial remnant targeting to additional drainage of an infected residual territory."
}
```

Reasoning 1: Separate a functioning left-system drain from the new abnormalities in an undrained right sector.
Reasoning 2: Apply the infected-residual-territory exception to the remnant-focused preoperative strategy.
Closest credible error: Drain the future remnant again while leaving a newly infected obstructed sector untreated.
Deciding observation: Patent left drainage and decompressed left ducts versus new posterior-sector debris, dilation and adjacent collections after opacification without drainage.
Counterfactual: If new infection and drain failure were centered in the left system, left-system intervention would be appropriate; move the inflammatory findings to the anterior sector and that becomes the additional target.
Deletion test: Removed the computed phrase leaving the left liver. All three territories have observations, and current infection is not hidden. The planned resection remains necessary because it creates the tempting remnant-only error.

Concrete manual author gate:
```json
{
  "coverTheKeyCueAttack": "Territory labels are equally specific and all carry the same placeholder timing class. The map, not a repeated future-remnant phrase, selects the target. This standalone case has no preceding biopsy or remnant-drainage teaching feedback.",
  "decisionStageAndCategory": "One additional drainage territory during a new infection episode, not a choice of resection or access technique.",
  "twoConsequentialSteps": "Separate a functioning left-system drain from the new abnormalities in an undrained right sector. Then: Apply the infected-residual-territory exception to the remnant-focused preoperative strategy.",
  "predictedDifficulty": "Predicted moderate to hard: infer functioning prior drainage and infection location, then override a usually appropriate remnant-focused rule for a current source-control indication.",
  "oneDefensibleBestAnswer": "BSG recommendation 23 directly supports additional drainage for cholangitis in residual obstructed segments. No palliative volume target or unsupported probability is imported."
}
```

- choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.1 temptation: Apply the future-remnant drainage rule despite current infection elsewhere. Counterfactual: Loss of left-stent drainage with renewed left-system dilation would make the left system the immediate target.
- choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.2 temptation: Choose any right-sided duct because the planned resection is right-sided. Counterfactual: New obstructive infection centered in the anterior rather than posterior sector would reverse the target.

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.hilar-remnant-drain, claim.question-topic.biliary-injury-malignancy.r2.infected-residual-territory.
Sequence disposition: Standalone response candidate; no preceding scored answer or margin/drainage feedback is shown. Required history is included in the presentation and exhibit.

### question.topic.biliary-injury-malignancy.benign-continuity-stenting.v1 — revised

Original verdict REVISE. Revision attempts 1. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.benign-stricture.v1; node node.topic.biliary-injury-malignancy.benign-continuity-stenting.v1; question question.topic.biliary-injury-malignancy.benign-continuity-stenting.v1; concept concept.topic.biliary-injury-malignancy.benign-continuity-stenting.v1.
Complaint: Jaundice follow-up.
Demographics: {"ageYears":49,"sexLabel":"Male"}.
Presentation: {patientName}, a 49-year-old man, attends clinic after an outside evaluation for jaundice following cholecystectomy. MRCP shows a short smooth mid-duct narrowing with a continuous lumen and upstream dilation. ERCP passed a guidewire across it; intraductal samples show scar without atypia, and staging scans show no mass. The HPB team attributes it to the prior operation and is selecting an endoscopic treatment course.
Current update: none

Actual visible exhibit: none.

Task: **Which endoscopic course should the HPB team discuss for {patientName}?**

**key shown first for review only.**

- **KEY** Temporary multiple plastic biliary stents [choice.topic.biliary-injury-malignancy.benign-continuity-stenting.0]. Rationale: A traversable benign postoperative stricture can be treated with a temporary stent course..
- Permanent uncovered metal biliary stenting [choice.topic.biliary-injury-malignancy.benign-continuity-stenting.1]. Rationale: An uncovered permanent device is unsuitable as a routine benign-stricture strategy because later removal is problematic..
- Papillary sphincterotomy without stricture stenting [choice.topic.biliary-injury-malignancy.benign-continuity-stenting.2]. Rationale: Papillary division does not provide prolonged treatment across the demonstrated mid-duct scar..

Explanation: The lesion is a traversable mid-duct scar, not a malignant obstruction or isolated papillary problem. Temporary stenting is a supported endoscopic strategy. A removable covered metal stent is another supported strategy not offered here; no superiority of plastic over every covered device is claimed.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.benign-stricture.v1",
    "prototypeDemographics": {
      "ageYears": 49,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Jaundice follow-up",
    "presentation": "{patientName}, a 49-year-old man, attends clinic after an outside evaluation for jaundice following cholecystectomy. MRCP shows a short smooth mid-duct narrowing with a continuous lumen and upstream dilation. ERCP passed a guidewire across it; intraductal samples show scar without atypia, and staging scans show no mass. The HPB team attributes it to the prior operation and is selecting an endoscopic treatment course."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.v2; node node.topic.biliary-injury-malignancy.benign-continuity-stenting.v2; question question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2; concept concept.topic.biliary-injury-malignancy.benign-continuity-stenting.v2.
Complaint: Jaundice follow-up.
Demographics: {"ageYears":49,"sexLabel":"Male"}.
Presentation: {patientName}, a 49-year-old man, attends clinic to review treatment of a postcholecystectomy duct narrowing. The outside HPB team has diagnosed a benign postoperative stricture after review of serial imaging and tissue. The founder reviews the procedural map before a treatment course is chosen. He has attended each scheduled endoscopic visit.
Current update: none

Actual visible exhibit:
```json
{
  "kind": "table",
  "caption": "Constructed MRCP and ERCP treatment map",
  "columnHeaders": [
    "Reported finding"
  ],
  "rowHeaders": [
    "Narrowing",
    "Proximal duct cuff",
    "Hepatic branches",
    "Wire access"
  ],
  "cells": [
    [
      "A short common hepatic duct narrowing is present above the cystic-duct insertion."
    ],
    [
      "The upper edge of the narrowing is 4 mm below the right-left hepatic confluence."
    ],
    [
      "Both main hepatic branches remain patent."
    ],
    [
      "A guidewire passes the narrowing and can enter either hepatic branch."
    ]
  ]
}
```

Task: **Which treatment course should the HPB team prefer for {patientName} from this map?**

**key shown first for review only.**

- **KEY** ERCP placement of multiple plastic stents [choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.0]. Rationale: The traversable postoperative stricture lies very close to the confluence, favoring the guideline-supported plastic strategy rather than assuming a covered metal stent will suit the available proximal cuff..
- ERCP placement of a fully covered metal stent [choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.1]. Rationale: This is a genuine benign-stricture strategy, but the available proximal cuff is much shorter than the guideline’s more-than-2-cm distal location for the usual postcholecystectomy alternative..
- Roux-en-Y hepaticojejunostomy reconstruction [choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.2]. Rationale: Reconstruction is an established option for major or refractory injury, but current wire access and branch patency support an endoscopic course before that escalation..

Explanation: Benign disease is the supplied specialist working diagnosis; the score concerns treatment anatomy. The short cuff below the confluence and preserved traversability favor multiple plastic stents among the offered courses. Covered metal stents remain valid for selected anatomy or circumstances; plastic superiority for every benign stricture is not taught.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.v2",
    "prototypeDemographics": {
      "ageYears": 49,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Jaundice follow-up",
    "presentation": "{patientName}, a 49-year-old man, attends clinic to review treatment of a postcholecystectomy duct narrowing. The outside HPB team has diagnosed a benign postoperative stricture after review of serial imaging and tissue. The founder reviews the procedural map before a treatment course is chosen. He has attended each scheduled endoscopic visit."
  }
]
```

Raw after node SHA256: d6958bb1174c3cd8686cbe1f2bb095e149645c032bc4c9507f273b1cf0e72fa4. Composed node SHA256: d6958bb1174c3cd8686cbe1f2bb095e149645c032bc4c9507f273b1cf0e72fa4.

Review-note response:
```json
{
  "clarity": "The HPB diagnosis is explicitly a supplied working diagnosis, not a learner inference from scar without atypia. The map supplies the relevant device and access anatomy.",
  "cues": "Removed permanent-metal and deliberately unstented-sphincterotomy labels. All choices are real plans; two fully specified endoscopic competitors remain.",
  "fairness": "The current guideline was freshly checked. Plastic versus covered metal now has a directly supported anatomical discriminator; the patient’s documented attendance avoids silently importing the guideline’s adherence exception.",
  "suggestions": "Implemented a sourced patient-specific anatomical factor and neutral procedure labels. New concept version preserves the earlier generic benign-device meaning/history separately."
}
```

Reasoning 1: Read the available duct cuff and branch access rather than treating all extrahepatic strictures as geometrically equivalent.
Reasoning 2: Apply the postcholecystectomy confluence boundary to choose an endoscopic strategy while recognizing that continuity remains traversable.
Closest credible error: Choose a covered metal device from procedural convenience or escalate directly to reconstruction without reading the confluence map.
Deciding observation: A traversable short scar only 4 mm below the confluence, with access to both branches.
Counterfactual: A suitable stricture more than 2 cm below the confluence would make a covered-metal course a credible alternative; failed traversal with recurrent infection changes the reconstructive question.
Deletion test: Proximity and traversability distinguish the two nearest clinical strategies. The 4-mm value is a constructed measurement; the separate greater-than-2-cm guideline boundary is directly sourced. Removed permanent and without-stricture-stenting caricatures.

Concrete manual author gate:
```json
{
  "coverTheKeyCueAttack": "All options name real treatment courses, and both ERCP options carry identical timing-profile scope. No choice advertises unsafe duration or deliberate omission. The benign diagnosis is supplied for device selection, not inferred as conclusive from a negative biopsy.",
  "decisionStageAndCategory": "One treatment course for a known postoperative stricture; two credible endoscopic strategies and reconstructive escalation.",
  "twoConsequentialSteps": "Read the available duct cuff and branch access rather than treating all extrahepatic strictures as geometrically equivalent. Then: Apply the postcholecystectomy confluence boundary to choose an endoscopic strategy while recognizing that continuity remains traversable.",
  "predictedDifficulty": "Predicted moderate to hard: anatomical geometry changes an otherwise reasonable covered-metal strategy, while actual wire access prevents automatic surgical escalation.",
  "oneDefensibleBestAnswer": "The 2026 ESGE recommendation supports MPS for postcholecystectomy strictures and qualifies covered-metal alternatives by distance/adherence. Weak, moderate-quality evidence is recorded, with no universal metal-stent contraindication claimed."
}
```

- choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.1 temptation: Choose a fewer-procedure device without interpreting its position relative to the confluence. Counterfactual: A suitable stricture well below the confluence, or a separately adjudicated adherence constraint, could support covered-metal treatment.
- choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.2 temptation: Treat a high location as proof that endoscopic drainage cannot be established. Counterfactual: A major nontraversable stricture with recurrent infection despite expert drainage attempts would prompt reconstructive assessment.

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.benign-stricture-endoscopy, claim.question-topic.biliary-injury-malignancy.r2.postchole-multiple-plastic-stents, claim.question-topic.biliary-injury-malignancy.r2.confluence-metal-boundary, claim.question-topic.biliary-injury-malignancy.late-stricture.
Sequence disposition: Standalone response candidate; no preceding scored answer or margin/drainage feedback is shown. Required history is included in the presentation and exhibit.

### question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1 — pass-preserved

Original verdict PASS. Revision attempts 0. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.vasculobiliary.v1; node node.topic.biliary-injury-malignancy.vascular-collection-imaging.v1; question question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1; concept concept.topic.biliary-injury-malignancy.vascular-collection-imaging.v1.
Complaint: Postoperative imaging review.
Demographics: {"ageYears":51,"sexLabel":"Female"}.
Presentation: {patientName}, a 51-year-old woman, attends clinic after an outside cholecystectomy complicated by bile drainage. The founder reviews early records: ultrasound showed a subhepatic collection and proximal duct dilation. Doppler did not establish right hepatic arterial flow, while portal flow was present. She was stable enough for further imaging before an intervention was planned.
Current update: none

Actual visible exhibit: none.

Task: **Which additional study should the hospital team have obtained for {patientName} at that stage?**

**key shown first for review only.**

- **KEY** Multiphasic contrast-enhanced abdominal CT [choice.topic.biliary-injury-malignancy.vascular-collection-imaging.0]. Rationale: This evaluates collections, hepatic perfusion and vascular injury in the same postoperative assessment..
- Hepatobiliary-contrast MR cholangiography [choice.topic.biliary-injury-malignancy.vascular-collection-imaging.1]. Rationale: This adds duct and leak information but does not replace the initial vascular and collection assessment raised by the Doppler findings..
- Hepatobiliary scintigraphy with delayed images [choice.topic.biliary-injury-malignancy.vascular-collection-imaging.2]. Rationale: This can show active leakage but provides less anatomical and vascular information for the present combined concern..

Explanation: The missing decision information concerns more than bile leakage: the arterial finding and collection need structural assessment. Multiphasic CT evaluates those domains. Dedicated duct mapping remains a separate potential investigation, not a substitute for vascular assessment.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.vasculobiliary.v1",
    "prototypeDemographics": {
      "ageYears": 51,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Postoperative imaging review",
    "presentation": "{patientName}, a 51-year-old woman, attends clinic after an outside cholecystectomy complicated by bile drainage. The founder reviews early records: ultrasound showed a subhepatic collection and proximal duct dilation. Doppler did not establish right hepatic arterial flow, while portal flow was present. She was stable enough for further imaging before an intervention was planned."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.vasculobiliary.v1; node node.topic.biliary-injury-malignancy.vascular-collection-imaging.v1; question question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1; concept concept.topic.biliary-injury-malignancy.vascular-collection-imaging.v1.
Complaint: Postoperative imaging review.
Demographics: {"ageYears":51,"sexLabel":"Female"}.
Presentation: {patientName}, a 51-year-old woman, attends clinic after an outside cholecystectomy complicated by bile drainage. The founder reviews early records: ultrasound showed a subhepatic collection and proximal duct dilation. Doppler did not establish right hepatic arterial flow, while portal flow was present. She was stable enough for further imaging before an intervention was planned.
Current update: none

Actual visible exhibit: none.

Task: **Which additional study should the hospital team have obtained for {patientName} at that stage?**

**key shown first for review only.**

- **KEY** Multiphasic contrast-enhanced abdominal CT [choice.topic.biliary-injury-malignancy.vascular-collection-imaging.0]. Rationale: This evaluates collections, hepatic perfusion and vascular injury in the same postoperative assessment..
- Hepatobiliary-contrast MR cholangiography [choice.topic.biliary-injury-malignancy.vascular-collection-imaging.1]. Rationale: This adds duct and leak information but does not replace the initial vascular and collection assessment raised by the Doppler findings..
- Hepatobiliary scintigraphy with delayed images [choice.topic.biliary-injury-malignancy.vascular-collection-imaging.2]. Rationale: This can show active leakage but provides less anatomical and vascular information for the present combined concern..

Explanation: The missing decision information concerns more than bile leakage: the arterial finding and collection need structural assessment. Multiphasic CT evaluates those domains. Dedicated duct mapping remains a separate potential investigation, not a substitute for vascular assessment.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.vasculobiliary.v1",
    "prototypeDemographics": {
      "ageYears": 51,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Postoperative imaging review",
    "presentation": "{patientName}, a 51-year-old woman, attends clinic after an outside cholecystectomy complicated by bile drainage. The founder reviews early records: ultrasound showed a subhepatic collection and proximal duct dilation. Doppler did not establish right hepatic arterial flow, while portal flow was present. She was stable enough for further imaging before an intervention was planned."
  }
]
```

Raw after node SHA256: c584dd72981bc8b14485f7b31013126934a0c7c75b57968a3f86fdf72eaae4b4. Composed node SHA256: 4f94fe86b3653b6f2fd134bb015001b8d36dc46511de9fc9e580082a94ea9b32.

Review-note response:
```json
{
  "clarity": "No exact PASS field edited.",
  "cues": "No changes to exact visible context or options.",
  "fairness": "Original review conclusion preserved; clinical sign-off remains separate.",
  "suggestions": "Optional PASS suggestions deliberately not applied because the manager froze exact wording."
}
```

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.ct-collections-vessels, claim.question-topic.biliary-injury-malignancy.mrcp-map, claim.question-topic.biliary-injury-malignancy.hida-limits.
Sequence disposition: Standalone exact PASS wording; no returned companion.

### question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1 — pass-preserved

Original verdict PASS. Revision attempts 0. Clinical review needs_clinician_review.

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.palliation.v1; node node.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1; question question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1; concept concept.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1.
Complaint: Jaundice treatment review.
Demographics: {"ageYears":71,"sexLabel":"Male"}.
Presentation: {patientName}, a 71-year-old man, attends clinic with an outside HPB and oncology plan. Tissue confirms distal bile-duct carcinoma, and biopsy of a liver lesion shows metastasis. He remains ambulatory but has persistent jaundice and severe itching. The oncology team plans treatment after biliary drainage. Cross-sectional imaging shows a single distal obstruction with dilated upstream ducts.
Current update: The next outside procedure report states that the ERCP team could not reach the papilla because of malignant duodenal narrowing. The stomach remains accessible and the left intrahepatic ducts are dilated. He has no hemodynamic instability. The referral center has teams experienced in both EUS-guided biliary drainage and percutaneous drainage.

Actual visible exhibit: none.

Task: **Which rescue drainage procedure should the referral team discuss for {patientName}?**

**key shown first for review only.**

- **KEY** EUS-guided biliary drainage [choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.0]. Rationale: After failed ERCP, expert EUS-guided drainage is favored when anatomy and local experience support it..
- Percutaneous transhepatic biliary drainage [choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.1]. Rationale: This is an important alternative, but current BSG guidance favors expert EUS drainage after failed distal-obstruction ERCP when feasible..
- Operative bypass with hepaticojejunostomy [choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.2]. Rationale: A surgical bypass is more invasive than the expert rescue approaches available for this stable patient..

Explanation: Papillary access failed; repeating the same route is not the remaining decision. The accessible stomach and dilated ducts support considering EUS-guided drainage at an experienced center. Percutaneous drainage remains a valid alternative if EUS access or expertise is unsuitable. No exact drainage tract or stent specification is keyed.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.palliation.v1",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Jaundice treatment review",
    "presentation": "{patientName}, a 71-year-old man, attends clinic with an outside HPB and oncology plan. Tissue confirms distal bile-duct carcinoma, and biopsy of a liver lesion shows metastasis. He remains ambulatory but has persistent jaundice and severe itching. The oncology team plans treatment after biliary drainage. Cross-sectional imaging shows a single distal obstruction with dilated upstream ducts."
  }
]
```

#### Current after

Case case.topic.biliary-injury-malignancy.palliation.v1; node node.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1; question question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1; concept concept.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1.
Complaint: Jaundice treatment review.
Demographics: {"ageYears":71,"sexLabel":"Male"}.
Presentation: {patientName}, a 71-year-old man, attends clinic with an outside HPB and oncology plan. Tissue confirms distal bile-duct carcinoma, and biopsy of a liver lesion shows metastasis. He remains ambulatory but has persistent jaundice and severe itching. The oncology team plans treatment after biliary drainage. Cross-sectional imaging shows a single distal obstruction with dilated upstream ducts.
Current update: The next outside procedure report states that the ERCP team could not reach the papilla because of malignant duodenal narrowing. The stomach remains accessible and the left intrahepatic ducts are dilated. He has no hemodynamic instability. The referral center has teams experienced in both EUS-guided biliary drainage and percutaneous drainage.

Actual visible exhibit: none.

Task: **Which rescue drainage procedure should the referral team discuss for {patientName}?**

**key shown first for review only.**

- **KEY** EUS-guided biliary drainage [choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.0]. Rationale: After failed ERCP, expert EUS-guided drainage is favored when anatomy and local experience support it..
- Percutaneous transhepatic biliary drainage [choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.1]. Rationale: This is an important alternative, but current BSG guidance favors expert EUS drainage after failed distal-obstruction ERCP when feasible..
- Operative bypass with hepaticojejunostomy [choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.2]. Rationale: A surgical bypass is more invasive than the expert rescue approaches available for this stable patient..

Explanation: Papillary access failed; repeating the same route is not the remaining decision. The accessible stomach and dilated ducts support considering EUS-guided drainage at an experienced center. Percutaneous drainage remains a valid alternative if EUS access or expertise is unsuitable. No exact drainage tract or stent specification is keyed.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.palliation.v1",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Jaundice treatment review",
    "presentation": "{patientName}, a 71-year-old man, attends clinic with an outside HPB and oncology plan. Tissue confirms distal bile-duct carcinoma, and biopsy of a liver lesion shows metastasis. He remains ambulatory but has persistent jaundice and severe itching. The oncology team plans treatment after biliary drainage. Cross-sectional imaging shows a single distal obstruction with dilated upstream ducts."
  }
]
```

Raw after node SHA256: 19f20b85efecda6c78d1dc3dad947e7301702beafc1d867ec0f659be1e99aeb3. Composed node SHA256: 19f20b85efecda6c78d1dc3dad947e7301702beafc1d867ec0f659be1e99aeb3.

Review-note response:
```json
{
  "clarity": "No exact PASS field edited.",
  "cues": "No changes to exact visible context or options.",
  "fairness": "Original review conclusion preserved; clinical sign-off remains separate.",
  "suggestions": "Optional PASS suggestions deliberately not applied because the manager froze exact wording."
}
```

Atomic evidence for presentation, observations, task, key, feedback and distractor boundaries: claim.question-topic.biliary-injury-malignancy.cca-rescue-eus.
Sequence disposition: Standalone exact PASS wording; no returned companion.

## Parked attempts — seven explicit exclusions

Each returned item below received one actual repair attempt. The attempted choices are unkeyed and are never materialized as scored questions. The exact reviewed before definitions remain in reviewRound.snapshot. These are retained gaps, not newly filled coverage.

### question.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.v1 — parked

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.major-injury.v1; node node.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.v1; question question.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.v1; concept concept.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.v1.
Complaint: Hospital record review.
Demographics: {"ageYears":56,"sexLabel":"Female"}.
Presentation: {patientName}, a 56-year-old woman, attends clinic after an outside admission following cholecystectomy. The founder reviews the early studies: a drained cavity filled from the proximal common hepatic duct, while a separate distal duct segment ended below it. There was no continuous channel across the gap. The initial hospital had no surgeon who performed complex biliary reconstruction.
Current update: The next outside-hospital entry documents a rigid, diffusely tender abdomen with falling blood pressure. CT shows fluid throughout the upper abdomen and pelvis rather than a walled-off pocket. The subhepatic catheter remains in place, and the duct segments remain separated. Resuscitation and infection treatment are underway.

Actual visible exhibit: none.

Task: **Which procedural priority should the hospital team have chosen for {patientName} during this deterioration?**

**key shown first for review only.**

- **KEY** Urgent abdominal lavage and wide drainage [choice.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.0]. Rationale: Diffuse established contamination requires abdominal source control; diversion of one duct does not remove intraperitoneal bile..
- Percutaneous transhepatic biliary diversion [choice.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.1]. Rationale: Proximal diversion can be an adjunct but does not control diffuse peritoneal contamination..
- ERCP with transpapillary plastic stenting [choice.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.2]. Rationale: This neither controls the contaminated abdomen nor establishes a route across the known gap..

Explanation: The new findings indicate diffuse abdominal contamination. Lavage and drainage take procedural priority while resuscitation continues. Definitive reconstruction is a separate specialist decision after stabilization.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.major-injury.v1",
    "prototypeDemographics": {
      "ageYears": 56,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Hospital record review",
    "presentation": "{patientName}, a 56-year-old woman, attends clinic after an outside admission following cholecystectomy. The founder reviews the early studies: a drained cavity filled from the proximal common hepatic duct, while a separate distal duct segment ended below it. There was no continuous channel across the gap. The initial hospital had no surgeon who performed complex biliary reconstruction."
  }
]
```

#### One attempted revision (not exported)

Attempt question.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.v2.
Presentation: {patientName}, a 56-year-old woman, attends clinic after an outside admission for bile-duct injury. The founder reviews a hospital deterioration with a rigid, diffusely tender abdomen and falling blood pressure. CT showed fluid throughout the abdomen and pelvis despite a subhepatic catheter. Resuscitation and antibiotics were underway.
Current update: none
Task: Which abdominal source-control approach should the hospital team have selected for {patientName}?

Unkeyed competing plans:

- Laparoscopic lavage with wide drainage
- Open lavage with wide drainage
- Image-guided catheter drainage of the fluid spaces

Scored key: withheld.
Reason: The one revision removes the rehearsed ERCP/PTBD foils and compares actual source-control methods. Urgent abdominal lavage is supported, but the record and available claims do not fairly rank laparoscopic versus open lavage. Retaining a broad lavage-versus-diversion set remains easy. Parked without hiding the emergency or claiming an accepted basic exception.
Remaining issues: No supported exclusive laparoscopic-versus-open ranking for these physiological circumstances. A broader safe source-control version remains easy, below the requested fair-moderate floor.
Next action: Manager/clinician may explicitly accept the original safety-recognition purpose or supply permitted route-selection evidence before a new scored version.

```json
{
  "clarity": "Made the deteriorating historical hospital phase self-contained.",
  "cues": "Removed previously rejected papillary and transhepatic diversion options; preserved urgent findings.",
  "fairness": "The necessary urgent priority remains clear, but the revised close alternatives require unsupported procedural ranking.",
  "suggestions": "Did not seek or assume an easy safety exception. Applied the requested source-control alternative once and parked its unresolved ranking."
}
```

```json
{
  "cueAttack": "Retained rigidity, blood-pressure deterioration and diffuse fluid. Removing those observations would create unsafe ambiguity, not fair difficulty.",
  "decisionStage": "The attempted labels are concrete plans at the stated stage; any unresolved overlap or ranking is recorded rather than hidden.",
  "reasoning": "Recognize diffuse contamination and the need for abdominal source control; available support does not establish a second defensible route-selection inference.",
  "difficulty": "Still easy at the supported broad-priority level; the closer route comparison is not fairly keyable.",
  "bestAnswer": "No scored key; the failed comparison is withheld."
}
```

### question.topic.biliary-injury-malignancy.revised-muscular-invasion.v1 — parked

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.depth-review.v1; node node.topic.biliary-injury-malignancy.revised-muscular-invasion.v1; question question.topic.biliary-injury-malignancy.revised-muscular-invasion.v1; concept concept.n1.gallbladder-muscle-invasion-referral.
Complaint: Pathology review.
Demographics: {"ageYears":43,"sexLabel":"Female"}.
Presentation: {patientName}, a 43-year-old woman, attends clinic after cholecystectomy.
Current update: At the next clinic visit, deeper levels from a retained block show glands among smooth-muscle bundles. The cystic-duct margin remains negative. Updated staging shows no metastases, and she remains independently active without limiting cardiopulmonary symptoms.

Actual visible exhibit: none.

Task: **Which cancer-planning action should now be arranged for {patientName}?**

**key shown first for review only.**

- **KEY** HPB assessment for completion oncologic resection [choice.topic.biliary-injury-malignancy.revised-muscular-invasion.0]. Rationale: New muscle involvement moves the case outside the prior shallow-depth pathway; assessment does not mandate a particular operation..
- Cancer-team surveillance after cholecystectomy [choice.topic.biliary-injury-malignancy.revised-muscular-invasion.1]. Rationale: A clear margin does not preserve the earlier depth interpretation after glands are found in muscle..
- HPB assessment for extrahepatic duct resection [choice.topic.biliary-injury-malignancy.revised-muscular-invasion.2]. Rationale: This targets a duct-margin problem not shown by the new report..

Explanation: The addendum changes depth while the duct margin remains clear. Muscular invasion requires renewed HPB oncologic assessment. The exact completion operation for every T1b patient is not resolved by this draft.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.depth-review.v1",
    "prototypeDemographics": {
      "ageYears": 43,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Pathology review",
    "presentation": "{patientName}, a 43-year-old woman, attends clinic after cholecystectomy."
  }
]
```

#### One attempted revision (not exported)

Attempt question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2.
Presentation: {patientName}, a 43-year-old woman, attends clinic after incidental gallbladder adenocarcinoma. The original report described invasion into lamina propria, represented uninvolved muscle and clear margins. A new addendum from deeper levels identifies irregular infiltrating malignant glands with desmoplastic stroma among muscle bundles. The cystic-duct margin remains clear. Staging shows no metastases and she is independently active.
Current update: none
Task: Which definitive oncologic plan should the HPB team select for {patientName} after the addendum?

Unkeyed competing plans:

- Completion liver-bed resection with regional lymphadenectomy
- Cancer-team surveillance after cholecystectomy
- Extrahepatic duct resection with reconstruction

Scored key: withheld.
Reason: Baseline and malignant invasion are now explicit, and the overlapping generic-versus-specific assessment options are removed. However, an exclusive mandatory completion-operation key for every T1b patient remains disputed in the permitted sources. A broad HPB-assessment alternative is clinically reasonable but remains an easy reassessment item. Parked.
Remaining issues: Exact T1b operation versus surveillance requires named clinical adjudication. Returning to a generic referral key does not satisfy the requested difficult/fair-moderate comparison.
Next action: Melissa/HPB reviewer decides the exact T1b plan or explicitly accepts a simpler reassessment objective.

```json
{
  "clarity": "Restored the original baseline and identified the addendum as malignant infiltrating glands with stromal invasion, not benign invagination.",
  "cues": "Removed broad completion-assessment versus narrower duct-assessment overlap and removed preceding shallow-cancer scored feedback by splitting cases.",
  "fairness": "Did not convert debated T1b extent into a mandatory key. The sources support reassessment but not the stronger exclusive operation claim.",
  "suggestions": "Applied one same-stage repair, then parked when the evidence could not support its remaining ranking."
}
```

```json
{
  "cueAttack": "The addendum explicitly identifies malignant infiltrating glands rather than any glands in muscle. This is a known cancer for a treatment task, not a histology diagnosis guessed from a vague phrase.",
  "decisionStage": "The attempted labels are concrete plans at the stated stage; any unresolved overlap or ranking is recorded rather than hidden.",
  "reasoning": "The depth change is established, but the second definitive-treatment ranking is not resolved by the evidence in this packet.",
  "difficulty": "Definitive-operation comparison is unresolved; the supported referral boundary remains easy.",
  "bestAnswer": "No scored key; the failed comparison is withheld."
}
```

### question.topic.biliary-injury-malignancy.distal-combined-sampling.v1 — parked

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.distal-stricture.v1; node node.topic.biliary-injury-malignancy.distal-combined-sampling.v1; question question.topic.biliary-injury-malignancy.distal-combined-sampling.v1; concept concept.topic.biliary-injury-malignancy.distal-combined-sampling.v1.
Complaint: Jaundice review.
Demographics: {"ageYears":64,"sexLabel":"Male"}.
Presentation: {patientName}, a 64-year-old man, attends clinic with an outside jaundice workup. CT and MRI/MRCP show an irregular intrapancreatic distal bile-duct narrowing with upstream dilation, no pancreatic mass, and no metastases. Bilirubin is elevated and he has scleral icterus. Cross-sectional staging has been completed before an endoscopic plan is chosen.
Current update: none

Actual visible exhibit: none.

Task: **Which tissue-acquisition plan should the HPB team arrange for {patientName}?**

**key shown first for review only.**

- **KEY** EUS-guided sampling plus ERCP-based sampling [choice.topic.biliary-injury-malignancy.distal-combined-sampling.0]. Rationale: For jaundiced distal extrahepatic strictures without a pancreatic mass, complementary EUS and ERCP tissue acquisition is supported..
- ERCP brush cytology as the sampling method [choice.topic.biliary-injury-malignancy.distal-combined-sampling.1]. Rationale: Brushing accesses the stricture but omits complementary tissue assessment and can be nondiagnostic..
- EUS-guided sampling as the sampling method [choice.topic.biliary-injury-malignancy.distal-combined-sampling.2]. Rationale: EUS is useful, but this jaundiced distal-duct profile supports complementary duct-based acquisition..

Explanation: The location, jaundice and absence of a pancreatic mass define the relevant diagnostic profile. Combined EUS-guided and ERCP-based tissue acquisition is supported after staging imaging. The plan does not equate a serum marker or one limited specimen with confirmation.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.distal-stricture.v1",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Jaundice review",
    "presentation": "{patientName}, a 64-year-old man, attends clinic with an outside jaundice workup. CT and MRI/MRCP show an irregular intrapancreatic distal bile-duct narrowing with upstream dilation, no pancreatic mass, and no metastases. Bilirubin is elevated and he has scleral icterus. Cross-sectional staging has been completed before an endoscopic plan is chosen."
  }
]
```

#### One attempted revision (not exported)

Attempt question.topic.biliary-injury-malignancy.distal-combined-sampling.v2.
Presentation: {patientName}, a 64-year-old man, attends clinic with outside jaundice records. Imaging shows an irregular distal bile-duct stricture, upstream dilation, no pancreatic mass and no distant disease. The founder reviews the endoscopic sampling options.
Current update: none
Task: Which initial tissue-acquisition strategy should the specialist team select for {patientName}?

Unkeyed competing plans:

- EUS-guided duct-wall core sampling
- ERCP brushings with intraductal forceps biopsies
- Cholangioscopy-guided intraductal biopsy

Scored key: withheld.
Reason: The one attempt removes the comprehensive A-plus-B versus A versus B shortcut and the decorative staging-sequence sentence. The equally complete target-based alternatives do not have an exclusive patient-specific ranking established here. The existing combined-method recommendation is not declared false, but repeating it as a uniquely comprehensive key would remain easy and specialized. Parked.
Remaining issues: No exclusive initial one-route comparison established for this exact distal lesion. No supported consequential patient discriminator for a categorical combined-method preference.
Next action: Clinician confirms a consequential target-specific discriminator or chooses a deliberately focused simpler teaching role.

```json
{
  "clarity": "The patient and raw duct profile remain self-contained; removed the author-announced staging sequence.",
  "cues": "Removed the only-comprehensive combination option and component convergence.",
  "fairness": "Recorded current guideline support for combination as general guidance without fabricating an exclusive ranking among equally complete new alternatives.",
  "suggestions": "Attempted the requested target/route comparison once; parked instead of overstating a specialized preference as a general board distinction."
}
```

```json
{
  "cueAttack": "All options are full tissue-acquisition methods; none is the union of its competitors. No time threshold or manufactured safety contraindication is supplied.",
  "decisionStage": "The attempted labels are concrete plans at the stated stage; any unresolved overlap or ranking is recorded rather than hidden.",
  "reasoning": "Localize the distal target, then choose a tissue strategy; the second choice is not uniquely resolved by the given findings.",
  "difficulty": "Original combination preference remains easy; the revised equally complete comparison is underdetermined.",
  "bestAnswer": "No scored key; the failed comparison is withheld."
}
```

### question.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v1 — parked

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.distal-stricture.v1; node node.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v1; question question.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v1; concept concept.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v1.
Complaint: Jaundice review.
Demographics: {"ageYears":64,"sexLabel":"Male"}.
Presentation: {patientName}, a 64-year-old man, attends clinic with an outside jaundice workup. CT and MRI/MRCP show an irregular intrapancreatic distal bile-duct narrowing with upstream dilation, no pancreatic mass, and no metastases. Bilirubin is elevated and he has scleral icterus. Cross-sectional staging has been completed before an endoscopic plan is chosen.
Current update: EUS found no discrete pancreatic or nodal target. ERCP brushings contain scant atypical cells, and fluoroscopy-guided biopsies show fibrosis without adequate lesional epithelium. Repeat imaging shows the same focal irregular duct thickening. A temporary stent drains the duct, and he has no fever.

Actual visible exhibit: none.

Task: **Which additional endoscopic sampling approach should the HPB team select for {patientName} now?**

**key shown first for review only.**

- **KEY** Cholangioscopy-guided biopsy of the stricture [choice.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.0]. Rationale: Persistent suspicious morphology and inadequate prior tissue support targeted intraductal sampling..
- Repeat brush cytology of the same stricture [choice.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.1]. Rationale: A repeated low-yield route is tempting but does not address the lack of a directly targeted sample after initial standard methods..
- Repeat EUS needle sampling at the duct narrowing [choice.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.2]. Rationale: The current study found no discrete extraluminal target; a complementary intraductal approach addresses the demonstrated sampling limitation..

Explanation: Nondiagnostic samples are not evidence that the persistent stricture is benign. Cholangioscopy-guided biopsy adds direct intraductal targeting after standard ERCP sampling. Further care remains an HPB multidisciplinary decision; this question does not require histology before every potentially curative operation.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.distal-stricture.v1",
    "prototypeDemographics": {
      "ageYears": 64,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Jaundice review",
    "presentation": "{patientName}, a 64-year-old man, attends clinic with an outside jaundice workup. CT and MRI/MRCP show an irregular intrapancreatic distal bile-duct narrowing with upstream dilation, no pancreatic mass, and no metastases. Bilirubin is elevated and he has scleral icterus. Cross-sectional staging has been completed before an endoscopic plan is chosen."
  }
]
```

#### One attempted revision (not exported)

Attempt question.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v2.
Presentation: {patientName}, a 64-year-old man, attends clinic after an outside workup of a persistent distal bile-duct stricture. EUS visualized duct-wall thickening but no pancreatic mass or node; no needle sample of the duct wall was obtained. ERCP brushings were scant and atypical, and fluoroscopic biopsy lacked adequate lesional epithelium. The stricture persists on imaging. A temporary stent drains the duct, and he has no fever.
Current update: none
Task: Which additional tissue-acquisition approach should the specialist team select for {patientName} now?

Unkeyed competing plans:

- Cholangioscopy-guided stricture biopsy
- EUS-guided core sampling of the duct wall
- Fluoroscopic forceps sampling of the stricture

Scored key: withheld.
Reason: The one attempt now states exactly what EUS visualized and did not sample. The options no longer use a unique novel technique versus two Repeat labels. Direct cholangioscopy is reasonable, but current findings do not exclude a useful first EUS duct-wall sample or improved fluoroscopic acquisition. Exclusive ranking remains unresolved, so the attempt is parked without claiming that absence of a pancreatic mass makes duct-wall EUS sampling impossible.
Remaining issues: Cholangioscopy versus EUS duct-wall sampling remains a credible unresolved alternative. Inadequate first sampling does not establish that all improved standard sampling is inappropriate.
Next action: HPB/endoscopy clinician resolves the exact cholangioscopy-versus-EUS/standard-acquisition comparison using patient-specific evidence.

```json
{
  "clarity": "Explicitly states no duct-wall needle sample was obtained; no unperformed procedure is called a repeat.",
  "cues": "All three labels are direct target-based acquisition plans with no unique-new-method styling.",
  "fairness": "Recognizes that EUS can sample duct-wall thickening even without a pancreatic or nodal target; does not equate inadequate samples with a proven benign result.",
  "suggestions": "Applied the requested chronology and targeting repair once, then parked pending the requested HPB/endoscopy adjudication."
}
```

```json
{
  "cueAttack": "Removed every Repeat prefix and supplied actual EUS chronology. No invented intervening vessel or unsupplied failed needle procedure is used to force the key.",
  "decisionStage": "The attempted labels are concrete plans at the stated stage; any unresolved overlap or ranking is recorded rather than hidden.",
  "reasoning": "Interpret inadequate pathology as non-exclusion of malignancy; the preferred next target acquisition still requires clinician-specific adjudication.",
  "difficulty": "The adequacy inference can be moderate, but the exclusive route key is not fair from these findings.",
  "bestAnswer": "No scored key; the failed comparison is withheld."
}
```

### question.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v1 — parked

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.benign-stricture.v1; node node.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v1; question question.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v1; concept concept.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v1.
Complaint: Jaundice follow-up.
Demographics: {"ageYears":49,"sexLabel":"Male"}.
Presentation: {patientName}, a 49-year-old man, attends clinic after an outside evaluation for jaundice following cholecystectomy. MRCP shows a short smooth mid-duct narrowing with a continuous lumen and upstream dilation. ERCP passed a guidewire across it; intraductal samples show scar without atypia, and staging scans show no mass. The HPB team attributes it to the prior operation and is selecting an endoscopic treatment course.
Current update: Years later, the outside record documents recurrent febrile jaundice. MRCP now shows a long high-duct scar ending below the hepatic confluence. At two expert ERCP attempts a guidewire could not cross it. A transhepatic drain relieved the infection. He has recovered, has no hepatic atrophy or metastases, and remains active.

Actual visible exhibit: none.

Task: **Which definitive treatment should the HPB team evaluate for {patientName} after infection control?**

**key shown first for review only.**

- **KEY** Roux-en-Y hepaticojejunostomy reconstruction [choice.topic.biliary-injury-malignancy.refractory-postoperative-stricture.0]. Rationale: A clinically significant major stricture with recurrent infection and failed restoration of endoscopic drainage warrants reconstructive evaluation..
- Another transpapillary plastic-stent course [choice.topic.biliary-injury-malignancy.refractory-postoperative-stricture.1]. Rationale: This assumes passage across a scar that expert attempts could not traverse..
- Permanent external transhepatic drainage [choice.topic.biliary-injury-malignancy.refractory-postoperative-stricture.2]. Rationale: External drainage controls infection, but in this recovered fit patient it does not address the underlying scar as a durable reconstructive option..

Explanation: Temporary drainage has controlled the acute infection. The remaining problem is a major recurrent stricture that could not be traversed endoscopically. Specialist biliary reconstruction evaluation is appropriate; the date, access method and anastomotic details are not prescribed.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.benign-stricture.v1",
    "prototypeDemographics": {
      "ageYears": 49,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Jaundice follow-up",
    "presentation": "{patientName}, a 49-year-old man, attends clinic after an outside evaluation for jaundice following cholecystectomy. MRCP shows a short smooth mid-duct narrowing with a continuous lumen and upstream dilation. ERCP passed a guidewire across it; intraductal samples show scar without atypia, and staging scans show no mass. The HPB team attributes it to the prior operation and is selecting an endoscopic treatment course."
  }
]
```

#### One attempted revision (not exported)

Attempt question.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v2.
Presentation: {patientName}, a 49-year-old man, attends clinic to review outside stricture treatment. Six years earlier, at age 43, a short clip-level mid-duct postoperative narrowing was traversed and treated with an endoscopic stent course. He had an interval without febrile jaundice. Current serial reports describe proximal extension of that same scar toward the confluence. Expert retrograde attempts no longer cross it. Transhepatic drainage controlled the latest infection, and he has recovered.
Current update: none
Task: Which definitive biliary strategy should the HPB team select for {patientName} after recovery?

Unkeyed competing plans:

- Roux-en-Y hepaticojejunostomy reconstruction
- Percutaneous cholangioplasty with internal drainage
- Percutaneous-endoscopic rendezvous stenting

Scored key: withheld.
Reason: The one attempt clarifies the age/date anchor, intervening treatment and reported same-site extension. It replaces an unchanged failed ERCP and Permanent external drainage with real percutaneous and combined approaches. The existing evidence does not exclusively rank those feasible expert options against reconstruction for the supplied anatomy. Parked pending anatomy-specific adjudication.
Remaining issues: A percutaneous or rendezvous strategy remains a real alternative after failed retrograde traversal. The prior broad escalation question is easy; a closer definitive-route comparison lacks adequate patient-specific support.
Next action: Clinician reviews the actual duct map and feasibility of percutaneous/rendezvous restoration versus reconstruction; no general permanent-drain claim is taught.

```json
{
  "clarity": "Provided a historical age anchor, completed prior stent course and explicit reported proximal extension of the same scar.",
  "cues": "Removed both the already-failed unchanged ERCP foil and the absolute Permanent external-drain label.",
  "fairness": "Did not imply that retrograde failure makes every percutaneous restoration impossible. Infection control is completed before definitive planning.",
  "suggestions": "Applied one clinically real remaining-strategy comparison and parked it because the required patient-specific superiority is not established."
}
```

```json
{
  "cueAttack": "No option advertises permanent dependence or simply repeats the failed retrograde procedure. Chronology is explicit rather than attaching years of events to one unchanged age.",
  "decisionStage": "The attempted labels are concrete plans at the stated stage; any unresolved overlap or ranking is recorded rather than hidden.",
  "reasoning": "Interpret changed access and recurrence, then compare real definitive routes; the second ranking is not established by the currently sourced case.",
  "difficulty": "The safe general reconstructive-referral boundary is easy; the closer route ranking remains uncertain.",
  "bestAnswer": "No scored key; the failed comparison is withheld."
}
```

### question.topic.biliary-injury-malignancy.arterial-injury-perfusion.v1 — parked

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.vasculobiliary.v1; node node.topic.biliary-injury-malignancy.arterial-injury-perfusion.v1; question question.topic.biliary-injury-malignancy.arterial-injury-perfusion.v1; concept concept.topic.biliary-injury-malignancy.arterial-injury-perfusion.v1.
Complaint: Postoperative imaging review.
Demographics: {"ageYears":51,"sexLabel":"Female"}.
Presentation: {patientName}, a 51-year-old woman, attends clinic after an outside cholecystectomy complicated by bile drainage. The founder reviews early records: ultrasound showed a subhepatic collection and proximal duct dilation. Doppler did not establish right hepatic arterial flow, while portal flow was present. She was stable enough for further imaging before an intervention was planned.
Current update: The outside multiphasic CT shows occlusion of the right hepatic artery, a patent right portal branch, and enhancement throughout the right liver without necrotic areas. The collection is drained, and she remains stable. The HPB team is planning staged biliary treatment.

Actual visible exhibit: none.

Task: **Which vascular-liver plan should the HPB team have selected for {patientName} from this record?**

**key shown first for review only.**

- **KEY** Monitor hepatic perfusion during staged biliary care [choice.topic.biliary-injury-malignancy.arterial-injury-perfusion.0]. Rationale: Preserved portal flow and maintained parenchymal enhancement do not establish a need for emergency arterial reconstruction or liver removal..
- Attempt immediate right hepatic arterial reconstruction [choice.topic.biliary-injury-malignancy.arterial-injury-perfusion.1]. Rationale: Arterial occlusion may prompt repair, but routine immediate reconstruction is not established for this stable, perfused liver..
- Proceed with right hepatectomy during duct repair [choice.topic.biliary-injury-malignancy.arterial-injury-perfusion.2]. Rationale: There is no demonstrated right-liver necrosis or nonviable territory requiring resection..

Explanation: Arterial interruption and nonviable liver are different findings. Preserved portal flow and right-liver enhancement support specialist perfusion surveillance during biliary management rather than automatic arterial reconstruction or hepatectomy. This low-certainty boundary requires HPB clinician review.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.vasculobiliary.v1",
    "prototypeDemographics": {
      "ageYears": 51,
      "sexLabel": "Female"
    },
    "chiefComplaint": "Postoperative imaging review",
    "presentation": "{patientName}, a 51-year-old woman, attends clinic after an outside cholecystectomy complicated by bile drainage. The founder reviews early records: ultrasound showed a subhepatic collection and proximal duct dilation. Doppler did not establish right hepatic arterial flow, while portal flow was present. She was stable enough for further imaging before an intervention was planned."
  }
]
```

#### One attempted revision (not exported)

Attempt question.topic.biliary-injury-malignancy.arterial-injury-perfusion.v2.
Presentation: {patientName}, a 51-year-old woman, attends clinic after a combined biliary and vascular injury. The founder reviews the sixth postoperative day CT: the right hepatic artery is interrupted at clips, its distal branches reconstitute, the right portal branch is patent, and the right liver enhances without necrotic areas. There is no active bleeding and she is stable. The record does not establish operative repairability of the arterial segment.
Current update: none
Task: Which vascular-liver plan should the HPB team select for {patientName} from this record?

Unkeyed competing plans:

- Serial perfusion imaging and liver biochemistry
- Arterial angiography with revascularization assessment
- Right hepatectomy after vascular mapping

Scored key: withheld.
Reason: The one attempt removes the announced staged-care plan, identifies the constructed chronology and observed arterial anatomy, and names a concrete surveillance plan. Preserved enhancement excludes automatic inference of current liver necrosis, but it still does not establish an exclusive surveillance-versus-selected-revascularization ranking. Parked as requested for the low-certainty arterial-repair boundary.
Remaining issues: Exact repairability and value of selected revascularization remain unsettled. A narrower current-perfusion interpretation would be simpler than the requested consequential management score.
Next action: HPB vascular/reconstructive clinician adjudicates the exact repairable anatomy and timing; do not change the preserved imaging PASS companion.

```json
{
  "clarity": "Added a historical day anchor and clip-level interruption/distal reconstitution; specified actual proposed observation tests. Did not invent a repair-time cutoff.",
  "cues": "Removed staged biliary care from both context and key styling. All labels are concrete vascular-liver plans.",
  "fairness": "Preserved uncertainty about selected arterial repair and delayed biliary ischemic consequences. Current enhancement is not treated as proof that all repair is unnecessary.",
  "suggestions": "Applied one concrete-plan repair, then held the exact ranking rather than claiming a sole surveillance answer."
}
```

```json
{
  "cueAttack": "No option repeats staged care. Viability observations remain visible; they cannot be deleted to make hepatectomy a stronger competitor. The first two plans remain credible, so no key is issued.",
  "decisionStage": "The attempted labels are concrete plans at the stated stage; any unresolved overlap or ranking is recorded rather than hidden.",
  "reasoning": "Distinguish an occluded artery from nonviable parenchyma; the subsequent repair-versus-surveillance decision remains uncertain.",
  "difficulty": "Potentially moderate inference, but no fair exclusive management key from the available evidence.",
  "bestAnswer": "No scored key; the failed comparison is withheld."
}
```

### question.topic.biliary-injury-malignancy.palliative-distal-stent.v1 — parked

#### Exact reviewed before

Case case.topic.biliary-injury-malignancy.palliation.v1; node node.topic.biliary-injury-malignancy.palliative-distal-stent.v1; question question.topic.biliary-injury-malignancy.palliative-distal-stent.v1; concept concept.topic.biliary-injury-malignancy.palliative-distal-stent.v1.
Complaint: Jaundice treatment review.
Demographics: {"ageYears":71,"sexLabel":"Male"}.
Presentation: {patientName}, a 71-year-old man, attends clinic with an outside HPB and oncology plan. Tissue confirms distal bile-duct carcinoma, and biopsy of a liver lesion shows metastasis. He remains ambulatory but has persistent jaundice and severe itching. The oncology team plans treatment after biliary drainage. Cross-sectional imaging shows a single distal obstruction with dilated upstream ducts.
Current update: none

Actual visible exhibit: none.

Task: **Which initial drainage plan should the HPB team discuss for {patientName}?**

**key shown first for review only.**

- **KEY** ERCP with a covered self-expanding metal stent [choice.topic.biliary-injury-malignancy.palliative-distal-stent.0]. Rationale: Confirmed unresectable distal malignant obstruction supports a metal stent for durable palliation..
- ERCP with serial plastic biliary stent exchanges [choice.topic.biliary-injury-malignancy.palliative-distal-stent.1]. Rationale: Plastic stenting can temporarily decompress the duct but is less suitable as the planned long-term palliative course..
- Operative biliary bypass with hepaticojejunostomy [choice.topic.biliary-injury-malignancy.palliative-distal-stent.2]. Rationale: Bypass may be needed in selected failed less-invasive pathways, but is not the preferred initial drainage route in this accessible distal obstruction..

Explanation: The metastatic confirmation changes the goal from curative resection to durable symptom-relieving drainage. For distal malignant obstruction, metal stenting is favored over a repeated plastic-stent course. The item does not score chemotherapy choice or expected survival.

Exact finite profile:
```json
[
  {
    "id": "profile.topic.biliary-injury-malignancy.palliation.v1",
    "prototypeDemographics": {
      "ageYears": 71,
      "sexLabel": "Male"
    },
    "chiefComplaint": "Jaundice treatment review",
    "presentation": "{patientName}, a 71-year-old man, attends clinic with an outside HPB and oncology plan. Tissue confirms distal bile-duct carcinoma, and biopsy of a liver lesion shows metastasis. He remains ambulatory but has persistent jaundice and severe itching. The oncology team plans treatment after biliary drainage. Cross-sectional imaging shows a single distal obstruction with dilated upstream ducts."
  }
]
```

#### One attempted revision (not exported)

Attempt question.topic.biliary-injury-malignancy.palliative-distal-stent.v2.
Presentation: {patientName}, a 71-year-old man, attends clinic with an outside plan for biopsy-confirmed metastatic distal bile-duct cancer. He is ambulatory but has persistent jaundice and severe itching. A single distal obstruction dilates the upstream ducts. The team plans symptom-relieving drainage before oncology treatment.
Current update: none
Task: Which initial drainage plan should the HPB team select for {patientName}?

Unkeyed competing plans:

- ERCP with a self-expanding metal stent
- ERCP with a plastic biliary stent
- Operative biliary bypass

Scored key: withheld.
Reason: The one attempt gives the endoscopic options parallel labels and moves exchange burden out of the choice text. Metal-stent palliation remains a supported answer to the simple device rule, but malignancy, distal location and the drainage goal are already established; no additional consequential inference is earned. A harder strategy comparison would need a separately supported patient-specific factor. Parked for persistent easy difficulty, not because the general metal-stent principle is claimed incorrect.
Remaining issues: Remains a one-rule easy device-selection item after wording repair. No accepted basic exception or sourced additional discriminator is supplied.
Next action: Manager may later authorize a basic role or provide a sourced anatomical/patient tradeoff for another review cycle.

```json
{
  "clarity": "Maintained the short known-diagnosis management frame.",
  "cues": "Made both endoscopic labels parallel and removed explicit exchange burden from the distractor.",
  "fairness": "General metal-versus-plastic palliation is supported; no survival threshold, drug regimen or extra confirmation of palliative intent is invented.",
  "suggestions": "Applied the requested wording repair once. Parked the persistent easy rule while preserving the later rescue PASS unchanged in a separate self-contained case."
}
```

```json
{
  "cueAttack": "Removed serial exchange wording and uniquely single-intervention styling. The fair parallel set remains easy even after the cue is gone.",
  "decisionStage": "The attempted labels are concrete plans at the stated stage; any unresolved overlap or ranking is recorded rather than hidden.",
  "reasoning": "Confirmed palliative context leaves one device-choice rule; another confirmation of palliative intent would not add a consequential step.",
  "difficulty": "Fair but still easy; the manager permitted fair moderate versions, not an automatic easy exception.",
  "bestAnswer": "No scored key; the failed comparison is withheld."
}
```

## Ranked concepts, coverage and stable identities

Ranks are qualitative practical testability judgments, not asserted exam frequencies or learner-performance measurements. Current coverage distinguishes exact PASS, revised pending and parked gaps. Three materially changed scores receive new meaning versions; the original definitions and FSRS histories remain.

| Rank | Current decision | Status | Exact active version(s) | Coverage |
|---|---|---|---|---|
| 1 | Select interim proximal decompression when a septic obstructed duct cannot be reached from the papilla. | revised | question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2 | Revised candidate pending independent re-review; not independently passed. |
| 2 | Select internal diversion for persistent communicating leakage after collection control. | pass-preserved | question.topic.biliary-injury-malignancy.communicating-leak-stent.v1 | Exact independent PASS preserved; named clinical review pending. |
| 3 | Distinguish failed collection drainage from failed internal diversion after treatment. | revised | question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2 | Revised candidate pending independent re-review; not independently passed. |
| 4 | Apply represented invasion depth and clear margins to avoid unnecessary completion surgery. | revised | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 | Revised candidate pending independent re-review; not independently passed. |
| 5 | Reassess completion surgery when an addendum changes depth evidence. | parked | No scored version | Parked after one attempted revision; no scored coverage claimed. |
| 6 | Choose completion resection scope without routine major hepatic or duct resection. | revised | question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2 | Revised candidate pending independent re-review; not independently passed. |
| 7 | Modify a completion operation for newly demonstrated common-duct wall involvement. | revised | question.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v2 | Revised candidate pending independent re-review; not independently passed. |
| 8 | Choose intraductal sampling while preserving potential curative pathways. | pass-preserved | question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1 | Exact independent PASS preserved; named clinical review pending. |
| 9 | Select additional drainage of an infected residual territory despite functioning remnant drainage. | revised | question.topic.biliary-injury-malignancy.future-remnant-drainage.v2 | Revised candidate pending independent re-review; not independently passed. |
| 10 | Choose location-specific tissue evaluation for a jaundiced distal stricture without a pancreatic mass. | parked | No scored version | Parked after one attempted revision; no scored coverage claimed. |
| 11 | Use nondiagnostic sampling and persistent morphology to select additional targeted tissue acquisition. | parked | No scored version | Parked after one attempted revision; no scored coverage claimed. |
| 12 | Select imaging that evaluates both collections and possible associated vascular injury. | pass-preserved | question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1 | Exact independent PASS preserved; named clinical review pending. |
| 13 | Interpret isolated hepatic artery interruption with preserved perfusion before escalating hepatic surgery. | parked | No scored version | Parked after one attempted revision; no scored coverage claimed. |
| 14 | Select specialist reconstruction planning for recurrent obstruction after failed traversable treatment. | parked | No scored version | Parked after one attempted revision; no scored coverage claimed. |
| 15 | Use the stricture-to-confluence relationship to choose a postcholecystectomy stent strategy. | revised | question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2 | Revised candidate pending independent re-review; not independently passed. |
| 16 | Choose a durable drainage device for confirmed unresectable distal malignancy. | parked | No scored version | Parked after one attempted revision; no scored coverage claimed. |
| 17 | Choose expert rescue biliary drainage after failed endoscopic cannulation. | pass-preserved | question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1 | Exact independent PASS preserved; named clinical review pending. |
| 18 | Use nonobstructive extrahepatic cyst anatomy to choose treatment rather than internal drainage. | revised | question.topic.biliary-injury-malignancy.type-i-cyst-excision.v2 | Revised candidate pending independent re-review; not independently passed. |
| 19 | Prioritize abdominal source control for diffuse contamination after major duct injury. | parked | No scored version | Parked after one attempted revision; no scored coverage claimed. |

```json
[
  {
    "previousConceptId": "concept.n2.bile-leak-duct-continuity-boundary",
    "conceptId": "concept.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "previousObjective": "Recognize major continuity failure before applying routine minor-leak stenting.",
    "newObjective": "Select interim proximal decompression when a septic obstructed duct cannot be reached from the papilla.",
    "historyMigration": "none",
    "reviewStatus": "needs_clinician_review"
  },
  {
    "previousConceptId": "concept.topic.biliary-injury-malignancy.future-remnant-drainage.v1",
    "conceptId": "concept.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "previousObjective": "Choose the preoperative drainage territory from a planned resection and observed obstruction.",
    "newObjective": "Select additional drainage of an infected residual territory despite functioning remnant drainage.",
    "historyMigration": "none",
    "reviewStatus": "needs_clinician_review"
  },
  {
    "previousConceptId": "concept.topic.biliary-injury-malignancy.benign-continuity-stenting.v1",
    "conceptId": "concept.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "previousObjective": "Choose a reversible endoscopic treatment strategy for a traversable postoperative benign stricture.",
    "newObjective": "Use the stricture-to-confluence relationship to choose a postcholecystectomy stent strategy.",
    "historyMigration": "none",
    "reviewStatus": "needs_clinician_review"
  }
]
```

```json
[
  {
    "rank": 1,
    "conceptId": "concept.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "previousConceptId": "concept.n2.bile-leak-duct-continuity-boundary",
    "existingInventoryRecordIds": [
      "inventory.de0e9b9b78a3c1f2"
    ],
    "existingVariantIds": [
      "question.n2.bile-leak-duct-continuity-boundary.v1"
    ],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2"
    ],
    "coverageBefore": "Represented with presentation, repetition or reasoning limitations.",
    "coverageAfter": "Revised candidate pending independent re-review; not independently passed.",
    "reviewResponseStatus": "revised"
  },
  {
    "rank": 2,
    "conceptId": "concept.bile-leak.minor-leak-ercp-stent",
    "previousConceptId": "concept.bile-leak.minor-leak-ercp-stent",
    "existingInventoryRecordIds": [
      "inventory.3f15d225b677a625",
      "inventory.a14e0c155c07b00f",
      "inventory.4ebfdad274f79b1b",
      "inventory.1d88b1381ced424f"
    ],
    "existingVariantIds": [
      "question.bile-leak.minor-leak-ercp-stent.v3",
      "question.bile-leak.minor-leak-ercp-stent.v1",
      "question.bile-leak.minor-leak-ercp-stent.v4",
      "question.bile-leak.minor-leak-ercp-stent.v2"
    ],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.communicating-leak-stent.v1"
    ],
    "coverageBefore": "Represented with presentation, repetition or reasoning limitations.",
    "coverageAfter": "Exact independent PASS preserved; named clinical review pending.",
    "reviewResponseStatus": "pass-preserved"
  },
  {
    "rank": 3,
    "conceptId": "concept.topic.biliary-injury-malignancy.reaccumulating-biloma.v1",
    "previousConceptId": "concept.topic.biliary-injury-malignancy.reaccumulating-biloma.v1",
    "existingInventoryRecordIds": [
      "inventory.3f15d225b677a625",
      "inventory.4ebfdad274f79b1b",
      "inventory.1d88b1381ced424f"
    ],
    "existingVariantIds": [
      "question.bile-leak.minor-leak-ercp-stent.v3",
      "question.bile-leak.minor-leak-ercp-stent.v4",
      "question.bile-leak.minor-leak-ercp-stent.v2"
    ],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2"
    ],
    "coverageBefore": "Represented with presentation, repetition or reasoning limitations.",
    "coverageAfter": "Revised candidate pending independent re-review; not independently passed.",
    "reviewResponseStatus": "revised"
  },
  {
    "rank": 4,
    "conceptId": "concept.gs028g.incidental-gallbladder.completely-resected-t1a",
    "previousConceptId": "concept.gs028g.incidental-gallbladder.completely-resected-t1a",
    "existingInventoryRecordIds": [
      "inventory.28aa36e6bf42b7f7",
      "inventory.4ded7f802bcde1d4",
      "inventory.0a5943063faf45a2",
      "inventory.da1b615d34979a13",
      "inventory.22699f4b4a856bb7",
      "inventory.4c7c59d082ab663d",
      "inventory.8c42a2a9987cac65",
      "inventory.4a8ca03fdd38795f"
    ],
    "existingVariantIds": [
      "question.gs028g.incidental-gallbladder.t1a-depth.v3",
      "question.gs028g.incidental-gallbladder.t1a-depth.v4",
      "question.gs028g.incidental-gallbladder.completely-resected-t1a.v4",
      "question.gs028g.incidental-gallbladder.completely-resected-t1a.v3",
      "question.gs028g.incidental-gallbladder.completely-resected-t1a.v2",
      "question.gs028g.incidental-gallbladder.t1a-depth.v2",
      "question.gs028g.incidental-gallbladder.completely-resected-t1a.v1",
      "question.gs028g.incidental-gallbladder.t1a-depth.v1"
    ],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.t1a-complete-resection.v2"
    ],
    "coverageBefore": "Represented with presentation, repetition or reasoning limitations.",
    "coverageAfter": "Revised candidate pending independent re-review; not independently passed.",
    "reviewResponseStatus": "revised"
  },
  {
    "rank": 5,
    "conceptId": "concept.n1.gallbladder-muscle-invasion-referral",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.28aa36e6bf42b7f7",
      "inventory.4ded7f802bcde1d4",
      "inventory.4c7c59d082ab663d",
      "inventory.4a8ca03fdd38795f",
      "inventory.dbb3f35cdf84e6d8",
      "inventory.1c6c49bd8d00de6e"
    ],
    "existingVariantIds": [
      "question.gs028g.incidental-gallbladder.t1a-depth.v3",
      "question.gs028g.incidental-gallbladder.t1a-depth.v4",
      "question.gs028g.incidental-gallbladder.t1a-depth.v2",
      "question.gs028g.incidental-gallbladder.t1a-depth.v1",
      "question.n1.incidental-t1b.v1",
      "question.n1.incidental-t1b.v2"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Represented with presentation, repetition or reasoning limitations.",
    "coverageAfter": "Parked after one attempted revision; no scored coverage claimed.",
    "reviewResponseStatus": "parked"
  },
  {
    "rank": 6,
    "conceptId": "concept.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1",
    "previousConceptId": "concept.topic.biliary-injury-malignancy.t2-margin-directed-completion.v1",
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2"
    ],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Revised candidate pending independent re-review; not independently passed.",
    "reviewResponseStatus": "revised"
  },
  {
    "rank": 7,
    "conceptId": "concept.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v1",
    "previousConceptId": "concept.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v1",
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v2"
    ],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Revised candidate pending independent re-review; not independently passed.",
    "reviewResponseStatus": "revised"
  },
  {
    "rank": 8,
    "conceptId": "concept.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "previousConceptId": "concept.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1"
    ],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Exact independent PASS preserved; named clinical review pending.",
    "reviewResponseStatus": "pass-preserved"
  },
  {
    "rank": 9,
    "conceptId": "concept.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "previousConceptId": "concept.topic.biliary-injury-malignancy.future-remnant-drainage.v1",
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.future-remnant-drainage.v2"
    ],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Revised candidate pending independent re-review; not independently passed.",
    "reviewResponseStatus": "revised"
  },
  {
    "rank": 10,
    "conceptId": "concept.topic.biliary-injury-malignancy.distal-combined-sampling.v1",
    "previousConceptId": null,
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Parked after one attempted revision; no scored coverage claimed.",
    "reviewResponseStatus": "parked"
  },
  {
    "rank": 11,
    "conceptId": "concept.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v1",
    "previousConceptId": null,
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Parked after one attempted revision; no scored coverage claimed.",
    "reviewResponseStatus": "parked"
  },
  {
    "rank": 12,
    "conceptId": "concept.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "previousConceptId": "concept.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1"
    ],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Exact independent PASS preserved; named clinical review pending.",
    "reviewResponseStatus": "pass-preserved"
  },
  {
    "rank": 13,
    "conceptId": "concept.topic.biliary-injury-malignancy.arterial-injury-perfusion.v1",
    "previousConceptId": null,
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Parked after one attempted revision; no scored coverage claimed.",
    "reviewResponseStatus": "parked"
  },
  {
    "rank": 14,
    "conceptId": "concept.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v1",
    "previousConceptId": null,
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Parked after one attempted revision; no scored coverage claimed.",
    "reviewResponseStatus": "parked"
  },
  {
    "rank": 15,
    "conceptId": "concept.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "previousConceptId": "concept.topic.biliary-injury-malignancy.benign-continuity-stenting.v1",
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2"
    ],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Revised candidate pending independent re-review; not independently passed.",
    "reviewResponseStatus": "revised"
  },
  {
    "rank": 16,
    "conceptId": "concept.topic.biliary-injury-malignancy.palliative-distal-stent.v1",
    "previousConceptId": null,
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Parked after one attempted revision; no scored coverage claimed.",
    "reviewResponseStatus": "parked"
  },
  {
    "rank": 17,
    "conceptId": "concept.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "previousConceptId": "concept.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1"
    ],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Exact independent PASS preserved; named clinical review pending.",
    "reviewResponseStatus": "pass-preserved"
  },
  {
    "rank": 18,
    "conceptId": "concept.topic.biliary-injury-malignancy.type-i-cyst-excision.v1",
    "previousConceptId": "concept.topic.biliary-injury-malignancy.type-i-cyst-excision.v1",
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.type-i-cyst-excision.v2"
    ],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Revised candidate pending independent re-review; not independently passed.",
    "reviewResponseStatus": "revised"
  },
  {
    "rank": 19,
    "conceptId": "concept.topic.biliary-injury-malignancy.diffuse-biliary-peritonitis.v1",
    "previousConceptId": null,
    "existingInventoryRecordIds": [],
    "existingVariantIds": [],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Consequential primary-topic gap in the planning assignment.",
    "coverageAfter": "Parked after one attempted revision; no scored coverage claimed.",
    "reviewResponseStatus": "parked"
  },
  {
    "rank": null,
    "conceptId": "concept.bile-leak.hepatobiliary-contrast-mrcp",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.4c95e6229d175141",
      "inventory.87efcbf69c0ed3b3",
      "inventory.5fe51fbe2ff4f868",
      "inventory.e1dc228f52ae3bbc"
    ],
    "existingVariantIds": [
      "question.bile-leak.hepatobiliary-contrast-mrcp.v3",
      "question.bile-leak.hepatobiliary-contrast-mrcp.v1",
      "question.bile-leak.hepatobiliary-contrast-mrcp.v4",
      "question.bile-leak.hepatobiliary-contrast-mrcp.v2"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Existing exact source-bank identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  },
  {
    "rank": null,
    "conceptId": "concept.choledochal-cyst.type-iva-combined-duct-dilation",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.e68aea67c9a08de2",
      "inventory.f67864a9fd946206",
      "inventory.5f92b5b6600b885d",
      "inventory.9df3d834318a09d6"
    ],
    "existingVariantIds": [
      "question.choledochal-cyst.type-iva.2a.v1",
      "question.choledochal-cyst.type-iva.2b.v1",
      "question.choledochal-cyst.type-iva.2c.v1",
      "question.choledochal-cyst.type-iva.2d.v1"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Existing exact source-bank identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  },
  {
    "rank": null,
    "conceptId": "concept.distal-cholangiocarcinoma.operable-tissue-evaluation",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.532f7117dc95b02a",
      "inventory.94d038c4bfefef55"
    ],
    "existingVariantIds": [
      "question.distal-cholangiocarcinoma.workup-a.v1",
      "question.distal-cholangiocarcinoma.workup-b.v1"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Existing exact source-bank identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  },
  {
    "rank": null,
    "conceptId": "concept.distal-cholangiocarcinoma.resection-selection",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.5d4036e8aa3221ac",
      "inventory.306e2bcb207cf236",
      "inventory.8da6f7d6a149110d"
    ],
    "existingVariantIds": [
      "question.distal-cholangiocarcinoma.management-c.v1",
      "question.distal-cholangiocarcinoma.management-b.v1",
      "question.distal-cholangiocarcinoma.management-a.v1"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Existing exact source-bank identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  },
  {
    "rank": null,
    "conceptId": "concept.gallbladder-polyp.initial-management-category",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.6629a371de8ad80e",
      "inventory.5a62203634e72327",
      "inventory.e221144e777e9a41",
      "inventory.16559f31bdb1bf7f",
      "inventory.6946d69e1ddcb98b",
      "inventory.257e12d8f7d64120"
    ],
    "existingVariantIds": [
      "question.gallbladder-polyp.12mm-wall-thickening.v1",
      "question.gallbladder-polyp.16mm.v1",
      "question.gallbladder-polyp.4mm-thin-stalk.v1",
      "question.gallbladder-polyp.8mm-thick-stalk.v1",
      "question.gallbladder-polyp.select-surgical-profile.v1",
      "question.gallbladder-polyp.select-surveillance-profile.v1"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Existing exact source-bank identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  },
  {
    "rank": null,
    "conceptId": "concept.gs028g.incidental-gallbladder.t1a-depth",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.28aa36e6bf42b7f7",
      "inventory.4ded7f802bcde1d4",
      "inventory.4c7c59d082ab663d",
      "inventory.4a8ca03fdd38795f"
    ],
    "existingVariantIds": [
      "question.gs028g.incidental-gallbladder.t1a-depth.v3",
      "question.gs028g.incidental-gallbladder.t1a-depth.v4",
      "question.gs028g.incidental-gallbladder.t1a-depth.v2",
      "question.gs028g.incidental-gallbladder.t1a-depth.v1"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Existing exact source-bank identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  },
  {
    "rank": null,
    "conceptId": "concept.n2.bile-leak-duct-continuity-boundary",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.de0e9b9b78a3c1f2"
    ],
    "existingVariantIds": [
      "question.n2.bile-leak-duct-continuity-boundary.v1"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Registry-only or superseded identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  },
  {
    "rank": null,
    "conceptId": "concept.n2r2.bile-leak-nonrepresented-duct-mapping",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.7c6a21372d3d6a56"
    ],
    "existingVariantIds": [
      "question.n2.bile-leak-duct-continuity-boundary.v2"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Existing exact source-bank identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  },
  {
    "rank": null,
    "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.71aa6bbba1fc3610"
    ],
    "existingVariantIds": [
      "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Registry-only or superseded identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  },
  {
    "rank": null,
    "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
    "previousConceptId": null,
    "existingInventoryRecordIds": [
      "inventory.680cf2572fc17ed0",
      "inventory.4b8cf5326c26a50e",
      "inventory.b8679a61f2cfdc20"
    ],
    "existingVariantIds": [
      "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6",
      "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4",
      "question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5"
    ],
    "proposalQuestionVariantIds": [],
    "coverageBefore": "Existing exact source-bank identity.",
    "coverageAfter": "Original definition and history retained; successor meanings have no automatic history migration.",
    "reviewResponseStatus": "historical_identity_retained"
  }
]
```

```json
[
  {
    "conceptId": "concept.bile-leak.hepatobiliary-contrast-mrcp",
    "status": "live original",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.4c95e6229d175141",
      "inventory.87efcbf69c0ed3b3",
      "inventory.5fe51fbe2ff4f868",
      "inventory.e1dc228f52ae3bbc"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.bile-leak.minor-leak-ercp-stent",
    "status": "live original",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.3f15d225b677a625",
      "inventory.a14e0c155c07b00f",
      "inventory.4ebfdad274f79b1b",
      "inventory.1d88b1381ced424f"
    ],
    "currentProposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.communicating-leak-stent.v1"
    ],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.communicating-leak-stent.v1"
    ],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.choledochal-cyst.type-iva-combined-duct-dilation",
    "status": "live original",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.e68aea67c9a08de2",
      "inventory.f67864a9fd946206",
      "inventory.5f92b5b6600b885d",
      "inventory.9df3d834318a09d6"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.distal-cholangiocarcinoma.operable-tissue-evaluation",
    "status": "live original",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.532f7117dc95b02a",
      "inventory.94d038c4bfefef55"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.distal-cholangiocarcinoma.resection-selection",
    "status": "live original",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.5d4036e8aa3221ac",
      "inventory.306e2bcb207cf236",
      "inventory.8da6f7d6a149110d"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.gallbladder-polyp.initial-management-category",
    "status": "live original",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.6629a371de8ad80e",
      "inventory.5a62203634e72327",
      "inventory.e221144e777e9a41",
      "inventory.16559f31bdb1bf7f",
      "inventory.6946d69e1ddcb98b",
      "inventory.257e12d8f7d64120"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.gs028g.incidental-gallbladder.completely-resected-t1a",
    "status": "live original",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.0a5943063faf45a2",
      "inventory.da1b615d34979a13",
      "inventory.22699f4b4a856bb7",
      "inventory.8c42a2a9987cac65"
    ],
    "currentProposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.t1a-complete-resection.v2"
    ],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.t1a-complete-resection.v1"
    ],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.gs028g.incidental-gallbladder.t1a-depth",
    "status": "live original",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.28aa36e6bf42b7f7",
      "inventory.4ded7f802bcde1d4",
      "inventory.4c7c59d082ab663d",
      "inventory.4a8ca03fdd38795f"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.n1.gallbladder-muscle-invasion-referral",
    "status": "draft parked",
    "registryOnly": true,
    "activeInPlanningRelease": false,
    "inventoryRecordIds": [
      "inventory.dbb3f35cdf84e6d8",
      "inventory.1c6c49bd8d00de6e"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.revised-muscular-invasion.v1"
    ],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.n2.bile-leak-duct-continuity-boundary",
    "status": "draft parked",
    "registryOnly": true,
    "activeInPlanningRelease": false,
    "inventoryRecordIds": [
      "inventory.de0e9b9b78a3c1f2"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.main-duct-discontinuity.v1"
    ],
    "successorMeaningIds": [
      "concept.topic.biliary-injury-malignancy.main-duct-discontinuity.v2"
    ]
  },
  {
    "conceptId": "concept.n2r2.bile-leak-nonrepresented-duct-mapping",
    "status": "live accepted",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.7c6a21372d3d6a56"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": null,
    "previousProposalQuestionVariantIds": [],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v1",
    "status": "draft parked",
    "registryOnly": true,
    "activeInPlanningRelease": false,
    "inventoryRecordIds": [
      "inventory.71aa6bbba1fc3610"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": "Shared node ID has multiple historical meanings; node equality never authorizes concept-history transfer.",
    "previousProposalQuestionVariantIds": [],
    "successorMeaningIds": []
  },
  {
    "conceptId": "concept.postlaparoscopy.shoulder-pain-biliary-localization.v2",
    "status": "live accepted",
    "registryOnly": false,
    "activeInPlanningRelease": true,
    "inventoryRecordIds": [
      "inventory.680cf2572fc17ed0",
      "inventory.4b8cf5326c26a50e",
      "inventory.b8679a61f2cfdc20"
    ],
    "currentProposalQuestionVariantIds": [],
    "historyDisposition": "Retain all original IDs and histories. No save or FSRS migration.",
    "meaningNote": "Shared node ID has multiple historical meanings; node equality never authorizes concept-history transfer.",
    "previousProposalQuestionVariantIds": [],
    "successorMeaningIds": []
  }
]
```

## Complete original source-bank audit

These are the original thirty-nine program records, retaining their exact before hashes and initial verdicts. Destination status now identifies revised pending or parked replacements. No retirement or consolidation is installed by this response. All old full before questions/cases/nodes remain under audit in the JSON packet.

| Inventory | Exact source variant | Original verdict | Current destination(s) | Initial reasons |
|---|---|---|---|---|
| inventory.e68aea67c9a08de2 | question.choledochal-cyst.type-iva.2a.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-31; this is a historical version freeze, not a new author PASS. Classification or reverse-classification is one-step recall and four variants duplicate one anatomical objective. No accepted basic/onboarding exception is inferred. Visible context omits consistent numeric age/sex and rationales are generic. Record the limitation; do not silently alter approved wording or transfer its FSRS history to the new type-I management meaning. |
| inventory.f67864a9fd946206 | question.choledochal-cyst.type-iva.2b.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-31; this is a historical version freeze, not a new author PASS. Classification or reverse-classification is one-step recall and four variants duplicate one anatomical objective. No accepted basic/onboarding exception is inferred. Visible context omits consistent numeric age/sex and rationales are generic. Record the limitation; do not silently alter approved wording or transfer its FSRS history to the new type-I management meaning. |
| inventory.5f92b5b6600b885d | question.choledochal-cyst.type-iva.2c.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-31; this is a historical version freeze, not a new author PASS. Classification or reverse-classification is one-step recall and four variants duplicate one anatomical objective. No accepted basic/onboarding exception is inferred. Visible context omits consistent numeric age/sex and rationales are generic. Record the limitation; do not silently alter approved wording or transfer its FSRS history to the new type-I management meaning. |
| inventory.9df3d834318a09d6 | question.choledochal-cyst.type-iva.2d.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-31; this is a historical version freeze, not a new author PASS. Classification or reverse-classification is one-step recall and four variants duplicate one anatomical objective. No accepted basic/onboarding exception is inferred. Visible context omits consistent numeric age/sex and rationales are generic. Record the limitation; do not silently alter approved wording or transfer its FSRS history to the new type-I management meaning. |
| inventory.5d4036e8aa3221ac | question.distal-cholangiocarcinoma.management-c.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21 and its constrained completed-imaging profile. The management task is predominantly site-to-operation matching; reverse location and repeat-label distractors limit resident difficulty. Workup versions compare tissue acquisition against repeat imaging or a marker and are not fully parallel. The combined live case scores tissue evaluation then resection; first feedback must be considered when judging the later node. The unassembled workup-b stays parked. New diagnostic-gap questions do not inherit this clinical approval. |
| inventory.306e2bcb207cf236 | question.distal-cholangiocarcinoma.management-b.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21 and its constrained completed-imaging profile. The management task is predominantly site-to-operation matching; reverse location and repeat-label distractors limit resident difficulty. Workup versions compare tissue acquisition against repeat imaging or a marker and are not fully parallel. The combined live case scores tissue evaluation then resection; first feedback must be considered when judging the later node. The unassembled workup-b stays parked. New diagnostic-gap questions do not inherit this clinical approval. |
| inventory.6629a371de8ad80e | question.gallbladder-polyp.12mm-wall-thickening.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21, including the single-decision scope, concordant profiles and exclusions. Completed report profiles test management categories; reverse-profile variants and generic distractor rationales limit difficulty. Exact follow-up schedules and hybrid threshold rules remain excluded. Current research does not reopen disputed size/morphology boundaries. The original source dates and framework disagreement remain historical metadata; no race or ethnicity selection is introduced. |
| inventory.5a62203634e72327 | question.gallbladder-polyp.16mm.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21, including the single-decision scope, concordant profiles and exclusions. Completed report profiles test management categories; reverse-profile variants and generic distractor rationales limit difficulty. Exact follow-up schedules and hybrid threshold rules remain excluded. Current research does not reopen disputed size/morphology boundaries. The original source dates and framework disagreement remain historical metadata; no race or ethnicity selection is introduced. |
| inventory.e221144e777e9a41 | question.gallbladder-polyp.4mm-thin-stalk.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21, including the single-decision scope, concordant profiles and exclusions. Completed report profiles test management categories; reverse-profile variants and generic distractor rationales limit difficulty. Exact follow-up schedules and hybrid threshold rules remain excluded. Current research does not reopen disputed size/morphology boundaries. The original source dates and framework disagreement remain historical metadata; no race or ethnicity selection is introduced. |
| inventory.16559f31bdb1bf7f | question.gallbladder-polyp.8mm-thick-stalk.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21, including the single-decision scope, concordant profiles and exclusions. Completed report profiles test management categories; reverse-profile variants and generic distractor rationales limit difficulty. Exact follow-up schedules and hybrid threshold rules remain excluded. Current research does not reopen disputed size/morphology boundaries. The original source dates and framework disagreement remain historical metadata; no race or ethnicity selection is introduced. |
| inventory.6946d69e1ddcb98b | question.gallbladder-polyp.select-surgical-profile.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21, including the single-decision scope, concordant profiles and exclusions. Completed report profiles test management categories; reverse-profile variants and generic distractor rationales limit difficulty. Exact follow-up schedules and hybrid threshold rules remain excluded. Current research does not reopen disputed size/morphology boundaries. The original source dates and framework disagreement remain historical metadata; no race or ethnicity selection is introduced. |
| inventory.257e12d8f7d64120 | question.gallbladder-polyp.select-surveillance-profile.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21, including the single-decision scope, concordant profiles and exclusions. Completed report profiles test management categories; reverse-profile variants and generic distractor rationales limit difficulty. Exact follow-up schedules and hybrid threshold rules remain excluded. Current research does not reopen disputed size/morphology boundaries. The original source dates and framework disagreement remain historical metadata; no race or ethnicity selection is introduced. |
| inventory.680cf2572fc17ed0 | question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6 | Keep | Exact source retained | Preserve exact B2B01 r6 independent PASS and manager acceptance; earlier r5 was REVISE because stenting versus sphincterotomy ranking was not resolved. The r6 anticoagulation discriminator creates a consequential endoscopic choice; do not treat preceding historical shoulder-pain meanings or r3-r5 as the same approved construct. Residual ward wording conflicts with the newer clinic-chart-review direction. Keep the exact record frozen; any new clinic wording needs an explicitly reviewed new visible version, using existing clinic settings, never a new inpatient setting. |
| inventory.28aa36e6bf42b7f7 | question.gs028g.incidental-gallbladder.t1a-depth.v3 | Retire-and-replace | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 (revised); question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2 (parked) | The task supplies the involved layer and asks for its T label; four variants repeat a one-step classification without a practical residual decision. In paired cases, staging feedback rehearses the next management rule. Replace the scored label objective with postoperative surgical decisions and a decision-changing pathology addendum; keep the old anatomy concept and history unchanged. |
| inventory.4ded7f802bcde1d4 | question.gs028g.incidental-gallbladder.t1a-depth.v4 | Retire-and-replace | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 (revised); question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2 (parked) | The task supplies the involved layer and asks for its T label; four variants repeat a one-step classification without a practical residual decision. In paired cases, staging feedback rehearses the next management rule. Replace the scored label objective with postoperative surgical decisions and a decision-changing pathology addendum; keep the old anatomy concept and history unchanged. |
| inventory.0a5943063faf45a2 | question.gs028g.incidental-gallbladder.completely-resected-t1a.v4 | Retire-and-replace | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 (revised) | This sibling repeats the same completely removed T1a decision; some tasks explicitly ask to correct radical surgery, thereby selecting the key. Consolidate future supply around the canonical raw-depth/margin surgical question and the changed-depth follow-up. No source definition or saved encounter is deleted. |
| inventory.da1b615d34979a13 | question.gs028g.incidental-gallbladder.completely-resected-t1a.v3 | Retire-and-replace | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 (revised) | This sibling repeats the same completely removed T1a decision; some tasks explicitly ask to correct radical surgery, thereby selecting the key. Consolidate future supply around the canonical raw-depth/margin surgical question and the changed-depth follow-up. No source definition or saved encounter is deleted. |
| inventory.22699f4b4a856bb7 | question.gs028g.incidental-gallbladder.completely-resected-t1a.v2 | Retire-and-replace | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 (revised) | This sibling repeats the same completely removed T1a decision; some tasks explicitly ask to correct radical surgery, thereby selecting the key. Consolidate future supply around the canonical raw-depth/margin surgical question and the changed-depth follow-up. No source definition or saved encounter is deleted. |
| inventory.4c7c59d082ab663d | question.gs028g.incidental-gallbladder.t1a-depth.v2 | Retire-and-replace | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 (revised); question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2 (parked) | The task supplies the involved layer and asks for its T label; four variants repeat a one-step classification without a practical residual decision. In paired cases, staging feedback rehearses the next management rule. Replace the scored label objective with postoperative surgical decisions and a decision-changing pathology addendum; keep the old anatomy concept and history unchanged. |
| inventory.8c42a2a9987cac65 | question.gs028g.incidental-gallbladder.completely-resected-t1a.v1 | Rewrite | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 (revised) | The original task names completely resected T1a and restates the management premise, while the preceding staging node supplies the same shallow-depth rule. Replace the labels with represented tissue planes and margin findings, then ask a single postoperative surgical plan. The underlying scored clinical meaning is preserved under the same concept ID; the new question/node/case version remains needs_clinician_review and the old exact definition/history is retained. |
| inventory.4a8ca03fdd38795f | question.gs028g.incidental-gallbladder.t1a-depth.v1 | Retire-and-replace | question.topic.biliary-injury-malignancy.t1a-complete-resection.v2 (revised); question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2 (parked) | The task supplies the involved layer and asks for its T label; four variants repeat a one-step classification without a practical residual decision. In paired cases, staging feedback rehearses the next management rule. Replace the scored label objective with postoperative surgical decisions and a decision-changing pathology addendum; keep the old anatomy concept and history unchanged. |
| inventory.8da6f7d6a149110d | question.distal-cholangiocarcinoma.management-a.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21 and its constrained completed-imaging profile. The management task is predominantly site-to-operation matching; reverse location and repeat-label distractors limit resident difficulty. Workup versions compare tissue acquisition against repeat imaging or a marker and are not fully parallel. The combined live case scores tissue evaluation then resection; first feedback must be considered when judging the later node. The unassembled workup-b stays parked. New diagnostic-gap questions do not inherit this clinical approval. |
| inventory.532f7117dc95b02a | question.distal-cholangiocarcinoma.workup-a.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21 and its constrained completed-imaging profile. The management task is predominantly site-to-operation matching; reverse location and repeat-label distractors limit resident difficulty. Workup versions compare tissue acquisition against repeat imaging or a marker and are not fully parallel. The combined live case scores tissue evaluation then resection; first feedback must be considered when judging the later node. The unassembled workup-b stays parked. New diagnostic-gap questions do not inherit this clinical approval. |
| inventory.7c6a21372d3d6a56 | question.n2.bile-leak-duct-continuity-boundary.v2 | Keep | Exact source retained | Preserve exact N2 v2 independent PASS from review2 and review3 and the manager acceptance. The constructed exhibit separates an unopacified duct from proof of disconnection; do not overstate what the negative retrograde injection establishes. Keep its complete visible context and existing diagram exact. Contrast feasibility and image interpretation remain clinician review matters, not automatic approval. The program reports two retained node serializations. Both were recovered and audited: the sole byte difference is property order within the identical image exhibit; deep comparison of the complete cases is equal. Both hashes and origins are retained, with no second visible question counted. |
| inventory.4c95e6229d175141 | question.bile-leak.hepatobiliary-contrast-mrcp.v3 | Retire-and-replace | question.n2.bile-leak-duct-continuity-boundary.v2 (legacy-kept) | Four surface profiles repeat the same post-CT MRCP rule; the task explicitly names leak localization and duct continuity, making the dedicated-anatomy option conspicuous. The existing independently passed N2 v2 already tests the more consequential unresolved-branch mapping decision with an inspected exhibit. Preserve it as the replacement coverage anchor; retain the old stable workup concept and history. |
| inventory.3f15d225b677a625 | question.bile-leak.minor-leak-ercp-stent.v3 | Retire-and-replace | question.topic.biliary-injury-malignancy.communicating-leak-stent.v1 (pass-preserved); question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2 (revised) | This sibling duplicates the canonical minor-leak management objective with cosmetic presentation changes. The original stem supplies minor-leak continuity and prior result feedback rehearses the key. Replace future supply with the supported anatomy-to-treatment decision and a new post-treatment collection response. |
| inventory.87efcbf69c0ed3b3 | question.bile-leak.hepatobiliary-contrast-mrcp.v1 | Retire-and-replace | question.n2.bile-leak-duct-continuity-boundary.v2 (legacy-kept) | Four surface profiles repeat the same post-CT MRCP rule; the task explicitly names leak localization and duct continuity, making the dedicated-anatomy option conspicuous. The existing independently passed N2 v2 already tests the more consequential unresolved-branch mapping decision with an inspected exhibit. Preserve it as the replacement coverage anchor; retain the old stable workup concept and history. |
| inventory.a14e0c155c07b00f | question.bile-leak.minor-leak-ercp-stent.v1 | Rewrite | question.topic.biliary-injury-malignancy.communicating-leak-stent.v1 (pass-preserved) | The original stem gives both minor leak and preserved continuity, supplying the main inference before procedure selection. Repeated profiles change age or symptoms without changing the decision; some options are generic referral labels and the preceding MRCP feedback rehearses the rule. The underlying scored clinical meaning is preserved under the same concept ID; the new question/node/case version remains needs_clinician_review and the old exact definition/history is retained. |
| inventory.5fe51fbe2ff4f868 | question.bile-leak.hepatobiliary-contrast-mrcp.v4 | Retire-and-replace | question.n2.bile-leak-duct-continuity-boundary.v2 (legacy-kept) | Four surface profiles repeat the same post-CT MRCP rule; the task explicitly names leak localization and duct continuity, making the dedicated-anatomy option conspicuous. The existing independently passed N2 v2 already tests the more consequential unresolved-branch mapping decision with an inspected exhibit. Preserve it as the replacement coverage anchor; retain the old stable workup concept and history. |
| inventory.4ebfdad274f79b1b | question.bile-leak.minor-leak-ercp-stent.v4 | Retire-and-replace | question.topic.biliary-injury-malignancy.communicating-leak-stent.v1 (pass-preserved); question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2 (revised) | This sibling duplicates the canonical minor-leak management objective with cosmetic presentation changes. The original stem supplies minor-leak continuity and prior result feedback rehearses the key. Replace future supply with the supported anatomy-to-treatment decision and a new post-treatment collection response. |
| inventory.e1dc228f52ae3bbc | question.bile-leak.hepatobiliary-contrast-mrcp.v2 | Retire-and-replace | question.n2.bile-leak-duct-continuity-boundary.v2 (legacy-kept) | Four surface profiles repeat the same post-CT MRCP rule; the task explicitly names leak localization and duct continuity, making the dedicated-anatomy option conspicuous. The existing independently passed N2 v2 already tests the more consequential unresolved-branch mapping decision with an inspected exhibit. Preserve it as the replacement coverage anchor; retain the old stable workup concept and history. |
| inventory.1d88b1381ced424f | question.bile-leak.minor-leak-ercp-stent.v2 | Retire-and-replace | question.topic.biliary-injury-malignancy.communicating-leak-stent.v1 (pass-preserved); question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2 (revised) | This sibling duplicates the canonical minor-leak management objective with cosmetic presentation changes. The original stem supplies minor-leak continuity and prior result feedback rehearses the key. Replace future supply with the supported anatomy-to-treatment decision and a new post-treatment collection response. |
| inventory.94d038c4bfefef55 | question.distal-cholangiocarcinoma.workup-b.v1 | Keep | Exact source retained | Preserve the exact Melissa Rowland approval dated 2026-08-21 and its constrained completed-imaging profile. The management task is predominantly site-to-operation matching; reverse location and repeat-label distractors limit resident difficulty. Workup versions compare tissue acquisition against repeat imaging or a marker and are not fully parallel. The combined live case scores tissue evaluation then resection; first feedback must be considered when judging the later node. The unassembled workup-b stays parked. New diagnostic-gap questions do not inherit this clinical approval. |
| inventory.71aa6bbba1fc3610 | question.postlaparoscopy.benign-referred-shoulder-pain.v2.r3 | Retire-and-replace | question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6 (legacy-kept) | This is a superseded r3/r4/r5 retained draft, not the accepted exact r6 version. r3 changes meaning to imaging; r4/r5 use a less-resolved intervention ranking. Preserve the historical phrenic, imaging and management concept versions separately. Use the already accepted r6 as the exact coverage anchor; do not promote this draft or copy r6 approval to an altered clinic presentation. |
| inventory.4b8cf5326c26a50e | question.postlaparoscopy.benign-referred-shoulder-pain.v2.r4 | Retire-and-replace | question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6 (legacy-kept) | This is a superseded r3/r4/r5 retained draft, not the accepted exact r6 version. r3 changes meaning to imaging; r4/r5 use a less-resolved intervention ranking. Preserve the historical phrenic, imaging and management concept versions separately. Use the already accepted r6 as the exact coverage anchor; do not promote this draft or copy r6 approval to an altered clinic presentation. |
| inventory.b8679a61f2cfdc20 | question.postlaparoscopy.benign-referred-shoulder-pain.v2.r5 | Retire-and-replace | question.postlaparoscopy.benign-referred-shoulder-pain.v2.r6 (legacy-kept) | This is a superseded r3/r4/r5 retained draft, not the accepted exact r6 version. r3 changes meaning to imaging; r4/r5 use a less-resolved intervention ranking. Preserve the historical phrenic, imaging and management concept versions separately. Use the already accepted r6 as the exact coverage anchor; do not promote this draft or copy r6 approval to an altered clinic presentation. |
| inventory.dbb3f35cdf84e6d8 | question.n1.incidental-t1b.v1 | Retire-and-replace | question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2 (parked) | The early retained v1 is largely recognition-to-referral with a weak port-site-excision distractor and no decision-changing follow-up. Replace its future supply with the supported muscular-invasion reassessment version; retain the concept ID, all old records and the explicit uncertainty about a mandatory completion operation. |
| inventory.1c6c49bd8d00de6e | question.n1.incidental-t1b.v2 | Rewrite | question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2 (parked) | The retained v2 improves depth reasoning but remains a one-node referral-target choice with limited consequential follow-up. Use the same muscular-invasion referral meaning in a clinic sequence where new block evidence changes an earlier appropriate decision. Do not key a disputed exact completion operation. The underlying scored clinical meaning is preserved under the same concept ID; the new question/node/case version remains needs_clinician_review and the old exact definition/history is retained. |
| inventory.de0e9b9b78a3c1f2 | question.n2.bile-leak-duct-continuity-boundary.v1 | Rewrite | question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2 (revised) | The original task announces the preserved-continuity prerequisite and asks which already-described finding invalidates it. Ask for a care-pathway decision after raw duct mapping instead, then add a distinct source-control deterioration node. The underlying scored clinical meaning is preserved under the same concept ID; the new question/node/case version remains needs_clinician_review and the old exact definition/history is retained. |

```json
[
  {
    "id": "consolidation-proposal.biliary-injury-malignancy.communicating-leak",
    "sourceCaseIds": [
      "case.post-cholecystectomy-bile-leak.delayed-recovery",
      "case.post-cholecystectomy-bile-leak.drain-output",
      "case.post-cholecystectomy-bile-leak.outside-followup",
      "case.post-cholecystectomy-bile-leak.painful-recovery"
    ],
    "targetCaseId": null,
    "targetQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.communicating-leak-stent.v1",
      "question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2"
    ],
    "additionalCoverageAnchor": "question.n2.bile-leak-duct-continuity-boundary.v2",
    "reason": "Replace repeated paired workup/treatment templates with one response-dependent case; preserve the separately passed detailed-mapping case.",
    "managerAcceptance": null,
    "reviewResponseDisposition": "deferred_until_complete_replacement_review",
    "targetCaseIds": [
      "case.topic.biliary-injury-malignancy.communicating-leak.v1",
      "case.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.v2"
    ],
    "previousTargetCaseId": "case.topic.biliary-injury-malignancy.communicating-leak.v1"
  },
  {
    "id": "consolidation-proposal.biliary-injury-malignancy.shallow-depth",
    "sourceCaseIds": [
      "case.gs028g.incidental-gallbladder.c1-not-in-situ",
      "case.gs028g.incidental-gallbladder.c1-wall-layer-review",
      "case.gs028g.incidental-gallbladder.c2-muscle-not-involved",
      "case.gs028g.incidental-gallbladder.c2-patient-choice-review",
      "case.gs028g.incidental-gallbladder.paired-deeper-sections",
      "case.gs028g.incidental-gallbladder.paired-lamina-only"
    ],
    "targetCaseId": null,
    "targetQuestionVariantIds": [
      "question.topic.biliary-injury-malignancy.t1a-complete-resection.v2",
      "question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2"
    ],
    "reason": "Remove repeated report-label scoring and duplicate T1a decisions; retain every old concept definition and history without migration.",
    "managerAcceptance": null,
    "reviewResponseDisposition": "deferred_until_complete_replacement_review",
    "targetCaseIds": [
      "case.topic.biliary-injury-malignancy.r2.t1a-complete-resection.v2"
    ],
    "previousTargetCaseId": "case.topic.biliary-injury-malignancy.depth-review.v1"
  }
]
```

## Evidence, access rights and atomic claims

Nine bibliographic sources and forty-two original atomic claims are in the source ledger. Its reviewRound.sourceSnapshot retains the eight prior sources and thirty-four prior claims. Eight new claims support this response. Exact original claim text, original access dates and existing clinical review states are retained. A current 2026 ESGE management guideline is distinct from the earlier 2025 diagnostic guideline; repeated editions are not independent corroboration.

- source.question-topic.biliary-injury-malignancy.wses-2021: de’Angelis N, Catena F, Memeo R, et al. 2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy. World J Emerg Surg. 2021;16:30. doi:10.1186/s13017-021-00369-w. <a href="https://link.springer.com/article/10.1186/s13017-021-00369-w" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">World Journal of Emergency Surgery / WSES</a>. Accessed 2026-11-11. CC BY 4.0. Multidisciplinary guideline; several management recommendations have low-quality evidence. Older repair-timing recommendations are not treated as universal current rules. Article-specific CC BY 4.0 verified in Rights and permissions. Attribution through full citation and DOI; all teaching statements independently synthesized. No adaptation of protected figures.
- source.question-topic.biliary-injury-malignancy.esge-stent-2018: Dumonceau JM, Tringali A, Papanikolaou IS, et al. Endoscopic biliary stenting: indications, choice of stents, and results: ESGE Clinical Guideline - Updated October 2017. Endoscopy. 2018;50:910-930. doi:10.1055/a-0659-9864. <a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2018_a_0659_9864.pdf" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Endoscopy / ESGE</a>. Accessed 2026-11-11. Copyright Thieme; targeted society-guidance factual verification only. Directly supports nontransection leak stenting, benign stricture treatment and palliative extrahepatic stent selection; older guideline cross-checked with newer BSG guidance. Official society-hosted guideline inspected only for selected recommendations. No reproduction, derivative algorithm or general reuse license asserted.
- source.question-topic.biliary-injury-malignancy.bsg-2024: Rushbrook SM, Kendall TJ, Zen Y, et al. British Society of Gastroenterology guidelines for the diagnosis and management of cholangiocarcinoma. Gut. 2024;73:16-46. doi:10.1136/gutjnl-2023-330029. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10715509/" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Gut / British Society of Gastroenterology</a>. Accessed 2026-11-11. CC BY-NC 4.0; society guidance used for targeted facts. Multispecialty guideline; used for site-specific sampling, drainage and multidisciplinary planning, not universal transplant eligibility or a mandated treatment protocol. Article license checked explicitly; PMC availability is not the permission basis. No commercial derivative permission assumed. Underlying facts independently synthesized and attributed; no source prose/figures reused. Publisher page returned 403; lawful public PMC copy inspected without bypass.
- source.question-topic.biliary-injury-malignancy.esge-stricture-2025: Facciorusso A, Crinò SF, Gkolfakis P, et al. Diagnostic work-up of bile duct strictures: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. 2025;57:166-185. doi:10.1055/a-2481-7048. Published online December 17, 2024. <a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2024_a-2481-7048.pdf" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Endoscopy / ESGE</a>. Accessed 2026-11-11. Copyright ESGE 2024; targeted factual verification only. Current anatomy-specific diagnostic guidance; distal jaundiced stricture without pancreatic mass differs from potentially curable perihilar disease. Official society-hosted guideline used for selected recommendations 1-4. No copied prose, figures, tables or algorithms and no blanket reuse permission asserted.
- source.question-topic.biliary-injury-malignancy.nci-gallbladder-2025: PDQ Adult Treatment Editorial Board. Gallbladder Cancer Treatment (PDQ), Health Professional Version. Bethesda, MD: National Cancer Institute. Updated February 12, 2025. Accessed November 11, 2026. <a href="https://www.cancer.gov/types/gallbladder/hp/gallbladder-treatment-pdq" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">National Cancer Institute</a>. Accessed 2026-11-11. Government text with PDQ attribution and third-party exclusions. Peer-reviewed government evidence summary; not a formal NCI policy guideline. Explicitly preserves T1b re-resection uncertainty. Use underlying facts with attribution. AJCC tables are marked third-party permission material and are excluded from reuse; no tables or figures copied. Teaching text is original and is not branded as an NCI PDQ summary.
- source.question-topic.biliary-injury-malignancy.ahpba-gallbladder-2015: Aloia TA, Járufe N, Javle M, Maithel SK, Roa JC, Adsay V, Coimbra FJF, Jarnagin WR. Gallbladder Cancer: expert consensus statement. HPB (Oxford). 2015;17:681-690. doi:10.1111/hpb.12444. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC4527853/" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">HPB / AHPBA-sponsored consensus conference</a>. Accessed 2026-11-11. Copyright IHPBA 2015; targeted guideline factual verification only. Society-sponsored consensus; older and largely observational. Cross-check with NCI; disputed T1b extent is withheld rather than converted to a universal rule. No open reuse license inferred from PMC. Targeted society-consensus factual checks only. No protected expression or tables retained.
- source.question-topic.biliary-injury-malignancy.cysts-2023: Ghotbi J, Yaqub S, Søreide K. Management of extrahepatic bile duct cysts. Br J Surg. 2023;110:1252-1255. doi:10.1093/bjs/znad087. <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC10480039/" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">British Journal of Surgery</a>. Accessed 2026-11-11. CC BY-NC 4.0; no commercial derivative permission assumed. Specialist narrative review for anatomy-specific cyst management; a single adequate publication for proposed cyst decisions, not equivalent to a new guideline. Article-specific license explicitly verified. Only original factual synthesis and bibliographic attribution; no copied/adapted figure, prose or algorithm. Publisher route inaccessible; public licensed PMC copy inspected. Commercial adaptation permission is not claimed.
- source.question-topic.biliary-injury-malignancy.sages-ahpba-2025: Calabrese EC, Slater BJ, Awad Z, et al. SAGES-AHPBA 2025 Guideline for the Surgical Management of Bile Duct Injury Following Cholecystectomy. SAGES. 2025. Official guideline webpage. <a href="https://www.sages.org/publications/guidelines/guideline-for-the-management-of-bdi-following-cholecystectomy/" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">SAGES / AHPBA</a>. Accessed 2026-11-11. Society guidance; rights/terms review incomplete. Newest retrieved repair guidance; conditional recommendations and very-low-certainty main text. Abstract uses low certainty for timing, a reporting inconsistency retained as a limitation. Guideline inspected for conflict detection only. Legal page returned 403; unrestricted AI/reuse rights not inferred. No new scored timing or reconstruction-superiority rule is derived from this source.
- source.question-topic.biliary-injury-malignancy.esge-stricture-management-2026: Lemmers A, Tringali A, Teles de Campos S, et al. Biliary stricture management: European Society of Gastrointestinal Endoscopy (ESGE) Guideline. Endoscopy. Published online 2026. doi:10.1055/a-2921-6492. <a href="https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2921-6492.pdf" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer">Endoscopy / European Society of Gastrointestinal Endoscopy</a>. Accessed 2026-11-11. Copyright ESGE 2026; selected society-guideline factual verification only. Current professional-society therapeutic guideline updating the 2018 stenting guidance; postcholecystectomy multiple-plastic-stent recommendation is weak, moderate-quality evidence. Location and adherence qualify covered-metal use. Repeated ESGE editions are not independent corroborating organizations. Read selected recommendations and supporting postcholecystectomy section on the official society host. No prose, graphical abstract, table, algorithm, source file or appendix is copied. No open adaptation or AI-training license is inferred.

| Atomic claim | Independently written statement | Sources | Certainty/limitation |
|---|---|---|---|
| claim.question-topic.biliary-injury-malignancy.ct-collections-vessels | Multiphasic contrast CT can evaluate postoperative collections and associated hepatic vascular injury. | source.question-topic.biliary-injury-malignancy.wses-2021 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.mrcp-map | Hepatobiliary-contrast MR cholangiography can localize biliary leakage and assess duct continuity after initial collection assessment. | source.question-topic.biliary-injury-malignancy.wses-2021 | moderate; Single adequate guideline; contrast excretion and peripheral-duct visualization can be limited. This does not require MRCP before every therapeutic ERCP. |
| claim.question-topic.biliary-injury-malignancy.hida-limits | Hepatobiliary scintigraphy can detect active leakage but offers less anatomical detail for duct mapping than MR cholangiography. | source.question-topic.biliary-injury-malignancy.wses-2021 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.ct-limits | CT collection morphology cannot by itself establish the precise ductal source or active state of a bile leak. | source.question-topic.biliary-injury-malignancy.wses-2021 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.nonrepresented-duct | A negative retrograde duct injection does not assess an aberrant or disconnected duct that it fails to opacify. | source.question-topic.biliary-injury-malignancy.wses-2021 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.minor-leak-stent | Persistent communicating postoperative bile leakage can be treated with endoscopic transpapillary plastic stenting after collection control. | source.question-topic.biliary-injury-malignancy.wses-2021; source.question-topic.biliary-injury-malignancy.esge-stent-2018 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.transection-boundary | Complete common hepatic or common bile duct transection is outside the routine transpapillary plastic-stent leak pathway. | source.question-topic.biliary-injury-malignancy.wses-2021; source.question-topic.biliary-injury-malignancy.esge-stent-2018 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.hpb-referral | Complex duct injuries warrant specialist HPB management when local reconstructive expertise is lacking. | source.question-topic.biliary-injury-malignancy.wses-2021 | moderate; Referral is supported independently of a universal reconstruction date; current repair-timing disagreement is withheld. |
| claim.question-topic.biliary-injury-malignancy.peritonitis-source-control | Diffuse biliary peritonitis after major duct injury requires urgent abdominal lavage and drainage for source control. | source.question-topic.biliary-injury-malignancy.wses-2021 | moderate; Single adequate guideline; resuscitation and antimicrobials are concurrent hospital care, not competing answers. |
| claim.question-topic.biliary-injury-malignancy.late-stricture | Late major postcholecystectomy duct injury with a clinically significant stricture may require specialist Roux-en-Y hepaticojejunostomy. | source.question-topic.biliary-injury-malignancy.wses-2021 | low; Single adequate guideline; not every benign narrowing requires surgery. Proposed surgery follows failure to restore drainage endoscopically. |
| claim.question-topic.biliary-injury-malignancy.benign-stricture-endoscopy | Benign duct strictures with endoscopically accessible continuity may be treated using temporary multiple plastic stents or a fully covered removable metal stent. | source.question-topic.biliary-injury-malignancy.esge-stent-2018 | moderate; Targeted older society guidance; do not infer all complete occlusions are endoscopically traversable. |
| claim.question-topic.biliary-injury-malignancy.rha-perfusion | An isolated right hepatic artery interruption may be tolerated when portal perfusion is maintained; its presence does not automatically establish liver necrosis or require immediate arterial reconstruction. | source.question-topic.biliary-injury-malignancy.wses-2021 | low; Observational evidence and expert practice; specialist surveillance and individual anatomy govern management. |
| claim.question-topic.biliary-injury-malignancy.gb-t1a | A fully assessed, completely removed margin-negative gallbladder carcinoma limited to the lamina propria generally does not require completion radical resection. | source.question-topic.biliary-injury-malignancy.nci-gallbladder-2025; source.question-topic.biliary-injury-malignancy.ahpba-gallbladder-2015 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.gb-muscle | Gallbladder muscular invasion is outside the lamina-propria-limited T1a postoperative pathway and warrants HPB oncologic reassessment. | source.question-topic.biliary-injury-malignancy.nci-gallbladder-2025; source.question-topic.biliary-injury-malignancy.ahpba-gallbladder-2015 | moderate; Sources differ on strength of evidence for automatic T1b re-resection; exact additional operation is withheld. |
| claim.question-topic.biliary-injury-malignancy.gb-t2-completion | For a fit patient with localized incidental gallbladder carcinoma extending into perimuscular tissue, completion liver-bed resection and regional portal lymphadenectomy are supported specialist options. | source.question-topic.biliary-injury-malignancy.nci-gallbladder-2025; source.question-topic.biliary-injury-malignancy.ahpba-gallbladder-2015 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.gb-duct-margin | Extrahepatic bile-duct resection during gallbladder cancer completion surgery is reserved for margin clearance or direct involvement rather than added routinely. | source.question-topic.biliary-injury-malignancy.ahpba-gallbladder-2015 | moderate; One adequate society consensus for the precise duct-margin boundary; 2015 guidance requires current HPB review. |
| claim.question-topic.biliary-injury-malignancy.cyst-i-excision | A type I bile duct cyst is generally managed by affected extrahepatic duct excision and Roux-en-Y hepaticojejunostomy rather than a cyst-enteric drainage operation. | source.question-topic.biliary-injury-malignancy.cysts-2023 | moderate; Single adequate narrative review; no exact cancer risk or operative deadline is taught. |
| claim.question-topic.biliary-injury-malignancy.cyst-iii-endoscopy | A symptomatic choledochocele causing biliary obstruction or recurrent pancreatitis can be treated endoscopically by sphincterotomy. | source.question-topic.biliary-injury-malignancy.cysts-2023 | moderate; Single adequate narrative review; does not mandate intervention for an asymptomatic incidental cyst or a solid neoplasm. |
| claim.question-topic.biliary-injury-malignancy.cyst-followup | Residual biliary tissue can develop late complications or malignancy after cyst excision, so excision does not establish absence of a future surveillance need. | source.question-topic.biliary-injury-malignancy.cysts-2023 | low; No exact surveillance interval is keyed. |
| claim.question-topic.biliary-injury-malignancy.cca-site-sampling | For jaundiced distal extrahepatic strictures without a pancreatic mass, combined EUS-guided and ERCP-based tissue acquisition is supported. | source.question-topic.biliary-injury-malignancy.esge-stricture-2025; source.question-topic.biliary-injury-malignancy.bsg-2024 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.cca-negative-sampling | Negative or nondiagnostic biliary brushing does not reliably exclude malignancy in a persistent suspicious stricture. | source.question-topic.biliary-injury-malignancy.bsg-2024; source.question-topic.biliary-injury-malignancy.esge-stricture-2025 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.cca-cholangioscopy | For an indeterminate biliary stricture after standard ERCP sampling, cholangioscopy-guided intraductal biopsy is an additional supported diagnostic approach. | source.question-topic.biliary-injury-malignancy.esge-stricture-2025; source.question-topic.biliary-injury-malignancy.bsg-2024 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.hilar-primary-biopsy | Needle sampling of a potentially curable perihilar primary can risk tumor dissemination and should not be substituted automatically for intraductal sampling. | source.question-topic.biliary-injury-malignancy.bsg-2024; source.question-topic.biliary-injury-malignancy.esge-stricture-2025 | moderate; No seeding probability or universal transplant eligibility is asserted; nodal or distant-lesion sampling is a different target. |
| claim.question-topic.biliary-injury-malignancy.hilar-intraductal | Perihilar stricture tissue evaluation can combine ERCP brush cytology and fluoroscopy-guided intraductal biopsies. | source.question-topic.biliary-injury-malignancy.esge-stricture-2025; source.question-topic.biliary-injury-malignancy.bsg-2024 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.hilar-remnant-drain | When preoperative perihilar drainage is selected, the future liver remnant is the initial drainage target; additional segments depend on response or cholangitis. | source.question-topic.biliary-injury-malignancy.bsg-2024 | moderate; Single adequate current guideline for exact side selection; no universal ERCP-versus-PTC ranking or remnant-volume cutoff is taught. |
| claim.question-topic.biliary-injury-malignancy.cca-palliation-metal | For durable palliation of unresectable distal malignant biliary obstruction, a self-expanding metal stent is favored over repeated plastic stenting. | source.question-topic.biliary-injury-malignancy.bsg-2024; source.question-topic.biliary-injury-malignancy.esge-stent-2018 | moderate; No added limitation |
| claim.question-topic.biliary-injury-malignancy.cca-rescue-eus | After failed ERCP drainage of distal malignant obstruction, expert EUS-guided biliary drainage is favored over percutaneous drainage when appropriate local expertise exists. | source.question-topic.biliary-injury-malignancy.bsg-2024 | moderate; Single adequate current guideline; percutaneous drainage remains a supported alternative when EUS drainage is unavailable or unsuitable. |
| claim.question-topic.biliary-injury-malignancy.repair-timing-conflict | Older WSES and newer SAGES-AHPBA recommendations use different repair-time categories and allow context-dependent exceptions; a universal repair-date key is not supported by this packet. | source.question-topic.biliary-injury-malignancy.wses-2021; source.question-topic.biliary-injury-malignancy.sages-ahpba-2025 | conflicting; Withheld scoring. No averaging of intervals; clinician must adjudicate the exact proposed scenario. |
| claim.question-topic.biliary-injury-malignancy.cyst-i-anatomy | Type I bile duct cysts involve the extrahepatic bile duct. | source.question-topic.biliary-injury-malignancy.cysts-2023 | moderate; Single specialist review; no inherited ethnicity variable is used. |
| claim.question-topic.biliary-injury-malignancy.cyst-iva-anatomy | Type IVA bile duct cysts include intrahepatic and extrahepatic cystic disease. | source.question-topic.biliary-injury-malignancy.cysts-2023 | moderate; Single specialist review; no inherited ethnicity variable is used. |
| claim.question-topic.biliary-injury-malignancy.cyst-iii-anatomy | A choledochocele is cystic expansion of the intraduodenal distal bile duct. | source.question-topic.biliary-injury-malignancy.cysts-2023 | moderate; Single specialist review; no inherited ethnicity variable is used. |
| claim.question-topic.biliary-injury-malignancy.focal-collection-drainage | A localized postoperative bile collection can require percutaneous drainage when it is not adequately drained. | source.question-topic.biliary-injury-malignancy.wses-2021 | moderate; Single adequate guideline; source control depends on localization and clinical condition. |
| claim.question-topic.biliary-injury-malignancy.localized-intrahepatic-cyst | Bile duct cystic disease confined to a defined intrahepatic segment can be considered for segment-directed liver resection. | source.question-topic.biliary-injury-malignancy.cysts-2023 | low; Single specialist narrative review; no blanket resection or transplant eligibility rule is asserted. |
| claim.question-topic.biliary-injury-malignancy.benign-removable-devices | A benign duct stricture is treated with temporary removable stent strategies rather than routine permanent uncovered metal stenting. | source.question-topic.biliary-injury-malignancy.esge-stent-2018 | moderate; Targeted society-guideline verification; device selection is individualized, and plastic versus removable covered metal superiority is not taught. |
| claim.question-topic.biliary-injury-malignancy.r2.localized-biloma-source-control | A localized postoperative biloma may be managed by percutaneous catheter drainage when its anatomy permits access. | source.question-topic.biliary-injury-malignancy.wses-2021; source.question-topic.biliary-injury-malignancy.esge-stent-2018 | moderate; Operative source control remains appropriate for diffuse contamination or when percutaneous control is not feasible; no universal access-method superiority is asserted. |
| claim.question-topic.biliary-injury-malignancy.r2.primary-biloma-endoscopy | ESGE 2018 does not recommend a primary endoscopic approach for draining bilomas. | source.question-topic.biliary-injury-malignancy.esge-stent-2018 | low; Strong recommendation based on low-quality evidence; selected expert EUS drainage exists, so the item asks for the initial preferred approach rather than an impossible alternative. |
| claim.question-topic.biliary-injury-malignancy.r2.septic-proximal-obstruction | Transhepatic biliary drainage can provide decompression in septic patients with complete main-duct obstruction when ERCP cannot restore drainage. | source.question-topic.biliary-injury-malignancy.wses-2021 | low; Single adequate guideline, weak/low-quality management evidence; not a universal timing or definitive-repair rule. |
| claim.question-topic.biliary-injury-malignancy.r2.infected-residual-territory | Cholangitis in a residual obstructed biliary territory can require additional drainage despite drainage of the planned future liver remnant. | source.question-topic.biliary-injury-malignancy.bsg-2024 | moderate; Single adequate current guideline, recommendation 23; the exact territory requires current anatomical and infection findings. |
| claim.question-topic.biliary-injury-malignancy.r2.postchole-multiple-plastic-stents | ESGE 2026 suggests temporary multiple plastic stents for postcholecystectomy benign biliary strictures. | source.question-topic.biliary-injury-malignancy.esge-stricture-management-2026 | moderate; Weak recommendation. This does not establish superiority over every expert covered-metal strategy in every patient. |
| claim.question-topic.biliary-injury-malignancy.r2.confluence-metal-boundary | ESGE 2026 describes covered metal stenting as an option for postcholecystectomy strictures more than 2 cm below the hepatic confluence or when adherence to repeated ERCP is problematic. | source.question-topic.biliary-injury-malignancy.esge-stricture-management-2026 | moderate; The exact 2-cm boundary is directly stated in recommendation 1. No universal contraindication or fixed exchange interval is authored. |
| claim.question-topic.biliary-injury-malignancy.r2.cyst-drainage-residual-epithelium | A cyst-enteric drainage operation leaves abnormal bile-duct cyst epithelium in place. | source.question-topic.biliary-injury-malignancy.cysts-2023 | moderate; Single adequate specialist review; postoperative symptom relief does not establish complete cyst removal. |
| claim.question-topic.biliary-injury-malignancy.r2.cyst-drainage-versus-excision | Bile-duct cyst drainage procedures retain a greater metachronous cancer concern than excision and are not the recommended definitive type I treatment. | source.question-topic.biliary-injury-malignancy.cysts-2023 | moderate; Single specialist review; no exact malignancy probability, operative deadline or universal intrapancreatic resection extent is keyed. |

```json
[
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.wses-2021",
    "verifiedOn": "2026-11-11",
    "sections": "Q7 statements 7.1, 7.4 and 7.6; PTBD discussion",
    "purpose": "Distinguish localized collection control, proximal obstructed-system decompression and diffuse peritoneal source control.",
    "originalAccessDateRetained": true
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.esge-stent-2018",
    "verifiedOn": "2026-11-11",
    "sections": "6.2.3 postcholecystectomy strictures; 6.3 biliary leaks/bilomas",
    "purpose": "Biloma access and historical benign-stent boundary; management update checked separately.",
    "originalAccessDateRetained": true
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.bsg-2024",
    "verifiedOn": "2026-11-11",
    "sections": "Recommendation 23 and operable perihilar obstruction",
    "purpose": "Additional drainage for infection in an undrained residual territory.",
    "originalAccessDateRetained": true
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.cysts-2023",
    "verifiedOn": "2026-11-11",
    "sections": "Which operation and reconstruction?",
    "purpose": "Distinguish prior cyst-enteric drainage from actual excision.",
    "originalAccessDateRetained": true
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.nci-gallbladder-2025",
    "verifiedOn": "2026-11-11",
    "sections": "Localized gallbladder cancer treatment discussion",
    "purpose": "Recheck the represented-depth/completeness boundary; no third-party staging tables copied.",
    "originalAccessDateRetained": true
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.ahpba-gallbladder-2015",
    "verifiedOn": "2026-11-11",
    "sections": "Extent of liver and bile-duct resection",
    "purpose": "Site-specific completion surgery and residual duct-wall clearance.",
    "originalAccessDateRetained": true
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.esge-stricture-management-2026",
    "verifiedOn": "2026-11-11",
    "sections": "Main recommendation 1 and postcholecystectomy benign stricture section",
    "purpose": "Current confluence-specific stent choice; previous society editions are not independent sources."
  }
]
```

```json
[
  {
    "source": "SAGE-hosted CAR polyp update",
    "disposition": "excluded_from_new_ingestion",
    "reason": "Sage TDM/AI policy requires separate license for generative-AI use. Search result is not a clinical evidence source. Existing exact local approval/claims are retained without fresh access."
  },
  {
    "source": "Commercial textbooks, UpToDate, AccessSurgery, SCORE, paid banks and recalled exam items",
    "disposition": "excluded",
    "reason": "Forbidden by repository source rules; no such source accessed."
  },
  {
    "source": "Publisher BSG/BJS and SAGES legal page",
    "disposition": "access_limit",
    "reason": "403/redirect failure recorded. No access bypass. Licensed public article copies used where article license was explicit. SAGES used only to flag a withholding boundary; terms incomplete."
  },
  {
    "source": "ten Hove A, de Meijer VE, Hulscher JBF, de Kleine RHJ. Meta-analysis of risk of developing malignancy in congenital choledochal malformation. Br J Surg. 2018;105:482-490. doi:10.1002/bjs.10798.",
    "officialUrl": "https://pmc.ncbi.nlm.nih.gov/articles/PMC5900735/",
    "license": "CC BY-NC-ND 4.0 explicitly verified",
    "disposition": "not_added_to_scored_claim_support",
    "reason": "No adaptations or commercial derivative permission is inferred. The revised cyst item uses original factual synthesis from the previously rights-reviewed 2023 review, with its single-publication limitation retained. No table, figure, excerpt or numerical risk estimate from this meta-analysis is stored."
  }
]
```

## Timing, order, link and integration proposals

Twelve timing classifications and nineteen testing-choice tuples cover every active item, including distractors. Original version timing/order records are archived in the reviewed snapshot. All proposed orders are future_planned and nonexecuted; every new source link has safe new-tab/referrer metadata. No fixed clinical wait is written in a case.

```json
[
  {
    "caseId": "case.topic.biliary-injury-malignancy.communicating-leak.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.communicating-leak-stent.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.communicating-leak-stent.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.communicating-leak-stent.0",
          "choiceLabel": "ERCP with transpapillary plastic stenting",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.bile_leak_ercp"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.communicating-leak-stent.1",
          "choiceLabel": "Percutaneous exchange of the collection drain",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.communicating-leak-stent.2",
          "choiceLabel": "Roux-en-Y hepaticojejunostomy reconstruction",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.perihilar.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.perihilar-tissue-route.0",
          "choiceLabel": "ERCP brushings with intraductal forceps biopsies",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.perihilar-tissue-route.1",
          "choiceLabel": "EUS-guided needle biopsy of the hilar primary",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.endoscopy_with_sampling"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.perihilar-tissue-route.2",
          "choiceLabel": "Percutaneous needle biopsy of the hilar primary",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.biopsy"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.vasculobiliary.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.vascular-collection-imaging.0",
          "choiceLabel": "Multiphasic contrast-enhanced abdominal CT",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.ct"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.vascular-collection-imaging.1",
          "choiceLabel": "Hepatobiliary-contrast MR cholangiography",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.hepatobiliary_contrast_mrcp"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.vascular-collection-imaging.2",
          "choiceLabel": "Hepatobiliary scintigraphy with delayed images",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.nuclear_imaging"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.palliation.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.0",
          "choiceLabel": "EUS-guided biliary drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.1",
          "choiceLabel": "Percutaneous transhepatic biliary drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.2",
          "choiceLabel": "Operative bypass with hepaticojejunostomy",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.reaccumulating-biloma.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.0",
          "choiceLabel": "Percutaneous image-guided catheter drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.image_guided_aspiration_culture"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.1",
          "choiceLabel": "Laparoscopic washout with drain placement",
          "timing": {
            "kind": "no_test"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.2",
          "choiceLabel": "EUS-guided transluminal collection drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.0",
          "choiceLabel": "Percutaneous transhepatic biliary drainage",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.1",
          "choiceLabel": "ERCP with transpapillary plastic stenting",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.bile_leak_ercp"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.2",
          "choiceLabel": "Percutaneous exchange of the collection catheter",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.image_guided_aspiration_culture"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.r2.t1a-complete-resection.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.t1a-complete-resection.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.t1a-complete-resection.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.r2.t2-margin-directed-completion.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.r2.duct-wall-margin-clearance.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.r2.type-i-cyst-excision.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.type-i-cyst-excision.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.type-i-cyst-excision.v2",
    "classification": {
      "kind": "no_test"
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.r2.future-remnant-drainage.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.0",
          "choiceLabel": "Right posterior sectoral ducts",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.1",
          "choiceLabel": "Left hepatic duct system",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.2",
          "choiceLabel": "Right anterior sectoral ducts",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.advanced_diagnostic"
          }
        }
      ]
    }
  },
  {
    "caseId": "case.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "classification": {
      "kind": "test_choices",
      "choices": [
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.0",
          "choiceLabel": "ERCP placement of multiple plastic stents",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.therapeutic_ercp"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.1",
          "choiceLabel": "ERCP placement of a fully covered metal stent",
          "timing": {
            "kind": "test",
            "timingProfileId": "timing.test.therapeutic_ercp"
          }
        },
        {
          "choiceId": "choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.2",
          "choiceLabel": "Roux-en-Y hepaticojejunostomy reconstruction",
          "timing": {
            "kind": "no_test"
          }
        }
      ]
    }
  }
]
```

```json
[
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.communicating-leak-stent.0",
    "caseId": "case.topic.biliary-injury-malignancy.communicating-leak.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.communicating-leak-stent.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.communicating-leak-stent.v1",
    "choiceId": "choice.topic.biliary-injury-malignancy.communicating-leak-stent.0",
    "choiceLabel": "ERCP with transpapillary plastic stenting",
    "timingProfileId": "timing.test.bile_leak_ercp",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact tuple after acceptance; placeholder wait previews do not execute a test or an outside-hospital procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.perihilar-tissue-route.0",
    "caseId": "case.topic.biliary-injury-malignancy.perihilar.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "choiceId": "choice.topic.biliary-injury-malignancy.perihilar-tissue-route.0",
    "choiceLabel": "ERCP brushings with intraductal forceps biopsies",
    "timingProfileId": "timing.test.endoscopy_with_sampling",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact tuple after acceptance; placeholder wait previews do not execute a test or an outside-hospital procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.perihilar-tissue-route.1",
    "caseId": "case.topic.biliary-injury-malignancy.perihilar.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "choiceId": "choice.topic.biliary-injury-malignancy.perihilar-tissue-route.1",
    "choiceLabel": "EUS-guided needle biopsy of the hilar primary",
    "timingProfileId": "timing.test.endoscopy_with_sampling",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact tuple after acceptance; placeholder wait previews do not execute a test or an outside-hospital procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.perihilar-tissue-route.2",
    "caseId": "case.topic.biliary-injury-malignancy.perihilar.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1",
    "choiceId": "choice.topic.biliary-injury-malignancy.perihilar-tissue-route.2",
    "choiceLabel": "Percutaneous needle biopsy of the hilar primary",
    "timingProfileId": "timing.test.biopsy",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact tuple after acceptance; placeholder wait previews do not execute a test or an outside-hospital procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.vascular-collection-imaging.0",
    "caseId": "case.topic.biliary-injury-malignancy.vasculobiliary.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "choiceId": "choice.topic.biliary-injury-malignancy.vascular-collection-imaging.0",
    "choiceLabel": "Multiphasic contrast-enhanced abdominal CT",
    "timingProfileId": "timing.test.ct",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact tuple after acceptance; placeholder wait previews do not execute a test or an outside-hospital procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.vascular-collection-imaging.1",
    "caseId": "case.topic.biliary-injury-malignancy.vasculobiliary.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "choiceId": "choice.topic.biliary-injury-malignancy.vascular-collection-imaging.1",
    "choiceLabel": "Hepatobiliary-contrast MR cholangiography",
    "timingProfileId": "timing.test.hepatobiliary_contrast_mrcp",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact tuple after acceptance; placeholder wait previews do not execute a test or an outside-hospital procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.vascular-collection-imaging.2",
    "caseId": "case.topic.biliary-injury-malignancy.vasculobiliary.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1",
    "choiceId": "choice.topic.biliary-injury-malignancy.vascular-collection-imaging.2",
    "choiceLabel": "Hepatobiliary scintigraphy with delayed images",
    "timingProfileId": "timing.test.nuclear_imaging",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact tuple after acceptance; placeholder wait previews do not execute a test or an outside-hospital procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.0",
    "caseId": "case.topic.biliary-injury-malignancy.palliation.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "choiceId": "choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.0",
    "choiceLabel": "EUS-guided biliary drainage",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact tuple after acceptance; placeholder wait previews do not execute a test or an outside-hospital procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.1",
    "caseId": "case.topic.biliary-injury-malignancy.palliation.v1",
    "nodeId": "node.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "questionVariantId": "question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1",
    "choiceId": "choice.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.1",
    "choiceLabel": "Percutaneous transhepatic biliary drainage",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact tuple after acceptance; placeholder wait previews do not execute a test or an outside-hospital procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.0",
    "caseId": "case.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.reaccumulating-biloma.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.0",
    "choiceLabel": "Percutaneous image-guided catheter drainage",
    "timingProfileId": "timing.test.image_guided_aspiration_culture",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.2",
    "caseId": "case.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.reaccumulating-biloma.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.reaccumulating-biloma.2",
    "choiceLabel": "EUS-guided transluminal collection drainage",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.0",
    "caseId": "case.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.0",
    "choiceLabel": "Percutaneous transhepatic biliary drainage",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.1",
    "caseId": "case.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.1",
    "choiceLabel": "ERCP with transpapillary plastic stenting",
    "timingProfileId": "timing.test.bile_leak_ercp",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.2",
    "caseId": "case.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.main-duct-discontinuity.2",
    "choiceLabel": "Percutaneous exchange of the collection catheter",
    "timingProfileId": "timing.test.image_guided_aspiration_culture",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.0",
    "caseId": "case.topic.biliary-injury-malignancy.r2.future-remnant-drainage.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.0",
    "choiceLabel": "Right posterior sectoral ducts",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.1",
    "caseId": "case.topic.biliary-injury-malignancy.r2.future-remnant-drainage.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.1",
    "choiceLabel": "Left hepatic duct system",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.2",
    "caseId": "case.topic.biliary-injury-malignancy.r2.future-remnant-drainage.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.future-remnant-drainage.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.future-remnant-drainage.2",
    "choiceLabel": "Right anterior sectoral ducts",
    "timingProfileId": "timing.test.advanced_diagnostic",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.0",
    "caseId": "case.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.0",
    "choiceLabel": "ERCP placement of multiple plastic stents",
    "timingProfileId": "timing.test.therapeutic_ercp",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  },
  {
    "proposalId": "order-proposal.choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.1",
    "caseId": "case.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.v2",
    "nodeId": "node.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "questionVariantId": "question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2",
    "choiceId": "choice.topic.biliary-injury-malignancy.r2.benign-continuity-stenting.1",
    "choiceLabel": "ERCP placement of a fully covered metal stent",
    "timingProfileId": "timing.test.therapeutic_ercp",
    "orderScope": "presentation_only",
    "execution": "not_added",
    "classification": "future_planned",
    "serviceRequest": null,
    "resultGateAfter": null,
    "managerAction": "Bind this exact reviewed tuple only after manager acceptance. Wait preview executes no hospital test or procedure."
  }
]
```

```json
[
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.wses-2021",
    "title": "2020 WSES guidelines for the detection and management of bile duct injury during cholecystectomy",
    "href": "https://link.springer.com/article/10.1186/s13017-021-00369-w",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer",
    "usage": "External reference metadata only; no gameplay retrieval."
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.esge-stent-2018",
    "title": "Endoscopic biliary stenting: indications, choice of stents, and results",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2018_a_0659_9864.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer",
    "usage": "External reference metadata only; no gameplay retrieval."
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.bsg-2024",
    "title": "British Society of Gastroenterology guidelines for the diagnosis and management of cholangiocarcinoma",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10715509/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer",
    "usage": "External reference metadata only; no gameplay retrieval."
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.esge-stricture-2025",
    "title": "Diagnostic work-up of bile duct strictures: ESGE Guideline",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2024_a-2481-7048.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer",
    "usage": "External reference metadata only; no gameplay retrieval."
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.nci-gallbladder-2025",
    "title": "Gallbladder Cancer Treatment (PDQ), Health Professional Version",
    "href": "https://www.cancer.gov/types/gallbladder/hp/gallbladder-treatment-pdq",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer",
    "usage": "External reference metadata only; no gameplay retrieval."
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.ahpba-gallbladder-2015",
    "title": "Gallbladder Cancer: expert consensus statement",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC4527853/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer",
    "usage": "External reference metadata only; no gameplay retrieval."
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.cysts-2023",
    "title": "Management of extrahepatic bile duct cysts",
    "href": "https://pmc.ncbi.nlm.nih.gov/articles/PMC10480039/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer",
    "usage": "External reference metadata only; no gameplay retrieval."
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.sages-ahpba-2025",
    "title": "SAGES-AHPBA 2025 Guideline for the Surgical Management of Bile Duct Injury Following Cholecystectomy",
    "href": "https://www.sages.org/publications/guidelines/guideline-for-the-management-of-bdi-following-cholecystectomy/",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer",
    "usage": "External reference metadata only; no gameplay retrieval."
  },
  {
    "sourceId": "source.question-topic.biliary-injury-malignancy.esge-stricture-management-2026",
    "title": "Biliary stricture management: European Society of Gastrointestinal Endoscopy (ESGE) Guideline",
    "href": "https://www.esge.com/assets/downloads/pdfs/guidelines/2026_a-2921-6492.pdf",
    "target": "_blank",
    "rel": "noopener noreferrer",
    "referrerPolicy": "no-referrer",
    "usage": "External reference metadata only; no gameplay retrieval."
  }
]
```

- Preserve the four exact PASS question/node/header snapshots. Optional reviewer suggestions for PASS wording were not applied.
- All twelve active cases are standalone existing-clinic chart reviews. Historical inpatient urgency remains at the outside hospital. No new setting, capability, runtime selector or order execution is requested.
- Four pass-preserved cases are editorially review-ready; eight revised cases remain pending independent review. Seven parked attempts are excluded from all active questions/nodes/cases/concepts/timing/order exports.
- Append only accepted exact timing/order tuples after review; retain the original nineteen timing classifications and thirty-one tuples in the review snapshot for historical versions.
- Three revised constructs receive new meaning versions: septic proximal decompression, infected-residual-territory drainage and confluence-specific stent selection. No history migration.
- Initial source-bank retirement/consolidation proposals remain deferred. A parked replacement cannot justify retiring its original case, and no mixed or partial replacement case is installed.
- Retain the original N2 v2 and shoulder-pain r6 exact legacy PASS cases despite their reused historical IDs. The original 39-row audit and frozen clinical approvals stay intact.
- Manager owns shared manifest/registries, source-test epoch updates, independent review and acceptance. This worker edits only its five files.
- Three former first PASS nodes need standalone terminal-disposition completion. Raw PASS question/node/header exports remain exact. Composed final metadata reuses only the already reviewed wrong-option rationales verbatim; exact before/after receipts are in reviewRound.composition.terminalMetadataReceipts.

## Owner approvals needed

Melissa Rowland remains the named clinical sign-off. Four editorial PASS versions do not confer clinical approval, and the eight revised versions have no independent PASS. The supplied clinical teaching boundaries remain unkeyed; the following exact competing decisions are retained for clinical adjudication. Manager scope/basic-role choices do not pause this completed worker response.

### withheld.topic.biliary-injury-malignancy.repair-timing-and-anastomosis

Affected versions: question.topic.biliary-injury-malignancy.main-duct-discontinuity.v1.
Competing actions: Selected expert early reconstruction versus Drainage with delayed definitive reconstruction versus Hepaticojejunostomy versus hepaticoduodenostomy.
Evidence boundary: WSES 2021 and SAGES-AHPBA 2025 differ in repair-time categories; newer guidance is conditional and permits selected exceptions and either anastomosis. SAGES terms review is incomplete. No universal repair time or anastomotic superiority is keyed.
Precise decision/next action: Melissa and HPB reviewer adjudicate an exact scenario before authoring a timed repair or anastomosis-ranking item.

### withheld.topic.biliary-injury-malignancy.t1b-operation

Affected versions: question.topic.biliary-injury-malignancy.revised-muscular-invasion.v1.
Competing actions: Completion liver-bed resection with portal lymphadenectomy versus Surveillance after cholecystectomy.
Evidence boundary: AHPBA consensus supports re-resection; NCI explicitly describes controversy and lack of prospective evidence. The scored item asks for HPB assessment, not a mandatory operation.
Precise decision/next action: Melissa decides exact T1b extent and patient-specific ranking before a definitive-operation question is keyed.

### withheld.topic.biliary-injury-malignancy.choledochocele-procedure

Affected versions: question.topic.biliary-injury-malignancy.symptomatic-choledochocele.v1.
Competing actions: Endoscopic sphincterotomy versus Transduodenal cyst excision.
Evidence boundary: One narrative review supports endoscopic treatment, but an exact patient-specific comparison with credible surgery requires stronger support; the attempted simpler set failed the difficulty/counterfactual gate.
Precise decision/next action: Obtain additional permitted comparative guidance and clinician adjudication, then build a consequential case.

### withheld.topic.biliary-injury-malignancy.polyp-thresholds

Affected versions: question.gallbladder-polyp.12mm-wall-thickening.v1, question.gallbladder-polyp.16mm.v1, question.gallbladder-polyp.4mm-thin-stalk.v1, question.gallbladder-polyp.8mm-thick-stalk.v1, question.gallbladder-polyp.select-surgical-profile.v1, question.gallbladder-polyp.select-surveillance-profile.v1.
Competing actions: European guideline size/risk framework versus SRU/CAR morphology-led framework.
Evidence boundary: Keep the exact six owner-approved concordant profiles and exclusions. No hybrid threshold, exact follow-up schedule or forbidden ethnicity variable is newly authored. CAR publisher AI terms preclude new ingestion without a license.
Precise decision/next action: Manager retains existing concordant profiles; Melissa must choose an explicit framework before any disputed boundary is scored.

### withheld.topic.biliary-injury-malignancy.cyst-surveillance-interval

Affected versions: No keyed item.
Competing actions: Long-term biliary surveillance after excision versus Discharge after a fixed interval.
Evidence boundary: One review supports continuing risk, but does not establish a universally validated exact surveillance schedule.
Precise decision/next action: Source and clinician review before an interval-specific scored item.

### clinical-hold.review-response.question.topic.biliary-injury-malignancy.revised-muscular-invasion.v1

Affected versions: question.topic.biliary-injury-malignancy.revised-muscular-invasion.v1, question.topic.biliary-injury-malignancy.revised-muscular-invasion.v2.
Competing actions: Completion liver-bed resection with regional lymphadenectomy versus Cancer-team surveillance after cholecystectomy versus Extrahepatic duct resection with reconstruction.
Evidence boundary: Baseline and malignant invasion are now explicit, and the overlapping generic-versus-specific assessment options are removed. However, an exclusive mandatory completion-operation key for every T1b patient remains disputed in the permitted sources. A broad HPB-assessment alternative is clinically reasonable but remains an easy reassessment item. Parked.
Precise decision/next action: Melissa/HPB reviewer decides the exact T1b plan or explicitly accepts a simpler reassessment objective.

### clinical-hold.review-response.question.topic.biliary-injury-malignancy.distal-combined-sampling.v1

Affected versions: question.topic.biliary-injury-malignancy.distal-combined-sampling.v1, question.topic.biliary-injury-malignancy.distal-combined-sampling.v2.
Competing actions: EUS-guided duct-wall core sampling versus ERCP brushings with intraductal forceps biopsies versus Cholangioscopy-guided intraductal biopsy.
Evidence boundary: The one attempt removes the comprehensive A-plus-B versus A versus B shortcut and the decorative staging-sequence sentence. The equally complete target-based alternatives do not have an exclusive patient-specific ranking established here. The existing combined-method recommendation is not declared false, but repeating it as a uniquely comprehensive key would remain easy and specialized. Parked.
Precise decision/next action: Clinician confirms a consequential target-specific discriminator or chooses a deliberately focused simpler teaching role.

### clinical-hold.review-response.question.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v1

Affected versions: question.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v1, question.topic.biliary-injury-malignancy.indeterminate-stricture-targeted-biopsy.v2.
Competing actions: Cholangioscopy-guided stricture biopsy versus EUS-guided core sampling of the duct wall versus Fluoroscopic forceps sampling of the stricture.
Evidence boundary: The one attempt now states exactly what EUS visualized and did not sample. The options no longer use a unique novel technique versus two Repeat labels. Direct cholangioscopy is reasonable, but current findings do not exclude a useful first EUS duct-wall sample or improved fluoroscopic acquisition. Exclusive ranking remains unresolved, so the attempt is parked without claiming that absence of a pancreatic mass makes duct-wall EUS sampling impossible.
Precise decision/next action: HPB/endoscopy clinician resolves the exact cholangioscopy-versus-EUS/standard-acquisition comparison using patient-specific evidence.

### clinical-hold.review-response.question.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v1

Affected versions: question.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v1, question.topic.biliary-injury-malignancy.refractory-postoperative-stricture.v2.
Competing actions: Roux-en-Y hepaticojejunostomy reconstruction versus Percutaneous cholangioplasty with internal drainage versus Percutaneous-endoscopic rendezvous stenting.
Evidence boundary: The one attempt clarifies the age/date anchor, intervening treatment and reported same-site extension. It replaces an unchanged failed ERCP and Permanent external drainage with real percutaneous and combined approaches. The existing evidence does not exclusively rank those feasible expert options against reconstruction for the supplied anatomy. Parked pending anatomy-specific adjudication.
Precise decision/next action: Clinician reviews the actual duct map and feasibility of percutaneous/rendezvous restoration versus reconstruction; no general permanent-drain claim is taught.

### clinical-hold.review-response.question.topic.biliary-injury-malignancy.arterial-injury-perfusion.v1

Affected versions: question.topic.biliary-injury-malignancy.arterial-injury-perfusion.v1, question.topic.biliary-injury-malignancy.arterial-injury-perfusion.v2.
Competing actions: Serial perfusion imaging and liver biochemistry versus Arterial angiography with revascularization assessment versus Right hepatectomy after vascular mapping.
Evidence boundary: The one attempt removes the announced staged-care plan, identifies the constructed chronology and observed arterial anatomy, and names a concrete surveillance plan. Preserved enhancement excludes automatic inference of current liver necrosis, but it still does not establish an exclusive surveillance-versus-selected-revascularization ranking. Parked as requested for the low-certainty arterial-repair boundary.
Precise decision/next action: HPB vascular/reconstructive clinician adjudicates the exact repairable anatomy and timing; do not change the preserved imaging PASS companion.

### approval.topic.biliary-injury-malignancy.exact-active-r2

Affected versions: question.topic.biliary-injury-malignancy.communicating-leak-stent.v1, question.topic.biliary-injury-malignancy.perihilar-tissue-route.v1, question.topic.biliary-injury-malignancy.vascular-collection-imaging.v1, question.topic.biliary-injury-malignancy.failed-ercp-rescue-drainage.v1, question.topic.biliary-injury-malignancy.reaccumulating-biloma.v2, question.topic.biliary-injury-malignancy.main-duct-discontinuity.v2, question.topic.biliary-injury-malignancy.t1a-complete-resection.v2, question.topic.biliary-injury-malignancy.t2-margin-directed-completion.v2, question.topic.biliary-injury-malignancy.duct-wall-margin-clearance.v2, question.topic.biliary-injury-malignancy.type-i-cyst-excision.v2, question.topic.biliary-injury-malignancy.future-remnant-drainage.v2, question.topic.biliary-injury-malignancy.benign-continuity-stenting.v2.
Competing actions: Exact clinical review of the listed candidate versions.
Evidence boundary: Clinical review remains separate from software validation and editorial PASS.
Precise decision/next action: Named clinical review remains pending for all twelve exact active versions and their source claims. Independent PASS applies only to the four preserved editorial versions.

## Validation — exact commands and outcomes

The normal explicit-import capture verified all four raw PASS question/node/header hashes and the actual pathology table. Focused tests also verify required closing metadata, registry/source-history preservation, source closure and every testing choice. These are structural and implementation checks, not clinical approval.

Command: npm.cmd test -- --pool=threads src/question-topic-biliary-injury-malignancy-20261111.test.ts
Working directory: packages/clinical-content. Exit code: 1. Run: initial response validation.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-biliary-injury-malignancy-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content

 ❯ src/question-topic-biliary-injury-malignancy-20261111.test.ts (11 tests | 1 failed) 88ms
     × accounts for all review decisions and gives each returned item exactly one attempt 6ms

⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯

 FAIL  src/question-topic-biliary-injury-malignancy-20261111.test.ts > biliary injury and malignancy explicit-import sidecar > accounts for all review decisions and gives each returned item exactly one attempt
AssertionError: expected 27 to be greater than 30
 ❯ src/question-topic-biliary-injury-malignancy-20261111.test.ts:243:95
    241|     for (const item of packet.reviewRound.items) {
    242|       expect(item.revisionAttempts).toBe(item.status === "pass-preserv…
    243|       for (const response of Object.values(item.reviewNoteResponses)) …
       |                                                                                               ^
    244|       expect(item.independentReviewStatus).toBe(item.status === "pass-…
    245|     }

⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯


 Test Files  1 failed (1)
      Tests  1 failed | 10 passed (11)
   Start at  20:29:51
   Duration  880ms (transform 422ms, setup 0ms, import 646ms, tests 88ms, environment 0ms)

npm error Lifecycle script `test` failed with error:
npm error code 1
npm error path C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error workspace @gamify-surgery/clinical-content@0.0.1
npm error location C:\Users\rowla\Projects\GamifySurgery\packages\clinical-content
npm error command failed
npm error command C:\WINDOWS\system32\cmd.exe /d /s /c vitest run --pool=threads src/question-topic-biliary-injury-malignancy-20261111.test.ts

```

Ten tests passed; a nonempty response-length guard rejected a short preserved-PASS note. Relaxed the implementation-only text bound without padding clinical prose.

Command: npm.cmd run typecheck
Working directory: packages/clinical-content. Exit code: 1. Run: initial response validation.

```text

> @gamify-surgery/clinical-content@0.0.1 typecheck
> tsc --noEmit -p tsconfig.json

src/question-topic-biliary-injury-malignancy-20261111.test.ts(301,116): error TS2339: Property 'exhibit' does not exist on type '{ contentVersion: string; reviewStatus: string; aiAssistedDrafting: boolean; lastClinicianReview: null; id: string; conceptId: string; stem: string; answerChoices: ({ id: string; label: string; isCorrect: boolean; rationale: string; distractorRationale: null; } | { ...; })[]; explanation: string; supportingEvidenceC...'.
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

Fixed the owned test access to an absent historical JSON property using Object.hasOwn. The concurrent Colon diagnostic was not edited.

Command: npm.cmd test -- --pool=threads src/question-topic-biliary-injury-malignancy-20261111.test.ts
Working directory: packages/clinical-content. Exit code: 0. Run: final response validation.

```text

> @gamify-surgery/clinical-content@0.0.1 test
> vitest run --pool=threads src/question-topic-biliary-injury-malignancy-20261111.test.ts


 RUN  v4.1.10 C:/Users/rowla/Projects/GamifySurgery/packages/clinical-content


 Test Files  1 passed (1)
      Tests  11 passed (11)
   Start at  20:30:21
   Duration  706ms (transform 340ms, setup 0ms, import 532ms, tests 69ms, environment 0ms)


```

Command: npm.cmd run typecheck
Working directory: packages/clinical-content. Exit code: 1. Run: final response validation.

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

src/question-topic-colon-diverticular-lower-bleeding-20261111.ts(2516,14), TS2322: terminal disposition clinicalRationale is string | undefined rather than required string. No out-of-lane edit.

Command: node -e "const fs=require('fs');for(const file of ['docs/research/question-topic-biliary-injury-malignancy-20261111.json','docs/research/sources-question-topic-biliary-injury-malignancy-20261111.json']){JSON.parse(fs.readFileSync(file,'utf8'));console.log('JSON PASS '+file)}"
Working directory: repository root. Exit code: 0.

```text
JSON PASS docs/research/question-topic-biliary-injury-malignancy-20261111.json
JSON PASS docs/research/sources-question-topic-biliary-injury-malignancy-20261111.json

```

Final focused outcome: one file / eleven tests passed. Final package typecheck: exit 1, only concurrent question-topic-colon-diverticular-lower-bleeding-20261111.ts(2516,14) TS2322; zero owned diagnostics. The initial owned test typing error was corrected. Both JSON outputs parse. No broader suite, browser, install, commit, push, agent or release action was used.

## Final worker handoff

```text
Topic biliary-injury-malignancy
Files changed packages/clinical-content/src/question-topic-biliary-injury-malignancy-20261111.ts; packages/clinical-content/src/question-topic-biliary-injury-malignancy-20261111.test.ts; docs/research/question-topic-biliary-injury-malignancy-20261111.json; docs/research/question-topic-biliary-injury-malignancy-20261111.md; docs/research/sources-question-topic-biliary-injury-malignancy-20261111.json
Inventory Original 39 primary variants retained. Independent review: 19 slots, comprising 4 PASS /14 REVISE /1 FAIL.
Counts pass-preserved 4, revised 8, parked 7; all 15 returned slots received one attempt.
Count basis 12 active exact question versions in 12 standalone clinic cases; 8 new revision versions, 3 changed meaning versions; original history retained.
Held/unkeyed Original 5 withheld teaching points retained. Seven unkeyed parked attempts are listed in reviewRound.parkedItems; no active export includes them.
Research Nine sources /42 atomic claims, including 8 new claims. Current ESGE 2026 confluence guidance checked; single-source/low-certainty boundaries explicit.
Packet docs/research/question-topic-biliary-injury-malignancy-20261111.md; corresponding question-topic JSON and sources-question-topic JSON.
Identity preservation Four raw PASS question/node/header hashes exact. Three standalone closing-metadata adapters copy reviewed rationales verbatim; manager composition acceptance required. Original 39-row clinical/PASS freezes and histories retained.
Owner approvals needed Exact clinical sign-off for all 12 active versions; parked T1b extent, diagnostic sampling rankings, percutaneous-vs-reconstruction and arterial-repair comparisons remain unresolved. Prior timing/anastomosis, polyp and cyst-surveillance holds retained.
Integration Four pass-preserved standalone cases /8 revised pending standalone cases; no mixed case. 12 timing classifications /19 nonexecuted future_planned tuples; no shared-file edits.
Validation npm.cmd test -- --pool=threads src/question-topic-biliary-injury-malignancy-20261111.test.ts: exit 0, Test Files 1 passed, Tests 11 passed. npm.cmd run typecheck: exit 1, sole concurrent Colon(2516,14) TS2322, zero owned diagnostics. Both JSON outputs parse exit 0. Exact outputs above.
Open work Manager inspects the five-file diff, accepts mechanical compositions, commissions independent review of eight revised items and resolves clinical holds. Local-only authoring sidecar; no commit/push/deploy/install/agents.
```

