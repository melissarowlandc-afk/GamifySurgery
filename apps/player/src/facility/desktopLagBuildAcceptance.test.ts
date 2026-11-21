import { mountDesktopClinic, observeDoorWork } from "./desktopLagAppFixture";
import { expect, it } from "vitest";
import {
  PROTOTYPE_DOMAIN_CONTEXT, deserializeGameState, getBuildExitAccessValidation, getDoorCells, getRoomDefinition, getRoomInstanceFootprint,
  serializeGameState, validateDoorPlacement, type GameState,
} from "@gamify-surgery/game-domain";
import { examDoor, examRoom } from "../../../../packages/game-domain/tests/paused-command-outage-fixtures";
import { doorSides, eastBathId, expectedDoorCandidates, facility, filedVisitId, ownerScaleClinic, pixelRoom, placedRoom, roomCenter,
  projectClinic, savedDoor, westBathId, withFiledVisit } from "./desktopLagAcceptanceFixtures";
import { getDoorInteractionGeometry, type DoorInteractionGeometry } from "./doorInteractionGeometry";
import { isRoomVisualDoorSlotClear } from "./roomVisualLayout";
import { getRearWallFaceHeight, isHorizontalBoundarySegmentExposed } from "./roomCutaway";
import type { FacilityBuildDoorSlotView, FacilityDoorView } from "./types";
import { findTestElement } from "../mobile/testDom";

type Mounted = Awaited<ReturnType<typeof mountDesktopClinic>>;
const protectedRooms = new Set(facility.protectedRoomDefinitionIds);
const validate = (door: GameState["doors"][number], state: GameState) => validateDoorPlacement(door, state.rooms, state.doors,
  getRoomDefinition, facility.gridWidth, facility.gridHeight, protectedRooms);

function referenceSlots(state: GameState, preferred: string | null) {
  const matches: FacilityBuildDoorSlotView[] = [];
  const claimed = new Set<string>();
  const ordered = [...state.rooms].sort((a, b) => Number(b.id === preferred) - Number(a.id === preferred) || a.id.localeCompare(b.id));
  for (const room of ordered) {
    const def = getRoomDefinition(room.roomDefinitionId)!;
    if (def.kind === "hallway") continue;
    const size = getRoomInstanceFootprint(state, room.id)!;
    for (const side of doorSides) for (let offset = 0; offset < (side === "north" || side === "south" ? size.width : size.height); offset++) {
      const door = savedDoor(room.id, side, offset, `door.preview.${room.id}.${side}.${offset}`);
      if (!validate(door, state).valid) continue;
      const { inside, outside } = getDoorCells(door, room, def)!;
      const key = [`${inside.x},${inside.y}`, `${outside.x},${outside.y}`].sort().join("|");
      if (claimed.has(key)) continue;
      claimed.add(key);
      matches.push({ id: `${room.id}.${side}.${offset}`, roomInstanceId: room.id, side, offset });
    }
  }
  return matches;
}

function expectPlaceTargets(h: Mounted, preferred: string | null) {
  const { scene, bridge } = h.f;
  const { rooms, doors } = bridge.viewModel;
  const slots = referenceSlots(h.session.state, preferred);
  expect(bridge.viewModel.buildDoorSlots).toEqual(slots);
  const geometry = ({ roomInstanceId, side, offset }: FacilityBuildDoorSlotView | FacilityDoorView) => {
    const room = rooms.find(r => r.instanceId === roomInstanceId)!;
    const rect = pixelRoom(scene, room);
    const tileSize = scene.worldLayout.tileSize;
    const clamped = Math.min(Math.max(0, Math.floor(offset)), (side === "north" || side === "south" ? room.width : room.height) - 1);
    return getDoorInteractionGeometry({ room: rect, side, offset: clamped, tileSize,
      exposedNorthWall: side === "north" && isHorizontalBoundarySegmentExposed(room, rooms, "north", clamped),
      northWallHeight: getRearWallFaceHeight(rect.height, tileSize) });
  };
  const place = slots.filter(slot => isRoomVisualDoorSlotClear({ ...rooms.find(r => r.instanceId === slot.roomInstanceId)!, ...slot }));
  const actual = scene.getBuildDoorInteractionTargets().map((row: { kind: string; slot?: { id: string }; door?: FacilityDoorView;
    geometry: DoorInteractionGeometry }) => [row.kind, row.slot?.id ?? row.door?.instanceId, row.geometry]);
  expect(actual).toEqual([
    ...place.map(slot => ["place", slot.id, geometry(slot)]),
    ...doors!.filter(door => !door.exterior && rooms.some(room => room.instanceId === door.roomInstanceId))
      .map(door => ["remove", door.instanceId, geometry(door)]),
  ]);
  return place;
}

async function selectAndArm(h: Mounted, roomId: string) {
  const scenePoint = roomCenter(h.f, roomId);
  await h.action(() => h.f.click(scenePoint));
  await h.frame();
  expect(h.f.bridge.viewModel.selectedRoomInstanceId).toBe(roomId);
  await h.click("Doors");
  await h.frame();
  expect(h.f.bridge.viewModel.selectedRoomInstanceId).toBe(roomId);
  expect(h.f.bridge.viewModel.buildDoorTool).toBe("place");
}

