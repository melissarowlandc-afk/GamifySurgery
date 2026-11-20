import { expect, it, vi } from "vitest";
import {
  applyGameEvidenceBuildUndo, applyGameEvidenceCommand, createGameEvidenceCheckpoint, type GameState,
} from "@gamify-surgery/game-domain";
import {
  apronHall, bridgeHall, examDoor, examRoom, frontDoor, type FixtureCommand,
} from "../../../../packages/game-domain/tests/paused-command-outage-fixtures";
import { PIXEL_PALETTE_NUMBER } from "../art/pixelPalette";
import { doorScene, projectFacility, seatHall, seatedClinic, syntheticRoom, waitingDoor, waitingRoom } from "./doorGeometryAcceptanceFixtures";
import { getDoorInteractionGeometry, type DoorInteractionGeometry } from "./doorInteractionGeometry";
import { getDoorPresentationOpenings, getDoorPresentationRun, type DoorPresentationOpening } from "./doorPresentation";
import { getRearWallFaceHeight, isHorizontalBoundarySegmentExposed } from "./roomCutaway";
import { isRoomVisualDoorSlotClear } from "./roomVisualLayout";
import type { FacilityDoorView, FacilityRoomView, FacilityViewModel } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {}, Textures: { FilterMode: { LINEAR: 0 } } } }));

type Scene = ReturnType<typeof doorScene>;
type Endpoints = Readonly<Record<string, string | null>>;
type Draw = [string, ...number[]];
type Slot = Pick<FacilityDoorView, "roomInstanceId" | "side" | "offset">;

const validEndpoints: Endpoints = {
  n1: "north", n2: "north", duplicate: "north", n4: "north", n5: "other",
  reciprocal: "hub", e1: "east", s2: "south", w0: "west", exterior: null,
};
const opposite = { north: "south", east: "west", south: "north", west: "east" } as const;
const horizontal = (side: Slot["side"]) => side === "north" || side === "south";
const invalidRed = 0xb3382c;

function cornerProjection(): FacilityViewModel {
  const model = projectFacility(seatedClinic().state);
  const door = (instanceId: string, side: Slot["side"], offset: number, fields: Partial<FacilityDoorView> = {}): FacilityDoorView =>
    ({ instanceId, roomInstanceId: "hub", side, offset, exterior: false, ...fields });
  return { ...model, patients: [], rooms: [
    syntheticRoom("hub", 10, 10, 8, 4),
    syntheticRoom("north", 11, 8, 4, 2),
    syntheticRoom("legacy-overlap", 11, 9),
    syntheticRoom("other", 15, 9, 2, 1),
    syntheticRoom("east", 18, 11, 2, 3),
    syntheticRoom("south", 11, 14, 3, 2),
    syntheticRoom("west", 8, 9, 2, 4),
    { ...syntheticRoom("preview", 25, 10, 3, 2), definitionId: "room.examination" },
    { ...syntheticRoom("preview.hall", 26, 12), definitionId: "room.hallway", kind: "hallway" },
  ], doors: [
    door("n1", "north", 1), door("n2", "north", 2), door("duplicate", "north", 2),
    door("n4", "north", 4), door("n5", "north", 5, { adjacentRoomInstanceId: "other" }),
    door("reciprocal", "south", 0, { roomInstanceId: "north" }),
    door("e1", "east", 1), door("s2", "south", 2), door("w0", "west", 0, { connectionValid: true }),
    door("exterior", "south", 7, { exterior: true, connectionValid: true, adjacentRoomInstanceId: null }),
    door("null-neighbor", "west", 1, { adjacentRoomInstanceId: null, connectionValid: true }),
    door("wrong-neighbor", "west", 2, { adjacentRoomInstanceId: "other" }),
    door("no-neighbor", "south", 0), door("invalid", "east", 2, { connectionValid: false }),
    door("high-offset", "east", 12), door("negative-offset", "west", -1), door("fractional-offset", "north", 1.7),
    door("wrong-exterior", "north", 0, { exterior: true }), door("unknown-source", "east", 0, { roomInstanceId: "missing" }),
  ], buildDoorSlots: [
    { id: "place", roomInstanceId: "preview", side: "south", offset: 1, enabled: true },
    { id: "disabled", roomInstanceId: "preview", side: "south", offset: 2, enabled: false },
  ] };
}

