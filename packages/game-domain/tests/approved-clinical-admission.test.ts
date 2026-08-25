import { describe, expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  deserializeGameState,
  gameReducer,
  getEligibleServiceRoute,
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
        serviceDurationTicks: 60,
        durationTicks: 60,
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
      x: 20,
      y: 20,
      orientation: 0,
      doorSide: null,
      upgradeLevel: 1,
      cleanliness: 100,
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

  it("keeps the active runtime release limited to reviewed concepts", () => {
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
    expect(frozen?.prototypeDemographics).toEqual(
      selected?.prototypeDemographics,
    );
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
});
