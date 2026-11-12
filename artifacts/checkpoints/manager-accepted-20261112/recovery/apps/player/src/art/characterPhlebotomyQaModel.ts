import type { PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import { resolveApprovedRoomActorSupports, type ApprovedActorSupport, type ApprovedRoomDrawRecord } from "../facility/approvedRoomPresentation";
import { roomThumbnailModel } from "../facility/roomThumbnailCapture";
import type { FacilityViewModel } from "../facility/types";
import before from "./characterPhlebotomyQa.before.json";

export type PhlebotomyQaVersion = "before" | "after";
export type PhlebotomyQaState = "active" | "idle" | "standing" | "wide-patient";
export const PHLEBOTOMY_QA_VIEWPORT = { width: 728, height: 700 } as const;
export const PHLEBOTOMY_QA_ZOOMS = [.1, .5, .7, 1, 1.6, 2.5] as const;
export const PHLEBOTOMY_QA_STATES: readonly PhlebotomyQaState[] = ["active", "idle", "standing", "wide-patient"];
export const phlebotomyQaAppearance = (stillId: string): PixelAppearanceDescriptor => ({
  version: "pixel-avatar.v1", stillId, roleStyle: stillId.startsWith("founder.") ? "founder" : "patient",
  bodyShape: "average", hairStyle: "short", hairShade: 0, faceStyle: "round", outfitStyle: "plain", outfitShade: 0, accessory: "none",
});

/** Frozen presentation data only, never a campaign/simulation fixture. */
export function phlebotomyQaProof(orientation: 0 | 270) {
  const view = before.views.find(view => view.orientation === orientation)!;
  return { records: view.records as unknown as readonly ApprovedRoomDrawRecord[], supports: view.supports as unknown as readonly ApprovedActorSupport[] };
}

export function phlebotomyQaModel(
  orientation: 0 | 270,
  version: PhlebotomyQaVersion,
  state: PhlebotomyQaState,
): FacilityViewModel {
  const model = roomThumbnailModel("room.phlebotomy");
  const room = model.rooms[0]!;
  room.orientation = orientation;
  // FacilityScene consumes the projected footprint, just like the live view
  // model. Its orientedSize() deliberately does not rotate dimensions again.
  if (orientation === 270) [room.width, room.height] = [room.height, room.width];
  // Model a full-sized clinic while sampling the actual camera calculation.
  // The isolated renderer then crops only this room and its founder reference.
  model.gridColumns = 32; model.gridRows = 20;
  const width = room.width;
  model.founder = { displayName: "Founder reference", appearance: phlebotomyQaAppearance("founder.14"), location: { x: width + 1.5, y: 2 }, direction: "front" };
  const supports = version === "before" ? phlebotomyQaProof(orientation).supports : resolveApprovedRoomActorSupports(room.definitionId, orientation);
  const patient = supports.find(s => s.role === "phlebotomy-patient")!;
  const clinician = supports.find(s => s.role === "phlebotomy-clinician")!;
  const patientId = state === "wide-patient" ? "patient-gapfill-v6a.015" : "patient.adult.001";
  model.patients = [{ instanceId: "phlebotomy-patient", displayName: patientId, appearance: phlebotomyQaAppearance(patientId), status: "active", location: patient.ground,
    seated: true, pose: "seated", direction: "front", moving: false, supportRole: patient.role, supportId: patient.id }];
  model.staff = [{ instanceId: "phlebotomist", displayName: "Phlebotomist", roleDisplayName: "Phlebotomist", staffRoleDefinitionId: "staff.phlebotomist",
    homeRoomInstanceId: room.instanceId, appearance: phlebotomyQaAppearance("gs022-new-employee-015"), direction: "side", moving: false,
    location: state === "standing" ? { x: clinician.ground.x - .5, y: clinician.ground.y - .72 } : clinician.ground,
    ...(state === "standing" ? {} : { supportRoomInstanceId: room.instanceId, supportRole: state === "idle" ? "staff-idle" as const : clinician.role,
      supportId: state === "idle" ? "phlebotomy:stool" : clinician.id }),
  }];
  return model;
}