// The fixture names the destination (or exterior) of each connected slot.
// This oracle never asks the production resolver to choose a destination.
function referenceOpenings(model: FacilityViewModel, endpoints: Endpoints, room: FacilityRoomView): DoorPresentationOpening[] {
  const distinct = new Map<string, DoorPresentationOpening>();
  const add = (side: Slot["side"], offset: number) => distinct.set(`${side}:${offset}`, { side, offset });
  for (const door of model.doors!) {
    if (!Object.hasOwn(endpoints, door.instanceId)) continue;
    if (door.roomInstanceId === room.instanceId) add(door.side, door.offset);
    else if (endpoints[door.instanceId] === room.instanceId) {
      const source = model.rooms.find(candidate => candidate.instanceId === door.roomInstanceId)!;
      const shift = horizontal(door.side) ? source.tileX - room.tileX : source.tileY - room.tileY;
      add(opposite[door.side], door.offset + shift);
    }
  }
  return [...distinct.values()];
}

function slotGeometry(f: Scene, slot: Slot, room: FacilityRoomView) {
  const { originX, originY, tileSize } = f.scene.worldLayout;
  const offset = Math.min((horizontal(slot.side) ? room.width : room.height) - 1,
    Math.max(0, Number.isFinite(slot.offset) ? Math.floor(slot.offset) : 0));
  const rect = { x: originX + room.tileX * tileSize, y: originY + room.tileY * tileSize,
    width: room.width * tileSize, height: room.height * tileSize };
  return getDoorInteractionGeometry({
    room: rect, side: slot.side, offset, tileSize,
    exposedNorthWall: slot.side === "north" && isHorizontalBoundarySegmentExposed(room, f.bridge.viewModel.rooms, "north", offset),
    northWallHeight: getRearWallFaceHeight(rect.height, tileSize),
  });
}

function referenceMarker({ center: { x, y } }: DoorInteractionGeometry, tileSize: number): Draw[] {
  const size = Math.max(7, tileSize * 0.24);
  const arm = size * 0.55;
  return [
    ["fillStyle", 0xfaf1de, 1], ["fillRect", x - size, y - size, size * 2, size * 2],
    ["lineStyle", Math.max(2, tileSize * 0.06), invalidRed, 1], ["strokeRect", x - size, y - size, size * 2, size * 2],
    ["lineBetween", x - arm, y - arm, x + arm, y + arm], ["lineBetween", x + arm, y - arm, x - arm, y + arm],
  ];
}

function referenceHighlight(geometry: DoorInteractionGeometry, tileSize: number, place: boolean, invalid: boolean): Draw[] {
  const { x, y, width, height } = geometry.hitRegion;
  const { x: cx, y: cy } = geometry.center;
  const bar = Math.max(3, Math.min(9, tileSize * 0.22));
  const outer = invalid ? invalidRed : place ? PIXEL_PALETTE_NUMBER.highlight : PIXEL_PALETTE_NUMBER.ink;
  const inner = place ? PIXEL_PALETTE_NUMBER.ink : PIXEL_PALETTE_NUMBER.paper;
  return [
    ["fillStyle", outer, place ? 0.26 : 0.4], ["fillRect", x, y, width, height],
    ["lineStyle", 3, outer, 1], ["strokeRect", x, y, width, height],
    ["lineStyle", 1, inner, 1], ["strokeRect", x + 2, y + 2, Math.max(1, width - 4), Math.max(1, height - 4)],
    ["lineStyle", 2, inner, 1],
    geometry.horizontal ? ["lineBetween", cx - bar, cy, cx + bar, cy] : ["lineBetween", cx, cy - bar, cx, cy + bar],
  ];
}

