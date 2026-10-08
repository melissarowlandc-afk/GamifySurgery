import { describe, expect, it, vi } from "vitest";
import {
  findDeterministicFacilityPath,
  createInitialGameState,
  getRoomDefinition,
  type CardinalDirection,
  type PixelAppearanceDescriptor,
  type PlacedRoom,
} from "@gamify-surgery/game-domain";
import { getApprovedDrawPainterGround, getApprovedSupportFacing } from "./approvedRoomRenderer";
import { resolveApprovedRoomActorSupports, resolveApprovedRoomDrawRecords } from "./approvedRoomPresentation";
import { getApprovedSideChairMask } from "./approvedSideChairLayers";
import { applyRoomTouchupsToRecords } from "./roomTouchups";
import { getPeriopCompanionChairForActor, resolvePeriopCompanionChairs } from "./periopCompanionPresentation";
import type { FacilityDoorView, FacilityRetailExternalActorView, FacilityRoomView } from "./types";
import { createPrototypePlayerView } from "../session/viewModels";

vi.mock("phaser", () => ({ default: { Scene: class {} } }));
import { FacilityScene, type FacilitySceneBridge } from "./FacilityScene";

const room: FacilityRoomView = {
  instanceId: "periop.qa", definitionId: "room.periop_recovery", displayName: "Peri-op",
  tileX: 38, tileY: 26, width: 6, height: 6, orientation: 0, isFounderRoom: false,
};
const seats = [
  ["companion.NW.north", 1, 0, "south", "north", 1],
  ["companion.NW.west", 0, 1, "east", "west", 1],
  ["companion.NE.north", 4, 0, "south", "north", 4],
  ["companion.NE.east", 5, 1, "west", "east", 1],
  ["companion.SW.west", 0, 4, "east", "west", 4],
  ["companion.SW.south", 1, 5, "north", "south", 1],
  ["companion.SE.east", 5, 4, "west", "east", 4],
  ["companion.SE.south", 4, 5, "north", "south", 4],
] as const;
const crops = {
  east: [8, 372, 311, 368], west: [8, 748, 315, 369],
  north: [8, 1104, 364, 336], south: [8, 1448, 385, 451],
};
const appearance: PixelAppearanceDescriptor = {
  version: "pixel-avatar.v1", bodyShape: "average", hairStyle: "short", skinTone: 1,
  hairShade: 2, faceStyle: "round", outfitStyle: "plain", outfitShade: 1,
  accessory: "none", headVariant: 0, bodyVariant: 0, roleStyle: "patient",
};
const doorway = (side: CardinalDirection, offset: number, roomId = room.instanceId): FacilityDoorView =>
  ({ instanceId: `door.${roomId}.${side}.${offset}`, roomInstanceId: roomId, side, offset, exterior: false });
const placedRoom = (view: FacilityRoomView): PlacedRoom => ({
  id: view.instanceId, roomDefinitionId: view.definitionId, x: view.tileX, y: view.tileY,
  orientation: view.orientation ?? 0, doorSide: null, upgradeLevel: 1,
});

function seatedActor(seatId = seats[0][0] as string): FacilityRetailExternalActorView {
  const chair = resolvePeriopCompanionChairs(room).find((candidate) => candidate.support.id === seatId)!;
  return {
    instanceId: seatId, actorKind: "companion", displayName: "QA companion", appearance,
    location: { ...chair.anchor }, moving: false,
    procedureCompanion: {
      phase: "waiting_in_periop", periopRoomInstanceId: room.instanceId,
      waitingReservation: { roomInstanceId: room.instanceId, location: { ...chair.anchor }, kind: "chair", seatId },
    },
  };
}

class DisplayObject {
  visible = true; depth = 0; x = 0; y = 0; displayWidth = 0; displayHeight = 0;
  texture = ""; frame: string | undefined;
  data = new Map<string, unknown>();
  setData(key: string, value: unknown) { this.data.set(key, value); return this; }
  getData(key: string) { return this.data.get(key); }
  setTexture(texture: string, frame?: string) { this.texture = texture; this.frame = frame; return this; }
  setOrigin(_x: number, _y: number) { return this; }
  setPosition(x: number, y: number) { this.x = x; this.y = y; return this; }
  setDisplaySize(width: number, height: number) { this.displayWidth = width; this.displayHeight = height; return this; }
  setDepth(depth: number) { this.depth = depth; return this; }
  setVisible(visible: boolean) { this.visible = visible; return this; }
  fillStyle() { return this; }
  fillRect() { return this; }
  lineStyle() { return this; }
  lineBetween() { return this; }
  destroy() { this.visible = false; }
  getByName(_name: string) { return { visible: true }; }
}

