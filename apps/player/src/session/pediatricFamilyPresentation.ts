import { pediatricFamilyForActor, type GameState, type GridPoint } from "@gamify-surgery/game-domain";
import type { FacilityActorSupportRole } from "../facility/types";

export function pediatricActorSupport(state: GameState, kind: "encounter" | "service_visitor" | "companion", id: string,
  location: GridPoint | null | undefined, moving: boolean) {
  const family = pediatricFamilyForActor(state, kind, id);
  const checkpoint = family?.procedureFlow?.parentCheckpoint;
  if (kind === "companion" && checkpoint && location && !moving &&
      checkpoint.location.x === location.x && checkpoint.location.y === location.y) {
    // The scene validates this exact point against the live visible chairs;
    // standing checkpoints never acquire a chair merely by being nearby.
    return {supportRoomInstanceId: checkpoint.roomInstanceId};
  }
  if (family?.procedureFlow && kind !== "companion" && location && !moving) {
    const source = state.serviceOperations.find(operation => operation.id === family.procedureFlow!.serviceOperationId);
    const phase = source?.frozenOperationPhases?.[source.phaseIndex];
    const endpoint = source?.path.at(-1);
    const roomId = source?.reservedRoomInstanceIds[0] ?? source?.transitionHeldRoomInstanceIds?.[0];
    if (source && roomId && ["in_service", "waiting_for_next_phase"].includes(source.status) &&
        source.pathIndex >= source.path.length - 1 && endpoint?.x === location.x && endpoint.y === location.y &&
        source.location?.x === location.x && source.location.y === location.y &&
        ["room.endoscopy", "room.ambulatory_or"].includes(phase?.roomDefinitionId ?? "")) return {
      pose: "exam-table" as const, seated: false, supportRole: "procedure-table-patient" as const,
      supportId: "procedure-table:patient", supportRoomInstanceId: roomId,
    };
  }
  const reservation = family?.reservation;
  if (!reservation || !location || moving) return {};
  const parent = kind === "companion";
  const target = parent ? reservation.parentLocation : reservation.childLocation;
  const supportId = parent ? reservation.parentSeatId : reservation.childSeatId;
  if (!supportId || target.x !== location.x || target.y !== location.y) return {};
  const room = state.rooms.find(row => row.id === reservation.roomInstanceId);
  let supportRole: FacilityActorSupportRole | undefined;
  if (room?.roomDefinitionId === "room.pediatric_waiting") supportRole = "pediatric-waiting-seat";
  else if (room?.roomDefinitionId === "room.pediatric_examination") supportRole = parent ? "pediatric-parent-seat" : "pediatric-examination-patient";
  else if (room?.roomDefinitionId === "room.waiting") supportRole = "waiting-seat";
  else if (room?.roomDefinitionId === "room.front_desk") supportRole = "front-desk-public";
  return supportRole ? { supportRole, ...(room?.roomDefinitionId.startsWith("room.pediatric") ? { supportId } : {}),
    supportRoomInstanceId: reservation.roomInstanceId, seated: true, pose: "seated" as const } : {};
}
