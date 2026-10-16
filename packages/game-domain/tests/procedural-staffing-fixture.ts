import { gameReducer, getRoomDefinition, getRotatedFootprint, isRoomOperationalForFacilityWork, PROTOTYPE_DOMAIN_CONTEXT, startServiceOperation, validateDoorPlacement,
  type GameState, type RoomOrientation } from "../src";
import { periopFlowFixture } from "./periop-nurse-flow-fixture";

/** Shipped geometry, legal public hallways, normal hires and real service
 * visitors. Additional accepted arrivals isolate staffing from cadence caps.
 */
export function proceduralStaffingFixture(surgery = false, orientation: RoomOrientation = 0) {
  let state = periopFlowFixture(2, 3, { amenities: true, surgery }).state;
  let sequence = 0;
  const room = (id: string, definition: string, x: number, y: number, rotation: RoomOrientation = 0) =>
    state.rooms.push({ id, roomDefinitionId: definition, x, y, orientation: rotation, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
  const hall = (x: number, y: number) => {
    if (!state.rooms.some((entry) => entry.x === x && entry.y === y)) room(`staffing.hall.${x}.${y}`, "room.hallway", x, y);
  };
  room("staffing.endoscopy.1", "room.endoscopy", 44, 23, orientation);
  for (let x = 38; x <= 43; x++) hall(x, 22);
  for (let y = 23; y <= 25; y++) hall(43, y);
  state.doors.push({ id: "staffing.endoscopy.1.west", roomId: "staffing.endoscopy.1", side: "west", offset: 1, exterior: false });
  if (surgery) {
    room("staffing.or.1", "room.ambulatory_or", 44, 17);
    for (let y = 17; y <= 21; y++) hall(43, y);
    state.doors.push({ id: "staffing.or.1.west", roomId: "staffing.or.1", side: "west", offset: 1, exterior: false });
  }
  const occupied = new Set<string>();
  for (const placed of state.rooms) {
    const size = getRotatedFootprint(getRoomDefinition(placed.roomDefinitionId)!, placed.orientation);
    for (let y = placed.y; y < placed.y + size.height; y++) for (let x = placed.x; x < placed.x + size.width; x++) {
      const key = `${x},${y}`;
      if (occupied.has(key)) throw new Error(`Fixture overlap at ${key}: ${placed.id}`);
      occupied.add(key);
    }
  }
  const facility = PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility;
  for (const door of state.doors) {
    const validation = validateDoorPlacement(door, state.rooms, state.doors.filter((entry) => entry.id !== door.id), getRoomDefinition,
      facility.gridWidth, facility.gridHeight, new Set(facility.protectedRoomDefinitionIds));
    if (!validation.valid) throw new Error(`Fixture door ${door.id}: ${JSON.stringify(validation)}`);
  }
  const dispatch = (command: Parameters<typeof gameReducer>[1]) => { state = gameReducer(state, command); return state; };
  const advance = (minutes = 1) => {
    for (let index = 0; index < minutes; index++) dispatch({ type: "ADVANCE_TICK", operationId: `staffing.tick.${sequence++}` });
    return state;
  };
  for (const role of ["staff.endoscopy_nurse", "staff.endoscopist", ...(surgery ? ["staff.or_nurse", "staff.surgeon"] : [])]) {
    dispatch({ type: "HIRE_STAFF", operationId: `staffing.hire.${sequence++}`, employeeId: `staffing.employee.${role}`, staffRoleDefinitionId: role });
    const employee = state.employees.find((entry) => entry.id === `staffing.employee.${role}`);
    if (!employee) throw new Error(`Hire failed: ${role}: ${JSON.stringify(state.operationReceipts[`staffing.hire.${sequence - 1}`])}, level ${state.facilityLevel}`);
    employee.morale = 100;
    state.retailNextOpportunityTicks[`employee:${employee.id}`] = Number.MAX_SAFE_INTEGER;
  }
  advance(50);
  state.environment.founderActivity = null;
  for (const id of ["qa.endoscopy.0", "staffing.endoscopy.1", ...(surgery ? ["qa.or", "staffing.or.1", "qa.surgeon-office"] : [])]) {
    if (!isRoomOperationalForFacilityWork(state, id)) throw new Error(`Nonoperational fixture room ${id}`);
  }
  const admit = (count = 2) => {
    const ids: string[] = [];
    for (let index = 0; index < count; index++) {
      const previous = state.serviceOperations;
      state.serviceOperations = [];
      const id = startServiceOperation(state, surgery ? "income.ambulatory_operation" : "income.endoscopy", "visitor", PROTOTYPE_DOMAIN_CONTEXT);
      state.serviceOperations = [...previous, ...state.serviceOperations];
      if (!id) throw new Error("Procedure visitor not accepted");
      ids.push(id);
      advance(2);
    }
    return ids;
  };
  return { get state(): GameState { return state; }, advance, admit, dispatch };
}