function harness() {
  const model = { rooms: [room], doors: [] as FacilityDoorView[], paused: false, buildMode: false };
  const scene = new FacilityScene({ viewModel: model } as FacilitySceneBridge) as any;
  scene.layout = { originX: 31, originY: 83, tileSize: 64 };
  scene.frameDeltaMilliseconds = 200;
  scene.add = { image: () => new DisplayObject() };
  scene.registerApprovedRoomFrame = (draw: { id: string }) => "full:" + draw.id;
  scene.ensureApprovedSideChairTextures = (mask: { id: string }) => ({ rear: mask.id + ":rear", foreground: mask.id + ":front" });
  scene.getApprovedSegmentState = () => ({ openDoorSegments: new Set(), backedNorthSegments: new Set(["N2", "N5"]) });
  scene.getTouchupRoomLighting = () => undefined;
  scene.drawTouchupSprite = () => undefined;
  scene.getSortableGraphics = () => new DisplayObject();
  scene.getCharacterGraphics = (key: string) => {
    if (!scene.characterGraphics.has(key)) scene.characterGraphics.set(key, new DisplayObject());
    return scene.characterGraphics.get(key);
  };
  scene.drawPixelPerson = vi.fn((_graphics, _x, baseY, _index, _appearance, _color, _direction, _pose, _right, _scale, representation) =>
    ({ baseY, representation: representation ?? "procedural" }));
  const draw = () => {
    scene.activeFixtureBitmapImages.clear();
    scene.drawApprovedRoomFixtures(room, scene.toPixels({ tileX: room.tileX, tileY: room.tileY, width: 6, height: 6 }));
    scene.removeInactiveFixtureBitmapImages();
  };
  return { scene, model, draw };
}

