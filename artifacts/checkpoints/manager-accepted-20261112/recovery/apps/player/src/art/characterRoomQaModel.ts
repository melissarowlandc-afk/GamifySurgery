import { PROTOTYPE_DOMAIN_CONTEXT, type PixelAppearanceDescriptor } from "@gamify-surgery/game-domain";
import { getApprovedRoomPresentation, resolveApprovedRoomActorSupports } from "../facility/approvedRoomPresentation";
import { roomThumbnailModel } from "../facility/roomThumbnailCapture";
import type { FacilityPatientView, FacilityStaffView, FacilityViewModel } from "../facility/types";
import { getAllCharacterStillEntries } from "./characterStillRegistry";

export interface CharacterRoomQaCase { id: string; room: string; orientation: 0 | 270; tier: number; covered: boolean; alternate?: "seated-regression" | "mri-approach" }
const entries = getAllCharacterStillEntries();
export function qaCharacterAppearance(stillId: string): PixelAppearanceDescriptor {
  return { version: "pixel-avatar.v1", stillId, roleStyle: stillId.startsWith("founder.") ? "founder" : "patient", bodyShape: "average", hairStyle: "short", hairShade: 0, faceStyle: "round", outfitStyle: "plain", outfitShade: 0, accessory: "none" };
}
export function characterRoomQaCases(): CharacterRoomQaCase[] {
  const cases: CharacterRoomQaCase[] = [];
  for (const definition of PROTOTYPE_DOMAIN_CONTEXT.balanceRelease.facility.roomDefinitions.filter(d => d.buildable)) {
    const presentation = getApprovedRoomPresentation(definition.id);
    if (!presentation) continue;
    const tiers = definition.unlockFacilityLevel === 5 ? Array.from({ length: definition.maximumUpgradeLevel }, (_, i) => i + 1) : [1];
    for (const orientation of presentation.orientations) for (const tier of tiers) {
      if (orientation.runtimeOrientation !== 0 && orientation.runtimeOrientation !== 270) continue;
      for (const covered of presentation.variantPolicy ? [false, true] : [false]) cases.push({ id: `${definition.id}-${orientation.runtimeOrientation}-t${tier}-${covered ? "covered" : "occupied"}`, room: definition.id, orientation: orientation.runtimeOrientation, tier, covered });
    }
  }
  cases.push({ id: "room.waiting-0-t1-seated-regression", room: "room.waiting", orientation: 0, tier: 1, covered: false, alternate: "seated-regression" });
  cases.push({ id: "room.mri-0-t1-approach", room: "room.mri", orientation: 0, tier: 1, covered: false, alternate: "mri-approach" });
  return cases;
}

/** Presentation fixtures only: no engine/session/case, reservation or route is
 * created. Contacts come from the same approved room supports as live play. */
export function characterRoomQaModel(job: CharacterRoomQaCase): FacilityViewModel {
  const model = roomThumbnailModel(job.room, job.tier);
  const room = model.rooms[0]!;
  room.orientation = job.orientation;
  const size = job.orientation === 270 ? { width: room.height, height: room.width } : room;
  model.facilityTitle = "Occupied character QA";
  model.gridColumns = size.width + 6; model.gridRows = Math.max(size.height, 4) + 3;
  model.founder = { displayName: "Founder reference", appearance: qaCharacterAppearance("founder.14"), location: { x: size.width + 1.5, y: 2 }, direction: "front" };
  const patients: FacilityPatientView[] = [], staff: FacilityStaffView[] = [];
  const supports = resolveApprovedRoomActorSupports(job.room, job.orientation, job.tier);
  const staffRoles: Record<string, string> = { "front-desk-staff": "staff.receptionist", "examination-clinician": "staff.app", "minor-procedure-clinician": "staff.app", "pediatric-examination-clinician": "staff.app", "wound-ostomy-clinician": "staff.periop_nurse", "ultrasound-clinician": "staff.imaging_technician", "ct-operator": "staff.imaging_technician", "mri-operator": "staff.imaging_technician", "phlebotomy-clinician": "staff.phlebotomist", "endoscopy-provider": "staff.endoscopist", "endoscopy-nurse": "staff.endoscopy_nurse", "ambulatory-or-surgeon": "staff.surgeon", "ambulatory-or-nurse": "staff.periop_nurse", "reading-radiologist": "staff.radiologist", "laboratory-technician": "staff.laboratory_technician", pharmacist: "staff.pharmacist", "repair-person": "staff.repair_person", "glp1-np-station-1": "staff.glp1_np", "glp1-np-station-2": "staff.glp1_np" };
  for (const [index, support] of supports.entries()) {
    if (support.role === "mri-patient" && (job.alternate === "mri-approach" ? support.pose !== "standing" : support.pose === "standing")) continue;
    const child = support.role === "pediatric-examination-patient" || support.seatType === "kid-stool" || (support.allowedActors?.includes("child") && !support.allowedActors.includes("parent"));
    const role = staffRoles[support.role];
    const isStaff = Boolean(role) || /clinician|employee|operator|np-station|surgeon-office|gym-/.test(support.role);
    const identity = child ? "level3-roster-v2.021" : isStaff
      ? entries.find(e => role && (e.role === role || e.eligibleStaffRoleDefinitionIds?.includes(role)))?.id ?? "gs022-new-employee-004"
      : job.alternate === "seated-regression" ? ["gs022-new-person-003", "patient.adult.040", "patient-gapfill-v6a.001", "staff-gapfill-v6d.005"][index % 4]!
      : ["patient.adult.001", "gs022-new-person-003", "patient-gapfill-v6a.001", "patient-women20-v3.001"][index % 4]!;
    const location = { x: Math.min(size.width - .1, Math.max(.1, support.ground.x)), y: Math.min(size.height - .1, Math.max(.1, support.ground.y)) };
    const common = { instanceId: `qa-${index}`, displayName: identity, appearance: qaCharacterAppearance(identity), location, moving: false, direction: "front" as const, supportRole: support.role, supportId: support.id };
    if (isStaff) staff.push({ ...common, staffRoleDefinitionId: role, roleDisplayName: support.role, homeRoomInstanceId: room.instanceId, supportRoomInstanceId: room.instanceId });
    else patients.push({ ...common, status: "active", seated: support.pose === "seated", ...(support.pose !== "standing" ? { pose: support.pose } : {}) });
  }
  // X-ray uses floor contacts, not an occupied fixture crop or a seat support.
  if (job.room === "room.xray") {
    patients.push({ instanceId: "qa-xray-patient", displayName: "X-ray patient", appearance: qaCharacterAppearance("gs022-new-person-003"), status: "active", location: { x: 1, y: 1.13 }, direction: "front" });
    staff.push({ instanceId: "qa-xray-tech", displayName: "X-ray technician", roleDisplayName: "Imaging technician", staffRoleDefinitionId: "staff.imaging_technician", homeRoomInstanceId: room.instanceId, appearance: qaCharacterAppearance("gs022-new-employee-004"), location: { x: 2, y: 1.13 }, direction: "front" });
  }
  model.staff = staff; model.patients = patients;
  if (job.room === "room.endoscopy" || job.room === "room.ambulatory_or") model.endoscopyOccupancy = { roomInstanceIds: job.covered ? [room.instanceId] : [], patientInstanceIds: [], serviceVisitorInstanceIds: [] };
  if (["room.xray", "room.ct", "room.mri"].includes(job.room)) model.imagingActiveRoomInstanceIds = [room.instanceId];
  return model;
}
