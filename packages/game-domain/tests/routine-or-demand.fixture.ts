import {
  createInitialGameState, deserializeGameState, gameReducer, getRoomDefinition,
  getRoomNavigationAnchor, PROTOTYPE_DOMAIN_CONTEXT, serializeGameState,
  type GameCommand, type GameState,
} from "../src";
import { periopFlowFixture } from "./periop-nurse-flow-fixture";

/** Normal hires and shipped care geometry. Only unrelated demand/expenses and
 * random distractions are suppressed; OR demand and every care phase tick. */
export function routineOrFixture(initialState?: GameState) {
  let state: GameState;
  if (initialState) state = initialState;
  else {
    state = structuredClone(periopFlowFixture(2, 3, { surgery: true }).state);
    const removed = new Set(state.rooms.filter(room => room.roomDefinitionId === "room.endoscopy").map(room => room.id));
    state.rooms = state.rooms.filter(room => !removed.has(room.id));
    state.doors = state.doors.filter(door => !removed.has(door.roomId));
    state.employees = state.employees.filter(employee => !["staff.endoscopist", "staff.endoscopy_nurse"].includes(employee.staffRoleDefinitionId));
    state.rooms.push({ id: "routine.or.waiting", roomDefinitionId: "room.waiting", x: 38, y: 22,
      orientation: 0, doorSide: null, upgradeLevel: 1, cleanliness: 100 });
    state.doors.push({ id: "routine.or.waiting.west", roomId: "routine.or.waiting", side: "west", offset: 1, exterior: false });
    state.serviceAppointmentsEnabled = true;
  }
  let sequence = 0;
  const dispatch = (command: GameCommand) => { state = gameReducer(state, command, PROTOTYPE_DOMAIN_CONTEXT); return state; };
  const advance = (minutes = 1) => {
    for (let i = 0; i < minutes; i++) dispatch({ type: "ADVANCE_TICK", operationId: `routine.or.tick.${state.facilityTick}.${sequence++}`, advancedAtRealMs: state.createdAtRealMs + 1_000 });
    return state;
  };
  const reload = () => { state = deserializeGameState(serializeGameState(state), PROTOTYPE_DOMAIN_CONTEXT); return state; };
  const addEncounter = () => {
    const sample = structuredClone(Object.values(createInitialGameState().encounters)[0]!);
    const exam = state.rooms.find(room => room.roomDefinitionId === "room.examination")!;
    Object.assign(sample, { id: "routine.or.encounter", checkInStatus: "checked_in", lifecycle: "resolved",
      resolutionReason: "completed", resolvedAtFacilityTick: state.facilityTick,
      patientLocation: getRoomNavigationAnchor(exam, getRoomDefinition(exam.roomDefinitionId)!),
      patientMovement: null, assignedRoomInstanceId: exam.id, queuedCareRoomInstanceId: null, waitingDestination: null, pendingResult: null });
    state.encounters[sample.id] = sample;
    return sample;
  };
  return { get state() { return state; }, advance, dispatch, reload, addEncounter };
}

export type RoutineOrClinic = ReturnType<typeof routineOrFixture>;
export function advanceRoutineOrUntil(clinic: RoutineOrClinic, predicate: (state: GameState) => boolean, maximum = 800) {
  for (let i = 0; i < maximum && !predicate(clinic.state); i++) clinic.advance();
  if (!predicate(clinic.state)) throw new Error(`Routine OR condition not reached after ${maximum} normal minutes`);
  return clinic.state;
}
