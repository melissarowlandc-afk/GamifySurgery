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
      "room.examination": 20,
      "room.bathroom": 10,
      "room.waiting": 5,
      "room.minor_procedure": 5,
      "room.phlebotomy": 3,
      "room.evs_closet": 10,
      "room.endoscopy": 5,
      "room.periop_recovery": 3,
      "room.training": 1,
      "room.coffee_kiosk": 10,
      "room.glp1_telehealth_suite": 5,
      "room.ultrasound": 1,
      "room.xray": 1,
      "room.ct": 1,
      "room.reading": 4,
      "room.mri": 1,
      "room.pediatric_waiting": 2,
      "room.pediatric_examination": 4,
      "room.wound_ostomy": 2,
    });
  });
});
