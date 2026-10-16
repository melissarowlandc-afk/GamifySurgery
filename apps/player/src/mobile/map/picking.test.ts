import { describe, expect, it } from "vitest";
import { nearestTouchTarget } from "./picking";

describe("CSS-pixel nearest touch picking", () => {
  it.each([0.1, 1, 2.5])("keeps a 22px minimum radius around a tiny target at zoom %f", (zoom) => {
    const target = { value: "character", bounds: { x: 100, y: 100, width: 10 * zoom, height: 20 * zoom } };
    expect(nearestTouchTarget({ x: 78, y: 101 }, [target])).toBe("character");
    expect(nearestTouchTarget({ x: 77.9, y: 101 }, [target])).toBeNull();
  });
  it("picks the nearest rendered envelope, then nearest center, with front-most depth breaking exact ties", () => {
    const left = { value: "left", bounds: { x: 90, y: 90, width: 10, height: 10 } };
    const right = { value: "right", bounds: { x: 110, y: 90, width: 10, height: 10 } };
    expect(nearestTouchTarget({ x: 109, y: 95 }, [left, right])).toBe("right");
    expect(nearestTouchTarget({ x: 95, y: 95 }, [{ ...left, value: "rear", depth: 1 }, { ...left, value: "front", depth: 2 }])).toBe("front");
  });
  it("picks chair contact points, room footprints, and door segments without inflating world geometry", () => {
    expect(nearestTouchTarget({ x: 121, y: 100 }, [{ value: "chair", bounds: { x: 100, y: 100, width: 0, height: 0 } }])).toBe("chair");
    expect(nearestTouchTarget({ x: 40, y: 50 }, [{ value: "room", bounds: { x: 50, y: 50, width: 80, height: 100 } }])).toBe("room");
    expect(nearestTouchTarget({ x: 110, y: 100 }, [{ value: "door", bounds: { x: 90, y: 98, width: 1, height: 4 } }])).toBe("door");
    expect(nearestTouchTarget({ x: 10, y: 10 }, [])).toBeNull();
  });
});
