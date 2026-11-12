import { describe, expect, it, vi } from "vitest";
import { createInitialGameState, gameReducer, getRoomDefinition, PROTOTYPE_DOMAIN_CONTEXT,
  type GameState, type GridPoint } from "@gamify-surgery/game-domain";
import { previewMobileDoor, previewMobileHallway, previewMobilePlacement } from "./buildSession";
import { phoneDoorSections } from "./doorSections";
import { createPrototypePlayerView } from "../../session/viewModels";
import { FacilityScene } from "../../facility/FacilityScene";
import type { FacilitySceneBridge } from "../../facility/FacilityScene";
import { rasterizeGridLine } from "../../facility/hallwayPainting";
import { PhoneBuildMapInput } from "./mapInput";
import type { MobileBuildMapState } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));

function fixture() {
  const state = createInitialGameState(); state.facilityLevel = 3; state.cash = 10_000; state.cashCents = 1_000_000; state.encounters = {};
  return state;
}

describe("phone ghosts use unchanged desktop command rules", () => {
  it.each(["room.examination", "room.waiting", "room.bathroom", "room.xray", "room.reading"])("validity, reason and cost parity for many %s positions", definitionId => {
    const state = fixture(); const original = JSON.stringify(state);
    const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
    const positions = [-2, -1, 0, 1, 7, 15, 27, 31, 33, 47, 63, facility.gridWidth, facility.gridWidth + 1];
    for (const x of positions) for (const y of [-1, 0, 7, 23, 26, 28, 31, facility.gridHeight]) {
      const operationId = "desktop.test.place";
      const next = gameReducer(state, { type: "PLACE_ROOM", operationId, roomId: "room.desktop.test", roomDefinitionId: definitionId, x, y, orientation: 0 });
      const receipt = next.operationReceipts[operationId]!;
      expect(previewMobilePlacement(state, definitionId, null, x, y)).toEqual({
        valid: receipt.status === "applied", reason: receipt.status === "applied" ? null : receipt.message,
        cost: receipt.status === "applied" ? state.cash - next.cash : 0,
      });
    }
    expect(JSON.stringify(state)).toBe(original);
  });
  it("keeps cash, capacity, dependencies and unlock failures, and normalizes only the existing approved orientations", () => {
    const state = fixture(); state.cash = 0;
    expect(previewMobilePlacement(state, "room.waiting", null, 0, 0).reason).toContain("cash");
    state.cash = 10_000; state.facilityLevel = 0;
    expect(previewMobilePlacement(state, "room.ct", null, 0, 0).reason).toContain("unlocks");
    expect(previewMobilePlacement(state, "room.front_desk", null, 0, 0).valid).toBe(false);
    const fixed = previewMobilePlacement(state, "room.examination", null, 0, 0, 90);
    const direct = gameReducer(state, { type: "PLACE_ROOM", operationId: "fixed", roomId: "fixed-room", roomDefinitionId: "room.examination", x: 0, y: 0, orientation: 0 });
    expect(fixed.valid).toBe(direct.operationReceipts.fixed!.status === "applied");
  });
  it("move ghosts exclude their own original footprint and preserve occupancy, protected-room and overlap guards", () => {
    const state = fixture(); state.rooms.push({ id: "mobile.move", roomDefinitionId: "room.waiting", x: 3, y: 3,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    for (const [x, y] of [[3, 3], [0, 0], [-1, 3], [33, 28], [80, 50]] as const) {
      const next = gameReducer(state, { type: "MOVE_ROOM", operationId: "desktop.move", roomId: "mobile.move", x, y });
      const receipt = next.operationReceipts["desktop.move"]!;
      expect(previewMobilePlacement(state, "room.waiting", "mobile.move", x, y)).toEqual({
        valid: receipt.status === "applied", reason: receipt.status === "applied" ? null : receipt.message, cost: 0,
      });
    }
    expect(previewMobilePlacement(state, "room.waiting", "mobile.move", 3, 3).valid).toBe(true);
    const front = state.rooms.find(room => room.roomDefinitionId === "room.front_desk")!;
    expect(previewMobilePlacement(state, front.roomDefinitionId, front.id, 0, 0).reason).toContain("anchored");
    state.environment.founderLocation = { x: 4, y: 4 };
    expect(previewMobilePlacement(state, "room.waiting", "mobile.move", 9, 9).reason).toContain("clear this room");
  });
});

/** Run the original flag-off scene's actual paint method and per-cell command. */
function desktopPaint(initial: GameState, samples: readonly GridPoint[]) {
  let state = initial; const accepted: GridPoint[] = [];
  const scene = Object.create(FacilityScene.prototype) as {
    bridge: FacilitySceneBridge; layout: { originX: number; originY: number; tileSize: number; sidewalkTop: number; sidewalkHeight: number };
    hallwayPaintLastPoint: GridPoint | null; hallwayPaintVisitedTiles: Set<string>; hallwayPaintBlocked: boolean;
    paintHallwayToPointer: (point: unknown) => void; drawPlacementGhost: () => void; setInteractionHint: () => void;
  };
  const project = () => createPrototypePlayerView(state, null, false, "room.hallway", true).facility;
  scene.bridge = { mobileInput: false, viewModel: project(), onPlaceRoom: (x, y) => {
    const operationId = `desktop.paint.${accepted.length}`;
    const next = gameReducer(state, { type: "PLACE_ROOM", operationId, roomId: `room.desktop.${accepted.length}`,
      roomDefinitionId: "room.hallway", x, y, orientation: 0 });
    const applied = next.operationReceipts[operationId]!.status === "applied";
    state = next; scene.bridge.viewModel = project(); if (applied) accepted.push({ x, y });
    return applied;
  } };
  scene.layout = { originX: 0, originY: 0, tileSize: 20, sidewalkTop: 640, sidewalkHeight: 20 };
  scene.hallwayPaintLastPoint = null; scene.hallwayPaintVisitedTiles = new Set(); scene.hallwayPaintBlocked = false;
  scene.drawPlacementGhost = () => {}; scene.setInteractionHint = () => {};
  for (const point of samples) scene.paintHallwayToPointer({ x: point.x * 20 + 10, y: point.y * 20 + 10 });
  return { state, accepted };
}

describe("hallway preview versus actual unchanged desktop cell painting", () => {
  it.each(["clear", "cross existing", "occupied", "cash stops", "diagonal"])("identical accepted cells and cost: %s", kind => {
    const state = fixture();
    if (kind === "cash stops") { state.cash = getRoomDefinition("room.hallway")!.constructionCost * 2; state.cashCents = state.cash * 100; }
    if (kind === "cross existing") state.rooms.push({ id: "old.hall", roomDefinitionId: "room.hallway", x: 2, y: 2, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    if (kind === "occupied") state.rooms.push({ id: "obstacle", roomDefinitionId: "room.waiting", x: 4, y: 2, orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const samples = kind === "diagonal" ? [{ x: 1, y: 1 }, { x: 6, y: 4 }] : [{ x: 1, y: 2 }, { x: 8, y: 2 }];
    const points = rasterizeGridLine(samples[0]!, samples[1]!);
    const original = JSON.stringify(state);
    const preview = previewMobileHallway(state, [...points, ...points.slice().reverse()]);
    const desktop = desktopPaint(state, samples);
    expect(preview.buildCells).toEqual(desktop.accepted);
    expect(preview.cost).toBe(state.cash - desktop.state.cash);
    expect(JSON.stringify(state)).toBe(original);
    if (kind === "occupied" || kind === "cash stops") expect(preview.reason).toBeTruthy();
  });
  it("bounds invalid cells, skips repeated cells, and never builds beyond a blocked cell", () => {
    const state = fixture();
    const preview = previewMobileHallway(state, [{ x: 1, y: 1 }, { x: 1, y: 1 }, { x: -1, y: 1 }, { x: 4, y: 1 }]);
    expect(preview.buildCells).toEqual([{ x: 1, y: 1 }]); expect(preview.cells).toHaveLength(2);
    expect(preview.reason).toContain("fit");
  });
  it("matches desktop painting when the finger leaves and re-enters the site", () => {
    const state = fixture(); const model = createPrototypePlayerView(state, null, false, "room.hallway", true).facility;
    let cells: readonly GridPoint[] = [];
    const map: MobileBuildMapState = { ghost: null, initialGhost: null, hallway: { cells: [], buildCells: [], cost: 0, reason: null },
      doors: [], selectedDoorId: null, onIntent: intent => { if (intent.kind === "hallway") cells = intent.cells; } };
    const input = new PhoneBuildMapInput(() => map, () => ({ originX: 0, originY: 0, tileSize: 20,
      columns: model.gridColumns, rows: model.gridRows }), () => null);
    const samples = [{ x: -1, y: 1 }, { x: 1, y: 1 }, { x: model.gridColumns + 5, y: 1 }, { x: 4, y: 1 }, { x: -1, y: -1 }, { x: 4, y: 3 }];
    samples.forEach((point, index) => {
      const finger = { x: point.x * 20 + 10, y: point.y * 20 + 10 };
      if (index === 0) input.down(1, finger, 0); else input.move(1, finger);
    });
    const preview = previewMobileHallway(state, cells); const desktop = desktopPaint(state, samples);
    expect(preview.buildCells).toEqual(desktop.accepted); expect(preview.cost).toBe(state.cash - desktop.state.cash);
  });
});

describe("one-tile door sections, reciprocal walls and command guards", () => {
  it("legal sections match PLACE_DOOR; illegal and immutable sections retain exact reasons", () => {
    const state = fixture();
    const front = state.rooms.find(room => room.roomDefinitionId === "room.front_desk")!;
    state.rooms.push({ id: "door.exam", roomDefinitionId: "room.examination", x: front.x, y: front.y - 2,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    const model = createPrototypePlayerView(state, null, false, null, true, "door.exam").facility;
    const sections = phoneDoorSections(model, { previewDoor: request => previewMobileDoor(state, request) });
    expect(sections.some(section => section.validation.valid)).toBe(true);
    expect(new Set(sections.map(section => section.id)).size).toBe(sections.length);
    for (const section of sections) {
      const request = section.request; const operationId = "desktop.door";
      const next = gameReducer(state, request.kind === "add"
        ? { type: "PLACE_DOOR", operationId, doorId: "test.door", roomId: request.roomId, side: request.side, offset: request.offset }
        : { type: "REMOVE_DOOR", operationId, doorId: request.doorId });
      const receipt = next.operationReceipts[operationId]!;
      expect(section.validation).toEqual({ valid: receipt.status === "applied", reason: receipt.status === "applied" ? null : receipt.message, cost: 0 });
    }
    const exterior = sections.find(section => section.request.kind === "remove")!;
    expect(exterior.validation).toMatchObject({ valid: false, reason: "The public Front Desk entrance cannot be removed." });
    expect(sections.some(section => section.validation.reason?.includes("furniture"))).toBe(true);
  });
});
