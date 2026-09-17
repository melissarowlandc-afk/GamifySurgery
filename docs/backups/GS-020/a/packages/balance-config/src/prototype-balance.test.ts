import { describe, expect, it } from "vitest";
import {
  LEVEL_TWO_ROOM_DEFINITION_IDS,
  LEVEL_TWO_STAFF_ROLE_IDS,
  PROTOTYPE_BALANCE_RELEASE,
} from "./prototype-balance";
import { serviceRouteDefinitionSchema } from "./schema";

describe("row 57 off-site functional-study services", () => {
  it("keeps every displayed study off-site with equal editorial prototype timing", () => {
    const services = [
      "service.hs.heat-damaged-rbc-scintigraphy",
      "service.hs.sulfur-colloid-scintigraphy",
      "service.hs.noncontrast-abdominal-ct",
    ].map((id) =>
      PROTOTYPE_BALANCE_RELEASE.services.find((service) => service.id === id),
    );

    expect(services).toHaveLength(3);
    expect(services.every((service) => Boolean(service?.routes))).toBe(true);
    expect(
      services.map((service) => service!.routes[0]!.durationTicks),
    ).toEqual([120, 120, 120]);
    expect(
      services.flatMap((service) => service!.routes).every(
        (route) => route.requiredCapabilityId === null && route.requiredCapabilityIds.length === 0,
      ),
    ).toBe(true);
  });
});

describe("Front Desk A1-D5 navigation", () => {
  it("blocks only A1, A5, and C3 while preserving the two counter flanks", () => {
    const frontDesk = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(
      (definition) => definition.id === "room.front_desk",
    );
    expect(frontDesk?.navigation?.blockedTiles).toEqual([
      { x: 0, y: 0 },
      { x: 4, y: 0 },
      { x: 2, y: 2 },
    ]);
    expect(frontDesk?.navigation?.primaryAnchor).toEqual({ x: 2, y: 3 });
    expect(frontDesk?.navigation?.waitingAnchors).toEqual([{ x: 4, y: 3 }]);
    expect(frontDesk?.navigation?.staffAnchor).toEqual({ x: 2, y: 1 });
  });
});

describe("fresh campaign construction funding", () => {
  it("starts with only the Front Desk while retaining the existing examination-room price", () => {
    expect(PROTOTYPE_BALANCE_RELEASE.facility.initialRooms).toEqual([
      expect.objectContaining({
        id: "room.instance.founder_desk",
        roomDefinitionId: "room.front_desk",
      }),
    ]);
    expect(
      PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(
        (definition) => definition.id === "room.examination",
      )?.constructionCost,
    ).toBe(160);
    expect(PROTOTYPE_BALANCE_RELEASE.facility.startingCash).toBe(120);
  });
});