function assertScene(f: Scene, endpoints: Endpoints) {
  const { scene, bridge: { viewModel: model } } = f;
  const tileSize = scene.worldLayout.tileSize as number;
  for (const room of model.rooms) {
    expect(scene.getRoomDoorOpenings(room), room.instanceId).toStrictEqual(referenceOpenings(model, endpoints, room));
  }
  const source = (slot: Slot) => model.rooms.find(room => room.instanceId === slot.roomInstanceId);
  const markers = Object.fromEntries(model.doors!.flatMap(door => {
    const room = source(door);
    return room && !Object.hasOwn(endpoints, door.instanceId)
      ? [[`invalid-door:${door.instanceId}`, referenceMarker(slotGeometry(f, door, room), tileSize)]]
      : [];
  }));
  const pixelCommands = new Set(["fillStyle", "fillRect", "lineStyle", "strokeRect", "lineBetween"]);
  const actualMarkers = Object.fromEntries(
    [...scene.roomFixtureGraphics as Map<string, { commandBuffer: Draw[] }>]
      .filter(([id]) => id.startsWith("invalid-door:"))
      .map(([id, object]) => [id, object.commandBuffer.filter(draw => pixelCommands.has(draw[0]))]),
  );
  expect(actualMarkers, "invalid door marker shapes and coordinates").toStrictEqual(markers);

  const targets: { kind: "place" | "remove"; id: string; geometry: DoorInteractionGeometry }[] = [];
  const highlights: Draw[][] = [];
  if (model.buildMode && model.buildDoorTool) {
    if (model.buildDoorTool === "place") for (const slot of model.buildDoorSlots ?? []) {
      const room = source(slot);
      if (!room || slot.enabled === false || !isRoomVisualDoorSlotClear({ ...room, ...slot })) continue;
      const geometry = slotGeometry(f, slot, room);
      targets.push({ kind: "place", id: slot.id, geometry });
      highlights.push(referenceHighlight(geometry, tileSize, true, false));
    }
    for (const door of model.doors!) {
      const room = source(door);
      if (!room || door.exterior) continue;
      const geometry = slotGeometry(f, door, room);
      targets.push({ kind: "remove", id: door.instanceId, geometry });
      highlights.push(referenceHighlight(geometry, tileSize, false, !Object.hasOwn(endpoints, door.instanceId)));
    }
  }
  expect(scene.getBuildDoorInteractionTargets().map((target: {
    kind: "place" | "remove"; slot?: { id: string }; door?: FacilityDoorView; geometry: DoorInteractionGeometry;
  }) => ({ kind: target.kind, id: target.slot?.id ?? target.door?.instanceId, geometry: target.geometry }))).toStrictEqual(targets);
  const commands = scene.architectureGraphics.commandBuffer as Draw[];
  const actualHighlights = commands.flatMap((draw, index) => draw[0] === "fillStyle"
    && commands[index + 1]?.[0] === "fillRect" && commands[index + 2]?.[0] === "lineStyle"
    && commands[index + 2]?.[1] === 3 && (draw[2] === 0.26 || draw[2] === 0.4)
    ? [commands.slice(index, index + 8)] : []);
  expect(actualHighlights, "ordered Build Doors highlight commands").toStrictEqual(highlights);
}

function gridSegments(f: Scene, axis: "x" | "y", tile: number) {
  const { originX, originY, tileSize } = f.scene.worldLayout;
  const fixed = axis === "x" ? originX + tile * tileSize : originY + tile * tileSize;
  const commands: Draw[] = [f.scene.worldGraphics, f.scene.architectureGraphics]
    .flatMap(graphics => graphics.commandBuffer as Draw[]);
  const start = commands.findIndex(draw =>
    draw[0] === "lineStyle" && draw[1] === 1 && draw[2] === PIXEL_PALETTE_NUMBER.ink && draw[3] === 0.48);
  expect(start, "Build grid stroke").toBeGreaterThanOrEqual(0);
  const segments: number[][] = [];
  for (const [name, x1, y1, x2, y2] of commands.slice(start + 1)) {
    if (name !== "lineBetween") break;
    if (axis === "x" && x1 === fixed && x2 === fixed) segments.push([(y1! - originY) / tileSize, (y2! - originY) / tileSize]);
    if (axis === "y" && y1 === fixed && y2 === fixed) segments.push([(x1! - originX) / tileSize, (x2! - originX) / tileSize]);
  }
  return segments;
}

it("control: exact openings, runs, invalid markers and Doors tool targets on legacy and current projections", () => {
  const model = cornerProjection();
  const expectedRuns: Readonly<Record<string, [number, number, string]>> = {
    n1: [1, 2, "north"], n2: [1, 2, "north"], duplicate: [1, 2, "north"],
    n4: [4, 4, "north"], n5: [5, 5, "other"], reciprocal: [0, 0, "hub"],
    e1: [1, 1, "east"], s2: [2, 2, "south"], w0: [0, 0, "west"],
  };
  for (const door of model.doors!) {
    const run = expectedRuns[door.instanceId];
    expect(getDoorPresentationRun(door, model.doors!, model.rooms), door.instanceId).toStrictEqual(run ? {
      startOffset: run[0], endOffset: run[1], destinationRoomInstanceId: run[2],
    } : undefined);
  }
  for (const room of model.rooms) {
    expect(getDoorPresentationOpenings(room, model.doors!, model.rooms)).toStrictEqual(referenceOpenings(model, validEndpoints, room));
  }

  const f = doorScene(model, true);
  assertScene(f, validEndpoints);
  for (const buildDoorTool of [null, "remove", "place"] as const) {
    f.frame({ ...model, buildMode: true, buildDoorTool });
    assertScene(f, validEndpoints);
  }
  const rooms = [...model.rooms];
  [rooms[1], rooms[2]] = [rooms[2]!, rooms[1]!];
  // The overlapping destination is now first. Most of the map is identical.
  f.frame({ ...f.bridge.viewModel, rooms });
  assertScene(f, { ...validEndpoints, n1: "legacy-overlap" });
  expect(getDoorPresentationRun(model.doors![0]!, model.doors!, rooms)).toStrictEqual({
    startOffset: 1, endOffset: 1, destinationRoomInstanceId: "legacy-overlap",
  });
});

