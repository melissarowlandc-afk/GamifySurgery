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
    expect(frontDesk?.navigation?.waitingAnchors).toEqual([
      { x: 1, y: 3 },
      { x: 3, y: 3 },
    ]);
    expect(frontDesk?.navigation?.staffAnchor).toEqual({ x: 2, y: 1 });
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