describe("Level 2 expanded outpatient definitions", () => {
  it("defines the authored eight-hour Level 2 EUS/ERCP return and equivalent offsite alternatives", () => {
    const eus = PROTOTYPE_BALANCE_RELEASE.services.find(
      (service) => service.id === "service.endoscopy.eus-ercp-sampling",
    )?.routes[0];
    expect(eus).toMatchObject({ id: "route.endoscopy.eus-ercp-sampling.in_house", durationTicks: 480, requiredCapabilityId: "capability.endoscopy" });
    expect(eus?.timingPhases).toEqual([
      { id: "phase.eus-ercp.preparation", durationTicks: 30, resourceBound: true },
      { id: "phase.eus-ercp.procedure", durationTicks: 45, resourceBound: true },
      { id: "phase.eus-ercp.recovery", durationTicks: 45, resourceBound: true },
      { id: "phase.eus-ercp.processing", durationTicks: 360, resourceBound: false },
    ]);
    for (const serviceId of ["service.interventional-radiology.percutaneous-transhepatic-biopsy", "service.imaging.pet-ct", "service.imaging.repeat-mri-mrcp", "service.laboratory.repeat-ca19-9"]) {
      expect(PROTOTYPE_BALANCE_RELEASE.services.find((service) => service.id === serviceId)?.routes[0]?.durationTicks).toBe(480);
    }
  });
  it("unlocks the accepted rooms, staff, capabilities, and locked Level 3 preview", () => {
    const facility = PROTOTYPE_BALANCE_RELEASE.facility;
    const rooms = facility.roomDefinitions.filter((definition) =>
      LEVEL_TWO_ROOM_DEFINITION_IDS.includes(
        definition.id as (typeof LEVEL_TWO_ROOM_DEFINITION_IDS)[number],
      ),
    );
    const staff = facility.staffRoleDefinitions.filter((definition) =>
      LEVEL_TWO_STAFF_ROLE_IDS.includes(
        definition.id as (typeof LEVEL_TWO_STAFF_ROLE_IDS)[number],
      ),
    );

    expect(facility.maximumPlayableLevel).toBe(2);
    expect(rooms.map((room) => room.id)).toEqual(LEVEL_TWO_ROOM_DEFINITION_IDS);
    expect(staff.map((role) => role.id)).toEqual(LEVEL_TWO_STAFF_ROLE_IDS);
    expect(rooms.every((room) => room.unlockFacilityLevel === 2)).toBe(true);
    expect(staff.every((role) => role.unlockFacilityLevel === 2)).toBe(true);
    expect(
      Object.fromEntries(
        rooms.map((room) => [
          room.id,
          [
            room.constructionCost,
            room.upkeepPerExpenseInterval,
            `${room.width}x${room.height}`,
          ],
        ]),
      ),
    ).toEqual({
      "room.ultrasound": [950, 16, "3x3"],
      "room.ct": [1600, 26, "4x4"],
      "room.phlebotomy": [550, 9, "3x2"],
      "room.evs_closet": [475, 6, "2x2"],
      "room.endoscopy": [1450, 24, "4x3"],
      "room.periop_recovery": [900, 16, "4x3"],
      "room.training": [650, 8, "3x3"],
      "room.coffee_kiosk": [500, 5, "2x2"],
      "room.glp1_telehealth_suite": [1200, 12, "3x2"],
    });
    expect(
      Object.fromEntries(
        staff.map((role) => [
          role.id,
          [
            role.hiringCost,
            role.salaryPerExpenseInterval,
            role.maximumEmployees,
          ],
        ]),
      ),
    ).toEqual({
      "staff.periop_nurse": [450, 34, 2],
      "staff.endoscopy_nurse": [500, 36, 2],
      "staff.endoscopist": [900, 60, 2],
      "staff.phlebotomist": [350, 28, 2],
      "staff.evs_worker": [280, 24, 2],
      "staff.glp1_np": [600, 40, 5],
    });
    expect(
      rooms.find((room) => room.id === "room.endoscopy")?.capabilityIds,
    ).toEqual([]);
    expect(
      rooms.find((room) => room.id === "room.periop_recovery")?.capabilityIds,
    ).toContain("capability.periop_recovery");
    for (const id of ["room.ultrasound", "room.ct"]) {
      expect(
        rooms.find((room) => room.id === id)?.requiredRoomDefinitionIds,
      ).toEqual(["room.imaging_control"]);
    }

    expect(facility.stageDefinitions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ level: 1, nextFacilityLevel: 2 }),
        expect.objectContaining({
          level: 2,
          minimumClinicalXp: 300,
          satisfactionMustBeGreaterThan: 90,
          requiredRoomDefinitionIds: ["room.endoscopy", "room.periop_recovery"],
          requiredStaffRoleIds: [
            "staff.periop_nurse",
            "staff.endoscopy_nurse",
            "staff.endoscopist",
          ],
          nextFacilityLevel: null,
        }),
      ]),
    );
  });
});

describe("service-route timing invariants", () => {
  it("rejects frozen phase definitions whose total differs from their ETA", () => {
    const parsed = serviceRouteDefinitionSchema.safeParse({
      id: "route.test.mismatched-phases",
      displayName: "Mismatched route fixture",
      durationTicks: 120,
      requiredCapabilityId: null,
      preference: 0,
      timingPhases: [
        { id: "phase.test.one", durationTicks: 30, resourceBound: true },
        { id: "phase.test.two", durationTicks: 45, resourceBound: false },
      ],
    });
    expect(parsed.success).toBe(false);
    if (!parsed.success) {
      expect(parsed.error.issues[0]?.message).toBe(
        "Nonempty route timing phases must sum exactly to durationTicks.",
      );
    }
  });
});

describe("owner-delegated batch external services", () => {
  it("provides only honest external routes with centralized editorial timing", () => {
    const expected = {
      "service.colonoscopy": ["route.colonoscopy.outsourced", 300],
      "service.upper_endoscopy_duodenal_biopsy": ["route.upper_endoscopy_duodenal_biopsy.outsourced", 300],
      "service.extremity_mri": ["route.extremity_mri.outsourced", 180],
    } as const;
    for (const [serviceId, [routeId, durationTicks]] of Object.entries(expected)) {
      const service = PROTOTYPE_BALANCE_RELEASE.services.find((item) => item.id === serviceId);
      expect(service?.routes).toHaveLength(1);
      expect(service?.routes[0]).toMatchObject({ id: routeId, durationTicks, requiredCapabilityId: null, requiredCapabilityIds: [] });
      expect(service?.routes[0]?.displayName).toContain("Off-site");
    }
  });
});