describe("peri-op companion chair rendering", () => {
  it("carries real domain reservations through the player view, including phase and arrival changes", () => {
    const state = createInitialGameState();
    state.rooms.push(placedRoom(room));
    const source = seatedActor();
    state.retailExternalActors = [{
      id: source.instanceId, kind: "companion", displayName: source.displayName, appearance,
      linkedServiceOperationId: null, linkedEncounterId: null, lifecycle: "onsite",
      location: source.location!, path: [source.location!], pathIndex: 0,
      lastMovedAtFacilityTick: 0, activeRetailOperationId: null,
      procedureCompanion: { ...source.procedureCompanion!, version: "procedure-companion.v1",
        amenityDecisionPhaseIndex: null, amenityRoomInstanceId: null, amenityDwellEndsAtFacilityTick: null },
    }];
    const actorView = () => createPrototypePlayerView(state, null, false, null).facility.retailExternalActors![0]!;
    const chairs = resolvePeriopCompanionChairs(room);
    expect(actorView().procedureCompanion).toEqual(state.retailExternalActors[0]!.procedureCompanion);
    expect(getPeriopCompanionChairForActor(actorView(), chairs)?.support.id).toBe(source.instanceId);
    state.retailExternalActors[0]!.path = [{ x: 39, y: 27 }, source.location!];
    state.retailExternalActors[0]!.location = { x: 39, y: 27 };
    expect(getPeriopCompanionChairForActor(actorView(), chairs)).toBeUndefined();
    state.retailExternalActors[0]!.pathIndex = 1;
    state.retailExternalActors[0]!.location = source.location!;
    expect(getPeriopCompanionChairForActor(actorView(), chairs)?.support.id).toBe(source.instanceId);
    state.retailExternalActors[0]!.procedureCompanion!.phase = "leaving_with_patient";
    expect(getPeriopCompanionChairForActor(actorView(), chairs)).toBeUndefined();
    delete state.retailExternalActors[0]!.procedureCompanion;
    expect(actorView().procedureCompanion).toBeUndefined();
  });

  it("describes all eight approved crops, scale, floor envelopes and seat-contact offsets", () => {
    const chairs = resolvePeriopCompanionChairs(room);
    expect(chairs.map((chair) => chair.support.id)).toEqual(seats.map((seat) => seat[0]));
    expect(new Set(chairs.map((chair) => chair.mask.id)).size).toBe(8);
    seats.forEach(([id, x, y, facing], index) => {
      const chair = chairs[index]!;
      expect(chair.anchor).toEqual({ x: 38 + x, y: 26 + y });
      expect(chair.draw.sourceRect).toEqual(crops[facing]);
      expect(chair.draw.assetId).toBe(`gs015:waiting:${facing === "east" || facing === "west" ? "south" : "west"}`);
      expect(chair.draw.footprint).toEqual({ left: x + .15, top: y + .15, width: .7, height: .7 });
      expect(chair.support).toMatchObject({ id, role: "periop-companion-seat", pose: "seated", facing,
        sideChairLayer: { drawId: id, maskId: chair.mask.id } });
      const orientation = facing === "east" || facing === "west" ? 0 : 270;
      const reference = resolveApprovedRoomActorSupports("room.waiting", orientation)
        .find((support) => support.facing === facing && support.id.startsWith(facing === "east" || facing === "north" ? "leftChair" : "rightChair"))!;
      const mask = getApprovedSideChairMask("room.waiting", orientation, reference.id)!;
      const draw = resolveApprovedRoomDrawRecords("room.waiting", orientation).find((candidate) => candidate.id === mask.drawId)!;
      expect(chair.draw.renderSizeTiles).toEqual(draw.renderSizeTiles);
      expect(chair.draw.sourceFloorContact).toEqual(draw.sourceFloorContact);
      expect(chair.mask.southArmPolygon).toEqual(mask.southArmPolygon);
      expect(chair.mask.additionalForegroundPolygons).toEqual(mask.additionalForegroundPolygons);
      const dx = chair.draw.destinationTopLeftTiles[0] - draw.destinationTopLeftTiles[0];
      const dy = chair.draw.destinationTopLeftTiles[1] - draw.destinationTopLeftTiles[1];
      expect(chair.support.seat.x - reference.seat.x).toBeCloseTo(dx);
      expect(chair.support.seat.y - reference.seat.y).toBeCloseTo(dy);
      expect(chair.support.fixtureGround.y).toBeGreaterThanOrEqual(getApprovedDrawPainterGround(chair.draw));
      const originalFootprint = draw.footprint!;
      expect(originalFootprint.left + dx).toBeGreaterThanOrEqual(x + .15 - 1e-9);
      expect(originalFootprint.top + dy).toBeGreaterThanOrEqual(y + .15 - 1e-9);
      expect(originalFootprint.left + dx + originalFootprint.width).toBeLessThanOrEqual(x + .85 + 1e-9);
      expect(originalFootprint.top + dy + originalFootprint.height).toBeLessThanOrEqual(y + .85 + 1e-9);
    });
  });

  it("hides exactly the doorway chair at all 24 wall slots and restores it after removal", () => {
    for (const side of ["north", "east", "south", "west"] as const) for (let offset = 0; offset < 6; offset += 1) {
      const hidden = seats.find((seat) => seat[4] === side && seat[5] === offset)?.[0];
      expect(resolvePeriopCompanionChairs(room, [doorway(side, offset)]).map((chair) => chair.support.id))
        .toEqual(seats.map((seat) => seat[0]).filter((id) => id !== hidden));
    }
    expect(resolvePeriopCompanionChairs(room)).toHaveLength(8);
  });

  it("hides the same eight slots for reciprocal openings owned by neighboring rooms", () => {
    for (const [id, , , , side, offset] of seats) {
      const opposite = { north: "south", south: "north", east: "west", west: "east" } as const;
      const neighbour = { ...room, instanceId: "periop.neighbour",
        tileX: room.tileX + (side === "east" ? 6 : side === "west" ? -6 : 0),
        tileY: room.tileY + (side === "south" ? 6 : side === "north" ? -6 : 0) };
      const visible = resolvePeriopCompanionChairs(room, [doorway(opposite[side], offset, neighbour.instanceId)], [room, neighbour]);
      expect(visible.map((chair) => chair.support.id)).toEqual(seats.map((seat) => seat[0]).filter((seatId) => seatId !== id));
    }
  });

  it("draws the chairs on low/backed walls, preserves other furniture, and destroys a hidden foreground", () => {
    const { scene, model, draw } = harness();
    draw();
    expect(scene.debugApprovedSideChairLayerSnapshot().filter((entry: any) => entry.drawId.startsWith("companion."))).toHaveLength(8);
    expect(scene.getTouchupDrawRecords(room).filter((record: any) => !record.id.startsWith("companion.")))
      .toEqual(applyRoomTouchupsToRecords(room.definitionId, 0, 6, resolveApprovedRoomDrawRecords(room.definitionId, 0)));
    const old = [...scene.approvedSideChairRuntimes.values()].find((runtime: any) => runtime.drawId === seats[0][0]) as any;
    model.doors = [doorway("north", 1)];
    draw();
    expect(old.foregroundImage.visible).toBe(false);
    expect(old.baseImage.visible).toBe(false);
    expect(scene.debugApprovedSideChairLayerSnapshot().some((entry: any) => entry.drawId === seats[0][0])).toBe(false);
    model.doors = [];
    draw();
    expect(scene.debugApprovedSideChairLayerSnapshot().filter((entry: any) => entry.drawId.startsWith("companion."))).toHaveLength(8);
  });

  it("attaches every sitter to its own cushion, facing and foreground on bitmap/fallback actors", () => {
    for (const [id, , , facing] of seats) for (const bitmap of [false, true]) {
      const { scene, draw } = harness();
      draw();
      const actor = seatedActor(id);
      const key = `character:retail-companion:${id}`;
      if (bitmap) scene.characterBitmapContainers.set(key, new DisplayObject());
      scene.drawRetailExternalActor(actor, 0);
      scene.reconcileApprovedSideChairLayers();
      const args = scene.drawPixelPerson.mock.calls.at(-1)!;
      const chair = resolvePeriopCompanionChairs(room).find((candidate) => candidate.support.id === id)!;
      expect(args[1]).toBeCloseTo(31 + (38 + chair.support.seat.x) * 64);
      expect(args[2]).toBeCloseTo(83 + (26 + chair.support.seat.y) * 64);
      expect([args[6], args[7], args[8], args[12]])
        .toEqual([getApprovedSupportFacing(facing).direction, "seated", getApprovedSupportFacing(facing).rightFacing, true]);
      const actorDisplay = bitmap ? scene.characterBitmapContainers.get(key) : scene.characterGraphics.get(key);
      expect(actorDisplay.getData("actor-support-id")).toBe(id);
      expect(actorDisplay.getData("actor-support-room-instance-id")).toBe(room.instanceId);
      const foregrounds = scene.debugApprovedSideChairLayerSnapshot().filter((entry: any) => entry.foregroundVisible);
      expect(foregrounds).toMatchObject([{ drawId: id, foregroundDepth: actorDisplay.depth + .5 }]);
      expect(foregrounds[0].baseDepth).toBeLessThan(actorDisplay.depth);
    }
  });

  it("keeps walkers, standing reservations, legacy companions and other phases on the floor", () => {
    const chairs = resolvePeriopCompanionChairs(room);
    const actor = seatedActor();
    const variants: FacilityRetailExternalActorView[] = [
      { ...actor, moving: true }, { ...actor, actorKind: "retail_visitor" },
      { ...actor, procedureCompanion: undefined }, { ...actor, location: { x: 39, y: 27 } },
      { ...actor, location: { x: 39, y: 26.01 } },
      ...(["walking_to_amenity", "using_amenity", "returning_to_periop", "leaving_with_patient"] as const)
        .map((phase) => ({ ...actor, procedureCompanion: { ...actor.procedureCompanion!, phase } })),
      { ...actor, procedureCompanion: { ...actor.procedureCompanion!, waitingReservation: null } },
      { ...actor, procedureCompanion: { ...actor.procedureCompanion!, periopRoomInstanceId: "different" } },
      { ...actor, procedureCompanion: { ...actor.procedureCompanion!, waitingReservation: { ...actor.procedureCompanion!.waitingReservation!, kind: "standing", seatId: null } } },
      { ...actor, procedureCompanion: { ...actor.procedureCompanion!, waitingReservation: { ...actor.procedureCompanion!.waitingReservation!, location: { x: 39, y: 27 } } } },
    ];
    for (const variant of variants) {
      expect(getPeriopCompanionChairForActor(variant, chairs)).toBeUndefined();
      const { scene, draw } = harness();
      draw();
      scene.drawRetailExternalActor(variant, 0);
      scene.reconcileApprovedSideChairLayers();
      expect(scene.drawPixelPerson.mock.calls.at(-1)![7]).not.toBe("seated");
      expect(scene.debugApprovedSideChairLayerSnapshot().every((entry: any) => !entry.foregroundVisible)).toBe(true);
    }
  });

  it("clears an occupied attachment on doorway, phase and room changes even while paused", () => {
    for (const change of ["door", "phase", "room"] as const) {
      const { scene, model, draw } = harness();
      const actor = seatedActor();
      const key = `character:retail-companion:${actor.instanceId}`;
      draw();
      scene.drawRetailExternalActor(actor, 0);
      expect(scene.characterMotionSnapshots.get(key).pose).toBe("seated");
      model.paused = true;
      if (change === "door") model.doors = [doorway("north", 1)];
      else if (change === "phase") actor.procedureCompanion!.phase = "leaving_with_patient";
      else actor.procedureCompanion!.waitingReservation!.roomInstanceId = "other-periop";
      draw();
      scene.drawRetailExternalActor(actor, 0);
      scene.reconcileApprovedSideChairLayers();
      expect(scene.drawPixelPerson.mock.calls.at(-1)![7]).toBe("idle");
      expect(scene.characterGraphics.get(key).getData("actor-support-id")).toBeNull();
      expect(scene.debugApprovedSideChairLayerSnapshot().every((entry: any) => !entry.foregroundVisible)).toBe(true);
    }
  });

  it("clears a frozen seated actor with no live location without drawing a ghost at the map origin", () => {
    const { scene, model, draw } = harness();
    const actor = seatedActor();
    const key = `character:retail-companion:${actor.instanceId}`;
    draw();
    scene.drawRetailExternalActor(actor, 0);
    model.paused = true;
    actor.location = undefined;
    scene.drawPixelPerson.mockClear();
    scene.drawRetailExternalActor(actor, 0);
    scene.reconcileApprovedSideChairLayers();
    expect(scene.drawPixelPerson).not.toHaveBeenCalled();
    expect(scene.characterMotionSnapshots.has(key)).toBe(false);
    expect(scene.characterGraphics.get(key).getData("actor-support-id")).toBeNull();
    expect(scene.characterGraphics.get(key).visible).toBe(false);
    expect(scene.debugApprovedSideChairLayerSnapshot().every((entry: any) => !entry.foregroundVisible)).toBe(true);
  });

  it("keeps all doorway, bed, staff and companion routes clear of visible floor footprints", () => {
    const domain = placedRoom(room);
    const targets = [[2, 2], [3, 2], [2, 4], [3, 4], [1, 2], [1, 3], [4, 2], [4, 3], [3, 3]];
    for (const side of ["north", "east", "south", "west"] as const) for (let offset = 0; offset < 6; offset += 1) {
      const door = doorway(side, offset);
      const doors = [{ id: door.instanceId, roomId: door.roomInstanceId, side, offset, exterior: false }];
      const inside = { x: room.tileX + (side === "west" ? 0 : side === "east" ? 5 : offset),
        y: room.tileY + (side === "north" ? 0 : side === "south" ? 5 : offset) };
      const chairs = resolvePeriopCompanionChairs(room, [door]);
      for (const target of [...targets.map(([x, y]) => ({ x: 38 + x!, y: 26 + y! })), ...chairs.map((chair) => chair.anchor)]) {
        const path = findDeterministicFacilityPath(inside, target, [domain], doors, getRoomDefinition);
        expect(path.at(-1), `${side} ${offset} -> ${target.x},${target.y}`).toEqual(target);
        for (let index = 1; index < path.length; index += 1) for (let step = 0; step <= 20; step += 1) {
          const from = path[index - 1]!, to = path[index]!;
          const px = from.x - 38 + .5 + (to.x - from.x) * step / 20;
          const py = from.y - 26 + .5 + (to.y - from.y) * step / 20;
          for (const chair of chairs) {
            if (chair.anchor.x === target.x && chair.anchor.y === target.y) continue;
            const footprint = chair.draw.footprint!;
            const dx = Math.max(footprint.left - px, 0, px - footprint.left - footprint.width);
            const dy = Math.max(footprint.top - py, 0, py - footprint.top - footprint.height);
            expect(dx * dx + dy * dy, `${side} ${offset} -> ${chair.support.id}`).toBeGreaterThanOrEqual(.16 ** 2 - 1e-9);
          }
        }
      }
    }
  });
});