it("B-021 Build entry and Remove do no hypothetical-door work", async () => {
  const state = withFiledVisit(ownerScaleClinic());
  const invalid = savedDoor(examRoom, "west", 20, "public.perf.saved-invalid");
  state.doors.push(invalid);
  const h = await mountDesktopClinic(state);
  await h.openChart(filedVisitId);
  expect(h.session.state.openChartEncounterId).not.toBeNull();
  await h.click("Close patient chart");
  expect(h.session.state.openChartEncounterId).toBeNull();
  const meter = observeDoorWork(h.session.state.doors);
  await h.click("Enter Build Mode");
  await h.frame();
  const { scene, bridge } = h.f;
  expect(bridge.viewModel).toMatchObject({ paused: true, buildMode: true, buildDoorTool: null, selectedRoomInstanceId: null });
  expect(bridge.viewModel.doors!.find(door => door.instanceId === invalid.id)?.connectionValid).toBe(false);
  expect(scene.roomFixtureGraphics.has(`invalid-door:${invalid.id}`)).toBe(true);
  expect(h.env.button("Doors").attributes.disabled).toBeUndefined();
  expect(h.env.button("Done / Save").attributes.disabled).toBeUndefined();
  const entry = meter.read();
  meter.reset();
  await h.removeTool();
  await h.frame();
  expect(bridge.viewModel.buildDoorTool).toBe("remove");
  expect(new Set(scene.getBuildDoorInteractionTargets().map((target: { kind: string }) => target.kind))).toEqual(new Set(["remove"]));
  const remove = meter.read();
  meter.stop();
  await h.click("Done / Save");
  expect(h.session.state.paused).toBe(true);
  await h.frame();
  expect(bridge.viewModel.buildMode).toBe(true);
  const validation = getBuildExitAccessValidation(h.session.state);
  expect(validation.valid).toBe(false);
  expect(validation.issues.length).toBeGreaterThan(0);
  await h.click("Done / Save");
  const explanation = findTestElement(h.env.doc.body, node => node.attributes["aria-labelledby"] === "invalid-layout-title");
  expect(explanation?.textContent).toContain(validation.issues[0]);
  const none = meter.zero;
  expect({ entry, remove }, "Build off/Remove hypothetical candidates, array visits and navigation keys").toEqual({ entry: none, remove: none });
});

it("B-021 Place keeps validator order/hit geometry and bounds work across repeated publications", async () => {
  const h = await mountDesktopClinic(ownerScaleClinic());
  await h.click("Enter Build Mode");
  await h.frame();
  await h.revealRoom(eastBathId);
  const meter = observeDoorWork(h.session.state.doors);
  await selectAndArm(h, eastBathId);
  const first = meter.read();
  meter.stop();
  const initial = expectPlaceTargets(h, eastBathId);
  expect(initial).toContainEqual(expect.objectContaining({ roomInstanceId: eastBathId, side: "west", offset: 1 }));
  expect(initial).not.toContainEqual(expect.objectContaining({ roomInstanceId: westBathId, side: "east", offset: 1 }));
  const warmMeter = observeDoorWork(h.session.state.doors);
  const hScene = h.f.scene;
  hScene.input.emit("pointermove", { ...roomCenter(h.f, eastBathId), button: 0 });
  await h.action(() => hScene.applyCamera({ ...hScene.getCameraPreference(), panX: 9 }));
  hScene.input.emit("wheel", { x: 550, y: 390 }, [], 0, -100);
  await h.frame(190);
  await h.action(() => h.session.executeAsync({ type: "SET_PAUSED", paused: true, operationId: "public.perf.ui-publication" }, PROTOTYPE_DOMAIN_CONTEXT));
  await h.frame(190);
  const repeated = warmMeter.read();
  warmMeter.stop();
  expect(expectPlaceTargets(h, eastBathId)).toEqual(initial);
  const bound = expectedDoorCandidates(h.session.state);
  expect.soft(first.candidates, "at most one perimeter walk for a selected geometry").toBeLessThanOrEqual(bound);
  expect.soft(first.roomVisits + first.doorVisits, "candidate-local reads plus one base indexing pass")
    .toBeLessThanOrEqual(16 * bound + h.session.state.rooms.length + h.session.state.doors.length);
  expect.soft([first.speculativeKeys, first.speculativeLayouts, first.speculativeGraphs], "no whole-map layout or graph for a hypothetical door")
    .toEqual([0, 0, 0]);
  expect(repeated, "no same-geometry work on hover, camera echo or publication").toEqual(meter.zero);
});