describe("surgery-center external service contracts", () => {
  it("keeps the four new services external without facility or provider requirements", () => {
    const expected = {
      "service.thyroid_fna": ["route.thyroid_fna.outsourced", 180],
      "service.anoscopy": ["route.anoscopy.outsourced", 90],
      "service.esophageal_manometry": ["route.esophageal_manometry.outsourced", 180],
      "service.skin_excisional_biopsy": ["route.skin_excisional_biopsy.outsourced", 180],
    } as const;
    for (const [serviceId, [routeId, durationTicks]] of Object.entries(expected)) {
      const service = PROTOTYPE_BALANCE_RELEASE.services.find((item) => item.id === serviceId);
      expect(service?.routes).toHaveLength(1);
      expect(service?.routes[0]).toMatchObject({
        id: routeId,
        durationTicks,
        requiredCapabilityId: null,
        requiredCapabilityIds: [],
        resourceRequirements: [],
        providerRequirement: null,
      });
    }
  });
});

describe("board-expansion external service contracts", () => {
  it("keeps seven new services external with matching editorial timing profiles", () => {
    const expected = {
      "service.dxa": ["route.dxa.outsourced", "timing.test.dxa", 180],
      "service.mrcp": ["route.mrcp.outsourced", "timing.test.mrcp", 180],
      "service.laryngeal_examination": ["route.laryngeal_examination.outsourced", "timing.test.laryngeal_examination", 180],
      "service.contrast_swallow": ["route.contrast_swallow.outsourced", "timing.test.contrast_swallow", 180],
      "service.resting_abi": ["route.resting_abi.outsourced", "timing.test.vascular_physiology", 90],
      "service.rectal_response_assessment": ["route.rectal_response_assessment.outsourced", "timing.test.rectal_response_assessment", 240],
      "service.carotid_cta": ["route.carotid_cta.outsourced", "timing.test.ct_angiography", 180],
    } as const;
    for (const [serviceId, [routeId, timingProfileId, durationTicks]] of Object.entries(expected)) {
      const service = PROTOTYPE_BALANCE_RELEASE.services.find((item) => item.id === serviceId);
      expect(service?.routes).toHaveLength(1);
      expect(service?.routes[0]).toMatchObject({ id: routeId, durationTicks, requiredCapabilityId: null, requiredCapabilityIds: [], resourceRequirements: [], providerRequirement: null });
      expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.find((profile) => profile.id === timingProfileId)).toMatchObject({ durationTicks });
    }
    expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.find((profile) => profile.id === "timing.test.ct_angiography")?.serviceId).toBeNull();
  });
});

describe("September 12 board-expansion external service contracts", () => {
  it("keeps nine new services external with matching dedicated timing profiles", () => {
    const expected = {
      "service.genetic_testing": ["route.genetic_testing.outsourced", null, 180],
      "service.pelvic_mri": ["route.pelvic_mri.outsourced", null, 180],
      "service.anal_lesion_biopsy_staging": ["route.anal_lesion_biopsy_staging.outsourced", "timing.test.biopsy_staging", 360],
      "service.venous_duplex": ["route.venous_duplex.outsourced", "timing.test.venous_duplex", 150],
      "service.hiv_hcv_serology": ["route.hiv_hcv_serology.outsourced", "timing.test.viral_serology", 60],
      "service.gist_eus_core_molecular": ["route.gist_eus_core_molecular.outsourced", "timing.test.gist_eus_core_molecular", 480],
      "service.liver_mri": ["route.liver_mri.outsourced", null, 180],
      "service.mesenteric_cta": ["route.mesenteric_cta.outsourced", "timing.test.mesenteric_cta", 180],
      "service.primary_aldosteronism_screen": ["route.primary_aldosteronism_screen.outsourced", "timing.test.primary_aldosteronism_screen", 60],
    } as const;
    for (const [serviceId, [routeId, timingProfileId, durationTicks]] of Object.entries(expected)) {
      const service = PROTOTYPE_BALANCE_RELEASE.services.find((item) => item.id === serviceId);
      expect(service?.routes).toHaveLength(1);
      expect(service?.routes[0]).toMatchObject({
        id: routeId,
        durationTicks,
        requiredCapabilityId: null,
        requiredCapabilityIds: [],
        resourceRequirements: [],
        providerRequirement: null,
      });
      if (timingProfileId !== null) {
        expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.find((profile) => profile.id === timingProfileId)).toMatchObject({ serviceId, durationTicks });
      }
    }
    expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.find((profile) => profile.id === "timing.test.bone_marrow")).toMatchObject({ durationTicks: 180, serviceId: null });
    expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.find((profile) => profile.id === "timing.test.adrenal_ct_avs")).toMatchObject({ durationTicks: 300, serviceId: null });
  });
});

