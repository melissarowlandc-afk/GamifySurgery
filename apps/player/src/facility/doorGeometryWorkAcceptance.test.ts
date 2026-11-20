import { expect, it, vi } from "vitest";
import { PROTOTYPE_DOMAIN_CONTEXT, type GameState, type GridPoint } from "@gamify-surgery/game-domain";
import { operationalSessionFixture } from "../session/cloud/operationalSessionTestSupport";
import { doorScene, projectFacility, seatedClinic, syntheticRoom, waitingRoom } from "./doorGeometryAcceptanceFixtures";
import { getFacilityWorldSignature } from "./facilityWorldSignature";
import type { FacilityViewModel } from "./types";

vi.mock("phaser", () => ({ default: { Scene: class {}, Textures: { FilterMode: { LINEAR: 0 } } } }));

const doorCount = 124;
const roomCount = 256;

function largeProjection(state: GameState, seats: GridPoint[], buildMode = false): FacilityViewModel {
  const model = projectFacility(state, buildMode);
  // The first two rooms are nonmatching candidates even when looking up the
  // last door. Every synthetic door links two distinct, neighboring footprints.
  const rooms = [syntheticRoom("decoy-a", 0, 0), syntheticRoom("decoy-b", 2, 0), ...model.rooms];
  const doors = [...model.doors!];
  const extraDoors = doorCount - doors.length;
  for (let index = 0; index < extraDoors; index++) {
    const x = index % 12 * 6;
    const y = 36 + Math.floor(index / 12) * 5;
    const source = syntheticRoom(`source.${index}`, x, y, 2, 2);
    const neighbor = syntheticRoom(`neighbor.${index}`, x, y + 2, 2, 2);
    rooms.push(source, neighbor);
    doors.push({
      instanceId: `public.geometry.door.${index}`, roomInstanceId: source.instanceId, side: "south",
      offset: index % 2, exterior: false, connectionValid: true, adjacentRoomInstanceId: neighbor.instanceId,
    });
  }
  while (rooms.length < roomCount) rooms.push(syntheticRoom(`filler.${rooms.length}`, rooms.length % 72, 88));
  const [patient] = model.patients!;
  const patients = [patient!, ...seats.slice(1).map((location, index) => ({
    ...patient!, instanceId: `public.geometry.seated.${index}`, location,
  }))];
  expect(rooms).toHaveLength(roomCount);
  expect(doors).toHaveLength(doorCount);
  expect(patients).toHaveLength(4);
  expect(patients.every(row => row.supportRole === "waiting-seat" && !row.moving)).toBe(true);
  return { ...model, gridRows: 90, rooms, doors, patients };
}

// Sample room ID and footprint reads on two nonmatching rooms. A replacement
// loop still visits both even if it copies the room array or uses no .find().
// The door-free twin subtracts identical layout/signature/actor scans. One
// bounded indexing pass can touch the probes on cold layout. A per-door
// linear lookup costs at least two candidate visits for each saved door.
function meter() {
  let reads = 0, relationshipReads = 0;
  return {
    read: () => reads,
    relationshipReads: () => relationshipReads,
    wrap(model: FacilityViewModel, withDoors: boolean): FacilityViewModel {
      return { ...model, doors: withDoors ? model.doors!.map(door => ({
        ...door, get connectionValid() { relationshipReads++; return door.connectionValid; },
      })) : [], rooms: model.rooms.map((room, index) => {
        if (index > 1) return room;
        return {
          ...room,
          get instanceId() { reads++; return room.instanceId; },
          get tileX() { reads++; return room.tileX; },
          get tileY() { reads++; return room.tileY; },
        };
      }) };
    },
  };
}

function measuredScenes(model: FacilityViewModel) {
  const withDoors = meter(), withoutDoors = meter();
  const scene = doorScene(withDoors.wrap(model, true));
  const control = doorScene(withoutDoors.wrap(model, false));
  const work = () => withDoors.read() - withoutDoors.read();
  return {
    scene, control, work, relationshipReads: withDoors.relationshipReads,
    frame(next?: FacilityViewModel) {
      scene.frame(next ? withDoors.wrap(next, true) : undefined);
      control.frame(next ? withoutDoors.wrap(next, false) : undefined);
    },
  };
}

function expectVisibleSeats(scene: ReturnType<typeof doorScene>) {
  const actors = scene.scene.debugCharacterGaitSnapshot();
  for (const patient of scene.bridge.viewModel.patients!) {
    expect(actors[`character:patient:${patient.instanceId}`]).toMatchObject({
      supportRole: "waiting-seat", supportRoomInstanceId: waitingRoom, pose: "seated", visible: true,
    });
  }
}

