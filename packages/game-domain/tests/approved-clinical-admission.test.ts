import { QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import { QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import { QUESTION_FLAG_TESTED_CONCEPTS, QUESTION_FLAG_ROUND2_TESTED_CONCEPTS, QUESTION_FLAG_ROUND3_TESTED_CONCEPTS } from "@gamify-surgery/clinical-content";
import { QUESTION_NEW_N1_TESTED_CONCEPTS, QUESTION_NEW_N2_TESTED_CONCEPTS } from "@gamify-surgery/clinical-content";
import { QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import { describe, expect, it } from "vitest";
import { QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS } from "@gamify-surgery/clinical-content";
import { QUESTION_QUALITY_ADVERSARIAL_R7_TESTED_CONCEPTS, QUESTION_QUALITY_ADVERSARIAL_R6_TESTED_CONCEPTS, QUESTION_QUALITY_ADVERSARIAL_R5_TESTED_CONCEPTS, QUESTION_QUALITY_ADVERSARIAL_R4_TESTED_CONCEPTS, GS028_20261007_LEVEL3_TESTED_CONCEPTS, GS028_20261007_VARIETY2_TESTED_CONCEPTS, PEDIATRIC_CLINIC_TESTED_CONCEPTS, PEDIATRIC_CLINIC_BATCH_MANIFEST, VARIETY3_TESTED_CONCEPTS } from "@gamify-surgery/clinical-content";
import { BOARD_EXPANSION_20260912_TESTED_CONCEPTS, BOARD_EXPANSION_TESTED_CONCEPTS, BREAD_BUTTER_20260917_TESTED_CONCEPTS, BRIEF_EARLY_LEVELS_20260917_TESTED_CONCEPTS, EARLY_LEVELS_20260913_TESTED_CONCEPTS, GS028_20260928_TESTED_CONCEPTS, GS028_20260929_TESTED_CONCEPTS, GS028_20261002_TESTED_CONCEPTS, GS028_20261003_TESTED_CONCEPTS, GS028_20261007_TESTED_CONCEPTS, GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS, LEVEL_TWO_RUNTIME_CONCEPTS, SURGERY_CENTER_TESTED_CONCEPTS, TWENTY_CONCEPT_BATCH_CONCEPTS } from "@gamify-surgery/clinical-content";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getEligibleServiceRoute,
  patientRosterEntryById,
  patientVisualAgeBand,
  serializeGameState,
} from "../src";

function emptyLevelOne(seed: string) {
  const state = createInitialGameState(undefined, {
    campaignId: `campaign.${seed}`,
    campaignSeed: seed,
    createdAtRealMs: 0,
  });
  state.facilityLevel = 1;
  state.encounters = {};
  state.openChartEncounterId = null;
  state.attendedEncounterId = null;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  return state;
}

describe("approved clinical admission boundaries", () => {
  it("provides the approved off-site ultrasound route as centralized simulation timing", () => {
    expect(
      getEligibleServiceRoute(
        emptyLevelOne("ultrasound-route"),
        "service.ultrasound",
      ),
    ).toMatchObject({
      service: {
        id: "service.ultrasound",
        displayName: "Ultrasound",
      },
      route: {
        id: "route.ultrasound.outsourced",
        displayName: "Off-site ultrasound",
      },
      timing: {
        serviceDurationTicks: 150,
        durationTicks: 150,
      },
    });
  });

  it("provides centralized off-site diagnostic breast-imaging timing", () => {
    expect(
      getEligibleServiceRoute(
        emptyLevelOne("diagnostic-breast-imaging-route"),
        "service.diagnostic_breast_imaging",
      ),
    ).toMatchObject({
      service: {
        id: "service.diagnostic_breast_imaging",
        displayName: "Diagnostic breast imaging",
      },
      route: {
        id: "route.diagnostic_breast_imaging.outsourced",
        displayName: "Off-site diagnostic breast imaging",
      },
      timing: {
        serviceDurationTicks: 120,
        durationTicks: 120,
      },
    });
  });

  it("withholds the painful-cyst iteration until the Minor Procedure capability exists", () => {
    const caseId = "case.breast-cyst.under-30-painful-simple";
    let state = emptyLevelOne("painful-cyst-capability");
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "painful-cyst.without-room",
      encounterId: "encounter.painful-cyst.without-room",
      caseId,
      patientDisplayName: "Capability Test Patient",
      arrivalClass: "routine",
    });
    expect(
      state.encounters["encounter.painful-cyst.without-room"],
    ).toBeUndefined();
    expect(
      state.operationReceipts["painful-cyst.without-room"],
    ).toMatchObject({
      status: "rejected",
      message:
        "This patient requires unavailable clinic capability capability.minor_procedure.",
    });

    state.rooms.push({
      id: "room.test.minor-procedure",
      roomDefinitionId: "room.minor_procedure",
      x: 30,
      y: 28,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
    });
    state.doors.push({
      id: "door.test.minor-procedure",
      roomId: "room.test.minor-procedure",
      side: "east",
      offset: 1,
      exterior: false,
    });
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "painful-cyst.with-room",
      encounterId: "encounter.painful-cyst.with-room",
      caseId,
      patientDisplayName: "Capability Test Patient",
      arrivalClass: "routine",
    });

    expect(
      state.operationReceipts["painful-cyst.with-room"],
    ).toMatchObject({
      status: "applied",
    });
    expect(
      state.encounters["encounter.painful-cyst.with-room"]?.frozenCase,
    ).toMatchObject({
      id: caseId,
      releasePointId: "release.l1.minor_procedure",
      requiredCapabilityIds: ["capability.minor_procedure"],
    });
  });

  it("withholds an approved Level 2 endoscopy case before Level 2 and before its required capability", () => {
    const caseId = "case.l2.colonic-lipoma.direct.typical-b";
    let state = emptyLevelOne("level-two-clinical-gate");
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "l2.before-stage", encounterId: "encounter.l2.before-stage",
      caseId, patientDisplayName: "Level Two Test Patient", arrivalClass: "routine",
    });
    expect(state.operationReceipts["l2.before-stage"]?.message).toBe("This patient becomes eligible at Level 2.");

    state.facilityLevel = 2;
    state = gameReducer(state, {
      type: "ADMIT_PATIENT", operationId: "l2.without-capability", encounterId: "encounter.l2.without-capability",
      caseId, patientDisplayName: "Level Two Test Patient", arrivalClass: "routine",
    });
    expect(state.operationReceipts["l2.without-capability"]?.message).toBe(
      "This patient requires unavailable clinic capability capability.endoscopy.",
    );
  });

  it("keeps the unapproved prototype runtime release limited to explicitly admitted concepts", () => {
    expect(
      PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.concepts.map(
        (concept) => concept.id,
      ),
    ).toEqual([
      "concept.ventral-hernia.elective-pulmonary-optimization",
      "concept.breast-mass.under-30-initial-ultrasound",
      "concept.breast-cyst.asymptomatic-simple-observation",
      "concept.breast-cyst.symptomatic-simple-aspiration",
      "concept.ebv.associated-malignancy-recognition",
      "concept.hcc.milan-transplant-evaluation",
      "concept.mondor-disease.clinical-recognition",
      "concept.mondor-disease.selective-imaging-evaluation",
      "concept.mondor-disease.supportive-management",
      "concept.aaa.female-sex-associated-perioperative-mortality",
      "concept.desmoid.initial-active-surveillance",
      "concept.desmoid.progressing-abdominal-wall-surgical-option",
      "concept.pancreatic-tail-adenocarcinoma.distal-pancreatectomy-with-splenectomy",
      "concept.felty-syndrome.recognition",
      "concept.felty-syndrome.methotrexate-first-line",
      "concept.felty-syndrome.splenectomy-for-refractory-infections",
      "concept.fhh.biochemical-evaluation",
      "concept.fhh.recognition-and-confirmation",
      "concept.fhh.avoid-parathyroid-surgery",
      "concept.lymphangitis.acute-clinical-recognition",
      "concept.gallbladder-polyp.initial-management-category",
      "concept.distal-cholangiocarcinoma.resection-selection",
      "concept.obstructive-jaundice.vitamin-k-coagulopathy",
      "concept.hcc.compensated-cirrhosis-resection-selection",
      "concept.accessory-spleen.common-location",
      "concept.hereditary-spherocytosis.postsplenectomy-persistent-hemolysis-evaluation",
      "concept.hereditary-spherocytosis.confirmed-accessory-spleen-management",
      "concept.ipaa.pouchitis-common-post-ipaa-complication",
      "concept.choledochal-cyst.type-iva-combined-duct-dilation",
      "concept.anal-hsil.high-risk-hpv-association",
      "concept.men2a.core-manifestation-pattern",
      "concept.men2a.pheochromocytoma-precedes-thyroid-intervention",
      "concept.pheochromocytoma.alpha-before-beta-blockade",
      ...LEVEL_TWO_RUNTIME_CONCEPTS.map((concept) => concept.id).filter(
        (id) => id !== "concept.distal-cholangiocarcinoma.resection-selection",
      ),
      ...TWENTY_CONCEPT_BATCH_CONCEPTS.map((concept) => concept.id),
      ...SURGERY_CENTER_TESTED_CONCEPTS.map((concept) => concept.id),
      ...BOARD_EXPANSION_TESTED_CONCEPTS.map((concept) => concept.id),
      ...BOARD_EXPANSION_20260912_TESTED_CONCEPTS.map((concept) => concept.id),
      ...EARLY_LEVELS_20260913_TESTED_CONCEPTS.map((concept) => concept.id),
      ...BRIEF_EARLY_LEVELS_20260917_TESTED_CONCEPTS.map((concept) => concept.id),
      ...BREAD_BUTTER_20260917_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20260928_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20260929_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_STATS_ETHICS_20260929_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261002_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261003_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261007_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261007_VARIETY2_TESTED_CONCEPTS.map((concept) => concept.id),
      ...GS028_20261007_LEVEL3_TESTED_CONCEPTS.map((concept) => concept.id),
      ...PEDIATRIC_CLINIC_TESTED_CONCEPTS.filter(concept => !PEDIATRIC_CLINIC_BATCH_MANIFEST.reusedConceptIds.includes(concept.id)).map(concept => concept.id),
      ...VARIETY3_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_QUALITY_ADVERSARIAL_R4_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_QUALITY_ADVERSARIAL_R5_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_QUALITY_ADVERSARIAL_R6_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_QUALITY_ADVERSARIAL_R7_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_FLAG_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_FLAG_ROUND2_TESTED_CONCEPTS.map(concept => concept.id),
      "concept.achalasia.physiology-directed-treatment.v1",
      "concept.pigmented-skin-lesion.complete-diagnostic-biopsy.v5",
      ...QUESTION_FLAG_ROUND3_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_NEW_N1_TESTED_CONCEPTS.map(concept => concept.id),
      ...QUESTION_NEW_N2_TESTED_CONCEPTS.map(concept => concept.id),
      // Six changed scored objectives; old cards and definitions remain admitted.
      "concept.achalasia.secondary-junction-lesion-assessment.v1",
      "concept.esophageal-physiology.reserve-before-junction-intervention.v1",
      "concept.groin-ultrasound.symptom-provocation-protocol.v1",
      "concept.groin-hernia.femoral-defect-repair-priority.v1",
      "concept.quality-improvement.source-by-method-next-pilot.v1",
      "concept.adrenal-incidentaloma.cortisol-etiologic-classification.v1",
      // Batch 2a final round: materially changed scores, with old histories retained.
      "concept.esophageal-physiology.reserve-acquisition-integrity.v1",
      "concept.esophageal-physiology.integrated-pressure-report.v2",
      "concept.inguinal-hernia.recurrence-after-anterior-repair.v1",
      "concept.groin-ultrasound.proximal-neck-localization.v2",
      "concept.adrenal-incidentaloma.acth-directed-source-imaging.v2",
      // N1 round two retains 32 meanings and appends only six materially changed constructs.
      ...QUESTION_NEW_N1_ROUND2_NEW_CONCEPT_VERSIONS.map(concept => concept.id),
        // Batch 2b: new scored constructs remain drafts; prior histories persist.
        "concept.hyperacute-rejection.event-and-compatibility-review.v1",
        "concept.dtc.representative-node-target-and-assay.v1",
        "concept.palpable-breast.site-concordant-imaging.v1",
        "concept.perianal-abscess.source-control-and-antibiotic-selection.v1",
        "concept.immunology.graft-evidence-to-review-focus.v1",
        "concept.metabolic-acidosis.corrected-gap-directed-evaluation.v1",
        "concept.preoperative-nutrition.risk-before-route-selection.v1",
      // N2 round two: draft versions, without transfer/reset of prior histories.
      ...QUESTION_NEW_N2_ROUND2_NEW_CONCEPT_VERSIONS.map(concept => concept.id),
      // N1 round three: 17 separate changed meanings; earlier histories are retained.
      ...QUESTION_NEW_N1_ROUND3_NEW_CONCEPT_VERSIONS.map(concept => concept.id),
      ...QUESTION_NEW_N2_ROUND3_NEW_CONCEPT_VERSIONS.map((concept) => concept.id),
      // Exact five accepted N3 meanings precede the retained batch 2b registry.
      "concept.n3.bilateral-carotid-symptom-attribution",
      "concept.n3.postsplenectomy-nodule-function-before-targeting",
      "concept.n3.dysphagia-biopsy-territory-after-negative-endoscopy",
      "concept.n3.tumor-screen-versus-family-test-sequence.v2",
      "concept.n3.gastric-lymphoma-new-large-cell-process.v2",
      // Manager-accepted batch 2b / G06 meanings; exact inventory additions.
      "concept.transplant.class-ii-crossmatch-target-and-window.v1",
      "concept.breast.inflammatory-phenotype-after-neoadjuvant-response.v1",
      "concept.mesenteric-ischaemia.post-revascularization-bowel-staging.v1",
      "concept.dialysis-access.symptomatic-central-outflow-assessment.v1",
      "concept.postoperative-delirium.benzodiazepine-withdrawal-exception.v1",
      "concept.biliary-pancreatitis.local-complication-before-cholecystectomy.v1",
      "concept.cholecystectomy.subtotal-type-from-remnant-tissue.v1",
      "concept.diabetic-ketoacidosis.ongoing-insulin-substrate.v1",
      "concept.acid-base.euglycaemic-risk-with-mixed-gas.v1",
      "concept.anorectal-fistula.tract-and-transplant-host-plan.v1",
      "concept.anorectal-fistula.function-before-low-tract-division.v1",
      "concept.nutrition.gastric-versus-postpyloric-delivery.v1",
      "concept.predictive-value.collection-population-denominator.v1",
      "concept.palpable-breast.completed-imaging-clinical-target.v1",
      "concept.phpt.inherited-calcium-before-localization.v2",
        // Flags3: the separately scored, manager-accepted anatomical objective.
        "concept.groin-hernia.ultrasound-compartment-classification.v1",
      "concept.gs028f.nutrition.refeeding-insulin-phosphate-shift.v2",
      "concept.n3.delayed-regurgitation-proximal-anatomic-study",
    ]);
  });

  it("freezes one approved HCC presentation profile without changing the authored case", () => {
    const caseId = "case.hcc.milan.solitary-within";
    let state = emptyLevelOne("hcc-approved-profile");
    state = gameReducer(state, {
      type: "ADMIT_PATIENT",
      operationId: "hcc-profile-admission",
      encounterId: "encounter.hcc-profile-admission",
      caseId,
      patientDisplayName: "Profile Test Patient",
      arrivalClass: "routine",
    });

    const frozen =
      state.encounters["encounter.hcc-profile-admission"]?.frozenCase;
    expect(frozen).toMatchObject({
      id: caseId,
      releasePointId: "release.l0.clinic_evaluation",
    });
    expect(frozen?.selectedInstantiationProfileId).toMatch(
      /^profile\.hcc\.milan\.solitary-within\./,
    );
    const selected = frozen?.approvedInstantiationProfiles?.find(
      (profile) => profile.id === frozen.selectedInstantiationProfileId,
    );
    expect(selected).toBeDefined();
    expect(frozen?.prototypeDemographics?.ageYears).toBe(
      selected?.prototypeDemographics?.ageYears,
    );
    if (selected?.prototypeDemographics?.sexLabel === "Not specified") {
      expect(frozen?.prototypeDemographics?.sexLabel).toMatch(/^(Female|Male)$/);
    } else {
      expect(frozen?.prototypeDemographics?.sexLabel).toBe(
        selected?.prototypeDemographics?.sexLabel,
      );
    }
    expect(frozen?.presentation).toBe(selected?.presentation);

    const authored = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases.find(
      (clinicalCase) => clinicalCase.id === caseId,
    );
    expect(authored?.selectedInstantiationProfileId).toBeUndefined();

    const restored = deserializeGameState(serializeGameState(state));
    expect(
      restored.encounters["encounter.hcc-profile-admission"]?.frozenCase,
    ).toEqual(frozen);
  });

  it("freezes coherent display demographics, names, and roster identity for representative admissions", () => {
    const cases = PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease.cases;
    const representativeIds = [
      "case.fhh.evaluation-to-confirmed-management",
      "case.fhh.suggestive-results-confirmation",
      "case.pancreatic-tail-adenocarcinoma.clinic-counseling",
      "case.choledochal-cyst.type-iva.2a",
      "case.anal-hsil.hpv.3d",
      cases.find((clinicalCase) =>
        clinicalCase.prototypeDemographics?.sexLabel === "Not specified",
      )?.id,
      cases.find((clinicalCase) =>
        clinicalCase.prototypeDemographics?.sexLabel === "Female",
      )?.id,
      cases.find((clinicalCase) =>
        clinicalCase.prototypeDemographics?.sexLabel === "Male",
      )?.id,
    ];
    expect(representativeIds.every((caseId) => typeof caseId === "string")).toBe(true);
    const permissiveContext = {
      ...PROTOTYPE_DOMAIN_CONTEXT,
      clinicalRelease: {
        ...PROTOTYPE_DOMAIN_CONTEXT.clinicalRelease,
        cases: cases.map((clinicalCase) => ({
          ...clinicalCase,
          earliestFacilityStage: 0,
          requiredCapabilityIds: [],
        })),
      },
    };
    let state = createInitialGameState(permissiveContext, {
      campaignId: "campaign.identity-admission",
      campaignSeed: "identity-admission",
      createdAtRealMs: 0,
    });
    state.encounters = {};
    state.openChartEncounterId = null;
    state.attendedEncounterId = null;
    state.facilityLevel = 2;
    state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
    const admittedDemographics = new Map<string, { ageYears: number; sexLabel: string }>();
    for (const [index, caseId] of representativeIds.entries()) {
      const encounterId = `encounter.identity-admission.${index}`;
      state.encounters = {};
      state = gameReducer(state, {
        type: "ADMIT_PATIENT",
        operationId: `identity-admission.${index}`,
        encounterId,
        caseId: caseId!,
        patientDisplayName: `Explicit Identity ${index}`,
        arrivalClass: "routine",
      }, permissiveContext);
      expect(state.operationReceipts[`identity-admission.${index}`]?.status).toBe("applied");
      const encounter = state.encounters[encounterId]!;
      expect(encounter.patientDisplayName).toBe(`Explicit Identity ${index}`);
      expect(encounter.frozenCase.prototypeDemographics?.sexLabel).toMatch(/^(Female|Male)$/);
      const rosterIdentity = patientRosterEntryById(encounter.patientAppearance.patientIdentityId);
      expect(rosterIdentity?.compatibleSexLabel).toBe(
        encounter.frozenCase.prototypeDemographics?.sexLabel,
      );
      expect(rosterIdentity?.ageBand).toBe(
        patientVisualAgeBand(encounter.frozenCase.prototypeDemographics?.ageYears),
      );
      admittedDemographics.set(caseId!, encounter.frozenCase.prototypeDemographics!);
    }
    expect(admittedDemographics.get("case.fhh.evaluation-to-confirmed-management")?.ageYears).toBe(27);
    const youngAdultAge = admittedDemographics.get("case.fhh.suggestive-results-confirmation")?.ageYears;
    expect(youngAdultAge).toBeGreaterThanOrEqual(18);
    expect(youngAdultAge).toBeLessThanOrEqual(29);
    expect(admittedDemographics.get("case.pancreatic-tail-adenocarcinoma.clinic-counseling")?.ageYears).toBeGreaterThanOrEqual(65);
    const choledochalAge = admittedDemographics.get("case.choledochal-cyst.type-iva.2a")?.ageYears;
    expect(choledochalAge).toBeGreaterThanOrEqual(45);
    expect(choledochalAge).toBeLessThanOrEqual(64);
    expect(admittedDemographics.get("case.anal-hsil.hpv.3d")?.sexLabel).toBe("Female");
    const restored = deserializeGameState(serializeGameState(state), permissiveContext);
    expect(restored.encounters).toEqual(state.encounters);
  });
});
