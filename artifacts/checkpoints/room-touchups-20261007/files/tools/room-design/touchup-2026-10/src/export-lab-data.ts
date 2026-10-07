// Read-only export of the game's approved room data for the touch-up lab.
// Imports game modules directly so the lab renders exactly what the game renders.
import {
  APPROVED_ROOM_PRESENTATIONS,
  resolveApprovedRoomDrawRecords,
  resolveApprovedRoomProceduralDrawRecords,
  resolveApprovedRoomActorSupports,
  getApprovedRoomProofCapture,
} from "../../../../apps/player/src/facility/approvedRoomPresentation";
import { getApprovedFloorPrimitives, getApprovedProceduralScreenRect } from "../../../../apps/player/src/facility/approvedRoomRenderer";
import { APPROVED_GS015_ROOM_ATLASES } from "../../../../apps/player/src/art/bitmapAssetManifest";
import { APPROVED_ROOM_NAVIGATION_CONTRACTS } from "../../../../packages/balance-config/src/approved-room-layouts";
import { CHARACTER_STILL_WIDTH_IN_TILES } from "../../../../apps/player/src/facility/characterPresentation";
import { CHARACTER_STILL_VISIBLE_HEIGHT_CAP } from "../../../../apps/player/src/art/characterBitmapArt";
import stillRegistry from "../../../../apps/player/src/art/characterStillRegistry.generated.json";

const LAB_CHARACTERS = ["founder.01", "gs026-employee-001", "patient.adult.001", "patient.adult.007", "level3-roster-v2.003", "gs026-employee-004", "level3-roster-v2.021", "level3-roster-v2.025"];

export function exportLabData() {
  const rooms = APPROVED_ROOM_PRESENTATIONS.map((room) => {
    const orientation = room.orientations.find((o) => o.runtimeOrientation === 0)!;
    const [w, h] = orientation.footprint;
    const capture = getApprovedRoomProofCapture(room.roomDefinitionId, 0);
    let supports: unknown = [];
    try { supports = (resolveApprovedRoomActorSupports as any)(room.roomDefinitionId, 0); } catch (e) { supports = { error: String(e) }; }
    const procedural = resolveApprovedRoomProceduralDrawRecords(room.roomDefinitionId, 0).map((p) => ({
      ...p, screenRect: getApprovedProceduralScreenRect(p, room.shell.tilePixels),
    }));
    return {
      proofId: room.proofId,
      definitionId: room.roomDefinitionId,
      footprint: [w, h],
      shell: room.shell,
      fixtures: room.fixtures,
      records: resolveApprovedRoomDrawRecords(room.roomDefinitionId, 0),
      procedural,
      supports,
      floor: getApprovedFloorPrimitives(room.shell, w, h, capture?.coordinateSpace.floorOriginPixels),
    };
  });
  const atlases = Object.fromEntries(APPROVED_GS015_ROOM_ATLASES.map((a: any) => [a.id, { path: a.path ?? a.src ?? a.url ?? a.relativePath, width: a.width, height: a.height, raw: a }]));
  const characters = (stillRegistry as any).characters.filter((c: any) => LAB_CHARACTERS.includes(c.id));
  return {
    rooms, atlases, navigation: APPROVED_ROOM_NAVIGATION_CONTRACTS, characters,
    characterMetrics: { widthInTiles: CHARACTER_STILL_WIDTH_IN_TILES, visibleHeightCap: CHARACTER_STILL_VISIBLE_HEIGHT_CAP },
  };
}