describe("September 13 early-level external service contracts", () => {
  it("keeps four new services external with matching centralized timing", () => {
    const expected = {
      "service.hepatobiliary_contrast_mrcp": ["route.hepatobiliary_contrast_mrcp.outsourced", "timing.test.hepatobiliary_contrast_mrcp", 180],
      "service.ambulatory_reflux_monitoring": ["route.ambulatory_reflux_monitoring.outsourced", "timing.test.ambulatory_reflux_monitoring", 180],
      "service.tumor_mmr_ihc": ["route.tumor_mmr_ihc.outsourced", "timing.test.tumor_mmr_ihc", 120],
      "service.cutaneous_lesion_biopsy": ["route.cutaneous_lesion_biopsy.outsourced", "timing.test.cutaneous_lesion_biopsy", 180],
    } as const;
    for (const [serviceId, [routeId, timingProfileId, durationTicks]] of Object.entries(expected)) {
      const service=PROTOTYPE_BALANCE_RELEASE.services.find((item)=>item.id===serviceId);
      expect(service?.routes).toHaveLength(1);
      expect(service?.routes[0]).toMatchObject({id:routeId,durationTicks,requiredCapabilityId:null,requiredCapabilityIds:[],resourceRequirements:[],providerRequirement:null});
      expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.find((profile)=>profile.id===timingProfileId)).toMatchObject({serviceId,durationTicks});
    }
    for(const timingProfileId of ["timing.test.ercp","timing.test.therapeutic_ercp","timing.test.bile_leak_ercp","timing.test.pseudocyst_drainage","timing.test.microbiology","timing.test.skin_surgery_histology"]){
      expect(PROTOTYPE_BALANCE_RELEASE.answerChoiceTimingProfiles.find((profile)=>profile.id===timingProfileId)).toMatchObject({serviceId:null});
    }
  });
});

describe("Level 2 diagnostic route defaults", () => {
  it("keeps acquisition and external interpretation as explicit editorial phases", () => {
    const route = (serviceId: string, routeId: string) =>
      PROTOTYPE_BALANCE_RELEASE.services
        .find((service) => service.id === serviceId)
        ?.routes.find((candidate) => candidate.id === routeId);
    expect(route("service.ultrasound", "route.ultrasound.in_house")).toMatchObject({
      durationTicks: 75,
      timingPhases: [
        { id: "phase.ultrasound.acquisition", durationTicks: 45, resourceBound: true },
        { id: "phase.ultrasound.external_interpretation", durationTicks: 30, resourceBound: false },
      ],
    });
    expect(route("service.ct", "route.ct.in_house")).toMatchObject({
      durationTicks: 105,
      timingPhases: [
        { id: "phase.ct.acquisition", durationTicks: 60, resourceBound: true },
        { id: "phase.ct.external_interpretation", durationTicks: 45, resourceBound: false },
      ],
    });
    expect(route("service.ultrasound", "route.ultrasound.outsourced")?.durationTicks).toBe(150);
    expect(route("service.ct", "route.ct.outsourced")?.durationTicks).toBe(180);
  });
});

describe("endoscopy return timing", () => {
  it("reserves clinical resources for the original phases and leaves editorial return/report time non-resource-bound", () => {
    const route = PROTOTYPE_BALANCE_RELEASE.services
      .find((service) => service.id === "service.endoscopy")
      ?.routes.find((candidate) => candidate.id === "route.endoscopy.in_house");
    expect(route).toMatchObject({ durationTicks: 180, requiredCapabilityId: "capability.endoscopy" });
    expect(route?.timingPhases).toEqual([
      { id: "phase.endoscopy.preparation", durationTicks: 30, resourceBound: true },
      { id: "phase.endoscopy.procedure", durationTicks: 45, resourceBound: true },
      { id: "phase.endoscopy.recovery", durationTicks: 45, resourceBound: true },
      { id: "phase.endoscopy.return_and_report", durationTicks: 60, resourceBound: false },
    ]);
  });
});
