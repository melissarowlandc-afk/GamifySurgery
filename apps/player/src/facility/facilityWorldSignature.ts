import type { FacilityViewModel } from "./types";

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
): string {
  const placement = model.placement;
  const rooms = model.rooms
    .map(
      (room) =>
        `${room.instanceId}:${room.definitionId}:${room.displayName}:${room.kind ?? "room"}:${room.isFounderRoom ? 1 : 0}:${room.tileX},${room.tileY},${room.width},${room.height},${room.orientation ?? 0},${room.doorSide ?? "-"},${room.upgradeLevel ?? 1},${room.upgradeAvailable ? 1 : 0},${room.cleanliness ?? 100}`,
    )
    .join("|");
  const doors = (model.doors ?? [])
    .map(
      (door) =>
        `${door.instanceId}:${door.roomInstanceId}:${door.side}:${door.offset}:${door.exterior ? 1 : 0}`,
    )
    .join("|");
  const doorSlots = (
    model.buildDoorSlots ??
    model.eligibleDoorSlots ??
    []
  )
    .map(
      (slot) =>
        `${slot.roomInstanceId}:${slot.side}:${slot.offset}:${slot.enabled === false ? 0 : 1}`,
    )
    .join("|");
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

  return [
    model.buildMode ? 1 : 0,
    model.buildDoorTool ?? "-",
    doorSlots,
    positiveGridSize(model.gridColumns, 16),
    positiveGridSize(model.gridRows, 10),
    placement
      ? `${placement.definitionId}:${placement.width}x${placement.height}:${placement.orientation ?? 0}:${placement.doorSide ?? "inferred"}`
      : "-",
    rooms,
    doors,
    environment,
    model.selectedRoomInstanceId ?? "-",
    model.camera
      ? `${model.camera.zoom},${model.camera.panX},${model.camera.panY}`
      : "camera.default",
  ].join(":");
}