it.each([["Play", false], ["Build Doors", true]] as const)("B-021 bounds a cold %s layout to one resolution per saved door", (_mode, buildMode) => {
  const { state, seats } = seatedClinic();
  const pair = measuredScenes(largeProjection({ ...state, paused: buildMode }, seats, buildMode));
  expect(pair.scene.stats.worldDraws).toBe(1);
  expect(pair.control.stats.worldDraws).toBe(1);
  expect(pair.work(), "extra candidate visits in the cold layout").toBeLessThanOrEqual(doorCount);
});

it("B-021 does zero door work during 60 playing frames with visible seated actors", () => {
  const { state, seats } = seatedClinic();
  const pair = measuredScenes(largeProjection({ ...state, paused: false }, seats));
  pair.frame();
  expectVisibleSeats(pair.scene);
  const before = pair.work(), beforeRelationships = pair.relationshipReads(), redraws = pair.scene.stats.worldDraws;
  for (let frame = 0; frame < 60; frame++) pair.frame();
  expectVisibleSeats(pair.scene);
  expect(pair.scene.stats.worldDraws).toBe(redraws);
  expect({
    extraCandidateReads: pair.work() - before, savedDoorRelationshipReads: pair.relationshipReads() - beforeRelationships,
  }, "door work over 60 playing frames").toEqual({ extraCandidateReads: 0, savedDoorRelationshipReads: 0 });
});

it("B-021 does zero door work after an admitted actor-only tick with fresh geometry arrays", async () => {
  const { state, seats } = seatedClinic();
  const start = { x: 35, y: 30 };
  state.paused = false;
  state.environment.founderLocation = start;
  state.environment.founderActivity = {
    kind: "return_to_front_desk", targetId: "room.instance.founder_desk",
    path: [start, { x: 34, y: 30 }, { x: 34, y: 29 }], pathIndex: 0,
    lastMovedAtFacilityTick: state.facilityTick, workMinutesRemaining: 0,
  };
  const f = await operationalSessionFixture({}, state);
  try {
    const initial = largeProjection(f.session.state, seats);
    const pair = measuredScenes(initial);
    pair.frame();
    expectVisibleSeats(pair.scene);
    const before = pair.work(), redraws = pair.scene.stats.worldDraws;
    f.clock.advance(1000);
    const tick = { type: "ADVANCE_TICK", operationId: "public.geometry.tick", advancedAtRealMs: f.clock.wall } as const;
    const next = await f.session.advanceClock(tick, PROTOTYPE_DOMAIN_CONTEXT);
    expect(next?.operationReceipts[tick.operationId]?.status).toBe("applied");
    expect(next?.facilityTick).toBe(initial.facilityTick + 1);
    const updated = largeProjection(next!, seats);
    expect(updated.founder.location).toEqual({ x: 34, y: 29 });
    expect(updated.founder.location).not.toEqual(initial.founder.location);
    expect(updated.rooms).not.toBe(initial.rooms);
    expect(updated.doors).not.toBe(initial.doors);
    expect(updated.rooms).toStrictEqual(initial.rooms);
    expect(updated.doors).toStrictEqual(initial.doors);
    expect(getFacilityWorldSignature(updated)).toBe(getFacilityWorldSignature(initial));
    pair.frame(updated);
    expectVisibleSeats(pair.scene);
    expect(pair.scene.stats.worldDraws).toBe(redraws);
    expect(pair.work() - before, "extra candidate visits on fresh actor-only publication").toBe(0);
  } finally {
    f.session.dispose();
  }
});

it("control: settled paused frames do zero door work and keep seated poses", () => {
  const { state, seats } = seatedClinic();
  const pair = measuredScenes(largeProjection(state, seats));
  pair.frame();
  expectVisibleSeats(pair.scene);
  const before = pair.work(), redraws = pair.scene.stats.worldDraws;
  for (let frame = 0; frame < 60; frame++) pair.frame();
  expectVisibleSeats(pair.scene);
  expect(pair.scene.stats.worldDraws).toBe(redraws);
  expect(pair.work() - before).toBe(0);
});

it("control: the probe catches a different linear lookup through a copied room array", () => {
  const { state, seats } = seatedClinic();
  const probe = meter();
  const model = probe.wrap(largeProjection(state, seats), true);
  const copied = [...model.rooms];
  for (const door of model.doors!) {
    for (const room of copied) if (room.instanceId === door.roomInstanceId) break;
  }
  expect(probe.read()).toBeGreaterThan(doorCount);
});
