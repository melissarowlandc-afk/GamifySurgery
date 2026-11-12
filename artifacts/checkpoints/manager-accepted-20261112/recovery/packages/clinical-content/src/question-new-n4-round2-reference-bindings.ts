// Existing identities and art contracts; explicit draft snapshots, never default registration.
import type {TestedConcept} from "./schema";

export const QUESTION_NEW_N4_ROUND2_REUSED_CONCEPTS:TestedConcept[] = [
  {
    "id": "concept.soft-tissue-mass.extremity-mri.v2",
    "displayName": "Assess local MRI adequacy before soft-tissue biopsy",
    "learningObjective": "Choose completion of local MRI based on the actual field coverage, compartment mapping and viable-target information missing from an outside study before biopsy planning.",
    "earliestFacilityStage": 1,
    "conceptType": "workup"
  },
  {
    "id": "concept.peptic-ulcer-bleeding.endoscopic-hemostasis-modality.v2",
    "displayName": "Recognize failed repeat ulcer hemostasis and select rescue",
    "learningObjective": "Use documented repeat-endoscopy failure and target access to choose angiographic versus further endoscopic or operative rescue for recurrent peptic-ulcer bleeding.",
    "earliestFacilityStage": 2,
    "conceptType": "management"
  },
  {
    "id": "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
    "displayName": "Choose the operative plane for a symptomatic recurrent inguinal hernia",
    "learningObjective": "Interpret the archived operative anatomy and choose an offered posterior repair after prior anterior mesh surgery rather than repeat the operated plane.",
    "earliestFacilityStage": 1,
    "conceptType": "management"
  }
];

export const QUESTION_NEW_N4_ROUND2_FAMILY_BINDINGS = [
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "family.n4.bilateral-testis-maintenance-versus-ascent.v2",
    "phenotypeId": "phenotype.n4.bilateral-testis-maintenance-versus-ascent.v2",
    "caseId": "case.n4.bilateral-testis-maintenance-versus-ascent.v2",
    "profileId": "profile.n4.bilateral-testis-maintenance-versus-ascent.v2",
    "childName": "Leo Mitchell",
    "childStillId": "level3-roster-v2.022",
    "prototypeDemographics": {
      "ageYears": 5,
      "sexLabel": "Male"
    },
    "parentName": "David Mitchell",
    "parentRelationship": "father",
    "parentCount": 1,
    "parentPlacement": "same_room_throughout",
    "metadataSource": "tools/character-mapping/level3-roster-complete-v2/roster.json",
    "profileValuesBasis": "editorial_art_contract_not_disease_probability",
    "evidenceClaimIds": [
      "claim.n4r2.retractile-maintained-position",
      "claim.n4r2.acquired-ascent-operative-boundary",
      "claim.n4r2.retractile-surveillance"
    ],
    "agentReview": {
      "authority": "Manager-delegated editorial draft authoring",
      "reviewedOn": "2026-11-10",
      "clinicianSignOff": false,
      "scope": "Exact existing family/art tuple; new clinical presentation needs review. Not installed in runtime defaults."
    },
    "basisCaseId": "case.pediatric-clinic.intermittent-retraction-followup",
    "basisProfileId": "profile.pediatric-clinic.intermittent-retraction-followup.boy5"
  },
  {
    "contentVersion": "clinical.question-new-n4.2026-11-10.round2.v1",
    "reviewStatus": "needs_clinician_review",
    "aiAssistedDrafting": true,
    "lastClinicianReview": null,
    "id": "family.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "phenotypeId": "phenotype.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "caseId": "case.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "profileId": "profile.n4.intermittent-groin-contents-versus-fluid-scan.v1",
    "childName": "Noah Bennett",
    "childStillId": "level3-roster-v2.022",
    "prototypeDemographics": {
      "ageYears": 5,
      "sexLabel": "Male"
    },
    "parentName": "Daniel Bennett",
    "parentRelationship": "father",
    "parentCount": 1,
    "parentPlacement": "same_room_throughout",
    "metadataSource": "tools/character-mapping/level3-roster-complete-v2/roster.json",
    "profileValuesBasis": "editorial_art_contract_not_disease_probability",
    "evidenceClaimIds": [
      "claim.n4r2.child-groin-dynamic-contents",
      "claim.n4r2.child-hernia-repair",
      "claim.n4r2.child-hernia-urgent-boundary"
    ],
    "agentReview": {
      "authority": "Manager-delegated editorial draft authoring",
      "reviewedOn": "2026-11-10",
      "clinicianSignOff": false,
      "scope": "Exact existing family/art tuple; new clinical presentation needs review. Not installed in runtime defaults."
    },
    "basisCaseId": "case.pediatric-clinic.groin-bulge-after-play",
    "basisProfileId": "profile.pediatric-clinic.groin-bulge-after-play.boy5"
  }
];
