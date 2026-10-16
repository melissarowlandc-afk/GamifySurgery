import type { PatientAmenityTripState } from "@gamify-surgery/game-domain";

export function gardenRestActorSupport(trip: PatientAmenityTripState | null) {
  if (trip?.amenityKind === "garden" && trip.returnBlocked) return { moving: false, path: [{ ...trip.path[trip.pathIndex]! }], pathIndex: 0 };
  return trip?.amenityKind === "garden" && trip.status === "using_amenity" ? {
    supportRole: "garden-visitor-seat" as const, supportId: trip.gardenSeatId,
    supportRoomInstanceId: trip.gardenRoomInstanceId, pose: "seated" as const, seated: true,
  } : {};
}