it("B-021 generic Build projection does not enumerate door slots before the explicit Place read", () => {
  const original = ownerScaleClinic();
  const reads = { rooms: 0, doors: 0 };
  const watch = <T extends object>(row: T, type: keyof typeof reads) => new Proxy(row, {
    get(target, property, receiver) {
      if (typeof property === "string" && Object.hasOwn(target, property)) reads[type]++;
      return Reflect.get(target, property, receiver);
    },
  });
  // The field visits stay observable through a copied array and a new helper.
  const state = { ...original, rooms: original.rooms.map(room => watch(room, "rooms")),
    doors: original.doors.map(door => watch(door, "doors")) };
  projectClinic(state);
  reads.rooms = reads.doors = 0;
  projectClinic(state);
  const play = { ...reads };
  reads.rooms = reads.doors = 0;
  const build = projectClinic(state, true);
  expect.soft(build.buildDoorSlots ?? [], "closed Build supplies no preview payload").toHaveLength(0);
  expect({ rooms: reads.rooms - play.rooms, doors: reads.doors - play.doors }, "extra geometry field visits in closed Build")
    .toEqual({ rooms: 0, doors: 0 });
});

it("control: ordered Place slots follow add, remove, Move, Rotate and Undo immediately", async () => {
  const h = await mountDesktopClinic(ownerScaleClinic());
  await h.revealRoom(westBathId);
  await h.click("Enter Build Mode");
  await h.frame();
  await h.click("Doors");
  await h.frame();
  const initial = expectPlaceTargets(h, null);
  const slot = initial.find(row => row.roomInstanceId === westBathId && row.side === "east" && row.offset === 1)!;
  const target = () => h.f.scene.getBuildDoorInteractionTargets().find((row: { slot?: { id: string }; door?: FacilityDoorView }) =>
    row.slot?.id === slot.id || row.door?.roomInstanceId === westBathId && row.door.side === "east");
  const clickTarget = async () => {
    const center = target().geometry.center;
    await h.action(() => h.f.click(h.f.camera.matrixCombined.transformPoint(center.x, center.y)));
    await h.frame();
  };
  await clickTarget();
  expect(h.session.state.doors.some(row => row.roomId === westBathId && row.side === "east")).toBe(true);
  expect(expectPlaceTargets(h, westBathId)).not.toContainEqual(slot);
  await clickTarget();
  const afterRemove = expectPlaceTargets(h, westBathId);
  expect(afterRemove.map(row => row.id).sort()).toEqual(initial.map(row => row.id).sort());
  const undo = h.env.find(node => node.tagName === "BUTTON" && node.attributes.class?.includes("build-undo-button") === true);
  await h.env.clickElement(undo);
  await h.action(() => {});
  await h.frame();
  expect(expectPlaceTargets(h, h.f.bridge.viewModel.selectedRoomInstanceId ?? null)).not.toContainEqual(slot);
  for (const command of [
    { type: "MOVE_ROOM", roomId: examRoom, x: 29, y: 23, operationId: "public.perf.move" },
    { type: "ROTATE_ROOM", roomId: examRoom, operationId: "public.perf.rotate" },
  ] as const) {
    await h.action(async () => {
      const state = await h.session.executeAsync(command, PROTOTYPE_DOMAIN_CONTEXT);
      const receipt = state?.operationReceipts[command.operationId];
      expect(receipt?.status, receipt?.message).toBe("applied");
    });
    await h.frame();
    expectPlaceTargets(h, h.f.bridge.viewModel.selectedRoomInstanceId ?? null);
  }
  expect(h.session.state.doors.find(row => row.id === examDoor)?.side).toBe("west");
});

it("control: committed preview validation and Place keep legacy overlap order and reciprocal doors after reload", async () => {
  const state = ownerScaleClinic();
  const shared = savedDoor(westBathId, "east", 1);
  expect(validate(shared, state)).toEqual({ valid: true, reason: null, adjacentRoomId: eastBathId });
  const overlapping = placedRoom("public.perf.legacy-overlap", "room.hallway", 12, 25);
  state.rooms.unshift(overlapping);
  expect(validate(shared, state)).toEqual({ valid: true, reason: null, adjacentRoomId: overlapping.id });
  const decoded = deserializeGameState(serializeGameState({ ...state, campaignId: "public.perf.reload" }));
  expect(decoded.campaignId).toBe("public.perf.reload");
  expect(referenceSlots(decoded, eastBathId)).toEqual(referenceSlots(state, eastBathId));
  decoded.doors.push(shared);
  expect(validate(shared, decoded)).toEqual({ valid: true, reason: null, adjacentRoomId: overlapping.id });
  expect(validate(savedDoor(eastBathId, "west", 1), decoded).reason).toBe("A door already occupies that wall segment.");
  expect(validate(savedDoor("room.instance.founder_desk", "south", 0), decoded).reason).toBe("That door position conflicts with fixed room furniture.");
  expect(validate(savedDoor(eastBathId, "west", 40), decoded).reason).toBe("That door position is not on a valid wall segment.");
  const h = await mountDesktopClinic(decoded);
  await h.click("Enter Build Mode"); await h.frame();
  await h.click("Doors"); await h.frame();
  expect(h.f.bridge.viewModel.campaignId).toBe("public.perf.reload");
  expectPlaceTargets(h, null);
});
