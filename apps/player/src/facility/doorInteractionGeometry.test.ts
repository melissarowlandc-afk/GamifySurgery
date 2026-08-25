import { describe, expect, it } from "vitest";
import {
  containsDoorInteractionPoint,
  getDoorInteractionGeometry,
} from "./doorInteractionGeometry";

const room = { x: 100, y: 80, width: 96, height: 64 };

describe("door interaction geometry", () => {
  it("extends an exposed north-wall target into the visible cutaway face", () => {
    const geometry = getDoorInteractionGeometry({
      room,
      side: "north",
      offset: 1,
      tileSize: 32,
      exposedNorthWall: true,
      northWallHeight: 24,
    });

    expect(geometry.hitRegion.y).toBeLessThan(room.y);
    expect(geometry.hitRegion.y + geometry.hitRegion.height).toBe(room.y);
    expect(
      containsDoorInteractionPoint(geometry, {
        x: 148,
        y: 68,
      }),
    ).toBe(true);
  });

  it("keeps an internal north-wall target centered on the floor boundary", () => {
    const geometry = getDoorInteractionGeometry({
      room,
      side: "north",
      offset: 0,
      tileSize: 32,
      exposedNorthWall: false,
      northWallHeight: 24,
    });

    expect(geometry.center.y).toBe(room.y);
    expect(
      containsDoorInteractionPoint(geometry, {
        x: 116,
        y: room.y + 2,
      }),
    ).toBe(true);
  });

  it("creates a vertical hit target for an east-wall door", () => {
    const geometry = getDoorInteractionGeometry({
      room,
      side: "east",
      offset: 1,
      tileSize: 32,
      exposedNorthWall: false,
      northWallHeight: 24,
    });

    expect(geometry.horizontal).toBe(false);
    expect(geometry.center).toEqual({ x: 196, y: 128 });
    expect(
      containsDoorInteractionPoint(geometry, {
        x: 194,
        y: 128,
      }),
    ).toBe(true);
  });
});
