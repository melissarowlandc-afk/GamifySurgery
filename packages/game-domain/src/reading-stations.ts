import { DIAGNOSTIC_READING_WORKSTATIONS, type DiagnosticReadingWorkstation } from "@gamify-surgery/balance-config";
import { rotateRoomLocalPoint } from "./spatial";
import type { DomainContext, EmployeeState, GameState, GridPoint } from "./types";

/** Preserve each reader's seat when another reader is hired or dismissed. */
export function reconcileReadingStations(state: GameState): void {
  for (const room of state.rooms.filter((candidate) => candidate.roomDefinitionId === "room.reading")) {
    const readers = state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist" &&
      employee.homeRoomInstanceId === room.id).sort((a, b) => a.id.localeCompare(b.id));
    const occupied = new Set<string>();
    const unassigned: EmployeeState[] = [];
    for (const reader of readers) {
      if (DIAGNOSTIC_READING_WORKSTATIONS.some((station) => station.id === reader.readingStationId) &&
          !occupied.has(reader.readingStationId!)) {
        occupied.add(reader.readingStationId!);
      } else unassigned.push(reader);
    }
    for (const reader of unassigned) {
      const savedResources = [
        ...state.serviceOperations.flatMap((operation) => operation.diagnosticPhaseWork?.resource ? [operation.diagnosticPhaseWork.resource] : []),
        ...Object.values(state.encounters).flatMap((encounter) => [
          encounter.pendingResult?.diagnosticTiming, encounter.testOnlyContinuation?.diagnosticTiming,
          encounter.stagedResultOrder?.diagnosticTiming, encounter.stagedResultOrder?.remainder.diagnosticTiming,
          ...(encounter.stagedResultOrder?.components.map((component) => component.diagnosticTiming) ?? []),
          encounter.terminalTestOrder?.diagnosticTiming,
        ].flatMap((plan) => plan?.phases.flatMap((phase) => phase.resource ? [phase.resource] : []) ?? [])),
      ];
      const prior = savedResources.find((resource) => resource.roomInstanceId === room.id && resource.employeeIds.includes(reader.id) &&
        resource.stationId !== null && !occupied.has(resource.stationId) &&
        DIAGNOSTIC_READING_WORKSTATIONS.some((station) => station.id === resource.stationId));
      const stationId = prior?.stationId ?? DIAGNOSTIC_READING_WORKSTATIONS.find((station) => !occupied.has(station.id))?.id;
      if (stationId) { reader.readingStationId = stationId; occupied.add(stationId); }
      else delete reader.readingStationId;
    }
  }
}

export function getRadiologistReadingStation(
  state: GameState, employee: EmployeeState, context: DomainContext,
): { roomInstanceId: string; station: DiagnosticReadingWorkstation; location: GridPoint } | null {
  if (employee.staffRoleDefinitionId !== "staff.radiologist" || !employee.homeRoomInstanceId) return null;
  const room = state.rooms.find((candidate) => candidate.id === employee.homeRoomInstanceId && candidate.roomDefinitionId === "room.reading");
  const definition = room && context.balanceRelease.facility.roomDefinitions.find((candidate) => candidate.id === room.roomDefinitionId);
  if (!room || !definition) return null;
  let station = DIAGNOSTIC_READING_WORKSTATIONS.find((candidate) => candidate.id === employee.readingStationId);
  if (!station) {
    const readers = state.employees.filter((candidate) => candidate.staffRoleDefinitionId === "staff.radiologist" &&
      candidate.homeRoomInstanceId === room.id).sort((a, b) => a.id.localeCompare(b.id));
    const assigned = new Set(readers.map((candidate) => candidate.readingStationId).filter(Boolean));
    const available = DIAGNOSTIC_READING_WORKSTATIONS.filter((candidate) => !assigned.has(candidate.id));
    station = available[readers.filter((candidate) => !candidate.readingStationId).findIndex((candidate) => candidate.id === employee.id)];
  }
  if (!station) return null;
  const local = rotateRoomLocalPoint(station.staffAnchor, definition, room.orientation);
  return { roomInstanceId: room.id, station, location: { x: room.x + local.x, y: room.y + local.y } };
}

/** Arrival uses the next free seat, while the staff record is created later. */
export function getNextReadingStationLocation(state: GameState, roomId: string, context: DomainContext): GridPoint | null {
  const room = state.rooms.find((candidate) => candidate.id === roomId && candidate.roomDefinitionId === "room.reading");
  const definition = room && context.balanceRelease.facility.roomDefinitions.find((candidate) => candidate.id === room.roomDefinitionId);
  if (!room || !definition) return null;
  const occupied = new Set(state.employees.filter((employee) => employee.staffRoleDefinitionId === "staff.radiologist" &&
    employee.homeRoomInstanceId === room.id).flatMap((employee) => {
      const assignment = getRadiologistReadingStation(state, employee, context);
      return assignment ? [assignment.station.id] : [];
    }));
  const station = DIAGNOSTIC_READING_WORKSTATIONS.find((candidate) => !occupied.has(candidate.id));
  if (!station) return null;
  const local = rotateRoomLocalPoint(station.staffAnchor, definition, room.orientation);
  return { x: room.x + local.x, y: room.y + local.y };
}
