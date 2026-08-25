import { describe, expect, it } from "vitest";

import { getFacilityWorldSignature } from "./facilityWorldSignature";
import type { FacilityViewModel } from "./types";

const APPEARANCE = {
  version: "pixel-avatar.v1" as const,
  bodyShape: "average" as const,
  hairStyle: "short" as const,
  skinTone: 1 as const,
  hairShade: 2 as const,
  faceStyle: "round" as const,
  outfitStyle: "plain" as const,
  outfitShade: 1 as const,
  accessory: "none" as const,
  headVariant: 0 as const,
  bodyVariant: 0 as const,
  roleStyle: "founder" as const,
};

function model(): FacilityViewModel {
  return {
    facilityTitle: "Clinic",
    facilityTick: 10,
    paused: false,
    simulationSpeed: 1,
    realMillisecondsPerFacilityMinuteAt1x: 1_000,
    characterTravelTilesPerFacilityMinute: 2,
    gridColumns: 20,
    gridRows: 12,
    patientCounts: {
      waiting: 1,
      active: 0,
      actionReady: 0,
      resolved: 0,
    },
    founder: {
      displayName: "Founder",
      appearance: APPEARANCE,
      location: { x: 5, y: 5 },
    },
    patients: [
      {
        instanceId: "patient.1",
        displayName: "Patient",
        status: "waiting",
        appearance: { ...APPEARANCE, roleStyle: "patient" },
        location: { x: 4, y: 5 },
      },
    ],
    rooms: [
      {
        instanceId: "room.front",
        definitionId: "room.front_desk",
        displayName: "Front Desk",
        tileX: 4,
        tileY: 4,
        width: 4,
        height: 3,
        isFounderRoom: true,
      },
    ],
    staff: [
      {
        instanceId: "staff.1",
        displayName: "Robin",
        roleDisplayName: "Receptionist",
        homeRoomInstanceId: "room.front",
        appearance: { ...APPEARANCE, roleStyle: "receptionist" },
        location: { x: 6, y: 5 },
      },
    ],
    placement: null,
  };
}

describe("facility static-world signature", () => {
  it("does not invalidate for facility time or character-only changes", () => {
    const before = model();
    const after = structuredClone(before);
    after.facilityTick += 1;
    after.founder.location = { x: 6, y: 5 };
    after.patients![0]!.location = { x: 5, y: 5 };
    after.staff[0]!.location = { x: 7, y: 5 };
    after.patientCounts.waiting = 0;
    after.patientCounts.active = 1;

    expect(getFacilityWorldSignature(after)).toBe(
      getFacilityWorldSignature(before),
    );
  });

  it("invalidates for static geometry changes", () => {
    const before = model();
    const after = structuredClone(before);
    after.rooms[0]!.tileX += 1;

    expect(getFacilityWorldSignature(after)).not.toBe(
      getFacilityWorldSignature(before),
    );
  });
});
