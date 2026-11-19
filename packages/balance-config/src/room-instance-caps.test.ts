import { describe, expect, it } from "vitest";
import { PROTOTYPE_BALANCE_RELEASE } from "./prototype-balance";

describe("owner-approved room instance caps", () => {
  it("publishes the explicit build limits while keeping hallways unlimited", () => {
    const limits = Object.fromEntries(
      PROTOTYPE_BALANCE_RELEASE.facility.roomDefinitions.map((room) => [room.id, room.maximumInstances]),
    );
    expect(limits).toMatchObject({
      "room.front_desk": 1,
      "room.hallway": null,
      "room.examination": 10,
      "room.bathroom": 6,
      "room.waiting": 3,
      "room.minor_procedure": 3,
      "room.phlebotomy": 3,
      "room.evs_closet": 6,
      "room.endoscopy": 6,
      "room.periop_recovery": 4,
      "room.training": 1,
      "room.coffee_kiosk": 5,
      "room.glp1_telehealth_suite": 5,
      "room.ultrasound": 2,
      "room.xray": 2,
      "room.ct": 2,
      "room.ambulatory_or": 4,
      "room.laboratory": 1,
      "room.pharmacy": 2,
      "room.maintenance_workshop": 1,
      "room.staff_break": 3,
      "room.surgeon_office": 4,
      "room.vending": 5,
      "room.reading": 4,
      "room.mri": 1,
      "room.pediatric_waiting": 2,
      "room.pediatric_examination": 4,
      "room.wound_ostomy": 2,
      "room.founder_office": 1,
      "room.executive_office": 1,
      "room.gift_shop": 2,
      "room.indoor_garden": 4,
      "room.staff_gym": 1,
    });
  });
});
