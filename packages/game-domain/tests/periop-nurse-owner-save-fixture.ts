import {
  deserializeGameState, gameReducer, getRoomDefinition, getRoomNavigationAnchor,
  getRotatedFootprint, isRoomOperationalForFacilityWork, PROTOTYPE_DOMAIN_CONTEXT,
  serializeGameState, startServiceOperation, validateDoorPlacement,
  type EmployeeState, type GameState, type RoomOrientation,
} from "../src";
import { periopFlowFixture, periopNurses } from "./periop-nurse-flow-fixture";

/** Manager-provided owner-save facts, never browser storage. The room footprints
 * and rotations match the owner; doors are legal shipped-layout placements.
 */
export function periopOwnerSaveFixture() {
  let state = periopFlowFixture(2, 3).state;
  state.rooms = state.rooms.filter((room) => !room.id.startsWith("qa."));
  state.doors = state.doors.filter((door) => !door.id.startsWith("qa."));
  const room = (id: string, roomDefinitionId: string, x: number, y: number, orientation: RoomOrientation = 0) => {
    state.rooms.push({ id, roomDefinitionId, x, y, orientation, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  };
  const hall = (x: number, y: number) => room(`owner.hall.${x}.${y}`, "room.hallway", x, y);
  room("qa.periop.0", "room.periop_recovery", 23, 26);
  room("qa.endoscopy.0", "room.endoscopy", 27, 21, 270);
  room("qa.endoscopy.1", "room.endoscopy", 30, 21, 270);
  room("qa.exam", "room.examination", 29, 27);
  room("owner.training", "room.training", 23, 20);
  for (let x = 22; x <= 37; x++) hall(x, 25);
  for (let y = 26; y <= 31; y++) hall(22, y);
  for (let y = 20; y <= 24; y++) hall(26, y);
  for (let y = 26; y <= 28; y++) hall(32, y);
  for (let y = 26; y <= 27; y++) hall(37, y);
  state.doors.push(
    { id: "owner.front.west", roomId: "room.instance.founder_desk", side: "west", offset: 0, exterior: false },
    { id: "owner.front.north", roomId: "room.instance.founder_desk", side: "north", offset: 4, exterior: false },
    { id: "owner.periop.west", roomId: "qa.periop.0", side: "west", offset: 0, exterior: false },
    { id: "owner.endoscopy.0.south", roomId: "qa.endoscopy.0", side: "south", offset: 1, exterior: false },
    { id: "owner.endoscopy.1.south", roomId: "qa.endoscopy.1", side: "south", offset: 1, exterior: false },
    { id: "owner.exam.east", roomId: "qa.exam", side: "east", offset: 1, exterior: false },
    { id: "owner.training.east", roomId: "owner.training", side: "east", offset: 1, exterior: false },
  );
  const occupied = new Set<string>();
  for (const placed of state.rooms) {
    const size = getRotatedFootprint(getRoomDefinition(placed.roomDefinitionId)!, placed.orientation);
    for (let y = placed.y; y < placed.y + size.height; y++) for (let x = placed.x; x < placed.x + size.width; x++) {
      const key = `${x},${y}`;
      if (occupied.has(key)) throw new Error(`Owner QA room overlap at ${key}: ${placed.id}`);
      occupied.add(key);
    }
  }
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  for (const door of state.doors) {
    const check = validateDoorPlacement(door, state.rooms, state.doors.filter((entry) => entry.id !== door.id), getRoomDefinition,
      facility.gridWidth, facility.gridHeight, new Set(facility.protectedRoomDefinitionIds));
    if (!check.valid) throw new Error(`Owner QA door ${door.id}: ${JSON.stringify(check)}`);
  }
  for (const placed of state.rooms.filter((entry) => entry.roomDefinitionId !== "room.hallway")) {
    if (!isRoomOperationalForFacilityWork(state, placed.id, PROTOTYPE_DOMAIN_CONTEXT)) throw new Error(`Owner QA room is not operational: ${placed.id}`);
  }
  state.facilityTick = 12900;
  for (const employee of state.employees) {
    const home = state.rooms.find((placed) => placed.id === employee.homeRoomInstanceId)!;
    employee.location = getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId)!, "staff");
    employee.path = [{ ...employee.location }];
    employee.pathIndex = 0;
    employee.lastMovedAtFacilityTick = state.facilityTick;
    employee.nextIdleActionAtFacilityTick = state.facilityTick + 10;
  }
  const [riley, blake] = periopNurses(state);
  riley!.displayName = "Riley";
  blake!.displayName = "Blake";
  blake!.morale = 32;
  blake!.location = { x: 26, y: 29 };
  blake!.path = [{ x: 23, y: 26 }, { x: 23, y: 27 }, { x: 24, y: 27 }, { x: 25, y: 27 }, { x: 26, y: 27 }, { x: 26, y: 29 }];
  blake!.pathIndex = 5;
  blake!.facilityTask = ownerCoverageTask();
  blake!.training = {
    version: 1, requestSequence: 0, stage: "queued", requestedAtFacilityTick: 10705, earliestDepartureAtFacilityTick: 10705,
    targetLevel: 2, paidAmount: 125, roomInstanceId: null, placeId: null, remainingMinutes: 60,
    startedAtFacilityTick: null, completedAtFacilityTick: null, lastProgressAtFacilityTick: 10705,
  };
  state.employeeTrainingSequence = 1;
  state.cash -= 125; state.cashCents -= 12500; // Payment happened before the saved queued request.
  const rileyId = riley!.id;
  const blakeId = blake!.id;
  let sequence = 0;
  const advance = (minutes = 1) => {
    for (let minute = 0; minute < minutes; minute++) state = gameReducer(state,
      { type: "ADVANCE_TICK", operationId: `owner.save.tick.${sequence++}` }, PROTOTYPE_DOMAIN_CONTEXT);
    return state;
  };
  const reload = () => { state = deserializeGameState(serializeGameState(state)); return state; };
  const admit = (count = 4) => {
    const ids: string[] = [];
    for (let index = 0; index < count; index++) {
      const accepted = state.serviceOperations;
      state.serviceOperations = [];
      const id = startServiceOperation(state, "income.endoscopy", "visitor", PROTOTYPE_DOMAIN_CONTEXT);
      state.serviceOperations = [...accepted, ...state.serviceOperations];
      if (!id) throw new Error("Owner QA endoscopy admission failed.");
      ids.push(id);
    }
    return ids;
  };
  return { get state() { return state; }, rileyId, blakeId, advance, reload, admit };
}

export function ownerCoverageTask(targetId?: string): NonNullable<EmployeeState["facilityTask"]> {
  return { kind: "cover_periop", startedAtFacilityTick: 9340, workMinutesRemaining: 9007199254737433,
    ...(targetId ? { targetId } : {}) };
}

export const ownerBlake = (state: GameState) => state.employees.find((employee) => employee.displayName === "Blake")!;
