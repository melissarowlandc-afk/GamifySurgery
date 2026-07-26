import { describe, expect, it } from "vitest";
import type { FacilityRoomView } from "./types";
import {
  getWaitingPatientQueueIndices,
  getWaitingPatientRoomLocations,
} from "./patientPlacement";

const WAITING_ROOM: FacilityRoomView = {
  instanceId: "room.waiting.alpha",
  definitionId: "room.waiting",
  displayName: "Waiting Room",
  tileX: 4,
  tileY: 2,
  width: 4,
  height: 3,
  isFounderRoom: false,
};

describe("waiting-patient room placement", () => {
  it("keeps patients on the sidewalk when no waiting room exists", () => {
    expect(
      getWaitingPatientRoomLocations(["encounter.a"], []),
    ).toEqual(new Map());
  });

  it("assigns stable, non-overlapping positions inside a built waiting room", () => {
    const first = getWaitingPatientRoomLocations(
      ["encounter.c", "encounter.a", "encounter.b"],
      [WAITING_ROOM],
    );
    const reordered = getWaitingPatientRoomLocations(
      ["encounter.b", "encounter.c", "encounter.a"],
      [WAITING_ROOM],
    );

    expect([...reordered.entries()]).toEqual([...first.entries()]);
    expect(
      new Set([...first.values()].map(({ x, y }) => `${x},${y}`)).size,
    ).toBe(3);
    for (const location of first.values()) {
      expect(location.x).toBeGreaterThanOrEqual(WAITING_ROOM.tileX);
      expect(location.x).toBeLessThan(
        WAITING_ROOM.tileX + WAITING_ROOM.width,
      );
      expect(location.y).toBeGreaterThanOrEqual(WAITING_ROOM.tileY);
      expect(location.y).toBeLessThan(
        WAITING_ROOM.tileY + WAITING_ROOM.height,
      );
    }
  });

  it("leaves waiting-room overflow unmapped instead of overlapping occupants", () => {
    const patientIds = Array.from(
      { length: 14 },
      (_, index) => `encounter.${String(index).padStart(2, "0")}`,
    );
    const locations = getWaitingPatientRoomLocations(
      patientIds,
      [WAITING_ROOM],
    );

    expect(locations.size).toBe(12);
    expect(
      new Set(
        [...locations.values()].map(({ x, y }) => `${x},${y}`),
      ).size,
    ).toBe(12);
  });

  it("derives sidewalk positions only from stable waiting-patient IDs", () => {
    const first = getWaitingPatientQueueIndices([
      "encounter.waiting.c",
      "encounter.waiting.a",
      "encounter.waiting.b",
    ]);
    const reordered = getWaitingPatientQueueIndices([
      "encounter.waiting.b",
      "encounter.waiting.c",
      "encounter.waiting.a",
    ]);

    expect([...reordered.entries()]).toEqual([...first.entries()]);
    expect(first.get("encounter.waiting.a")).toBe(0);
    expect(first.get("encounter.waiting.b")).toBe(1);
    expect(first.get("encounter.waiting.c")).toBe(2);
  });
});
