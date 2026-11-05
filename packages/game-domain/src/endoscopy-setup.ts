import { getDoorCells } from "./doors";
import { findCareAwareFacilityPath } from "./care-room-access";
import { findRouteFromDisplacedLocationToPoint } from "./displaced-routing";
import { getProcedureStaffStandingSpots, usesApprovedProcedureStaffSpots } from "./procedural-staffing";
import { getRoomDefinition, isEmployeeAssignedToOperationalRoom, isRoomOperationalForFacilityWork } from "./selectors";
import { getRoomCareStations, getRoomNavigationAnchor } from "./spatial";
import type { DomainContext, EmployeeState, GameState, GridPoint, PlacedRoom } from "./types";

/** Installed geometry/coverage, not temporary availability. The generic room
 * graph permits transit through another treatment room; actual care does not.
 * This reads the same endpoints/path rules as the periop-first operation. */
export function getEndoscopySetupAccess(state: GameState, context: DomainContext) {
  const rooms = (id: string) => state.rooms.filter(room => room.roomDefinitionId === id &&
    isRoomOperationalForFacilityWork(state, room.id, context));
  const entrance = state.doors.filter(door => door.exterior).flatMap(door => {
    const room = state.rooms.find(room => room.id === door.roomId && room.roomDefinitionId === "room.front_desk");
    const definition = room && getRoomDefinition(room.roomDefinitionId, context);
    const cells = room && definition && getDoorCells(door, room, definition);
    return cells ? [cells.inside] : [];
  })[0];
  const beds = rooms("room.periop_recovery").flatMap(room => getRoomCareStations(room,
    getRoomDefinition(room.roomDefinitionId, context)!, state.doors, state.rooms,
    id => getRoomDefinition(id, context)).filter(station => station.kind === "periop_bed")
    .filter(station => entrance && findCareAwareFacilityPath(state, context, entrance,
      station.patientAnchor, new Set([room.id])).length > 0)
    .map(station => ({ room, point: station.patientAnchor })));
  const recoveryRoomIds = new Set(beds.map(bed => bed.room.id));
  const roomIssues = new Map<string, string>();
  for (const room of rooms("room.periop_recovery")) if (!recoveryRoomIds.has(room.id)) roomIssues.set(room.id,
    "Connect the Peri-op/Recovery Room to the Front Desk with a continuous hallway and doors. Patients must reach a bed without crossing another treatment room.");
  const procedures = rooms("room.endoscopy").filter(room => {
    const target = getRoomNavigationAnchor(room, getRoomDefinition(room.roomDefinitionId, context)!);
    return beds.some(bed => findRouteFromDisplacedLocationToPoint(state, context, bed.point,
      target, new Set([room.id])).length > 0);
  });
  const procedureRoomIds = new Set(procedures.map(room => room.id));
  for (const room of rooms("room.endoscopy")) if (!procedureRoomIds.has(room.id)) roomIssues.set(room.id,
    "Connect Endoscopy to a reachable Peri-op/Recovery bed with hallway doors. The patient cannot cross an unrelated treatment room.");
  const staffTargets = (room: PlacedRoom, actor: "provider" | "nurse") => {
    const definition = getRoomDefinition(room.roomDefinitionId, context)!;
    return usesApprovedProcedureStaffSpots(room, definition)
      ? getProcedureStaffStandingSpots(room, definition, state.doors, actor).map(spot => spot.anchor)
      : [getRoomNavigationAnchor(room, definition, "staff")];
  };
  const fromHome = (employee: EmployeeState): GridPoint | null => {
    const home = state.rooms.find(room => room.id === employee.homeRoomInstanceId);
    return home && isEmployeeAssignedToOperationalRoom(state, employee.id, context)
      ? getRoomNavigationAnchor(home, getRoomDefinition(home.roomDefinitionId, context)!, "staff") : null;
  };
  const staffCanReach = (employee: EmployeeState, actor: "provider" | "nurse") => {
    const origin = fromHome(employee);
    return origin && procedures.some(room => beds.some(bed => staffTargets(room, actor).some(target =>
      findRouteFromDisplacedLocationToPoint(state, context, origin, target, new Set([room.id, bed.room.id])).length > 0)));
  };
  const endoscopyNurseIds = new Set(state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.endoscopy_nurse" &&
    staffCanReach(employee, "nurse")).map(employee => employee.id));
  const periopNurseIds = new Set(state.employees.filter(employee => {
    if (employee.staffRoleDefinitionId !== "staff.periop_nurse") return false;
    const origin = fromHome(employee);
    return origin && beds.some(bed => findRouteFromDisplacedLocationToPoint(state, context, origin,
      bed.point, new Set([bed.room.id])).length > 0);
  }).map(employee => employee.id));
  const endoscopistIds = new Set(state.employees.filter(employee => employee.staffRoleDefinitionId === "staff.endoscopist" &&
    staffCanReach(employee, "provider")).map(employee => employee.id));
  const founderCanReach = Boolean(entrance && procedures.some(room => beds.some(bed => staffTargets(room, "provider").some(target =>
    findCareAwareFacilityPath(state, context, entrance, target, new Set([room.id, bed.room.id])).length > 0))));
  const providerAccessRoomId = procedures.length > 0 && !endoscopistIds.size && !founderCanReach ? procedures[0]!.id : null;
  return { recoveryRoomIds, procedureRoomIds, endoscopyNurseIds, periopNurseIds, endoscopistIds, founderCanReach, providerAccessRoomId, roomIssues };
}
