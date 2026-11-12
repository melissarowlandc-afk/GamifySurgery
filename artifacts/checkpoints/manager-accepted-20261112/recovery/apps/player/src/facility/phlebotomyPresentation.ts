import type { RoomOrientation } from "@gamify-surgery/game-domain";
import type { ApprovedActorSupport, ApprovedRoomDrawRecord } from "./approvedRoomPresentation";

/** Presentation only. Keep the approved collision/approach data and native
 * atlases intact. The old east contact was on the cushion's front edge, while
 * the south stool put the clinician directly in front of the patient. */
export const PHLEBOTOMY_PRESENTATION = {
  chairScale: .85,
  views: {
    0: {
      chairGround: { x: 1.3, y: 1.08 },
      // Relative to the unchanged 648x748 chair crop: cushion centre.
      chairSeatSource: { x: 324, y: 438 },
      clinicianGround: { x: 2.2, y: 1.34 },
      clinicianFacing: "west",
    },
    270: {
      chairGround: { x: .78, y: 1.5 },
      // Relative to the unchanged 589x807 crop, behind the near armrest.
      // The proof used (539,512), the leading edge rather than the pelvis.
      chairSeatSource: { x: 295, y: 435 },
      clinicianGround: { x: 1.7, y: 1.95 },
      clinicianFacing: "west",
    },
  },
} as const;

const viewFor = (orientation: RoomOrientation) =>
  orientation === 0 || orientation === 270 ? PHLEBOTOMY_PRESENTATION.views[orientation] : undefined;

/** Scale each whole chair crop about its own floor contact, then translate it.
 * The stool retains its original size and is translated with its clinician. */
export function applyPhlebotomyDrawPresentation(
  orientation: RoomOrientation,
  records: readonly ApprovedRoomDrawRecord[],
): readonly ApprovedRoomDrawRecord[] {
  const view = viewFor(orientation);
  if (!view) return records;
  return records.map((record): ApprovedRoomDrawRecord => {
    if (record.id !== "chair" && record.id !== "stool") return record;
    if (!record.sourceFloorContact || !record.worldLocalGround) return record;
    const factor = record.id === "chair" ? PHLEBOTOMY_PRESENTATION.chairScale : 1;
    const ground = record.id === "chair" ? view.chairGround : view.clinicianGround;
    const width = record.renderSizeTiles[0] * factor;
    const height = record.renderSizeTiles[1] * factor;
    return {
      ...record,
      renderSizeTiles: [width, height],
      destinationTopLeftTiles: [
        ground.x - record.sourceFloorContact[0] / record.sourceRect[2] * width,
        ground.y - record.sourceFloorContact[1] / record.sourceRect[3] * height,
      ],
      worldLocalGround: [ground.x, ground.y],
      depthKey: ground.y,
    };
  }).sort((a, b) => a.depthKey - b.depthKey || a.id.localeCompare(b.id));
}

/** Convert the measured cushion pixel through the same transformed draw that
 * paints the chair. No per-identity actor scale or pixel art is changed here. */
export function applyPhlebotomyActorPresentation(
  orientation: RoomOrientation,
  value: ApprovedActorSupport,
  draw: ApprovedRoomDrawRecord,
): ApprovedActorSupport {
  const view = viewFor(orientation);
  if (!view || !draw.sourceFloorContact) return value;
  const patient = value.role === "phlebotomy-patient";
  const sourceSeat = patient ? view.chairSeatSource : {
    x: draw.sourceFloorContact[0] + (value.seat.x - value.ground.x) * draw.sourceRect[2] / draw.renderSizeTiles[0],
    y: draw.sourceFloorContact[1] + (value.seat.y - value.ground.y) * draw.sourceRect[3] / draw.renderSizeTiles[1],
  };
  const ground = patient ? view.chairGround : view.clinicianGround;
  return {
    ...value,
    facing: patient ? value.facing : view.clinicianFacing,
    seat: {
      x: draw.destinationTopLeftTiles[0] + sourceSeat.x / draw.sourceRect[2] * draw.renderSizeTiles[0],
      y: draw.destinationTopLeftTiles[1] + sourceSeat.y / draw.sourceRect[3] * draw.renderSizeTiles[1],
    },
    ground,
    fixtureGround: ground,
  };
}
