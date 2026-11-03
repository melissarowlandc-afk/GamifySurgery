import type { FacilityServiceVisitorView, FacilityViewModel } from "./types";

/** Domain endpoints determine occupancy; animation must arrive before sitting. */
export function serviceVisitorWaitingSupport(
  facility: Pick<FacilityViewModel, "rooms" | "founderChairs">,
  visitor: Pick<FacilityServiceVisitorView, "location" | "moving" | "supportRole">,
) {
  if (visitor.moving || visitor.supportRole || !visitor.location) return undefined;
  const chair = facility.founderChairs?.find((candidate) => candidate.kind === "waiting" &&
    candidate.location.x === visitor.location!.x && candidate.location.y === visitor.location!.y &&
    facility.rooms.some((room) => room.instanceId === candidate.roomInstanceId && room.definitionId === "room.waiting"));
  return chair ? { supportRole: "waiting-seat" as const, supportRoomInstanceId: chair.roomInstanceId } : undefined;
}
