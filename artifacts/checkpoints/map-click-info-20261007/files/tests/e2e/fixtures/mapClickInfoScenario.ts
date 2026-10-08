import { readFileSync } from "node:fs";
import {
  PROTOTYPE_DOMAIN_CONTEXT,
  createInitialGameState,
  gameReducer,
  getRoomNavigableTiles,
  getRoomStandingWaitingAnchors,
  getRoomWaitingAnchors,
  listFounderSeats,
  type GameState,
  type GridPoint,
} from "@gamify-surgery/game-domain";

// Map click info boxes / founder seats / no-idle-standing QA scenario
// (owner request 2026-10-07). Uses the 63-room Level 3 layout and adds a
// Break Room, a receptionist, an EVS worker and waiting patients placed in
// chairs, a standing spot and a hallway.

const layout = JSON.parse(readFileSync("tests/e2e/fixtures/hallway-decor-level3-layout.json", "utf8")) as {
  rooms: [string, string, number, number, number, string | null][];
  doors: [string, string, string, number, boolean][];
};

let sequence = 0;
const op = (label: string) => `map-click.${label}.${sequence++}`;

export interface MapClickScenario {
  state: GameState;
  seatedIds: string[];
  standingId: string;
  hallwayId: string;
  freedChair: GridPoint;
  breakRoomId: string | null;
}

function definition(id: string) {
  return PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.find((room) => room.id === id)!;
}

export function buildMapClickScenario(base: GameState): MapClickScenario {
  let state = structuredClone(base);
  state.facilityLevel = 3;
  state.paused = true;
  state.cash = 5_000_000;
  state.cashCents = 500_000_000;
  state.nextRoutineArrivalTick = Number.MAX_SAFE_INTEGER;
  state.rooms = layout.rooms.map(([id, roomDefinitionId, x, y, orientation, doorSide]) =>
    ({ id, roomDefinitionId, x, y, orientation: orientation as 0, doorSide: doorSide as null, upgradeLevel: 1 as const, cleanliness: 100 }));
  state.doors = layout.doors.map(([id, roomId, side, offset, exterior]) =>
    ({ id, roomId, side: side as "north", offset, exterior }));
  state.encounters = {};

  // A Break Room wherever the real placement rules accept one, with a door the founder can reach.
  let breakRoomId: string | null = null;
  search: for (let y = 10; y < 40 && !breakRoomId; y += 1) {
    for (let x = 20; x < 60; x += 1) {
      const id = `room.qa.break.${x}.${y}`;
      const placed = gameReducer(state, { type: "PLACE_ROOM", operationId: op("break"), roomId: id, roomDefinitionId: "room.staff_break", x, y });
      if (!placed.rooms.some((room) => room.id === id)) continue;
      for (const side of ["south", "west", "east", "north"] as const) {
        for (let offset = 0; offset < 4; offset += 1) {
          const withDoor = gameReducer(placed, { type: "PLACE_DOOR", operationId: op("door"), doorId: `door.qa.break.${side}.${offset}`, roomId: id, side, offset });
          if (!withDoor.doors.some((door) => door.roomId === id)) continue;
          const seat = listFounderSeats(withDoor, PROTOTYPE_DOMAIN_CONTEXT).find((candidate) => candidate.roomInstanceId === id);
          const probe = seat && gameReducer(withDoor, { type: "SEAT_FOUNDER_IN_CHAIR", operationId: op("probe"), roomInstanceId: id, location: seat.location, seatId: seat.seatId });
          if (probe && probe.environment.founderActivity?.kind === "sit_in_chair") {
            state = withDoor;
            breakRoomId = id;
            break search;
          }
        }
      }
    }
  }

  for (const role of ["staff.receptionist", "staff.evs_worker"]) {
    state = gameReducer(state, { type: "HIRE_STAFF", operationId: op("hire"), employeeId: `employee.qa.${role}`, staffRoleDefinitionId: role });
  }

  const sample = Object.values(createInitialGameState().encounters)[0]!;
  const addPatient = (id: string, location: GridPoint, reservation: NonNullable<GameState["encounters"][string]["waitingDestination"]>) => {
    state.encounters[id] = {
      ...structuredClone(sample),
      id,
      checkInStatus: "checked_in",
      lifecycle: "waiting_unopened",
      patientLocation: { ...location },
      patientMovement: null,
      waitingDestination: reservation,
      assignedRoomInstanceId: reservation.roomInstanceId,
      nextIdleActionAtFacilityTick: state.facilityTick + 1,
      idleWaitingSinceTick: state.facilityTick,
      lastSatisfactionDecayAtTick: state.facilityTick,
      patientDisplayName: `${sample.patientDisplayName.split(" ")[0]} ${id.split(".").at(-1)}`,
    };
  };

  const waiting = state.rooms.find((room) => room.id === "room.instance.4")!;
  const chairs = getRoomWaitingAnchors(waiting, definition("room.waiting"));
  const seatedIds = chairs.slice(0, 3).map((chair, index) => {
    const id = `encounter.qa.seated.${index}`;
    addPatient(id, chair, { roomInstanceId: waiting.id, location: chair, kind: "chair" });
    return id;
  });
  const chairKeys = new Set(chairs.map((point) => `${point.x},${point.y}`));
  const standingSpot = getRoomNavigableTiles(waiting, definition("room.waiting"), state.doors)
    .find((point) => !chairKeys.has(`${point.x},${point.y}`) &&
      !getRoomStandingWaitingAnchors(waiting, definition("room.waiting")).some((anchor) => anchor.x === point.x && anchor.y === point.y))!;
  const standingId = "encounter.qa.standing";
  addPatient(standingId, standingSpot, { roomInstanceId: waiting.id, location: standingSpot, kind: "standing" });
  const hall = state.rooms.find((room) => room.roomDefinitionId === "room.hallway" && room.x === 36 && room.y === 27) ??
    state.rooms.find((room) => room.roomDefinitionId === "room.hallway")!;
  const hallwayId = "encounter.qa.hallway";
  addPatient(hallwayId, { x: hall.x, y: hall.y }, { roomInstanceId: hall.id, location: { x: hall.x, y: hall.y }, kind: "public_wander" });
  state.founder.displayName = "QA Founder";
  return { state, seatedIds, standingId, hallwayId, freedChair: chairs[3]!, breakRoomId };
}
