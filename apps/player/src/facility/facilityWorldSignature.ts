import type { FacilityViewModel } from "./types";
import { getCleanlinessWearSeverity } from "./environmentPresentation";

function positiveGridSize(value: number, fallback: number): number {
  return Number.isFinite(value) && value > 0 ? Math.floor(value) : fallback;
}

/**
 * Identifies only data that changes the static facility/world layer.
 *
 * Facility time and actor movement deliberately do not participate. Phaser
 * draws characters every frame, so including those values here forced a full
 * room, fixture, and label rebuild at every simulation tick.
 */
export function getFacilityWorldSignature(
  model: FacilityViewModel,
  includeCamera = true,
): string {
  const view = getFacilityWorldSignatures(model);
  return JSON.stringify([view.dimensions, view.grid, view.build, view.doorTools, view.selection, view.placement,
    view.rooms.geometry, view.rooms.appearance, view.rooms.tiers, view.rooms.wear, view.doors.geometry,
    view.environment, view.endoscopy.key, view.imaging.key, includeCamera ? model.camera : undefined]);
}

function getRoomSignatures(rows: FacilityViewModel["rooms"]) {
  const footprints: string[] = [];
  const tiers: string[] = [];
  const wear: string[] = [];
  const appearance = rows.map(room => {
    footprints.push(`${JSON.stringify(room.instanceId)}:${room.definitionId}:${room.kind ?? "room"}:${room.isFounderRoom ? 1 : 0}:${room.doorSide ?? "-"}:${room.tileX},${room.tileY},${room.width},${room.height},${room.orientation ?? 0}`);
    tiers.push(String(room.upgradeLevel ?? 1));
    wear.push(String(getCleanlinessWearSeverity(room.cleanliness)));
    return `${JSON.stringify(room.buildLabel ?? room.displayName)}:${room.upgradeMaxLevel ?? 1}:${room.upgradeAffordable ? 1 : 0}:${room.accessProblem ? 1 : 0}`;
  }).join("|");
  return { rows, appearance, tiers: tiers.join(","), wear: wear.join(","), geometry: footprints.join("|") };
}

function getDoorSignature(rows: FacilityViewModel["doors"]) {
  const geometry = (rows ?? []).map(door =>
    `${JSON.stringify(door.instanceId)}:${JSON.stringify(door.roomInstanceId)}:${door.side}:${door.offset}:${door.exterior ? 1 : 0}:${door.connectionValid ?? "legacy"}:${JSON.stringify(door.adjacentRoomInstanceId) ?? "missing"}:${JSON.stringify(door.blockedReason) ?? "-"}`,
  ).join("|");
  return { rows, geometry };
}

export interface FacilityWorldSignatures {
  rooms: ReturnType<typeof getRoomSignatures>;
  doors: ReturnType<typeof getDoorSignature>;
  dimensions: string;
  grid: boolean;
  build: boolean;
  doorTools: string;
  selection: string | null;
  placement: string;
  environment: string;
  emptyCooler: boolean;
  endoscopy: { ids: readonly string[]; key: string };
  imaging: { ids: readonly string[]; key: string };
}

const noRooms: readonly string[] = [];
function roomMembership(ids: readonly string[], previous?: FacilityWorldSignatures["endoscopy"]) {
  return ids === previous?.ids ? previous : { ids, key: JSON.stringify([...ids].sort()) };
}

/** Share the signature pass with the door index. Published rows are immutable. */
export function getFacilityWorldSignatures(
  model: FacilityViewModel,
  previous?: FacilityWorldSignatures,
): FacilityWorldSignatures {
  const rooms = previous?.rooms.rows === model.rooms ? previous.rooms : getRoomSignatures(model.rooms);
  const doors = previous && previous.doors.rows === model.doors ? previous.doors : getDoorSignature(model.doors);
  const build = Boolean(model.buildMode);
  const tool = build ? model.buildDoorTool : null;
  const doorSlots = tool === "place" ? (
    model.buildDoorSlots ??
    model.eligibleDoorSlots ??
    []
  )
    .map(
      (slot) =>
        `${slot.roomInstanceId}:${slot.side}:${slot.offset}:${slot.enabled === false ? 0 : 1}`,
    )
    .join("|") : "";
  const environment = [
    ...(model.litterItems ?? []).map(
      (item) =>
        `${item.instanceId}:${item.location.x},${item.location.y}:${
          item.highlighted ? 1 : 0
        }`,
    ),
    model.waterCooler
      ? `water:${model.waterCooler.location.x},${
          model.waterCooler.location.y
        }:${model.waterCooler.fillPercent}:${
          model.waterCooler.needsRefill ? 1 : 0
        }:${model.waterCooler.highlighted ? 1 : 0}`
      : "water:-",
  ].join("|");
  return {
    rooms, doors, build, environment,
    dimensions: `${positiveGridSize(model.gridColumns, 16)}:${positiveGridSize(model.gridRows, 10)}`,
    grid: Boolean(build || model.placement),
    doorTools: tool === "place" ? `place:${doorSlots}` : tool ?? "-",
    selection: model.selectedRoomInstanceId ?? null,
    placement: JSON.stringify(model.placement),
    emptyCooler: (model.waterCooler?.fillPercent ?? 100) <= 0,
    endoscopy: roomMembership(model.endoscopyOccupancy?.roomInstanceIds ?? noRooms, previous?.endoscopy),
    imaging: roomMembership(model.imagingActiveRoomInstanceIds ?? noRooms, previous?.imaging),
  };
}
