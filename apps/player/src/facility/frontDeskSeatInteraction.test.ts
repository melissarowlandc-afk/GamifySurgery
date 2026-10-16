import { describe, expect, it, vi } from "vitest";

vi.mock("phaser", () => ({
  default: { Scene: class { constructor(_config?: unknown) {} } },
}));

import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";

function sceneHarness(onSeatFounderInChair?: (roomInstanceId: string, location: { x: number; y: number }) => boolean) {
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
      founderChairs: [
        {
          roomInstanceId: "room.instance.waiting",
          location: { x: 3, y: 2 },
        },
      ],
      staff: [],
    },
    onPlaceRoom: () => false,
    onSeatFounderInChair,
  } as unknown as FacilitySceneBridge;
  const scene = new FacilityScene(bridge) as unknown as {
    layout: Record<string, number>;
    canRenderFrontDeskV5Architecture(): boolean;
    frontDeskSeatInteractionAtPointer(pointer: { x: number; y: number }): boolean;
    ordinaryChairAtPointer(pointer: { x: number; y: number }): unknown;
    fixtureBitmapImages: Map<string, unknown>;
    handlePointerDown(pointer: { button: number; x: number; y: number }): void;
    handlePointerMove(pointer: { x: number; y: number }): void;
    handlePointerUp(pointer: { x: number; y: number }): void;
    applyCamera(): void;
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
  scene.applyCamera = () => {};
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

  it("accepts the exact bounds of both approved painted Front Desk targets", () => {
    const scene = sceneHarness();
    const image = (drawId: string, bounds: Record<string, number>) => ({
      visible: true,
      getBounds: () => bounds,
      getData: (key: string) => key === "approved-draw-id" ? drawId : undefined,
    });
    scene.fixtureBitmapImages.set(
      "approved:room.instance.founder_desk:0:desk:0",
      image("desk", { left: 510, right: 570, top: 170, bottom: 205 }),
    );
    scene.fixtureBitmapImages.set(
      "approved:room.instance.founder_desk:0:receptionist-chair:1",
      image("receptionist-chair", { left: 445, right: 475, top: 205, bottom: 260 }),
    );
    expect(scene.frontDeskSeatInteractionAtPointer({ x: 540, y: 187.5 })).toBe(true);
    expect(scene.frontDeskSeatInteractionAtPointer({ x: 460, y: 232.5 })).toBe(true);
  });

  it("does not turn unrelated Front Desk floor into a seating click", () => {
    const scene = sceneHarness();
    expect(scene.frontDeskSeatInteractionAtPointer({ x: 580, y: 300 })).toBe(false);
    expect(scene.frontDeskSeatInteractionAtPointer({ x: 350, y: 220 })).toBe(false);
  });

  it("uses the domain-projected chair list instead of treating open floor as a chair", () => {
    const scene = sceneHarness();
    expect(scene.ordinaryChairAtPointer({ x: 140, y: 100 })).toEqual({
      roomInstanceId: "room.instance.waiting",
      location: { x: 3, y: 2 },
    });
    expect(scene.ordinaryChairAtPointer({ x: 180, y: 100 })).toBeNull();
  });

  it("dispatches an ordinary chair only after a completed click, never while panning", () => {
    const seatFounder = vi.fn(() => true);
    const scene = sceneHarness(seatFounder);
    const chair = { x: 140, y: 100 };

    scene.handlePointerDown({ button: 0, ...chair });
    expect(seatFounder).not.toHaveBeenCalled();
    scene.handlePointerUp(chair);
    expect(seatFounder).toHaveBeenCalledTimes(1);
    expect(seatFounder).toHaveBeenLastCalledWith("room.instance.waiting", { x: 3, y: 2 });

    scene.handlePointerDown({ button: 0, x: 20, y: 20 });
    scene.handlePointerMove(chair);
    scene.handlePointerUp(chair);
    expect(seatFounder).toHaveBeenCalledTimes(1);
  });
});
