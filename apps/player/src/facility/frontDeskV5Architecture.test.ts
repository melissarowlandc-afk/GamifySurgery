import { describe, expect, it } from "vitest";

import {
  getFrontDeskV5ArchitectureComponents,
  getFrontDeskV5Projection,
  projectFrontDeskV5LogicalPoint,
  shouldRenderFrontDeskV5Architecture,
} from "./frontDeskV5Architecture";

describe("Front Desk v5 architecture projection", () => {
  const logical = { x: 100, y: 200, width: 250, height: 200 };

  it("keeps the full logical five-by-four rectangle as its square-tile floor", () => {
    const projection = getFrontDeskV5Projection(logical);
    expect(projection.logicalBounds).toBe(logical);
    expect(projection.floorBounds).toEqual(logical);
    expect(projection.scaleX).toBe(50);
    expect(projection.scaleY).toBe(50);
  });

  it("anchors the full visual floor and its south entrance to the logical rectangle", () => {
    const projection = getFrontDeskV5Projection(logical);
    expect(projection.southEntranceY).toBe(400);
    expect(projection.floorBounds.y + projection.floorBounds.height).toBe(400);
    expect(projectFrontDeskV5LogicalPoint(projection, { x: 2.5, y: 4 })).toEqual({
      x: 225,
      y: 400,
    });
  });

  it("builds straight, visually closed wall runs when no live door exists", () => {
    const projection = getFrontDeskV5Projection(logical);
    const components = getFrontDeskV5ArchitectureComponents(projection);
    const base = components.filter((component) => component.layer === "base");
    const byKey = (key: string) => base.find((component) => component.key === key)!;
    const floor = projection.floorBounds;
    const north = byKey("north-wall-0").bounds;
    const west = byKey("west-return-0").bounds;
    const east = byKey("east-return-0").bounds;
    const front = byKey("front-0-base").bounds;

    expect(west.x + west.width / 2).toBe(floor.x);
    expect(east.x + east.width / 2).toBe(floor.x + floor.width);
    expect(north).toMatchObject({ x: floor.x, width: floor.width });
    expect(front).toMatchObject({ x: floor.x, width: floor.width });
  });

  it("cuts an aperture only at each supplied live door slot", () => {
    const projection = getFrontDeskV5Projection(logical);
    const components = getFrontDeskV5ArchitectureComponents(projection, [
      { side: "north", offset: 2 },
      { side: "south", offset: 2 },
      { side: "west", offset: 1 },
      { side: "east", offset: 2 },
    ]).filter((component) => component.layer === "base");
    const north = components.filter((component) => component.key.startsWith("north-wall-"));
    const south = components.filter((component) => component.key.startsWith("front-") && component.key.endsWith("-base"));
    const west = components.filter((component) => /^west-return-\d+$/.test(component.key));
    const east = components.filter((component) => /^east-return-\d+$/.test(component.key));
    expect(north).toHaveLength(2);
    expect(south).toHaveLength(2);
    expect(west).toHaveLength(2);
    expect(east).toHaveLength(2);
    expect(north[0]!.bounds.x + north[0]!.bounds.width).toBeLessThan(north[1]!.bounds.x);
    expect(south[0]!.bounds.x + south[0]!.bounds.width).toBeLessThan(south[1]!.bounds.x);
  });

  it("uses low in-footprint front art for backed north segments", () => {
    const projection = getFrontDeskV5Projection(logical);
    const components = getFrontDeskV5ArchitectureComponents(
      projection,
      [],
      [{ offset: 1, length: 3 }],
    ).filter((component) => component.layer === "base");
    const floor = projection.floorBounds;
    const short = components.filter((component) => component.key.startsWith("north-short-"));
    expect(short).toHaveLength(1);
    expect(short[0]!.frameId).toBe("frontEast");
    expect(short[0]!.bounds.y).toBe(floor.y);
    expect(short[0]!.bounds.height).toBeLessThan(
      components.find((component) => component.key === "north-wall-0")!.bounds.height,
    );
  });

  it("repeats only low south architecture as foreground occlusion", () => {
    const projection = getFrontDeskV5Projection(logical);
    const occluders = getFrontDeskV5ArchitectureComponents(projection)
      .filter((component) => component.layer === "front-occluder");
    expect(occluders.map((component) => component.frameId)).toEqual(["frontWest"]);
    expect(occluders.every((component) => component.bounds.y >= projection.floorBounds.y)).toBe(true);
    // The shared shell uses a constant tile-relative front lip, so a Front
    // Desk's restored fourth row does not make the foreground wall taller.
    expect(occluders[0]!.bounds.height).toBeCloseTo(projection.scaleX * 0.4411764705882353, 8);
  });

  it("keeps v5 architecture active when Front Desk shares a designed horizontal opening", () => {
    expect(shouldRenderFrontDeskV5Architecture("room.front_desk", true, false)).toBe(true);
    expect(shouldRenderFrontDeskV5Architecture("room.front_desk", true, true)).toBe(true);
    expect(shouldRenderFrontDeskV5Architecture("room.front_desk", false, true)).toBe(false);
    expect(shouldRenderFrontDeskV5Architecture("room.examination", true, true)).toBe(false);
  });
});
