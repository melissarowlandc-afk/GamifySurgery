import type { GridPoint } from "@gamify-surgery/game-domain";
import type {
  DescribeCharacterRequest, FacilityCharacterRef, FacilityDoorView,
  FacilityFounderChairView, FacilityRoomView, FacilityViewModel,
} from "../../facility/types";

export type MobileMapSelection =
  | { kind: "character"; character: FacilityCharacterRef; name: string; role: string; activity: string;
      patient: { id: string; name: string; status: string } | null;
      praise: { employeeId: string; eligible: boolean } | null }
  | { kind: "room"; room: FacilityRoomView; destination: GridPoint | null; status: string; moveAccepted?: boolean;
      upgrade: { level: number; maximum: number; available: boolean; affordable: boolean } }
  | { kind: "door"; door: FacilityDoorView; room: FacilityRoomView }
  | { kind: "chair"; chair: FacilityFounderChairView; name: string }
  | { kind: "front-desk"; roomId: string }
  | { kind: "floor"; destination: GridPoint; accepted: boolean }
  | { kind: "environment"; action: "collect-litter" | "refill-water"; id?: string; name: string; status: string };

export type MobileInspectorSelection = Extract<MobileMapSelection, { kind: "character" | "room" | "door" }>;

/** The canonical desktop description remains the authority for activity/patient prose. */
export function describeMobileCharacter(character: FacilityCharacterRef, model: FacilityViewModel,
  describe?: DescribeCharacterRequest, praiseAvailable = false): Extract<MobileMapSelection, { kind: "character" }> | null {
  const description = describe?.(character);
  const employee = character.kind === "staff" ? model.staff.find((member) => member.instanceId === character.id) : undefined;
  const patient = character.kind === "patient" ? model.patients?.find((person) => person.instanceId === character.id) : undefined;
  if (!description && !employee && !patient && character.kind !== "founder") return null;
  const role = employee?.roleDisplayName ?? ({ founder: "Founder", patient: "Patient", "service-visitor": "Visitor",
    "retail-visitor": "Shopper", companion: "Companion", ambient: "Passerby", staff: "Employee" }[character.kind]);
  return {
    kind: "character", character, role,
    name: description?.name ?? employee?.displayName ?? patient?.displayName ?? model.founder.displayName,
    activity: description?.activity ?? (character.kind === "founder" ? model.founder.activityLabel ?? "Standing by" : patient?.status ?? ""),
    patient: patient ? { id: patient.instanceId, name: patient.displayName, status: patient.status } : null,
    // Matches the desktop action's availability; the session still guards execution.
    praise: employee ? { employeeId: employee.instanceId, eligible: praiseAvailable } : null,
  };
}

export function describeMobileRoom(room: FacilityRoomView, destination: GridPoint | null): Extract<MobileMapSelection, { kind: "room" }> {
  return { kind: "room", room, destination,
    status: room.accessProblem ? "No access yet" : "Connected to the clinic",
    upgrade: { level: room.upgradeLevel ?? 1, maximum: room.upgradeMaxLevel ?? 1,
      available: Boolean(room.upgradeAvailable), affordable: Boolean(room.upgradeAffordable) } };
}

/** Refresh a retained selection from the latest projection, closing vanished targets. */
export function refreshMobileSelection(selection: MobileMapSelection, model: FacilityViewModel,
  describe?: DescribeCharacterRequest, praiseAvailable = false): MobileMapSelection | null {
  if (selection.kind === "character") return describeMobileCharacter(selection.character, model, describe, praiseAvailable);
  if (selection.kind === "room") {
    const room = model.rooms.find((candidate) => candidate.instanceId === selection.room.instanceId);
    return room ? describeMobileRoom(room, selection.destination) : null;
  }
  if (selection.kind === "chair") {
    const chair = model.founderChairs?.find((candidate) => candidate.roomInstanceId === selection.chair.roomInstanceId &&
      candidate.location.x === selection.chair.location.x && candidate.location.y === selection.chair.location.y &&
      candidate.seatId === selection.chair.seatId);
    return chair ? { ...selection, chair } : null;
  }
  if (selection.kind === "door") {
    const door = model.doors?.find((candidate) => candidate.instanceId === selection.door.instanceId);
    const room = model.rooms.find((candidate) => candidate.instanceId === selection.room.instanceId);
    return door && room ? { ...selection, door, room } : null;
  }
  return selection;
}
