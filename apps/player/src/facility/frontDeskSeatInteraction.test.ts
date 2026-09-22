import { describe, expect, it, vi } from "vitest";

vi.mock("phaser", () => ({
  default: { Scene: class { constructor(_config?: unknown) {} } },
}));

import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";

function sceneHarness() {
  const bridge = {
    viewModel: {
      rooms: [
        {
          instanceId: "room.instance.founder_desk",
          definitionId: "room.front_desk",
          displayName: "Front Desk",
          tileX: 10,
          tileY: 4,
          width: 5,
          height: 4,
          orientation: 0,
          isFounderRoom: true,
        },
      ],
    },
    onPlaceRoom: () => false,
  } as unknown as FacilitySceneBridge;
  const scene = new FacilityScene(bridge) as unknown as {
    layout: Record<string, number>;
    canRenderFrontDeskV5Architecture(): boolean;
    frontDeskSeatInteractionAtPointer(pointer: { x: number; y: number }): boolean;
  };
  scene.layout = {
    originX: 0,
    originY: 0,
    tileSize: 40,
    width: 800,
    height: 500,
    sidewalkTop: 480,
    sidewalkHeight: 40,
  };
  scene.canRenderFrontDeskV5Architecture = () => true;
  return scene;
}

describe("Front Desk rendered seating interaction", () => {
  it("accepts the displayed counter and secretary-chair envelopes", () => {
    const scene = sceneHarness();
    // Room bounds are x=400..600, y=160..320. These points are inside the
    // declarative display envelopes used by the actual fixture renderer.
    expect(scene.frontDeskSeatInteractionAtPointer({ x: 480, y: 260 })).toBe(true);
    expect(scene.frontDeskSeatInteractionAtPointer({ x: 480, y: 230 })).toBe(true);
  });

  it("does not turn unrelated Front Desk floor into a seating click", () => {
    const scene = sceneHarness();
    expect(scene.frontDeskSeatInteractionAtPointer({ x: 580, y: 300 })).toBe(false);
    expect(scene.frontDeskSeatInteractionAtPointer({ x: 350, y: 220 })).toBe(false);
  });
});