it("B-021 refreshes visible cuts and markers when a missing projected neighbor becomes explicit null", () => {
  const model = { ...cornerProjection(), buildMode: true, buildDoorTool: "place" as const };
  const f = doorScene(model, true);
  assertScene(f, validEndpoints);
  expect(gridSegments(f, "x", 10)).toStrictEqual([[0, 10], [11, model.gridRows]]);
  const doors = model.doors!.map(door => door.instanceId === "w0" ? { ...door, adjacentRoomInstanceId: null } : door);
  const { w0: _removed, ...closed } = validEndpoints;
  f.frame({ ...model, doors });
  expect(f.scene.roomFixtureGraphics.has("invalid-door:w0"), "the next frame renders the new invalid door marker").toBe(true);
  assertScene(f, closed);
  expect(gridSegments(f, "x", 10)).toStrictEqual([[0, model.gridRows]]);
  f.frame({ ...model, doors: [...model.doors!] });
  assertScene(f, validEndpoints);
  expect(gridSegments(f, "x", 10)).toStrictEqual([[0, 10], [11, model.gridRows]]);
});

it("control: edits, Build Undo, and campaign replacement take effect on the next scene frame with the seat still rendered", () => {
  const { state } = seatedClinic();
  const model = (input: GameState) => projectFacility(input, true);
  const f = doorScene(model(state), true);
  const surviving = { "door.instance.front_entrance": null, [frontDoor]: bridgeHall, [waitingDoor]: seatHall(38) };
  const connected = { ...surviving, [examDoor]: apronHall };
  let checkpoint = createGameEvidenceCheckpoint(state), operation = 0;
  const apply = (input: FixtureCommand) => {
    const operationId = `public.geometry.edit.${++operation}`;
    const next = applyGameEvidenceCommand(checkpoint, { ...input, operationId });
    expect(next.state.operationReceipts[operationId]?.status).toBe("applied");
    checkpoint = next.checkpoint;
    return next.state;
  };
  const publish = (input: GameState, endpoints: Endpoints) => {
    f.frame(model(input));
    assertScene(f, endpoints);
    expect(gridSegments(f, "y", 26)).toStrictEqual(Object.hasOwn(endpoints, examDoor)
      ? [[0, 35], [36, 38], [39, 72]] : [[0, 38], [39, 72]]);
    const patient = f.bridge.viewModel.patients![0]!;
    expect(f.scene.debugCharacterGaitSnapshot()[`character:patient:${patient.instanceId}`]).toMatchObject({
      pose: "seated", visible: true, supportRole: "waiting-seat", supportRoomInstanceId: waitingRoom,
    });
  };
  publish(state, connected);
  publish(apply({ type: "REMOVE_DOOR", doorId: examDoor }), surviving);
  const reconnected = apply({ type: "PLACE_DOOR", doorId: examDoor, roomId: examRoom, side: "south", offset: 1 });
  publish(reconnected, connected);
  const moved = apply({ type: "MOVE_ROOM", roomId: examRoom, x: 30, y: 20 });
  publish(moved, surviving);
  const rotated = apply({ type: "ROTATE_ROOM", roomId: examRoom });
  expect(rotated.doors.find(door => door.id === examDoor)?.side).toBe("west");
  publish(rotated, surviving);
  const undo = applyGameEvidenceBuildUndo(checkpoint, moved, "public.geometry.undo");
  publish(undo.state, surviving);
  const undoMove = applyGameEvidenceBuildUndo(undo.checkpoint, reconnected, "public.geometry.undo-move");
  publish(undoMove.state, connected);
  // The replacement campaign reuses room/door IDs with a disconnected exam.
  const replacement = { ...structuredClone(moved), campaignId: "public.geometry.replacement" };
  expect(replacement.campaignId).not.toBe(state.campaignId);
  publish(replacement, surviving);
});
