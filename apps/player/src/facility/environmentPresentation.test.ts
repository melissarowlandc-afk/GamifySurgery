import { describe, expect, it } from "vitest";

import {
  getCleanlinessWearSeverity,
  getEnvironmentalInteraction,
} from "./environmentPresentation";
import type { FacilityViewModel } from "./types";

function model(): FacilityViewModel {
  return {
    facilityTitle: "Test Clinic",
    facilityTick: 0,
    paused: false,
    simulationSpeed: 1,
    realMillisecondsPerFacilityMinuteAt1x: 1_000,
    patientTravelTilesPerFacilityMinute: 4,
    gridColumns: 10,
    gridRows: 10,
    patientCounts: {
      waiting: 0,
      active: 0,
      actionReady: 0,
      resolved: 0,
    },
    founder: {
      displayName: "Founder",
      appearance: {
        version: "pixel-avatar.v1",
        bodyShape: "average",
        hairStyle: "short",
        skinTone: 1,
        hairShade: 1,
        faceStyle: "round",
        outfitStyle: "plain",
        outfitShade: 1,
        accessory: "none",
        headVariant: 0,
        bodyVariant: 0,
        roleStyle: "founder",
      },
    },
    rooms: [],
    staff: [
      {
        instanceId: "employee.one",
        displayName: "Jamie",
        roleDisplayName: "Receptionist",
        homeRoomInstanceId: null,
        location: { x: 3, y: 3 },
      },
    ],
    litterItems: [
      {
        instanceId: "litter.one",
        roomInstanceId: "room.one",
        location: { x: 1, y: 1 },
      },
    ],
    waterCooler: {
      location: { x: 2, y: 2 },
      fillPercent: 10,
      needsRefill: true,
    },
    placement: null,
  };
}

describe("environment presentation", () => {
  it("makes litter, water, and staff map interactions discoverable", () => {
    const view = model();

    expect(getEnvironmentalInteraction(view, { x: 1, y: 1 })).toMatchObject({
      kind: "litter",
      id: "litter.one",
      label: "CLICK TO CLEAN LITTER",
    });
    expect(getEnvironmentalInteraction(view, { x: 2, y: 2 })).toMatchObject({
      kind: "water_cooler",
      actionable: true,
      label: "CLICK TO REFILL WATER COOLER",
    });
    expect(getEnvironmentalInteraction(view, { x: 3, y: 3 })).toMatchObject({
      kind: "employee",
      id: "employee.one",
      label: "CLICK TO PRAISE JAMIE",
    });
    expect(getEnvironmentalInteraction(view, { x: 9, y: 9 })).toBeNull();
  });

  it("shows restrained wear only below the cleanliness threshold", () => {
    expect(getCleanlinessWearSeverity(undefined)).toBe(0);
    expect(getCleanlinessWearSeverity(70)).toBe(0);
    expect(getCleanlinessWearSeverity(35)).toBeCloseTo(0.5);
    expect(getCleanlinessWearSeverity(0)).toBe(1);
  });
});
