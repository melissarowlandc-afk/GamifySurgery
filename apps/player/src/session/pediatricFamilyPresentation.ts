import { pediatricFamilyForActor, type GameState, type GridPoint } from "@gamify-surgery/game-domain";
import type { FacilityActorSupportRole } from "../facility/types";

export function pediatricActorSupport(state: GameState, kind: "encounter" | "service_visitor" | "companion", id: string,
  location: GridPoint | null | undefined, moving: boolean) {
  const family = pediatricFamilyForActor(state, kind, id);
  if (family?.procedureFlow && kind !== "companion" && location && !moving) {
    const source = state.serviceOperations.find(operation => operation.id === family.procedureFlow!.serviceOperationId);
    const phase = source?.frozenOperationPhases?.[source.phaseIndex];
    if (source && ["in_service", "waiting_for_next_phase"].includes(source.status) &&
        ["room.endoscopy", "room.ambulatory_or"].includes(phase?.roomDefinitionId ?? "")) return {pose: "exam-table" as const, seated: false};
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
