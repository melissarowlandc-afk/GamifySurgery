import { ROOM_UPGRADE_CATALOG } from "@gamify-surgery/balance-config";
import { getRoomDefinition } from "@gamify-surgery/game-domain";
import { describe, expect, it, vi } from "vitest";

vi.mock("phaser", () => ({ default: {
  Scene: class { constructor(_config?: unknown) {} },
  BlendModes: { MULTIPLY: "multiply", SCREEN: "screen" },
} }));

import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";
import type { FacilityRoomView } from "./types";

const currentRooms = ROOM_UPGRADE_CATALOG.filter((definition) =>
  definition.status === "current" && definition.upgradeCosts.length > 0,
);
type Draw = readonly unknown[];

function graphics(draws: Draw[]) {
  const sink: Record<string, unknown> = new Proxy({}, {
    get: (_target, method) => (...args: unknown[]) => {
      draws.push([String(method), ...args]);
      return sink;
    },
  });
  return sink;
}

function roomView(definitionId: string, upgradeLevel: number): FacilityRoomView {
  const definition = getRoomDefinition(definitionId);
  return {
    instanceId: "room.appearance.probe", definitionId, displayName: definition?.displayName ?? "Future office",
    tileX: 10, tileY: 10, width: definition?.width ?? 4, height: definition?.height ?? 4,
    orientation: 0, isFounderRoom: false, upgradeLevel,
  } as FacilityRoomView;
}

function renderer(room: FacilityRoomView, fallback = false) {
  const draws: Draw[] = [];
  const bridge = { viewModel: { rooms: [room], doors: [], staff: [], patients: [], founder: null }, onPlaceRoom: () => false } as unknown as FacilitySceneBridge;
  const scene = new FacilityScene(bridge) as any;
  const sink = graphics(draws);
  scene.layout = { originX: 0, originY: 0, tileSize: 32, width: 640, height: 640 };
  scene.getSortableGraphics = () => sink;
  scene.textures = { exists: () => true };
  // Keep the real fixture/record selection and positioning; replace only GPU
  // image/graphics output and atlas registration in this headless probe.
  scene.registerApprovedRoomFrame = (record: { id: string }) => record.id;
  scene.ensureApprovedSideChairTextures = () => null;
  scene.drawTouchupTintedTop = (...args: unknown[]) => draws.push(["tinted-top", ...args]);
  scene.add = { image: (...args: unknown[]) => {
    draws.push(["image", ...args]);
    const image: Record<string, unknown> = {};
    for (const method of ["setTexture", "setOrigin", "setPosition", "setDisplaySize", "setDepth", "setVisible", "setData"]) {
      image[method] = (...values: unknown[]) => { draws.push([method, ...values]); return image; };
    }
    return image;
  } };
  scene.drawAuthoredFixture = (...args: unknown[]) => { draws.push(["authored-fixture", ...args]); return true; };
  scene.drawPixelFrameSized = (_target: unknown, ...args: unknown[]) => draws.push(["wall-fixture", ...args]);
  scene.drawExaminationRoomV3ArchitectureArt = (...args: unknown[]) => draws.push(["exam-art", ...args]);
  if (fallback) scene.drawApprovedRoomFixtures = () => false;
  return { scene, sink, draws, rectangle: { x: 100, y: 100, width: room.width * 32, height: room.height * 32 } };
}

function fixtureDraws(definitionId: string, level: number, fallback = false): Draw[] {
  const room = roomView(definitionId, level);
  const { scene, sink, draws, rectangle } = renderer(room, fallback);
  scene.drawRoomFixtures(sink, room, rectangle, 5);
  return draws;
}

describe("catalog room upgrade appearance in the actual renderer", () => {
  it.each(currentRooms)("does not paint upgraded finishes for $roomDefinitionId", ({ roomDefinitionId }) => {
    for (const level of [1, 2, 3, 5]) {
      const room = roomView(roomDefinitionId, level);
      const { scene, sink, draws, rectangle } = renderer(room);
      scene.drawRoomUpgradeFinish(sink, room, rectangle);
      expect(draws).toEqual([]);
    }
  });

  it.each(currentRooms)("keeps nonempty base fixture draws identical at Level 5 for $roomDefinitionId", ({ roomDefinitionId }) => {
    const baseline = fixtureDraws(roomDefinitionId, 1);
    expect(baseline.length).toBeGreaterThan(0);
    expect(fixtureDraws(roomDefinitionId, 5)).toEqual(baseline);
  });

  it.each(["room.periop_recovery", "room.glp1_telehealth_suite", "room.minor_procedure"])(
    "also retains the actual fallback composition for %s", (definitionId) => {
      const baseline = fixtureDraws(definitionId, 1, true);
      expect(baseline.some((draw) => draw[0] === "authored-fixture")).toBe(true);
      expect(fixtureDraws(definitionId, 5, true)).toEqual(baseline);
    },
  );

  it("honors the declared future Founder Office appearance exception without offering a room", () => {
    expect(getRoomDefinition("room.founder_office")).toBeNull();
    const base = roomView("room.founder_office", 1);
    const first = renderer(base);
    first.scene.drawRoomUpgradeFinish(first.sink, base, first.rectangle);
    expect(first.draws).toEqual([]);
    const upgraded = roomView("room.founder_office", 5);
    const final = renderer(upgraded);
    final.scene.drawRoomUpgradeFinish(final.sink, upgraded, final.rectangle);
    expect(final.draws.some((draw) => draw[0] === "strokeRect")).toBe(true);
    expect(fixtureDraws("room.founder_office", 5, true).length).toBeGreaterThan(fixtureDraws("room.founder_office", 1, true).length);
  });
});
