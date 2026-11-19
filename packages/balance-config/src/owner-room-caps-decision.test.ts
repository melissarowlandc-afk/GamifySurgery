import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";

// D-2026-11-18-09, including the owner's amendment: "Peri-op 4, Break rooms 3".
// These expectations come from the decision, independently of the live catalog.
const ownerCaps = [
  ["room.waiting", 3],
  ["room.examination", 10],
  ["room.pediatric_waiting", 2],
  ["room.pediatric_examination", 4],
  ["room.bathroom", 6],
  ["room.phlebotomy", 3],
  ["room.laboratory", 1],
  ["room.reading", 4],
  ["room.minor_procedure", 3],
  ["room.periop_recovery", 4],
  ["room.evs_closet", 6],
  ["room.coffee_kiosk", 5],
  ["room.staff_break", 3],
  ["room.pharmacy", 2],
  ["room.wound_ostomy", 2],
  ["room.vending", 5],
  ["room.xray", 2],
  ["room.ultrasound", 2],
  ["room.ct", 2],
  ["room.endoscopy", 6],
  ["room.training", 1],
  ["room.glp1_telehealth_suite", 5],
  ["room.ambulatory_or", 4],
  ["room.maintenance_workshop", 1],
  ["room.surgeon_office", 4],
  ["room.mri", 1],
  ["room.founder_office", 1],
  ["room.executive_office", 1],
  ["room.gift_shop", 2],
  ["room.indoor_garden", 4],
  ["room.staff_gym", 1],
] as const;

describe("D-2026-11-18-09 owner room instance caps", () => {
  it.each(ownerCaps)("publishes %s's exact owner cap of %i", (id, maximum) => {
    const definition = PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(room => room.id === id);
    expect(definition, `The owner-named room ${id} must exist`).toBeDefined();
    expect(definition!.maximumInstances).toBe(maximum);
  });

  it.each([
    ["room.front_desk", 1],
    ["room.hallway", null],
    ["room.imaging_control", null],
  ] as const)("preserves the unchanged %s limit", (id, maximum) => {
    expect(PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.find(room => room.id === id)?.maximumInstances)
      .toBe(maximum);
  });
});
