import { describe, expect, it } from "vitest";
import { resolveApprovedRoomActorSupports } from "./approvedRoomPresentation";

describe("Training Room employee furniture contacts", () => {
  it("uses both approved stools with separate north-facing seat and floor contacts", () => {
    const supports = resolveApprovedRoomActorSupports("room.training", 0);
    expect(supports.map(({ id, role, pose, facing }) => [id, role, pose, facing])).toEqual([
      ["stool1", "training-employee", "seated", "north"],
      ["stool2", "training-employee", "seated", "north"],
    ]);
    expect(supports[0]?.seat.x).toBeCloseTo(1.05);
    expect(supports[1]?.seat.x).toBeCloseTo(1.95);
    for (const support of supports) {
      expect(support.fixtureGround.y).toBeCloseTo(1.7);
      expect(support.seat.y).toBeLessThan(support.fixtureGround.y);
    }
  });
});
